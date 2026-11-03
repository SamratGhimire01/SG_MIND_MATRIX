/* X006 LOG · Day 001 "Why our sound felt worse" — storyboard options v001: 3 drafts per scene, 1080x1920, pure functions of t.
   A = screen capture + cards (the LOG format: Samrat's real screen recording goes in the placeholder frame), B = build-log cards in the
   Manim style, C = the same beat as a Pop Explainer scene. All numbers are our own measurements (../research/SGMM_X006_sources_v001.md);
   the reference videos are never shown or named. Needs sgmm_manim.js, x001_options.js (SGMM_KIT), the engine and SGMM_POP loaded first. */
window.X006_OPT = (() => {
  const K = SGMM_KIT, M = SGMM_MANIM.P, P = SGMM_POP, {C, TAU} = K, {T, layout, drawTex, strokePts, rectPts, SM, seg, sm, lerp} = M;
  const CAPS = {
    hook: [[0.05, 3.0, 'Today I found out why\nour videos sound worse.']],
    find: [[0.0, 2.8, 'I measured our mix against\nan explainer that sounds great.'], [3.0, 6.2, 'Same voice level… but we had\n16 dB more deep bass.']],
    stereo: [[0.0, 3.2, 'Theirs sits in the centre.\nOurs spreads wide.']],
    fix: [[0.0, 4.2, 'So tomorrow: cut the bass,\npull it to the middle,\nmore small hits.'], [4.4, 6.2, 'Day 002 starts… now.']],
  };
  const POPCAPS = {
    hook: [[0.0, 3.0, 'Today I found out why\nour videos *sound worse*.']],
    find: [[0.0, 2.9, 'I measured our mix against\nan explainer that *sounds great*.'], [2.9, 6.2, 'Same voice level… but we had\n*16 dB more deep bass*.']],
    stereo: [[0.0, 3.2, 'Theirs sits in the *centre*.\nOurs spreads *wide*.']],
    fix: [[0.0, 4.3, 'So tomorrow: *cut the bass*,\npull it to the middle…']], // the 3rd beat is carried by the pills; L06 is the counter
  };
  const cap = (c, t, k) => K.caption(c, t, CAPS[k]), pcap = (c, t, k, mode) => P.caption(c, t, POPCAPS[k], mode);
  const voidBg = (c) => { c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); };
  const MONO = M.FAM.mono;
  function rec(c, t, day = '001') { const on = Math.floor(t * 2) % 2; c.save(); c.fillStyle = on ? C.amber : 'rgba(255,181,71,.35)'; c.beginPath(); c.arc(96, 330, 16, 0, TAU); c.fill(); c.font = `700 34px ${MONO}`; c.fillStyle = C.white; c.textBaseline = 'middle'; c.fillText(`REC · DAY ${day}`, 128, 332); c.restore(); }
  function screen(c, t, a) { // placeholder for Samrat's real screen recording (never a drawn fake): grey frame + label
    const g = sm(a, a + 0.4, t); if (g <= 0) return; c.save(); c.globalAlpha = g; c.fillStyle = '#121816'; c.beginPath(); c.roundRect(70, 560, 940, 640, 26); c.fill(); c.strokeStyle = C.fog; c.lineWidth = 3; c.setLineDash([12, 10]); c.stroke(); c.setLineDash([]);
    c.font = `700 28px ${MONO}`; c.fillStyle = C.fog; c.textAlign = 'center'; c.fillText('YOUR SCREEN RECORDING GOES HERE', 540, 860); c.font = `500 22px ${MONO}`; c.fillText('terminal: audio_study.py printing the numbers', 540, 905); c.restore(); }
  const ROWS = [['deep bass < 80 Hz', '−29.0 dB', '−13.4 dB'], ['stereo side vs mid', '−28…−30 dB', '−20.1 dB'], ['sound hits / s', '1.8–2.5', '1.65']];
  function table(c, t, a, y, o = {}) { c.save(); c.font = `700 30px ${MONO}`; c.textBaseline = 'middle'; c.fillStyle = C.fog; c.fillText('', 0, 0);
    [['', 'THEIRS', 'OURS']].concat(ROWS).forEach((r, i) => { const at = a + i * 0.35; if (t < at) return; c.globalAlpha = seg(at, at + 0.15, t); r.forEach((v, j) => { c.fillStyle = i === 0 ? C.fog : (j === 2 && i === 1 && o.hl ? C.amber : C.white); c.fillText(v, [110, 560, 790][j], y + i * 70); }); }); c.restore(); }

  // ---------------- HOOK (3 s)
  function hookA(c, t) { voidBg(c); rec(c, t); screen(c, t, 0.1); cap(c, t, 'hook'); }
  function hookB(c, t) { // build-log card: LOG · DAY 001, the measurement table prints in
    voidBg(c); rec(c, t); strokePts(c, rectPts(70, 600, 1010, 1060), C.white, 3, 0, sm(0.1, 0.5, t)); drawTex(c, layout(c, [T('LOG · DAY 001', {f: 'sg', w: 700})], 56, 110, 680), {p: seg(0.3, 0.8, t)}); table(c, t, 0.9, 790); cap(c, t, 'hook');
  }
  function hookC(c, t) { // Pop: REC pill, an OURS waveform card, a "?" bubble
    P.bg(c, t, 'dark'); P.pill(c, t, 0.2, 540, 500, 'REC · DAY 001', {kind: 'dark', rot: 0});
    P.card(c, t, 0.5, 540, 960, 800, 320, (cc) => { cc.strokeStyle = C.forest; cc.lineWidth = 6; cc.beginPath(); for (let x = -340; x <= 340; x += 6) { const y = Math.sin(x * 0.05) * 60 * Math.sin(x * 0.011) + 20; x === -340 ? cc.moveTo(x, y) : cc.lineTo(x, y); } cc.stroke(); }, {label: 'OUR MIX · X003'});
    P.qBubble(c, t, 1.8, 880, 790, 64); pcap(c, t, 'hook', 'dark');
  }

  // ---------------- FINDING (6.2 s): deep bass
  function meterBar(c, x, y, h, v, col, lab, val) { c.save(); c.fillStyle = 'rgba(124,138,132,.22)'; c.fillRect(x, y - h, 140, h); c.fillStyle = col; c.fillRect(x, y - h * v, 140, h * v); c.font = `700 30px ${MONO}`; c.fillStyle = C.white; c.textAlign = 'center'; c.fillText(lab, x + 70, y + 50); c.fillText(val, x + 70, y - h * v - 24); c.restore(); }
  function findA(c, t) { // screen capture, then two meters THEIRS / OURS for deep bass; OURS shoots up; +16 dB green pill
    voidBg(c); rec(c, t); if (t < 3.0) screen(c, t, 0); else { const v = sm(3.4, 4.4, t); meterBar(c, 260, 1240, 560, 0.27, C.white, 'THEIRS', '−29 dB'); meterBar(c, 680, 1240, 560, lerp(0.27, 0.82, v), C.white, 'OURS', v > 0.5 ? '−13.4 dB' : ''); drawTex(c, layout(c, [T('deep bass · below 80 Hz', {f: 'mono'})], 28, 540, 560, 'center'), {p: seg(3.0, 3.4, t), col: C.fog});
      if (t > 4.6) P.pill(c, t, 4.6, 750, 520 + 120, '+16 dB', {kind: 'green', size: 40}); }
    cap(c, t, 'find');
  }
  function findB(c, t) { // Manim: an axis in dB, two bars draw, a delta arrow labelled +16 dB
    voidBg(c); rec(c, t); const ax = sm(0.2, 0.8, t); strokePts(c, [[150, 1240], [930, 1240]], C.fog, 4, 0, ax); strokePts(c, [[150, 1240], [150, 620]], C.fog, 4, 0, ax);
    drawTex(c, layout(c, [T('energy below 80 Hz', {f: 'mono'})], 26, 170, 600), {p: seg(0.6, 1.0, t), col: C.fog});
    const b1 = sm(1.2, 1.8, t), b2 = sm(3.4, 4.2, t); c.fillStyle = C.white; c.fillRect(260, 1240 - 160 * b1, 180, 160 * b1); c.fillRect(620, 1240 - 480 * b2, 180, 480 * b2);
    drawTex(c, layout(c, [T('theirs', {f: 'mono'})], 28, 350, 1290, 'center'), {p: seg(1.2, 1.6, t)}); drawTex(c, layout(c, [T('ours', {f: 'mono'})], 28, 710, 1290, 'center'), {p: seg(3.4, 3.8, t)});
    if (t > 4.4) { M.arrow(c, 880, 1080, 880, 760, C.green, 6, sm(4.4, 4.9, t)); drawTex(c, layout(c, [T('+16', {f: 'stix'}), T(' dB', {f: 'mono', sz: 0.4})], 70, 760, 700), {p: seg(4.8, 5.2, t), col: C.green}); }
    cap(c, t, 'find');
  }
  function findC(c, t) { // Pop: light stage; a DEEP BASS card with THEIRS / OURS pills; a big Amber "+16 dB" sticker
    const mode = t < 2.9 ? 'dark' : 'light'; P.bg(c, t, mode);
    if (t < 2.9) { P.pill(c, t, 0.3, 360, 900, 'OURS', {kind: 'white', size: 44}); P.pill(c, t, 0.9, 720, 900, 'THEIRS', {kind: 'white', size: 44}); P.withPop(c, t, 1.4, 540, 900, (cc) => { cc.font = `700 60px ${P.SG}`; cc.fillStyle = C.amber; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VS', 0, 0); }); }
    else { P.card(c, t, 3.0, 540, 900, 820, 360, (cc) => { cc.font = `700 46px ${MONO}`; cc.fillStyle = C.void; cc.fillText('THEIRS   −29 dB', -340, -20); cc.fillText('OURS     −13 dB', -340, 70); }, {label: 'DEEP BASS · BELOW 80 Hz'}); P.sticker(c, t, 4.6, 540, 1260, '+16 dB', {size: 80, r: 220}); }
    pcap(c, t, 'find', mode);
  }

  // ---------------- STEREO (3.2 s)
  const cloud = (c, cx, cy, spread, t, a, n = 60) => { const r = M.rng(7); for (let i = 0; i < n; i++) { const q = seg(a + i * 0.01, a + 0.3 + i * 0.01, t); if (q <= 0) continue; const x = cx + (r() - 0.5) * 2 * spread, y = cy + (r() - 0.5) * 260; c.globalAlpha = q; c.fillStyle = C.white; c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); } c.globalAlpha = 1; };
  function stereoA(c, t) { voidBg(c); rec(c, t); [['THEIRS', 300, 40, 0.2], ['OURS', 780, 170, 1.4]].forEach(([l, x, sp, a]) => { strokePts(c, rectPts(x - 220, 700, x + 220, 1150), C.fog, 3, 0, sm(a - 0.1, a + 0.3, t)); cloud(c, x, 925, sp, t, a); drawTex(c, layout(c, [T(l, {f: 'mono', w: 700}), T('   L ← → R', {f: 'mono', sz: 0.6})], 30, x, 1210, 'center'), {p: seg(a, a + 0.4, t)}); }); cap(c, t, 'stereo'); }
  function stereoB(c, t) { // Manim: two stereo fields as half circles, a narrow vs a wide wedge
    voidBg(c); rec(c, t); [['theirs', 330, 0.12, 0.2], ['ours', 750, 0.42, 1.4]].forEach(([l, x, w, a]) => { const cy = 1150, R = 200; strokePts(c, Array.from({length: 41}, (_, i) => [x + Math.cos(Math.PI + i / 40 * Math.PI) * R, cy + Math.sin(Math.PI + i / 40 * Math.PI) * R]), C.fog, 4, 0, sm(a, a + 0.4, t));
      const g = sm(a + 0.3, a + 0.9, t); c.save(); c.globalAlpha = 0.85 * g; c.fillStyle = C.white; c.beginPath(); c.moveTo(x, cy); c.arc(x, cy, R, -Math.PI / 2 - w * Math.PI * g, -Math.PI / 2 + w * Math.PI * g); c.closePath(); c.fill(); c.restore(); drawTex(c, layout(c, [T(l, {f: 'mono'})], 30, x, 1210, 'center'), {p: seg(a, a + 0.4, t)}); }); cap(c, t, 'stereo'); }
  function stereoC(c, t) { // Pop: L and R speaker pills; THEIRS dot sits in the middle; OURS dots fly out to the sides
    P.bg(c, t, 'dark'); P.pill(c, t, 0.1, 160, 960, 'L', {kind: 'white', size: 50}); P.pill(c, t, 0.2, 920, 960, 'R', {kind: 'white', size: 50});
    P.withPop(c, t, 0.5, 540, 860, (cc) => { cc.fillStyle = C.white; cc.beginPath(); cc.arc(0, 0, 40, 0, TAU); cc.fill(); }); P.pill(c, t, 0.7, 540, 760, 'THEIRS · CENTRE', {kind: 'amber', size: 26});
    const w = P.out3(seg(1.6, 2.2, t)); if (t > 1.5) [-1, 1].forEach((s) => { c.fillStyle = C.white; c.beginPath(); c.arc(540 + s * 300 * w, 1080, 32, 0, TAU); c.fill(); }); P.pill(c, t, 1.9, 540, 1200, 'OURS · WIDE', {kind: 'dark', size: 26}); pcap(c, t, 'stereo', 'dark');
  }

  // ---------------- FIX + LOOP (6.2 s)
  const FIX = ['CUT THE BASS', 'PULL IT TO THE MIDDLE', 'MORE SMALL HITS'];
  function counter(c, t, a, y, mode) { const f = seg(a, a + 0.35, t), d = f < 0.5 ? '001' : '002', sy = Math.abs(Math.cos(f * Math.PI)); c.save(); c.translate(540, y); c.scale(1, Math.max(sy, 0.03)); c.fillStyle = mode === 'light' ? C.void : C.white; c.beginPath(); c.roundRect(-260, -110, 520, 220, 26); c.fill(); c.font = `700 120px ${MONO}`; c.fillStyle = mode === 'light' ? C.white : C.void; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(`DAY ${d}`, 0, 8, 480); c.restore(); }
  function fixA(c, t) { // checklist card, three items tick (the last tick is the green), counter flips 001 -> 002, dead stop on black
    if (t > 6.0) return voidBg(c); voidBg(c); rec(c, t, t > 5.0 ? '002' : '001');
    if (t < 4.4) { strokePts(c, rectPts(110, 700, 970, 1160), C.white, 3, 0, sm(0, 0.3, t)); drawTex(c, layout(c, [T('TOMORROW', {f: 'mono', w: 700})], 30, 150, 760), {p: seg(0.1, 0.4, t), col: C.fog});
      FIX.forEach((s, i) => { const a = 0.6 + i * 1.1; drawTex(c, layout(c, [T(s, {f: 'mono', w: 700})], 40, 240, 860 + i * 110), {p: seg(a, a + 0.4, t)}); strokePts(c, rectPts(150, 830 + i * 110, 200, 880 + i * 110), C.white, 4, 0, sm(a, a + 0.3, t)); if (t > a + 0.6) strokePts(c, [[158, 855 + i * 110], [172, 870 + i * 110], [196, 838 + i * 110]], i === 2 ? C.green : C.white, 7, 0, sm(a + 0.6, a + 0.9, t)); }); }
    else counter(c, t, 4.8, 960, 'dark'); cap(c, t, 'fix');
  }
  function fixB(c, t) { // three Deep Forest build-log cards stack with pictograms; then the counter
    if (t > 6.0) return voidBg(c); voidBg(c); rec(c, t, t > 5.0 ? '002' : '001');
    if (t < 4.4) FIX.forEach((s, i) => { const a = 0.4 + i * 1.1; if (t < a) return; const q = SM(seg(a, a + 0.35, t)); c.save(); c.translate(lerp(1300, 540, q), 800 + i * 170); c.fillStyle = C.forest; c.beginPath(); c.roundRect(-430, -70, 860, 140, 22); c.fill(); c.font = `700 38px ${MONO}`; c.fillStyle = C.white; c.textBaseline = 'middle'; c.fillText(s, -330, 4); c.strokeStyle = C.amber; c.lineWidth = 6; c.beginPath(); if (i === 0) { c.moveTo(-400, 20); c.lineTo(-370, -20); c.lineTo(-340, 20); } else if (i === 1) { c.moveTo(-400, 0); c.lineTo(-350, 0); c.moveTo(-375, -25); c.lineTo(-375, 25); } else { c.arc(-375, 0, 22, 0, TAU); } c.stroke(); c.restore(); });
    else counter(c, t, 4.8, 960, 'dark'); cap(c, t, 'fix');
  }
  function fixC(c, t) { // Pop: three pills pop with ticks, then the DAY counter card flips; dead stop on black
    if (t > 6.0) return voidBg(c); P.bg(c, t, 'light');
    if (t < 4.4) FIX.forEach((s, i) => { P.pill(c, t, 0.8 + i * 1.0, 540, 820 + i * 170, (i === 2 ? '✓ ' : '✓ ') + s, {kind: i === 2 ? 'green' : 'dark', size: 36, rot: 0}); });
    else counter(c, t, 4.8, 960, 'light'); pcap(c, t, 'fix', 'light');
  }

  /* Samrat's picks (3 Nov 2026): all A */
  const chrome = (v) => K.setChrome(v);
  const SND = {
    hook: (k, P, c) => { P('click', c(0.1), {f: 1800, g: 0.8}); P('whoosh', c(0.1), {dur: 0.4, g: 0.3}); for (let x = 0.5; x < 3; x += 0.5) P('tick', c(x), {f: 2600, g: 0.35}); for (let x = 1.0; x < 2.8; x += 0.09) P('key', c(x), {g: 0.2}); },
    find: (k, P, c) => { for (let x = 0.3; x < 2.8; x += 0.5) P('tick', c(x), {f: 2600, g: 0.35}); P('slide', c(3.0), {dur: 0.4, g: 0.6}); P('whoosh', c(3.4), {dur: 1.0, g: 0.35, top: 1800}); P('thud', c(4.4), {f: 90, g: 0.8}); P('pop', c(4.6), {f: 520}); P('ding', c(4.65), {f: 1568, g: 0.15}); },
    stereo: (k, P, c) => { P('stroke', c(0.1), {material: 'pen', dur: 0.3, g: 0.4}); for (let i = 0; i < 6; i++) P('tick', c(0.2 + i * 0.1), {f: 3000, g: 0.4}); P('stroke', c(1.3), {material: 'pen', dur: 0.3, g: 0.4}); for (let i = 0; i < 6; i++) P('tick', c(1.4 + i * 0.1), {f: 2400, g: 0.4, pan: (i % 2 ? 0.6 : -0.6)}); },
    fix: (k, P, c) => { P('stroke', c(0.0), {material: 'pen', dur: 0.3, g: 0.4}); for (let i = 0; i < 3; i++) { P('key', c(0.6 + i * 1.1), {g: 0.5}); P('click', c(1.2 + i * 1.1), {f: 2200 + i * 200, g: 0.9}); } P('whoosh', c(4.75), {dur: 0.3, g: 0.4}); P('click', c(4.95), {f: 2600, g: 1}); },
  };
  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, {x006_hook: P.engineScene(hookA, 3.0, SND.hook, chrome), x006_find: P.engineScene(findA, 6.2, SND.find, chrome), x006_stereo: P.engineScene(stereoA, 3.2, SND.stereo, chrome), x006_fix: P.engineScene(fixA, 6.2, SND.fix, chrome)});

  const O = (name, draw, keys, note) => ({name, draw, keys, note});
  return {CAPS, scenes: [
    {id: 'hook', label: 'Hook', act: 'LOG', lines: 'L01', dur: 3.0, options: [
      O('Screen capture', hookA, [0.4, 1.6, 2.8], 'REC · DAY 001 (Amber dot blinks); your real screen recording of the terminal fills the frame (placeholder here — we never draw a fake screen).'),
      O('Build-log table', hookB, [0.6, 1.8, 2.8], 'LOG · DAY 001 card; our real measurement table prints in row by row (theirs vs ours).'),
      O('Pop: our mix + "?"', hookC, [0.6, 1.6, 2.8], 'Pop version: REC pill, an OUR MIX · X003 waveform card pops, an Amber "?" bubble; caption builds at the top.')]},
    {id: 'find', label: 'Finding: deep bass', act: 'LOG', lines: 'L02–L03', dur: 6.2, options: [
      O('Two meters + green +16 dB', findA, [1.4, 4.0, 5.8], 'Screen capture first; then THEIRS / OURS deep-bass meters, OURS shoots up to −13.4 dB, a green +16 dB pill (the one green).'),
      O('Manim bar chart', findB, [1.6, 4.0, 5.8], 'An axis "energy below 80 Hz", two bars draw, a green arrow labelled +16 dB.'),
      O('Pop: VS + sticker', findC, [1.6, 3.6, 5.8], 'Pop version: OURS vs THEIRS pills, the stage flips light, a DEEP BASS card with both numbers, a big Amber "+16 dB" sticker with a burst.')]},
    {id: 'stereo', label: 'Finding: stereo', act: 'LOG', lines: 'L04', dur: 3.2, options: [
      O('Dot clouds', stereoA, [0.6, 1.8, 3.0], 'Two frames: THEIRS = a tight column of dots in the middle, OURS = dots spread left to right.'),
      O('Stereo wedges', stereoB, [0.8, 2.0, 3.0], 'Manim: two half-circle stereo fields; a narrow white wedge (theirs) vs a wide one (ours).'),
      O('Pop: L / R', stereoC, [0.8, 2.2, 3.0], 'Pop version: L and R speaker pills; THEIRS dot sits in the centre, OURS dots fly out to both sides.')]},
    {id: 'fix', label: 'Fix + loop', act: 'LOG', lines: 'L05–L06', dur: 6.2, options: [
      O('Checklist → DAY 002', fixA, [1.2, 3.6, 5.2], 'TOMORROW checklist: CUT THE BASS, PULL IT TO THE MIDDLE, MORE SMALL HITS tick one by one (last tick green); the counter flips DAY 001 → 002; dead stop on black.'),
      O('Build-log cards → DAY 002', fixB, [1.2, 3.6, 5.2], 'Three Deep Forest cards slide in with Amber pictograms; the counter flips; dead stop.'),
      O('Pop: tick pills → DAY 002', fixC, [1.4, 3.6, 5.2], 'Pop version on a light stage: three ✓ pills pop (the last one green); the DAY counter card flips; dead stop.')]},
  ]};
})();
