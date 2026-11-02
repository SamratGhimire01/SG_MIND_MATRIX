/* X003 "AI's Electricity Bill" — storyboard options v001: 3 drafts per scene, 1080x1920, pure functions of t.
   Uses SGMM_KIT (collage + voxel kit) and SGMM_MANIM.P; load sgmm_manim.js, x001_options.js and the engine first. */
window.X003_OPT = (() => {
  const K = SGMM_KIT, P = SGMM_MANIM.P, {C, TAU, q12, ANTON, SERIF} = K, {T, layout, drawTex, strokePts, arrow, rectPts, dot, ghost, curvedArrow, arcPts, SM, seg, sm, tab, lerp, FAM} = P;
  const CAPS = {
    hook: [[0.05, 2.75, 'Every answer AI gives you\nruns on electricity.']],
    then: [[0.0, 2.2, 'Data centres used to\njust store things.'], [2.3, 4.9, 'Photos. Videos. Web pages.']],
    now: [[0.0, 2.4, 'But now they think —\nand thinking takes power.'], [2.5, 4.8, 'Last year, data centres used\n485 terawatt-hours.'], [5.0, 8.0, 'By 2030: almost double — about\n3% of the world’s electricity.'], [8.2, 9.9, 'And the AI part triples.']],
    next: [[0.0, 2.6, 'So the next limit on AI may not\nbe chips… but power.'], [2.8, 5.3, 'Who gets the power —\nand who pays the bill?']],
  };
  let CH = true; const tag = (c, t, n, l, col) => { if (CH) K.actTag(c, t, n, l, col); }, cap = (c, t, k) => { if (CH) K.caption(c, t, CAPS[k]); };
  const voidBg = (c) => { c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); };
  const ITEMS = ['PHOTOS', 'VIDEOS', 'WEB PAGES'];
  const src = (c, t, a, y) => drawTex(c, layout(c, [T('IEA · Key Questions on Energy and AI (2026) · 2030 = projection', {f: 'mono'})], 22, 540, y, 'center'), {p: seg(a, a + 0.6, t), col: C.fog});

  // ---------------- HOOK (2.8 s)
  function hookA(c, t) { // a chat bubble types; a power line under it lights segment by segment, ending in one green spark
    voidBg(c); const b = sm(0.0, 0.3, t);
    if (b > 0) { strokePts(c, rectPts(250, 640, 830, 820), C.white, 4, 0, b); const q = 'how do I…'.slice(0, Math.floor(9 * seg(0.25, 0.9, t))); c.font = `500 52px ${FAM.sg}`; c.fillStyle = C.white; c.fillText(q, 290, 748); }
    const pts = [[540, 820], [540, 960], [380, 1060], [700, 1180], [540, 1300], [540, 1380]];
    strokePts(c, pts, C.fog, 4, 0, 1, sm(0.2, 0.5, t));
    const lit = seg(0.9, 2.2, t); if (lit > 0) { strokePts(c, pts, C.white, 8, 0, lit); }
    if (lit >= 1) dot(c, 540, 1380, 16 + 6 * tab(2.2, 2.6, t), C.green);
    cap(c, t, 'hook');
  }
  function hookB(c, t) { if (!hookB.ep) hookB.ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 2.8, score: null, scenes: [{type: 'enter_in_dark', t: [0, 2.8]}], captions: CAPS.hook.map(([a, b, x]) => ({t: [a, b], text: x}))}); hookB.ep.render(c, c.canvas.width, c.canvas.height, t, true); }
  function hookC(c, t) { // collage: a cut-out plug slides into a socket (click); amber marker sparks
    c.fillStyle = '#2A2118'; c.fillRect(0, 0, 1080, 1920); const tq = q12(t);
    const s = K.drop(t, 0.1); if (s) K.piece(c, 540, 1000 + s.y, 0.02, 300, 300, C.card, 51, (cc) => { cc.fillStyle = C.ink; cc.fillRect(-50, -40, 22, 80); cc.fillRect(28, -40, 22, 80); });
    const pin = SM(seg(0.6, 1.0, tq)); K.piece(c, 540, lerp(560, 760, pin), -0.02, 200, 180, C.forest, 52, (cc) => { cc.fillStyle = '#B9C2BE'; cc.fillRect(-50, 90, 22, 70); cc.fillRect(28, 90, 22, 70); });
    if (tq >= 1.0) { const sp = seg(1.0, 1.5, t); for (let i = 0; i < 5; i++) { const a = -2.6 + i * 0.55; strokePts(c, [[540 + Math.cos(a) * 180, 900 + Math.sin(a) * 180], [540 + Math.cos(a) * 260, 900 + Math.sin(a) * 260]], C.amber, 9, 0, sp); } }
    K.finish(c, t); cap(c, t, 'hook');
  }

  // ---------------- THEN (5 s, collage)
  const itemArt = (cc, k) => { cc.fillStyle = C.ink; cc.strokeStyle = C.ink; cc.lineWidth = 5;
    if (k === 0) { cc.beginPath(); cc.moveTo(-80, 50); cc.lineTo(-20, -30); cc.lineTo(20, 20); cc.lineTo(50, -10); cc.lineTo(90, 50); cc.closePath(); cc.fill(); cc.beginPath(); cc.arc(55, -45, 14, 0, TAU); cc.fill(); }
    if (k === 1) { cc.strokeRect(-90, -50, 180, 100); for (let i = 0; i < 6; i++) { cc.fillRect(-85 + i * 30, -46, 14, 12); cc.fillRect(-85 + i * 30, 34, 14, 12); } cc.beginPath(); cc.moveTo(-15, -20); cc.lineTo(25, 0); cc.lineTo(-15, 20); cc.closePath(); cc.fill(); }
    if (k === 2) { cc.strokeRect(-90, -60, 180, 120); cc.fillRect(-90, -60, 180, 22); for (let i = 0; i < 3; i++) cc.fillRect(-70, -20 + i * 24, 120 - i * 25, 8); } };
  function thenA(c, t) { // a cut-out server rack; PHOTOS / VIDEOS / WEB PAGES prints slide into its slots on each word; the green ring on STORED
    K.paperBg(c); tag(c, t, '01', 'THEN', C.amber);
    const r = K.drop(t, 0.1); if (r) K.piece(c, 300, 960 + r.y, -0.02, 330, 760, '#2E3532', 61, (cc, W, H) => { cc.strokeStyle = '#7C8A84'; cc.lineWidth = 3; for (let i = 0; i < 9; i++) { cc.strokeRect(-W / 2 + 30, -H / 2 + 40 + i * 78, W - 60, 56); cc.fillStyle = i % 3 ? '#7C8A84' : C.amber; cc.fillRect(W / 2 - 60, -H / 2 + 62 + i * 78, 12, 12); } });
    ITEMS.forEach((w, i) => { const d = K.drop(t, 2.4 + i * 0.6); if (!d) return; const y = 700 + i * 260;
      K.piece(c, 750, y + d.y, [0.05, -0.04, 0.03][i], 340, 230, C.card, 70 + i, (cc) => { cc.save(); cc.translate(0, -20); itemArt(cc, i); cc.restore(); cc.font = `400 40px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText(w, 0, 95); }); K.tape(c, 750, y - 115 + d.y, 100, 28, 0.1); });
    const h = K.drop(t, 0.6); if (h) K.strip(c, 90, 470 + h.y, -0.03, 'THEY STORED THINGS', 100, C.paper, C.forest, 8);
    K.markerRing(c, 610, 470, 220, 78, seg(4.4, 4.9, t), C.green, 21);
    K.finish(c, t); cap(c, t, 'then');
  }
  function thenB(c, t) { // a filing cabinet "DATA CENTRE"; drawers slide open on PHOTOS / VIDEOS / WEB PAGES; the green ring on the label
    K.paperBg(c, '#EFE6D2'); tag(c, t, '01', 'THEN', C.amber);
    const cb = K.drop(t, 0.1); if (cb) K.piece(c, 540, 980 + cb.y, 0.01, 560, 800, '#C9C2B0', 62, (cc, W, H) => { cc.font = `400 64px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText('DATA CENTRE', 0, -H / 2 + 90); });
    ITEMS.forEach((w, i) => { const o = SM(seg(2.4 + i * 0.6, 2.8 + i * 0.6, q12(t))), y = 840 + i * 200; K.piece(c, 540 + 120 * o, y, 0, 480, 160, C.card, 90 + i, (cc) => { cc.fillStyle = C.ink; cc.fillRect(-40, -50, 80, 14); cc.font = `400 46px ${ANTON}`; cc.textAlign = 'center'; cc.fillText(w, 0, 40); }, {amp: 2}); });
    K.markerRing(c, 540, 670, 250, 70, seg(4.4, 4.9, t), C.green, 23);
    K.finish(c, t); cap(c, t, 'then');
  }
  function thenC(c, t) { // a photo-album page; three prints taped on, one per word; highlighter on "store"
    K.paperBg(c); tag(c, t, '01', 'THEN', C.amber);
    const pg = K.drop(t, 0.1); if (pg) K.piece(c, 540, 980 + pg.y, -0.015, 840, 980, '#1E2522', 63, (cc, W, H) => { cc.font = `italic 700 50px ${SERIF}`; cc.fillStyle = C.paper; cc.fillText('What the cloud kept', -W / 2 + 60, -H / 2 + 110); });
    ITEMS.forEach((w, i) => { const d = K.drop(t, 2.4 + i * 0.6); if (!d) return; const x = [330, 750, 540][i], y = [800, 860, 1180][i]; K.piece(c, x, y + d.y, [-0.08, 0.06, -0.03][i], 330, 260, C.card, 110 + i, (cc) => { cc.save(); cc.translate(0, -20); itemArt(cc, i); cc.restore(); cc.font = `400 38px ${ANTON}`; cc.fillStyle = C.ink; cc.textAlign = 'center'; cc.fillText(w, 0, 105); }); K.tape(c, x - 100, y - 120 + d.y, 90, 26, -0.6); K.tape(c, x + 100, y - 120 + d.y, 90, 26, 0.6); });
    K.markerRing(c, 540, 1180, 210, 150, seg(4.4, 4.9, t), C.green, 27);
    K.finish(c, t); cap(c, t, 'then');
  }

  // ---------------- NOW (10 s, Manim)
  function gauge(c, t) { // 0–2.4: a meter needle swings from idle to high
    const g = 1 - sm(2.3, 2.6, t); if (g <= 0) return; const cx = 540, cy = 980, R = 260, a0 = Math.PI, a1 = 2 * Math.PI;
    const arc = []; for (let i = 0; i <= 60; i++) { const a = a0 + (a1 - a0) * i / 60; arc.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
    strokePts(c, arc, C.white, 5, 0, sm(0.05, 0.6, t), g); const v = 0.15 + 0.75 * SM(seg(0.8, 1.8, t)), a = a0 + (a1 - a0) * v;
    strokePts(c, [[cx, cy], [cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85]], C.amber, 8, 0, sm(0.3, 0.6, t), g); dot(c, cx, cy, 14, C.white, g);
    drawTex(c, layout(c, [T('power', {f: 'mono'})], 30, 540, 1060, 'center'), {p: seg(0.5, 0.9, t), alpha: g, col: C.fog});
  }
  function nowA(c, t) { // gauge -> 485 TWh bar -> doubles (dashed, projection) -> ≈3% world wedge (green) -> AI part ×3
    voidBg(c); tag(c, t, '02', 'NOW', C.white); gauge(c, t);
    if (t > 2.5) { const W = 300, b1 = sm(2.6, 3.2, t), b2 = sm(5.0, 5.8, t);
      drawTex(c, layout(c, [T('485 TWh', {f: 'stix'}), T('  2025', {f: 'mono', sz: 0.4})], 100, 150, 640), {p: seg(2.5, 3.1, t)});
      strokePts(c, [[150, 720], [150 + W, 720]], C.white, 26, 0, b1);
      if (b2 > 0) { c.save(); c.setLineDash([16, 12]); strokePts(c, [[150 + W, 720], [150 + 2 * W, 720]], C.white, 26, 0, b2, 0.8); c.restore(); drawTex(c, layout(c, [T('~950 TWh', {f: 'stix'}), T('  2030 · projection', {f: 'mono', sz: 0.4})], 70, 150, 820), {p: seg(5.4, 6.0, t)}); }
      const wd = sm(6.2, 7.0, t); if (wd > 0) { const cx = 540, cy = 1130, R = 150; strokePts(c, Array.from({length: 61}, (_, i) => [cx + Math.cos(i / 60 * TAU) * R, cy + Math.sin(i / 60 * TAU) * R]), C.fog, 4, 0, 1, wd);
        c.save(); c.globalAlpha = wd; c.fillStyle = C.green; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * 0.03 * wd); c.closePath(); c.fill(); c.restore();
        drawTex(c, layout(c, [T('≈3%', {f: 'stix'}), T(' of world electricity, 2030', {f: 'mono', sz: 0.35})], 80, 720, 1150), {p: seg(6.6, 7.2, t), col: C.green}); }
      const ai = [sm(8.3, 8.5, t), sm(8.8, 9.0, t), sm(9.3, 9.5, t)]; if (ai[0] > 0) { drawTex(c, layout(c, [T('AI part', {f: 'mono'})], 26, 150, 920), {col: C.fog}); ai.forEach((p, i) => strokePts(c, [[300 + i * 90, 912], [380 + i * 90, 912]], C.amber, 22, 0, p)); drawTex(c, layout(c, [T('×3', {f: 'stix'})], 60, 590, 932), {p: seg(9.4, 9.8, t), col: C.amber}); }
      src(c, t, 3.2, 1360); }
    cap(c, t, 'now');
  }
  function nowB(c, t) { // two points on Manim axes: 485 (2025) -> ~950 (2030, dashed = projection); ≈3% in green; AI line ×3
    voidBg(c); tag(c, t, '02', 'NOW', C.white); gauge(c, t);
    if (t > 2.5) { const A = {ox: 200, oy: 1250, ux: 140, uy: 0.6}, ap = seg(2.6, 3.1, t);
      strokePts(c, [[A.ox, A.oy], [A.ox + 5.4 * A.ux, A.oy]], C.white, 3, 0, SM(ap)); strokePts(c, [[A.ox, A.oy], [A.ox, A.oy - 650]], C.white, 3, 0, SM(ap));
      drawTex(c, layout(c, [T('TWh', {f: 'mono'})], 24, A.ox + 14, A.oy - 650), {p: seg(2.8, 3.2, t), col: C.fog});
      const p1 = [A.ox + 0.5 * A.ux, A.oy - 485 * A.uy], p2 = [A.ox + 5.0 * A.ux, A.oy - 950 * A.uy];
      drawTex(c, layout(c, [T('2025', {f: 'mono'})], 26, p1[0], A.oy + 44, 'center'), {p: seg(3.0, 3.4, t), col: C.fog}); drawTex(c, layout(c, [T('2030', {f: 'mono'})], 26, p2[0], A.oy + 44, 'center'), {p: seg(3.1, 3.5, t), col: C.fog});
      dot(c, ...p1, 13 * sm(3.2, 3.5, t), C.white); drawTex(c, layout(c, [T('485', {f: 'stix'})], 60, p1[0] + 20, p1[1] - 30), {p: seg(3.3, 3.8, t)});
      const hop = sm(5.0, 5.9, t); if (hop > 0) { c.save(); c.setLineDash([16, 12]); strokePts(c, [p1, p2], C.white, 4, 0, hop); c.restore(); dot(c, lerp(p1[0], p2[0], hop), lerp(p1[1], p2[1], hop), 13, C.white); }
      drawTex(c, layout(c, [T('~950', {f: 'stix'})], 60, p2[0] - 20, p2[1] - 30, 'right'), {p: seg(5.8, 6.3, t)});
      drawTex(c, layout(c, [T('≈3% of world electricity', {f: 'stix'})], 64, 540, 520, 'center'), {p: seg(6.3, 7.1, t), col: C.green});
      const ai = sm(8.3, 9.4, t); if (ai > 0) { const q1 = [A.ox + 0.5 * A.ux, A.oy - 100 * A.uy], q2 = [A.ox + 5.0 * A.ux, A.oy - 300 * A.uy]; strokePts(c, [q1, [lerp(q1[0], q2[0], ai), lerp(q1[1], q2[1], ai)]], C.amber, 5, 0, 1); drawTex(c, layout(c, [T('AI part ×3', {f: 'mono'})], 28, q2[0], q2[1] + 40, 'right'), {p: seg(9.2, 9.7, t), col: C.amber}); }
      src(c, t, 3.4, A.oy + 100); }
    cap(c, t, 'now');
  }
  function nowC(c, t) { // a 10×10 grid = the world's electricity in 2030; 3 squares light green; 485 -> ~950 written above; AI ×3
    voidBg(c); tag(c, t, '02', 'NOW', C.white); gauge(c, t);
    if (t > 2.5) { drawTex(c, layout(c, [T('485', {f: 'stix'}), T(' → ', {f: 'stix'}), T('~950', {f: 'stix'}), T(' TWh', {f: 'mono', sz: 0.4})], 110, 540, 600, 'center'), {p: seg(2.6, 3.6, t)});
      for (let i = 0; i < 100; i++) { const x = 260 + (i % 10) * 58, y = 720 + Math.floor(i / 10) * 58, a = sm(5.0 + i * 0.008, 5.3 + i * 0.008, t); if (a <= 0) continue; const on = i >= 97 ? sm(6.3 + (i - 97) * 0.25, 6.5 + (i - 97) * 0.25, t) : 0;
        c.save(); c.globalAlpha = a; c.strokeStyle = C.fog; c.lineWidth = 2; c.strokeRect(x, y, 48, 48); if (on > 0) { c.globalAlpha = on; c.fillStyle = C.green; c.fillRect(x + 3, y + 3, 42, 42); } c.restore(); }
      drawTex(c, layout(c, [T('≈3 in 100 · world electricity, 2030', {f: 'mono'})], 28, 540, 1340, 'center'), {p: seg(7.0, 7.5, t), col: C.fog, alpha: 1 - sm(8.1, 8.4, t)});
      drawTex(c, layout(c, [T('AI part ×3', {f: 'stix'})], 64, 540, 1350, 'center'), {p: seg(8.4, 9.0, t), col: C.amber});
      src(c, t, 3.4, 1390); }
    cap(c, t, 'now');
  }

  // ---------------- NEXT (5.4 s, voxel / flow)
  function cityVox(t, lit) { const L = []; const r = (x, y) => ((x * 7 + y * 13) % 5); for (let x = -6; x < 7; x++) for (let y = -5; y < 6; y++) { if (Math.abs(x) <= 1 && Math.abs(y) <= 1) continue; const h = 1 + r(x, y); for (let z = 0; z < h; z++) L.push({x, y, z, c: z === h - 1 ? '#56645E' : '#3B4743'}); }
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = 0; z < 7; z++) L.push({x, y, z, c: z === 6 && x === 0 && y === 0 ? C.green : '#D6DCD9', e: z === 6 && x === 0 && y === 0});
    for (let k = 0; k < 6; k++) { const on = lit > k / 6; L.push({x: -6 + k, y: 3, z: 1 + ((k * 3) % 3), c: on ? C.amber : '#3B4743', e: on}); } return L; }
  function nextA(c, t) { // a voxel city; power runs block by block into one data-centre block (the green light on top); a voxel bill prints out
    K.voxGround(c); tag(c, t, '03', 'NEXT', C.green);
    const pr = K.proj(540, 1220, 34, K.YAW + 0.07 * t), list = K.fallIn(cityVox(t, seg(0.8, 2.4, t)), t, (v) => 0.05 + (v.x + 6) * 0.03 + v.z * 0.05);
    const bill = seg(2.9, 4.4, t); for (let z = 0; z < Math.floor(9 * bill); z++) for (let x = 0; x < 4; x++) list.push({x: 2 + x, y: 2, z: 7 + z, c: z % 2 && x > 0 && x < 3 ? '#2C5E4E' : '#EDEFEA'});
    K.voxels(c, list, pr); cap(c, t, 'next');
  }
  function nextB(c, t) { // the engine flow field with a Manim bill drawing on
    if (!nextB.ep) nextB.ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 5.4, score: null, scenes: [{type: 'field_push', t: [0, 5.4]}], act_tags: [{t: [0, 5.4], num: '03', label: 'NEXT'}], captions: CAPS.next.map(([a, b, x]) => ({t: [a, b], text: x}))});
    nextB.ep.render(c, c.canvas.width, c.canvas.height, t, true);
    const b = sm(2.9, 3.6, t); if (b > 0) { c.save(); c.fillStyle = 'rgba(5,8,7,.75)'; c.globalAlpha = b; c.fillRect(330, 560, 420, 520); c.restore(); strokePts(c, rectPts(330, 560, 750, 1080), C.white, 4, 0, b); drawTex(c, layout(c, [T('BILL', {f: 'mono'})], 60, 540, 660, 'center'), {p: seg(3.3, 3.8, t)}); for (let i = 0; i < 5; i++) strokePts(c, [[380, 740 + i * 60], [700 - (i % 2) * 80, 740 + i * 60]], C.fog, 4, 0, sm(3.6 + i * 0.12, 3.9 + i * 0.12, t)); drawTex(c, layout(c, [T('?', {f: 'stix'})], 140, 540, 1050, 'center'), {p: seg(4.3, 4.8, t), col: C.amber}); }
  }
  function nextC(c, t) { // a voxel power plant cabled to a data centre; the cable lights block by block; the data centre's light is the one green
    K.voxGround(c); tag(c, t, '03', 'NEXT', C.green);
    const pr = K.proj(540, 1220, 36, K.YAW + 0.06 * t), L = [];
    for (const [ox, oy] of [[-7, -2], [-7, 2]]) for (let z = 0; z < 8; z++) for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) if (z < 7 || (x + y) % 2) L.push({x: ox + x, y: oy + y, z, c: '#9AA5A0'});
    for (let x = 4; x < 8; x++) for (let y = -1; y < 2; y++) for (let z = 0; z < 4; z++) L.push({x, y, z, c: z === 3 && x === 5 && y === 0 ? C.green : '#D6DCD9', e: z === 3 && x === 5 && y === 0});
    const lit = seg(0.9, 2.6, t); for (let x = -5; x < 4; x++) L.push({x, y: 0, z: 0, c: lit > (x + 5) / 9 ? C.amber : '#3B4743', e: lit > (x + 5) / 9});
    for (let x = -9; x < 10; x++) for (let y = -5; y < 5; y++) L.push({x, y, z: -1, c: (x + y) % 2 ? '#0B3D2E' : '#0E4636'});
    K.voxels(c, K.fallIn(L, t, (v) => 0.05 + (v.x + 9) * 0.02 + Math.max(0, v.z) * 0.05), pr); cap(c, t, 'next');
  }

  const engineScene = (fn) => ({at: 0, draw: (ctx, t) => { CH = false; try { fn(ctx, t); } finally { CH = true; } }});
  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, {x003_hook_line: engineScene(hookA), x003_then_rack: engineScene(thenA), x003_now_power: engineScene(nowA), x003_next_city: engineScene(nextA)});
  return {CAPS, scenes: [
    {id: 'hook', label: 'Hook', act: 'cold open', lines: 'L01', dur: 2.8, options: [
      {name: 'Chat bubble + power line', draw: hookA, keys: [0.6, 1.6, 2.5], note: 'A chat bubble types "how do I…"; a power line under it lights segment by segment (ticks) and ends in one green spark.'},
      {name: 'Studio Enter (approved)', draw: hookB, keys: [0.4, 1.4, 2.4], note: 'The approved EP000 hook; on-brand, but says nothing about power.'},
      {name: 'Collage plug', draw: hookC, keys: [0.5, 1.1, 1.8], note: 'Dark kraft; a cut-out plug drops into a socket (click), Amber marker sparks. Warm; previews THEN.'}]},
    {id: 'then', label: 'THEN', act: 'Editorial Collage', lines: 'L02–L03', dur: 5, options: [
      {name: 'Server rack + prints', draw: thenA, keys: [1.0, 3.4, 4.8], note: 'A cut-out server rack; PHOTOS, VIDEOS, WEB PAGES prints drop in on each word; "THEY STORED THINGS" with the green ring.'},
      {name: 'Filing cabinet', draw: thenB, keys: [1.0, 3.4, 4.8], note: 'A DATA CENTRE filing cabinet; drawers slide open on each word; the green ring on the label.'},
      {name: 'Photo-album page', draw: thenC, keys: [1.0, 3.4, 4.8], note: 'A dark album page "What the cloud kept"; three prints taped on, one per word; the green ring on the last.'}]},
    {id: 'now', label: 'NOW', act: 'Manim', lines: 'L04–L07', dur: 10, options: [
      {name: 'Gauge, bars, 3% wedge', draw: nowA, keys: [1.6, 3.6, 7.2, 9.6], note: 'A meter needle swings up; 485 TWh bar; dashed doubling to ~950 (labelled projection); a world-electricity circle with a green ≈3% wedge; the AI part triples (×3).'},
      {name: 'Two-point chart', draw: nowB, keys: [1.6, 3.8, 6.8, 9.6], note: 'Only the two IEA points (2025 485, 2030 ~950 dashed = projection), green ≈3% header, an Amber AI line tripling.'},
      {name: '100-square grid', draw: nowC, keys: [1.6, 3.6, 7.2, 9.6], note: '485 → ~950 TWh written; a 10×10 grid = the world’s electricity in 2030; 3 squares light green one by one (clicks); "AI part ×3".'}]},
    {id: 'next', label: 'NEXT', act: 'Voxel or Flow Field', lines: 'L08–L09', dur: 5.4, options: [
      {name: 'Voxel city + bill', draw: nextA, keys: [0.8, 2.2, 4.6], note: 'A voxel city; power runs block by block into one data-centre block (green light on top); a voxel bill prints out of it on "who pays the bill?".'},
      {name: 'Flow field + bill', draw: nextB, keys: [0.8, 3.4, 5.0], note: 'The approved NEXT flow field; a Manim bill draws on with an Amber "?".'},
      {name: 'Power plant → data centre', draw: nextC, keys: [0.8, 2.2, 4.6], note: 'Voxel power-plant stacks cabled to a data centre; the cable lights block by block; the data centre’s light is the one green.'}]},
  ]};
})();
