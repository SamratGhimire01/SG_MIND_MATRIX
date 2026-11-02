#!/usr/bin/env python3
"""SGMM pipeline — `sgmm build` (step 2): one voice take + scenes.json -> final MP4, clean MP4, stems, report.
`sgmm qc` / `sgmm package` (step 3): checks + contact sheet / SRT, 3 thumbnails + vertical cover, posting kit.

  python3 08_templates/engine/sgmm.py build <plan.json> <voice> [--no-chain] [--audio-only] [--lines lines.json] [--name NAME] [--out DIR]
  python3 08_templates/engine/sgmm.py qc <build prefix>                 e.g. 04_video_projects/EP000_matrix_online/export/SGMM_EP000_build_v001
  python3 08_templates/engine/sgmm.py package <build prefix> [--out DIR] (default 09_exports)
  python3 08_templates/engine/sgmm.py preview <plan.json> [--out page.html]  storyboard page (key frames, text, times) for sign-off
  python3 08_templates/engine/sgmm.py selftest

voice split -> re-time to the real voice -> score from the plan (+ its cues, warped with the picture) -> approved crisp+big
voice chain -> per-line automix (voice +15 dB over the background) -> master -14 LUFS / -1.5 dBTP -> render final + clean.
Lines are the plan's captions, in order. Needs ffmpeg, node, numpy. --no-chain: the take is already processed (EP000 v004).
"""
import json, math, os, re, shutil, subprocess, sys, tempfile
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
PRE, POST = .08, .14         # margins cut around each line (from EP000 build_vo.py)
MAX_TEMPO = 1.10             # speed up at most 10%, pitch kept; never cut words
GAP = .15                    # min gap kept between lines when moving one earlier
TAIL_OK = .10                # a line may run this far past its slot (breath / room tail, not words)
CAP_TAIL = .25               # caption stays this long after the voice ends
TARGET, DIP_MIN, DIP_MAX = 15.0, 4.0, 18.0   # automix: voice over background per line (approved v004)
LUFS, TP = -14.0, -1.5


def sh(*a, out=False):
    r = subprocess.run([str(x) for x in a], check=True, capture_output=True)
    return r.stdout if out else None


def load(path, ch=1):
    raw = sh('ffmpeg', '-v', 'error', '-i', path, '-ac', ch, '-ar', SR, '-f', 'f32le', '-', out=True)
    a = np.frombuffer(raw, np.float32).astype(np.float64)
    return a.reshape(-1, ch) if ch > 1 else a


def save(path, a, bits=16):
    a = np.clip(np.asarray(a, np.float64), -1, 1)
    ch = 1 if a.ndim == 1 else a.shape[1]
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ac', str(ch), '-ar', str(SR), '-i', '-', '-c:a', f'pcm_s{bits}le', path], stdin=subprocess.PIPE)
    p.communicate(a.astype('<f8').tobytes())
    assert p.returncode == 0, path


def ffilter(a, flt, ch=1):
    """run a mono/stereo array through an ffmpeg -af / -filter_complex graph ([0:a] ... [o])"""
    with tempfile.TemporaryDirectory() as d:
        i, o = os.path.join(d, 'i.wav'), os.path.join(d, 'o.wav')
        save(i, a, 24)
        args = ['-filter_complex', flt, '-map', '[o]'] if '[o]' in flt else ['-af', flt]
        sh('ffmpeg', '-v', 'error', '-y', '-i', i, *args, '-c:a', 'pcm_f32le', o)
        return load(o, ch)


def db(x):
    return 10 * np.log10(np.mean(np.square(x)) + 1e-12)


