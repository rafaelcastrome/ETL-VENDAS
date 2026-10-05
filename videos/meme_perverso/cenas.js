// Meme "Muito perverso" — animação própria (estilo Caderno Amarelo) sincronizada com o áudio viral.
// Tempos em segundos ABSOLUTOS do áudio (timeline.json: cena 1 = senhora, 2 = mulher, 3 = o cara rindo).
// Bocas mexem conforme o volume do áudio (window.ENVELOPE, 30 valores por segundo).
window.CENAS = function (WB) {
  const { INK, C } = WB;
  const BROWN = '#7a4a1e', POOP = '#9c6b3a', SKIN = '#f6d2b4';
  const env = (t) => (window.ENVELOPE[Math.floor(t * 30)] || 0);
  const clamp = WB.clamp, ease = WB.ease, lerp = WB.lerp;
  const ramp = (t, a, b) => clamp((t - a) / (b - a));
  const win = (t, a, b, f = 0.25) => ramp(t, a, a + f) * (1 - ramp(t, b - f, b));

  // --- tempo absoluto -> (cena, fração) ---
  function sf(t) {
    const S = WB.scenes;
    for (let i = 0; i < S.length; i++) if (t >= S[i].start && t < S[i].end) return [i + 1, (t - S[i].start) / (S[i].end - S[i].start)];
    const L = S[S.length - 1]; return [S.length, (t - L.start) / (L.end - L.start)];
  }
  const D = (t0, t1, strokes) => { const [s, a] = sf(t0); const b = (t1 - WB.scenes[s - 1].start) / (WB.scenes[s - 1].end - WB.scenes[s - 1].start); return WB.draw(s, a, b, strokes); };
  const W = (t0, t1, str, x, y, size, color, opts = {}) => { const t = WB.textStrokes(str, x, y, size, color, opts.parent, opts.anchor || 'middle'); D(t0, t1, t.strokes); return t; };
  const SP = (d, color, w, parent) => WB.strokePath(d, color, w, parent);

  // --- desenhos auxiliares ---
  function poop(x, y, s = 1, parent) {
    const P = (a, b) => `${(x + a * s).toFixed(1)} ${(y + b * s).toFixed(1)}`;
    const d = `M ${P(-45, 0)} Q ${P(0, 25)} ${P(45, 0)} Q ${P(52, -18)} ${P(25, -20)} Q ${P(32, -38)} ${P(0, -38)} Q ${P(-28, -38)} ${P(-22, -20)} Q ${P(-52, -18)} ${P(-45, 0)} Z`;
    const bg = WB.mk('path', { d, fill: POOP, 'fill-opacity': 0 }, parent);
    const o = SP(d, BROWN, 6, parent);
    WB.fillAfter(bg, o, 0.2);
    return [o, SP(`M ${P(-8, -38)} Q ${P(2, -62)} ${P(14, -48)}`, BROWN, 6, parent)];
  }
  // moscas zumbindo (efeito contínuo)
  function moscas(x, y, n, t0, parent) {
    for (let i = 0; i < n; i++) {
      const g = WB.group(parent);
      WB.mk('circle', { cx: 0, cy: 0, r: 6, fill: '#222' }, g);
      WB.mk('ellipse', { cx: -7, cy: -7, rx: 7, ry: 4, fill: '#cfe8ff', stroke: '#555', 'stroke-width': 1.5 }, g);
      WB.mk('ellipse', { cx: 7, cy: -7, rx: 7, ry: 4, fill: '#cfe8ff', stroke: '#555', 'stroke-width': 1.5 }, g);
      const ph = i * 2.1;
      WB.effect((t) => {
        const on = t > t0 ? 1 : 0;
        const px = x + Math.sin(t * 7 + ph) * 45 + Math.sin(t * 17 + ph) * 10;
        const py = y + Math.cos(t * 5 + ph * 1.3) * 30 + Math.sin(t * 23 + ph) * 6;
        g.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)})`);
        g.setAttribute('opacity', on);
      });
    }
  }
  // carimbo próprio (grupo acessível para tremer/pulsar)
  function carimbo(text, cx, cy, size, color, rot, t0, t1, tText1, pulse) {
    const outer = WB.group();
    const g = WB.group(outer, `rotate(${rot} ${cx} ${cy})`);
    const w = WB.measure(text, size) + 60, h = size * 1.45;
    D(t0, t1, SP(WB.roughRect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), color, 10, g));
    W(t1, tText1, text, cx, cy + size * 0.33, size, color, { parent: g });
    if (pulse) WB.effect((t) => {
      const k = pulse(t);
      outer.setAttribute('transform', `translate(${cx} ${cy}) scale(${(1 + k).toFixed(3)}) rotate(${(Math.sin(t * 40) * 4 * k).toFixed(2)}) translate(${-cx} ${-cy})`);
    });
    return outer;
  }
  // boca dinâmica
  function boca(g, cy, active, opts = {}) {
    const m = WB.mk('path', { d: '', fill: '#7a1f1f', stroke: INK.black, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    WB.effect((t) => {
      const [show, speaking, laugh] = active(t);
      m.setAttribute('opacity', show ? 1 : 0);
      const o = speaking ? clamp((env(t) - 0.08) * 1.6) : 0;
      if (laugh > 0) {
        const L = laugh * (0.45 + 0.55 * clamp(env(t) * 1.4));
        const wdt = 62 + 14 * L, dep = 14 + 95 * L;
        m.setAttribute('d', `M ${-wdt} ${cy} Q 0 ${cy - 10} ${wdt} ${cy} Q ${wdt * 0.8} ${cy + dep} 0 ${cy + dep} Q ${-wdt * 0.8} ${cy + dep} ${-wdt} ${cy} Z`);
      } else {
        const rx = (opts.rx || 24) + 8 * o, ry = 3 + (opts.ry || 26) * o;
        m.setAttribute('d', `M ${-rx} ${cy} A ${rx} ${ry} 0 1 0 ${rx} ${cy} A ${rx} ${ry} 0 1 0 ${-rx} ${cy} Z`);
      }
    });
    return m;
  }

  // =====================================================================
  // CENA 1 — A SENHORA (0 – 16,4 s)
  // =====================================================================
  const sOuter = WB.group(WB.overlay, 'translate(290 430) scale(1.1)');
  const s = WB.group(sOuter);
  D(0.05, 1.3, [
    SP(WB.circlePath(0, 0, 100), INK.black, 7, s),
    SP(WB.circlePath(0, -128, 42), INK.gray, 7, s),
    SP('M -100 -10 Q -112 -112 0 -106 Q 112 -112 100 -10', INK.gray, 7, s),
    SP('M -104 10 q -22 10 -8 28 q -20 12 -2 28 M 104 10 q 22 10 8 28 q 20 12 2 28', INK.gray, 6, s),
    SP(WB.circlePath(-38, -8, 28), INK.black, 5, s), SP(WB.circlePath(38, -8, 28), INK.black, 5, s),
    SP('M -10 -10 L 10 -10', INK.black, 5, s),
    SP('M -38 -12 L -38 -6 M 38 -12 L 38 -6', INK.black, 10, s),
    SP('M -64 -50 Q -40 -66 -16 -50 M 64 -50 Q 40 -66 16 -50', INK.black, 6, s),
    SP('M 2 8 Q 12 26 -4 30', INK.black, 5, s),
    SP('M -120 215 Q -105 112 0 106 Q 105 112 120 215 M -30 106 L 0 150 L 30 106', INK.purple, 7, s),
    SP(WB.roundRectPath(78, -95, 40, 95, 10), INK.black, 6, s),
    SP('M 70 20 Q 100 0 120 25 Q 115 55 85 50 Z', INK.black, 6, s),
  ]);
  boca(s, 55, (t) => [t > 1.2 && t < 16.8, t > 0.1 && t < 16.4, 0]);
  // ela gesticula / balança indignada
  WB.effect((t) => {
    const k = win(t, 1.3, 16.4, 0.3);
    const r = Math.sin(t * 6) * 4 * k * (0.4 + env(t)), dy = -Math.abs(Math.sin(t * 9)) * 10 * k * env(t);
    s.setAttribute('transform', `translate(0 ${dy.toFixed(1)}) rotate(${r.toFixed(2)})`);
    sOuter.setAttribute('opacity', (1 - ramp(t, 16.4, 16.8)).toFixed(3));
  });
  // balão
  D(1.3, 1.6, SP(WB.roundRectPath(560, 215, 470, 215, 40) + ' M 600 430 L 545 480 L 650 430', INK.black, 6));
  W(1.6, 2.4, 'Fernanda,', 795, 300, 66, INK.black);
  W(2.4, 3.4, 'tu acredita?!', 795, 385, 72, INK.red);
  // a sala
  D(3.8, 4.6, [SP(WB.loopEllipse(300, 860, 170, 45, 1.0, -1.6), INK.black, 7), SP('M 190 890 L 175 1030 M 410 890 L 425 1030', INK.black, 7)]);
  D(4.6, 5.3, poop(300, 860, 1.1));
  moscas(300, 790, 3, 5.0);
  W(5.3, 5.9, 'a SALA!', 300, 1095, 64, INK.red);
  // o banheiro
  D(6.5, 7.4, [SP('M 640 800 L 760 800 L 760 880 L 640 880 Z', INK.black, 7),
    SP('M 610 890 L 870 890 Q 870 990 740 1000 Q 610 990 610 890 Z', INK.black, 7),
    SP('M 700 1000 L 690 1050 L 790 1050 L 780 1000', INK.black, 7)]);
  D(7.4, 8.0, poop(740, 880, 0.9));
  moscas(740, 800, 3, 7.8);
  W(8.0, 8.7, 'o BANHEIRO!', 760, 1105, 60, INK.red);
  // a toalha
  D(9.2, 10.1, [SP('M 140 1170 L 470 1170', INK.gray, 9),
    SP('M 180 1170 L 180 1390 Q 300 1405 430 1390 L 430 1170', INK.blue, 7),
    SP('M 180 1330 L 430 1330 M 180 1350 L 430 1350', INK.blue, 5)]);
  D(10.1, 10.6, SP('M 260 1250 Q 300 1230 330 1265 Q 300 1300 250 1290', BROWN, 14));
  W(10.6, 11.3, 'a TOALHA!', 305, 1460, 60, INK.red);
  // camisa do Antônio Pedro
  D(11.4, 12.2, SP('M 640 1210 L 700 1180 Q 760 1205 820 1180 L 880 1210 L 920 1270 L 870 1290 L 860 1250 L 860 1420 L 660 1420 L 660 1250 L 650 1290 L 600 1270 Z', INK.green, 7));
  W(12.2, 12.9, 'ANTÔNIO', 760, 1310, 40, INK.black);
  W(12.9, 13.4, 'PEDRO', 760, 1360, 40, INK.black);
  D(13.4, 13.8, SP('M 700 1385 Q 760 1370 820 1395', BROWN, 12));
  carimbo('BAGACEIRA!', 540, 1560, 96, INK.red, -6, 14.0, 14.3, 15.1, (t) => 0.12 * win(t, 15.1, 16.4, 0.1) * Math.abs(Math.sin(t * 14)));

  // =====================================================================
  // CENA 2 — A MULHER (16,4 – 40,8 s)
  // =====================================================================
  WB.newPage(2, 0.0, 0.017);
  const mOuter = WB.group(WB.overlay, 'translate(290 430) scale(1.1)');
  const m = WB.group(mOuter);
  D(16.9, 18.0, [
    SP(WB.circlePath(0, 0, 100), INK.black, 7, m),
    SP('M -100 0 Q -112 -122 0 -116 Q 112 -122 100 0 Q 118 70 96 150 M -100 0 Q -120 70 -96 150', '#5a3a1a', 8, m),
    SP('M -40 -112 Q -10 -60 60 -70', '#5a3a1a', 6, m),
    SP('M -38 -10 L -38 -2 M 38 -10 L 38 -2', INK.black, 11, m),
    SP('M -52 -26 L -46 -32 M 52 -26 L 46 -32', INK.black, 4, m),
    SP('M -60 -44 Q -40 -54 -18 -44 M 60 -44 Q 40 -54 18 -44', INK.black, 6, m),
    SP('M 2 8 Q 10 24 -4 28', INK.black, 5, m),
    SP(WB.circlePath(-102, 35, 8) + ' ' + WB.circlePath(102, 35, 8), INK.orange, 5, m),
    SP('M -120 215 Q -105 112 0 106 Q 105 112 120 215', INK.red, 7, m),
    SP(WB.roundRectPath(120, 60, 55, 95, 10), INK.black, 6, m),
  ]);
  boca(m, 52, (t) => [t > 17.9 && t < 41.2, t > 16.9 && t < 40.6, 0]);
  WB.effect((t) => {
    const k = win(t, 18.0, 40.6, 0.3);
    const r = Math.sin(t * 5 + 1) * 4 * k * (0.4 + env(t)), dy = -Math.abs(Math.sin(t * 8)) * 10 * k * env(t);
    m.setAttribute('transform', `translate(0 ${dy.toFixed(1)}) rotate(${r.toFixed(2)})`);
    mOuter.setAttribute('opacity', (ramp(t, 16.7, 16.95) * (1 - ramp(t, 40.7, 41.1))).toFixed(3));
  });
  D(18.0, 18.3, SP(WB.roundRectPath(560, 215, 470, 215, 40) + ' M 600 430 L 545 480 L 650 430', INK.black, 6));
  W(18.3, 19.0, 'na minha rua', 795, 300, 62, INK.black);
  W(19.0, 19.9, 'também!', 795, 385, 72, INK.red);
  // carnaval
  D(19.9, 20.8, [SP('M 140 840 Q 230 790 320 840 Q 300 920 230 925 Q 160 920 140 840 Z', INK.purple, 7),
    SP(WB.circlePath(195, 850, 18) + ' ' + WB.circlePath(265, 850, 18), INK.purple, 5),
    SP('M 330 830 l 10 -10 M 360 870 l 12 4 M 120 800 l -8 -10 M 340 800 l 6 -14', INK.orange, 7)]);
  W(20.8, 21.3, 'CARNAVAL', 230, 990, 52, INK.orange);
  // casa para alugar
  D(21.2, 22.0, [SP('M 640 1000 L 640 860 L 760 780 L 880 860 L 880 1000 Z', INK.black, 7),
    SP('M 735 1000 L 735 930 L 785 930 L 785 1000', INK.black, 6)]);
  const alugaSe = WB.group();
  D(22.0, 22.6, [SP(WB.roundRectPath(890, 880, 150, 60, 6), INK.black, 5, alugaSe), SP('M 965 940 L 965 1000', INK.black, 5, alugaSe)]);
  W(22.6, 22.9, 'ALUGA-SE', 965, 920, 30, INK.red, { parent: alugaSe });
  // 5 sacolas
  const bagX = [150, 280, 410, 540, 670];
  const bags = bagX.map((x, i) => {
    const g = WB.group();
    const y = 1130;
    const d = `M ${x - 45} ${y + 55} Q ${x - 55} ${y - 10} ${x - 15} ${y - 22} L ${x - 8} ${y - 50} M ${x + 8} ${y - 50} L ${x + 15} ${y - 22} Q ${x + 55} ${y - 10} ${x + 45} ${y + 55} Z`;
    const t0 = 23.0 + i * 0.7;
    D(t0, t0 + 0.45, [SP(d, BROWN, 6, g), SP(`M ${x - 8} ${y - 50} Q ${x} ${y - 62} ${x + 8} ${y - 50}`, BROWN, 6, g)]);
    W(t0 + 0.45, t0 + 0.65, String(i + 1), x, y + 30, 46, INK.black, { parent: g });
    return { g, x, y };
  });
  // congelador
  D(26.6, 27.2, [SP(WB.roundRectPath(820, 1080, 200, 420, 18), INK.black, 7), SP('M 820 1230 L 1020 1230', INK.black, 6),
    SP('M 840 1150 L 840 1200', INK.black, 8)]);
  W(27.2, 27.5, 'congelador', 920, 1060, 38, INK.blue);
  bags.forEach((b, i) => {
    const t0 = 27.5 + i * 0.22, t1 = t0 + 0.32;
    const tx = 870 + (i % 3) * 50 - b.x, ty = 1150 + Math.floor(i / 3) * 40 - b.y;
    WB.effect((t) => {
      const u = ease(ramp(t, t0, t1));
      const sc = lerp(1, 0.35, u);
      b.g.setAttribute('transform', `translate(${(b.x + tx * u).toFixed(1)} ${(b.y + ty * u - Math.sin(Math.PI * u) * 160).toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${(u * 360).toFixed(1)}) translate(${-b.x} ${-b.y})`);
    });
  });
  // a dona pegou a chave
  D(29.0, 29.8, [SP(WB.circlePath(180, 1330, 30), INK.orange, 7), SP('M 210 1330 L 330 1330 M 300 1330 L 300 1355 M 325 1330 L 325 1350', INK.orange, 7)]);
  W(29.8, 30.6, 'a dona voltou...', 420, 1345, 52, INK.black, { anchor: 'start' });
  carimbo('VIXE!', 520, 1030, 130, INK.red, -10, 33.1, 33.3, 33.8, (t) => 0.18 * win(t, 33.8, 35.5, 0.1) * Math.abs(Math.sin(t * 16)));
  // até carne
  D(34.0, 34.6, [SP('M 600 1460 Q 610 1410 680 1410 Q 750 1412 760 1450 Q 740 1490 680 1492 Q 610 1490 600 1460 Z', '#a33', 7),
    SP('M 630 1450 Q 680 1440 730 1452', '#f3d6c8', 5)]);
  W(34.6, 35.1, 'até carne!', 680, 1560, 48, INK.black);
  // bosta dura (gelo)
  D(35.8, 36.5, SP(WB.roundRectPath(150, 1410, 230, 170, 22), INK.blue, 8));
  D(36.5, 37.0, poop(265, 1520, 0.9));
  D(37.0, 37.3, SP('M 175 1430 L 205 1460 M 340 1430 L 360 1450', '#9fd3ff', 6));
  W(37.3, 37.9, 'BOSTA DURA', 265, 1640, 48, INK.blue);
  // nunca mais alugou
  D(38.4, 38.8, [SP(WB.roughLine(885, 870, 1045, 950, 3), INK.red, 10), SP(WB.roughLine(1045, 870, 885, 950, 3), INK.red, 10)]);
  W(38.8, 39.9, 'NUNCA MAIS!', 830, 1045, 54, INK.red);

  // =====================================================================
  // CENA 3 — O CARA RINDO (40,8 – 74,5 s)  ⇢ exagero máximo
  // =====================================================================
  WB.newPage(3, 0.0, 0.008);
  const HX = 540, HY = 720, HS = 1.35;
  const hOuter = WB.group(WB.overlay, `translate(${HX} ${HY}) scale(${HS})`);
  const h = WB.group(hOuter);
  const pernaE = WB.group(h), pernaD = WB.group(h);
  D(41.0, 42.0, [
    SP(WB.circlePath(0, 0, 115), INK.black, 7, h),
    SP('M -110 -40 L -95 -120 L -60 -90 L -40 -150 L -5 -105 L 20 -160 L 45 -105 L 80 -140 L 85 -80 L 112 -40', INK.black, 7, h),
    SP(WB.circlePath(-120, 5, 22) + ' ' + WB.circlePath(120, 5, 22), INK.black, 6, h),
    SP('M -62 -22 Q -42 -48 -20 -22 M 62 -22 Q 42 -48 20 -22', INK.black, 7, h),
    SP('M -66 -62 Q -42 -80 -18 -64 M 66 -62 Q 42 -80 18 -64', INK.black, 6, h),
    SP('M 2 0 Q 14 18 -2 22', INK.black, 5, h),
    SP('M -95 125 Q -40 115 0 118 Q 40 115 95 125 L 120 330 L -120 330 Z', INK.blue, 7, h),
    SP('M -90 150 Q -200 120 -300 90 M -300 90 L -330 80 M -300 90 L -320 105', INK.black, 8, h),
    SP('M -60 330 L -80 470', INK.black, 9, pernaE), SP('M 60 330 L 80 470', INK.black, 9, pernaD),
  ]);
  const teeth = WB.mk('path', { d: 'M -55 36 L 55 36 L 50 52 L -50 52 Z', fill: '#fff', stroke: INK.black, 'stroke-width': 3 }, h);
  const laughL = (t) => (t < 43.6 ? 0 : (t > 49.6 && t < 52.8) ? 0.55 : (t > 69.6 && t < 72.0) ? 0.6 : 1) * ramp(t, 43.6, 44.0);
  boca(h, 34, (t) => [t > 41.9, t > 41.8, laughL(t)]);
  WB.effect((t) => teeth.setAttribute('opacity', laughL(t) > 0.3 ? 1 : 0));
  // lágrimas de rir voando
  const tears = [];
  for (let i = 0; i < 12; i++) {
    const g = WB.group(h);
    WB.mk('path', { d: 'M 0 -14 Q 10 0 0 8 Q -10 0 0 -14 Z', fill: '#7cc4ff', stroke: '#1d4ed8', 'stroke-width': 2 }, g);
    tears.push({ g, side: i % 2 ? 1 : -1, ph: i / 12 });
  }
  // tombo: cai no chão rolando de rir e depois levanta
  const fall = (t) => ease(ramp(t, 53.6, 54.3)) * (1 - ease(ramp(t, 67.6, 68.6)));
  WB.effect((t) => {
    const L = laughL(t), e = env(t), F = fall(t);
    const amp = L * (0.5 + 0.8 * e);
    const rot = Math.sin(t * 19) * 9 * amp + Math.sin(t * 7) * 4 * L;
    const dx = Math.sin(t * 23) * 12 * amp, dy = -Math.abs(Math.sin(t * 10)) * 35 * amp;
    const sc = 1 + 0.08 * amp;
    h.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(3)})`);
    // deitado: gira -80° e desce; rola de um lado pro outro
    const roll = Math.sin(t * 6) * 18 * F;
    hOuter.setAttribute('transform', `translate(${HX - F * 260} ${HY + F * 430}) scale(${HS}) rotate(${(-82 * F + roll).toFixed(2)})`);
    // pernas chutando quando deitado (e um pouquinho em pé)
    const kick = (0.15 + F) * L;
    pernaE.setAttribute('transform', `rotate(${(Math.sin(t * 21) * 35 * kick).toFixed(1)} -60 330)`);
    pernaD.setAttribute('transform', `rotate(${(Math.sin(t * 21 + 1.6) * 35 * kick).toFixed(1)} 60 330)`);
    tears.forEach((tr) => {
      const tau = (t * 1.6 + tr.ph) % 1;
      const vis = L > 0.3 ? 1 : 0;
      const x = tr.side * (40 + 260 * tau), y = -20 - 180 * tau + 330 * tau * tau;
      tr.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(tr.side * 60 * tau).toFixed(1)})`);
      tr.g.setAttribute('opacity', (vis * (1 - tau)).toFixed(2));
    });
  });
  // textos do cara
  const topo = WB.group();
  W(41.9, 42.7, 'FILHO DE RAPARIG@', 540, 190, 76, INK.black, { parent: topo });
  WB.effect((t) => {
    const k = 0.1 * (win(t, 42.7, 43.4, 0.1) + win(t, 51.0, 52.6, 0.1)) * Math.abs(Math.sin(t * 18));
    topo.setAttribute('transform', `translate(540 165) scale(${(1 + k).toFixed(3)}) translate(-540 -165)`);
  });
  carimbo('MUITO PERVERSO!', 540, 330, 96, INK.red, -6, 43.1, 43.35, 44.1,
    (t) => 0.06 * win(t, 44.1, 74.5, 0.2) * Math.abs(Math.sin(t * 9)) + 0.35 * win(t, 50.1, 51.0, 0.15) * Math.abs(Math.sin(t * 20)));
  // KKKKK pipocando e pulsando
  const ks = [
    [44.3, 'KKKKKK', 170, 560, 92, INK.red, -14], [45.2, 'KKKKKKK', 900, 600, 96, INK.blue, 12],
    [46.1, 'KKKKK', 190, 1080, 104, INK.green, 8], [47.0, 'KKKKKKKK', 870, 1110, 88, INK.orange, -10],
    [48.0, 'KKKKKKK', 860, 1300, 96, INK.purple, 6], [55.0, 'KKKKKKK', 250, 790, 100, INK.red, 16],
    [56.3, 'KKKKKK', 840, 860, 108, INK.green, -12], [58.0, 'KKKKKKK', 230, 1300, 96, INK.blue, -4],
    [62.2, 'KKKKKKKK', 850, 1490, 100, INK.orange, 10], [64.0, 'KKKKKK', 230, 1500, 104, INK.red, -8],
    [72.2, 'KKKKKKKKKK', 540, 1765, 92, INK.red, 0],
  ];
  ks.forEach(([t0, str, x, y, size, color, rot], i) => {
    const outer = WB.group();
    const g = WB.group(outer, `rotate(${rot} ${x} ${y})`);
    W(t0, t0 + 0.45, str, x, y, size, color, { parent: g });
    WB.effect((t) => {
      const on = t >= t0;
      const pop = on ? 1 + 0.5 * Math.exp(-(t - t0 - 0.45) * 6) * (t > t0 + 0.45 ? 1 : 0) : 1;
      const k = on ? (pop + 0.1 * Math.abs(Math.sin(t * 13 + i)) * laughL(t)) : 1;
      outer.setAttribute('transform', `translate(${x} ${y}) scale(${k.toFixed(3)}) translate(${-x} ${-y})`);
    });
  });
  // linhas de impacto em volta da cabeça
  const raios = WB.group();
  let rd = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r1 = 230, r2 = 300;
    rd += `M ${(HX + Math.cos(a) * r1).toFixed(0)} ${(HY + Math.sin(a) * r1).toFixed(0)} L ${(HX + Math.cos(a) * r2).toFixed(0)} ${(HY + Math.sin(a) * r2).toFixed(0)} `;
  }
  D(44.0, 44.3, SP(rd, INK.orange, 7, raios));
  WB.effect((t) => raios.setAttribute('opacity', (laughL(t) * (1 - fall(t)) * (0.5 + 0.5 * Math.abs(Math.sin(t * 11)))).toFixed(2)));
  // "a mulher descongelando" — o gelo derretendo
  const gelo = WB.group();
  D(69.4, 69.9, SP(WB.roundRectPath(425, 1390, 230, 170, 22), INK.blue, 8, gelo));
  D(69.9, 70.3, poop(540, 1500, 0.9, gelo));
  W(70.3, 71.3, 'descongelando...', 540, 1625, 50, INK.blue, { parent: gelo });
  const gotas = [0, 1, 2].map((i) => {
    const g = WB.mk('path', { d: 'M 0 -12 Q 9 0 0 7 Q -9 0 0 -12 Z', fill: '#7cc4ff', stroke: '#1d4ed8', 'stroke-width': 2 }, gelo);
    return { g, x: 465 + i * 75, ph: i * 0.33 };
  });
  WB.effect((t) => gotas.forEach((d) => {
    const tau = (t * 1.2 + d.ph) % 1;
    d.g.setAttribute('transform', `translate(${d.x} ${1565 + tau * 40})`);
    d.g.setAttribute('opacity', t > 70.3 ? (1 - tau).toFixed(2) : 0);
  }));
  WB.restHand(3, (72.9 - 40.8) / 33.7, 0.999);
};
