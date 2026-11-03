/* X004 SHIFT "The Trust Gap" — storyboard options v001: 3 drafts per scene, 1080x1920, pure functions of t.
   A and B = the X001–X003 SHIFT look (approved: Enter hook, THEN Editorial Collage, NOW Manim, NEXT flow field / voxel, mono captions at the bottom).
   C = the same beat as a Pop Explainer scene (SGMM_POP: caption builds at the top, pops, Deep Forest / Signal White stage) — the "combination" option.
   Numbers: Stack Overflow Developer Survey 2026 (n = 30,903), see ../research/SGMM_X004_sources_v001.md.
   Needs sgmm_manim.js, x001_options.js (SGMM_KIT), the engine (SGMM) and SGMM_POP loaded first. */
window.X004_OPT = (() => {
  const K = SGMM_KIT, M = SGMM_MANIM.P, P = SGMM_POP, {C, TAU} = K, {T, layout, drawTex, strokePts, rectPts, dot, SM, seg, sm, tab, lerp} = M;
  const CAPS = {
    hook: [[0.05, 2.75, 'It answered in two seconds.\nDid you check it?']],
    then: [[0.0, 4.5, 'Coders used to ask strangers\non forums… and wait hours\nfor a tick.']],
    now: [[0.0, 2.6, 'But now, more than seven in ten\nuse AI every day.'], [2.8, 5.8, 'So they trust it? Only 16%\ntrust it with most tasks.'], [6.0, 8.8, 'Most trust it only when\nthey can check the answer.']],
    next: [[0.0, 3.0, 'So the next skill may not be\nasking… but checking.'], [3.2, 5.4, 'Because when it answers\nin two seconds—']],
  };
  const POPCAPS = {
    hook: [[0.0, 2.8, 'It answered in *two seconds*.\nDid you *check it?*']],
    then: [[0.0, 4.6, 'Coders used to ask *strangers*…\nand wait *hours* for a tick.']],
    now: [[0.0, 2.7, 'But now, *more than 7 in 10*\nuse AI every day.'], [2.7, 5.9, 'So they trust it? Only *16%*\ntrust it with most tasks.'], [5.9, 9.0, 'Most trust it only when\nthey can *check the answer*.']],
    next: [[0.0, 3.1, 'So the next skill may not be\nasking… but *checking*.'], [3.1, 5.6, 'Because when it answers\nin *two seconds*—']],
  };
  let CH = true; const cap = (c, t, k) => K.caption(c, t, CAPS[k]), pcap = (c, t, k, mode) => { if (CH) P.caption(c, t, POPCAPS[k], mode); };
  const voidBg = (c) => { c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); };
  const SRC = 'Stack Overflow Developer Survey 2026 · 30,903 developers';
  const src = (c, t, a, y = 1330) => drawTex(c, layout(c, [T(SRC, {f: 'mono'})], 22, 540, y, 'center'), {p: seg(a, a + 0.6, t), col: C.fog});
  const ANS = ['Use a hash map: store each value', 'with its index, then look up', 'target − value in one pass.'];
  function answerLines(c, t, a, x, y, col, rate = 26) { c.save(); c.font = `500 40px ${M.FAM.mono}`; c.fillStyle = col; let n = Math.floor((t - a) * rate); ANS.forEach((ln, i) => { if (n <= 0) return; c.fillText(ln.slice(0, n), x, y + i * 60); n -= ln.length; }); c.restore(); }
  const person = (c, x, y, s, fill) => { c.fillStyle = fill; c.beginPath(); c.arc(x, y - 34 * s, 22 * s, 0, TAU); c.fill(); c.beginPath(); c.roundRect(x - 30 * s, y - 6 * s, 60 * s, 56 * s, 22 * s); c.fill(); };

  // ---------------- HOOK (2.8 s)
  function hookA(c, t) { // black; a code answer types fast; a timer stops at 2.0 s; an Amber "?" stamps beside it
    voidBg(c); strokePts(c, rectPts(110, 700, 970, 960), C.fog, 3, 0, sm(0, 0.3, t)); answerLines(c, t, 0.15, 150, 780, C.white, 60);
    const v = Math.min(2, 2 * seg(0.15, 1.6, t)); drawTex(c, layout(c, [T(v.toFixed(1) + ' s', {f: 'mono', w: 700})], 64, 540, 620, 'center'), {p: 1, col: v >= 2 ? C.white : C.fog});
    if (t > 1.9) { const s = 1.3 - 0.3 * SM(seg(1.9, 2.05, t)); c.save(); c.translate(880, 1080); c.rotate(-0.12); c.scale(s, s); c.font = `700 150px ${M.FAM.sg}`; c.fillStyle = C.amber; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 0); c.restore(); }
    cap(c, t, 'hook');
  }
  let epH = null;
  function hookB(c, t) { if (!epH) epH = SGMM.load({fps: 60, size: [1080, 1920], duration: 2.8, score: null, scenes: [{type: 'enter_in_dark', t: [0, 2.8]}], captions: CAPS.hook.map(([a, b, x]) => ({t: [a, b], text: x}))}); epH.render(c, c.canvas.width, c.canvas.height, t, true); }
  function hookC(c, t) { // Pop: the answer card streams, a 2.0 s pill, an Amber "?" bubble
    P.bg(c, t, 'dark'); P.card(c, t, 0.1, 540, 960, 900, 320, (cc) => answerLines(cc, t, 0.25, -410, -60, C.void, 60), {label: 'AI ANSWER'});
    const v = Math.min(2, 2 * seg(0.2, 1.6, t)); P.pill(c, t, 0.2, 540, 720, v.toFixed(1) + ' s', {kind: 'white', size: 34, rot: 0}); P.qBubble(c, t, 2.0, 900, 1160, 70); pcap(c, t, 'hook', 'dark');
  }

  // ---------------- THEN (4.6 s, Editorial Collage)
  function clock(c, x, y, r, t) { c.save(); c.translate(x, y); c.fillStyle = C.card; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.strokeStyle = C.ink; c.lineWidth = 6; c.stroke(); const a = K.q12(t) * 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a - 1.57) * r * 0.75, Math.sin(a - 1.57) * r * 0.75); c.moveTo(0, 0); c.lineTo(Math.cos(a / 12 - 1.57) * r * 0.5, Math.sin(a / 12 - 1.57) * r * 0.5); c.stroke(); c.restore(); }
  function tick(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineWidth = 26; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-60, 0); c.lineTo(-15, 45); c.lineTo(70, -55); c.stroke(); c.restore(); }
  const post = (cc, W, H, title) => { cc.font = `700 40px ${M.FAM.sg}`; cc.fillStyle = C.ink; cc.fillText(title, -W / 2 + 40, -H / 2 + 80); cc.fillStyle = 'rgba(26,24,22,.35)'; for (let i = 0; i < 4; i++) cc.fillRect(-W / 2 + 40, -H / 2 + 120 + i * 40, W - 80 - (i % 2) * 120, 14); };
  function thenA(c, t) { // a torn forum post; a clock spins; the Amber accepted-answer tick tapes on; the green ring round it
    K.paperBg(c); K.actTag(c, t, '01', 'THEN', C.amber);
    const p = K.drop(t, 0.15); if (p) K.piece(c, 520, 860 + p.y, -0.03, 780, 400, C.card, 71, (cc, W, H) => post(cc, W, H, 'Q: why does my loop crash?'));
    const h = K.drop(t, 0.6); if (h) K.strip(c, 110, 560 + h.y, -0.04, 'ASK A STRANGER', 96, C.paper, C.forest, 9);
    if (t > 1.4) clock(c, 300, 1200, 120, t);
    const k = K.drop(t, 3.3); if (k) { K.piece(c, 740, 1190 + k.y, 0.05, 300, 260, C.card, 77, (cc) => tick(cc, 0, 0, 1.2, C.amber)); K.tape(c, 740, 1060 + k.y, 120, 30, 0.08); }
    K.markerRing(c, 740, 1190, 190, 160, seg(3.9, 4.5, t), C.green, 31); K.finish(c, t); cap(c, t, 'then');
  }
  function thenB(c, t) { // a corkboard: the question pinned, reply cards pile up with vote counts; "3 HRS LATER"; the ring on the accepted one
    K.paperBg(c, '#C9A878'); K.actTag(c, t, '01', 'THEN', C.amber);
    const q = K.drop(t, 0.1); if (q) K.piece(c, 540, 700 + q.y, 0.02, 760, 300, C.card, 81, (cc, W, H) => post(cc, W, H, 'Q: why does my loop crash?'));
    [0, 1, 2].forEach((i) => { const d = K.drop(t, 1.2 + i * 0.6); if (!d) return; K.piece(c, 300 + i * 240, 1060 + i * 60 + d.y, [-0.06, 0.04, -0.02][i], 300, 220, C.card, 90 + i, (cc) => { cc.font = `400 56px ${K.ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText(['+3', '+12', '+42'][i], 0, -10); if (i === 2) tick(cc, 0, 60, 0.6, C.amber); }); });
    const s = K.drop(t, 2.9); if (s) K.strip(c, 280, 1420 + s.y, 0.03, '3 HRS LATER', 80, C.paper, C.forest, 12);
    K.markerRing(c, 780, 1180, 190, 150, seg(3.9, 4.5, t), C.green, 33); K.finish(c, t); cap(c, t, 'then');
  }
  function thenC(c, t) { // Pop: light stage, a forum card pops, a WAIT counter runs up to 3 HRS, an Amber tick pops with a burst
    P.bg(c, t, 'light'); P.card(c, t, 0.3, 540, 900, 780, 300, (cc, W, H) => { cc.font = `700 40px ${P.SG}`; cc.fillStyle = C.void; cc.fillText('Q: why does my loop crash?', -W / 2 + 40, -H / 2 + 90); cc.fillStyle = 'rgba(124,138,132,.45)'; for (let i = 0; i < 3; i++) { cc.beginPath(); cc.roundRect(-W / 2 + 40, -H / 2 + 130 + i * 40, W - 80 - (i % 2) * 140, 16, 8); cc.fill(); } }, {label: 'FORUM'});
    const hrs = Math.floor(3 * seg(1.8, 3.2, t) * 60); P.pill(c, t, 1.8, 540, 1150, `WAIT · ${Math.floor(hrs / 60)} H ${String(hrs % 60).padStart(2, '0')} MIN`, {kind: 'dark', size: 30, rot: 0});
    P.burst(c, t, 3.6, 540, 1380, 120); P.withPop(c, t, 3.6, 540, 1380, (cc) => { cc.fillStyle = C.white; cc.beginPath(); cc.arc(0, 0, 110, 0, TAU); cc.fill(); tick(cc, 0, 0, 0.9, C.amber); }); pcap(c, t, 'then', 'light');
  }

  // ---------------- NOW (9 s, Manim)
  function icons(c, t, a, y, s = 1) { for (let i = 0; i < 10; i++) { const x = 140 + (i % 5) * 200, yy = y + Math.floor(i / 5) * 190, on = i < 7 && t > a + i * 0.18; person(c, x, yy, 1.4 * s, on ? C.white : 'rgba(124,138,132,.35)'); } }
  function bar(c, t, a, y, frac, col, labelTxt) { strokePts(c, rectPts(150, y - 40, 930, y + 40), C.fog, 3, 0, sm(a, a + 0.4, t)); const f = lerp(1, frac, sm(a + 0.5, a + 1.4, t)); if (t > a + 0.3) { c.save(); c.fillStyle = col; c.globalAlpha = seg(a + 0.3, a + 0.5, t); c.fillRect(154, y - 36, 772 * f, 72); c.restore(); } drawTex(c, layout(c, [T(labelTxt, {f: 'stix'})], 90, 150, y - 90), {p: seg(a + 1.2, a + 1.6, t), col: C.white}); }
  function nowA(c, t) { // 7 of 10 figures fill; a bar drains 100% -> 16% (green); a 48% bar with a tick box
    voidBg(c); K.actTag(c, t, '02', 'NOW', C.white);
    if (t < 2.8) { icons(c, t, 0.4, 720); drawTex(c, layout(c, [T('> 70%', {f: 'stix'}), T('  use AI daily', {f: 'mono', sz: 0.35})], 100, 150, 1180), {p: seg(1.8, 2.3, t)}); }
    else { bar(c, t, 3.0, 820, 0.16, C.green, '16%'); drawTex(c, layout(c, [T('trust it with most tasks (not big decisions)', {f: 'mono'})], 24, 150, 900), {p: seg(4.2, 4.8, t), col: C.fog});
      if (t > 6.0) { bar(c, t, 6.1, 1130, 0.48, C.white, '48%'); strokePts(c, rectPts(800, 1040, 880, 1120), C.white, 5, 0, sm(7.4, 7.7, t)); if (t > 7.8) strokePts(c, [[815, 1080], [835, 1100], [870, 1055]], C.white, 8, 0, sm(7.8, 8.1, t)); drawTex(c, layout(c, [T('trust it when they can easily check', {f: 'mono'})], 24, 150, 1210), {p: seg(7.2, 7.8, t), col: C.fog}); } }
    src(c, t, 1.0, 1360); cap(c, t, 'now');
  }
  function nowB(c, t) { // "7 in 10" writes in STIX; a 10×10 grid = 100 developers, 16 squares light green; 48 get a white outline + tick
    voidBg(c); K.actTag(c, t, '02', 'NOW', C.white);
    if (t < 2.8) drawTex(c, layout(c, [T('7', {f: 'stix'}), T(' in ', {f: 'stix', it: true, sz: 0.6}), T('10', {f: 'stix'})], 220, 540, 980, 'center'), {p: seg(0.3, 1.4, t)});
    else { for (let i = 0; i < 100; i++) { const x = 190 + (i % 10) * 72, y = 540 + Math.floor(i / 10) * 66, g = i < 16 && t > 3.6 + i * 0.05, w = i < 48 && t > 6.4 + i * 0.02; c.fillStyle = g ? C.green : 'rgba(124,138,132,.22)'; c.fillRect(x, y, 56, 56); if (w && !g) { c.strokeStyle = C.white; c.lineWidth = 3; c.strokeRect(x + 2, y + 2, 52, 52); } }
      drawTex(c, layout(c, [T('16', {f: 'stix'}), T(' / 100 trust it with most tasks', {f: 'mono', sz: 0.3})], 70, 190, 1290), {p: seg(4.6, 5.2, t), col: C.white}); if (t > 6.2) drawTex(c, layout(c, [T('48', {f: 'stix'}), T(' / 100 only when they can check', {f: 'mono', sz: 0.3})], 70, 190, 1370), {p: seg(7.2, 7.8, t)}); }
    src(c, t, 1.0, 480); cap(c, t, 'now');
  }
  function nowC(c, t) { // Pop: three stat cards in a row of beats; 16% is the green number
    P.bg(c, t, t < 5.9 ? 'dark' : 'light'); const mode = t < 5.9 ? 'dark' : 'light';
    if (t < 2.7) { P.card(c, t, 0.4, 540, 960, 760, 360, (cc) => { cc.font = `700 170px ${P.SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(`${Math.round(70 * P.out3(seg(0.6, 1.6, t)))}%+`, 0, 30); }, {label: 'USE AI EVERY DAY'}); P.pill(c, t, 1.8, 540, 1200, 'DEVELOPERS', {kind: 'amber'}); }
    else if (t < 5.9) { P.card(c, t, 2.8, 540, 960, 760, 360, (cc) => { cc.font = `700 190px ${P.SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(`${Math.round(100 - 84 * P.out3(seg(3.4, 4.4, t)))}%`, 0, 30); }, {label: 'TRUST IT WITH MOST TASKS'}); P.pill(c, t, 4.4, 540, 1200, 'ONLY', {kind: 'green', size: 40}); }
    else { P.card(c, t, 6.0, 540, 960, 760, 360, (cc) => { cc.font = `700 190px ${P.SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('48%', 0, 30); }, {label: 'TRUST IT WHEN THEY CAN CHECK'}); P.pill(c, t, 7.4, 540, 1200, '✓ CHECKABLE', {kind: 'amber'}); }
    P.label(c, t, 0.6, SRC, {y: 1560}); pcap(c, t, 'now', mode);
  }

  // ---------------- NEXT (5.6 s)
  function lens(c, x, y, r, col) { c.save(); c.strokeStyle = col; c.lineWidth = r * 0.16; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); c.lineCap = 'round'; c.beginPath(); c.moveTo(x + r * 0.72, y + r * 0.72); c.lineTo(x + r * 1.5, y + r * 1.5); c.stroke(); c.restore(); }
  let epN = null;
  function nextA(c, t) { // the approved flow field; an answer card draws on; a magnifier sweeps its lines; snap back to black on "two seconds—"
    if (!epN) epN = SGMM.load({fps: 60, size: [1080, 1920], duration: 5.6, score: null, scenes: [{type: 'field_push', t: [0, 5.6]}], act_tags: [{t: [0, 5.6], num: '03', label: 'NEXT'}], captions: CAPS.next.map(([a, b, x]) => ({t: [a, b], text: x}))});
    epN.render(c, c.canvas.width, c.canvas.height, t, true); c.setTransform(c.canvas.width / 1080, 0, 0, c.canvas.height / 1920, 0, 0);
    if (t < 4.6) { c.save(); c.fillStyle = 'rgba(5,8,7,.72)'; c.fillRect(110, 760, 860, 300); c.restore(); strokePts(c, rectPts(110, 760, 970, 1060), C.white, 3, 0, sm(0.6, 1.0, t)); answerLines(c, t, 1.0, 150, 840, C.white, 99); const sx = lerp(220, 860, SM(seg(1.6, 3.6, t))); if (t > 1.5) lens(c, sx, 900, 70, C.white); }
    else voidBg(c);
  }
  function nextB(c, t) { // voxel: an answer slab of blocks; a voxel lens moves along; checked rows turn light; one green block = checked
    K.voxGround(c); K.actTag(c, t, '03', 'NEXT', C.green); const pr = K.proj(540, 1160, 34, K.YAW + 0.1 * t), L = [];
    const scan = seg(1.2, 3.8, t); for (let x = -6; x < 7; x++) for (let z = 0; z < 6; z++) { const row = z % 2 === 1; L.push({x, y: 0, z, c: row ? ((x + 6) / 13 < scan ? '#E6EAE7' : '#3B4743') : '#2C5E4E'}); }
    if (scan >= 1) L.push({x: 7, y: 0, z: 5, c: C.green, e: true}); for (let x = -9; x < 10; x++) for (let y = -4; y < 5; y++) L.push({x, y, z: -1, c: (x + y) % 2 ? '#0B3D2E' : '#0E4636'});
    K.voxels(c, K.fallIn(L, t, (v) => 0.05 + (v.x + 9) * 0.02 + Math.max(0, v.z) * 0.04), pr); if (t > 1.2 && t < 4.6) { const [lx, ly] = pr.P(lerp(-6, 6, scan), -1, 7); lens(c, lx, ly, 60, C.white); }
    if (t > 4.6) voidBg(c); cap(c, t, 'next');
  }
  function nextC(c, t) { // Pop: the answer card, a magnifier pops and scans, each line gets a tick (the last is the green one), CHECKING pill
    if (t > 5.4) { voidBg(c); return; } P.bg(c, t, 'dark'); P.card(c, t, 0.2, 540, 980, 900, 340, (cc) => answerLines(cc, 99, 0, -410, -70, C.void), {label: 'AI ANSWER'});
    const sx = lerp(220, 860, P.out3(seg(1.0, 3.0, t))); if (t > 0.9) P.withPop(c, t, 0.9, sx, 1000, (cc) => lens(cc, 0, 0, 70, C.amber));
    [0, 1, 2].forEach((i) => { const at = 1.6 + i * 0.6; if (t < at) return; P.withPop(c, t, at, 1010, 900 + i * 60, (cc) => { cc.fillStyle = i === 2 ? C.green : C.white; cc.beginPath(); cc.arc(0, 0, 24, 0, TAU); cc.fill(); }, {r0: 0}); });
    P.pill(c, t, 1.2, 540, 1240, 'CHECKING', {kind: 'amber'}); pcap(c, t, 'next', 'dark');
  }

  /* Samrat's picks (3 Nov 2026): hook A, THEN A, NOW A, NEXT C — each move with its own sound */
  const chrome = (v) => { CH = v; K.setChrome(v); };
  const SND = {
    hook: (k, P, c) => { for (let i = 0; i < 22; i++) P('key', c(0.15 + i * 0.065), {g: 0.35}); P('click', c(1.6), {f: 2400, g: 0.9}); P('thud', c(1.92), {f: 120, g: 0.8}); },
    then: (k, P, c) => { P('put', c(0.15), {g: 1}); P('tear', c(0.6), {g: 0.5}); P('put', c(0.62), {g: 0.8}); for (let x = 1.4; x < 3.2; x += 0.5) P('tick', c(x), {f: 2800, g: 0.5}); P('put', c(3.3), {g: 1}); P('tear', c(3.36), {g: 0.35}); P('stroke', c(3.9), {material: 'marker', dur: 0.55, g: 1}); },
    now: (k, P, c) => { for (let i = 0; i < 7; i++) P('click', c(0.4 + i * 0.18), {f: 2000 + i * 120, g: 0.7}); P('stroke', c(1.8), {material: 'pen', dur: 0.5, g: 0.5}); P('slide', c(3.0), {dur: 0.4, g: 0.6}); P('slide', c(3.5), {dur: 0.9, g: 0.5}); P('thud', c(4.4), {f: 110, g: 0.7}); P('tick', c(4.3), {f: 2600, g: 0.5});
      P('slide', c(6.1), {dur: 0.4, g: 0.6}); P('slide', c(6.6), {dur: 0.9, g: 0.5}); P('tick', c(7.2), {f: 2400, g: 0.5}); P('click', c(7.4), {f: 2200, g: 0.8}); P('tick', c(7.8), {f: 2800, g: 0.7}); },
    next: (k, P, c) => { P('pop', c(0.2), {f: 380}); P('whoosh', c(0.9), {dur: 0.5, g: 0.4}); P('pop', c(0.95), {f: 460}); P('pop', c(1.2), {f: 520}); [1.6, 2.2, 2.8].forEach((x, i) => P('pop', c(x), {f: 560 + i * 90})); P('ding', c(2.85), {f: 1975, g: 0.15}); },
  };
  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, {x004_hook_answer: P.engineScene(hookA, 2.8, SND.hook, chrome), x004_then_forum: P.engineScene(thenA, 4.6, SND.then, chrome), x004_now_trust: P.engineScene(nowA, 9, SND.now, chrome), x004_next_check: P.engineScene(nextC, 5.6, SND.next, chrome)});

  const O = (name, draw, keys, note) => ({name, draw, keys, note});
  return {CAPS, scenes: [
    {id: 'hook', label: 'Hook', act: 'cold open', lines: 'L01', dur: 2.8, options: [
      O('Answer + 2.0 s + "?"', hookA, [0.5, 1.4, 2.4], 'Black; a code answer types out fast, a timer stops at 2.0 s, an Amber "?" stamps beside it. Topic + tension in frame 1.'),
      O('Studio Enter (approved)', hookB, [0.4, 1.4, 2.4], 'The approved EP000 hook (hand + green Enter in the dark). On-brand, but says nothing about checking.'),
      O('Pop: answer card', hookC, [0.5, 1.4, 2.4], 'Pop version: Deep Forest stage, the answer card streams in, a 2.0 s pill, an Amber "?" bubble; caption builds at the top.')]},
    {id: 'then', label: 'THEN', act: 'Editorial Collage', lines: 'L02', dur: 4.6, options: [
      O('Forum post + clock + tick', thenA, [0.8, 2.2, 4.4], 'A torn forum post "Q: why does my loop crash?", "ASK A STRANGER" strip, a clock spins on 12 fps steps, the Amber accepted-answer tick tapes on with the green marker ring.'),
      O('Corkboard of replies', thenB, [0.8, 2.6, 4.4], 'Kraft corkboard: the question pinned, reply cards pile up (+3, +12, +42), "3 HRS LATER" strip, the ring on the accepted one.'),
      O('Pop: WAIT counter', thenC, [0.8, 2.6, 4.2], 'Pop version on a light stage: the forum card pops, a WAIT counter runs to 3 H, an Amber tick pops with a burst.')]},
    {id: 'now', label: 'NOW', act: 'Manim', lines: 'L03–L05', dur: 9, options: [
      O('Figures + two bars', nowA, [2.2, 4.8, 8.4], '7 of 10 figures fill (> 70% use AI daily); a bar drains from 100% to the green 16% ("most tasks, not big decisions"); a white 48% bar gets a tick box. Source line on screen.'),
      O('"7 in 10" + 100 grid', nowB, [1.6, 5.2, 8.4], '"7 in 10" writes in STIX; a 10×10 grid of developers: 16 squares light green, 48 get a white outline (only when they can check).'),
      O('Pop: three stat cards', nowC, [1.8, 4.8, 8.4], 'Pop version: a USE AI EVERY DAY card counts to 70%+, a TRUST card counts down 100 → 16% with a green ONLY pill, the stage flips light for the 48% card.')]},
    {id: 'next', label: 'NEXT', act: 'Flow field / Voxel', lines: 'L06–L07', dur: 5.6, options: [
      O('Flow field + magnifier', nextA, [1.2, 3.0, 4.4], 'The approved NEXT flow field; an answer card draws on and a magnifier sweeps its lines; snaps to black on "two seconds—" (loop to frame 1).'),
      O('Voxel answer slab', nextB, [1.2, 3.0, 4.4], 'Voxel: an answer slab; a lens moves along, checked rows turn light; one green block lights when it is checked; snap to black.'),
      O('Pop: ticks per line', nextC, [1.2, 3.0, 4.4], 'Pop version: the answer card, an Amber magnifier pops and scans, each line gets a tick (the last one green), CHECKING pill; snap to black.')]},
  ]};
})();
