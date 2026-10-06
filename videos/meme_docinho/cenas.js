// Meme "O teste do docinho" — cenas PRONTAS (projeto.semMao), estilo Caderno Amarelo,
// sincronizadas com o áudio da esquete. Tempos em segundos absolutos do áudio.
// Bocas mexem conforme o volume (window.ENVELOPE, 30 valores por segundo).
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

  // ---------------------------------------------------------------- fundo
  const bg = WB.group(L);
  const flash = WB.mk('rect', { width: 1080, height: 1920, fill: '#ffd7cc', opacity: 0 }, bg);
  const raios = WB.group(bg);
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * Math.PI * 2, a2 = a + 0.06;
    WB.mk('path', { d: `M 540 1000 L ${540 + Math.cos(a) * 1500} ${1000 + Math.sin(a) * 1500} L ${540 + Math.cos(a2) * 1500} ${1000 + Math.sin(a2) * 1500} Z`, fill: '#e2554a' }, raios);
  }
  WB.effect((t) => {
    const fl = inn(t, 9.6, 11.0) ? 1 : inn(t, 21.4, 25.2) ? 0.55 + 0.45 * ramp(t, 21.4, 24.0) : inn(t, 26.2, 28.4) ? 0.6 : 0;
    flash.setAttribute('opacity', (fl * (inn(t, 24.0, 25.2) ? 1 : 0.7)).toFixed(2));
    const r = inn(t, 9.6, 11.0) ? 0.22 : inn(t, 21.4, 25.2) ? 0.08 + 0.17 * ramp(t, 21.4, 25.0) : inn(t, 26.2, 28.4) ? 0.14 : 0;
    raios.setAttribute('opacity', r.toFixed(2));
    raios.setAttribute('transform', `rotate(${(t * 25 % 360).toFixed(1)} 540 1000)`);
  });

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

  // ---------------------------------------------------------------- PAI
  // o: { eyes(t), mouth(t), look(t)->{x,y}, armR(t), armL(t) (graus), brow(t) (dy), hat(t) 0..1, glasses(t) 0..1,
  //      hair(t) 0..1 (cabelo em pé), fingerR(t) 'point'|'thumb'|'' , propR: fn(g), propL: fn(g) }
  function pai(parent, o) {
    const root = WB.group(parent);
    const body = WB.group(root);
    // pernas
    limb('M -55 420 L -60 560', PANTS, 40, body); limb('M 55 420 L 60 560', PANTS, 40, body);
    shape(E(-75, 575, 45, 20), '#2b2b2b', body); shape(E(75, 575, 45, 20), '#2b2b2b', body);
    // braços (atrás do tronco p/ o ombro ficar escondido)
    const arm = (side) => {
      const sx = side * 128, g = WB.group(body);
      limb('M 0 0 L 6 95', SHIRT, 44, g); limb('M 6 95 L 6 175', SKIN, 26, g);
      const hand = WB.group(g, 'translate(6 192)');
      circ(0, 0, 27, SKIN, hand);
      const point = WB.group(hand); limb('M 0 10 L 0 58', SKIN, 12, point);
      const thumb = WB.group(hand); limb(`M ${-side * 12} -8 L ${-side * 30} -46`, SKIN, 13, thumb);
      const prop = WB.group(hand);
      return { g, sx, hand, point, thumb, prop };
    };
    const aR = arm(1), aL = arm(-1);
    shape('M -38 110 L 38 110 L 40 180 L -40 180 Z', SKIN, body);
    shape('M -165 430 Q -172 260 -122 205 Q -72 165 0 165 Q 72 165 122 205 Q 172 260 165 430 Z', SHIRT, body);
    ink('M -50 172 L 0 222 L 50 172', INK.black, 6, body);
    circ(0, 262, 7, '#fff', body, 3); circ(0, 302, 7, '#fff', body, 3);
    // cabeça
    const head = WB.group(root);
    const hairUp = WB.group(head);
    for (let i = -4; i <= 4; i++) ink(`M ${i * 22} -120 L ${i * 30} ${-260 - Math.abs(Math.cos(i)) * 40}`, HAIR_P, 12, hairUp);
    shape(E(-118, 8, 22, 32), SKIN, head); shape(E(118, 8, 22, 32), SKIN, head);
    shape(E(0, 0, 120, 134), SKIN, head, 7);
    ink('M -112 -30 Q -122 -80 -92 -104 M 112 -30 Q 122 -80 92 -104', HAIR_P, 18, head);
    const tufo = ink('M -10 -132 q -14 -40 12 -58 M 8 -133 q 6 -46 36 -52 M 24 -130 q 26 -30 50 -24', HAIR_P, 9, head);
    // olhos
    const eyes = {};
    eyes.normal = WB.group(head);
    circ(-45, -25, 28, '#fff', eyes.normal); circ(45, -25, 28, '#fff', eyes.normal);
    const pupils = WB.group(eyes.normal);
    circ(-45, -22, 11, INK.black, pupils, 0); circ(45, -22, 11, INK.black, pupils, 0);
    eyes.wide = WB.group(head);
    circ(-48, -30, 42, '#fff', eyes.wide, 7); circ(48, -30, 42, '#fff', eyes.wide, 7);
    circ(-48, -30, 6, INK.black, eyes.wide, 0); circ(48, -30, 6, INK.black, eyes.wide, 0);
    ink('M -80 -58 L -60 -50 M 80 -58 L 60 -50', INK.red, 3, eyes.wide);
    eyes.wink = WB.group(head);
    circ(-45, -25, 28, '#fff', eyes.wink); circ(-45, -22, 11, INK.black, eyes.wink, 0);
    ink('M 18 -22 Q 45 -42 72 -22', INK.black, 8, eyes.wink);
    eyes.shifty = WB.group(head);
    shape('M -73 -25 Q -45 -48 -17 -25 Q -45 -8 -73 -25 Z', '#fff', eyes.shifty); shape('M 17 -25 Q 45 -48 73 -25 Q 45 -8 17 -25 Z', '#fff', eyes.shifty);
    const shPup = WB.group(eyes.shifty);
    circ(-45, -26, 9, INK.black, shPup, 0); circ(45, -26, 9, INK.black, shPup, 0);
    eyes.x = WB.group(head);
    ink('M -68 -48 L -22 -2 M -22 -48 L -68 -2 M 22 -48 L 68 -2 M 68 -48 L 22 -2', INK.black, 9, eyes.x);
    eyes.spiral = WB.group(head);
    for (const sx of [-45, 45]) { let d = `M ${sx} -25`; for (let a = 0; a < Math.PI * 5; a += 0.25) { const r = 26 * a / (Math.PI * 5); d += ` L ${(sx + Math.cos(a) * r).toFixed(1)} ${(-25 + Math.sin(a) * r).toFixed(1)}`; } ink(d, INK.black, 5, eyes.spiral); }
    const brows = WB.group(head);
    const browL = ink('M -78 -72 Q -48 -90 -16 -76', INK.black, 10, brows), browR = ink('M 16 -76 Q 48 -90 78 -72', INK.black, 10, brows);
    shape(E(0, 18, 27, 23), SKIN2, head);
    shape('M -78 58 Q -40 26 0 46 Q 40 26 78 58 Q 44 74 0 60 Q -44 74 -78 58 Z', '#4a3020', head, 4);
    mouth(head, 88, 46, o.mouth);
    // disfarce
    const hat = WB.group(head);
    shape('M -98 -110 Q -104 -228 0 -222 Q 104 -228 98 -110 Z', '#6b5040', hat);
    shape('M -98 -142 Q 0 -130 98 -142 L 98 -112 Q 0 -100 -98 -112 Z', '#9b2226', hat, 5);
    shape(E(0, -108, 168, 26), '#6b5040', hat);
    const glasses = WB.group(head);
    shape('M -102 -54 L -10 -54 Q -10 2 -52 4 Q -100 2 -102 -54 Z', '#111', glasses, 5);
    shape('M 10 -54 L 102 -54 Q 100 2 52 4 Q 10 2 10 -54 Z', '#111', glasses, 5);
    ink('M -10 -48 Q 0 -56 10 -48 M -102 -50 L -120 -40 M 102 -50 L 120 -40', INK.black, 6, glasses);
    ink('M -84 -42 L -64 -20 M 30 -42 L 50 -20', '#ffffff', 6, glasses);
    // extras de nocaute
    const ko = WB.group(head);
    shape('M 30 -150 Q 70 -205 105 -140 Z', SKIN, ko);
    ink('M 40 -170 L 96 -150 M 50 -186 L 88 -142', '#f5f0e6', 16, ko); ink('M 40 -170 L 96 -150 M 50 -186 L 88 -142', '#c9b79c', 2, ko);
    const stars = WB.group(head);
    for (let i = 0; i < 4; i++) estrela(stars, 0, 0, 0.6);

    WB.effect((t) => {
      const em = o.eyes ? o.eyes(t) : 'normal';
      for (const k in eyes) show(eyes[k], k === em);
      const lk = o.look ? o.look(t) : { x: 0, y: 0 };
      pupils.setAttribute('transform', `translate(${lk.x} ${lk.y})`);
      shPup.setAttribute('transform', `translate(${(Math.sin(t * 7) * 16).toFixed(1)} 0)`);
      const bd = o.brow ? o.brow(t) : 0;
      browL.setAttribute('transform', `translate(0 ${bd.toFixed(1)})${o.browAngry && o.browAngry(t) ? ' rotate(14 -47 -80)' : ''}`);
      browR.setAttribute('transform', `translate(0 ${bd.toFixed(1)})${o.browAngry && o.browAngry(t) ? ' rotate(-14 47 -80)' : ''}`);
      const hu = o.hair ? o.hair(t) : 0;
      hairUp.style.display = hu > 0 ? '' : 'none';
      hairUp.setAttribute('transform', `scale(1 ${Math.max(0.01, hu).toFixed(2)})`);
      tufo.style.display = hu > 0 ? 'none' : '';
      const h = o.hat ? o.hat(t) : 0;
      hat.style.display = h > 0 ? '' : 'none';
      hat.setAttribute('transform', `translate(0 ${(-900 * (1 - h)).toFixed(1)})`);
      const gl = o.glasses ? o.glasses(t) : 0;
      glasses.style.display = gl > 0 ? '' : 'none';
      glasses.setAttribute('transform', `translate(0 ${(-260 * (1 - gl)).toFixed(1)})`);
      const k = o.ko ? o.ko(t) : 0;
      ko.style.display = k ? '' : 'none'; stars.style.display = k ? '' : 'none';
      if (k) [...stars.children].forEach((s, i) => {
        const a = t * 5 + i * Math.PI / 2;
        s.setAttribute('transform', `translate(${(Math.cos(a) * 150).toFixed(1)} ${(-150 + Math.sin(a) * 40).toFixed(1)}) scale(0.6)`);
      });
      for (const [a, fn, fing] of [[aR, o.armR, o.fingerR], [aL, o.armL, o.fingerL]]) {
        const ang = fn ? fn(t) : 0, side = a === aR ? 1 : -1;
        a.g.setAttribute('transform', `translate(${a.sx} 215) rotate(${(-side * ang).toFixed(2)})`);
        a.prop.setAttribute('transform', `rotate(${(side * ang).toFixed(2)})`);
        const f = fing ? fing(t) : '';
        show(a.point, f === 'point'); show(a.thumb, f === 'thumb');
      }
    });
    if (o.propR) o.propR(aR.prop);
    if (o.propL) o.propL(aL.prop);
    return { root, head, body, hat, glasses };
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
      return { g, side, finger };
    };
    const aR = arm(1), aL = arm(-1);
    shape('M -100 330 L -62 150 Q 0 120 62 150 L 100 330 Q 0 345 -100 330 Z', DRESS, body);
    ink('M -88 300 Q 0 318 88 300', '#fff', 6, body);
    // cabeça
    const head = WB.group(root);
    const pig = (side) => {
      shape(E(side * 128, 10, 44, 56), HAIR_F, head);
      shape(`M ${side * 92} -58 L ${side * 132} -86 L ${side * 128} -34 Z M ${side * 92} -58 L ${side * 54} -92 L ${side * 62} -36 Z`, '#e63946', head, 5);
      circ(side * 92, -60, 11, '#e63946', head, 5);
    };
    pig(1); pig(-1);
    const face = shape(E(0, 0, 104, 100), SKIN, head, 7);
    const red = WB.mk('path', { d: E(0, 0, 100, 96), fill: '#e5383b', opacity: 0 }, head);
    shape('M -104 0 Q -112 -104 0 -106 Q 112 -104 104 0 Q 84 -52 46 -50 Q 18 -74 -14 -50 Q -56 -64 -104 0 Z', HAIR_F, head);
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
        show(a.finger, !!(o.finger && o.finger(t) && a === aR));
      }
      lR.setAttribute('transform', `translate(34 318) rotate(${(o.legR ? -o.legR(t) : 0).toFixed(1)})`);
      lL.setAttribute('transform', `translate(-34 318) rotate(${(o.legL ? o.legL(t) : 0).toFixed(1)})`);
    });
    return { root, head, body };
  }

  // ---------------------------------------------------------------- legendas
  const capLayer = WB.group(L);
  function fala(t0, t1, lines, color, opts = {}) {
    const size = opts.size || 96, y0 = opts.y || 300;
    const g = WB.group(capLayer);
    lines.forEach((ln, i) => {
      const [str, at] = Array.isArray(ln) ? ln : [ln, t0];
      const lg = WB.group(g);
      const halo = WB.textStrokes(str, 540, y0 + i * size * 1.05, size, '#fffaf0', lg, 'middle');
      WB.showNow(halo.strokes);
      for (const st of halo.strokes) { st.el.setAttribute('stroke-width', size * 0.17); st.el.setAttribute('stroke-linejoin', 'round'); }
      WB.text(str, 540, y0 + i * size * 1.05, size, color, lg);
      const cy = y0 + i * size * 1.05 - size * 0.3;
      popIn(lg, at, t1, 540, cy, { dur: 0.2, shake: opts.shake, wobble: opts.wobble, pulse: opts.pulse });
    });
    return g;
  }
  const PAI_C = INK.blue, FILHA_C = '#c2185b', DISF_C = INK.purple;
  fala(0.0, 1.0, ['Se algum estranho...'], PAI_C);
  fala(1.0, 2.0, ['chegasse em VOCÊ'], PAI_C);
  fala(2.0, 3.8, ['te oferecesse', ['alguns DOCES', 2.6]], PAI_C);
  fala(3.8, 5.2, ['o que você faria?'], PAI_C);
  fala(5.2, 7.6, ['Eu ia falar', ['assim ó:', 5.6]], FILHA_C);
  fala(7.6, 9.6, ['"MUITO OBRIGADA!"'], FILHA_C, { size: 100, wobble: 3 });
  fala(9.6, 11.0, ['NÃÃÃO!!'], INK.red, { size: 190, y: 360, shake: 9 });
  fala(11.0, 13.4, ['Você tem que falar', ['que não o conhece', 11.8]], PAI_C);
  fala(13.4, 14.6, ['Tendeu?'], PAI_C);
  fala(14.6, 15.2, ['Vou fazer um', 'teste aqui'], PAI_C);
  fala(15.2, 16.4, ['Vamos de novo...', ['vamo!', 16.0]], PAI_C);
  fala(16.4, 17.6, ['Vai, então!'], PAI_C);
  fala(17.6, 19.4, ['Oi, criancinha...', ['fofinha', 18.4]], DISF_C, { wobble: 4 });
  fala(19.4, 21.4, ['Você quer alguns', ['docinhos?', 20.0]], DISF_C, { wobble: 4 });
  fala(21.4, 22.6, ['Olha bem', ['na minha cara', 22.0]], FILHA_C, { size: 90, shake: 2 });
  fala(22.6, 24.0, ['pra ver se eu', ['tô querendo', 23.2]], FILHA_C, { size: 90, shake: 3 });
  fala(24.0, 25.2, ['UNS DOCES?!'], INK.red, { size: 150, y: 350, shake: 8 });
  fala(25.2, 26.2, ['EU NEM', ['TE CONHEÇO!', 25.6]], FILHA_C, { size: 110, shake: 4 });
  fala(26.2, 27.0, ['SEU VACILÃO!'], FILHA_C, { size: 120, shake: 6 });
  fala(27.0, 28.4, ['SEU COMÉDIA!'], FILHA_C, { size: 120, shake: 6 });
  fala(28.4, 29.2, ['AAAAAH!'], INK.red, { size: 160, y: 350, shake: 10 });
  fala(29.2, 31.0, ['SOCORRO!'], INK.red, { size: 150, y: 350, shake: 8 });

  // =================================================================== PLANO A — o pai (0 – 3,8)
  {
    const sh = WB.shot(0, 3.8, L);
    // balão de pensamento com o "estranho" (já é ele disfarçado!)
    const bal = WB.group(sh);
    circ(640, 700, 12, '#fff', bal, 5); circ(690, 650, 20, '#fff', bal, 5);
    shape(WB.cloudPath(840, 560, 170, 120, 9), '#ffffff', bal, 6);
    const est = WB.group(bal, 'translate(840 560) scale(0.42)');
    shape('M -110 250 Q -110 120 0 120 Q 110 120 110 250 Z', '#333', est);
    shape(E(0, 0, 110, 122), '#555', est);
    shape('M -96 -100 Q -100 -210 0 -205 Q 100 -210 96 -100 Z', '#222', est); shape(E(0, -98, 160, 24), '#222', est);
    shape('M -96 -50 L -8 -50 Q -10 0 -50 2 Q -94 0 -96 -50 Z M 8 -50 L 96 -50 Q 94 0 50 2 Q 10 0 8 -50 Z', '#000', est, 4);
    ink('M -40 70 Q 0 95 40 70', '#ddd', 8, est);
    WB.text('?', 990, 470, 110, INK.red, bal);
    popIn(bal, 0.25, 1.9, 760, 600, { dur: 0.3 });

    const pg = WB.group(sh);
    let pote1;
    const p = pai(pg, {
      eyes: (t) => t < 1.0 ? 'normal' : t < 2.0 ? 'wide' : 'normal',
      look: (t) => t < 1.0 ? { x: 10, y: -6 } : { x: 0, y: 4 },
      mouth: (t) => ({ type: 'talk', talk: true }),
      brow: (t) => t < 1.0 ? -6 + Math.sin(t * 8) * 6 : -16,
      armR: (t) => lerp(10, 115, back(ramp(t, 1.0, 1.25))) * (1 - ramp(t, 3.5, 3.8)),
      fingerR: (t) => t >= 1.0 ? 'point' : '',
      armL: (t) => lerp(12, 42, back(ramp(t, 2.0, 2.25))),
      propL: (g) => { pote1 = pote(g, 0, -110, 0.9); },
    });
    WB.effect((t) => {
      const zoom = lerp(1.2, 1.36, ease(ramp(t, 1.0, 1.3)));
      const bob = Math.sin(t * 6) * 6 * (0.5 + env(t));
      tf(pg, 470, 860 + bob, zoom, Math.sin(t * 3) * 2);
      pote1.g.style.display = t >= 2.0 ? '' : 'none';
      const u = ramp(t, 2.6, 3.4);
      [...pote1.doces.children].forEach((d, i) => {
        const base = d.getAttribute('data-b') || d.getAttribute('transform');
        d.setAttribute('data-b', base);
        const j = u > 0 ? -Math.abs(Math.sin((t - 2.6) * 9 + i)) * 40 : 0;
        d.setAttribute('transform', `${base} translate(0 ${j.toFixed(1)})`);
      });
    });
    const br = WB.group(sh);
    [[150, 1180, 0.9], [380, 1050, 0.7], [250, 1420, 0.6]].forEach(([x, y, s], i) => popIn(brilho(br, x, y, s), 2.6 + i * 0.12, 3.8, x, y, { pulse: 0.25 }));
  }

  // =================================================================== PLANO B — "o que você faria?" (3,8 – 5,2)
  {
    const sh = WB.shot(3.8, 5.2, L);
    const pg = WB.group(sh);
    let pt;
    pai(pg, {
      eyes: () => 'normal', look: () => ({ x: 12, y: 0 }),
      mouth: () => ({ type: 'talk', talk: true }), brow: (t) => -10 + Math.sin(t * 9) * 5,
      armR: () => 70, propR: (g) => { pt = pote(g, 0, -100, 0.85); },
      armL: () => 12,
    });
    tf(pg, 290, 1010, 0.92);
    const fg = WB.group(sh);
    filha(fg, {
      eyes: (t) => t < 4.25 ? 'normal' : 'candy',
      look: () => ({ x: -10, y: 0 }),
      mouth: (t) => t < 4.25 ? { type: 'smile' } : { type: 'grin', min: 0.35 },
      armR: () => 20, armL: () => 20,
    });
    const baba = shape('M 0 -14 Q 14 4 0 16 Q -14 4 0 -14 Z', '#9ad0f5', WB.group(fg), 4);
    WB.effect((t) => {
      const u = ramp(t, 4.4, 5.2);
      baba.setAttribute('transform', `translate(18 ${(110 + u * 120).toFixed(1)}) scale(${(0.6 + u).toFixed(2)})`);
      baba.style.display = t > 4.4 ? '' : 'none';
    });
    popIn(fg, 3.8, 5.2, 800, 1300, { dur: 0.25 });
    WB.effect((t) => { tf(fg, 800, 1170 - Math.abs(Math.sin(t * 10)) * 18 * ramp(t, 4.25, 4.4), 1.0); });
    const hs = WB.group(sh);
    [[690, 920], [930, 900], [810, 830]].forEach(([x, y], i) => {
      const c = coracao(hs, x, y, 0.9);
      popIn(c, 4.3 + i * 0.12, 5.2, x, y, { pulse: 0.2 });
    });
  }

  // =================================================================== PLANO C — filha: "muito obrigada!" (5,2 – 9,6)
  {
    const sh = WB.shot(5.2, 9.6, L);
    const fg = WB.group(sh);
    filha(fg, {
      eyes: (t) => t < 7.6 ? 'smug' : 'happy',
      mouth: (t) => t < 7.6 ? { type: 'talk', talk: true } : { type: 'grin', talk: true, min: 0.15 },
      armR: (t) => t < 7.6 ? lerp(15, 165, back(ramp(t, 5.4, 5.65))) : 140 + Math.sin(t * 14) * 12,
      finger: (t) => t < 7.6,
      armL: (t) => t < 7.6 ? 15 : 140 + Math.sin(t * 14 + 1) * 12,
      halo: (t) => t > 7.8,
    });
    WB.effect((t) => {
      const b = t >= 7.6 ? -Math.abs(Math.sin((t - 7.6) * 8)) * 40 : 0;
      const r = t < 7.6 ? -6 + Math.sin(t * 2.5) * 3 : Math.sin((t - 7.6) * 6) * 8;
      tf(fg, 540, 900 + b, t < 7.6 ? 1.72 : 1.8, r);
    });
    const fx = WB.group(sh);
    const itens = [[200, 700, 'c'], [880, 680, 'c'], [150, 1250, 'b'], [930, 1200, 'b'], [260, 980, 'c'], [840, 960, 'b'], [540, 560, 'b']];
    itens.forEach(([x, y, k], i) => {
      const it = k === 'c' ? coracao(fx, x, y, 1.1) : brilho(fx, x, y, 1.2);
      popIn(it, 7.65 + i * 0.07, 9.6, x, y, { pulse: 0.25, rot: 90 });
    });
  }

  // =================================================================== PLANO D — "NÃÃÃO!" (9,6 – 11,0)
  {
    const sh = WB.shot(9.6, 11.0, L);
    const pg = WB.group(sh);
    pai(pg, {
      eyes: () => 'wide', mouth: () => ({ type: 'scream', talk: true, min: 0.45 }),
      brow: () => -34, hair: (t) => back(ramp(t, 9.7, 9.95)),
      armR: () => 25, armL: () => 25,
    });
    WB.effect((t) => {
      const S = t < 9.85 ? 1.7 : t < 10.1 ? 2.4 : 3.1;
      const sk = shake(t, 4 + 10 * env(t));
      tf(pg, 540 + sk.x, 1150 + sk.y, S);
    });
  }

  // =================================================================== PLANO E/F — a aula e o disfarce (11,0 – 17,6)
  {
    const sh = WB.shot(11.0, 17.6, L);
    const pg = WB.group(sh);
    pai(pg, {
      eyes: (t) => t >= 13.4 && t < 14.6 ? 'wink' : t >= 14.6 && t < 16.8 ? 'shifty' : 'normal',
      look: () => ({ x: 12, y: 2 }),
      mouth: (t) => t >= 16.8 ? { type: 'creep', talk: true } : t >= 14.6 ? { type: 'grin', talk: true, min: 0.05 } : { type: 'talk', talk: true },
      brow: (t) => t < 13.4 ? 8 : t >= 14.6 && t < 16.8 ? -12 + Math.sin(t * 16) * 10 : -8,
      browAngry: (t) => t < 13.4,
      armR: (t) => t < 13.4 ? 165 + Math.sin(t * 12) * 10 : t < 14.6 ? 75 : t < 16.4 ? 35 + Math.sin(t * 20) * 8 : 18,
      fingerR: (t) => t < 13.4 ? 'point' : t < 14.6 ? 'thumb' : '',
      armL: (t) => t >= 14.6 && t < 16.4 ? 35 + Math.sin(t * 20 + 2) * 8 : 12,
      hat: (t) => back(ramp(t, 16.4, 16.75)),
      glasses: (t) => ease(ramp(t, 16.8, 17.1)),
    });
    WB.effect((t) => { tf(pg, 330, 1000 + Math.sin(t * 6) * 5, 1.0, t >= 14.6 && t < 16.4 ? Math.sin(t * 10) * 3 : 0); });
    const fg = WB.group(sh);
    filha(fg, {
      eyes: (t) => t >= 13.6 && t < 14.6 ? 'happy' : t >= 15.2 ? 'deadpan' : 'normal',
      look: () => ({ x: -10, y: -4 }),
      mouth: (t) => t >= 13.6 && t < 14.6 ? { type: 'smile' } : t >= 15.2 ? { type: 'flat' } : { type: 'smile' },
      armR: () => 15, armL: () => 15,
    });
    WB.effect((t) => {
      const nod = t >= 13.6 && t < 14.6 ? Math.abs(Math.sin((t - 13.6) * 12)) * 22 : 0;
      tf(fg, 800, 1215 + nod, 0.95);
    });
    // a placa da lição
    const placa = WB.group(sh);
    shape(WB.roundRectPath(230, 560, 620, 150, 26), '#ffffff', placa, 8);
    ink(WB.roundRectPath(244, 574, 592, 122, 18), INK.red, 5, placa);
    WB.text('"NÃO TE CONHEÇO!"', 540, 662, 72, INK.red, placa);
    popIn(placa, 11.8, 14.6, 540, 635, { rot: -12, pulse: 0.03 });
    // "..." da filha
    const pts = WB.group(sh);
    shape(WB.cloudPath(890, 860, 95, 60, 8), '#fff', pts, 5);
    WB.text('...', 890, 880, 90, INK.black, pts);
    popIn(pts, 15.4, 17.6, 890, 860);
    // etiqueta do disfarce
    const et = WB.group(sh);
    shape(WB.roundRectPath(50, 520, 600, 175, 22), '#fff3b0', et, 6);
    WB.text('disfarce nível:', 350, 590, 66, INK.black, et);
    WB.text('PROFISSIONAL', 350, 668, 86, INK.purple, et);
    ink('M 300 700 Q 300 760 330 790 M 330 790 L 300 780 M 330 790 L 326 758', INK.purple, 7, et);
    popIn(et, 17.1, 17.6, 350, 625, { rot: 10 });
  }

  // =================================================================== PLANO G — o "estranho" (17,6 – 21,4)
  {
    const sh = WB.shot(17.6, 21.4, L);
    const pg = WB.group(sh);
    pai(pg, {
      eyes: () => 'normal', mouth: () => ({ type: 'creep', talk: true }),
      brow: (t) => -30 + Math.sin(t * 18) * 14,
      hat: () => 1, glasses: () => 1,
      armR: (t) => 100 + Math.sin(t * 5) * 10,
      propR: (g) => { const pr = WB.group(g); pirulito(pr, 0, -150, 70); WB.effect((t) => pr.setAttribute('transform', `rotate(${(Math.sin(t * 5) * 10).toFixed(1)})`)); },
      armL: () => 25,
    });
    WB.effect((t) => { tf(pg, 330, 1010, 1.08, 10 + Math.sin(t * 4) * 3); });
    const fg = WB.group(sh);
    filha(fg, {
      eyes: () => 'deadpan', look: () => ({ x: 0, y: 0 }),
      mouth: (t) => ({ type: t > 20.4 ? 'wavy' : 'flat' }),
      twitch: (t) => t > 19.6, vein: (t) => t > 20.4,
      armR: () => 12, armL: () => 12,
    });
    tf(fg, 820, 1240, 0.95);
    const br = WB.group(sh);
    [[250, 640, 0.6], [560, 720, 0.5], [180, 900, 0.45]].forEach(([x, y, s], i) => popIn(brilho(br, x, y, s, '#c77dff'), 17.8 + i * 0.3, 21.4, x, y, { pulse: 0.4 }));
  }

  // =================================================================== PLANO H — "olha bem na minha cara" (21,4 – 24,0)
  {
    const sh = WB.shot(21.4, 24.0, L);
    // o pirulito do "estranho" tremendo na beirada
    const pr = WB.group(sh);
    limb('M -60 1500 L 160 1180', SHIRT, 44, pr);
    circ(170, 1165, 30, SKIN, pr);
    pirulito(pr, 170, 980, 80, 2.2);
    const fg = WB.group(sh);
    filha(fg, {
      eyes: () => 'angry',
      mouth: (t) => t < 22.6 ? { type: 'frown', talk: true } : { type: 'rage', talk: true, min: 0.2 },
      red: (t) => ramp(t, 21.4, 23.6), vein: () => true, steam: (t) => t > 22.4,
      armR: () => 12, armL: () => 12,
    });
    WB.effect((t) => {
      const S = 1.7 + 0.22 * Math.floor(clamp((t - 21.4) / 0.6, 0, 3.99));
      const sk = shake(t, 2 + 5 * ramp(t, 22.6, 24));
      tf(fg, 600 + sk.x, 1060 + sk.y, S);
      const ps = shake(t, 6, 55);
      pr.setAttribute('transform', `translate(${ps.x.toFixed(1)} ${ps.y.toFixed(1)})`);
    });
  }

  // =================================================================== PLANO I — "UNS DOCES?!" (24,0 – 25,2)
  {
    const sh = WB.shot(24.0, 25.2, L);
    const fg = WB.group(sh);
    filha(fg, { eyes: () => 'fire', mouth: () => ({ type: 'rage', talk: true, min: 0.4 }), red: () => 1, vein: () => true, steam: () => true });
    WB.effect((t) => {
      const S = 3.9, sk = shake(t, 12);
      tf(fg, 540 + sk.x, 1050 - 20 * S + sk.y, S);
    });
  }

  // =================================================================== PLANO J — o chute (25,2 – 26,2)
  {
    const sh = WB.shot(25.2, 26.2, L);
    const fly = (t) => ease(ramp(t, 25.35, 26.1));
    const pg = WB.group(sh);
    pai(pg, {
      eyes: (t) => t < 25.35 ? 'normal' : 'wide', mouth: (t) => ({ type: 'scream', min: t < 25.35 ? 0.1 : 0.6 }),
      hat: (t) => t < 25.35 ? 1 : 0, glasses: (t) => t < 25.35 ? 1 : 0, hair: (t) => t < 25.35 ? 0 : 1,
      armR: (t) => t < 25.35 ? 60 : 150 + Math.sin(t * 30) * 20, armL: (t) => t < 25.35 ? 20 : 150 + Math.sin(t * 30 + 1) * 20,
    });
    WB.effect((t) => {
      const u = fly(t);
      tf(pg, 720 + u * 260, 1080 - u * 620 - Math.sin(u * Math.PI) * 120, 0.95 - u * 0.35, u * 260);
    });
    // chapéu e óculos voando
    const voa = WB.group(sh);
    const ch = WB.group(voa);
    shape('M -98 -110 Q -104 -228 0 -222 Q 104 -228 98 -110 Z', '#6b5040', ch); shape(E(0, -108, 168, 26), '#6b5040', ch);
    const oc = WB.group(voa);
    shape('M -102 -54 L -10 -54 Q -10 2 -52 4 Q -100 2 -102 -54 Z M 10 -54 L 102 -54 Q 100 2 52 4 Q 10 2 10 -54 Z', '#111', oc, 5);
    WB.effect((t) => {
      const u = ramp(t, 25.35, 26.2), on = t >= 25.35;
      ch.style.display = oc.style.display = on ? '' : 'none';
      tf(ch, 700 - u * 500, 900 - u * 500 + u * u * 400, 0.8, -u * 400);
      tf(oc, 760 + u * 50, 1000 - u * 700 + u * u * 500, 0.7, u * 720);
    });
    const fg = WB.group(sh);
    filha(fg, {
      eyes: () => 'angry', mouth: () => ({ type: 'rage', talk: true, min: 0.3 }), red: () => 0.7, vein: () => true,
      legR: (t) => lerp(0, 95, back(ramp(t, 25.2, 25.35))), armR: () => 120, armL: () => 60,
    });
    tf(fg, 330, 1230, 1.0, -8);
    const pow = explosao(WB.group(sh), 620, 1230, 1, 'POW!', 110);
    popIn(pow, 25.33, 26.2, 620, 1230, { dur: 0.15, pulse: 0.08 });
    // linhas de velocidade
    const vel = WB.group(sh);
    for (let i = 0; i < 5; i++) ink(`M ${560 + i * 30} ${1340 - i * 40} L ${470 + i * 20} ${1460 - i * 30}`, INK.black, 6, vel);
    popIn(vel, 25.3, 25.8, 520, 1400);
  }

  // =================================================================== PLANO K — a briga (26,2 – 28,4)
  {
    const sh = WB.shot(26.2, 28.4, L);
    const nuvem = WB.group(sh);
    const extras = WB.group(nuvem);
    // braços, pernas e objetos que aparecem e somem na briga
    const pedacos = [];
    const add = (fn) => { const g = WB.group(extras); fn(g); pedacos.push(g); };
    add(g => { limb('M 0 0 L 190 0', SKIN, 22, g); circ(205, 0, 28, SKIN, g); });
    add(g => { limb('M 0 0 L 200 0', SHIRT, 40, g); circ(222, 0, 30, SKIN, g); });
    add(g => { limb('M 0 0 L 200 0', PANTS, 36, g); shape(E(222, -14, 22, 44), '#2b2b2b', g); });
    add(g => { limb('M 0 0 L 190 0', SKIN, 16, g); shape(E(204, -8, 16, 26), '#9b2226', g); });
    add(g => { pirulito(g, 250, 0, 55, 2.2).setAttribute('transform', 'translate(250 0) rotate(90)'); });
    add(g => { limb('M 0 0 L 200 0', SKIN, 16, g); circ(212, 0, 18, SKIN, g); });
    add(g => { limb('M 0 0 L 200 0', SHIRT, 40, g); circ(222, 0, 30, SKIN, g); });
    shape(WB.cloudPath(0, 0, 330, 250, 12), '#ffffff', nuvem, 9);
    ink('M -200 -40 Q -120 -120 -40 -40 Q 40 40 120 -40 M -160 60 Q -60 0 40 80 Q 120 140 200 60', '#bbbbbb', 6, nuvem);
    // relances: cara da filha brava / cara do pai zonzo
    const relF = WB.group(nuvem);
    filha(relF, { eyes: () => 'angry', mouth: () => ({ type: 'rage', min: 0.5 }), red: () => 0.8, vein: () => true }).body.style.display = 'none';
    const relP = WB.group(nuvem);
    pai(relP, { eyes: () => 'spiral', mouth: () => ({ type: 'wavy' }), hair: () => 1, armR: () => 0, armL: () => 0 }).body.style.display = 'none';
    const est = WB.group(nuvem);
    for (let i = 0; i < 5; i++) estrela(est, 0, 0, 0.8);
    WB.effect((t) => {
      const sk = shake(t, 14, 30), s = 1 + Math.sin(t * 24) * 0.04;
      nuvem.setAttribute('transform', `translate(${(540 + sk.x).toFixed(1)} ${(1150 + sk.y).toFixed(1)}) scale(${s.toFixed(3)})`);
      const step = Math.floor(t / 0.13);
      pedacos.forEach((g, i) => {
        const a = ((step * 2.3 + i * 0.9) % (Math.PI * 2));
        g.style.display = (step + i) % 4 === 0 ? 'none' : '';
        g.setAttribute('transform', `translate(${(Math.cos(a) * 200).toFixed(1)} ${(Math.sin(a) * 150).toFixed(1)}) rotate(${(a * 180 / Math.PI).toFixed(1)})`);
      });
      relF.style.display = inn(t, 26.7, 27.15) || inn(t, 27.9, 28.4) ? '' : 'none';
      tf(relF, 110, -60, 0.9, -15);
      relP.style.display = inn(t, 27.3, 27.8) ? '' : 'none';
      tf(relP, -100, -30, 0.75, 20);
      [...est.children].forEach((e, i) => {
        const a = t * 6 + i * 1.256;
        e.setAttribute('transform', `translate(${(Math.cos(a) * 380).toFixed(1)} ${(Math.sin(a) * 290).toFixed(1)}) scale(0.8)`);
      });
    });
    const onos = [['PÁ!', 26.25, 250, 820, -12], ['TUM!', 26.65, 830, 1460, 10], ['SOC!', 27.05, 860, 830, 8], ['POF!', 27.45, 220, 1470, -8], ['CRÁ!', 27.85, 540, 1530, 4], ['PLAFT!', 28.05, 300, 640, -6]];
    onos.forEach(([txt, t0, x, y, r]) => {
      const e = explosao(WB.group(sh), x, y, 0.62, txt, 100, '#ffe066');
      e.setAttribute('transform', `translate(${x} ${y}) rotate(${r})`);
      popIn(e, t0, Math.min(28.4, t0 + 0.7), x, y, { dur: 0.15, pulse: 0.06 });
    });
  }

  // =================================================================== PLANO L — "AAAH! SOCORRO!" (28,4 – 31,0)
  {
    const sh = WB.shot(28.4, 99, L);
    ink(WB.roughLine(40, 1640, 1040, 1636, 3), '#8a6a3a', 8, sh);
    // pedaços do pirulito no chão
    const caco = WB.group(sh);
    [[170, 1620, 0], [240, 1628, 40], [120, 1630, 80]].forEach(([x, y, r]) => shape(`M ${x} ${y} l 30 -14 l 14 22 z`, '#e63946', caco, 4).setAttribute('transform', `rotate(${r} ${x} ${y})`));
    ink('M 290 1630 L 380 1600', INK.black, 16, caco); ink('M 290 1630 L 380 1600', '#fffaf0', 9, caco);
    const pg = WB.group(sh);
    pai(pg, {
      eyes: () => 'x', mouth: () => ({ type: 'wavy' }), ko: () => 1, hair: () => 0.5,
      armR: (t) => t > 30.0 ? lerp(10, 80, back(ramp(t, 30.0, 30.3))) : 10, fingerR: (t) => t > 30.0 ? 'thumb' : '', armL: () => 30,
    });
    WB.effect((t) => tf(pg, 420, 1505, 0.7, -84));
    // a filha fugindo e gritando
    const fg = WB.group(sh);
    filha(fg, {
      eyes: () => 'scream', mouth: () => ({ type: 'scream', talk: true, min: 0.35 }), tears: () => true,
      armR: (t) => 160 + Math.sin(t * 22) * 25, armL: (t) => 160 + Math.sin(t * 22 + 2) * 25,
      legR: (t) => Math.sin(t * 22) * 45, legL: (t) => Math.sin(t * 22 + Math.PI) * 45,
    });
    const poeira = WB.group(sh);
    for (let i = 0; i < 5; i++) shape(WB.cloudPath(0, 0, 40, 26, 7), '#e9dcc0', WB.group(poeira), 4);
    WB.effect((t) => {
      const u = ramp(t, 28.4, 31.0);
      const x = lerp(880, 975, u), y = lerp(1000, 700, ease(u)) - Math.abs(Math.sin(t * 11)) * 30;
      tf(fg, x, y, lerp(0.85, 0.38, u), 8);
      [...poeira.children].forEach((p, i) => {
        const ph = (t * 2.2 + i * 0.2) % 1, px = lerp(850, 970, clamp(u - ph * 0.25)), py = lerp(1360, 880, ease(clamp(u - ph * 0.25)));
        p.setAttribute('transform', `translate(${(px - 40).toFixed(1)} ${py.toFixed(1)}) scale(${(0.4 + ph * 0.9).toFixed(2)})`);
        p.setAttribute('opacity', (1 - ph).toFixed(2));
      });
    });
    // o pai, nocauteado: "...passou no teste"
    const bal = WB.group(sh);
    shape(WB.roundRectPath(70, 1130, 520, 150, 40) + ' M 300 1278 L 290 1340 L 360 1278', '#ffffff', bal, 6);
    WB.text('...ela passou', 330, 1196, 62, INK.gray, bal);
    WB.text('no teste...', 330, 1256, 62, INK.gray, bal);
    popIn(bal, 30.0, 99, 330, 1230, { rot: -8 });
  }
  L.appendChild(capLayer);   // legendas por cima de tudo
};
