/* X005 UNDER THE HOOD "What happens in the 2 seconds after you press Enter" — storyboard options v001 (first Pop Explainer).
   3 drafts per scene, 1080x1920, pure functions of t, drawn with SGMM_POP (08_templates/styles/pop/sgmm_pop.js).
   One example runs through the whole video: the prompt "Why is the sky blue?" and the answer "The sky looks blue because…".
   Token splits, numbers and score bars are illustrative (tagged on screen). Needs the engine (SGMM) + SGMM_POP loaded first. */
window.X005_OPT = (() => {
  const P = SGMM_POP, {C, SG, MONO, TAU, seg, out3, lerp, rr} = P;
  const CAPS = {
    hook: [[0.0, 4.0, 'You press *Enter*…\nand the answer starts *typing back*.'], [4.0, 6.4, 'But here’s the\n*interesting part?*']],
    claim: [[0.0, 4.4, 'The model doesn’t look up\na finished answer… it *writes it*.'], [4.4, 7.0, 'One *small piece*\nat a time!']],
    tokens: [[0.0, 3.6, 'Look, first your message\nis cut into *tokens*.'], [3.6, 7.6, 'A token is about a word…\nor *part of one*.'], [7.6, 11.2, 'Then each token becomes\na *list of numbers*.']],
    attend: [[0.0, 4.4, 'Now *attention*: every word checks\nwhich words matter to it.'], [4.4, 7.6, 'Then it scores every\npossible *next word*.'], [7.6, 11.2, 'It picks one… adds it…\nand *guesses again*.']],
    name: [[0.0, 4.2, 'That’s why you see it *typing*…\npiece by piece.'], [4.2, 7.6, 'This is called…']],
    twist: [[0.0, 2.0, 'But there’s a *twist!*'], [2.0, 6.0, 'It picks the *likely* word…\nnot a checked fact.'], [6.0, 10.4, 'That’s why AI can sound *sure*…\nand still be *wrong*.']],
    end: [[0.0, 4.2, 'So AI doesn’t *find* your answer…\nit *writes* it!']],
  };
  let CH = true; const cap = (c, t, id, mode) => { if (CH) P.caption(c, t, CAPS[id], mode); };
  const PROMPT = 'Why is the sky blue?', ANSWER = 'The sky looks blue because sunlight scatters off the air, and blue light scatters the most.';
  const TOK = ['Why', ' is', ' the', ' sky', ' blue', '?'], NUMS = [[0.12, -0.8, 0.33], [-0.41, 0.07, 0.9], [0.66, 0.2, -0.15], [-0.05, 0.72, 0.48], [0.88, -0.3, 0.01], [-0.6, 0.15, -0.2]];
  const CAND = [['blue', 0.92], ['bright', 0.46], ['clear', 0.3], ['dark', 0.14]];
  const simple = (c, t, at = 0.3) => P.pill(c, t, at, 900, 470, 'SIMPLIFIED', {kind: 'fog', size: 22, rot: 0});
  const illus = (c, t, at, y = 1600) => P.label(c, t, at, 'illustrative example', {y});

  function words(c, t, a, x, y, w, text, o = {}) { // text streaming in word by word (9 words/s), wrapped inside w
    const n = Math.floor((t - a) * (o.wps || 9)); if (n <= 0) return 0; c.save(); c.font = o.font || `500 40px ${SG}`; c.fillStyle = o.col || C.void; c.textBaseline = 'top';
    let xx = x, yy = y; const ws = text.split(' ').slice(0, n), sp = c.measureText(' ').width;
    for (const w0 of ws) { const ww = c.measureText(w0).width; if (xx + ww > x + w) { xx = x; yy += o.lh || 54; } c.fillText(w0, xx, yy); xx += ww + sp; }
    if (o.cursor && Math.floor(t * 3) % 2) c.fillRect(xx, yy + 4, 4, 42); c.restore(); return ws.length;
  }
  function timer(c, t, a, b, x, y) { if (t < a) return; const v = Math.min(2, 2 * seg(a, b, t)); P.pill(c, t, a, x, y, `${v.toFixed(1)} s`, {kind: 'white', size: 34, rot: 0}); }
  const tokenRow = (c, list, y, gap = 16, o = {}) => { c.save(); c.font = `700 ${o.size || 40}px ${MONO}`; const ws = list.map((s) => Math.max(c.measureText(s.trim()).width + 40, 80)), tot = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1); c.restore(); let x = 540 - tot / 2; return ws.map((w) => { const cx = x + w / 2; x += w + gap; return [cx, y]; }); };
  function phone(c, x, y, w, h) { c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 50; c.fillStyle = '#121816'; rr(c, x - w / 2, y - h / 2, w, h, 70); c.fill(); c.shadowColor = 'transparent'; c.fillStyle = C.void; rr(c, x - w / 2 + 22, y - h / 2 + 22, w - 44, h - 44, 52); c.fill(); c.restore(); }
  function bubble(c, x, y, w, h, fill) { c.fillStyle = fill; rr(c, x, y, w, h, 34); c.fill(); }

  // ---------------- 1 HOOK (6.4 s, dark)
  let ep = null;
  function hookA(c, t) { // the approved EP000 hand + green Enter, with pops: timer, streaming answer card, "?"
    if (!ep) ep = SGMM.load({fps: 60, size: [1080, 1920], duration: 6.4, score: null, scenes: [{type: 'enter_in_dark', t: [0, 6.4]}], captions: []});
    ep.render(c, c.canvas.width, c.canvas.height, t, true); c.setTransform(c.canvas.width / 1080, 0, 0, c.canvas.height / 1920, 0, 0);
    timer(c, t, 1.0, 3.0, 540, 1540);
    P.card(c, t, 1.7, 540, 1180, 860, 360, (cc) => words(cc, t, 2.0, -390, -130, 780, ANSWER, {cursor: true}), {label: 'ANSWER'});
    P.qBubble(c, t, 4.5, 860, 930); cap(c, t, 'hook', 'dark');
  }
  function hookB(c, t) { // phone chat close-up: the prompt types, a small Enter pops, the answer streams in
    P.bg(c, t, 'dark'); c.save(); P.push(c, t, 0.05, 6.4); phone(c, 540, 1080, 700, 1120);
    const q = PROMPT.slice(0, Math.floor(seg(0.0, 0.8, t) * PROMPT.length)); c.font = `500 40px ${SG}`; const qw = c.measureText(PROMPT).width + 60;
    bubble(c, 840 - qw, 640, qw, 90, C.white); c.fillStyle = C.void; c.textBaseline = 'middle'; c.fillText(q, 870 - qw, 686);
    if (t > 0.6) { const pr = t > 0.85 && t < 1.05 ? 1 : 0; c.save(); P.withPop(c, t, 0.6, 540, 1530, (cc) => P.enterKey(cc, 0, 0, 0.6, pr, t > 0.85), {r0: 0}); c.restore(); }
    if (t > 1.3) { bubble(c, 230, 770, 620, 520, '#1C2723'); words(c, t, 1.4, 262, 800, 560, ANSWER, {col: C.white, cursor: true}); }
    c.restore(); timer(c, t, 0.9, 2.9, 540, 470); P.qBubble(c, t, 4.5, 880, 1300); cap(c, t, 'hook', 'dark');
  }
  function hookC(c, t) { // macro: a hand rises from below and presses one big green Enter; rings; the answer card slides up
    P.bg(c, t, 'dark'); const rise = out3(seg(0, 0.7, t)), pr = P.out3(seg(0.75, 0.85, t)) * (1 - seg(1.0, 1.2, t));
    P.enterKey(c, 540, 1040, 1.6, pr, t > 0.85); if (t > 0.85) for (let i = 0; i < 3; i++) { const q = seg(0.85 + i * 0.15, 1.6 + i * 0.15, t); if (q > 0 && q < 1) { c.save(); c.globalAlpha = 1 - q; c.strokeStyle = C.white; c.lineWidth = 6; rr(c, 540 - 290 - 160 * q, 1040 - 170 - 110 * q, 580 + 320 * q, 340 + 220 * q, 60); c.stroke(); c.restore(); } }
    P.hand(c, 640, lerp(1900, 1180, rise) + 30 * pr, 1.3);
    if (t > 1.6) { c.save(); c.translate(0, -620 * out3(seg(1.6, 2.1, t))); P.card(c, t, 1.6, 540, 1900, 860, 330, (cc) => words(cc, t, 2.0, -390, -120, 780, ANSWER, {cursor: true}), {label: 'ANSWER'}); c.restore(); }
    timer(c, t, 1.0, 3.0, 540, 1540); P.qBubble(c, t, 4.5, 870, 820); cap(c, t, 'hook', 'dark');
  }

  // ---------------- 2 CLAIM (7 s, light)
  const blocks = (c, t, a, x, y, n = 5, o = {}) => { for (let i = 0; i < n; i++) { const at = a + i * 0.4; if (t < at) continue; P.withPop(c, t, at, x + i * 128, y, (cc) => { cc.fillStyle = o.col || C.forest; rr(cc, -56, -30, 112, 60, 14); cc.fill(); }, {r0: 0}); } };
  function magnifier(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = C.void; c.lineWidth = 16; c.beginPath(); c.arc(-14, -14, 50, 0, TAU); c.stroke(); c.lineCap = 'round'; c.beginPath(); c.moveTo(24, 24); c.lineTo(70, 70); c.stroke(); c.restore(); }
  function pen(c, x, y, s = 1, rot = -0.6) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = C.forest; rr(c, -18, -110, 36, 170, 10); c.fill(); c.fillStyle = C.amber; c.beginPath(); c.moveTo(-18, 60); c.lineTo(18, 60); c.lineTo(0, 100); c.closePath(); c.fill(); c.restore(); }
  function claimA(c, t) { // SEARCH card -> Amber X; a pen writes a blank card piece by piece
    P.bg(c, t, 'light'); c.save(); P.push(c, t, 0.03, 7);
    P.card(c, t, 0.9, 540, 860, 600, 300, (cc) => { magnifier(cc, -170, 0, 1); cc.font = `700 56px ${SG}`; cc.fillStyle = C.void; cc.textBaseline = 'middle'; cc.fillText('LOOK UP', -80, 6); });
    P.xMark(c, t, 2.4, 540, 860, 150); P.pill(c, t, 2.6, 540, 1060, 'FINISHED ANSWER?', {kind: 'dark', size: 26});
    if (t > 3.6) { c.save(); c.globalAlpha = 1 - seg(3.6, 3.9, t) * 0.75; c.restore(); }
    P.card(c, t, 3.7, 540, 1300, 760, 220, (cc) => blocks(cc, t, 4.6, -260, 0, 5), {label: 'ANSWER'}); P.withPop(c, t, 3.8, 900, 1170, (cc) => pen(cc, 0, 0, 1)); P.pill(c, t, 4.2, 300, 1450, 'WRITES IT', {kind: 'amber'});
    c.restore(); cap(c, t, 'claim', 'light');
  }
  function claimB(c, t) { // split: LOOK UP (book) vs WRITE (pen) with ≠; the left dims, the right fills
    P.bg(c, t, 'light'); const dim = seg(3.4, 3.8, t);
    c.save(); c.globalAlpha = 1 - 0.6 * dim; P.card(c, t, 0.8, 290, 1000, 400, 520, (cc) => { cc.fillStyle = C.forest; [-90, -30, 30, 90].forEach((x, i) => { rr(cc, x - 24, -40 - (i % 2) * 30, 48, 200 + (i % 2) * 30, 8); cc.fill(); }); cc.font = `700 44px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.fillText('LOOK UP', 0, -150); }); c.restore();
    P.withPop(c, t, 2.0, 540, 1000, (cc) => { cc.font = `700 140px ${SG}`; cc.fillStyle = C.amber; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('≠', 0, 0); });
    P.card(c, t, 1.4, 790, 1000, 400, 520, (cc) => { pen(cc, 120, -150, 0.8); cc.font = `700 44px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.fillText('WRITE', -40, -150); for (let i = 0; i < 5; i++) { if (t < 4.6 + i * 0.4) continue; P.withPop(cc, t, 4.6 + i * 0.4, 0, -60 + i * 56, (q) => { q.fillStyle = C.forest; rr(q, -150 + (i % 2) * 20, -18, 300 - (i % 3) * 50, 36, 10); q.fill(); }, {r0: 0}); } });
    P.xMark(c, t, 3.4, 290, 1000, 110); cap(c, t, 'claim', 'light');
  }
  function claimC(c, t) { // a ready-made answer box drops in, gets X'd and falls away; then the line builds chip by chip
    P.bg(c, t, 'light'); const fall = seg(3.2, 3.8, t);
    if (fall < 1) { c.save(); c.translate(0, 900 * fall * fall); c.rotate(0.3 * fall); P.card(c, t, 0.8, 540, 900, 720, 380, (cc) => { cc.fillStyle = 'rgba(124,138,132,.35)'; for (let i = 0; i < 4; i++) { rr(cc, -300, -90 + i * 60, 600 - i * 90, 30, 8); cc.fill(); } }, {label: 'READY-MADE ANSWER'}); P.xMark(c, t, 2.5, 540, 900, 140); c.restore(); }
    const parts = ['The', ' sky', ' looks', ' blue…']; const pos = tokenRow(c, parts, 1150);
    parts.forEach((s, i) => { const at = 4.6 + i * 0.45; if (t >= at) P.withPop(c, t, at, pos[i][0], pos[i][1], (cc) => P.chip(cc, 0, 0, s.trim()), {r0: 0}); });
    P.pill(c, t, 4.4, 540, 1320, 'ONE PIECE AT A TIME', {kind: 'amber', size: 28}); cap(c, t, 'claim', 'light');
  }

  // ---------------- 3 TOKENS (11.2 s, light -> dark flip at 7.6)
  const flipBg = (c, t, at) => { if (t < at) { P.bg(c, t, 'light'); return 'light'; } P.bg(c, t, 'dark'); const w = seg(at - 0.25, at, t); if (w < 1) { c.save(); c.beginPath(); c.rect(1080 * w, 0, 1080, 1920); c.clip(); P.bg(c, t, 'light'); c.restore(); } return 'dark'; };
  function numCard(c, x, y, i, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = C.white; rr(c, -62, -100, 124, 200, 16); c.fill(); c.font = `700 26px ${MONO}`; c.fillStyle = C.void; c.textAlign = 'center'; NUMS[i].forEach((v, k) => c.fillText((v >= 0 ? ' ' : '') + v.toFixed(2), 0, -50 + k * 48)); c.fillText('…', 0, 92); c.restore(); }
  function splitChip(c, t, at, x, y) { // "unbelievable" -> "un" | "believable"
    if (t < at) return; const q = out3(seg(at + 0.9, at + 1.3, t));
    if (q <= 0) P.withPop(c, t, at, x, y, (cc) => P.chip(cc, 0, 0, 'unbelievable', {fill: C.void, fg: C.white}), {r0: 0});
    else { P.chip(c, x - 150 - 40 * q, y, 'un', {fill: C.void, fg: C.white}); P.chip(c, x + 60 + 40 * q, y, 'believable', {fill: C.void, fg: C.white}); P.pill(c, t, at + 1.4, x, y + 120, '1 WORD = 2 TOKENS', {kind: 'amber', size: 24}); }
  }
  function tokensA(c, t) { // sentence card -> snip lines -> chips spread; a word splits; bg flips; chips turn into number cards
    const mode = flipBg(c, t, 7.6); simple(c, t);
    const pos = tokenRow(c, TOK, 900, 18), spread = out3(seg(1.6, 2.1, t));
    if (t < 1.6) P.card(c, t, 0.3, 540, 900, 700, 140, (cc) => { cc.font = `700 46px ${MONO}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(PROMPT, 0, 2); for (let i = 1; i < 6; i++) { const q = seg(0.9 + i * 0.1, 1.05 + i * 0.1, t); if (q > 0) { cc.strokeStyle = C.amber; cc.lineWidth = 5; cc.beginPath(); cc.moveTo(pos[i][0] - 540 - 9, -60); cc.lineTo(pos[i][0] - 540 - 9, -60 + 120 * q); cc.stroke(); } } });
    else if (t < 7.6) { TOK.forEach((s, i) => P.chip(c, lerp(540 + (pos[i][0] - 540) * 0.8, pos[i][0], spread), 900 - 20 * Math.sin(spread * Math.PI), s.trim())); P.pill(c, t, 2.2, 540, 1060, 'TOKENS', {kind: 'dark'}); splitChip(c, t, 4.4, 540, 1300); illus(c, t, 4.6); }
    else TOK.forEach((s, i) => { const f = seg(7.9 + i * 0.12, 8.2 + i * 0.12, t), sx = Math.abs(Math.cos(f * Math.PI)); c.save(); c.translate(pos[i][0], 960); c.scale(Math.max(sx, 0.02), 1); if (f < 0.5) P.chip(c, 0, 0, s.trim()); else numCard(c, 0, 0, i); c.restore(); });
    if (t > 7.6) { P.pill(c, t, 9.2, 540, 1160, 'LISTS OF NUMBERS', {kind: 'amber'}); illus(c, t, 9.2); }
    cap(c, t, 'tokens', mode);
  }
  function tokensB(c, t) { // conveyor: the sentence slides through a cutter; chips exit; then each drops into a barcode of numbers
    const mode = flipBg(c, t, 7.6); simple(c, t); c.save(); c.strokeStyle = C.fog; c.lineWidth = 6; c.beginPath(); c.moveTo(60, 1010); c.lineTo(1020, 1010); c.stroke(); c.restore();
    c.save(); c.fillStyle = C.forest; rr(c, 470, 760, 140, 230, 20); c.fill(); c.fillStyle = C.amber; c.beginPath(); c.moveTo(500, 990); c.lineTo(540, 930); c.lineTo(580, 990); c.closePath(); c.fill(); c.font = `700 24px ${MONO}`; c.fillStyle = C.white; c.textAlign = 'center'; c.fillText('CUT', 540, 820); c.restore();
    const slide = seg(0.6, 2.6, t); c.save(); c.beginPath(); c.rect(0, 0, 470, 1920); c.clip(); c.font = `700 44px ${MONO}`; c.fillStyle = mode === 'light' ? C.void : C.white; c.textBaseline = 'middle'; c.fillText(PROMPT, 60 + 420 * slide, 960); c.restore();
    if (t < 7.6) { const pos = tokenRow(c, TOK, 1180, 14); TOK.forEach((s, i) => { const at = 1.2 + i * 0.28; if (t >= at) P.withPop(c, t, at, pos[i][0], pos[i][1], (cc) => P.chip(cc, 0, 0, s.trim()), {r0: 0}); }); P.pill(c, t, 2.9, 540, 1330, 'TOKENS', {kind: 'dark'}); splitChip(c, t, 4.4, 540, 600); }
    else { const pos = tokenRow(c, TOK, 960, 14); TOK.forEach((s, i) => { const at = 7.9 + i * 0.15; if (t < at) return; P.withPop(c, t, at, pos[i][0], 960, (cc) => { NUMS[i].concat([NUMS[i][0] * 0.5, -NUMS[i][1] * 0.7]).forEach((v, k) => { cc.fillStyle = v >= 0 ? C.white : C.amber; rr(cc, -40 + k * 17, v >= 0 ? -120 * v : 0, 12, Math.abs(120 * v) + 4, 4); cc.fill(); }); cc.font = `700 26px ${MONO}`; cc.fillStyle = C.fog; cc.textAlign = 'center'; cc.fillText(s.trim(), 0, 170); }, {r0: 0}); }); P.pill(c, t, 9.2, 540, 1260, 'LISTS OF NUMBERS', {kind: 'amber'}); }
    illus(c, t, 1.4); cap(c, t, 'tokens', mode);
  }
  function tokensC(c, t) { // Manim-like: the sentence writes on, Amber cut lines draw, chips rise; then they become [ … ] column vectors
    const mode = flipBg(c, t, 7.6); simple(c, t); const pos = tokenRow(c, TOK, 960, 18);
    if (t < 7.6) { const n = Math.floor(seg(0.2, 1.0, t) * PROMPT.length), up = out3(seg(2.0, 2.5, t));
      if (up <= 0) { c.save(); c.font = `700 50px ${MONO}`; c.fillStyle = C.void; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(PROMPT.slice(0, n).padEnd(PROMPT.length, ' '), 540, 960); c.restore(); for (let i = 1; i < 6; i++) { const q = seg(1.1 + i * 0.12, 1.3 + i * 0.12, t); if (q > 0) { c.strokeStyle = C.amber; c.lineWidth = 5; c.beginPath(); c.moveTo(pos[i][0] - 9, 900); c.lineTo(pos[i][0] - 9, 900 + 120 * q); c.stroke(); } } }
      else TOK.forEach((s, i) => P.chip(c, pos[i][0], 960 - 40 * up * (i % 2 ? 1 : -1) * 0.3, s.trim()));
      P.pill(c, t, 2.6, 540, 1130, 'TOKENS', {kind: 'dark'}); splitChip(c, t, 4.4, 540, 1350); illus(c, t, 4.6); }
    else TOK.forEach((s, i) => { const at = 7.9 + i * 0.15; if (t < at) return; P.withPop(c, t, at, pos[i][0], 960, (cc) => { cc.strokeStyle = C.white; cc.lineWidth = 4; cc.beginPath(); cc.moveTo(-30, -110); cc.lineTo(-44, -110); cc.lineTo(-44, 110); cc.lineTo(-30, 110); cc.moveTo(30, -110); cc.lineTo(44, -110); cc.lineTo(44, 110); cc.lineTo(30, 110); cc.stroke(); cc.font = `700 22px ${MONO}`; cc.fillStyle = C.white; cc.textAlign = 'center'; NUMS[i].forEach((v, k) => cc.fillText(v.toFixed(1), 0, -60 + k * 50)); cc.fillText('⋮', 0, 94); cc.fillStyle = C.fog; cc.fillText(s.trim(), 0, 160); }, {r0: 0}); });
    if (t > 7.6) P.pill(c, t, 9.2, 540, 1260, 'LISTS OF NUMBERS', {kind: 'amber'});
    cap(c, t, 'tokens', mode);
  }

  // ---------------- 4 ATTENTION + NEXT WORD (11.2 s, dark)
  const SO_FAR = ['The', 'sky', 'looks'];
  function candBars(c, t, a, x, y, o = {}) { // 4 candidate next words, scored; the top one is the frame's green
    CAND.forEach(([w, v], i) => { const at = a + i * 0.25; if (t < at) return; const g = out3(seg(at, at + 0.4, t)), yy = y + i * 110;
      c.save(); c.font = `700 40px ${MONO}`; c.fillStyle = C.white; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(w, x - 24, yy); c.fillStyle = i === 0 && !o.noGreen ? C.green : (i === 0 ? C.white : C.fog); rr(c, x, yy - 30, 520 * v * g, 60, 12); c.fill(); c.restore(); });
    P.label(c, t, a + 0.5, 'scores are illustrative', {y: y + 470});
  }
  function joinChip(c, t, at, from, to, text) { const q = out3(seg(at, at + 0.45, t)); if (q <= 0) return false; const x = lerp(from[0], to[0], q), y = lerp(from[1], to[1], q) - 160 * Math.sin(q * Math.PI); P.chip(c, x, y, text, {fill: q >= 1 ? C.white : C.green}); return q >= 1; }
  function attendA(c, t) { // chip row; dotted arcs from "looks" to the words it weighs; scored bars; "blue" flies up and joins; again
    P.bg(c, t, 'dark'); simple(c, t); const row = SO_FAR.concat(t > 8.6 ? ['blue'] : []), pos = tokenRow(c, ['The', 'sky', 'looks', 'blue'], 720, 22);
    SO_FAR.forEach((s, i) => P.chip(c, pos[i][0], 720, s));
    if (t < 4.4) { [[0, 0.3], [1, 1]].forEach(([j, w], k) => { const a = 0.9 + k * 0.5, x0 = pos[2][0], x1 = pos[j][0]; const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([lerp(x0, x1, u), 650 - 170 * Math.sin(u * Math.PI) * (0.6 + 0.4 * w)]); } P.dotted(c, t, a, 0.5, pts, w > 0.5 ? C.amber : C.fog, {w: 4 + 8 * w}); }); P.pill(c, t, 1.2, 540, 880, 'ATTENTION', {kind: 'amber'}); P.pill(c, t, 2.4, pos[1][0], 480, 'MATTERS MOST', {kind: 'white', size: 22}); }
    else if (t < 8.4) candBars(c, t, 4.8, 400, 980);
    else { candBars(c, 99, 0, 400, 980, {noGreen: true}); if (joinChip(c, t, 8.0, [400 + 260, 980], pos[3], 'blue')) { P.chip(c, pos[3][0], 720, 'blue'); P.pill(c, t, 8.9, 540, 560, 'GUESS AGAIN ↻', {kind: 'amber'}); } }
    cap(c, t, 'attend', 'dark');
  }
  function attendB(c, t) { // chips on a circle, a web of lines (thick = matters); then a slot reel stops on "blue"
    P.bg(c, t, 'dark'); simple(c, t); const pts = SO_FAR.map((s, i) => [540 + 260 * Math.cos(-Math.PI / 2 + i * TAU / 3), 1000 + 260 * Math.sin(-Math.PI / 2 + i * TAU / 3)]);
    if (t < 4.4) { [[0, 1, 0.3], [1, 2, 1], [0, 2, 0.4]].forEach(([a, b, w], k) => { P.dotted(c, t, 0.8 + k * 0.4, 0.4, [pts[a], pts[b]], w > 0.5 ? C.amber : C.fog, {w: 4 + 10 * w, head: false}); }); SO_FAR.forEach((s, i) => P.withPop(c, t, 0.2 + i * 0.15, pts[i][0], pts[i][1], (cc) => P.chip(cc, 0, 0, s), {r0: 0})); P.pill(c, t, 2.2, 540, 1000, 'ATTENTION', {kind: 'amber'}); }
    else { const words = ['dark', 'clear', 'bright', 'blue'], spin = seg(4.8, 7.0, t), k = Math.floor(out3(spin) * 15); c.save(); c.fillStyle = C.white; rr(c, 240, 860, 600, 200, 30); c.fill(); c.font = `700 80px ${MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; const w = spin >= 1 ? 'blue' : words[k % 4]; c.fillStyle = spin >= 1 ? C.void : C.fog; c.fillText(w, 540, 965); c.restore();
      if (spin >= 1) { P.pill(c, t, 7.0, 540, 760, 'NEXT WORD', {kind: 'green', size: 30}); const pos = tokenRow(c, ['The', 'sky', 'looks', 'blue'], 1300, 18); ['The', 'sky', 'looks'].forEach((s, i) => P.chip(c, pos[i][0], 1300, s)); if (t > 8.0) P.withPop(c, t, 8.0, pos[3][0], 1300, (cc) => P.chip(cc, 0, 0, 'blue'), {r0: 0}); [0, 1, 2].forEach((i) => P.pill(c, t, 8.6 + i * 0.6, 300 + i * 240, 1470, '+1 TOKEN', {kind: 'amber', size: 24})); } }
    cap(c, t, 'attend', 'dark');
  }
  function attendC(c, t) { // attention grid (who looks at whom, Amber = strong); candidate list; the chain grows word by word
    P.bg(c, t, 'dark'); simple(c, t);
    if (t < 4.4) { const W = [[1, 0, 0], [0.3, 1, 0], [0.2, 0.9, 0.5]]; SO_FAR.forEach((s, i) => { P.chip(c, 300, 820 + i * 150, s, {size: 30}); P.chip(c, 460 + i * 150, 680, s, {size: 30}); });
      W.forEach((r, i) => r.forEach((v, j) => { const at = 0.8 + (i * 3 + j) * 0.12; if (t < at) return; P.withPop(c, t, at, 460 + j * 150, 820 + i * 150, (cc) => { cc.fillStyle = v > 0.6 ? C.amber : `rgba(124,138,132,${0.15 + v * 0.6})`; rr(cc, -60, -60, 120, 120, 16); cc.fill(); }, {r0: 0}); })); P.pill(c, t, 2.0, 540, 1350, 'ATTENTION', {kind: 'amber'}); }
    else if (t < 7.6) candBars(c, t, 4.8, 400, 900);
    else { const chain = ['The', 'sky', 'looks', 'blue', 'because']; const pos = tokenRow(c, chain, 960, 14, {size: 34}); chain.forEach((s, i) => { const at = i < 3 ? 0 : 8.0 + (i - 3) * 1.1; if (t < at) return; P.withPop(c, t, at, pos[i][0], 960, (cc) => P.chip(cc, 0, 0, s, {size: 34, fill: i === 3 && t < at + 0.8 ? C.green : C.white}), {r0: 0}); }); P.pill(c, t, 8.4, 540, 1130, 'AGAIN ↻', {kind: 'amber'}); P.pill(c, t, 9.6, 540, 1130, 'AND AGAIN ↻', {kind: 'amber'}); }
    cap(c, t, 'attend', 'dark');
  }

  // ---------------- 5 STREAMING + NAME IT (7.6 s, light)
  function nameA(c, t) { // chips fly along a dotted path into a chat bubble; then "NEXT-TOKEN PREDICTION" types on, Amber underline
    P.bg(c, t, 'light');
    if (t < 4.2) { const path = [[160, 1300], [400, 1050], [700, 1000], [880, 900]]; P.dotted(c, t, 0.2, 0.6, path, C.fog, {head: false}); c.fillStyle = C.void; rr(c, 620, 640, 400, 240, 34); c.fill();
      ['The', 'sky', 'looks', 'blue'].forEach((s, i) => { const q = seg(0.8 + i * 0.6, 1.3 + i * 0.6, t); if (q <= 0) return; if (q < 1) { const k = Math.min(2, Math.floor(q * 3)), u = q * 3 - k; P.chip(c, lerp(path[k][0], path[k + 1][0], u), lerp(path[k][1], path[k + 1][1], u), s, {size: 30}); } c.save(); c.font = `500 36px ${SG}`; c.fillStyle = C.white; if (q >= 1) c.fillText(s, 650 + [0, 70, 150, 255][i], 700 + 50); c.restore(); });
      P.pill(c, t, 1.5, 380, 1450, 'SENT AS IT’S MADE', {kind: 'amber', size: 26}); }
    else { P.title(c, t, 5.0, ['NEXT-TOKEN', 'PREDICTION'], {y: 900}); P.pill(c, t, 6.2, 540, 1200, '= HOW IT WRITES', {kind: 'dark'}); }
    cap(c, t, 'name', 'light');
  }
  function nameB(c, t) { // chat bubble with a blinking cursor; words land with small +1 pills; the title zooms in
    P.bg(c, t, 'light');
    if (t < 4.2) { c.fillStyle = C.void; rr(c, 140, 760, 800, 420, 40); c.fill(); const n = words(c, t, 0.4, 190, 800, 700, ANSWER, {col: C.white, wps: 2.6, cursor: true}); for (let i = 0; i < Math.min(n, 6); i++) P.pill(c, t, 0.4 + i / 2.6, 230 + i * 120, 1260, '+1', {kind: 'amber', size: 24}); }
    else { const z = out3(seg(4.6, 5.0, t)); c.save(); c.translate(540, 950); c.scale(0.6 + 0.4 * z, 0.6 + 0.4 * z); c.translate(-540, -950); P.title(c, t, 4.6, ['NEXT-TOKEN', 'PREDICTION'], {y: 900}); c.restore(); }
    cap(c, t, 'name', 'light');
  }
  function nameC(c, t) { // a MODEL box pipes tokens down to a phone; then "?" sits between two chips before the title reveals
    P.bg(c, t, 'light');
    if (t < 4.2) { c.fillStyle = C.forest; rr(c, 360, 560, 360, 180, 26); c.fill(); c.font = `700 44px ${MONO}`; c.fillStyle = C.white; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MODEL', 540, 652); c.textAlign = 'left'; phone(c, 540, 1300, 420, 560);
      c.strokeStyle = C.fog; c.lineWidth = 8; c.setLineDash([4, 18]); c.beginPath(); c.moveTo(540, 740); c.lineTo(540, 1030); c.stroke(); c.setLineDash([]);
      ['The', 'sky', 'looks', 'blue'].forEach((s, i) => { const q = seg(0.6 + i * 0.7, 1.2 + i * 0.7, t); if (q > 0 && q < 1) P.chip(c, 540, lerp(760, 1040, q), s, {size: 28}); if (q >= 1) { c.save(); c.font = `500 34px ${SG}`; c.fillStyle = C.white; c.fillText(s, 380 + [0, 70, 140, 245][i], 1130); c.restore(); } }); }
    else { if (t < 5.0) P.qBubble(c, t, 4.3, 540, 950, 90); else { P.title(c, t, 5.0, ['NEXT-TOKEN', 'PREDICTION'], {y: 900}); P.pill(c, t, 6.4, 540, 1200, 'SIMPLIFIED', {kind: 'fog', size: 24}); } }
    cap(c, t, 'name', 'light');
  }

  // ---------------- 6 TWIST (10.4 s, dark)
  const src5 = (c, t, at) => P.label(c, t, at, 'Kalai et al. (OpenAI) · Why Language Models Hallucinate · 2025', {y: 1600, col: C.fog});
  function meter(c, t, a, x, y, w, lab) { const g = out3(seg(a, a + 0.9, t)); if (t < a) return; c.save(); c.font = `700 26px ${MONO}`; c.fillStyle = C.fog; c.fillText(lab, x, y - 30); c.fillStyle = 'rgba(124,138,132,.3)'; rr(c, x, y, w, 50, 25); c.fill(); c.fillStyle = C.white; rr(c, x, y, w * 0.95 * g, 50, 25); c.fill(); c.restore(); }
  function twistA(c, t) { // TWIST! sticker; LIKELY (solid card) vs CHECKED FACT (dotted outline); SURE meter fills; WRONG stamp
    P.bg(c, t, 'dark'); if (t < 2.0) P.sticker(c, t, 0.4, 540, 960, 'TWIST!');
    else { P.card(c, t, 2.4, 330, 860, 380, 220, (cc) => { cc.font = `700 52px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('LIKELY', 0, 4); });
      if (t > 3.6) { c.save(); c.globalAlpha = seg(3.6, 3.9, t); c.strokeStyle = C.fog; c.lineWidth = 5; c.setLineDash([14, 12]); rr(c, 560, 750, 380, 220, 28); c.stroke(); c.setLineDash([]); c.font = `700 40px ${SG}`; c.fillStyle = C.fog; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CHECKED FACT', 750, 864); c.restore(); }
      P.pill(c, t, 3.0, 330, 1010, 'PICKED', {kind: 'amber', size: 24}); meter(c, t, 6.6, 190, 1240, 700, 'SOUNDS SURE'); P.stamp(c, t, 8.8, 540, 1440, 'CAN BE WRONG'); src5(c, t, 2.4); }
    cap(c, t, 'twist', 'dark');
  }
  function twistB(c, t) { // TWIST! sticker; a confident answer bubble with "SURE" pill; the balance tips to LIKELY; stamp
    P.bg(c, t, 'dark'); if (t < 2.0) P.sticker(c, t, 0.4, 540, 960, 'TWIST!', {size: 72});
    else { const tip = out3(seg(3.2, 3.8, t)) * 0.18; c.save(); c.translate(540, 1000); c.strokeStyle = C.white; c.lineWidth = 10; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 260); c.stroke(); c.rotate(tip); c.beginPath(); c.moveTo(-320, 0); c.lineTo(320, 0); c.stroke();
        [[-320, 'LIKELY', 1], [320, 'FACT', 0]].forEach(([x, w, solid]) => { c.save(); c.translate(x, 0); c.rotate(-tip); c.fillStyle = solid ? C.white : 'rgba(124,138,132,.35)'; rr(c, -130, 30, 260, 110, 20); c.fill(); c.font = `700 40px ${MONO}`; c.fillStyle = solid ? C.void : C.white; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(w, 0, 88); c.restore(); }); c.restore();
      if (t > 6.0) { P.card(c, t, 6.2, 540, 640, 760, 180, (cc) => { cc.font = `600 40px ${SG}`; cc.fillStyle = C.void; cc.textBaseline = 'middle'; cc.fillText('“The answer is definitely…”', -340, 4); }); P.pill(c, t, 7.0, 820, 540, '100% SURE', {kind: 'white', size: 24}); P.stamp(c, t, 8.8, 540, 1420, 'CAN BE WRONG'); }
      src5(c, t, 2.4); }
    cap(c, t, 'twist', 'dark');
  }
  function twistC(c, t) { // TWIST!; the bars pick "likely" while a fact book sits unopened; a sure-gauge needle maxes; Amber X over a tick
    P.bg(c, t, 'dark'); if (t < 2.0) P.sticker(c, t, 0.4, 540, 960, 'TWIST!');
    else { candBars(c, t, 2.4, 420, 760, {noGreen: true}); P.pill(c, t, 3.6, 800, 760, 'LIKELY ✓', {kind: 'white', size: 24});
      if (t > 6.0) { const cx = 540, cy = 1420, R = 170, v = out3(seg(6.4, 7.6, t)); c.save(); c.strokeStyle = C.fog; c.lineWidth = 12; c.beginPath(); c.arc(cx, cy, R, Math.PI, TAU); c.stroke(); const a = Math.PI + Math.PI * 0.95 * v; c.strokeStyle = C.white; c.lineWidth = 10; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R * 0.9, cy + Math.sin(a) * R * 0.9); c.stroke(); c.font = `700 26px ${MONO}`; c.fillStyle = C.fog; c.textAlign = 'center'; c.fillText('SURE', cx, cy + 50); c.restore(); P.xMark(c, t, 8.8, 540, 1360, 110); }
      src5(c, t, 2.4); }
    cap(c, t, 'twist', 'dark');
  }

  // ---------------- 7 RECAP + SIGN-OFF (8 s)
  const STEPS = ['ENTER', 'TOKENS', 'NUMBERS', 'ATTENTION', 'NEXT WORD'];
  const drift = (c, t) => { ['sky', 'blue', 'the'].forEach((s, i) => P.chip(c, 180 + i * 360, 1500 + 40 * Math.sin(t + i), s)); P.enterKey(c, 820, 420 + 20 * Math.sin(t * 0.8), 0.7); };
  function endA(c, t) { // recap chain pops in a column, then the sign-off card
    if (t >= 4.4) return P.endCard(c, t, 4.4, {drift});
    P.bg(c, t, 'light'); STEPS.forEach((s, i) => { P.pill(c, t, 0.4 + i * 0.5, 540, 620 + i * 190, s, {kind: i === 4 ? 'dark' : 'white', size: 34, rot: 0}); if (i) P.dotted(c, t, 0.25 + i * 0.5, 0.2, [[540, 620 + (i - 1) * 190 + 40], [540, 620 + i * 190 - 40]], C.fog); });
    cap(c, t, 'end', 'light');
  }
  function endB(c, t) { // FIND card gets X'd, WRITE card fills, then the sign-off card
    if (t >= 4.4) return P.endCard(c, t, 4.4, {drift});
    P.bg(c, t, 'light'); P.card(c, t, 0.6, 540, 760, 560, 220, (cc) => { magnifier(cc, -150, 0, 0.8); cc.font = `700 56px ${SG}`; cc.fillStyle = C.void; cc.textBaseline = 'middle'; cc.fillText('FIND', -60, 4); }); P.xMark(c, t, 1.4, 540, 760, 110);
    P.card(c, t, 2.4, 540, 1180, 560, 260, (cc) => { pen(cc, 170, -40, 0.7); cc.font = `700 56px ${SG}`; cc.fillStyle = C.void; cc.textBaseline = 'middle'; cc.fillText('WRITE', -200, -50); blocks(cc, t, 2.9, -200, 60, 4); });
    cap(c, t, 'end', 'light');
  }
  function endC(c, t) { // the answer card breaks back into chips that fly out, then the sign-off card with them drifting behind
    if (t >= 4.4) return P.endCard(c, t, 4.4, {drift});
    P.bg(c, t, 'dark'); const br = seg(2.0, 3.4, t);
    if (br <= 0) P.card(c, t, 0.2, 540, 1000, 860, 300, (cc) => words(cc, 99, 0, -390, -110, 780, ANSWER), {label: 'ANSWER'});
    else ANSWER.split(' ').slice(0, 12).forEach((w, i) => { const a = i * 0.52, d = out3(br) * (300 + 90 * (i % 4)); P.chip(c, 540 + Math.cos(a) * d * 1.4, 1000 + Math.sin(a) * d, w, {size: 28}); });
    cap(c, t, 'end', 'dark');
  }

  /* Samrat's picks (3 Nov 2026): all A — a pop + its sound every 0.5–1 s */
  const chrome = (v) => { CH = v; }, pops = (P, c, xs, f = 420) => xs.forEach((x, i) => P('pop', c(x), {f: f + (i % 4) * 70}));
  const SND = {
    hook: (k, P, c) => { P('key', c(1.15), {g: 1.6}); P('impact', c(1.15), {f: 70, g: 0.8}); pops(P, c, [1.0, 1.7, 4.5]); for (let x = 1.25; x < 3.0; x += 0.25) P('tick', c(x), {f: 3000, g: 0.35}); for (let x = 2.0; x < 4.2; x += 0.12) P('key', c(x), {g: 0.22}); P('whoosh', c(1.6), {dur: 0.4, g: 0.3}); },
    claim: (k, P, c) => { pops(P, c, [0.9, 2.6, 3.7, 3.8, 4.2]); P('thud', c(2.5), {f: 120, g: 0.8}); for (let i = 0; i < 5; i++) P('tick', c(4.6 + i * 0.4), {f: 2400 + i * 150, g: 0.7}); },
    tokens: (k, P, c) => { pops(P, c, [0.3, 2.2, 4.4, 5.8, 9.2]); for (let i = 0; i < 6; i++) P('tick', c(1.0 + i * 0.1), {f: 3200, g: 0.6}); P('whoosh', c(1.6), {dur: 0.45, g: 0.4}); P('tear', c(5.3), {g: 0.5}); P('whoosh', c(7.35), {dur: 0.35, g: 0.45, top: 3000}); for (let i = 0; i < 6; i++) P('click', c(7.95 + i * 0.12), {f: 2200, g: 0.6}); },
    attend: (k, P, c) => { P('whoosh', c(0.9), {dur: 0.5, g: 0.3}); P('whoosh', c(1.4), {dur: 0.5, g: 0.3}); pops(P, c, [1.2, 2.4, 8.45, 8.9]); for (let i = 0; i < 4; i++) P('slide', c(4.8 + i * 0.25), {dur: 0.3, g: 0.55}); P('ding', c(5.3), {f: 1568, g: 0.15}); P('whoosh', c(8.0), {dur: 0.45, g: 0.4}); },
    name: (k, P, c) => { P('whoosh', c(0.2), {dur: 0.5, g: 0.3}); for (let i = 0; i < 4; i++) P('pop', c(1.3 + i * 0.6), {f: 500 + i * 60}); pops(P, c, [1.5, 6.2]); for (let i = 0; i < 20; i++) P('key', c(5.0 + i * 0.036), {g: 0.3}); P('ding', c(5.8), {f: 1318.5, g: 0.25}); P('slide', c(5.75), {dur: 0.3, g: 0.4}); },
    twist: (k, P, c) => { P('riser', c(0.0), {dur: 0.4, g: 0.8}); P('impact', c(0.4), {f: 90, g: 0.9}); P('pop', c(0.42), {f: 700}); pops(P, c, [2.4, 3.0]); P('stroke', c(3.6), {material: 'pen', dur: 0.4, g: 0.4}); P('slide', c(6.6), {dur: 0.9, g: 0.5}); P('thud', c(8.8), {f: 100, g: 1}); P('impact', c(8.82), {f: 80, g: 0.6}); },
    end: (k, P, c) => { for (let i = 0; i < 5; i++) P('pop', c(0.4 + i * 0.5), {f: 380 + i * 80}); P('whoosh', c(4.4), {dur: 0.4, g: 0.4}); P('impact', c(4.9), {f: 90, g: 0.7}); P('ding', c(4.95), {f: 1975, g: 0.25}); pops(P, c, [5.3, 5.42, 5.54, 5.66], 600); },
  };
  /* v004 (Samrat's notes): real components on the beats the drafts held still; product names as tags (no logo graphics without permission) */
  const {W, item, pillI} = P, O2 = (it, out) => Object.assign(it, {out});
  const EX = {
    hook: ({L}) => [pillI(W(L, 0, 6), 300, 1450, 'ChatGPT', {kind: 'white', size: 30}), pillI(W(L, 0, 6) + 0.3, 540, 1450, 'Claude', {kind: 'white', size: 30}), pillI(W(L, 0, 6) + 0.6, 780, 1450, 'Gemini', {kind: 'white', size: 30})],
    attend: ({L}) => [O2(pillI(W(L, 0, 7), 300, 940, 'sky = strong', {kind: 'amber', size: 28}), L[1][0]), O2(pillI(W(L, 0, 9), 700, 940, 'The = weak', {kind: 'fog', size: 28}), L[1][0]),
      O2(pillI(W(L, 1, 5), 880, 920, 'TOP PICK', {kind: 'white', size: 26}), L[2][0] + 0.3), O2(item(W(L, 1, 6) + 0.4, (c, t) => P.qBubble(c, t, W(L, 1, 6) + 0.4, 900, 1330, 44), ['pop', {f: 640}]), L[2][0] + 0.3),
      ...[0, 1, 2].map((i) => pillI(W(L, 2, 5) + i * 0.5, 300 + i * 240, 1420, '+1 TOKEN', {kind: 'amber', size: 26}))],
    twist: ({L}) => [item(W(L, 1, 5), (c, t) => P.withPop(c, t, W(L, 1, 5), 545, 860, (cc) => { cc.font = `700 110px ${SG}`; cc.fillStyle = C.amber; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('≠', 0, 0); }), ['thud', {f: 140, g: 0.8}]),
      pillI(W(L, 1, 8), 750, 1010, 'NO FACT-CHECK', {kind: 'amber', size: 24}), item(W(L, 2, 2), (c, t) => P.qBubble(c, t, W(L, 2, 2), 900, 660, 50), ['pop', {f: 660}])],
    end: ({L}) => [pillI(L[1][1] + 0.3, 540, 1300, 'UNDER THE HOOD · #1', {kind: 'white', size: 30}), pillI(L[1][1] + 0.9, 540, 1400, 'SG MIND MATRIX', {kind: 'dark', size: 30, snd: ['ding', {f: 1975, g: 0.25}]})],
  };
  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, {x005_hook: P.engineScene(hookA, 6.4, SND.hook, chrome, EX.hook), x005_claim: P.engineScene(claimA, 7.0, SND.claim, chrome), x005_tokens: P.engineScene(tokensA, 11.2, SND.tokens, chrome), x005_attend: P.engineScene(attendA, 11.2, SND.attend, chrome, EX.attend), x005_name: P.engineScene(nameA, 7.6, SND.name, chrome), x005_twist: P.engineScene(twistA, 10.4, SND.twist, chrome, EX.twist), x005_end: P.engineScene(endA, 8.0, SND.end, chrome, EX.end)});

  const O = (name, draw, keys, note) => ({name, draw, keys, note});
  return {CAPS, scenes: [
    {id: 'hook', label: '1 · Hook', act: 'dark', lines: 'L01–L02', dur: 6.4, options: [
      O('Studio Enter + pops', hookA, [0.9, 2.6, 4.2, 5.6], 'The approved EP000 hand and green Enter, with Pop layers on top: a 0.0 → 2.0 s timer pill, the answer card streaming in, an Amber "?" on "interesting part". Reuses what Samrat already approved.'),
      O('Phone chat close-up', hookB, [0.6, 1.0, 2.8, 5.6], 'A drawn phone: "Why is the sky blue?" types, a small Enter key pops and lights, the answer streams in under it; timer pill on top. Most like what viewers do.'),
      O('Macro Enter key', hookC, [0.5, 0.9, 2.6, 5.6], 'One huge Enter keycap; a chunky hand rises from below and presses it, rings pulse, the answer card slides up. Boldest first frame.')]},
    {id: 'claim', label: '2 · Claim', act: 'light', lines: 'L03–L04', dur: 7.0, options: [
      O('LOOK UP ✗ → pen writes', claimA, [1.2, 2.8, 4.4, 6.6], 'A LOOK UP card with a magnifier gets an Amber X ("finished answer?"); a pen and an empty ANSWER card pop, and it fills block by block.'),
      O('LOOK UP ≠ WRITE', claimB, [1.6, 2.4, 3.8, 6.6], 'Split screen: a bookshelf LOOK UP card vs a WRITE card with a pen, a big Amber ≠; the left dims and gets X\'d, the right fills line by line.'),
      O('Ready-made box falls', claimC, [1.2, 3.0, 3.6, 6.6], 'A READY-MADE ANSWER box drops in, gets X\'d and falls off frame; then "The sky looks blue…" builds chip by chip.')]},
    {id: 'tokens', label: '3 · Tokens → numbers', act: 'light → dark', lines: 'L05–L07', dur: 11.2, options: [
      O('Snip, split, flip', tokensA, [1.2, 2.6, 5.6, 9.6], 'The prompt card gets Amber cut lines, chips spread (TOKENS); "unbelievable" splits into "un" + "believable" (1 word = 2 tokens); the stage flips dark and every chip flips into a card of numbers.'),
      O('Conveyor + barcode', tokensB, [1.6, 3.0, 5.6, 9.6], 'The sentence slides through a CUT machine on a belt, chips pop out; the split word; then each chip becomes a little bar code of its numbers (white = +, Amber = −).'),
      O('Write, cut, vectors', tokensC, [0.8, 1.6, 5.6, 9.6], 'Manim-like: the prompt writes on, Amber cut lines draw between tokens, chips rise; then each becomes a bracketed column of numbers [ 0.1 … ].')]},
    {id: 'attend', label: '4 · Attention → next word', act: 'dark', lines: 'L08–L10', dur: 11.2, options: [
      O('Arcs, bars, join', attendA, [1.6, 3.0, 6.4, 9.6], '"The sky looks": dotted arcs from "looks" back to the words it weighs (thick Amber = matters most); four scored next words, "blue" is the green bar; it flies up and joins, GUESS AGAIN ↻.'),
      O('Web + slot reel', attendB, [1.8, 3.4, 7.2, 10.4], 'The three chips on a circle with a web of lines (thick = matters); then a slot reel spins through words and stops on "blue" (NEXT WORD, green); +1 TOKEN pills stack up.'),
      O('Grid, list, chain', attendC, [1.8, 3.2, 6.4, 10.4], 'An attention grid (who looks at whom, Amber = strong); the scored list; then the chain grows "The sky looks blue because" one chip at a time, AGAIN ↻.')]},
    {id: 'name', label: '5 · Typing + name it', act: 'light', lines: 'L11–L12', dur: 7.6, options: [
      O('Chips fly into the chat', nameA, [1.4, 3.2, 5.6, 7.2], 'Chips travel a dotted path into a chat bubble, one word lands at a time (SENT AS IT\'S MADE); then NEXT-TOKEN PREDICTION types on with the Amber underline and "= HOW IT WRITES".'),
      O('Cursor + "+1"s', nameB, [1.2, 2.8, 5.0, 7.2], 'A dark chat bubble types with a blinking cursor, a small +1 pops for each word; the title zooms in and types on.'),
      O('MODEL → phone, "?" reveal', nameC, [1.4, 3.4, 4.6, 7.2], 'A MODEL box pipes tokens down a dotted line into a phone; a big "?" holds on "This is called…", then the title types on (like the reference\'s reveal).')]},
    {id: 'twist', label: '6 · Twist', act: 'dark', lines: 'L13–L15', dur: 10.4, options: [
      O('LIKELY vs CHECKED FACT', twistA, [0.8, 4.2, 7.6, 9.8], 'TWIST! sticker with burst; a solid LIKELY card (PICKED) next to a dotted CHECKED FACT outline; a SOUNDS SURE meter fills; Amber CAN BE WRONG stamp. Source line under it.'),
      O('Balance tips', twistB, [0.8, 4.2, 7.4, 9.8], 'TWIST!; a balance tips toward LIKELY over FACT; a confident answer card with a 100% SURE pill; the stamp.'),
      O('Bars pick, gauge maxes', twistC, [0.8, 3.8, 7.8, 9.8], 'TWIST!; the scored bars pick the likely word (LIKELY ✓); a SURE gauge needle swings to max and gets an Amber X.')]},
    {id: 'end', label: '7 · Recap + sign-off', act: 'light → dark', lines: 'L16–L17', dur: 8.0, options: [
      O('Recap chain → card', endA, [1.4, 3.2, 5.0, 7.6], 'ENTER → TOKENS → NUMBERS → ATTENTION → NEXT WORD pops down a dotted chain; then the sign-off: "Now you see" + the big THE CODE card, burst, "?" bubbles, faint chips and Enter drifting behind.'),
      O('FIND ✗ / WRITE ✓ → card', endB, [1.0, 1.8, 3.6, 7.6], 'A FIND card gets X\'d, a WRITE card fills; then the sign-off card.'),
      O('Answer breaks apart → card', endC, [1.0, 2.8, 4.9, 7.6], 'The finished answer card breaks back into its word chips, which fly out; then the sign-off card with chips drifting behind.')]},
  ]};
})();
