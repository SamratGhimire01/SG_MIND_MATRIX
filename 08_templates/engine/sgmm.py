#!/usr/bin/env python3
"""SGMM pipeline step 2 — `sgmm build`: one voice take + scenes.json -> final MP4, clean MP4, stems, report.

  python3 08_templates/engine/sgmm.py build <plan.json> <voice> [--no-chain] [--audio-only] [--lines lines.json] [--name NAME] [--out DIR]
  python3 08_templates/engine/sgmm.py selftest

voice split -> re-time to the real voice -> score from the plan (+ its cues, warped with the picture) -> approved crisp+big
voice chain -> per-line automix (voice +15 dB over the background) -> master -14 LUFS / -1.5 dBTP -> render final + clean.
Lines are the plan's captions, in order. Needs ffmpeg, node, numpy. --no-chain: the take is already processed (EP000 v004).
"""
import json, math, os, re, subprocess, sys, tempfile
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
    print('selftest ok')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['selftest']: selftest()
    elif a[:1] == ['build'] and len(a) >= 3:
        opt = lambda k: a[a.index(k) + 1] if k in a else None
        build(a[1], a[2], chain='--no-chain' not in a, audio_only='--audio-only' in a, lines_path=opt('--lines'), name=opt('--name'), out=opt('--out'))
    else: print(__doc__); sys.exit(1)
