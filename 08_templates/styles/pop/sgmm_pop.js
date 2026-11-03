/* SGMM Pop Explainer kit v001 (3 Nov 2026) — the component grammar studied in .claude/skills/sgmm-video-production/POP_EXPLAINER.md,
   recoloured to SGMM: Deep Forest / Signal White stages, Amber stickers and X marks, Void/White highlight bars, ONE green per frame.
   Space Grotesk Bold for captions and titles, JetBrains Mono Bold caps for tags. 1080x1920 logical pixels, every draw a pure function of t.
   Timings from the frame study (30 fps reference, here in seconds): word 0.2 s, bar wipe 0.2 s, tag pop 0.33 s (0.4 -> 1.08 -> 1.0), card 0.38 s. */
window.SGMM_POP = (() => {
  const C = {void: '#050807', white: '#F2F5F3', fog: '#7C8A84', forest: '#0B3D2E', amber: '#FFB547', green: '#00E676'};
  const SG = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';
  const TAU = Math.PI * 2, cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const seg = (a, b, t) => cl((t - a) / (b - a)), out3 = (x) => 1 - Math.pow(1 - x, 3), io = (x) => x * x * (3 - 2 * x);
  const back = (x, s = 2) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
  const ink = (mode) => (mode === 'light' ? C.void : C.white);

  // spring pop: null before `at`; scale 0.4 -> ~1.08 -> 1, then a slow drift to 0.97; rotation settles r0 -> r1
  function pop(t, at, o = {}) {
    if (t < at) return null; const d = o.dur || 0.33, x = seg(at, at + d, t);
    const s = (o.from ?? 0.4) + (1 - (o.from ?? 0.4)) * back(x) - 0.03 * seg(at + d, at + d + 3, t);
    return {s, a: seg(at, at + 0.08, t), r: lerp(o.r0 ?? -0.1, o.r1 ?? 0, out3(x)), blur: (1 - seg(at, at + 0.07, t)) * 6};
  }
  function withPop(c, t, at, x, y, draw, o = {}) {
    const p = pop(t, at, o); if (!p) return false; c.save(); c.translate(x, y + (o.float ? 2 * Math.sin(t * 2.1 + x) : 0)); c.rotate(p.r); c.scale(p.s, p.s); c.globalAlpha *= p.a;
    if (p.blur > 0.3) c.filter = `blur(${p.blur.toFixed(1)}px)`; draw(c); c.restore(); return true;
  }
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };

  // stages: never flat — radial light, faint Fog grid (no floating code digits)
  function bg(c, t, mode = 'dark') {
    const L = mode === 'light', g = c.createRadialGradient(540, 820, 80, 540, 960, 1250);
    g.addColorStop(0, L ? C.white : '#145641'); g.addColorStop(0.55, L ? '#E6EBE8' : C.forest); g.addColorStop(1, L ? '#C9D1CD' : C.void);
    c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
    c.save(); c.strokeStyle = L ? 'rgba(124,138,132,.16)' : 'rgba(124,138,132,.12)'; c.lineWidth = 1.5; const off = (t * 6) % 72;
    c.beginPath(); for (let x = -72 + off; x < 1080; x += 72) { c.moveTo(x, 0); c.lineTo(x, 1920); } for (let y = -72 + off; y < 1920; y += 72) { c.moveTo(0, y); c.lineTo(1080, y); } c.stroke(); c.restore();
  }
  // slow push-in so a held frame never freezes
  function push(c, t, amt = 0.04, dur = 6) { const k = 1 + amt * seg(0, dur, t); c.translate(540, 960); c.scale(k, k); c.translate(-540, -960); }

  // caption that builds word by word: specs [{a, b, lines:['You press *Enter*…', 'and it *types back*.']}]
  // *word group* = highlight bar (white on dark, void on light), {word group} = the one green bar. Pace = the voice's ~2.4 words/s.
  const CAPF = `700 62px ${SG}`, CAPY = 250, CAPLH = 88, WPS = 2.4;
  function parse(line) {
    const out = []; let cur = 0;
    for (let w of line.split(' ')) {
      if (w[0] === '*') { cur = 1; w = w.slice(1); } else if (w[0] === '{') { cur = 2; w = w.slice(1); }
      const close = /[*}]/.test(w); w = w.replace(/[*}]/, ''); out.push({w, h: cur}); if (close) cur = 0;
    }
    return out;
  }
  function caption(c, t, specs, mode = 'dark') {
    const sp = specs.map((s) => (Array.isArray(s) ? {a: s[0], b: s[1], lines: s[2].split('\n')} : s)).find((s) => t >= s.a && t < s.b); if (!sp) return;
    const fade = 1 - seg(sp.b - 0.15, sp.b, t), nw = sp.lines.join(' ').split(' ').length, wps = Math.max(WPS, nw / Math.max(0.5, sp.b - sp.a - 0.5)); let k = 0; c.save(); c.font = CAPF; c.textBaseline = 'middle';
    const fit = Math.min(1, 940 / Math.max(...sp.lines.map((ln) => c.measureText(ln.replace(/[*{}]/g, '')).width + 48))); if (fit < 1) c.font = `700 ${Math.floor(62 * fit)}px ${SG}`; const spc = c.measureText(' ').width;
    sp.lines.forEach((ln, li) => {
      const ws = parse(ln), wd = ws.map((x) => c.measureText(x.w).width), tot = wd.reduce((s, v) => s + v, 0) + spc * (ws.length - 1) + 24 * ws.filter((x, i) => x.h && !(ws[i - 1] || {}).h).length;
      let x = 540 - tot / 2; const y = CAPY + li * CAPLH;
      ws.forEach((wObj, i) => {
        const ta = sp.a + (k++) / wps, h = wObj.h, first = h && !(ws[i - 1] || {}).h;
        if (first) { // bar for the whole group, wiping left -> right
          let j = i, gw = 0; while (j < ws.length && ws[j].h) { gw += wd[j] + (j > i ? spc : 0); j++; }
          const p = out3(seg(ta - 0.05, ta + 0.15, t)); if (p > 0) { c.globalAlpha = fade; c.fillStyle = h === 2 ? C.green : ink(mode); rr(c, x, y - 40, (gw + 24) * p, 80, 8); c.fill(); }
          x += 12;
        }
        const a = seg(ta, ta + 0.2, t); if (a > 0) {
          c.globalAlpha = a * fade; c.filter = a < 1 ? `blur(${((1 - a) * 8).toFixed(1)}px)` : 'none';
          c.fillStyle = h ? (mode === 'light' && h === 1 ? C.white : C.void) : ink(mode); c.fillText(wObj.w, x - 12 * (1 - out3(a)), y); c.filter = 'none';
        }
        x += wd[i] + spc + (h && !(ws[i + 1] || {}).h ? 12 : 0);
      });
    });
    c.restore();
  }
  const capEnd = (sp) => sp.a + sp.lines.join(' ').split(' ').length / WPS; // when the last word lands

  // components
  const PILL = {amber: [C.amber, C.void], dark: [C.void, C.white], white: [C.white, C.void], green: [C.green, C.void], forest: [C.forest, C.white], fog: ['rgba(124,138,132,.25)', C.white]};
  function pill(c, t, at, x, y, text, o = {}) {
    const [bgc, fg] = PILL[o.kind || 'amber'], sz = o.size || 30;
    return withPop(c, t, at, x, y, (cc) => { cc.font = `700 ${sz}px ${MONO}`; const w = cc.measureText(text).width + sz * 1.3, h = sz * 1.75;
      cc.shadowColor = 'rgba(5,8,7,.35)'; cc.shadowBlur = 18; cc.shadowOffsetY = 8; cc.fillStyle = bgc; rr(cc, -w / 2, -h / 2, w, h, h / 2); cc.fill(); cc.shadowColor = 'transparent';
      cc.fillStyle = fg; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(text, 0, 2); }, {r0: o.rot ?? -0.1, r1: o.rot ?? 0, float: o.float});
  }
  const sticker = (c, t, at, x, y, text, o = {}) => { burst(c, t, at + 0.05, x, y, o.r || 190); return pill(c, t, at, x, y, text, {kind: 'amber', size: o.size || 64, rot: -0.07}); };
  function card(c, t, at, x, y, w, h, paint, o = {}) { // Signal White rounded card, soft shadow; rises 40 px
    if (t < at) return false; const q = seg(at, at + 0.38, t), s = 0.9 + 0.1 * back(q, 1.4), dy = 40 * (1 - out3(q));
    c.save(); c.translate(x, y + dy); c.scale(s, s); c.globalAlpha *= seg(at, at + 0.1, t);
    c.shadowColor = 'rgba(5,8,7,.38)'; c.shadowBlur = 40; c.shadowOffsetY = 16; c.fillStyle = o.fill || C.white; rr(c, -w / 2, -h / 2, w, h, o.r ?? 28); c.fill(); c.shadowColor = 'transparent';
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = 3; c.stroke(); }
    if (o.label) { c.font = `700 22px ${MONO}`; c.fillStyle = C.fog; c.textBaseline = 'top'; c.fillText(o.label, -w / 2 + 30, -h / 2 + 26); }
    if (paint) paint(c, w, h); c.restore(); return true;
  }
  function dotted(c, t, a, dur, pts, col = C.fog, o = {}) { // dotted leader drawn source -> target, head pops at the end
    const p = seg(a, a + dur, t); if (p <= 0) return; let L = 0; const ls = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); ls.push(d); L += d; }
    c.save(); c.strokeStyle = col; c.lineWidth = o.w || 6; c.lineCap = 'round'; c.setLineDash([2, 16]); c.beginPath(); c.moveTo(...pts[0]); let rem = L * out3(p), ex = pts[0];
    for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / ls[i - 1]); ex = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; c.lineTo(...ex); rem -= ls[i - 1]; }
    c.stroke(); c.setLineDash([]);
    if (p >= 1 && o.head !== false) { const n = pts.length, ang = Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]), hs = 22 * Math.min(1, back(seg(a + dur, a + dur + 0.2, t)));
      c.fillStyle = col; c.translate(...pts[n - 1]); c.rotate(ang); c.beginPath(); c.moveTo(4, 0); c.lineTo(-hs, -hs * 0.7); c.lineTo(-hs, hs * 0.7); c.closePath(); c.fill(); }
    c.restore();
  }
  function xMark(c, t, at, x, y, r, col = C.amber) { // two strokes, 0.13 s each, then a small shake
    const p1 = out3(seg(at, at + 0.13, t)), p2 = out3(seg(at + 0.13, at + 0.26, t)); if (p1 <= 0) return; const sh = 6 * Math.sin(t * 90) * (1 - seg(at + 0.26, at + 0.36, t)) * (t > at + 0.26 ? 1 : 0);
    c.save(); c.translate(x + sh, y); c.strokeStyle = col; c.lineWidth = r * 0.16; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-r, -r); c.lineTo(-r + 2 * r * p1, -r + 2 * r * p1); if (p2 > 0) { c.moveTo(r, -r); c.lineTo(r - 2 * r * p2, -r + 2 * r * p2); } c.stroke(); c.restore();
  }
  function burst(c, t, at, x, y, r, col = C.amber, n = 12) { // dashes push out and fade
    const p = seg(at, at + 0.35, t); if (p <= 0 || p >= 1) return; c.save(); c.strokeStyle = col; c.lineWidth = 8; c.lineCap = 'round'; c.globalAlpha *= 1 - p;
    for (let i = 0; i < n; i++) { const a = i / n * TAU, r0 = r * (0.8 + 0.5 * out3(p)); c.beginPath(); c.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); c.lineTo(x + Math.cos(a) * (r0 + 46), y + Math.sin(a) * (r0 + 46)); c.stroke(); }
    c.restore();
  }
  function stamp(c, t, at, x, y, text, o = {}) { // rubber stamp: 1.3 -> 1, 2-frame shake
    if (t < at) return; const q = seg(at, at + 0.12, t), s = lerp(1.35, 1, out3(q)), sh = t < at + 0.2 && q >= 1 ? 5 * Math.sin(t * 140) : 0, col = o.col || C.amber;
    c.save(); c.translate(x + sh, y); c.rotate(o.rot ?? -0.12); c.scale(s, s); c.globalAlpha *= seg(at, at + 0.05, t); c.font = `700 ${o.size || 70}px ${SG}`; const w = c.measureText(text).width + 50;
    c.strokeStyle = col; c.lineWidth = 8; rr(c, -w / 2, -60, w, 120, 14); c.stroke(); c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, 4); c.restore();
  }
  function qBubble(c, t, at, x, y, r = 54) { return withPop(c, t, at, x, y, (cc) => { cc.fillStyle = C.amber; cc.beginPath(); cc.arc(0, 0, r, 0, TAU); cc.fill(); cc.font = `700 ${r * 1.3}px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('?', 0, 4); }, {float: true}); }
  function chip(c, x, y, text, o = {}) { // token chip
    c.save(); c.font = `700 ${o.size || 40}px ${MONO}`; const w = Math.max(c.measureText(text).width + 40, 80), h = (o.size || 40) * 1.8;
    c.shadowColor = 'rgba(5,8,7,.3)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.fillStyle = o.fill || C.white; rr(c, x - w / 2, y - h / 2, w, h, 16); c.fill(); c.shadowColor = 'transparent';
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = 4; c.stroke(); } c.fillStyle = o.fg || C.void; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x, y + 2); c.restore(); return w;
  }
  function title(c, t, at, lines, o = {}) { // "This is called…" title: typed on at 28 chars/s, Amber underline swipes
    const mode = o.mode || 'light', sz = o.size || 104; let n = Math.floor((t - at) * 28); if (n < 0) return; c.save(); c.font = `700 ${sz}px ${SG}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = ink(mode);
    lines.forEach((ln, i) => { const s = ln.slice(0, Math.max(0, n)); n -= ln.length; c.fillText(s, 540, (o.y || 900) + i * sz * 1.1); });
    const done = at + lines.join('').length / 28, u = out3(seg(done, done + 0.3, t)), uw = 640 * u, uy = (o.y || 900) + lines.length * sz * 1.1 - sz * 0.35;
    if (u > 0) { c.strokeStyle = C.amber; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(540 - uw / 2, uy); c.quadraticCurveTo(540, uy + 18, 540 + uw / 2, uy); c.stroke(); }
    c.restore(); return done;
  }
  function endCard(c, t, at, o = {}) { // "Now you see" + big CODE card (the series sign-off). drift(c,t) paints the faint episode icons behind
    bg(c, t, 'dark'); if (o.drift) { c.save(); c.globalAlpha = 0.14; o.drift(c, t); c.restore(); }
    c.save(); c.font = `700 64px ${SG}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = seg(at, at + 0.2, t); c.fillStyle = C.white; c.fillText('Now you see', 540, 760); c.restore();
    burst(c, t, at + 0.5, 540, 960, 260); withPop(c, t, at + 0.45, 540, 960, (cc) => { cc.shadowColor = 'rgba(5,8,7,.5)'; cc.shadowBlur = 40; cc.shadowOffsetY = 16; cc.fillStyle = C.white; rr(cc, -330, -130, 660, 260, 36); cc.fill(); cc.shadowColor = 'transparent';
      cc.font = `700 190px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('the code', 0, 10, 600); }, {r0: -0.06, r1: -0.02});
    [[200, 640], [880, 600], [170, 1280], [900, 1330]].forEach(([x, y], i) => qBubble(c, t, at + 0.9 + i * 0.12, x, y, 34));
  }
  const label = (c, t, at, text, o = {}) => { c.save(); c.globalAlpha = seg(at, at + 0.3, t); c.font = `500 24px ${MONO}`; c.fillStyle = o.col || C.fog; c.textAlign = 'center'; c.fillText(text, o.x || 540, o.y || 1580); c.restore(); };
  // a drawn hand from below (Samrat's rule: short chunky rounded fingers held together, white cuff, Deep Forest sleeve)
  function hand(c, x, y, s = 1, press = 0) { // index finger raised, the other three curled into the palm, thumb tucked at the side (never a middle finger)
    c.save(); c.translate(x, y + 14 * press); c.scale(s, s); c.fillStyle = C.forest; rr(c, -90, 150, 180, 400, 50); c.fill(); c.fillStyle = C.white; rr(c, -96, 120, 192, 60, 26); c.fill();
    c.fillStyle = '#5B3E2E'; rr(c, -84, -20, 168, 160, 64); c.fill(); rr(c, -78, -130, 52, 150, 26); c.fill();
    c.fillStyle = '#3A281E'; [-18, 20, 56].forEach((fx) => { rr(c, fx - 2, -36, 38, 46, 18); c.fill(); }); c.fillStyle = '#5B3E2E'; [-18, 20, 56].forEach((fx) => { rr(c, fx, -32, 34, 40, 16); c.fill(); });
    c.fillStyle = '#7A5541'; rr(c, -104, 10, 44, 92, 22); c.fill(); c.fillStyle = 'rgba(255,220,190,.12)'; rr(c, -70, -122, 34, 24, 12); c.fill(); c.restore();
  }
  function enterKey(c, x, y, s = 1, press = 0, lit = false) {
    c.save(); c.translate(x, y + 10 * press); c.scale(s, s); c.fillStyle = '#033D22'; rr(c, -170, -90, 340, 200, 34); c.fill(); c.fillStyle = lit ? C.green : '#0C5E37'; rr(c, -160, -100 + 6 * press, 320, 180, 30); c.fill();
    c.font = `700 52px ${MONO}`; c.fillStyle = C.void; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('ENTER ⏎', 0, -10 + 6 * press); c.restore();
  }
  // a picked draft as an engine scene: its own clock scaled to the plan's span (scene.text.speed = D / span), its own sounds on that clock;
  // chrome(false) while the engine draws, so the engine's captions (re-timed to the real voice) replace the draft's own.
  // Keep-alive (Samrat: a move + its sound every 1.5–2 s): wherever the scene's own sounds leave a gap > 1 s of plan time, a beat is added —
  // a small punch-in of the picture (2.5 %, 0.25 s) and a sharp pop on the same frame.
  const SOFT = new Set(['key', 'tick', 'slide', 'whoosh', 'stroke', 'paper', 'riser']);
  function engineScene(fn, D, snd, chrome) {
    const own = []; const nop = new Proxy({}, {get: () => () => {}});
    if (snd) snd(nop, (n, t) => { if (!SOFT.has(n)) own.push(t); }, (x) => x); // soft beds (key runs, ticks, slides, whooshes) don't count as beats own.sort((x, y) => x - y);
    const cache = {}, fillers = (speed) => cache[speed] || (cache[speed] = (() => { const gap = 1.0 * speed, out = [], pts = [0].concat(own, [D]);
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (b - a <= gap) continue; const n = Math.floor((b - a) / (0.85 * speed)); for (let k = 1; k <= n; k++) { const x = a + (b - a) * k / (n + 1); if (x > 0.2 && x < D - 0.15) out.push(x); } }
      return out; })());
    return {at: 0, draw: (ctx, t, tx) => { const sp = (tx && tx.speed) || 1, tl = Math.min(D - 1e-3, t * sp); let bump = 0;
        for (const f of fillers(sp)) { const q = (tl - f) / (0.25 * sp); if (q > 0 && q < 1) bump = Math.max(bump, Math.sin(q * Math.PI)); }
        chrome(false); ctx.save(); try { const k = 1 + 0.025 * bump; ctx.translate(540, 960); ctx.scale(k, k); ctx.translate(-540, -960); fn(ctx, tl); } finally { ctx.restore(); chrome(true); } },
      sound: (k, Pl, c, end, start) => { const s = end > start ? D / (end - start) : 1; if (snd) snd(k, Pl, (x) => c(x / s)); fillers(+s.toFixed(4)).forEach((f, i) => Pl('pop', c(f / s), {f: 340 + (i % 3) * 90, g: 1.1})); }};
  }
  return {C, SG, MONO, TAU, engineScene, cl, lerp, seg, out3, io, back, pop, withPop, rr, bg, push, caption, capEnd, pill, sticker, card, dotted, xMark, burst, stamp, qBubble, chip, title, endCard, label, hand, enterKey, ink};
})();
