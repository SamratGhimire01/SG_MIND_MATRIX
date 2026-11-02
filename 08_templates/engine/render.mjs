#!/usr/bin/env node
/* SGMM render engine v001 — scenes.json -> MP4 (and a parity check against an old storyboard).
   No npm installs: drives headless Chrome over the DevTools protocol (Node's built-in WebSocket), pipes frames into ffmpeg.

   node 08_templates/engine/render.mjs <plan.json> <out.mp4> [--workers 4] [--clean] [--from 0] [--to <duration>] [--audio mix.wav]
   node 08_templates/engine/render.mjs <plan.json> --score-out <prefix>        (writes <prefix>_mix/_music/_sfx.wav)
   node 08_templates/engine/render.mjs <page.html> --canvas <dir>              (writes each {name: PNG dataURL} of window.outputs() to <dir>/<name>.png)
   node 08_templates/engine/render.mjs <plan.json> --compare <storyboard.html> [--every 0.25]

   Chrome: $SGMM_CHROME, else Google Chrome in /Applications. */
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CHROME = process.env.SGMM_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;700&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&display=swap';
const FONT_SPECS = ['500 40px "JetBrains Mono"', '700 40px "JetBrains Mono"', '700 40px "Space Grotesk"', '500 20px "Space Grotesk"', '400 120px "Anton"', '700 34px "Oswald"', '700 34px "Libre Baskerville"', 'italic 400 20px "Libre Baskerville"', '400 11px "Libre Baskerville"', '400 52px "STIX Two Text"', 'italic 400 52px "STIX Two Text"'];
export const STYLE_FILES = ['08_templates/styles/manim/sgmm_manim.js']; // style modules that add scene types (loaded before the library)

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const [planPath, outPath] = args;
if (!planPath) { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 9).join('\n')); process.exit(1); }
const plan = planPath.endsWith('.json') ? JSON.parse(fs.readFileSync(planPath, 'utf8')) : null;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'sgmm-'));

/* ---------- a tiny CDP client ---------- */
async function browser() {
  const dir = fs.mkdtempSync(path.join(TMP, 'chrome-'));
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files', 'about:blank'], {stdio: ['ignore', 'ignore', 'pipe']});
  const port = await new Promise((ok, no) => {
    let buf = ''; proc.on('exit', c => no(new Error('chrome exited ' + c)));
    proc.stderr.on('data', d => { buf += d; const m = buf.match(/ws:\/\/[^:]+:(\d+)\//); if (m) ok(m[1]); });
  });
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {method: 'PUT'})).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
  let id = 0; const wait = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } };
  const send = (method, params = {}) => new Promise(ok => { const i = ++id; wait.set(i, ok); ws.send(JSON.stringify({id: i, method, params})); });
  const evaluate = async expr => {
    const r = await send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true});
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
    return r.result.result.value;
  };
  const open = async file => {
    await send('Page.navigate', {url: 'file://' + file});
    for (let i = 0; i < 600; i++) { if (await evaluate('window.__ready===true').catch(() => false)) return; await new Promise(r => setTimeout(r, 100)); }
    throw new Error('page never got ready: ' + file);
  };
  return {evaluate, open, close: () => new Promise(r => { proc.once('exit', r); ws.close(); proc.kill(); })};
}

/* ---------- the engine page: official mark + library + plan ---------- */
function enginePage() {
  const d = fs.readFileSync(path.join(ROOT, '01_brand/logo/svg/SGMM_mark_green.svg'), 'utf8').match(/ d="([^"]+)"/)[1];
  const file = path.join(TMP, 'engine.html');
  fs.writeFileSync(file, `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${FONTS}">
<svg width="0" height="0" style="position:absolute"><path id="markpath" d="${d}"/></svg>
${STYLE_FILES.concat(plan.style_files || []).map(f => `<script src="file://${path.join(ROOT, f)}"></script>`).join('')}
<script src="file://${path.join(HERE, 'sgmm_scenes.js')}"></script>
<script>window.ep=SGMM.load(${JSON.stringify(plan)});
Promise.all(${JSON.stringify(FONT_SPECS)}.map(f=>document.fonts.load(f))).catch(()=>{}).then(()=>window.__ready=true);
window.__diff=(a,b)=>Promise.all([a,b].map(s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=s}))).then(([x,y])=>{
  const px=i=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);return g.getImageData(0,0,c.width,c.height).data};
  const A=px(x),B=px(y);let max=0,n=0;for(let k=0;k<A.length;k+=4){const m=Math.max(Math.abs(A[k]-B[k]),Math.abs(A[k+1]-B[k+1]),Math.abs(A[k+2]-B[k+2]));if(m>max)max=m;if(m>8)n++}
  return{max,pct:100*n/(A.length/4)}})</script>`);
  return file;
}

