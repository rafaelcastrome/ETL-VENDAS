// Meme "Fique solteiro" — cenas PRONTAS (projeto.semMao), estilo Caderno Amarelo, sincronizadas com o áudio viral.
// A irmã mais velha dá o conselho e a caçula (a mesma do meme do docinho) imita tudo com atraso.
// Tempos em segundos absolutos do áudio. Bocas seguem o volume (window.ENVELOPE, 30/s).
window.CENAS = function (WB) {
  const { INK } = WB;
  const clamp = WB.clamp, ease = WB.ease, lerp = WB.lerp;
  const env = (t) => (window.ENVELOPE[Math.floor(t * 30)] || 0);
  const ramp = (t, a, b) => clamp((t - a) / (b - a));
  const inn = (t, a, b) => t >= a && t < b;
  const SKIN = '#f6d2b4', SKIN2 = '#eeb092', HAIR_P = '#5a3d2b', HAIR_F = '#7a4a2a';
  const SHIRT = '#5b8fd6', DRESS = '#f472b6', PANTS = '#4b5563', MOUTH = '#7a1f1f';
  const L = WB.overlay;
  const ink = (d, c, w, p, a) => WB.ink(d, c, w, p, a);
  const shape = (d, fill, p, w = 6) => WB.mk('path', { d, fill, stroke: INK.black, 'stroke-width': w, 'stroke-linejoin': 'round' }, p);
  const circ = (cx, cy, r, fill, p, w = 6) => WB.mk('circle', { cx, cy, r, fill, stroke: w ? INK.black : 'none', 'stroke-width': w }, p);
  const ell = (cx, cy, rx, ry, fill, p, w = 6) => WB.mk('ellipse', { cx, cy, rx, ry, fill, stroke: w ? INK.black : 'none', 'stroke-width': w }, p);
  const limb = (d, color, w, p) => { const g = WB.group(p); ink(d, INK.black, w + 11, g); ink(d, color, w, g); return g; };
  const E = (cx, cy, rx, ry) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
  const show = (el, on) => { el.style.display = on ? '' : 'none'; };
  const tf = (g, x, y, s = 1, r = 0) => g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(3)})`);
  const shake = (t, a, f = 40) => ({ x: Math.sin(t * f) * a + Math.sin(t * f * 1.7) * a * 0.5, y: Math.cos(t * f * 1.3) * a });
  const back = u => { const c = 2.2; return u >= 1 ? 1 : 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };

  // ---------------------------------------------------------------- bocas
  // mode(t) -> { type: 'talk'|'grin'|'scream'|'rage'|'frown'|'creep'|'flat'|'wavy', talk: bool, min: 0..1 }
  function mouth(parent, cy, w, mode) {
    const g = WB.group(parent);
    const m = WB.mk('path', { d: '', fill: MOUTH, stroke: INK.black, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    const tongue = WB.mk('path', { d: '', fill: '#e86a7a' }, g);
    const teeth = WB.mk('path', { d: '', fill: '#fff', stroke: INK.black, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const line = ink('', INK.black, 7, g);
    WB.effect((t) => {
      const md = mode(t) || { type: 'flat' };
      const o = Math.max(md.min || 0, md.talk ? clamp((env(t) - 0.06) * 1.5) : 0);
      let d = '', td = '', tg = '', ld = '';
      const W = w;
      if (md.type === 'talk') {
        const rx = W * 0.42 + W * 0.18 * o, ry = 4 + W * 0.5 * o;
        d = E(0, cy, rx, ry);
        if (o > 0.25) tg = E(0, cy + ry * 0.5, rx * 0.55, ry * 0.35);
      } else if (md.type === 'grin' || md.type === 'creep') {
        const dep = W * (md.type === 'creep' ? 0.38 : 0.55) + W * 0.45 * o, wd = W * (md.type === 'creep' ? 1.15 : 0.9);
        d = `M ${-wd} ${cy} Q 0 ${cy + W * 0.25} ${wd} ${cy} Q ${wd * 0.75} ${cy + dep} 0 ${cy + dep} Q ${-wd * 0.75} ${cy + dep} ${-wd} ${cy} Z`;
        const th = Math.min(dep * 0.4, W * 0.32);
        td = `M ${-wd * 0.86} ${cy + 3} Q 0 ${cy + W * 0.25 + 3} ${wd * 0.86} ${cy + 3} L ${wd * 0.76} ${cy + th} Q 0 ${cy + W * 0.25 + th} ${-wd * 0.76} ${cy + th} Z`;
        if (md.type === 'creep') for (let i = -3; i <= 3; i++) td += ` M ${i * wd * 0.22} ${cy + W * 0.25 - Math.abs(i) * 4} L ${i * wd * 0.22} ${cy + th + W * 0.2 - Math.abs(i) * 5}`;
        if (dep > W * 0.6) tg = E(0, cy + dep * 0.78, wd * 0.4, dep * 0.16);
      } else if (md.type === 'scream') {
        const rx = W * 0.55 + W * 0.15 * o, ry = W * 0.55 + W * 0.55 * o;
        d = E(0, cy + ry * 0.45, rx, ry);
        tg = E(0, cy + ry * 1.1, rx * 0.6, ry * 0.3);
        td = `M ${-rx * 0.6} ${cy - ry * 0.45} Q 0 ${cy - ry * 0.62} ${rx * 0.6} ${cy - ry * 0.45} L ${rx * 0.5} ${cy - ry * 0.28} Q 0 ${cy - ry * 0.4} ${-rx * 0.5} ${cy - ry * 0.28} Z`;
      } else if (md.type === 'rage') {
        const hh = W * 0.25 + W * 0.45 * o, wd = W * 0.95;
        d = `M ${-wd} ${cy - hh} Q 0 ${cy - hh - 14} ${wd} ${cy - hh} L ${wd * 0.85} ${cy + hh} Q 0 ${cy + hh + 10} ${-wd * 0.85} ${cy + hh} Z`;
        const n = 7;
        let up = `M ${-wd} ${cy - hh}`, dn = `M ${-wd * 0.85} ${cy + hh}`;
        for (let i = 0; i <= n; i++) {
          const x = -wd + (2 * wd) * i / n, x2 = -wd * 0.85 + (1.7 * wd) * i / n;
          up += ` L ${x} ${cy - hh} ${i < n ? `L ${x + wd / n} ${cy - hh + hh * 0.75}` : ''}`;
          dn += ` L ${x2} ${cy + hh} ${i < n ? `L ${x2 + 0.85 * wd / n} ${cy + hh - hh * 0.75}` : ''}`;
        }
        td = up + ` L ${wd} ${cy - hh} Z ` + dn + ` L ${wd * 0.85} ${cy + hh} Z`;
      } else if (md.type === 'frown') {
        const op = W * 0.25 * o;
        if (o > 0.15) d = `M ${-W * 0.55} ${cy + 10} Q 0 ${cy - 22 - op} ${W * 0.55} ${cy + 10} Q 0 ${cy + op} ${-W * 0.55} ${cy + 10} Z`;
        else ld = `M ${-W * 0.55} ${cy + 10} Q 0 ${cy - 18} ${W * 0.55} ${cy + 10}`;
      } else if (md.type === 'wavy') {
        ld = `M ${-W * 0.6} ${cy} q ${W * 0.15} -12 ${W * 0.3} 0 t ${W * 0.3} 0 t ${W * 0.3} 0 t ${W * 0.3} 0`;
      } else if (md.type === 'smile') {
        ld = `M ${-W * 0.55} ${cy - 6} Q 0 ${cy + W * 0.45} ${W * 0.55} ${cy - 6}`;
      } else {
        ld = `M ${-W * 0.45} ${cy} L ${W * 0.45} ${cy}`;
      }
      m.setAttribute('d', d); tongue.setAttribute('d', tg); teeth.setAttribute('d', td); line.setAttribute('d', ld);
    });
    return g;
  }

  // ---------------------------------------------------------------- acessórios
  function pirulito(parent, x, y, r, stick = 2.6) {
    const g = WB.group(parent, `translate(${x} ${y})`);
    ink(`M 0 ${r * 0.8} L 0 ${r * stick}`, INK.black, 18, g); ink(`M 0 ${r * 0.8} L 0 ${r * stick}`, '#fffaf0', 10, g);
    circ(0, 0, r, '#fff6f8', g, 7);
    let d = 'M 0 0'; for (let a = 0; a < Math.PI * 7; a += 0.2) { const rr = r * 0.92 * a / (Math.PI * 7); d += ` L ${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`; }
    ink(d, '#e63946', r * 0.17, g);
    ink(d, '#ffb703', r * 0.05, g, { transform: 'rotate(40)' });
    return g;
  }
  function pote(parent, x, y, s = 1) {
    const g = WB.group(parent, `translate(${x} ${y}) scale(${s})`);
    const doces = WB.group(g);
    [['#e63946', -55, -55], ['#ffb703', 0, -70], ['#2a9d8f', 50, -52], ['#8338ec', -25, -95], ['#fb5607', 30, -100]].forEach(([c, dx, dy], i) => {
      const dg = WB.group(doces, `translate(${dx} ${dy})`);
      if (i % 2) { shape('M -26 0 L -40 -14 L -40 14 Z M 26 0 L 40 -14 L 40 14 Z', c, dg, 4); ell(0, 0, 28, 20, c, dg, 5); }
      else { circ(0, 0, 25, c, dg, 5); ink('M -12 -8 Q 0 -16 10 -6', '#fff', 5, dg); }
    });
    shape('M -100 -50 L 100 -50 Q 100 60 0 70 Q -100 60 -100 -50 Z', '#bfe3fb', g);
    ink('M -70 -30 Q -72 20 -40 45', '#ffffff', 8, g);
    shape('M -30 68 L -22 100 L 22 100 L 30 68 Z M -60 100 L 60 100 L 60 116 L -60 116 Z', '#bfe3fb', g, 5);
    return { g, doces };
  }
  function brilho(parent, x, y, s, color = '#ffb703') {
    const g = WB.group(parent, `translate(${x} ${y}) scale(${s})`);
    shape('M 0 -40 Q 6 -6 40 0 Q 6 6 0 40 Q -6 6 -40 0 Q -6 -6 0 -40 Z', color, g, 4);
    return g;
  }
  function coracao(parent, x, y, s, color = '#e63946') {
    const g = WB.group(parent, `translate(${x} ${y}) scale(${s})`);
    shape('M 0 30 C -50 -5 -40 -45 0 -20 C 40 -45 50 -5 0 30 Z', color, g, 5);
    return g;
  }
  function estrela(parent, x, y, s, color = '#ffd60a') {
    const g = WB.group(parent, `translate(${x} ${y}) scale(${s})`);
    let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 16 : 38; d += `${i ? 'L' : 'M'} ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} `; }
    shape(d + 'Z', color, g, 5);
    return g;
  }
  function explosao(parent, x, y, s, label, size = 90, fill = '#ffe066', color = INK.red) {
    const g = WB.group(parent, `translate(${x} ${y})`);
    const inner = WB.group(g, `scale(${s})`);
    let d = ''; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, r = i % 2 ? 105 : 165 + (i % 4) * 12; d += `${i ? 'L' : 'M'} ${(Math.cos(a) * r * 1.25).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} `; }
    shape(d + 'Z', fill, inner, 8);
    WB.text(label, 0, size * 0.34, size, color, inner);
    return g;
  }
  // entra com pulo em t0 e some em t1 (opcional: tremor contínuo)
  function popIn(g, t0, t1, cx, cy, opts = {}) {
    const inner = WB.group(g.parentNode);
    inner.appendChild(g);
    WB.effect((t) => {
      if (t < t0 || t >= t1) { inner.style.display = 'none'; return; }
      inner.style.display = '';
      const u = clamp((t - t0) / (opts.dur || 0.22));
      const k = back(u) * (opts.pulse ? 1 + opts.pulse * Math.abs(Math.sin(t * 9)) : 1);
      const sh = opts.shake ? shake(t, opts.shake) : { x: 0, y: 0 };
      const r = (opts.rot || 0) * (1 - u) + (opts.wobble ? Math.sin(t * 12) * opts.wobble : 0);
      inner.setAttribute('transform', `translate(${(cx + sh.x).toFixed(1)} ${(cy + sh.y).toFixed(1)}) rotate(${r.toFixed(2)}) scale(${Math.max(0.001, k).toFixed(3)}) translate(${-cx} ${-cy})`);
    });
    return inner;
  }

  // ---------------------------------------------------------------- FILHA
  // o: { eyes(t): 'normal'|'candy'|'happy'|'smug'|'deadpan'|'angry'|'fire'|'scream', mouth(t), look(t),
  //      armR(t), armL(t), legR(t), legL(t), red(t) 0..1, vein(t) bool, steam(t) bool, halo(t) bool, twitch(t) }
  function filha(parent, o) {
    const root = WB.group(parent);
    const body = WB.group(root);
    const leg = (side) => {
      const g = WB.group(body, `translate(${side * 34} 318)`);
      limb('M 0 0 L 0 105', SKIN, 16, g);
      shape(E(side * 10, 112, 26, 14), '#9b2226', g);
      return g;
    };
    const lR = leg(1), lL = leg(-1);
    const arm = (side) => {
      const g = WB.group(body);
      limb('M 0 0 L 0 110', SKIN, 16, g);
      const hand = WB.group(g, 'translate(0 122)');
      circ(0, 0, 17, SKIN, hand);
      const finger = WB.group(hand); limb('M 0 6 L 0 46', SKIN, 9, finger);
      const bent = WB.group(body);
      const bp = [ink('', INK.black, 27, bent), ink('', SKIN, 16, bent)];
      const bh = WB.group(bent); circ(0, 0, 17, SKIN, bh);
      return { g, side, finger, bent, bp, bh };
    };
    const aR = arm(1), aL = arm(-1);
    shape('M -100 330 L -62 150 Q 0 120 62 150 L 100 330 Q 0 345 -100 330 Z', o.estilo === 'irma' ? '#d9ccf5' : DRESS, body);
    if (o.estilo === 'irma') {
      for (let y = 168; y < 330; y += 26) { const dx = 62 + 38 * (y - 150) / 180; ink(`M ${-dx + 6} ${y} L ${dx - 6} ${y}`, '#7a62c9', 6, body); }
      ink('M -40 150 L -46 118 M 40 150 L 46 118', '#f9a8b8', 8, body);
    } else ink('M -88 300 Q 0 318 88 300', '#fff', 6, body);
    // cabeça
    const head = WB.group(root);
    const pig = (side) => {
      shape(E(side * 128, 10, 44, 56), HAIR_F, head);
      shape(`M ${side * 92} -58 L ${side * 132} -86 L ${side * 128} -34 Z M ${side * 92} -58 L ${side * 54} -92 L ${side * 62} -36 Z`, '#e63946', head, 5);
      circ(side * 92, -60, 11, '#e63946', head, 5);
    };
    if (o.estilo === 'irma') {
      shape('M -112 -10 Q -138 120 -112 215 Q -60 238 -36 200 L 36 200 Q 60 238 112 215 Q 138 120 112 -10 Z', HAIR_F, head);
      for (let i = 0; i < 5; i++) shape(E(112, 150 + i * 40, 22, 24), HAIR_F, head, 5);
      circ(112, 352, 10, '#e63946', head, 4);
    } else { pig(1); pig(-1); }
    const face = shape(E(0, 0, 104, 100), SKIN, head, 7);
    const red = WB.mk('path', { d: E(0, 0, 100, 96), fill: '#e5383b', opacity: 0 }, head);
    if (o.estilo === 'irma') shape('M -104 0 Q -112 -104 0 -106 Q 112 -104 104 0 Q 92 -64 30 -64 Q -40 -60 -104 0 Z', HAIR_F, head);
    else shape('M -104 0 Q -112 -104 0 -106 Q 112 -104 104 0 Q 84 -52 46 -50 Q 18 -74 -14 -50 Q -56 -64 -104 0 Z', HAIR_F, head);
    const oculos = WB.group(head);
    shape('M -82 -10 L -6 -10 Q -8 38 -44 40 Q -80 38 -82 -10 Z M 6 -10 L 82 -10 Q 80 38 44 40 Q 8 38 6 -10 Z', '#111', oculos, 5);
    ink('M -6 -4 Q 0 -10 6 -4 M -82 -6 L -100 2 M 82 -6 L 100 2', INK.black, 6, oculos);
    ink('M -66 2 L -48 24 M 22 2 L 40 24', '#ffffff', 5, oculos);
    ell(-62, 46, 20, 12, '#f9a8b8', head, 0); ell(62, 46, 20, 12, '#f9a8b8', head, 0);
    const eyes = {};
    eyes.normal = WB.group(head);
    ell(-38, 8, 25, 31, '#fff', eyes.normal); ell(38, 8, 25, 31, '#fff', eyes.normal);
    const pupils = WB.group(eyes.normal);
    circ(-38, 12, 14, INK.black, pupils, 0); circ(38, 12, 14, INK.black, pupils, 0);
    circ(-33, 6, 5, '#fff', pupils, 0); circ(43, 6, 5, '#fff', pupils, 0);
    eyes.candy = WB.group(head);
    const spins = [];
    for (const sx of [-40, 40]) {
      const sg = WB.group(eyes.candy, `translate(${sx} 8)`);
      circ(0, 0, 34, '#fff', sg, 6);
      const sp = WB.group(sg);
      let d = 'M 0 0'; for (let a = 0; a < Math.PI * 6; a += 0.2) { const r = 30 * a / (Math.PI * 6); d += ` L ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }
      ink(d, '#e63946', 7, sp);
      spins.push(sp);
    }
    eyes.happy = WB.group(head);
    ink('M -62 16 Q -38 -14 -14 16 M 14 16 Q 38 -14 62 16', INK.black, 8, eyes.happy);
    eyes.smug = WB.group(head);
    ink('M -62 6 Q -38 26 -14 6 M 14 6 Q 38 26 62 6', INK.black, 8, eyes.smug);
    ink('M -66 -26 Q -40 -44 -14 -30 M 14 -24 Q 40 -36 66 -22', INK.black, 7, eyes.smug);
    eyes.deadpan = WB.group(head);
    ell(-38, 10, 25, 26, '#fff', eyes.deadpan); ell(38, 10, 25, 26, '#fff', eyes.deadpan);
    circ(-38, 20, 11, INK.black, eyes.deadpan, 0); circ(38, 20, 11, INK.black, eyes.deadpan, 0);
    shape('M -64 10 Q -38 -24 -12 10 Z M 12 10 Q 38 -24 64 10 Z', SKIN, eyes.deadpan, 6);
    const twitchLid = ink('M -66 10 L -10 10', INK.black, 7, eyes.deadpan);
    eyes.angry = WB.group(head);
    ell(-38, 12, 27, 27, '#fff', eyes.angry); ell(38, 12, 27, 27, '#fff', eyes.angry);
    circ(-34, 16, 8, INK.black, eyes.angry, 0); circ(34, 16, 8, INK.black, eyes.angry, 0);
    ink('M -74 -32 L -12 -6 M 74 -32 L 12 -6', INK.black, 13, eyes.angry);
    ink('M -60 30 L -52 38 M 60 30 L 52 38', INK.red, 3, eyes.angry);
    eyes.fire = WB.group(head);
    for (const sx of [-38, 38]) {
      ell(sx, 12, 30, 30, '#fff', eyes.fire);
      shape(`M ${sx - 20} 32 Q ${sx - 26} 4 ${sx - 10} -14 Q ${sx - 8} 2 ${sx} -24 Q ${sx + 10} -2 ${sx + 16} -12 Q ${sx + 28} 10 ${sx + 20} 32 Z`, '#fb5607', eyes.fire, 3);
      shape(`M ${sx - 10} 32 Q ${sx - 12} 14 ${sx - 2} 4 Q ${sx + 2} 14 ${sx + 8} 8 Q ${sx + 14} 20 ${sx + 10} 32 Z`, '#ffd60a', eyes.fire, 0);
    }
    ink('M -78 -36 L -12 -8 M 78 -36 L 12 -8', INK.black, 14, eyes.fire);
    eyes.scream = WB.group(head);
    ink('M -64 -10 L -18 8 L -64 26 M 64 -10 L 18 8 L 64 26', INK.black, 9, eyes.scream);
    mouth(head, 58, 34, o.mouth);
    const vein = WB.group(head, 'translate(66 -74)');
    ink('M -16 -6 Q -4 -6 -4 -18 M 16 -6 Q 4 -6 4 -18 M -16 6 Q -4 6 -4 18 M 16 6 Q 4 6 4 18', INK.red, 7, vein);
    const steam = WB.group(head);
    const puffs = [];
    for (let i = 0; i < 6; i++) { const p = WB.group(steam); shape(WB.cloudPath(0, 0, 34, 24, 7), '#ffffff', p, 5); puffs.push(p); }
    const halo = WB.group(head);
    ell(0, -150, 80, 18, 'none', halo, 0);
    WB.mk('ellipse', { cx: 0, cy: -150, rx: 80, ry: 18, fill: 'none', stroke: '#f4c430', 'stroke-width': 12 }, halo);
    const tears = WB.group(head);
    for (let i = 0; i < 6; i++) shape(`M 0 -14 Q 12 0 0 10 Q -12 0 0 -14 Z`, '#9ad0f5', WB.group(tears), 3);

    WB.effect((t) => {
      const em = o.eyes ? o.eyes(t) : 'normal';
      for (const k in eyes) show(eyes[k], k === em);
      const lk = o.look ? o.look(t) : { x: 0, y: 0 };
      pupils.setAttribute('transform', `translate(${lk.x} ${lk.y})`);
      spins.forEach((s, i) => s.setAttribute('transform', `rotate(${((i ? -1 : 1) * t * 540 % 360).toFixed(1)})`));
      const tw = o.twitch ? o.twitch(t) : 0;
      twitchLid.style.display = tw && Math.sin(t * 40) > 0 ? '' : 'none';
      red.setAttribute('opacity', ((o.red ? o.red(t) : 0) * 0.6).toFixed(3));
      const vn = o.vein ? o.vein(t) : 0;
      vein.style.display = vn ? '' : 'none';
      vein.setAttribute('transform', `translate(66 -74) scale(${(1 + 0.3 * Math.abs(Math.sin(t * 10))).toFixed(2)})`);
      const st = o.steam ? o.steam(t) : 0;
      steam.style.display = st ? '' : 'none';
      puffs.forEach((p, i) => {
        const side = i % 2 ? 1 : -1, ph = ((t * 1.8 + i * 0.37) % 1);
        p.setAttribute('transform', `translate(${side * (120 + ph * 60)} ${(-60 - ph * 170).toFixed(1)}) scale(${(0.5 + ph).toFixed(2)})`);
        p.setAttribute('opacity', (1 - ph).toFixed(2));
      });
      halo.style.display = o.halo && o.halo(t) ? '' : 'none';
      halo.setAttribute('transform', `translate(0 ${(Math.sin(t * 4) * 8).toFixed(1)})`);
      const tr = o.tears ? o.tears(t) : 0;
      tears.style.display = tr ? '' : 'none';
      [...tears.children].forEach((d, i) => {
        const side = i % 2 ? 1 : -1, ph = ((t * 3 + i * 0.29) % 1);
        d.setAttribute('transform', `translate(${side * (50 + ph * 190)} ${(10 - 80 * ph + 160 * ph * ph).toFixed(1)})`);
      });
      for (const a of [aR, aL]) {
        const fn = a === aR ? o.armR : o.armL, ang = fn ? fn(t) : 15;
        a.g.setAttribute('transform', `translate(${a.side * 58} 160) rotate(${(-a.side * ang).toFixed(2)})`);
        show(a.finger, !!(o.finger && o.finger(t, a.side)));
        const b = o.bent ? o.bent(t, a.side) : null;
        show(a.g, !b); show(a.bent, !!b);
        if (b) {
          const d = `M ${a.side * 58} 160 L ${b[0]} ${b[1]} L ${b[2]} ${b[3]}`;
          a.bp.forEach(p => p.setAttribute('d', d));
          a.bh.setAttribute('transform', `translate(${b[2]} ${b[3]})`);
        }
      }
      const oc = o.oculos ? o.oculos(t) : -1;
      show(oculos, oc >= 0);
      if (oc >= 0) oculos.setAttribute('transform', `translate(0 ${(oc < 1 ? -300 * (1 - oc) : (oc - 1) * 60).toFixed(1)})`);
      lR.setAttribute('transform', `translate(34 318) rotate(${(o.legR ? -o.legR(t) : 0).toFixed(1)})`);
      lL.setAttribute('transform', `translate(-34 318) rotate(${(o.legL ? o.legL(t) : 0).toFixed(1)})`);
    });
    return { root, head, body };
  }

  // ---------------------------------------------------------------- palco
  const palco = WB.group(L);
  shape('M -20 1585 L 1100 1585 L 1100 1940 L -20 1940 Z', '#d9b38c', palco, 7);
  for (let i = 0; i < 5; i++) ink(`M -20 ${1640 + i * 62} L 1100 ${1640 + i * 62}`, '#b88a5e', 4, palco);
  WB.mk('ellipse', { cx: 350, cy: 1590, rx: 230, ry: 40, fill: '#fff6c9', opacity: 0.8 }, palco);
  WB.mk('ellipse', { cx: 790, cy: 1615, rx: 170, ry: 32, fill: '#fff6c9', opacity: 0.8 }, palco);

  // ---------------------------------------------------------------- poses
  // braços dobrados em coordenadas do corpo (ombro em ±58,160)
  const BENT = {
    hips: (s) => [s * 128, 238, s * 64, 294],
    head: (s) => [s * 150, 40, s * 72, -92],
    belly: (s) => [s * 118, 250, s * 28, 256],
  };
  function poseAt(t) {
    if (t < 1.4) return 'down';
    if (t < 2.35) return 'up';
    if (t < 3.85) return 'wag';
    if (t < 4.85) return 'open';
    if (t < 7.25) return 'head';
    if (t < 10.5) return 'hips';
    return 'laugh';
  }
  // a caçula copia tudo com atraso (e às vezes com o braço errado)
  const LAG = 0.35;
  function opcoes(quem) {
    const tp = (t) => quem === 'irma' ? t : t - LAG;
    const p = (t) => poseAt(tp(t));
    return {
      estilo: quem === 'irma' ? 'irma' : undefined,
      armR: (t) => { const q = p(t);
        if (q === 'up') return (quem === 'irma' ? 115 : 150) + Math.sin(t * 9) * 10;
        if (q === 'wag') return quem === 'irma' ? 165 + Math.sin(t * 14) * 12 : 15;
        if (q === 'open') return 70;
        if (q === 'laugh' && quem !== 'irma') return 160 + Math.sin(t * 22) * 25;
        return 15; },
      armL: (t) => { const q = p(t);
        if (q === 'up') return (quem === 'irma' ? 115 : 150) + Math.sin(t * 9 + 1) * 10;
        if (q === 'wag') return quem === 'irma' ? 15 : 165 + Math.sin(t * 14) * 12;
        if (q === 'open') return 70;
        if (q === 'laugh' && quem !== 'irma') return 160 + Math.sin(t * 22 + 2) * 25;
        return 15; },
      finger: (t, side) => p(t) === 'wag' && (quem === 'irma' ? side === 1 : side === -1),
      bent: (t, side) => { const q = p(t);
        if (q === 'hips' || q === 'head') return BENT[q](side);
        if (q === 'laugh' && quem === 'irma') return BENT.belly(side);
        return null; },
      eyes: (t) => { const q = p(t);
        if (q === 'head') return 'scream';
        if (q === 'hips') return 'smug';
        if (q === 'laugh') return 'happy';
        return 'normal'; },
      look: () => ({ x: quem === 'irma' ? 6 : -6, y: 0 }),
      mouth: (t) => {
        if (t >= 10.5) return { type: 'grin', talk: true, min: 0.35 };
        if (quem === 'irma' && t >= 1.3 && t < 9.0) return { type: 'talk', talk: true };
        if (quem !== 'irma' && t >= 7.3 && t < 9.0) return { type: 'talk', talk: true };
        if (t >= 9.0) return { type: 'flat' };
        return { type: 'smile' };
      },
      oculos: (t) => {
        if (t < 8.95) return -1;
        if (quem === 'irma') return t < 10.5 ? ramp(t, 8.95, 9.2) : t < 10.8 ? 1 + 0.4 * ramp(t, 10.5, 10.65) : -1;
        return t < 11.0 ? ramp(t, 9.05, 9.3) : -1;
      },
      legR: (t) => quem !== 'irma' && t > 10.7 ? Math.sin(t * 22) * 40 : 0,
      legL: (t) => quem !== 'irma' && t > 10.7 ? Math.sin(t * 22 + Math.PI) * 40 : 0,
    };
  }
  const gI = WB.group(L), gC = WB.group(L);
  filha(gI, opcoes('irma'));
  filha(gC, opcoes('cacula'));
  WB.effect((t) => {
    const talk = t >= 1.3 && t < 9 ? env(t) : 0;
    // irmã: dança enquanto fala, rindo se dobra
    if (t < 10.5) tf(gI, 350, 1000 - Math.abs(Math.sin(t * 6)) * 14 * talk, 1.3, Math.sin(t * 5) * 3 * talk);
    else tf(gI, 350, 1000 + Math.abs(Math.sin(t * 9)) * 18, 1.3, 8 + Math.sin(t * 9) * 7);
    // caçula: imita, depois sai correndo e rindo pelo palco
    const tc = t - LAG;
    if (t < 10.7) tf(gC, 790, 1180 - Math.abs(Math.sin(tc * 6)) * 12 * (tc > 1.3 && tc < 9 ? 1 : 0), 1.0, Math.sin(tc * 5) * 4 * (tc > 1.3 && tc < 9 ? 1 : 0));
    else {
      const u = (t - 10.7) * 1.1, x = 830 + Math.sin(u * 2.4) * 130;
      const dir = Math.cos(u * 2.4) >= 0 ? 1 : -1;
      gC.setAttribute('transform', `translate(${x.toFixed(1)} ${(1180 - Math.abs(Math.sin(t * 11)) * 40).toFixed(1)}) scale(${dir} 1)`);
    }
  });

  // ---------------------------------------------------------------- piadas visuais
  const fx = WB.group(L);
  // problemas: nuvem de tempestade
  {
    const g = WB.group(fx);
    for (let i = 0; i < 5; i++) ink(`M ${450 + i * 45} 700 l -14 46`, '#4f8fd6', 7, g);
    shape(WB.cloudPath(540, 620, 160, 80, 9), '#9aa3b2', g, 7);
    shape('M 560 650 L 520 730 L 556 726 L 530 800 L 610 700 L 572 704 L 600 650 Z', '#ffd60a', g, 5);
    popIn(g, 3.85, 4.85, 540, 640, { shake: 3 });
  }
  // dor de cabeça: raiozinhos ao redor das cabeças
  [[170, 820, -20], [530, 830, 20], [930, 1060, 15], [650, 1050, -15]].forEach(([x, y, r], i) => {
    const g = WB.group(fx, `translate(${x} ${y}) rotate(${r})`);
    shape('M -10 -40 L 14 -6 L -4 -2 L 12 40 L -18 0 L 0 -4 Z', '#ffd60a', g, 4);
    popIn(g, 4.95 + i * 0.12 + (i > 1 ? LAG : 0), 7.25 + (i > 1 ? LAG : 0), x, y, { pulse: 0.25 });
  });
  // fique solteiro: coração partido + brilhos
  {
    const g = WB.group(fx);
    const c = WB.group(g, 'translate(540 640) scale(2.6)');
    const a = WB.group(c), b = WB.group(c);
    shape('M 0 30 C -50 -5 -40 -45 0 -20 L -8 -4 L 4 8 L -4 20 Z', '#e63946', a, 3);
    shape('M 0 30 C 50 -5 40 -45 0 -20 L -8 -4 L 4 8 L -4 20 Z', '#e63946', b, 3);
    WB.effect((t) => {
      const u = ramp(t, 8.1, 8.4);
      a.setAttribute('transform', `translate(${-u * 14} ${u * 4}) rotate(${-u * 16})`);
      b.setAttribute('transform', `translate(${u * 14} ${u * 4}) rotate(${u * 16})`);
    });
    popIn(g, 7.35, 10.5, 540, 640, { float: 0 });
    [[200, 560], [880, 560], [150, 760], [930, 780]].forEach(([x, y], i) => popIn(brilho(fx, x, y, 1.1), 7.4 + i * 0.08, 10.5, x, y, { pulse: 0.3 }));
  }
  // etiqueta das "coaches" durante a pausa
  {
    const g = WB.group(fx);
    shape(WB.roundRectPath(70, 1650, 940, 150, 30), '#fffdf6', g, 7);
    WB.mk('rect', { x: 70, y: 1650, width: 22, height: 150, fill: '#7a62c9' }, g);
    WB.text('Coaches de relacionamento', 555, 1718, 66, INK.black, g);
    WB.text('experiência: 0 namoros', 555, 1778, 50, INK.red, g);
    popIn(g, 9.2, 99, 540, 1725, { rot: -4 });
  }
  // KKKK
  [[200, 640, -12], [860, 600, 10], [540, 520, 0], [160, 900, 8], [920, 900, -8], [540, 760, 5]].forEach(([x, y, r], i) => {
    const g = WB.group(fx, `rotate(${r} ${x} ${y})`);
    WB.text('KKKK', x, y + 30, 90 - (i % 3) * 12, i % 2 ? INK.red : '#7a62c9', g);
    popIn(g, 10.6 + i * 0.25, 99, x, y, { pulse: 0.15, wobble: 5 });
  });

  // ---------------------------------------------------------------- cortinas (o "show" começa)
  const cort = WB.group(L);
  const painel = (side) => {
    const g = WB.group(cort);
    const x0 = side < 0 ? -10 : 540, x1 = side < 0 ? 545 : 1090;
    shape(`M ${x0} 0 L ${x1} 0 L ${x1} 1600 Q ${(x0 + x1) / 2} 1630 ${x0} 1600 Z`, '#b5172b', g, 7);
    for (let i = 1; i < 6; i++) { const x = x0 + (x1 - x0) * i / 6; ink(`M ${x} 140 Q ${x + 14} 800 ${x - 6} 1600`, '#8a0f20', 8, g); }
    return g;
  };
  const pE = painel(-1), pD = painel(1);
  const sanefa = WB.group(L);
  let sd = 'M -10 0 L 1090 0 L 1090 130'; for (let i = 6; i >= 0; i--) sd += ` Q ${i * 180 + 90} 200 ${i * 180} 130`;
  shape(sd + ' Z', '#8a0f20', sanefa, 7);
  for (let i = 0; i < 6; i++) circ(i * 180 + 90, 165, 12, '#f4c430', sanefa, 4);
  WB.effect((t) => {
    const u = ease(ramp(t, 0.55, 1.35));
    const wig = t > 0.35 && t < 0.6 ? Math.sin(t * 60) * 10 : 0;
    pE.setAttribute('transform', `translate(${(-560 * u + wig).toFixed(1)} 0)`);
    pD.setAttribute('transform', `translate(${(560 * u + wig).toFixed(1)} 0)`);
    cort.style.display = u >= 1 ? 'none' : '';
  });

  // ---------------------------------------------------------------- legendas
  const capLayer = WB.group(L);
  function fala(t0, t1, lines, color, opts = {}) {
    const size = opts.size || 100, y0 = opts.y || 320;
    lines.forEach((str, i) => {
      const lg = WB.group(capLayer), y = y0 + i * size * 1.02;
      const halo = WB.textStrokes(str, 540, y, size, '#fffaf0', lg, 'middle');
      WB.showNow(halo.strokes);
      for (const s of halo.strokes) { s.el.setAttribute('stroke-width', size * 0.17); s.el.setAttribute('stroke-linejoin', 'round'); }
      WB.text(str, 540, y, size, color, lg);
      popIn(lg, t0 + (opts.step || 0) * i, t1, 540, y - size * 0.3, { dur: 0.18, shake: opts.shake, pulse: opts.pulse });
    });
  }
  const IR = '#6a3fb8';
  fala(1.4, 2.35, ['Gente,'], IR, { size: 120 });
  fala(2.35, 3.85, ['se você não', 'quiser ter...'], IR);
  fala(3.85, 4.85, ['PROBLEMAS'], INK.blue, { size: 130, shake: 3 });
  fala(4.85, 7.3, ['nem dor', 'de cabeça...'], IR, { step: 0.7 });
  fala(7.3, 10.5, ['FIQUE', 'SOLTEIRO!'], INK.red, { size: 150, shake: 4, step: 0.55 });
  fala(10.5, 99, ['KKKKKKKK'], IR, { size: 130, pulse: 0.08 });
};
