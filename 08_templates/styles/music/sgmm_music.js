/* SGMM energetic scores (Samrat, 3 Nov 2026: "not the spooky one — interesting, energetic, motivating").
   Original, synthesized in Web Audio (no samples → owned, no Content ID). Each follows the plan: light in the hook, the beat drops at THEN,
   full energy at NOW, a lift into NEXT, a dead stop before the logo (plan cue), a final hit on the mark, silence after the blackout.
   Registered as plan-based scores: "score": "pulse_drive" | "pulse_lofi" | "pulse_rise". The scene sounds still play (ctx.sceneSounds). */
(() => {
  const N = (m) => 440 * Math.pow(2, (m - 69) / 12);   // MIDI note -> Hz
  // ---- instruments (all on the music bus, so the automix ducks them under the voice)
  const I = (k) => ({
    kick: (t, g = 1) => { k.tone(t, {f: [[0, 160], [0.09, 48]], dur: 0.32, gain: 0.55 * g, a: 0.002, bus: 'music'}); k.noise(t, {dur: 0.012, filter: 'highpass', f: 3000, gain: 0.18 * g, bus: 'music'}); },
    clap: (t, g = 1) => { [0, 0.012, 0.025].forEach((d) => k.noise(t + d, {dur: 0.09, filter: 'bandpass', f: 1600, q: 0.9, gain: 0.34 * g, a: 0.001, bus: 'music', verb: 0.15})); },
    snare: (t, g = 1) => { k.noise(t, {dur: 0.15, filter: 'bandpass', f: 1800, q: 0.7, gain: 0.3 * g, a: 0.001, bus: 'music', verb: 0.12}); k.tone(t, {f: [[0, 210], [0.08, 160]], dur: 0.1, gain: 0.12 * g, bus: 'music'}); },
    hat: (t, g = 1, open) => k.noise(t, {dur: open ? 0.2 : 0.035, filter: 'highpass', f: 7000, gain: 0.28 * g, a: 0.001, bus: 'music', pan: 0.2}),
    bass: (t, f, d, g = 1) => { k.tone(t, {f, type: 'sawtooth', dur: d, gain: 0.09 * g, a: 0.005, hold: d * 0.5, filter: 'lowpass', f2: [[0, 1400], [d, 320]], q: 2, bus: 'music'}); k.tone(t, {f, dur: d, gain: 0.09 * g, a: 0.005, hold: d * 0.6, bus: 'music'}); },
    shaker: (t, g = 1) => k.noise(t, {dur: 0.03, filter: 'highpass', f: 6500, gain: 0.11 * g, a: 0.008, bus: 'music', pan: -0.25}),
    chord: (t, ns, d, g = 1, cut = 3200) => ns.forEach((f, i) => [0.997, 1.003].forEach((dt) => k.tone(t, {f: f * dt, type: 'sawtooth', dur: d, gain: 0.022 * g, a: 0.03, hold: d * 0.6, filter: 'lowpass', f2: cut, q: 0.8, bus: 'music', verb: 0.3, pan: (i - 1) * 0.3}))),
    keys: (t, ns, d, g = 1) => ns.forEach((f, i) => { k.tone(t, {f, dur: d, gain: 0.05 * g, a: 0.006, hold: d * 0.3, bus: 'music', verb: 0.35, pan: (i - 1.5) * 0.25}); k.tone(t, {f: f * 2, type: 'triangle', dur: d * 0.5, gain: 0.03 * g, a: 0.004, bus: 'music', verb: 0.3}); }),
    pluck: (t, f, g = 1) => k.tone(t, {f, type: 'sawtooth', dur: 0.22, gain: 0.07 * g, a: 0.003, filter: 'lowpass', f2: [[0, 6500], [0.2, 1200]], q: 1, bus: 'music', verb: 0.25, pan: 0.15}),
    pad: (t0, t1, ns, g = 1) => { const d = t1 - t0; if (d < 0.3) return; ns.forEach((f, i) => k.tone(t0, {f, type: 'triangle', dur: d, gain: 0.03 * g, a: Math.min(1.2, d * 0.4), hold: d * 0.4, filter: 'lowpass', f2: 1400, bus: 'music', verb: 0.45, pan: (i - 1) * 0.35})); },
    riser: (t, d, g = 1) => k.noise(t, {dur: d, color: 'pink', filter: 'bandpass', f: [[0, 400], [d, 5200]], q: 1.1, gain: 0.12 * g, a: d * 0.92, hold: 0, bus: 'music', verb: 0.2}),
    sub808: (t, f, d, g = 1, glide) => { k.tone(t, {f: glide ? [[0, glide], [0.08, f]] : f, dur: d, gain: 0.17 * g, a: 0.004, hold: d * 0.5, bus: 'music'}); k.tone(t, {f: f * 2, type: 'square', dur: Math.min(d, 0.25), gain: 0.025 * g, filter: 'lowpass', f2: 600, bus: 'music'}); },
    snap: (t, g = 1) => { k.noise(t, {dur: 0.05, filter: 'bandpass', f: 2800, q: 1.6, gain: 0.42 * g, a: 0.001, bus: 'music', verb: 0.25}); k.noise(t, {dur: 0.008, filter: 'highpass', f: 5000, gain: 0.25 * g, bus: 'music'}); },
    tom: (t, f, g = 1) => k.tone(t, {f: [[0, f * 1.6], [0.25, f]], dur: 0.45, gain: 0.34 * g, a: 0.002, bus: 'music', verb: 0.2}),
    saw5: (t, ns, d, g = 1, cut = 3000) => ns.forEach((f, i) => [-12, -5, 0, 5, 12].forEach((ct) => k.tone(t, {f: f * Math.pow(2, ct / 1200), type: 'sawtooth', dur: d, gain: 0.011 * g, a: 0.01, hold: d * 0.55, filter: 'lowpass', f2: cut * 1.6, q: 0.7, bus: 'music', verb: 0.3, pan: ct / 24}))),
    power: (t, f, d, g = 1) => [f, f * 1.4983, f * 2].forEach((h, i) => { k.tone(t, {f: h, type: 'sawtooth', dur: d, gain: 0.04 * g, a: 0.006, hold: d * 0.7, filter: 'lowpass', f2: 4200, q: 1.2, bus: 'music', pan: (i - 1) * 0.4}); k.tone(t, {f: h * 1.005, type: 'square', dur: d, gain: 0.018 * g, a: 0.006, hold: d * 0.7, filter: 'lowpass', f2: 1800, bus: 'music', pan: (1 - i) * 0.4}); }),
    hit: (t, ns, g = 1) => { k.tone(t, {f: [[0, 130], [0.18, 42]], dur: 0.6, gain: 0.9 * g, bus: 'music', verb: 0.3}); ns.forEach((f) => k.tone(t, {f, type: 'sawtooth', dur: 1.4, gain: 0.03 * g, a: 0.01, filter: 'lowpass', f2: [[0, 2600], [1.4, 600]], bus: 'music', verb: 0.5})); },
  });
  // ---- the arrangement: sections from the plan's act tags and scenes
  function sections(plan, scenes) {
    const tag = (l) => (plan.act_tags || []).find((g) => g.label === l), logo = scenes.find((s) => s.type === 'logo_from_dark');
    const then = tag('THEN') ? tag('THEN').t[0] : 3, now = tag('NOW') ? tag('NOW').t[0] : then + 5, next = tag('NEXT') ? tag('NEXT').t[0] : now + 8;
    const end = logo ? logo.a : plan.duration - 3;
    return {then, now, next, end, mark: logo ? logo.a + 0.4 : end};
  }
  function make(cfg) {
    const fn = (k, plan, scenes, ctx) => {
      ctx.sceneSounds(k, plan, scenes);
      const x = I(k), S = sections(plan, scenes), b = 60 / cfg.bpm, bar = 4 * b;
      const chordAt = (t) => cfg.prog[Math.floor(t / bar) % cfg.prog.length];
      // hook: filtered pad + riser into THEN
      x.pad(0, S.then, chordAt(0).ch, 0.8); x.riser(Math.max(0, S.then - 1.6), 1.6, 0.8);
      for (let i = 0, t = 0; t < S.end - 0.05; i++, t = i * b / 2) {   // 8th-note grid from 0
        const beat = i / 2, inBar = beat % 4, sec = t < S.then ? 0 : t < S.now ? 1 : t < S.next ? 2 : 3, c = chordAt(t);
        if (sec === 0) continue;
        cfg.drums(x, t, beat, inBar, sec, i);
        if (sec >= 1) { x.shaker(t, sec >= 2 ? 1 : 0.6); x.shaker(t + b / 4, sec >= 2 ? 0.7 : 0.4); }   // air: 16th shaker
        if (cfg.bassFn) cfg.bassFn(x, t, c, beat, inBar, sec, i, b); else if (i % 2 === 0) x.bass(t, c.bass * (cfg.bassOct || 1), b * (sec >= 2 ? 0.45 : 0.9), sec >= 2 ? 1 : 0.8);
        if (inBar === 0 && i % 2 === 0) cfg.harmony(x, t, c, bar, sec);
        if (sec >= 2 && cfg.arp) x.pluck(t, c.ch[(cfg.arpOrder ? cfg.arpOrder[i % cfg.arpOrder.length] : i) % c.ch.length] * 2, sec === 3 ? 1 : 0.8);
      }
      if (cfg.hook) cfg.hook(k, S, b);
      x.riser(Math.max(S.next, S.end - 2 * bar), Math.min(2 * bar, S.end - S.next), 1);
      x.hit(S.mark, chordAt(0).ch, 1.1);
    };
    fn.planBased = true; return fn;
  }
  const C = (root, ns) => ({bass: N(root), ch: ns.map(N)});
  window.SGMM_SCORES = Object.assign(window.SGMM_SCORES || {}, {
    // A — Drive: 120 BPM, four on the floor, claps on 2 & 4, offbeat open hats, Am–F–C–G
    pulse_drive: make({bpm: 120, arp: true,
      prog: [C(45, [57, 60, 64]), C(41, [53, 57, 60]), C(48, [55, 60, 64]), C(43, [55, 59, 62])],
      drums: (x, t, beat, inBar, sec, i) => { if (i % 2 === 0 && (sec >= 2 || inBar % 2 === 0)) x.kick(t, sec === 1 ? 0.8 : 1); if (i % 2 === 0 && (inBar === 1 || inBar === 3) && sec >= 2) x.clap(t); x.hat(t, i % 2 ? 1 : 0.5, i % 2 === 1 && sec >= 2); },
      harmony: (x, t, c, bar, sec) => x.chord(t, c.ch, bar * 0.95, sec >= 2 ? 1 : 0.7, sec >= 2 ? 2200 : 1300)}),
    // B — Lo-fi Push: 92 BPM, boom-bap (kick 1 & the "and" of 2, snare 2 & 4, swung hats), warm 7th chords: Dm7–Bbmaj7–Gm7–A7
    pulse_lofi: make({bpm: 92, arp: false,
      prog: [C(50, [62, 65, 69, 72]), C(46, [58, 62, 65, 69]), C(43, [55, 58, 62, 65]), C(45, [57, 61, 64, 67])],
      drums: (x, t, beat, inBar, sec, i) => { const sw = i % 2 ? 0.04 : 0; if (i % 8 === 0 || i % 8 === 3) x.kick(t + sw, 0.9); if (i % 4 === 2 && sec >= 1) x.snare(t); if (sec >= 2) x.hat(t + sw, i % 2 ? 0.6 : 0.9); else if (i % 2 === 0) x.hat(t, 0.6); },
      harmony: (x, t, c, bar, sec) => x.keys(t, c.ch, bar * 0.9, sec >= 2 ? 1 : 0.8)}),
    // C — Signal Rise: 128 BPM, driving 8th bass, claps, a bright ney hook in D (Hijaz colour kept from the SGMM theme): Dm–Bb–C–A
    pulse_rise: make({bpm: 128, arp: true, bassOct: 1,
      prog: [C(50, [62, 65, 69]), C(46, [58, 62, 65]), C(48, [60, 64, 67]), C(45, [57, 61, 64])],
      drums: (x, t, beat, inBar, sec, i) => { if (i % 2 === 0 && (sec >= 2 || inBar === 0 || inBar === 2)) x.kick(t, 1); if (i % 2 === 0 && (inBar === 1 || inBar === 3) && sec >= 1) x.clap(t, sec >= 2 ? 1 : 0.7); if (sec >= 2) x.hat(t, i % 2 ? 1 : 0.6, i % 4 === 2); },
      harmony: (x, t, c, bar, sec) => x.chord(t, c.ch, bar * 0.95, sec >= 2 ? 1.1 : 0.7, sec >= 2 ? 2600 : 1400),
      hook: (k, S, b) => { const ph = (t0) => [[t0, N(74), b, 1], [t0 + b, N(75), b * 0.5, 1.1], [t0 + 1.5 * b, N(74), b * 0.5, 1], [t0 + 2 * b, N(72), b, 0.9], [t0 + 3 * b, N(69), b * 1.5, 1]];
        [S.now + 4 * b, S.next].forEach((t0) => { if (t0 + 5 * b < S.end) k.ney(ph(t0), {gain: 0.07, bright: 3800}); }); }}),
    // 1 — Snap (after "Snap Crackle": 112 BPM, Bb minor, 808 sub, snaps, trap hats): Bbm–Gb–Db–Ab
    sgmm_snap: make({bpm: 112, arp: true, arpOrder: [0, 2, 1, 2, 0, 1, 2, 1],
      prog: [C(46, [58, 61, 65]), C(42, [54, 58, 61]), C(49, [56, 61, 65]), C(44, [56, 60, 63])],
      drums: (x, t, beat, inBar, sec, i) => { if (i % 8 === 0 || (sec >= 2 && i % 8 === 5)) x.kick(t, 1); if (i % 4 === 2) x.snap(t, sec >= 2 ? 1 : 0.7); if (sec >= 2) { x.hat(t, 0.7); if (i % 8 === 7) [0.25, 0.5, 0.75].forEach((q) => x.hat(t + q * 60 / 112 / 2, 0.5)); } else if (i % 2 === 0) x.hat(t, 0.5); },
      bassFn: (x, t, c, beat, inBar, sec, i, b) => { if (i % 8 === 0) x.sub808(t, c.bass / 2, 4 * b * 0.9, 1, c.bass * 0.75); if (sec >= 2 && i % 8 === 5) x.sub808(t, c.bass / 2, b, 0.8); },
      harmony: (x, t, c, bar, sec) => x.keys(t, c.ch, bar * 0.6, sec >= 2 ? 0.9 : 0.7)}),
    // 2 — Start Line (after "Start": ~140 BPM, F# major, bright, building): F#–C#–D#m–B
    sgmm_startline: make({bpm: 140, arp: true, arpOrder: [0, 1, 2, 1],
      prog: [C(42, [66, 70, 73]), C(49, [61, 65, 68]), C(51, [63, 66, 70]), C(47, [59, 63, 66])],
      drums: (x, t, beat, inBar, sec, i) => { if (i % 2 === 0 && (sec >= 2 || inBar === 0)) x.kick(t, 1); if (i % 2 === 0 && (inBar === 1 || inBar === 3) && sec >= 1) x.clap(t, sec >= 2 ? 1 : 0.6); if (sec >= 2) x.hat(t, i % 2 ? 1 : 0.5, i % 2 === 1); },
      bassFn: (x, t, c, beat, inBar, sec, i, b) => { if (i % 2 === 1 || sec >= 2) x.bass(t, c.bass, b * 0.4, sec >= 2 ? 1 : 0.7); },
      harmony: (x, t, c, bar, sec) => x.saw5(t, c.ch, bar * 0.95, sec >= 2 ? 1.1 : 0.6, sec >= 2 ? 4200 : 1600)}),
    // 3 — Arena (after "Stadium Rock": ~85 BPM, C# minor, big drums, power chords): C#m–A–E–B
    sgmm_arena: make({bpm: 85, arp: false,
      prog: [C(37, [61]), C(45, [57]), C(40, [52]), C(47, [59])],
      drums: (x, t, beat, inBar, sec, i) => { if (i % 8 === 0 || i % 8 === 3) x.kick(t, 1); if (i % 4 === 2) { x.snare(t, 1); if (sec >= 1) x.clap(t, 0.8); } if (sec >= 2) x.hat(t, i % 2 ? 0.8 : 0.5, i % 8 === 6); if (sec >= 2 && i % 16 === 14) { x.tom(t, 110); x.tom(t + 60 / 85 / 4, 90); x.tom(t + 60 / 85 / 2, 70); } },
      bassFn: (x, t, c, beat, inBar, sec, i, b) => { if (i % 2 === 0) x.bass(t, c.bass, b * 0.85, 1); },
      harmony: (x, t, c, bar, sec) => { const f = c.ch[0] / 2; x.power(t, f, bar * 0.48, sec >= 2 ? 1 : 0.6); x.power(t + bar * 0.5, f, bar * 0.45, sec >= 2 ? 0.9 : 0.5); }}),
    // 4 — Signal Mix (all three: 112 BPM, 808 sub + arena power chords + bright arp + the SGMM ney hook): Dm–Bb–F–C
    sgmm_signal: make({bpm: 112, arp: true, arpOrder: [0, 1, 2, 1],
      prog: [C(50, [62, 65, 69]), C(46, [58, 62, 65]), C(41, [57, 60, 65]), C(48, [60, 64, 67])],
      drums: (x, t, beat, inBar, sec, i) => { if (i % 8 === 0 || i % 8 === 3 || (sec >= 2 && i % 8 === 4)) x.kick(t, 1); if (i % 4 === 2) { x.snap(t, 0.8); if (sec >= 2) x.clap(t, 0.8); } if (sec >= 2) x.hat(t, i % 2 ? 0.9 : 0.5); else if (i % 2 === 0) x.hat(t, 0.5); },
      bassFn: (x, t, c, beat, inBar, sec, i, b) => { if (i % 8 === 0) x.sub808(t, c.bass / 2, 4 * b * 0.9, 1, c.bass * 0.75); },
      harmony: (x, t, c, bar, sec) => { if (sec >= 2) x.power(t, c.ch[0] / 2, bar * 0.95, 0.7); x.keys(t, c.ch, bar * 0.6, 0.7); },
      hook: (k, S, b) => { const ph = (t0) => [[t0, N(74), b, 1], [t0 + b, N(77), b * 0.5, 1.1], [t0 + 1.5 * b, N(76), b * 0.5, 1], [t0 + 2 * b, N(74), b, 0.9], [t0 + 3 * b, N(69), b * 1.5, 1]];
        [S.now + 4 * b, S.next].forEach((t0) => { if (t0 + 5 * b < S.end) k.ney(ph(t0), {gain: 0.06, bright: 3800}); }); }}),
  });
})();
