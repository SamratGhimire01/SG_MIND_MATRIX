/* X004 SHIFT "The Trust Gap" — v004: the whole video in the Pop Explainer style (Samrat, 3 Nov 2026: "follow the same pop design as the
   second video"). Every scene is a timeline on the real voice (scene.text.L = its lines): each spoken thing pops in on its word with its own
   sound. Real-world references are product NAMES set as SGMM tags (ChatGPT, Claude, Gemini, Stack Overflow) — no logo graphics: Anthropic and
   OpenAI require permission for logo use (anthropic.com/legal/trademark-guidelines, openai.com/brand). Numbers: Stack Overflow Developer Survey 2026.
   Needs SGMM_POP. */
(() => {
  const P = SGMM_POP, {C, SG, MONO, TAU, seg, out3, lerp, rr, W, item, pillI, cardI} = P;
  let CH = true; const chrome = (v) => { CH = v; };
  const SRC = 'Stack Overflow Developer Survey 2026 · 30,903 developers';
  const ANS = ['Use a hash map: store each value', 'with its index, then look up', 'target − value in one pass.'];
  const lines = (c, t, a, x, y, col, rate = 40) => { c.save(); c.font = `500 34px ${MONO}`; c.fillStyle = col; let n = Math.floor((t - a) * rate); ANS.forEach((ln, i) => { if (n <= 0) return; c.fillText(ln.slice(0, n), x, y + i * 50); n -= ln.length; }); c.restore(); };
  const act = (at, n, label, kind) => pillI(at, 190, 470, `${n} ${label}`, {kind, size: 26, rot: 0, snd: ['tick', {f: 3200, g: 0.6}]});
  const src = (at) => item(at, (c, t) => P.label(c, t, at, SRC, {y: 1590}), null);
  const lens = (c, x, y, r, col) => { c.strokeStyle = col; c.lineWidth = r * 0.18; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); c.lineCap = 'round'; c.beginPath(); c.moveTo(x + r * 0.72, y + r * 0.72); c.lineTo(x + r * 1.5, y + r * 1.5); c.stroke(); };
  const tickMark = (c, x, y, s, col) => { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineWidth = 22; c.lineCap = c.lineJoin = 'round'; c.beginPath(); c.moveTo(-50, 0); c.lineTo(-12, 38); c.lineTo(58, -46); c.stroke(); c.restore(); };
  const person = (c, x, y, s, fill) => { c.fillStyle = fill; c.beginPath(); c.arc(x, y - 30 * s, 20 * s, 0, TAU); c.fill(); rr(c, x - 28 * s, y - 4 * s, 56 * s, 50 * s, 20 * s); c.fill(); };
  const chat = (c, t, at, x, y, w, prompt) => P.card(c, t, at, x, y, w, 380, (cc, Wd, H) => { cc.fillStyle = C.forest; rr(cc, Wd / 2 - 40 - 380, -H / 2 + 50, 380, 64, 32); cc.fill(); cc.font = `600 30px ${SG}`; cc.fillStyle = C.white; cc.textBaseline = 'middle'; cc.fillText(prompt, Wd / 2 - 400, -H / 2 + 83); lines(cc, t, at + 0.3, -Wd / 2 + 40, -H / 2 + 170, C.void, 70); }, {label: 'AI CHAT'});
  const S = {};

  // ---- HOOK (L01) dark: the answer streams, a 2.0 s timer, the names of the chatbots, a "?" and a magnifier on "check"
  S.x004p_hook = P.timelineScene(({L}) => {
    const sec = W(L, 0, 4), chk = W(L, 0, 7);
    return {bg: (c, t) => P.bg(c, t, 'dark'), items: [
      item(0, (c, t) => chat(c, t, -0.4, 540, 880, 900, 'fix my code?'), ['pop', {f: 330, g: 1}]),
      item(0.45, (c, t) => { const v = Math.min(2, 2 * seg(0.45, sec, t)); P.pill(c, t, 0.45, 540, 600, v.toFixed(1) + ' s', {kind: 'white', size: 36, rot: 0}); }, ['tick', {f: 3000, g: 0.7}]),
      item(sec, () => {}, ['ding', {f: 1975, g: 0.3}]),
      pillI(sec + 0.15, 300, 1160, 'ChatGPT', {kind: 'dark', size: 30}), pillI(sec + 0.4, 540, 1160, 'Claude', {kind: 'dark', size: 30}), pillI(sec + 0.65, 780, 1160, 'Gemini', {kind: 'dark', size: 30}),
      item(chk, (c, t) => P.qBubble(c, t, chk, 900, 700, 66), ['pop', {f: 620, g: 1}]),
      item(chk + 0.35, (c, t) => P.withPop(c, t, chk + 0.35, 760, 900, (cc) => lens(cc, 0, 0, 70, C.amber)), ['whoosh', {dur: 0.35, g: 0.5}]),
    ]};
  }, chrome);

  // ---- THEN (L02) light: a developer asks; strangers appear; a forum card ("e.g. Stack Overflow"); the wait counter; replies; the amber tick
  S.x004p_then = P.timelineScene(({L}) => {
    const w = (k) => W(L, 0, k), hrs = [w(8), w(11)];
    return {bg: (c, t) => P.bg(c, t, 'light'), items: [
      act(0.1, '01', 'THEN', 'amber'),
      pillI(w(0), 540, 640, 'DEVELOPER', {kind: 'dark', size: 30}),
      ...[0, 1, 2].map((i) => item(w(4) + i * 0.14, (c, t) => P.withPop(c, t, w(4) + i * 0.14, 260 + i * 280, 800, (cc) => person(cc, 0, 0, 1.3, C.fog)), ['pop', {f: 380 + i * 90}])),
      cardI(w(6), 540, 1050, 820, 260, (cc, t, Wd, H) => { cc.font = `700 38px ${SG}`; cc.fillStyle = C.void; cc.fillText('Q: why does my loop crash?', -Wd / 2 + 40, -H / 2 + 92); cc.fillStyle = 'rgba(124,138,132,.45)'; for (let i = 0; i < 2; i++) { rr(cc, -Wd / 2 + 40, -H / 2 + 135 + i * 40, Wd - 80 - i * 160, 16, 8); cc.fill(); } }, {label: 'FORUM · e.g. Stack Overflow'}),
      item(hrs[0], (c, t) => { const h = Math.min(3, Math.floor(1 + 3 * seg(hrs[0], hrs[1], t))); P.pill(c, t, hrs[0], 540, 1290, `WAITING · ${h} H`, {kind: 'dark', size: 32, rot: 0}); }, ['tick', {f: 2600, g: 0.8}]),
      item(lerp(hrs[0], hrs[1], 0.4), () => {}, ['click', {f: 2200, g: 0.8}]), item(lerp(hrs[0], hrs[1], 0.8), () => {}, ['click', {f: 2400, g: 0.8}]),
      pillI(w(9) + 0.1, 250, 1420, '+3', {kind: 'white', size: 28}), pillI(w(10) + 0.1, 430, 1420, '+12', {kind: 'white', size: 28}),
      item(w(12), (c, t) => { P.burst(c, t, w(12), 780, 1440, 110); P.withPop(c, t, w(12), 780, 1440, (cc) => { cc.fillStyle = C.white; cc.beginPath(); cc.arc(0, 0, 95, 0, TAU); cc.fill(); tickMark(cc, 0, 0, 0.9, C.amber); }); }, ['ding', {f: 1568, g: 0.35}]),
    ]};
  }, chrome);

  // ---- NOW a (L03) dark: a chat window; 10 developers pop, 7 light up; ">70% use AI daily" counts up
  S.x004p_now_a = P.timelineScene(({L}) => {
    const w = (k) => W(L, 0, k), lit = w(6);
    return {bg: (c, t) => P.bg(c, t, 'dark'), items: [
      act(0.1, '02', 'NOW', 'white'),
      ...Array.from({length: 10}, (_, i) => item(w(4) + i * 0.08, (c, t) => P.withPop(c, t, w(4) + i * 0.08, 180 + (i % 5) * 180, 760 + Math.floor(i / 5) * 200, (cc) => person(cc, 0, 0, 1.5, i < 7 && t > lit + i * 0.05 ? C.white : 'rgba(124,138,132,.45)'), {r0: 0}), i % 3 === 0 ? ['pop', {f: 360 + i * 30, g: 0.7}] : null)),
      ...[0, 1, 2, 3, 4, 5, 6].map((i) => item(lit + i * 0.05, () => {}, i % 2 ? null : ['click', {f: 2200 + i * 100, g: 0.6}])),
      cardI(w(8), 540, 1270, 640, 230, (cc, t) => { cc.font = `700 120px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(`${Math.round(70 * out3(seg(w(8), w(10), t)))}%+`, 0, 24); }, {label: 'USE AI EVERY DAY'}),
      item(w(10), () => {}, ['ding', {f: 1318.5, g: 0.3}]), src(w(8)),
    ]};
  }, chrome);

  // ---- NOW b (L04) light: "TRUST IT?" — a 100% card counts down to the green 16%; MOST TASKS pill
  S.x004p_now_b = P.timelineScene(({L}) => {
    const w = (k) => W(L, 0, k), d0 = w(4), d1 = w(6);
    return {bg: (c, t) => P.bg(c, t, 'light'), items: [
      pillI(w(1), 540, 640, 'TRUST IT?', {kind: 'dark', size: 40}), item(w(3), (c, t) => P.qBubble(c, t, w(3), 820, 600, 54), ['pop', {f: 640}]),
      cardI(d0 - 0.2, 540, 960, 700, 320, (cc, t) => { const v = Math.round(100 - 84 * out3(seg(d0, d1, t))); cc.font = `700 190px ${SG}`; cc.fillStyle = v === 16 ? C.forest : C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(`${v}%`, 0, 24); }, {label: 'TRUST IT WITH MOST TASKS'}),
      item(d0, () => {}, ['slide', {dur: d1 - d0, g: 0.6}]), item(d1, () => {}, ['thud', {f: 110, g: 1}]),
      pillI(d1 + 0.05, 540, 1190, 'ONLY 16%', {kind: 'green', size: 40, snd: ['pop', {f: 700, g: 1}]}),
      pillI(w(10), 540, 1320, 'MOST TASKS · not big decisions', {kind: 'dark', size: 26}), src(d0),
    ]};
  }, chrome);

  // ---- NOW c (L05) dark: 48% card; "ONLY WHEN…"; a checkbox ticks on "check"; CHECKABLE pill
  S.x004p_now_c = P.timelineScene(({L}) => {
    const w = (k) => W(L, 0, k);
    return {bg: (c, t) => P.bg(c, t, 'dark'), items: [
      cardI(w(0), 540, 860, 700, 320, (cc) => { cc.font = `700 190px ${SG}`; cc.fillStyle = C.void; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('48%', 0, 24); }, {label: 'TRUST IT WHEN THEY CAN CHECK'}),
      pillI(w(3), 540, 1090, 'ONLY WHEN…', {kind: 'amber', size: 34}),
      item(w(7), (c, t) => P.withPop(c, t, w(7), 540, 1260, (cc) => { cc.strokeStyle = C.white; cc.lineWidth = 8; rr(cc, -60, -60, 120, 120, 18); cc.stroke(); if (t > w(7) + 0.25) tickMark(cc, 0, 0, 0.75, C.white); }), ['click', {f: 2400, g: 1}]),
      item(w(7) + 0.25, () => {}, ['tick', {f: 3000, g: 0.9}]),
      pillI(w(9), 540, 1420, '✓ CHECKABLE', {kind: 'white', size: 30}), src(w(0)),
    ]};
  }, chrome);

  // ---- NEXT (L06, L07) dark: ASKING gets an Amber X; CHECKING is the green; a magnifier sweeps the answer; snap to black on "seconds—"
  S.x004p_next = P.timelineScene(({L}) => {
    const w = (k) => W(L, 0, k), v = (k) => W(L, 1, k), end = L[1][1];
    return {bg: (c, t) => P.bg(c, t, 'dark'), items: [
      act(0.1, '03', 'NEXT', 'forest'),
      pillI(w(2), 540, 640, 'THE NEXT SKILL', {kind: 'white', size: 34}),
      pillI(w(6), 330, 820, 'ASKING', {kind: 'white', size: 44}), item(w(7), (c, t) => P.xMark(c, t, w(7), 330, 820, 70), ['thud', {f: 120, g: 0.9}]),
      pillI(w(8), 750, 820, 'CHECKING', {kind: 'green', size: 44, snd: ['pop', {f: 720, g: 1}]}),
      cardI(w(8) + 0.3, 540, 1100, 880, 260, (cc, t, Wd, H) => { lines(cc, 99, 0, -Wd / 2 + 40, -H / 2 + 80, C.void); const sx = lerp(-300, 320, out3(seg(w(8) + 0.5, v(2), t))); if (t > w(8) + 0.5) lens(cc, sx, -10, 56, C.amber); }, {label: 'AI ANSWER'}),
      item(w(8) + 0.5, () => {}, ['whoosh', {dur: 0.6, g: 0.45}]),
      ...[0, 1, 2].map((i) => item(v(1) + i * 0.35, (c, t) => P.withPop(c, t, v(1) + i * 0.35, 1010, 1040 + i * 50, (cc) => { cc.fillStyle = C.white; cc.beginPath(); cc.arc(0, 0, 18, 0, TAU); cc.fill(); }, {r0: 0}), ['tick', {f: 2600 + i * 200, g: 0.9}])),
      item(v(5), (c, t) => P.pill(c, t, v(5), 540, 1340, '2.0 s', {kind: 'white', size: 40, rot: 0}), ['ding', {f: 1975, g: 0.3}]),
    ], post: (c, t) => { if (t > end + 0.02) { c.fillStyle = C.void; c.fillRect(0, 0, 1080, 1920); } }};
  }, chrome);

  window.SGMM_STYLE_SCENES = Object.assign(window.SGMM_STYLE_SCENES || {}, S);
})();