# ---------------- 1. voice split ----------------
def speech_runs(v, hop=.01, bridge=.05, shortest=.08):
    """runs of speech (start, end) in seconds: 10 ms frames above a floor-relative threshold"""
    n = int(hop * SR)
    f = 10 * np.log10(np.mean(v[:len(v) // n * n].reshape(-1, n) ** 2, 1) + 1e-12)
    thr = max(np.percentile(f, 10) + 12, np.percentile(f, 95) - 40)
    on = np.r_[False, f > thr, False].astype(int)
    edges = np.flatnonzero(np.diff(on))
    runs = [[a * hop, b * hop] for a, b in zip(edges[::2], edges[1::2])]
    out = []
    for r in runs:
        if out and r[0] - out[-1][1] < bridge: out[-1][1] = r[1]
        else: out.append(r)
    return [tuple(r) for r in out if r[1] - r[0] >= shortest]


def group_runs(runs, sizes):
    """split the speech runs (in order) into len(sizes) consecutive lines; a line's span should be ~ its text length.
    DP over partitions, cost = log(span / expected)^2 — pauses inside a line ("Every shift. Every tool.") stay inside it."""
    M, N = len(runs), len(sizes)
    if M < N: raise SystemExit(f'found {M} speech runs for {N} lines — check the take, or pass --lines')
    rate = sum(b - a for a, b in runs) / sum(sizes)
    INF = float('inf')
    best = [[INF] * (M + 1) for _ in range(N + 1)]; prev = [[0] * (M + 1) for _ in range(N + 1)]
    best[0][0] = 0
    for i in range(1, N + 1):
        for j in range(i, M - (N - i) + 1):
            for k in range(i - 1, j):
                if best[i - 1][k] == INF: continue
                c = best[i - 1][k] + math.log((runs[j - 1][1] - runs[k][0]) / (sizes[i - 1] * rate)) ** 2
                if c < best[i][j]: best[i][j], prev[i][j] = c, k
    lines, j = [], M
    for i in range(N, 0, -1):
        k = prev[i][j]; lines.append((runs[k][0], runs[j - 1][1])); j = k
    return lines[::-1]


# ---------------- 2. re-time the plan to the real voice ----------------
def shift_plan(plan, T, dt):
    """insert dt seconds at plan time T: everything from T on moves later; a scene running across T plays dt longer"""
    for s in plan['scenes']:
        s['t'] = [x + dt if x >= T else x for x in s['t']]
    for k in ('captions', 'act_tags'):
        for c in plan.get(k, []): c['t'] = [x + dt if x >= T else x for x in c['t']]
    plan['silences'] = [[x + dt if x >= T else x for x in w] for w in plan.get('silences', [])]
    plan['duration'] = round(plan['duration'] + dt, 4)


def retime(plan, durs):
    """place each line at its caption start; too long for its slot -> move earlier, then speed up <=10%, then insert time.
    Returns [(start, tempo)] and edits plan (captions follow the voice, `warp` moves the score's cue sheet with the picture)."""
    caps, placed, warp, added = plan['captions'], [], [], 0.0
    for i, d in enumerate(durs):
        t0, t1 = caps[i]['t']
        slot = t1 - t0 + TAIL_OK
        room = t0 - (placed[-1][0] + durs[i - 1] / placed[-1][1] + GAP if placed else 0)
        back = max(0.0, min(d - slot, room)); t0 -= back; slot += back
        tempo = 1.0 if d <= slot else min(MAX_TEMPO, d / slot)
        need = d / tempo - slot
        if need > 1e-6:
            need = round(need + .02, 3)
            shift_plan(plan, t1, need)
            warp.append([round(t1 - added, 4), need]); added += need
        placed.append((round(t0, 4), tempo))
    for i, (t0, tempo) in enumerate(placed):
        end = t0 + durs[i] / tempo + CAP_TAIL
        if i + 1 < len(placed): end = min(end, placed[i + 1][0] - .05)
        caps[i]['t'] = [round(t0, 3), round(end, 3)]
    if warp: plan['warp'] = warp
    return placed


# ---------------- 3–6. voice track, chain, automix, master ----------------
def place(take, cuts, placed, dur):
    out = np.zeros(int(round(dur * SR)) + SR)
    for (a, b), (t0, tempo) in zip(cuts, placed):
        seg = take[max(0, int((a - PRE) * SR)):int((b + POST) * SR)].copy()
        fi, fo = int(.03 * SR), int(.09 * SR)
        seg[:fi] *= np.linspace(0, 1, fi); seg[-fo:] *= np.linspace(1, 0, fo)
        if abs(tempo - 1) > 1e-4: seg = ffilter(seg, f'atempo={tempo:.4f}')
        i0 = int(round((t0 - PRE / tempo) * SR))
        if i0 < 0: seg, i0 = seg[-i0:], 0
        out[i0:i0 + len(seg)] += seg
    return out[:int(round(dur * SR))]


def automix(v, b, be, windows, pre=.12, post=.10, ramp=.08):
    """EP000 automix.py: per line, dip the background just enough for TARGET dB, crossfade to the voice-pocket EQ'd background"""
    n = len(v); g = np.ones(n); k = np.zeros(n); r = int(ramp * SR); rows = []
    for a, e in windows:
        i0, i1 = int(a * SR), int(e * SR)
        was = db(v[i0:i1]) - db(be[i0:i1])
        need = min(DIP_MAX, max(DIP_MIN, TARGET - was)); lin = 10 ** (-need / 20)
        s0, s1 = max(0, int((a - pre) * SR)), min(n, int((e + post) * SR))
        env = np.ones(n); env[s0:s1] = lin; kk = np.zeros(n); kk[s0:s1] = 1
        u = max(0, s0 - r); env[u:s0] = np.linspace(1, lin, s0 - u); kk[u:s0] = np.linspace(0, 1, s0 - u)
        w = min(r, n - s1); env[s1:s1 + w] = np.linspace(lin, 1, w); kk[s1:s1 + w] = np.linspace(1, 0, w)
        g = np.minimum(g, env); k = np.maximum(k, kk)
        rows.append((a, e, was, need))
    bg = (b * (1 - k[:, None]) + be * k[:, None]) * g[:, None]
    return v[:, None] + bg, bg, rows


def loudness(path):
    o = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-map', '0:a', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = o[o.rfind('Summary:'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1))


def master(mix, path):
    """gain to LUFS, true-peak limit at TP (limiter at 4x rate), re-check once"""
    lim = f'aresample=192000,alimiter=limit={10 ** ((TP - .2) / 20):.4f}:attack=1:release=60:level=false:latency=1,aresample={SR}'
    gain = 0.0
    for _ in range(3):
        y = ffilter(mix * 10 ** (gain / 20), lim, 2); save(path, y, 24)
        i, tp = loudness(path)
        if abs(i - LUFS) <= .1: break
        gain += LUFS - i
    return y, i, tp


# ---------------- build ----------------
def build(plan_path, voice_path, chain=True, audio_only=False, lines_path=None, name=None, out=None):
    plan = json.load(open(plan_path))
    ep = plan.get('episode', 'EP000')
    out = out or os.path.normpath(os.path.join(os.path.dirname(plan_path), '..', 'export'))
    os.makedirs(out, exist_ok=True)
    if not name:
        n = 1
        while any(f.startswith(f'SGMM_{ep}_build_v{n:03d}') for f in os.listdir(out)): n += 1
        name = f'SGMM_{ep}_build_v{n:03d}'
    P = lambda s: os.path.join(out, name + s)
    texts = [re.sub(r'[\[\]]', '', c['text']).replace('\n', ' ') for c in plan['captions']]

    take = load(voice_path)
    if lines_path: cuts = [tuple(x) for x in json.load(open(lines_path))]
    else: cuts = group_runs(speech_runs(take), [len(re.sub(r'[^A-Za-z0-9]', '', t)) for t in texts])
    json.dump([[round(a, 3), round(b, 3)] for a, b in cuts], open(P('_voice_lines.json'), 'w'))
    durs = [b - a for a, b in cuts]
    placed = retime(plan, durs)
    json.dump(plan, open(P('_plan.json'), 'w'), indent=1, ensure_ascii=False)

    voice = place(take, cuts, placed, plan['duration'])
    if chain: voice = ffilter(voice, open(os.path.join(HERE, 'voice_chain.txt')).read().strip())[:len(voice)]
    save(P('_voice.wav'), voice)

    sh('node', os.path.join(HERE, 'render.mjs'), P('_plan.json'), '--score-out', P(''))
    os.replace(P('_mix.wav'), P('_score.wav'))
    bg = load(P('_score.wav'), 2)
    n = min(len(voice), len(bg)); voice, bg = voice[:n], bg[:n]
    be = ffilter(bg, 'equalizer=f=2600:t=q:w=1:g=-7,equalizer=f=1200:t=q:w=1:g=-4', 2)[:n]
    windows = [(t0, t0 + d / tempo) for (t0, tempo), d in zip(placed, durs)]
    mix, bga, rows = automix(voice, bg, be, windows)
    _, I, tp = master(mix, P('_mix.wav'))
    os.remove(P('_score.wav'))

    # QC: voice over background on every line, measured on what goes into the master
    rep = [f'# {name}\n', f'plan `{os.path.relpath(plan_path)}` · voice `{os.path.relpath(voice_path)}` · chain {"on" if chain else "off (take already processed)"}\n',
           '| # | line | source | placed | tempo | voice over bg before → after |', '|---|---|---|---|---|---|']
    worst = 99
    for i, ((a, e, was, need), (s0, s1), (t0, tempo)) in enumerate(zip(rows, cuts, placed)):
        now = db(voice[int(a * SR):int(e * SR)]) - db(bga[int(a * SR):int(e * SR)].mean(1)); worst = min(worst, now)
        rep.append(f'| L{i + 1:02d} | {texts[i]} | {s0:.2f}–{s1:.2f} | {a:.2f}–{e:.2f} | ×{tempo:.2f} | {was:+.1f} → **{now:+.1f} dB** |')
    rep += ['', f'- voice over background: worst line **{worst:+.1f} dB** (target +{TARGET:.0f})',
            f'- master: **{I:.1f} LUFS**, true peak **{tp:.1f} dBTP** (target {LUFS:.0f} / {TP})',
            f'- duration {plan["duration"]} s' + (f' · time inserted {plan["warp"]} (look at those frames)' if plan.get('warp') else ' · no time inserted')]
    print('\n'.join(rep))

    if not audio_only:
        for clean in (False, True):
            mp4 = P(('_clean' if clean else '') + '_1080x1920_60fps.mp4')
            subprocess.run(['node', os.path.join(HERE, 'render.mjs'), P('_plan.json'), mp4, '--audio', P('_mix.wav')] + (['--clean'] if clean else []), check=True)
            I2, tp2 = loudness(mp4)
            info = sh('ffprobe', '-v', 'error', '-count_frames', '-show_entries', 'stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_read_frames,sample_rate', '-of', 'csv=p=0', mp4, out=True).decode().split()
            rep.append(f'- `{os.path.basename(mp4)}`: {" · ".join(info)} · decoded audio {I2:.1f} LUFS / {tp2:.1f} dBTP')
            print(rep[-1])
    open(P('_report.md'), 'w').write('\n'.join(rep) + '\n')
    return P('')


# ---------------- step 3: qc ----------------
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
SILENT = -40.0               # dBFS: an intended silence (plan "silences") must stay under this
CAP_SYNC = .10               # a caption must start within this of its voice line
STYLE_FILES = ['08_templates/styles/manim/sgmm_manim.js']   # same list as render.mjs STYLE_FILES


def probe(mp4):
    r = json.loads(sh('ffprobe', '-v', 'error', '-count_frames', '-show_entries', 'stream=codec_type,codec_name,pix_fmt,width,height,r_frame_rate,nb_read_frames,sample_rate,channels:format=duration', '-of', 'json', mp4, out=True))
    v = next(s for s in r['streams'] if s['codec_type'] == 'video'); a = next(s for s in r['streams'] if s['codec_type'] == 'audio')
    return v, a, float(r['format']['duration'])


def voice_over_bg(mix, v, wins):
    """per-line voice over background from the delivered mix: align the voice stem, fit the master gain, background = mix/g - voice"""
    a, b = mix[int(min(w[0] for w in wins) * SR):][:2 * SR], v[int(min(w[0] for w in wins) * SR):][:2 * SR]
    from scipy.signal import correlate
    lag = int(np.argmax(correlate(a, b, 'full', method='fft')) - (len(b) - 1)) if len(a) == len(b) else 0
    v = np.r_[np.zeros(lag), v] if lag > 0 else v[-lag:]
    n = min(len(mix), len(v)); mix, v = mix[:n], v[:n]
    wins = [(x, min(y, n / SR)) for x, y in wins]
    idx = np.concatenate([np.arange(int(x * SR), int(y * SR)) for x, y in wins])
    bg = mix / (mix[idx] @ v[idx] / (v[idx] @ v[idx])) - v
    return [db(v[int(x * SR):int(y * SR)]) - db(bg[int(x * SR):int(y * SR)]) for x, y in wins]


def canvas(html, outdir):
    """draw a page in headless Chrome (render.mjs --canvas): writes each window.outputs() image to outdir/<name>.png"""
    page = os.path.join(outdir, 'page.html'); open(page, 'w').write('<meta charset="utf-8">\n' + html)
    sh('node', os.path.join(HERE, 'render.mjs'), page, '--canvas', outdir)


def data_uri(path):
    import base64
    return 'data:image/jpeg;base64,' + base64.b64encode(open(path, 'rb').read()).decode()


def still(mp4, t, path):
    sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', mp4, '-frames:v', '1', '-q:v', '3', path)


def contact_sheet(mp4, shots, out):
    """stills (t, label) in a labelled grid, 7 across"""
    with tempfile.TemporaryDirectory() as d:
        imgs = []
        for i, (t, lab) in enumerate(shots):
            still(mp4, t, os.path.join(d, f'{i}.jpg')); imgs.append([data_uri(os.path.join(d, f'{i}.jpg')), lab])
        canvas(f'''<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=block">
<script>const S={json.dumps(imgs)},C=7,w=216,h=384,p=10,lh=34;
window.outputs=async()=>{{const cv=document.createElement('canvas'),R=Math.ceil(S.length/C);cv.width=C*(w+p)+p;cv.height=R*(h+lh+p)+p;const c=cv.getContext('2d');
 c.fillStyle='#050807';c.fillRect(0,0,cv.width,cv.height);c.font='500 15px "JetBrains Mono"';c.textBaseline='middle';
 for(let i=0;i<S.length;i++){{const im=await new Promise(r=>{{const x=new Image();x.onload=()=>r(x);x.src=S[i][0]}}),x=p+(i%C)*(w+p),y=p+Math.floor(i/C)*(h+lh+p);
  c.drawImage(im,x,y,w,h);c.fillStyle='#7C8A84';c.fillText(S[i][1],x,y+h+lh/2)}}
 return{{sheet:cv.toDataURL('image/png')}}}};
document.fonts.load('500 15px "JetBrains Mono"').then(()=>window.__ready=true)</script>''', d)
        shutil.move(os.path.join(d, 'sheet.png'), out)


def qc(prefix):
    plan = json.load(open(prefix + '_plan.json'))
    final, clean = prefix + '_1080x1920_60fps.mp4', prefix + '_clean_1080x1920_60fps.mp4'
    W, H = plan['size']; fps, dur = plan['fps'], plan['duration']
    rows = []
    chk = lambda name, ok, detail: rows.append((name, ok if ok is None else bool(ok), detail))   # None = look/listen

    for mp4 in (final, clean):
        v, a, d = probe(mp4)
        frames, want = int(v['nb_read_frames']), round(dur * fps)
        chk(f'video `{os.path.basename(mp4)}`', v['codec_name'] == 'h264' and v['pix_fmt'] == 'yuv420p' and (v['width'], v['height']) == (W, H) and v['r_frame_rate'] == f'{fps}/1' and frames == want,
            f"{v['codec_name']} {v['pix_fmt']} {v['width']}×{v['height']} {v['r_frame_rate']} fps · {frames}/{want} frames · {d:.2f} s")
        chk('audio stream', a['codec_name'] == 'aac' and a['sample_rate'] == str(SR) and a['channels'] == 2, f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} ch")
        I, tp = loudness(mp4)
        chk('loudness (decoded)', abs(I - LUFS) <= .5 and tp <= TP + .05, f'{I:.1f} LUFS (target {LUFS:.0f} ±0.5) · {tp:.1f} dBTP (≤ {TP})')

    mix, voice = load(final, 2).mean(1), load(prefix + '_voice.wav')
    caps = plan['captions']
    wins = [(c['t'][0], c['t'][1] - CAP_TAIL) for c in caps]
    ratios = voice_over_bg(mix, voice, wins)
    texts = [re.sub(r'[\[\]]', '', c['text']).replace('\n', ' ') for c in caps]
    onsets = [a for a, _ in speech_runs(voice)]
    for i, (c, r) in enumerate(zip(caps, ratios)):
        off = min((o - c['t'][0] for o in onsets), key=abs) if onsets else 99
        sync = f'caption vs voice {off:+.2f} s (±{CAP_SYNC})' if abs(off) <= .3 else 'no pause before this line (it runs on from the last one), so its start can\'t be measured — **listen**'
        chk(f'L{i + 1:02d} {texts[i]}', r >= TARGET - .5 and (abs(off) <= CAP_SYNC or None), f'voice over background **{r:+.1f} dB** (≥ +{TARGET - .5:.1f}) · {sync}')
    for a, b in plan.get('silences', []):
        s = db(mix[int(a * SR):int(b * SR)])
        chk(f'silence {a:.2f}–{b:.2f} s', s <= SILENT, f'{s:.1f} dBFS (≤ {SILENT:.0f})')

    joins = [(0.0, 'first frame')] + [(s['t'][0] + .05, s.get('id', s['type'])) for s in plan['scenes'][1:]] + [(dur - 1 / fps, 'last frame')]
    sheet = prefix + '_contact.png'
    contact_sheet(final, [(t, f'{t:5.2f}s {lab}') for t, lab in joins], sheet)

    ok = all(r[1] is not False for r in rows)
    md = [f'# QC {os.path.basename(prefix)} — {"FAIL" if not ok else "PASS, with things to check" if any(r[1] is None for r in rows) else "PASS"}\n', f'Contact sheet (every scene join + first/last frame): `{os.path.basename(sheet)}` — look at it before sending.\n',
          '| check | | detail |', '|---|---|---|'] + [f'| {n} | {"⚠️" if o is None else "✅" if o else "❌"} | {d} |' for n, o, d in rows]
    open(prefix + '_qc.md', 'w').write('\n'.join(md) + '\n')
    print('\n'.join(md))
    return ok


# ---------------- step 3: package ----------------
HYPE = re.compile(r'\b(shocking|insane|mind-?blowing|crazy|unbelievable|you won.t believe|game.?changer)\b', re.I)
BANNED_TAGS = {'#viral', '#trending', '#fyp', '#foryou', '#foryoupage'}
CORE_TAGS = ['AI', 'artificial intelligence', 'future of AI', 'how AI is changing the world', 'AI explained', 'then vs now', 'AI documentary', 'AI tools', 'learn AI', 'Claude AI', 'technology', 'future technology', 'SG Mind Matrix']
ABOUT = ('SG Mind Matrix documents the AI shift — then, now, next — with honest explainers, practical AI tips and real builds made in public.\n\n'
         'New episode every Saturday. Subscribe and join the Matrix.\n\n'
         'Script and voice are human. Visuals and music are original. AI tools assist research and production.')


def srt(caps):
    ts = lambda t: f'{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(round(t % 1 * 1000)) % 1000:03d}'
    return '\n'.join(f"{i + 1}\n{ts(c['t'][0])} --> {ts(c['t'][1])}\n{re.sub(r'[\[\]]', '', c['text']).replace(chr(10), ' ')}\n" for i, c in enumerate(caps))


def package(prefix, out=None):
    plan = json.load(open(prefix + '_plan.json')); pub = plan.get('publish', {})
    ep, name = plan.get('episode', 'EP000'), os.path.basename(prefix)
    out = out or os.path.join(ROOT, '09_exports'); os.makedirs(out, exist_ok=True)
    final, clean = prefix + '_1080x1920_60fps.mp4', prefix + '_clean_1080x1920_60fps.mp4'
    texts = [re.sub(r'[\[\]]', '', c['text']).replace('\n', ' ') for c in plan['captions']]
    srt_path = os.path.join(out, f'{name}_captions_en.srt'); open(srt_path, 'w').write(srt(plan['captions']))

    # thumbnails: the approved template, words + frames from the plan, rendered at 3x and downsampled (lanczos)
    th = pub.get('thumbs', {}); names = th.get('names', {})
    files = {k: os.path.join(out, f'{name}_thumb_{k}' + (f'_{names[k]}' if k in names else '') + '_1280x720.png') for k in 'ABC'}
    files['vertical'] = os.path.join(out, f'{name}_cover_vertical_1080x1920.png')
    with tempfile.TemporaryDirectory() as d:
        img, spec = {}, {k: dict(v) for k, v in th.items() if k in ('A', 'B', 'C', 'vertical')}
        for k in ('B', 'C'):
            t = spec.get(k, {}).get('t', {'B': 39.4, 'C': 29.0}[k])
            still(clean, t, os.path.join(d, k + '.jpg')); img[k] = data_uri(os.path.join(d, k + '.jpg')); spec.setdefault(k, {})['frame'] = k
        mark = re.search(r' d="([^"]+)"', open(os.path.join(ROOT, '01_brand/logo/svg/SGMM_mark_green.svg')).read()).group(1)
        tpl = open(os.path.join(ROOT, '08_templates/thumbnail/sgmm_thumbnail_template.html')).read()
        canvas(f'<script>window.MARK_D={json.dumps(mark)};window.IMG={json.dumps(img)};window.SPEC={json.dumps(spec)}</script>\n' + tpl, d)
        for k, f in files.items():
            w, h = (1080, 1920) if k == 'vertical' else (1280, 720)
            sh('ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, k + '.png'), '-vf', f'scale={w}:{h}:flags=lanczos', f)
    # phone-size check: the three thumbnails at 168×94 (+ cover at 94×168), as YouTube shows them
    preview = os.path.join(out, f'{name}_thumbs_phone_preview.png')
    sh('ffmpeg', '-v', 'error', '-y', *sum((['-i', files[k]] for k in ('A', 'B', 'C', 'vertical')), []), '-filter_complex',
       '[0]scale=168:94[a];[1]scale=168:94[b];[2]scale=168:94[c];[3]scale=53:94[v];[a]pad=176:94[a2];[b]pad=176:94[b2];[c]pad=176:94[c2];[a2][b2][c2][v]hstack=4', preview)

    # posting kit (sgmm-publishing skill)
    titles = pub.get('titles') or ['TODO: title (keyword first, ≤60 chars)']
    tags = pub.get('hashtags') or ['#AI', '#FutureOfAI', '#ArtificialIntelligence', '#Shorts']
    desc = f"{pub.get('summary') or ' '.join(texts[:6])}\n\n{ABOUT}\n\n{' '.join(tags)}"
    xpost = pub.get('x_post') or '\n'.join(texts) + f"\n\nThis is SG Mind Matrix. Day {pub.get('day', '?')}. #AI"
    xreply = 'Full episodes on YouTube, every Saturday → [paste your YouTube Short link]'
    pinned = pub.get('pinned') or 'TODO: one open question that invites a personal answer'
    warn = []
    for t in titles:
        if len(t) > 60: warn.append(f'title over 60 chars: "{t}" ({len(t)})')
        if '#' in t: warn.append(f'hashtag in title: "{t}"')
    if '#Shorts' not in tags: warn.append('description hashtags miss #Shorts')
    if not 3 <= len(tags) <= 5: warn.append(f'{len(tags)} description hashtags (3–5)')
    if BANNED_TAGS & {t.lower() for t in tags}: warn.append('banned hashtag (#viral/#trending/#fyp)')
    if len(re.findall(r'#\w+', xpost)) > 2: warn.append('X post has more than 2 hashtags')
    if 'youtu' in xpost.lower(): warn.append('X post has a YouTube link (put it in the first reply)')
    for label, txt in (('titles', ' '.join(titles)), ('description', desc), ('X post', xpost), ('pinned', pinned)):
        if HYPE.search(txt): warn.append(f'hype word in {label}: "{HYPE.search(txt).group(0)}"')
    if any('TODO' in x for x in titles + [pinned]): warn.append('copy still has TODOs — write titles / pinned comment into the plan\'s "publish" block')

    pick = th.get('pick', 'A'); b = os.path.basename
    kit = f"""# {ep} "{plan.get('title', '')}" — posting kit ({name})

**Upload this file:** `{b(final)}` ({plan['duration']:g} s, vertical → YouTube treats it as a Short).
Captions file for YouTube: `{b(srt_path)}`. QC: `{name}_qc.md` (run `sgmm qc` before posting).

---

## YouTube Short

### Title (pick one — A is recommended)
| | Title | Chars |
|---|---|---|
""" + '\n'.join(f"| {'**' + 'ABC'[i] + '**' if i == 0 else 'ABC'[i]} | {'**' + t + '**' if i == 0 else t} | {len(t)} |" for i, t in enumerate(titles)) + f"""

{'Why A: ' + pub['why'] + '. No hashtags in the title.' if pub.get('why') else 'No hashtags in the title.'}

### Description (paste as-is)
```
{desc}
```

### Tags (Studio → Tags field)
```
{', '.join(CORE_TAGS + pub.get('tags', []))}
```

### Thumbnails
Recommended **{pick}**. Files: {' · '.join(f'`{b(f)}`' for f in files.values())}. Phone-size check: `{b(preview)}`.
Shorts can't take a custom thumbnail from Studio on every account; in the app pick the frame: {pub.get('shorts_frame', 'the strongest brand moment (logo from the dark)')}.

### Settings
- Category: **Science & Technology** · Language: **English** · Captions: upload `{b(srt_path)}` (subtitles → upload file → with timing).
- Altered or synthetic content: **No** (stylised animation, nothing realistic that could mislead).
- Audience: not made for kids.
- Comments: on. Remix: on.

### Pinned comment (post it yourself, pin it)
```
{pinned}
```

---

## X (Twitter)

Upload the **same MP4 natively** (do not post a YouTube link in the main post).

### Main post
```
{xpost}
```

### First reply (right after posting)
```
{xreply}
```

### Then
- Pin the post to your profile.
- Spend 30–60 minutes replying to mid-size AI accounts (5K–100K followers) with real insight, and reply to everyone who replies to you.

---

## When
**7:45 pm Nepal time** (9:00 am US Eastern, 2:00 pm UK); Saturday for episodes. Be around for the first hour to answer every comment.

## Check before you press publish
- [ ] Brand Gmail/YouTube account, not personal · [ ] QC report says PASS · [ ] title {pick} pasted · [ ] description pasted · [ ] tags pasted · [ ] SRT uploaded · [ ] pinned comment posted · [ ] X post uses native video, link only in the reply.
"""
    if warn: kit += '\n## ⚠️ Copy checks\n' + '\n'.join(f'- {w}' for w in warn) + '\n'
    kit_path = os.path.join(out, f'{name}_POSTING_KIT.md'); open(kit_path, 'w').write(kit)
    print('\n'.join([kit_path, srt_path, *files.values(), preview] + ([f'WARN {w}' for w in warn] or ['copy checks ok'])))
    return kit_path


# ---------------- step 4a: storyboard preview ----------------
def preview(plan_path, out=None):
    """one self-contained page: the scene library + plan inline, key frames drawn live in the browser, script + sources"""
    plan = json.load(open(plan_path))
    if not out:
        d, f = os.path.split(os.path.abspath(plan_path))
        out = os.path.join(os.path.dirname(d), 'storyboard', re.sub(r'_scenes(_v\d+)?\.json$', r'_storyboard\1.html', f))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    mark = re.search(r' d="([^"]+)"', open(os.path.join(ROOT, '01_brand/logo/svg/SGMM_mark_green.svg')).read()).group(1)
    page = open(os.path.join(HERE, 'storyboard_page.html')).read()
    title = f"{plan.get('episode', '')} {plan.get('format', '').upper()} storyboard".strip()
    for k, v in (('__TITLE__', title), ('__MARK__', mark), ('__PLAN__', json.dumps(plan, ensure_ascii=False).replace('</', '<\\/')),
                 ('__ENGINE__', '\n'.join(open(os.path.join(ROOT, f)).read() for f in STYLE_FILES + plan.get('style_files', []) + ['08_templates/engine/sgmm_scenes.js']))):
        page = page.replace(k, v)
    open(out, 'w').write(page)
    with tempfile.TemporaryDirectory() as d:   # the same cards as one PNG
        canvas(page, d); shutil.move(os.path.join(d, 'storyboard.png'), out[:-5] + '.png')
    print(out, out[:-5] + '.png', sep='\n')
    return out


def selftest():
    # split: 3 lines, the middle one with a pause inside; the pause inside is longer than one gap between lines
    runs = [(1, 2), (2.5, 3.2), (3.85, 4.4), (5.5, 7)]
    assert group_runs(runs, [10, 12, 15]) == [(1, 2), (2.5, 4.4), (5.5, 7)], group_runs(runs, [10, 12, 15])
    v = np.zeros(SR * 8); v[SR:2 * SR] = np.sin(np.arange(SR) * .1) * .3
    assert [(round(a, 1), round(b, 1)) for a, b in speech_runs(v)] == [(1.0, 2.0)]
    base = lambda: {'duration': 10, 'scenes': [{'t': [0, 5]}, {'t': [5, 10]}], 'captions': [{'t': [1, 2]}, {'t': [3, 4]}, {'t': [6, 7]}]}
    p = base(); assert retime(p, [.8, 1.05, 1]) == [(1, 1), (3, 1), (6, 1)] and 'warp' not in p and p['captions'][0]['t'] == [1, 2.05]
    p = base(); pl = retime(p, [.8, 1.5, 1]); assert pl[1] == (2.6, 1) and 'warp' not in p             # earlier first (to prev end + GAP + ...)
    p = base(); pl = retime(p, [.8, 2.3, 1]); assert pl[1][0] == 1.95 and pl[1][1] > 1 and 'warp' not in p  # then speed up <=10%
    p = base(); pl = retime(p, [.8, 3.5, 1])                                                          # then insert time
    assert p['warp'] and p['duration'] > 10 and p['scenes'][1]['t'][0] > 5 and pl[2][0] > 6 and p['scenes'][0]['t'][1] > 5  # scene across the insert plays longer
    assert srt([{'t': [0.05, 1.3], 'text': 'This is [SG Mind Matrix].'}, {'t': [61.5, 62], 'text': 'a\nb'}]) == \
        '1\n00:00:00,050 --> 00:00:01,300\nThis is SG Mind Matrix.\n\n2\n00:01:01,500 --> 00:01:02,000\na b\n'
    print('selftest ok')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['selftest']: selftest()
    elif a[:1] == ['qc'] and len(a) >= 2: sys.exit(0 if qc(a[1]) else 1)
    elif a[:1] == ['preview'] and len(a) >= 2: preview(a[1], a[a.index('--out') + 1] if '--out' in a else None)
    elif a[:1] == ['package'] and len(a) >= 2: package(a[1], a[a.index('--out') + 1] if '--out' in a else None)
    elif a[:1] == ['build'] and len(a) >= 3:
        opt = lambda k: a[a.index(k) + 1] if k in a else None
        build(a[1], a[2], chain='--no-chain' not in a, audio_only='--audio-only' in a, lines_path=opt('--lines'), name=opt('--name'), out=opt('--out'))
    else: print(__doc__); sys.exit(1)
