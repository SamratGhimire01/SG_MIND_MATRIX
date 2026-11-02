/* X001 "The End of the Click" — storyboard options v001: 3 drafts per scene (hook, THEN, NOW, NEXT), 1080x1920, pure functions of t.
   THEN = Editorial Collage kit (studied from _reference/styles/editorial-collage.js: torn edges, drop shadows, tape, highlighter sweep,
   cut-out Anton headlines, cut-outs on 12 fps steps, overlay grain + warm vignette) recoloured: red -> Deep Forest, yellow -> Amber, one green marker ring.
   NOW = the Manim style (08_templates/styles/manim, primitives from SGMM_MANIM.P). NEXT = Voxel kit (studied from _reference/styles/voxel.js:
   dimetric projection, three-tone faces, falling/stacking voxels) recoloured: grass -> Deep Forest, earth -> Amber-brown, sky -> Void, eye -> the one green;
   or the engine's flow field. The hook and the flow field reuse approved engine scenes. Needs sgmm_manim.js + the engine (SGMM) loaded first. */
window.X001_OPT = (() => {
  const P = SGMM_MANIM.P, {T, layout, drawTex, morphTex, strokePts, flash, arrow, arcPts, curvedArrow, rectPts, ghost, dot, axes, ax2s, SM, seg, sm, tab, mixc, rng, fnt, FAM, lerp, cl} = P;
  const C = {void: '#050807', white: '#F2F5F3', fog: '#7C8A84', forest: '#0B3D2E', amber: '#FFB547', green: '#00E676', paper: '#F0E9D9', card: '#F5F1E7', ink: '#1A1816', kraft: '#C9A878'};
  const TAU = Math.PI * 2, q12 = (t) => Math.floor(t * 12 + 1e-6) / 12;
  const ANTON = '"Anton", Impact, sans-serif', SERIF = '"Libre Baskerville", Georgia, serif';

  // ---------------- shared: act tag + caption, as the engine draws them
  let CHROME = true; // false inside the engine: it draws act tags and captions itself
  function actTag(c, t, num, label, col) {
    if (!CHROME) return;
    const inn = sm(0, 0.45, t), x = 72, y = 330; if (inn <= 0) return;
    c.save(); c.fillStyle = col; c.beginPath(); c.arc(x + 18, y, 18 * inn, 0, TAU); c.fill();
    c.beginPath(); c.rect(x + 48, y - 34, 360 * inn, 68); c.clip(); c.fillStyle = 'rgba(5,8,7,.55)'; c.fillRect(x + 48, y - 30, 360, 60);
    c.font = `500 26px ${FAM.mono}`; c.fillStyle = C.fog; c.textBaseline = 'middle'; c.fillText(num, x + 62, y + 1); c.font = `700 38px ${FAM.mono}`; c.fillStyle = col; c.fillText(label, x + 112, y + 2); c.restore();
  }
  function caption(c, t, caps) {
    if (!CHROME) return;
    for (const [a, b, txt] of caps) {
      if (t < a || t > b) continue; const al = Math.min(sm(a, a + 0.2, t), 1 - sm(b - 0.2, b, t));
      c.save(); c.globalAlpha = al; c.font = `500 44px ${FAM.mono}`; c.textBaseline = 'middle';
      txt.split('\n').forEach((ln, i) => { const parts = ln.split(/(\[[^\]]*\])/).filter(Boolean), w = parts.reduce((s, p) => s + c.measureText(p.replace(/[[\]]/g, '')).width, 0), y = 1440 + i * 60;
        let x = 540 - w / 2; c.fillStyle = 'rgba(5,8,7,.62)'; c.fillRect(x - 16, y - 30, w + 32, 60);
        for (const p of parts) { const g = p[0] === '['; const s = g ? p.slice(1, -1) : p; c.fillStyle = g ? C.green : C.white; c.fillText(s, x, y); x += c.measureText(s).width; } });
      c.restore();
    }
  }
  // the coin that threads the video: a flat disc with a rim (collage version gets paper texture)
  function coin(c, x, y, r, o = {}) {
    c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(o.squash || 1, 1);
    c.fillStyle = mixc(C.amber, '#000000', 0.35); c.beginPath(); c.arc(0, 6, r, 0, TAU); c.fill();
    c.fillStyle = C.amber; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.strokeStyle = mixc(C.amber, '#000000', 0.3); c.lineWidth = r * 0.08; c.beginPath(); c.arc(0, 0, r * 0.72, 0, TAU); c.stroke();
    if (o.halftone) { c.fillStyle = 'rgba(26,24,22,.18)'; for (let yy = -r; yy < r; yy += 9) for (let xx = -r; xx < r; xx += 9) { const d = Math.hypot(xx, yy); if (d < r - 4) { c.beginPath(); c.arc(xx + (yy % 18 ? 4.5 : 0), yy, 1.6 + 1.6 * (xx + r) / (2 * r), 0, TAU); c.fill(); } } }
    c.restore();
  }
  function cursor(c, x, y, s, col, o = {}) {
    c.save(); c.translate(x, y); c.scale(s * (o.press ? 0.9 : 1), s * (o.press ? 0.9 : 1));
    if (o.shadow) { c.shadowColor = 'rgba(40,28,15,.35)'; c.shadowBlur = 8; c.shadowOffsetX = 3; c.shadowOffsetY = 6; }
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 46); c.lineTo(11, 35); c.lineTo(20, 55); c.lineTo(28, 51); c.lineTo(19, 32); c.lineTo(34, 32); c.closePath();
    c.fillStyle = col; c.fill(); c.shadowColor = 'transparent'; c.strokeStyle = o.stroke || C.void; c.lineWidth = 2.5; c.stroke(); c.restore();
  }

  // ---------------- collage kit (recoloured editorial collage)
  const NZ = (() => { const r = rng(4242), g = Array.from({length: 512}, () => r() * 2 - 1); return (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(g[i & 511], g[(i + 1) & 511], u); }; })();
  function tornPoly(w, h, seed, amp = 6, torn = [1, 1, 1, 1]) {
    const r = rng(seed), cs = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [x + (r() - 0.5) * 4, y + (r() - 0.5) * 4]), out = [];
    for (let e = 0; e < 4; e++) {
      const [ax, ay] = cs[e], [bx, by] = cs[(e + 1) % 4], len = Math.hypot(bx - ax, by - ay), dx = (bx - ax) / len, dy = (by - ay) / len;
      if (!torn[e]) { out.push([ax, ay]); continue; }
      for (let d = 0; d < len; d += 3) { const fade = Math.min(1, d / 10, (len - d) / 10), off = (NZ(seed * 0.37 + e * 11.3 + d * 0.05) * amp * 1.6 + (r() - 0.5) * amp * 0.3) * fade; out.push([ax + dx * d + dy * off, ay + dy * d - dx * off]); }
    }
    return out;
  }
  const path = (c, p) => { c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]); c.closePath(); };
  function piece(c, x, y, rot, w, h, fill, seed, paint, o = {}) { // a torn paper cut-out with a soft shadow; paint draws inside it
    const poly = tornPoly(w, h, seed, o.amp ?? 6, o.torn);
    c.save(); c.translate(x, y); c.rotate(rot);
    c.save(); c.shadowColor = 'rgba(40,28,15,.38)'; c.shadowBlur = 14; c.shadowOffsetX = 4; c.shadowOffsetY = 8; path(c, poly); c.fillStyle = fill; c.fill(); c.restore();
    if (paint) { c.save(); path(c, poly); c.clip(); paint(c, w, h); c.restore(); }
    c.restore();
  }
  function tape(c, x, y, w, h, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(40,28,15,.22)'; c.shadowBlur = 3; c.shadowOffsetY = 1.5; c.fillStyle = 'rgba(228,216,186,.82)'; c.fillRect(-w / 2, -h / 2, w, h); c.shadowColor = 'transparent'; c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-w / 2, -h / 2 + h * (i + 0.5) / 4); c.lineTo(w / 2, -h / 2 + h * (i + 0.5) / 4); c.stroke(); } c.restore(); }
  function hilite(c, x, y, w, h, prog) { // Amber highlighter sweep (multiply)
    if (prog <= 0) return; const L = w * cl(prog);
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(255,181,71,.85)';
    c.beginPath(); c.moveTo(x, y + 3); for (let d = 0; d <= L; d += 8) c.lineTo(x + d, y + NZ(d * 0.03) * 4); c.lineTo(x + L, y + h); for (let d = L; d >= 0; d -= 8) c.lineTo(x + d, y + h + NZ(9 + d * 0.03) * 5); c.closePath(); c.fill(); c.restore();
  }
  function markerRing(c, cx, cy, rx, ry, prog, col, seed) { // hand-drawn loop, drawn on by fraction
    if (prog <= 0) return; const r = rng(seed), n = 60, pts = [];
    for (let i = 0; i <= n * 1.12; i++) { const a = -2.2 + (i / n) * TAU, k = 1 + (r() - 0.5) * 0.05 + i / n * 0.05; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    c.save(); c.globalAlpha = 0.92; strokePts(c, pts, col, 9, 0, prog); c.restore();
  }
  function strip(c, x, y, rot, text, px, fg, bg, seed) { // cut-out headline on a torn strip
    c.save(); c.font = `400 ${px}px ${ANTON}`; const w = c.measureText(text).width + px * 0.5, h = px * 1.15; c.restore();
    piece(c, x + w / 2, y, rot, w, h, bg, seed, (cc) => { cc.font = `400 ${px}px ${ANTON}`; cc.fillStyle = fg; cc.textBaseline = 'middle'; cc.fillText(text, -w / 2 + px * 0.25, px * 0.06); }, {amp: 3});
  }
  const GRAIN = (() => { let pat = null; return (c) => { if (pat) return pat; const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'), im = g.createImageData(256, 256), r = rng(900); for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 150; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); return (pat = c.createPattern(cv, 'repeat')); }; })();
  function paperBg(c, tint) { c.fillStyle = tint || C.paper; c.fillRect(0, 0, 1080, 1920); }
  function finish(c, t) { // grain that changes 12 times a second + warm vignette
    const f = Math.floor(t * 12), r = rng(5000 + f);
    c.save(); c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.26; c.fillStyle = GRAIN(c); c.translate(-r() * 256, -r() * 256); c.fillRect(0, 0, 1080 + 256, 1920 + 256); c.restore();
    c.save(); c.globalCompositeOperation = 'multiply'; const g = c.createRadialGradient(540, 960, 400, 540, 960, 1250); g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'rgb(226,222,214)'); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920); c.restore();
  }
  const drop = (t, a) => { const q = seg(a, a + 0.25, q12(t)); return q <= 0 ? null : {s: 1 + 0.12 * (1 - q) * (q < 1 ? 1 : 0), y: -40 * (1 - q), a: q > 0 ? 1 : 0}; };
  function resultSlip(c, x, y, i, seed, w = 760) { // one of the ten blue links, as a torn slip
    piece(c, x, y, (rng(seed)() - 0.5) * 0.05, w, 64, C.card, seed, (cc, W) => {
      cc.fillStyle = C.forest; cc.fillRect(-W / 2 + 26, -14, 300 + (i * 53 % 200), 7); cc.fillStyle = 'rgba(26,24,22,.45)'; cc.fillRect(-W / 2 + 26, 6, 220 + (i * 37 % 260), 4); cc.fillRect(-W / 2 + 26, 16, 160 + (i * 29 % 220), 4);
      cc.font = `400 18px ${SERIF}`; cc.fillStyle = 'rgba(26,24,22,.55)'; cc.fillText(String(i + 1), W / 2 - 40, 8);
    }, {amp: 4});
  }

  // ---------------- voxel kit (recoloured voxel diorama)
  const YAW = 0.62, ELEV = Math.PI / 6, sP = Math.sin(ELEV), cP = Math.cos(ELEV);
  const proj = (cx, cy, s, yaw = YAW) => { const ca = Math.cos(yaw), sa = Math.sin(yaw); return {P: (x, y, z) => [cx + (x * ca - y * sa) * s, cy + (x * sa + y * ca) * sP * s - z * cP * s], D: (x, y, z) => (x * sa + y * ca) * cP + z * sP}; };
  const FACES = [{n: [0, 0, 1], t1: [1, 0, 0], t2: [0, 1, 0], light: 1.0}, {n: [0, 1, 0], t1: [1, 0, 0], t2: [0, 0, 1], light: 0.8}, {n: [1, 0, 0], t1: [0, 1, 0], t2: [0, 0, 1], light: 0.64}];
  const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  function voxels(c, list, pr, opt = {}) { // list: {x,y,z,c:'#hex', e (emissive)}; culls hidden faces, simple AO from neighbours
    const key = (x, y, z) => x + ',' + y + ',' + z, has = new Set(list.filter((v) => !v.fall).map((v) => key(v.x, v.y, v.z)));
    [...list].sort((a, b) => pr.D(a.x, a.y, a.z) - pr.D(b.x, b.y, b.z)).forEach((v) => {
      const base = hexRgb(v.c);
      for (const F of FACES) {
        if (!v.fall && has.has(key(v.x + F.n[0], v.y + F.n[1], v.z + F.n[2]))) continue;
        const O = [v.x + (F.n[0] > 0 ? 1 : 0), v.y + (F.n[1] > 0 ? 1 : 0), v.z + (F.n[2] > 0 ? 1 : 0)];
        const p0 = pr.P(...O), p1 = pr.P(O[0] + F.t1[0], O[1] + F.t1[1], O[2] + F.t1[2]), p3 = pr.P(O[0] + F.t2[0], O[1] + F.t2[1], O[2] + F.t2[2]);
        let ao = 0; if (F === FACES[0]) for (const [dx, dy] of [[-1, 0], [0, -1], [-1, -1]]) if (has.has(key(v.x + dx, v.y + dy, v.z + 1))) ao++;
        const k = v.e ? 1 : F.light * (1 - ao * 0.09), col = base.map((ch) => Math.round(Math.min(255, ch * k + (v.e ? 30 : 0))));
        const st = `rgb(${col})`; c.fillStyle = st; c.strokeStyle = st; c.lineWidth = 0.7;
        c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.lineTo(p1[0] + p3[0] - p0[0], p1[1] + p3[1] - p0[1]); c.lineTo(p3[0], p3[1]); c.closePath(); c.fill(); c.stroke();
      }
    });
  }
  const fallIn = (list, t, at, dur = 0.35) => list.flatMap((v) => { const a = at(v); if (t < a) return []; if (t >= a + dur) return [v]; const q = (t - a) / dur; return [{...v, z: v.z + (1 - (1 - Math.pow(1 - q, 3))) * 7, fall: true}]; });
  function voxGround(c) { c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); const g = c.createRadialGradient(540, 1150, 60, 540, 1150, 900); g.addColorStop(0, 'rgba(11,61,46,.55)'); g.addColorStop(1, 'rgba(11,61,46,0)'); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920); }
  // a voxel web page: white slab with Deep Forest text lines
  function pageVox(ox, oy, oz) { const L = []; for (let x = 0; x < 7; x++) for (let z = 0; z < 9; z++) L.push({x: ox + x, y: oy, z: oz + z, c: (z % 2 === 1 && x > 0 && x < 6 - (z % 3)) ? '#2C5E4E' : '#E6EAE7'}); return L; }
  // the machine reader: a fog/white block tower with one green eye
  function machineVox(ox, oy) { const L = []; for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) for (let z = 0; z < 6; z++) if (z < 5 || (x > 0 && x < 3 && y > 0 && y < 3)) L.push({x: ox + x, y: oy + y, z, c: z < 1 ? '#3B4743' : '#B9C2BE'}); L.push({x: ox + 1, y: oy + 4, z: 3, c: C.green, e: true}); L.push({x: ox + 2, y: oy + 4, z: 3, c: C.green, e: true}); return L; }
  function coinVox(cx, cy, cz, R = 4) { const L = []; for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) { const d = Math.hypot(x, z); if (d <= R + 0.3) L.push({x: cx + x, y: cy, z: cz + z, c: d > R - 1.1 ? '#C98A2E' : (Math.abs(x) + Math.abs(z) < 2 ? '#E8A23C' : C.amber)}); } return L; }

  const CAPS = {
    hook: [[0.05, 2.55, 'Every time you don’t click a link…\nsomeone loses money.']],
    then: [[0.0, 2.0, 'The old deal was simple.'], [2.0, 5.4, 'You searched. Ten blue links.\nOne click paid the website.']],
    now: [[0.0, 2.4, 'But now AI answers on top.'], [2.4, 3.8, 'So you don’t click.'], [4.1, 7.2, 'One study: Google traffic to\npublishers fell 40% in a year.'], [7.5, 10.2, 'Condé Nast told its teams:\nplan as if search is zero.']],
    next: [[0.0, 2.6, 'So websites may write for AIs…\nnot for you.'], [3.0, 5.2, 'And when no one clicks…\nwho gets [paid?]']],
  };
  const LINK = 'example.com/the-story';

  // ============================== HOOK (2.6 s) ==============================
  function hookA(c, t) { // dark link: cursor hovers, drifts away, a coin drops past
    c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920);
    const la = sm(0.15, 0.5, t), hov = sm(0.95, 1.15, t) * (1 - sm(1.45, 1.6, t));
    c.save(); c.globalAlpha = la; c.font = `500 46px ${FAM.mono}`; c.textAlign = 'center'; c.fillStyle = mixc(C.fog, C.white, hov); c.fillText(LINK, 540, 860);
    const w = c.measureText(LINK).width; c.fillRect(540 - w / 2, 876, w, 3 + 3 * hov); c.restore();
    const into = sm(0.35, 1.0, t), away = sm(1.5, 2.2, t), cx = lerp(lerp(900, 640, into), 1100, away), cy = lerp(lerp(1250, 885, into), 760, away);
    cursor(c, cx, cy, 1.4, C.white, {stroke: C.void});
    const fall = seg(1.55, 2.5, t); if (fall > 0) { const y = lerp(540, 2050, fall * fall); coin(c, 540, y, 58, {rot: fall * 2.2, squash: 0.35 + 0.65 * Math.abs(Math.cos(fall * 7))}); }
    caption(c, t, CAPS.hook);
  }
  function hookB(c, t) { // the approved studio hook: pitch black, hand, Enter floods the room
    if (!hookB.ep) hookB.ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 2.6, score: null, scenes: [{type: 'enter_in_dark', t: [0, 2.6]}], captions: CAPS.hook.map(([a, b, x]) => ({t: [a, b], text: x}))});
    hookB.ep.render(c, c.canvas.width, c.canvas.height, t, true);
  }
  function hookC(c, t) { // collage cold open: a torn link slip on dark kraft, a paper cursor on 12 fps steps, a paper coin slides off
    const tq = q12(t); c.fillStyle = '#2A2118'; c.fillRect(0, 0, 1080, 1920);
    const sl = drop(t, 0.1); if (sl) piece(c, 540, 880 + sl.y, -0.03, 820, 120, C.card, 31, (cc, W) => { cc.font = `500 40px ${FAM.mono}`; cc.fillStyle = C.forest; cc.textAlign = 'center'; cc.fillText(LINK, 0, 12); cc.fillRect(-300, 26, 600, 4); });
    const into = SM(seg(0.4, 1.0, tq)), away = SM(seg(1.4, 2.0, tq)); cursor(c, lerp(lerp(950, 700, into), 1150, away), lerp(lerp(1300, 920, into), 820, away), 1.6, C.card, {shadow: true, stroke: C.ink});
    const f = seg(1.5, 2.4, tq); if (f > 0) coin(c, lerp(540, 1250, f * f), lerp(1150, 1300, f), 62, {rot: f * 3, halftone: true});
    finish(c, t); caption(c, t, CAPS.hook);
  }

  // ============================== THEN (5.4 s, collage, amber act) ==============================
  function thenA(c, t) { // the search page: search box, ten torn result slips, highlighter, click, green ring, coin lands on WEBSITE
    paperBg(c); actTag(c, t, '01', 'THEN', C.amber);
    const h = drop(t, 0.05); if (h) strip(c, 90, 470 + h.y, -0.04, 'THE OLD DEAL', 120, C.paper, C.forest, 7);
    const sb = drop(t, 0.5); if (sb) piece(c, 540, 650 + sb.y, 0.015, 860, 96, '#FFFFFF', 12, (cc, W) => { cc.strokeStyle = C.ink; cc.lineWidth = 3; cc.beginPath(); cc.arc(-W / 2 + 50, -4, 16, 0, TAU); cc.moveTo(-W / 2 + 62, 8); cc.lineTo(-W / 2 + 74, 20); cc.stroke(); cc.font = `500 34px ${FAM.mono}`; cc.fillStyle = C.ink; cc.fillText('how does the web make money', -W / 2 + 96, 10); });
    for (let i = 0; i < 10; i++) { const d = drop(t, 1.0 + i * 0.1); if (d) resultSlip(c, 520 + (i % 2 ? 8 : -6), 760 + i * 66 + d.y, i, 100 + i); }
    hilite(c, 170, 760 + 2 * 66 - 20, 520, 36, seg(3.0, 3.4, q12(t)));
    const cl1 = seg(3.3, 3.7, q12(t)); if (cl1 > 0) cursor(c, lerp(980, 720, SM(cl1)), lerp(1500, 905, SM(cl1)), 1.5, C.card, {shadow: true, stroke: C.ink, press: t > 3.7 && t < 3.85});
    markerRing(c, 520, 760 + 2 * 66, 440, 58, seg(3.75, 4.2, t), C.green, 5);
    const ws = drop(t, 4.0); if (ws) { piece(c, 760, 1225 + ws.y, 0.06, 360, 170, C.card, 44, (cc) => { cc.font = `400 64px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText('WEBSITE', 0, 22); }); tape(c, 760, 1143 + ws.y, 120, 34, -0.1); }
    const cf = seg(4.25, 4.6, q12(t)); if (cf > 0) coin(c, lerp(720, 925, cf), lerp(1000, 1150, cf * cf), 52, {halftone: true, rot: cf});
    finish(c, t); caption(c, t, CAPS.then);
  }
  function thenB(c, t) { // the deal as a cut-out diagram: YOU -> SEARCH -> WEBSITE, ink arrows, the coin travels the chain
    paperBg(c, '#EFE6D2'); actTag(c, t, '01', 'THEN', C.amber);
    const h = drop(t, 0.05); if (h) strip(c, 90, 470 + h.y, 0.03, 'THE OLD DEAL', 120, C.paper, C.forest, 8);
    const card = (y, label, a, seed, rot) => { const d = drop(t, a); if (d) piece(c, 540, y + d.y, rot, 520, 150, C.card, seed, (cc) => { cc.font = `400 84px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText(label, 0, 30); }); };
    card(660, 'YOU', 0.6, 51, -0.03); card(980, 'SEARCH', 1.2, 52, 0.02); card(1300, 'WEBSITE', 2.0, 53, -0.02);
    for (let i = 0; i < 10; i++) { const d = drop(t, 1.5 + i * 0.07); if (d) piece(c, 880 + (i % 3) * 18, 905 + i * 16 + d.y, 0.25 + i * 0.03, 150, 20, C.card, 200 + i, (cc) => { cc.fillStyle = C.forest; cc.fillRect(-60, -3, 90, 5); }, {amp: 2}); }
    const ink = (y0, y1, a) => { const p = seg(a, a + 0.4, t); if (p > 0) arrow(c, 540, y0, 540, lerp(y0, y1, p), C.ink, 5, 1, 22); };
    ink(745, 895, 1.0); ink(1065, 1215, 2.3);
    const cp = seg(3.0, 4.3, q12(t)); if (cp > 0) { const y = cp < 0.5 ? lerp(660, 980, SM(cp * 2)) : lerp(980, 1300, SM(cp * 2 - 1)); coin(c, 760, y, 50, {halftone: true, rot: cp * 4}); }
    hilite(c, 330, 1270, 420, 52, seg(4.3, 4.7, q12(t)));
    markerRing(c, 540, 1300, 300, 105, seg(4.6, 5.1, t), C.green, 9);
    finish(c, t); caption(c, t, CAPS.then);
  }
  function thenC(c, t) { // a newspaper clipping "RESULTS 1–10", highlighter on result 1, a CLICK rubber stamp, coin lands on PAID
    paperBg(c); actTag(c, t, '01', 'THEN', C.amber);
    const k = drop(t, 0.1); if (k) piece(c, 540, 1000 + k.y, -0.025, 820, 900, '#E9E1CB', 61, (cc, W, H) => {
      cc.font = `400 92px ${ANTON}`; cc.fillStyle = C.ink; cc.fillText('RESULTS 1–10', -W / 2 + 40, -H / 2 + 120); cc.fillRect(-W / 2 + 40, -H / 2 + 145, W - 80, 4);
      for (let i = 0; i < 10; i++) { const y = -H / 2 + 200 + i * 66; cc.font = `700 26px ${SERIF}`; cc.fillStyle = C.ink; cc.fillText(`${i + 1}.`, -W / 2 + 40, y); cc.fillStyle = C.forest; cc.fillRect(-W / 2 + 92, y - 16, 330 + (i * 47 % 200), 7); cc.fillStyle = 'rgba(26,24,22,.4)'; cc.fillRect(-W / 2 + 92, y + 2, 250 + (i * 31 % 250), 4); }
    });
    if (k) tape(c, 300, 560 + k.y, 150, 38, -0.2);
    hilite(c, 220, 1000 - 450 + 200 - 34 + (k ? k.y : 0), 520, 40, seg(1.4, 1.8, q12(t)));
    const st = seg(2.4, 2.5, q12(t)); if (st > 0) { c.save(); c.translate(760, 760); c.rotate(-0.18); c.scale(1.3 - 0.3 * st, 1.3 - 0.3 * st); c.globalAlpha = 0.85 * st; c.strokeStyle = C.forest; c.lineWidth = 7; c.strokeRect(-130, -50, 260, 100); c.font = `400 72px ${ANTON}`; c.fillStyle = C.forest; c.textAlign = 'center'; c.fillText('CLICK', 0, 26); c.restore(); }
    const pd = drop(t, 3.2); if (pd) strip(c, 640, 1290 + pd.y, 0.05, 'PAID', 110, C.ink, C.card, 70);
    const cf = seg(3.6, 4.1, q12(t)); if (cf > 0) coin(c, lerp(500, 760, cf), lerp(800, 1240, cf * cf), 52, {halftone: true, rot: cf * 2});
    markerRing(c, 740, 1290, 170, 90, seg(4.3, 4.8, t), C.green, 11);
    finish(c, t); caption(c, t, CAPS.then);
  }

  // ============================== NOW (10.2 s, Manim, white act) ==============================
  const ROWS = Array.from({length: 10}, (_, i) => ({y: 820 + i * 50, w: 360 + (i * 97 % 300)}));
  function nowIntro(c, t) { // 0–3.8: answer box writes on above the links, links shrink and fade ("so you don't click")
    const fade = sm(2.4, 3.4, t), gone = sm(3.4, 3.9, t);
    ROWS.forEach((R, i) => { const p = sm(0.05 + i * 0.05, 0.45 + i * 0.05, t), k = 1 - 0.55 * fade, a = (1 - 0.75 * fade) * (1 - gone); if (p > 0) { dot(c, 180, R.y - 4, 6, C.fog, a); strokePts(c, [[210, R.y - 8], [210 + R.w * k, R.y - 8]], C.white, 6, 0, p, a * 0.9); strokePts(c, [[210, R.y + 10], [210 + R.w * 0.6 * k, R.y + 10]], C.fog, 3, 0, p, a * 0.8); } });
    const bp = sm(0.5, 1.1, t), ba = 1 - gone; if (bp > 0) strokePts(c, rectPts(150, 540, 930, 760), C.white, 4, 0, bp, ba);
    const lab = layout(c, [T('AI answer', {f: 'mono', sz: 0.8})], 30, 180, 590); drawTex(c, lab, {p: seg(0.8, 1.2, t), alpha: ba, col: C.fog});
    const a1 = layout(c, [T('Here’s the answer,', {f: 'sg'})], 48, 180, 660), a2 = layout(c, [T('in plain sentences.', {f: 'sg'})], 48, 180, 720);
    drawTex(c, a1, {p: seg(1.0, 1.8, t), alpha: ba}); drawTex(c, a2, {p: seg(1.3, 2.1, t), alpha: ba});
    const cz = sm(2.4, 2.8, t) * (1 - sm(3.2, 3.6, t)); if (cz > 0) { c.save(); c.globalAlpha = cz; cursor(c, 640, 1060, 1.2, C.white); c.restore(); strokePts(c, [[600, 1080], [700, 1160]], C.amber, 5, 0, cz); strokePts(c, [[700, 1080], [600, 1160]], C.amber, 5, 0, cz); }
  }
  const studyLabel = (c, t, a, y, alpha = 1) => { const l1 = layout(c, [T('Google Search → publishers · Jul 2025 → Jul 2026', {f: 'mono'})], 26, 540, y, 'center'), l2 = layout(c, [T('one study · Chartbeat via Search Engine Journal', {f: 'mono'})], 26, 540, y + 40, 'center'); drawTex(c, l1, {p: seg(a, a + 0.5, t), alpha, col: C.fog}); drawTex(c, l2, {p: seg(a + 0.2, a + 0.7, t), alpha, col: C.fog}); };
  function zeroEq(c, t, a, y) { // Condé Nast: "plan as if search = 0"; "Google Zero" as the label
    const pre = layout(c, [T('Condé Nast: plan as if', {f: 'sg'})], 44, 540, y - 120, 'center'); drawTex(c, pre, {p: seg(a, a + 0.6, t)});
    const eq = layout(c, [T('search', {it: true}), T(' = '), T('0')], 120, 540, y + 20, 'center'); drawTex(c, eq, {p: seg(a + 0.4, a + 1.3, t)});
    const ind = tab(a + 1.4, a + 1.9, t); if (ind > 0) { const z = eq.gl[eq.gl.length - 1]; P.glyph(c, z, 1, ind, C.amber, z.x - z.sz * 0.05 * ind, z.y, 1 + 0.2 * ind); }
    const gz = layout(c, [T('“Google Zero”', {f: 'mono'})], 30, 540, y + 100, 'center'); drawTex(c, gz, {p: seg(a + 1.2, a + 1.6, t), col: C.fog});
  }
  function nowA(c, t) { // answer on top -> hero −40.2% writes on -> "search = 0"
    c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); actTag(c, t, '02', 'NOW', C.white); nowIntro(c, t);
    const out = sm(7.1, 7.5, t), hp = seg(4.1, 5.1, t);
    const hero = layout(c, [T('−', {f: 'stix'}), T('40.2', {f: 'stix'}), T('%', {f: 'stix'})], 230, 540, 900, 'center');
    if (hp > 0) { const ind = tab(5.3, 5.8, t); drawTex(c, hero, {p: hp, col: C.green, alpha: 1 - out, scale: 1 + 0.12 * ind}); studyLabel(c, t, 5.0, 1000, 1 - out); }
    if (t > 7.4) zeroEq(c, t, 7.5, 900);
    caption(c, t, CAPS.now);
  }
  function nowB(c, t) { // the two real data points as a Manim chart; a dashed line to zero = Condé Nast's plan (not data)
    c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); actTag(c, t, '02', 'NOW', C.white); nowIntro(c, t);
    const A = {ox: 200, oy: 1230, ux: 300, uy: 5, xn: 2, yn: 100}, ap = seg(4.0, 4.6, t);
    if (ap > 0) {
      strokePts(c, [[A.ox, A.oy], [A.ox + 2.4 * A.ux, A.oy]], C.white, 3, 0, SM(ap)); strokePts(c, [[A.ox, A.oy], [A.ox, A.oy - 560]], C.white, 3, 0, SM(ap));
      const yl = layout(c, [T('Google traffic', {f: 'mono'})], 26, A.ox + 14, A.oy - 560); drawTex(c, yl, {p: seg(4.2, 4.6, t), col: C.fog});
      const x1 = layout(c, [T('Jul ’25', {f: 'mono'})], 28, A.ox + 0.5 * A.ux, A.oy + 46, 'center'), x2 = layout(c, [T('Jul ’26', {f: 'mono'})], 28, A.ox + 1.5 * A.ux, A.oy + 46, 'center');
      drawTex(c, x1, {p: seg(4.3, 4.7, t), col: C.fog}); drawTex(c, x2, {p: seg(4.4, 4.8, t), col: C.fog});
      const p1 = [A.ox + 0.5 * A.ux, A.oy - 100 * A.uy], p2 = [A.ox + 1.5 * A.ux, A.oy - 59.8 * A.uy];
      dot(c, ...p1, 14 * sm(4.5, 4.8, t), C.white);
      const hop = sm(4.9, 5.6, t); if (hop > 0) { ghost(c, ...p1, 14, C.amber, hop); curvedArrow(c, arcPts(p1[0] + 10, p1[1] - 16, p2[0] - 6, p2[1] - 20, -0.3, 30), C.amber, 3.5, hop, 18); strokePts(c, [p1, p2], C.white, 4, 0, hop); dot(c, lerp(p1[0], p2[0], hop), lerp(p1[1], p2[1], hop), 14, C.white); }
      const hl = layout(c, [T('−40.2%', {f: 'stix'})], 110, p2[0] + 30, p2[1] - 40); drawTex(c, hl, {p: seg(5.5, 6.2, t), col: C.green});
      studyLabel(c, t, 6.0, A.oy + 110);
      const dp = sm(7.5, 8.6, t); if (dp > 0) { c.save(); c.setLineDash([14, 12]); strokePts(c, [p2, [A.ox + 2.3 * A.ux, A.oy]], C.amber, 4, 0, dp); c.restore(); }
      const pl = layout(c, [T('Condé Nast’s plan: as if search = 0', {f: 'mono'})], 28, A.ox + 2.3 * A.ux, A.oy - 40, 'right'); drawTex(c, pl, {p: seg(8.4, 9.0, t), col: C.amber});
      const gz = layout(c, [T('“Google Zero”', {f: 'mono'})], 28, A.ox + 2.3 * A.ux, A.oy - 80, 'right'); drawTex(c, gz, {p: seg(8.8, 9.3, t), col: C.fog});
    }
    caption(c, t, CAPS.now);
  }
  function nowC(c, t) { // ten clicks; four get crossed out in Amber (≈40%); then all of them run to zero
    c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); actTag(c, t, '02', 'NOW', C.white); nowIntro(c, t);
    const zero = sm(7.6, 8.4, t);
    for (let i = 0; i < 10; i++) {
      const x = 240 + (i % 5) * 150, y = 760 + Math.floor(i / 5) * 190, a = sm(4.0 + i * 0.05, 4.3 + i * 0.05, t), lost = i >= 6 ? sm(4.9 + (i - 6) * 0.15, 5.2 + (i - 6) * 0.15, t) : 0;
      if (a <= 0) continue; const alpha = a * (1 - 0.7 * lost) * (1 - zero * (i < 6 ? 0.85 : 0.2));
      c.save(); c.globalAlpha = alpha; cursor(c, x - 18, y - 30, 1.1, i >= 6 ? mixc(C.white, C.amber, lost) : C.white); c.restore();
      if (lost > 0) { strokePts(c, [[x - 34, y - 36], [x + 34, y + 36]], C.amber, 5, 0, lost); strokePts(c, [[x + 34, y - 36], [x - 34, y + 36]], C.amber, 5, 0, lost); }
    }
    const lab = layout(c, [T('10', {f: 'stix'}), T(' clicks', {f: 'mono', sz: 0.7})], 60, 540, 700, 'center'), lab2 = layout(c, [T('6', {f: 'stix'}), T(' clicks', {f: 'mono', sz: 0.7})], 60, 540, 700, 'center');
    const mq = sm(5.6, 6.0, t); if (mq <= 0) drawTex(c, lab, {p: seg(4.0, 4.4, t), alpha: 1 - zero}); else morphTex(c, lab, lab2, mq, {alpha: 1 - zero});
    const hero = layout(c, [T('−40%', {f: 'stix'})], 150, 540, 1240, 'center'); drawTex(c, hero, {p: seg(5.7, 6.4, t), col: C.green, alpha: 1 - zero});
    studyLabel(c, t, 6.2, 1320, 1 - zero);
    if (t > 7.6) zeroEq(c, t, 7.8, 980);
    caption(c, t, CAPS.now);
  }

  // ============================== NEXT (5.2 s, green act) ==============================
  function nextA(c, t) { // voxel: two web pages break into blocks that rain into a machine with one green eye; the amber coin hangs, unclaimed
    voxGround(c); actTag(c, t, '03', 'NEXT', C.green);
    const pr = proj(540, 1180, 34), list = [];
    const pages = [...pageVox(-9, -2, 2), ...pageVox(-9, 4, 2)], mach = machineVox(4, -1);
    const k = sm(0.6, 2.4, t);
    pages.forEach((v, i) => { const d = ((i * 37) % 23) / 23, q = sm(0.6 + d * 1.2, 1.2 + d * 1.2, t); if (q >= 1) return; list.push({...v, x: Math.round(lerp(v.x, 5 + (i % 2), q)), y: Math.round(lerp(v.y, 1 + (i % 3) % 2, q)), z: Math.round(lerp(v.z, 6 + (i % 4), q * q)), fall: q > 0}); });
    list.push(...fallIn(mach, t, (v) => 0.1 + v.z * 0.08 + (v.x + v.y) * 0.02));
    for (let x = -11; x < 10; x++) for (let y = -4; y < 7; y++) list.push({x, y, z: -1, c: (x + y) % 2 ? '#0B3D2E' : '#0E4636'});
    voxels(c, list, pr);
    const cpr = proj(540, 640, 26, 0.62 + t * 0.9); voxels(c, coinVox(0, 0, 0), cpr);
    caption(c, t, CAPS.next);
  }
  function nextB(c, t) { // the engine's NEXT flow field, with the flat amber coin hanging over it
    if (!nextB.ep) nextB.ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 5.2, score: null, scenes: [{type: 'field_push', t: [0, 5.2]}], act_tags: [{t: [0, 5.2], num: '03', label: 'NEXT'}], captions: CAPS.next.map(([a, b, x]) => ({t: [a, b], text: x}))});
    nextB.ep.render(c, c.canvas.width, c.canvas.height, t, true);
    const a = sm(3.0, 3.6, t); if (a > 0) { c.save(); c.globalAlpha = a; coin(c, 540, 700 + 10 * Math.sin(t * 2), 70, {squash: Math.abs(Math.cos(t * 1.4)) * 0.8 + 0.2}); c.restore(); }
  }
  function nextC(c, t) { // voxel close-up: a voxel page stack rebuilds into a machine-readable block grid; one green block reads it; the coin turns alone
    voxGround(c); actTag(c, t, '03', 'NEXT', C.green);
    const pr = proj(540, 1120, 40), list = [];
    for (let x = 0; x < 6; x++) for (let y = 0; y < 6; y++) { const h = 1 + ((x * 3 + y * 5) % 4); for (let z = 0; z < h; z++) list.push({x: x - 3, y: y - 3, z, c: z === h - 1 ? '#E6EAE7' : '#9AA5A0'}); }
    const built = fallIn(list, t, (v) => 0.2 + (v.x + v.y + 6) * 0.07 + v.z * 0.12);
    built.push({x: 3, y: 3, z: 0, c: C.green, e: true});
    voxels(c, built, pr);
    const cpr = proj(540, 560, 24, 0.62 + t * 1.1); voxels(c, coinVox(0, 0, 0), cpr);
    caption(c, t, CAPS.next);
  }

  /* Samrat's picks (2 Nov 2026): hook A, THEN A, NOW A, NEXT A -> engine scene types (each on its own clock from 0) */
  const engineScene = (fn, sound) => ({at: 0, sound, draw: (ctx, t) => { CHROME = false; try { fn(ctx, t); } finally { CHROME = true; } }});
  /* sounds from the approved Sufi kit, on each scene's own clock (c = scene time -> plan time) */
  const coinDrop = (k, P, t) => { P('put', t, {g: 0.9}); P('ding', t + 0.02, {f: 1975, g: 0.22}); P('ding', t + 0.16, {f: 1975, g: 0.08}); };
  const SND = {
    hook: (k, P, c) => { k.tone(c(0.2), {f: [[0, 60], [0.2, 40]], dur: 0.3, gain: 0.5, bus: 'music'}); P('tick', c(1.0), {f: 3200, g: 0.35}); P('whoosh', c(1.55), {dur: 0.5, top: 1800, g: 0.25}); coinDrop(k, P, c(1.95)); },
    then: (k, P, c) => { P('put', c(0.05), {g: 0.9}); P('slide', c(0.5), {dur: 0.25, g: 0.7}); P('put', c(0.62), {g: 0.6});
      for (let i = 0; i < 10; i++) P('paper', c(1.0 + i * 0.1), {dur: 0.18, g: 0.35 + 0.03 * i, pan: i % 2 ? 0.2 : -0.2});
      P('stroke', c(3.0), {material: 'marker', dur: 0.4, g: 0.8}); P('click', c(3.72), {f: 2200, g: 0.9}); P('stroke', c(3.75), {material: 'marker', dur: 0.45, g: 0.9, pan: 0.2});
      P('put', c(4.0), {g: 0.9, pan: 0.4}); P('tear', c(4.05), {g: 0.5, pan: 0.4}); coinDrop(k, P, c(4.6)); },
    now: (k, P, c) => { for (let i = 0; i < 10; i++) P('tick', c(0.05 + i * 0.05), {f: 1800, g: 0.2, pan: -0.2}); P('stroke', c(1.0), {material: 'pen', dur: 1.0, g: 0.35});
      P('tick', c(2.45), {f: 2600, g: 0.4}); P('whoosh', c(2.5), {dur: 0.9, top: 1300, g: 0.4});
      P('stroke', c(4.1), {material: 'pen', dur: 0.9, g: 0.45}); k.daf(c(5.3), 'tek', 0.6); k.ney([[c(5.1), 587.33, 0.9, 1]], {gain: 0.06});
      P('whoosh', c(7.1), {dur: 0.5, top: 1100, g: 0.3}); P('stroke', c(7.6), {material: 'pen', dur: 1.2, g: 0.4}); k.daf(c(9.2), 'tek', 0.7); },
    next: (k, P, c) => { for (let i = 0; i < 18; i++) P('key', c(0.6 + i * 0.1), {g: 0.3 + 0.02 * (i % 4), pan: -0.3 + (i % 5) * 0.15}); P('click', c(1.3), {f: 3000, g: 0.4});
      P('ding', c(3.0), {f: 1318.5, g: 0.12}); },
  };
  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, {
    x001_hook_link: engineScene(hookA, SND.hook), x001_then_search: engineScene(thenA, SND.then), x001_now_answer: engineScene(nowA, SND.now), x001_next_voxel: engineScene(nextA, SND.next)});
  return {CAPS, scenes: [
    {id: 'hook', label: 'Hook', act: 'cold open', lines: 'L01', dur: 2.6, options: [
      {name: 'Dark link', draw: hookA, keys: [0.6, 1.2, 1.9], note: 'Pitch black; one link fades in, the cursor hovers, then drifts away; a coin falls past. Most literal match to the line; Manim-clean.'},
      {name: 'Studio Enter (approved)', draw: hookB, keys: [0.4, 1.2, 2.0], note: 'EP000’s approved hook: pitch black, hand, Enter floods the room. On-brand and proven, but says nothing about links or money.'},
      {name: 'Collage cold open', draw: hookC, keys: [0.6, 1.2, 2.0], note: 'Dark kraft paper, a torn link slip, a paper cursor on 12 fps steps, a halftone coin slides away. Warm; previews the THEN look.'}]},
    {id: 'then', label: 'THEN', act: 'Editorial Collage', lines: 'L02–L03', dur: 5.4, options: [
      {name: 'The search page', draw: thenA, keys: [1.6, 3.5, 5.0], note: '“THE OLD DEAL” cut-out, a search box, ten torn result slips drop in, Amber highlighter, paper cursor click, green marker ring, the coin lands on WEBSITE.'},
      {name: 'The deal as a diagram', draw: thenB, keys: [1.4, 3.6, 5.1], note: 'YOU → SEARCH → WEBSITE cut-out cards with ink arrows; ten tiny slips fan out; the coin travels the chain; green ring on WEBSITE.'},
      {name: 'Results clipping', draw: thenC, keys: [1.7, 2.7, 5.0], note: 'A newspaper-style clipping “RESULTS 1–10”, highlighter on #3, a CLICK rubber stamp, the coin drops onto a PAID strip with the green ring.'}]},
    {id: 'now', label: 'NOW', act: 'Manim', lines: 'L04–L07', dur: 10.2, options: [
      {name: 'Answer, then −40.2%', draw: nowA, keys: [1.6, 3.0, 5.6, 9.4], note: 'The answer box writes on above the links; the links shrink (Amber cross on the click); a huge green −40.2% writes on with the source; then “search = 0”.'},
      {name: 'Two-point chart', draw: nowB, keys: [1.6, 5.6, 6.6, 9.6], note: 'Only the two real data points (Jul 2025, Jul 2026) on Manim axes, a descent hop with a ghost dot, green −40.2%; a dashed Amber line to zero labelled as Condé Nast’s plan, not data.'},
      {name: 'Ten clicks', draw: nowC, keys: [1.6, 5.4, 6.6, 9.6], note: 'Ten cursors; four get Amber crosses (about 4 in 10); “10 clicks” Transforms to “6”; green −40%; then all fade and “search = 0” writes on. Most visual, slightly rounded (40.2% → 4 in 10).'}]},
    {id: 'next', label: 'NEXT', act: 'Voxel or Flow Field', lines: 'L08–L09', dur: 5.2, options: [
      {name: 'Voxel: pages → machine', draw: nextA, keys: [0.8, 2.0, 4.4], note: 'Two voxel web pages break into blocks that rain into a block machine with one green eye; the Amber voxel coin turns above, unclaimed.'},
      {name: 'Flow field + coin', draw: nextB, keys: [0.8, 2.4, 4.4], note: 'The approved NEXT flow field with 3D forms converging; the flat Amber coin hangs over it on the question.'},
      {name: 'Voxel: page grid', draw: nextC, keys: [0.8, 2.0, 4.4], note: 'A voxel page rebuilds itself as a block grid machines read; one green block reads it; the coin turns alone above.'}]},
  ]};
})();