const run = (cmd, a, input) => new Promise((ok, no) => {
  const p = spawn(cmd, a, {stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit']});
  p.on('exit', c => c ? no(new Error(`${cmd} exited ${c}`)) : ok()); if (input) input(p.stdin);
});

/* ---------- parity check ---------- */
async function compare(htmlPath, every) {
  const [old, eng] = await Promise.all([browser(), browser()]);
  await Promise.all([old.open(path.resolve(htmlPath)), eng.open(enginePage())]);
  let worst = {max: 0, pct: 0, t: 0}, same = 0, n = 0;
  for (let t = 0; t < plan.duration; t = +(t + every).toFixed(4)) {
    const [a, b] = await Promise.all([old.evaluate(`window.__exp.frame(${t})`), eng.evaluate(`ep.frame(${t})`)]);
    n++; if (a === b) { same++; continue; }
    const d = await eng.evaluate(`__diff(${JSON.stringify(a)},${JSON.stringify(b)})`);
    console.log(`t=${t.toFixed(2)}  max channel diff ${d.max}  pixels off >8: ${d.pct.toFixed(3)}%`);
    if (d.pct > worst.pct) worst = {...d, t};
  }
  const [oa, ea] = await Promise.all([old.evaluate('window.__exp.audio().then(a=>a.b64)'), eng.evaluate('ep.audio().then(a=>a.b64)')]);
  await Promise.all([old.close(), eng.close()]);
  /* Chrome's offline audio is not bit-repeatable (the same page differs from itself by 1 LSB), so allow 2 LSB */
  const pcm = s => { const b = Buffer.from(s, 'base64'); return new Int16Array(b.buffer, b.byteOffset + 44, (b.length - 44) / 2); };
  const x = pcm(oa), y = pcm(ea); let lsb = x.length === y.length ? 0 : Infinity;
  for (let i = 0; i < x.length && lsb < Infinity; i++) lsb = Math.max(lsb, Math.abs(x[i] - y[i]));
  console.log(`\nframes: ${same}/${n} byte-identical${same < n ? `, worst ${worst.pct.toFixed(3)}% at t=${worst.t}` : ''}\nscore:  max sample difference ${lsb} LSB (${lsb <= 2 ? 'match' : 'DIFFERENT'})`);
  return same === n && lsb <= 2;
}

/* ---------- score: {mute: file} with mute '' (full mix) | 'music' (-> sfx stem) | 'sfx' (-> music stem) ---------- */
async function scoreOut(files) {
  const br = await browser(); await br.open(enginePage());
  for (const [mute, f] of Object.entries(files)) fs.writeFileSync(f, Buffer.from(await br.evaluate(`ep.audio(${mute ? `'${mute}'` : ''}).then(a=>a.b64)`), 'base64'));
  await br.close();
}

/* ---------- render ---------- */
async function render(out) {
  const fps = plan.fps, W = +opt('workers', 4), caps = !opt('clean', false);
  const f0 = Math.round(+opt('from', 0) * fps), f1 = Math.round(+opt('to', plan.duration) * fps), page = enginePage();
  const per = Math.ceil((f1 - f0) / W), segs = [];
  const t0 = Date.now();
  await Promise.all(Array.from({length: W}, async (_, w) => {
    const a = f0 + w * per, b = Math.min(f1, a + per); if (a >= b) return;
    const seg = path.join(TMP, `seg${w}.mp4`); segs[w] = seg;
    const br = await browser(); await br.open(page);
    await run('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', fps, '-c:v', 'mjpeg', '-i', '-', '-vf', 'scale=out_range=tv,format=yuv420p', '-color_range', 'tv', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', '-level', '4.2', '-r', fps, seg].map(String), async stdin => {
      for (let f = a; f < b; f++) {
        const d = await br.evaluate(`ep.frame(${f / fps},${caps})`);
        if (!stdin.write(Buffer.from(d.slice(d.indexOf(',') + 1), 'base64'))) await new Promise(r => stdin.once('drain', r));
        if (w === 0 && f % fps === 0) process.stdout.write(`\r  ${Math.round(100 * (f - a) / (b - a))}% `);
      }
      stdin.end();
    });
    await br.close();
  }));
  console.log(`\nframes ${f1 - f0} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  const wav = opt('audio', false) ? path.resolve(opt('audio')) : path.join(TMP, 'score.wav');
  if (!opt('audio', false)) await scoreOut({'': wav});
  const list = path.join(TMP, 'segs.txt'); fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  await run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-ss', f0 / fps, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', (f1 - f0) / fps, out].map(String));
  await run('ffprobe', ['-v', 'error', '-count_frames', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,pix_fmt,nb_read_frames,sample_rate,channels', '-show_entries', 'format=duration', '-of', 'compact', out]);
}

try {
  if (opt('canvas')) {
    const br = await browser(); await br.open(path.resolve(planPath));
    for (const [k, u] of Object.entries(await br.evaluate('window.outputs()'))) fs.writeFileSync(path.join(opt('canvas'), k + '.png'), Buffer.from(u.slice(u.indexOf(',') + 1), 'base64'));
    await br.close();
  } else if (opt('score-out')) { const p = path.resolve(opt('score-out')); await scoreOut({'': p + '_mix.wav', sfx: p + '_music.wav', music: p + '_sfx.wav'}); }
  else if (opt('compare')) process.exitCode = (await compare(opt('compare'), +opt('every', 0.25))) ? 0 : 2;
  else if (outPath) await render(outPath);
} finally { fs.rmSync(TMP, {recursive: true, force: true}); }
process.exit(); // a stray CDP/fetch handle can keep node alive after the work is done
