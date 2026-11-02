/* X002 "The Missing First Job" — storyboard options v001: 3 drafts per scene, 1080x1920, pure functions of t.
   Uses SGMM_KIT (collage + voxel kit, from X001) and SGMM_MANIM.P; load sgmm_manim.js, x001_options.js and the engine first. */
window.X002_OPT = (() => {
  const K = SGMM_KIT, P = SGMM_MANIM.P, {C, TAU, q12, ANTON, SERIF} = K, {T, layout, drawTex, morphTex, strokePts, arrow, rectPts, dot, ghost, curvedArrow, arcPts, SM, seg, sm, tab, lerp, cl, FAM} = P;
  const CAPS = {
    hook: [[0.05, 2.75, 'AI isn’t taking the last job.\nIt’s taking the first one.']],
    then: [[0.0, 2.2, 'Your first job used to be\nthe boring part.'], [2.3, 5.6, 'Coffee. Spreadsheets. First drafts.\nThat’s how you learned.']],
    now: [[0.0, 2.0, 'But now AI does the boring part.'], [2.1, 3.6, 'So companies hire fewer beginners.'], [3.8, 7.4, 'One study: young workers in\nAI-exposed jobs are 19%\nbehind their peers.'], [7.6, 9.9, 'Experienced workers? No gap.']],
    next: [[0.0, 2.4, 'So if nobody starts at the bottom…'], [2.6, 4.9, 'who becomes the expert?']],
  };
  let CH = true; const tag = (c, t, n, l, col) => { if (CH) K.actTag(c, t, n, l, col); }, cap = (c, t, k) => { if (CH) K.caption(c, t, CAPS[k]); };
  const voidBg = (c) => { c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); };
  const TASKS = ['COFFEE', 'SPREADSHEETS', 'FIRST DRAFTS'];

  // ---------------- HOOK (2.8 s)
  function hookA(c, t) { // a JUNIOR badge drops onto a desk, then slides off the edge
    voidBg(c); strokePts(c, [[140, 1010], [940, 1010]], C.fog, 4, 0, sm(0, 0.4, t));
    const land = sm(0.1, 0.55, t), slide = sm(1.6, 2.2, t), fall = seg(2.15, 2.75, t);
    const x = lerp(540, 1080, slide) + 200 * fall, y = lerp(560, 920, land) + 900 * fall * fall + (land > 0.99 ? 0 : 0), rot = 0.5 * fall;
    c.save(); c.translate(x, y + 18 * tab(0.55, 0.75, t)); c.rotate(rot); c.fillStyle = C.white; c.fillRect(-170, -90, 340, 180); c.fillStyle = C.forest; c.fillRect(-170, -90, 340, 46);
    c.font = `500 22px ${FAM.mono}`; c.fillStyle = C.white; c.textAlign = 'center'; c.fillText('HELLO, I’M THE', 0, -60); c.font = `700 64px ${FAM.sg}`; c.fillStyle = C.void; c.fillText('JUNIOR', 0, 50); c.restore();
    cap(c, t, 'hook');
  }
  function hookB(c, t) { // the approved studio hook
    if (!hookB.ep) hookB.ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 2.8, score: null, scenes: [{type: 'enter_in_dark', t: [0, 2.8]}], captions: CAPS.hook.map(([a, b, x]) => ({t: [a, b], text: x}))});
    hookB.ep.render(c, c.canvas.width, c.canvas.height, t, true);
  }
  function hookC(c, t) { // a torn HELP WANTED · ENTRY LEVEL ad on dark kraft, highlighted, then torn away
    c.fillStyle = '#2A2118'; c.fillRect(0, 0, 1080, 1920); const tq = q12(t), away = SM(seg(1.8, 2.5, tq));
    const d = K.drop(t, 0.1); if (d) K.piece(c, 540 + 700 * away, 880 + d.y + 500 * away * away, -0.04 + 0.6 * away, 760, 420, '#E9E1CB', 21, (cc, W, H) => {
      cc.font = `400 92px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText('HELP WANTED', 0, -70); cc.fillRect(-300, -45, 600, 5);
      cc.font = `400 120px ${ANTON}`; cc.fillText('ENTRY LEVEL', 0, 110); });
    if (!away) K.hilite(c, 210, 930, 660, 60, seg(0.8, 1.2, tq));
    if (tq > 1.8 && tq < 2.0) { c.save(); c.strokeStyle = '#E9E1CB'; c.lineWidth = 6; c.beginPath(); c.moveTo(200, 1100); for (let i = 0; i < 12; i++) c.lineTo(200 + i * 60, 1100 + (i % 2 ? -14 : 12)); c.stroke(); c.restore(); }
    K.finish(c, t); cap(c, t, 'hook');
  }

  // ---------------- THEN (5.6 s, collage)
  const taskArt = (cc, k) => { cc.strokeStyle = C.ink; cc.lineWidth = 5; cc.fillStyle = C.ink;
    if (k === 0) { cc.strokeRect(-60, -40, 110, 110); cc.beginPath(); cc.arc(62, 10, 26, -1.2, 1.2); cc.stroke(); for (let i = 0; i < 3; i++) { cc.beginPath(); cc.moveTo(-30 + i * 28, -60); cc.quadraticCurveTo(-20 + i * 28, -80, -30 + i * 28, -100); cc.stroke(); } }
    if (k === 1) { for (let i = 0; i <= 4; i++) { cc.beginPath(); cc.moveTo(-90, -70 + i * 35); cc.lineTo(90, -70 + i * 35); cc.stroke(); } for (let i = 0; i <= 3; i++) { cc.beginPath(); cc.moveTo(-90 + i * 60, -70); cc.lineTo(-90 + i * 60, 70); cc.stroke(); } }
    if (k === 2) { cc.strokeRect(-70, -90, 140, 180); for (let i = 0; i < 5; i++) cc.fillRect(-50, -60 + i * 28, 100 - (i % 2) * 30, 5); cc.strokeStyle = C.forest; cc.lineWidth = 7; cc.beginPath(); cc.moveTo(-55, -2); cc.lineTo(40, 10); cc.stroke(); } };
  function thenA(c, t) { // DAY 1 stamp; COFFEE / SPREADSHEETS / FIRST DRAFTS pop in on the words; LEARNED highlighted, one green ring
    K.paperBg(c); tag(c, t, '01', 'THEN', C.amber);
    const st = seg(0.1, 0.25, q12(t)); if (st > 0) { c.save(); c.translate(300, 520); c.rotate(-0.12); const k = 1.4 - 0.4 * st; c.scale(k, k); c.globalAlpha = 0.9 * st; c.strokeStyle = C.forest; c.lineWidth = 9; c.strokeRect(-150, -70, 300, 140); c.font = `400 110px ${ANTON}`; c.fillStyle = C.forest; c.textAlign = 'center'; c.fillText('DAY 1', 0, 40); c.restore(); }
    const td = K.drop(t, 0.9); if (td) { K.strip(c, 640, 560 + td.y, 0.06, 'TO DO', 76, C.ink, C.card, 15); } const ck = K.drop(t, 1.6); if (ck) { K.strip(c, 640, 650 + ck.y, -0.04, '9:00 AM', 60, C.paper, C.forest, 16); K.tape(c, 700, 620 + ck.y, 90, 26, 0.2); }
    TASKS.forEach((w, i) => { const d = K.drop(t, 2.4 + i * 0.55); if (!d) return; const x = [250, 560, 850][i], y = [800, 760, 820][i];
      K.piece(c, x, y + d.y, [-0.06, 0.04, -0.03][i], 270, 300, C.card, 40 + i, (cc) => { cc.save(); cc.translate(0, -20); taskArt(cc, i); cc.restore(); cc.font = `400 38px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText(w, 0, 120); });
      K.tape(c, x, y - 150 + d.y, 110, 30, [0.1, -0.08, 0.12][i]); });
    const sd = K.drop(t, 4.2); if (sd) K.strip(c, 150, 1180 + sd.y, -0.02, 'THAT’S HOW YOU LEARNED', 88, C.paper, C.forest, 9);
    K.hilite(c, 640, 1150, 330, 64, seg(4.6, 5.0, q12(t)));
    K.markerRing(c, 800, 1180, 230, 80, seg(4.9, 5.4, t), C.green, 13);
    K.finish(c, t); cap(c, t, 'then');
  }
  function thenB(c, t) { // a paper ladder; the bottom rungs are the first-job tasks; green ring on the bottom rung
    K.paperBg(c, '#EFE6D2'); tag(c, t, '01', 'THEN', C.amber);
    const h = K.drop(t, 0.05); if (h) K.strip(c, 120, 470 + h.y, 0.03, 'THE CAREER LADDER', 96, C.paper, C.forest, 8);
    const rails = seg(0.3, 1.0, q12(t)); if (rails > 0) { [330, 750].forEach((x, i) => K.piece(c, x, lerp(1700, 1010, rails), 0.01 * (i ? 1 : -1), 40, 760, C.kraft, 70 + i)); }
    for (let r = 0; r < 6; r++) { const y = 1300 - r * 110, d = K.drop(t, r < 3 ? 2.4 + r * 0.55 : 0.9 + (r - 3) * 0.15); if (!d) continue;
      K.piece(c, 540, y + d.y, (r % 2 ? 0.02 : -0.02), 470, 64, C.card, 80 + r, r < 3 ? (cc) => { cc.font = `400 40px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText(TASKS[r], 0, 14); } : null, {amp: 3}); }
    K.markerRing(c, 540, 1300, 300, 70, seg(4.9, 5.4, t), C.green, 17);
    K.finish(c, t); cap(c, t, 'then');
  }
  function thenC(c, t) { // a lined notebook page: "FIRST JOB — WHAT I LEARNED"; the tasks are written in, ticked; green ring on "LEARNED"
    K.paperBg(c); tag(c, t, '01', 'THEN', C.amber);
    const d = K.drop(t, 0.1); if (d) K.piece(c, 540, 980 + d.y, 0.02, 820, 900, '#F7F3E8', 33, (cc, W, H) => {
      cc.strokeStyle = 'rgba(11,61,46,.25)'; cc.lineWidth = 2; for (let y = -H / 2 + 200; y < H / 2 - 40; y += 70) { cc.beginPath(); cc.moveTo(-W / 2 + 30, y); cc.lineTo(W / 2 - 30, y); cc.stroke(); }
      cc.strokeStyle = 'rgba(255,181,71,.6)'; cc.beginPath(); cc.moveTo(-W / 2 + 110, -H / 2); cc.lineTo(-W / 2 + 110, H / 2); cc.stroke();
      cc.font = `italic 700 46px ${SERIF}`; cc.fillStyle = C.ink; cc.fillText('First job — what I learned', -W / 2 + 140, -H / 2 + 150); });
    TASKS.forEach((w, i) => { const p = seg(2.4 + i * 0.55, 2.8 + i * 0.55, t); if (p <= 0) return; const y = 760 + i * 140;
      c.save(); c.beginPath(); c.rect(240, y - 60, 640 * p, 90); c.clip(); c.font = `italic 400 52px ${SERIF}`; c.fillStyle = C.ink; c.fillText(w.toLowerCase().replace(/^./, (m) => m.toUpperCase()), 260, y); c.restore();
      if (p >= 1) strokePts(c, [[190, y - 20], [208, y], [236, y - 40]], C.forest, 7, 0, sm(2.85 + i * 0.55, 3.0 + i * 0.55, t)); });
    K.markerRing(c, 700, 640, 190, 64, seg(4.9, 5.4, t), C.green, 19);
    K.finish(c, t); cap(c, t, 'then');
  }

  // ---------------- NOW (10 s, Manim)
  const source = (c, t, a, y, al = 1) => { const l1 = layout(c, [T('ages 22–25 · AI-exposed jobs vs peers in less-exposed jobs', {f: 'mono'})], 24, 540, y, 'center'), l2 = layout(c, [T('one study · Stanford Digital Economy Lab / ADP · Aug 2026 · a pattern, not proof', {f: 'mono'})], 22, 540, y + 38, 'center'); drawTex(c, l1, {p: seg(a, a + 0.5, t), alpha: al, col: C.fog}); drawTex(c, l2, {p: seg(a + 0.2, a + 0.7, t), alpha: al, col: C.fog}); };
  function nowIntro(c, t) { // 0–3.6: the three tasks fly into an AI box; "entry-level hires" arrow points down
    const gone = sm(3.4, 3.8, t);
    const box = sm(0.1, 0.6, t); if (box > 0) strokePts(c, rectPts(380, 560, 700, 760), C.white, 4, 0, box, 1 - gone);
    const ai = layout(c, [T('AI', {f: 'sg'})], 90, 540, 692, 'center'); drawTex(c, ai, {p: seg(0.3, 0.8, t), alpha: 1 - gone});
    TASKS.forEach((w, i) => { const A = layout(c, [T(w, {f: 'sg'})], 46, 540, 920 + i * 80, 'center'), q = sm(0.9 + i * 0.25, 1.5 + i * 0.25, t);
      if (q <= 0) drawTex(c, A, {p: seg(0.05, 0.5, t)}); else if (q < 1) drawTex(c, A, {dy: (660 - (920 + i * 80)) * q, scale: 1 - 0.8 * q, alpha: 1 - q}); });
    const ar = sm(2.1, 2.8, t); if (ar > 0) { const l = layout(c, [T('entry-level hires', {f: 'mono'})], 30, 540, 1000, 'center'); drawTex(c, l, {alpha: ar * (1 - gone), col: C.fog}); arrow(c, 380, 1060, lerp(380, 700, ar), lerp(1060, 1200, ar), C.amber, 6, 1, 26, 1 - gone); }
  }
  function nowA(c, t) { // −19% counts up; two bars (young vs peers); experienced: equal bars, "No gap"
    voidBg(c); tag(c, t, '02', 'NOW', C.white); nowIntro(c, t);
    const up = sm(7.4, 7.8, t);
    if (t > 3.8) { const v = 19 * SM(seg(3.8, 4.6, t)), h = layout(c, [T('−' + v.toFixed(0) + '%', {f: 'stix'})], 230, 540, lerp(820, 560, up), 'center'); drawTex(c, h, {p: seg(3.8, 4.0, t), col: C.green, scale: lerp(1, 0.45, up) * (1 + 0.1 * tab(4.8, 5.3, t))}); source(c, t, 4.6, 900, 1 - up); }
    const bars = (y, a, k1, l1, l2, al) => { const b1 = sm(a, a + 0.4, t), b2 = sm(a + 0.4, a + 0.9, t); if (b1 <= 0) return; const W = 560;
      drawTex(c, layout(c, [T(l1, {f: 'mono'})], 24, 120, y + 8), {alpha: al * b1, col: C.fog}); drawTex(c, layout(c, [T(l2, {f: 'mono'})], 24, 120, y + 68), {alpha: al * b1, col: C.fog});
      strokePts(c, [[360, y], [360 + W, y]], C.white, 22, 0, b1, al * 0.85); strokePts(c, [[360, y + 60], [360 + W * k1, y + 60]], C.white, 22, 0, b2, al * 0.85); };
    bars(1060, 5.4, 0.81, 'peers', 'young, AI-exposed', 1 - up);
    const gm = sm(6.3, 6.6, t) * (1 - up); if (gm > 0) { c.save(); c.setLineDash([10, 9]); strokePts(c, rectPts(360 + 560 * 0.81 + 6, 1108, 920, 1132), C.amber, 3, 0, gm); c.restore(); drawTex(c, layout(c, [T('\u221219%', {f: 'mono'})], 26, 935, 1128), {p: seg(6.9, 7.2, t), alpha: 1 - up, col: C.amber}); }
    if (t > 7.6) { const pz = 1 + 0.06 * tab(9.0, 9.4, t); c.save(); c.translate(640, 900); c.scale(pz, pz); c.translate(-640, -900); bars(860, 7.7, 1.0, 'peers', 'experienced, AI-exposed', 1); c.restore(); const ng = layout(c, [T('No gap', {f: 'sg'})], 64, 540, 1080, 'center'); drawTex(c, ng, {p: seg(8.6, 9.2, t)}); strokePts(c, [[430, 1100], [650, 1100]], C.white, 4, 0, sm(9.5, 9.9, t)); }
    cap(c, t, 'now');
  }
  function nowB(c, t) { // the gap's two real data points: 15% (Jul 2025) -> 19% (Jun 2026); experienced workers stay at 0
    voidBg(c); tag(c, t, '02', 'NOW', C.white); nowIntro(c, t);
    if (t < 3.8) return cap(c, t, 'now');
    const A = {ox: 200, oy: 1150, ux: 320, uy: 22}, ap = seg(3.8, 4.3, t);
    strokePts(c, [[A.ox, A.oy], [A.ox + 2.2 * A.ux, A.oy]], C.white, 3, 0, SM(ap)); strokePts(c, [[A.ox, A.oy], [A.ox, A.oy - 520]], C.white, 3, 0, SM(ap));
    drawTex(c, layout(c, [T('gap vs peers', {f: 'mono'})], 24, A.ox + 14, A.oy - 520), {p: seg(4.0, 4.4, t), col: C.fog});
    drawTex(c, layout(c, [T('Jul 2025', {f: 'mono'})], 26, A.ox + 0.6 * A.ux, A.oy + 44, 'center'), {p: seg(4.1, 4.5, t), col: C.fog}); drawTex(c, layout(c, [T('Jun 2026', {f: 'mono'})], 26, A.ox + 1.6 * A.ux, A.oy + 44, 'center'), {p: seg(4.2, 4.6, t), col: C.fog});
    const p1 = [A.ox + 0.6 * A.ux, A.oy - 15 * A.uy], p2 = [A.ox + 1.6 * A.ux, A.oy - 19 * A.uy];
    dot(c, ...p1, 13 * sm(4.4, 4.7, t), C.white); drawTex(c, layout(c, [T('15%', {f: 'stix'})], 54, p1[0] - 30, p1[1] - 34, 'right'), {p: seg(4.5, 4.9, t)});
    const hop = sm(4.9, 5.6, t); if (hop > 0) { ghost(c, ...p1, 13, C.amber, hop); curvedArrow(c, arcPts(p1[0] + 10, p1[1] - 18, p2[0] - 8, p2[1] - 22, 0.3, 30), C.amber, 3.5, hop, 18); strokePts(c, [p1, p2], C.white, 4, 0, hop); dot(c, lerp(p1[0], p2[0], hop), lerp(p1[1], p2[1], hop), 13, C.white); }
    drawTex(c, layout(c, [T('19%', {f: 'stix'})], 120, p2[0] + 30, p2[1] - 30), {p: seg(5.5, 6.1, t), col: C.green});
    source(c, t, 6.0, A.oy + 100);
    const ex = sm(7.7, 8.6, t); if (ex > 0) { strokePts(c, [[A.ox, A.oy - 2], [A.ox + 2.0 * A.ux, A.oy - 2]], C.amber, 6, 0, ex); drawTex(c, layout(c, [T('experienced workers: no gap', {f: 'mono'})], 28, A.ox + 2.0 * A.ux, A.oy - 24, 'right'), {p: seg(8.4, 9.0, t), col: C.amber}); }
    cap(c, t, 'now');
  }
  function nowC(c, t) { // equations: young = peers − 19%; experienced = peers (− 0)
    voidBg(c); tag(c, t, '02', 'NOW', C.white); nowIntro(c, t);
    if (t < 3.8) return cap(c, t, 'now');
    const e1 = layout(c, [T('young', {it: true}), T(' = '), T('peers', {it: true}), T(' − '), T('19%', {c: C.green})], 96, 540, 820, 'center');
    drawTex(c, e1, {p: seg(3.8, 5.0, t), scale: 1 + 0.08 * tab(5.2, 5.7, t)});
    source(c, t, 5.6, 900);
    const e2 = layout(c, [T('experienced', {it: true}), T(' = '), T('peers', {it: true})], 84, 540, 1120, 'center');
    if (t > 7.6) { drawTex(c, e2, {p: seg(7.7, 8.7, t)}); const ng = layout(c, [T('no gap', {f: 'mono'})], 30, 540, 1190, 'center'); drawTex(c, ng, {p: seg(8.8, 9.2, t), col: C.amber}); }
    cap(c, t, 'now');
  }

  // ---------------- NEXT (5 s)
  function ladderVox(missing) { const L = []; for (let z = 0; z < 16; z++) { L.push({x: 0, y: 0, z, c: '#B9C2BE'}); L.push({x: 5, y: 0, z, c: '#B9C2BE'}); if (z % 2 === 1 && !missing.includes(z)) for (let x = 1; x < 5; x++) L.push({x, y: 0, z, c: z === 15 ? C.green : '#E6EAE7', e: z === 15}); } return L; }
  function nextA(c, t) { // a voxel ladder builds; its bottom rungs fall out; the top rung is the one green; slow orbit
    K.voxGround(c); tag(c, t, '03', 'NEXT', C.green);
    const pr = K.proj(540, 1280, 40, K.YAW + 0.16 * t), full = ladderVox([]);
    let list = K.fallIn(full, t, (v) => 0.05 + v.z * 0.06);
    list = list.flatMap((v) => { if (v.x > 0 && v.x < 5 && v.z < 10) { const at = v.z < 6 ? 1.2 + v.z * 0.15 : v.z === 7 ? 3.4 : 4.2, out = sm(at, at + 0.4, t); if (out >= 1) return []; return [{...v, z: v.z - out * 8, fall: out > 0}]; } return [v]; });
    for (let x = -6; x < 12; x++) for (let y = -6; y < 6; y++) list.push({x, y, z: -1, c: (x + y) % 2 ? '#0B3D2E' : '#0E4636'});
    K.voxels(c, list, pr); cap(c, t, 'next');
  }
  function nextB(c, t) { // the engine's flow field with a Manim ladder outline missing its bottom rungs
    if (!nextB.ep) nextB.ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 5, score: null, scenes: [{type: 'field_push', t: [0, 5]}], act_tags: [{t: [0, 5], num: '03', label: 'NEXT'}], captions: CAPS.next.map(([a, b, x]) => ({t: [a, b], text: x}))});
    nextB.ep.render(c, c.canvas.width, c.canvas.height, t, true);
    const p = sm(0.6, 1.4, t); strokePts(c, [[400, 1300], [400, 520]], C.white, 6, 0, p); strokePts(c, [[680, 1300], [680, 520]], C.white, 6, 0, p);
    for (let r = 0; r < 7; r++) { const y = 560 + r * 110; if (r >= 4) continue; strokePts(c, [[400, y], [680, y]], C.white, 5, 0, sm(1.4 + r * 0.15, 1.7 + r * 0.15, t)); }
  }
  function nextC(c, t) { // a voxel tower of blocks: the base layer drops away block by block; the top block is the one green
    K.voxGround(c); tag(c, t, '03', 'NEXT', C.green);
    const pr = K.proj(540, 1240, 44, K.YAW + 0.06 * t), list = [];
    for (let z = 0; z < 6; z++) { const w = 6 - z; for (let x = 0; x < w; x++) for (let y = 0; y < w; y++) { const v = {x: x + z / 2 | 0, y: y + z / 2 | 0, z, c: z === 5 ? C.green : z % 2 ? '#B9C2BE' : '#E6EAE7', e: z === 5}; if (z === 0) { const out = sm(1.2 + (x + y) * 0.08, 1.6 + (x + y) * 0.08, t); if (out >= 1) continue; v.z -= out * 5; v.fall = out > 0; } list.push(v); } }
    K.voxels(c, K.fallIn(list, t, (v) => 0.05 + Math.max(0, v.z) * 0.12), pr); cap(c, t, 'next');
  }

  /* Samrat's picks (2 Nov 2026): all A. Every move has its own sound (sgmm-quality-gates: a beat seen and heard every 1.5-2 s) */
  const SND = {
    hook: (k, P, c) => { P('tick', c(0.1), {f: 2200, g: 0.3}); P('put', c(0.55), {g: 1.0}); P('thud', c(0.56), {f: 120, g: 0.3}); P('slide', c(1.6), {dur: 0.55, g: 0.8}); P('whoosh', c(2.15), {dur: 0.5, top: 1600, g: 0.35}); },
    then: (k, P, c) => { P('put', c(0.1), {g: 1.0}); P('thud', c(0.11), {f: 100, g: 0.3}); [2.4, 2.95, 3.5].forEach((x, i) => { P('put', c(x), {g: 0.9, pan: -0.4 + 0.4 * i}); P('paper', c(x + 0.02), {dur: 0.2, g: 0.5}); P('tear', c(x + 0.15), {g: 0.35}); });
      P('put', c(0.9), {g: 0.8}); P('put', c(1.6), {g: 0.8}); P('tear', c(1.65), {g: 0.4});
      P('put', c(4.2), {g: 0.9}); P('stroke', c(4.6), {material: 'marker', dur: 0.4, g: 0.8}); P('stroke', c(4.9), {material: 'marker', dur: 0.5, g: 0.9}); },
    now: (k, P, c) => { P('tick', c(0.1), {f: 2000, g: 0.35}); P('stroke', c(0.3), {material: 'pen', dur: 0.5, g: 0.35}); [0.9, 1.15, 1.4].forEach((x) => P('whoosh', c(x), {dur: 0.4, top: 1500, g: 0.3}));
      P('slide', c(2.1), {dur: 0.7, g: 0.6}); for (let i = 0; i < 14; i++) P('tick', c(3.8 + i * 0.057), {f: 2200 + i * 50, g: 0.3}); k.ney([[c(4.6), 587.33, 0.9, 1]], {gain: 0.06}); k.daf(c(4.8), 'tek', 0.6);
      P('slide', c(5.4), {dur: 0.4, g: 0.6}); P('slide', c(5.8), {dur: 0.5, g: 0.6}); P('whoosh', c(7.4), {dur: 0.4, top: 1100, g: 0.35}); P('slide', c(7.7), {dur: 0.4, g: 0.6}); P('slide', c(8.1), {dur: 0.5, g: 0.6}); P('ding', c(8.6), {f: 1318.5, g: 0.2}); P('tick', c(6.3), {f: 2600, g: 0.4}); P('click', c(6.9), {f: 2200, g: 0.5}); k.daf(c(9.0), 'tek', 0.5); P('stroke', c(9.5), {material: 'pen', dur: 0.4, g: 0.4}); },
    next: (k, P, c) => { for (let i = 0; i < 16; i++) P('key', c(0.05 + i * 0.06), {g: 0.3}); for (let i = 0; i < 6; i++) P('click', c(1.2 + i * 0.15), {f: 2600 - i * 120, g: 0.45}); P('ding', c(2.6), {f: 1975, g: 0.2}); P('whoosh', c(3.0), {dur: 1.2, top: 1400, g: 0.2}); P('click', c(3.4), {f: 2300, g: 0.6}); P('click', c(4.2), {f: 2000, g: 0.6}); P('put', c(3.85), {g: 0.4}); P('put', c(4.65), {g: 0.4}); },
  };
  const engineScene = (fn, sound) => ({at: 0, sound, draw: (ctx, t) => { CH = false; try { fn(ctx, t); } finally { CH = true; } }});
  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, {x002_hook_badge: engineScene(hookA, SND.hook), x002_then_day1: engineScene(thenA, SND.then), x002_now_gap: engineScene(nowA, SND.now), x002_next_ladder: engineScene(nextA, SND.next)});
  return {CAPS, scenes: [
    {id: 'hook', label: 'Hook', act: 'cold open', lines: 'L01', dur: 2.8, options: [
      {name: 'Badge slides off', draw: hookA, keys: [0.4, 1.4, 2.4], note: 'Black; a JUNIOR badge drops onto a desk line, sits, then slides off the edge (thud, slide). Shows "the first job goes" in one image.'},
      {name: 'Studio Enter (approved)', draw: hookB, keys: [0.4, 1.4, 2.4], note: 'The approved EP000 hook; on-brand, but says nothing about first jobs.'},
      {name: 'Entry-level ad torn away', draw: hookC, keys: [0.6, 1.3, 2.2], note: 'A HELP WANTED · ENTRY LEVEL clipping on dark kraft, Amber highlighter, then torn away (tear). Warm; previews THEN.'}]},
    {id: 'then', label: 'THEN', act: 'Editorial Collage', lines: 'L02–L03', dur: 5.6, options: [
      {name: 'DAY 1 + three tasks', draw: thenA, keys: [1.0, 3.6, 5.3], note: 'A DAY 1 rubber stamp; COFFEE, SPREADSHEETS, FIRST DRAFTS cut-outs drop on each word; "THAT’S HOW YOU LEARNED" with highlighter and the green ring.'},
      {name: 'Paper career ladder', draw: thenB, keys: [1.2, 3.6, 5.3], note: 'A paper ladder builds; the three bottom rungs are the tasks, dropping on each word; the green ring on the bottom rung (sets up NEXT).'},
      {name: 'Notebook: what I learned', draw: thenC, keys: [1.0, 3.6, 5.3], note: 'A lined notebook page "First job — what I learned"; each task is written in and ticked; the green ring on "learned".'}]},
    {id: 'now', label: 'NOW', act: 'Manim', lines: 'L04–L07', dur: 10, options: [
      {name: '−19% + bars', draw: nowA, keys: [1.2, 2.8, 4.8, 9.2], note: 'Tasks fly into an AI box; "entry-level hires" arrow down; −19% counts up with the source; young vs peers bars; then experienced bars equal — "No gap".'},
      {name: 'Gap chart 15% → 19%', draw: nowB, keys: [1.2, 4.8, 6.4, 9.2], note: 'Only the two real data points (Jul 2025 15%, Jun 2026 19%), a descent-style hop up, green 19%; experienced workers drawn as a flat line at zero.'},
      {name: 'Equations', draw: nowC, keys: [1.2, 4.8, 6.4, 9.2], note: '"young = peers − 19%" writes on (green 19%); then "experienced = peers" with "no gap". Most Manim, least visual.'}]},
    {id: 'next', label: 'NEXT', act: 'Voxel or Flow Field', lines: 'L08–L09', dur: 5, options: [
      {name: 'Voxel ladder, no bottom', draw: nextA, keys: [0.8, 2.2, 4.4], note: 'A voxel ladder builds; its bottom rungs fall out block by block (clicks); the top rung is the one green; slow orbit.'},
      {name: 'Flow field + ladder', draw: nextB, keys: [0.8, 2.2, 4.4], note: 'The approved NEXT flow field with a white ladder outline drawn over it, bottom rungs missing.'},
      {name: 'Voxel tower, no base', draw: nextC, keys: [0.8, 2.2, 4.4], note: 'A stepped block tower; the bottom layer drops away block by block; the green top block hangs on.'}]},
  ]};
})();
