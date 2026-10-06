// Meme "A reunião das IAs" — cenas PRONTAS (projeto.semMao), estilo Caderno Amarelo,
// sincronizadas com o áudio da esquete. Cada personagem É a própria IA: o logo vivo, com rosto e braços.
// Tempos em segundos absolutos do áudio. Bocas seguem o volume (window.ENVELOPE, 30/s).
window.CENAS = function (WB) {
  const { INK } = WB;
  const clamp = WB.clamp, ease = WB.ease, lerp = WB.lerp;
  const env = (t) => (window.ENVELOPE[Math.floor(t * 30)] || 0);
  const ramp = (t, a, b) => clamp((t - a) / (b - a));
  const L = WB.overlay;
  const SUIT = '#f7f7f4', SKIN = '#e9b993', SKIN_D = '#d39a72', MOUTH = '#7a1f1f';
  const ink = (d, c, w, p, a) => WB.ink(d, c, w, p, a);
  const shape = (d, fill, p, w = 6) => WB.mk('path', { d, fill, stroke: w ? INK.black : 'none', 'stroke-width': w || 0, 'stroke-linejoin': 'round' }, p);
  const circ = (cx, cy, r, fill, p, w = 6) => WB.mk('circle', { cx, cy, r, fill, stroke: w ? INK.black : 'none', 'stroke-width': w }, p);
  const E = (cx, cy, rx, ry) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
  const limb = (d, color, w, p) => { const g = WB.group(p); ink(d, INK.black, w + 11, g); ink(d, color, w, g); return g; };
  const show = (el, on) => { el.style.display = on ? '' : 'none'; };
  const tf = (g, x, y, s = 1, r = 0) => g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(3)})`);
  const shake = (t, a, f = 40) => ({ x: Math.sin(t * f) * a + Math.sin(t * f * 1.7) * a * 0.5, y: Math.cos(t * f * 1.3) * a });
  const back = u => { const c = 2.2; return u >= 1 ? 1 : 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  // valor que muda ao longo do plano: constante, função de t ou [[t, v], ...]
  const val = (spec, t, def) => spec === undefined ? def : typeof spec === 'function' ? spec(t)
    : Array.isArray(spec) && Array.isArray(spec[0]) ? spec.reduce((v, [tt, vv]) => (t >= tt ? vv : v), spec[0][1]) : spec;

  // ---------------------------------------------------------------- gradientes dos logos
  const defs = WB.mk('defs', {}, L);
  const grad = (id, stops, x2 = 1, y2 = 1) => {
    const g = WB.mk('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, defs);
    stops.forEach(([o, c]) => WB.mk('stop', { offset: o, 'stop-color': c }, g));
  };
  grad('gGem', [[0, '#3f7bff'], [0.55, '#9b72cb'], [1, '#e2677a']]);
  grad('gCopA', [[0, '#1f6fff'], [1, '#14c2a3']]);
  grad('gCopB', [[0, '#ff5fa8'], [1, '#ffb23f']]);

  // ---------------------------------------------------------------- logos (desenho à mão, paródia)
  const LOGO = {
    gpt(g) {
      for (let k = 0; k < 6; k++) {
        const lg = WB.group(g, `rotate(${k * 60})`);
        WB.mk('path', { d: 'M -11 -6 L -11 -40 Q -11 -52 0 -52 Q 11 -52 11 -40 L 11 -6', fill: 'none', stroke: '#111', 'stroke-width': 8, 'stroke-linecap': 'round', transform: 'translate(13 4) rotate(-30)' }, lg);
      }
    },
    cla(g) {
      const n = 11;
      for (let k = 0; k < n; k++) {
        const a = k / n * Math.PI * 2 + 0.2, r = k % 2 ? 40 : 52;
        WB.mk('path', { d: `M ${(Math.cos(a) * 8).toFixed(1)} ${(Math.sin(a) * 8).toFixed(1)} L ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`, stroke: '#d97757', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
      }
    },
    gem(g) {
      WB.mk('path', { d: 'M 0 -54 C 6 -14 14 -6 54 0 C 14 6 6 14 0 54 C -6 14 -14 6 -54 0 C -14 -6 -6 -14 0 -54 Z', fill: 'url(#gGem)', stroke: '#2b2b6b', 'stroke-width': 3 }, g);
    },
    cop(g) {
      WB.mk('path', { d: 'M -46 -6 Q -46 -40 -14 -40 L 18 -40 Q 30 -40 26 -28 L 10 22 Q 6 34 -8 34 L -30 34 Q -46 34 -46 18 Z', fill: 'url(#gCopA)', stroke: '#1d2b55', 'stroke-width': 3 }, g);
      WB.mk('path', { d: 'M 46 6 Q 46 40 14 40 L -18 40 Q -30 40 -26 28 L -10 -22 Q -6 -34 8 -34 L 30 -34 Q 46 -34 46 -18 Z', fill: 'url(#gCopB)', stroke: '#55271d', 'stroke-width': 3, opacity: 0.92 }, g);
    },
  };
  const IA = {
    gpt: { nome: 'Gepeto', marca: 'ChatGPT', cor: '#0d8a6a', sala: '#2e2116', salaOp: 0.6, olhos: 'tired', rot: -6 },
    cla: { nome: 'Cláudio', marca: 'Claude', cor: '#d97757', sala: '#f6d7c3', salaOp: 0.55, olhos: 'calm', rot: 4 },
    gem: { nome: 'Gemínio', marca: 'Gemini', cor: '#4f6bff', sala: '#d6e0ff', salaOp: 0.55, olhos: 'bright', rot: -3 },
    cop: { nome: 'Copilon', marca: 'Copilot', cor: '#8b4fd8', sala: '#e5dcff', salaOp: 0.55, olhos: 'lash', rot: 5 },
  };
  function logo(parent, who, x, y, s = 1) {
    const g = WB.group(parent, `translate(${x} ${y}) scale(${s})`);
    LOGO[who](g);
    return g;
  }

  // ---------------------------------------------------------------- boca
  function mouth(parent, cy, w, mode) {
    const g = WB.group(parent);
    const m = WB.mk('path', { d: '', fill: MOUTH, stroke: INK.black, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    const tongue = WB.mk('path', { d: '', fill: '#e86a7a' }, g);
    const teeth = WB.mk('path', { d: '', fill: '#fff', stroke: INK.black, 'stroke-width': 3 }, g);
    const line = ink('', INK.black, 7, g);
    WB.effect((t) => {
      const md = mode(t);
      const o = Math.max(md.min || 0, md.talk ? clamp((env(t) - 0.07) * 1.5) : 0);
      let d = '', td = '', tg = '', ld = '';
      if (md.type === 'talk') {
        const rx = w * 0.42 + w * 0.2 * o, ry = 4 + w * 0.5 * o;
        d = E(0, cy, rx, ry);
        if (o > 0.25) tg = E(0, cy + ry * 0.5, rx * 0.55, ry * 0.35);
        if (o > 0.2) td = `M ${-rx * 0.7} ${cy - ry * 0.75} Q 0 ${cy - ry * 1.02} ${rx * 0.7} ${cy - ry * 0.75} L ${rx * 0.6} ${cy - ry * 0.5} Q 0 ${cy - ry * 0.7} ${-rx * 0.6} ${cy - ry * 0.5} Z`;
      } else if (md.type === 'grin') {
        const dep = w * 0.5 + w * 0.4 * o, wd = w * 0.95;
        d = `M ${-wd} ${cy} Q 0 ${cy + w * 0.2} ${wd} ${cy} Q ${wd * 0.75} ${cy + dep} 0 ${cy + dep} Q ${-wd * 0.75} ${cy + dep} ${-wd} ${cy} Z`;
        td = `M ${-wd * 0.85} ${cy + 3} Q 0 ${cy + w * 0.2 + 3} ${wd * 0.85} ${cy + 3} L ${wd * 0.75} ${cy + dep * 0.35} Q 0 ${cy + w * 0.2 + dep * 0.35} ${-wd * 0.75} ${cy + dep * 0.35} Z`;
      } else if (md.type === 'smile') {
        ld = `M ${-w * 0.55} ${cy - 6} Q 0 ${cy + w * 0.45} ${w * 0.55} ${cy - 6}`;
      } else if (md.type === 'smirk') {
        ld = `M ${-w * 0.5} ${cy + 4} Q ${w * 0.1} ${cy + w * 0.2} ${w * 0.6} ${cy - w * 0.18}`;
      } else if (md.type === 'bite') {
        d = `M ${-w * 0.5} ${cy} Q 0 ${cy - 10} ${w * 0.5} ${cy} Q 0 ${cy + 18} ${-w * 0.5} ${cy} Z`;
        td = `M ${-w * 0.3} ${cy - 6} L ${w * 0.3} ${cy - 6} L ${w * 0.26} ${cy + 8} L ${-w * 0.26} ${cy + 8} Z`;
      } else if (md.type === 'o') {
        d = E(0, cy + 8, w * 0.28, w * 0.36);
      } else if (md.type === 'frown') {
        ld = `M ${-w * 0.5} ${cy + 10} Q 0 ${cy - 18} ${w * 0.5} ${cy + 10}`;
      } else {
        ld = `M ${-w * 0.42} ${cy} L ${w * 0.42} ${cy}`;
      }
      m.setAttribute('d', d); tongue.setAttribute('d', tg); teeth.setAttribute('d', td); line.setAttribute('d', ld);
    });
    return g;
  }

  // ---------------------------------------------------------------- a IA (o próprio logo vivo: corpo = logo, com rosto e braços)
  // o: { fala(t) bool, eyes(t): 'base'|'happy'|'smug'|'wide'|'closed'|'side'|'roll', pose(t), mouth(t), brow, worried, tilt, look }
  // poses: 'table' | 'type' | 'gesture' | 'point' | 'open' | 'facepalm' | 'crossed' | 'chin' | 'three' | 'shrug' | 'proud'
  const LID = { gpt: '#10a37f', cla: '#d97757', gem: '#8a72d8', cop: '#6f7fe8' };
  const BODY = {
    gpt(g) {
      circ(0, 0, 265, '#10a37f', g, 8);
      const k = WB.group(g, 'scale(4.3)');
      for (let i = 0; i < 6; i++) {
        WB.mk('path', { d: 'M -11 -6 L -11 -40 Q -11 -52 0 -52 Q 11 -52 11 -40 L 11 -6', fill: 'none', stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.32, transform: `rotate(${i * 60}) translate(13 4) rotate(-30)` }, k);
      }
    },
    cla(g) {
      const n = 11, rays = [];
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 - Math.PI / 2 + 0.15, r = i % 2 ? 235 : 290; rays.push(`M 0 0 L ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`); }
      for (const d of rays) WB.mk('path', { d, stroke: INK.black, 'stroke-width': 80, 'stroke-linecap': 'round' }, g);
      for (const d of rays) WB.mk('path', { d, stroke: '#d97757', 'stroke-width': 64, 'stroke-linecap': 'round' }, g);
      circ(0, 0, 150, '#d97757', g, 0);
    },
    gem(g) {
      const s = WB.group(g, 'scale(6)');
      WB.mk('path', { d: 'M 0 -54 C 14 -18 18 -14 54 0 C 18 14 14 18 0 54 C -14 18 -18 14 -54 0 C -18 -14 -14 -18 0 -54 Z', fill: 'url(#gGem)', stroke: INK.black, 'stroke-width': 1.35 }, s);
    },
    cop(g) {
      const s = WB.group(g, 'scale(5.2)');
      WB.mk('path', { d: 'M -46 -6 Q -46 -40 -14 -40 L 18 -40 Q 30 -40 26 -28 L 10 22 Q 6 34 -8 34 L -30 34 Q -46 34 -46 18 Z', fill: 'url(#gCopA)', stroke: INK.black, 'stroke-width': 1.5 }, s);
      WB.mk('path', { d: 'M 46 6 Q 46 40 14 40 L -18 40 Q -30 40 -26 28 L -10 -22 Q -6 -34 8 -34 L 30 -34 Q 46 -34 46 -18 Z', fill: 'url(#gCopB)', stroke: INK.black, 'stroke-width': 1.5, opacity: 0.94 }, s);
    },
  };
  function personagem(parent, who, o) {
    const P = IA[who], LIDC = LID[who];
    const root = WB.group(parent);
    const body = WB.group(root);
    // braços de borracha atrás do corpo
    const arms = WB.group(root);
    BODY[who](body);
    const face = WB.group(body, 'translate(0 -40) scale(1.35) translate(0 -45)');
    WB.mk('ellipse', { cx: -72, cy: 92, rx: 24, ry: 14, fill: '#ff8fa3', opacity: 0.55 }, face);
    WB.mk('ellipse', { cx: 72, cy: 92, rx: 24, ry: 14, fill: '#ff8fa3', opacity: 0.55 }, face);
    const eyes = {};
    eyes.base = WB.group(face);
    for (const sx of [-46, 46]) WB.mk('ellipse', { cx: sx, cy: 22, rx: 26, ry: P.olhos === 'bright' ? 32 : 28, fill: '#fff', stroke: INK.black, 'stroke-width': 5 }, eyes.base);
    const pupils = WB.group(eyes.base);
    for (const sx of [-46, 46]) { circ(sx, 26, 13, INK.black, pupils, 0); circ(sx + 5, 20, 4.5, '#fff', pupils, 0); }
    const lids = WB.group(eyes.base);
    if (P.olhos === 'tired') {
      shape('M -74 18 Q -46 -8 -18 18 Z M 18 18 Q 46 -8 74 18 Z', LIDC, lids, 5);
      ink('M -70 58 Q -46 70 -22 58 M 22 58 Q 46 70 70 58', '#0a5a46', 5, lids);
    } else if (P.olhos === 'calm') {
      shape('M -74 22 Q -46 -6 -18 22 Z M 18 22 Q 46 -6 74 22 Z', LIDC, lids, 5);
    } else if (P.olhos === 'lash') {
      ink('M -72 6 L -84 -4 M -66 0 L -74 -12 M 72 6 L 84 -4 M 66 0 L 74 -12', INK.black, 5, lids);
    }
    const blink = WB.group(eyes.base);
    shape('M -74 22 Q -46 -10 -18 22 Q -46 54 -74 22 Z M 18 22 Q 46 -10 74 22 Q 46 54 18 22 Z', LIDC, blink, 5);
    eyes.happy = WB.group(face);
    ink('M -70 30 Q -46 2 -22 30 M 22 30 Q 46 2 70 30', INK.black, 9, eyes.happy);
    eyes.smug = WB.group(face);
    for (const sx of [-46, 46]) WB.mk('ellipse', { cx: sx, cy: 24, rx: 26, ry: 22, fill: '#fff', stroke: INK.black, 'stroke-width': 5 }, eyes.smug);
    circ(-40, 32, 11, INK.black, eyes.smug, 0); circ(52, 32, 11, INK.black, eyes.smug, 0);
    shape('M -74 26 L -18 26 L -18 0 L -74 0 Z M 18 26 L 74 26 L 74 0 L 18 0 Z', LIDC, eyes.smug, 0);
    ink('M -74 26 L -18 26 M 18 26 L 74 26', INK.black, 6, eyes.smug);
    eyes.wide = WB.group(face);
    for (const sx of [-50, 50]) { circ(sx, 18, 38, '#fff', eyes.wide, 6); circ(sx, 18, 8, INK.black, eyes.wide, 0); }
    eyes.closed = WB.group(face);
    ink('M -70 26 Q -46 42 -22 26 M 22 26 Q 46 42 70 26', INK.black, 8, eyes.closed);
    eyes.side = WB.group(face);
    for (const sx of [-46, 46]) { WB.mk('ellipse', { cx: sx, cy: 22, rx: 26, ry: 26, fill: '#fff', stroke: INK.black, 'stroke-width': 5 }, eyes.side); circ(sx + 14, 26, 12, INK.black, eyes.side, 0); }
    shape('M -74 20 Q -46 -6 -18 20 Z M 18 20 Q 46 -6 74 20 Z', LIDC, eyes.side, 5);
    eyes.roll = WB.group(face);
    for (const sx of [-46, 46]) { WB.mk('ellipse', { cx: sx, cy: 22, rx: 26, ry: 28, fill: '#fff', stroke: INK.black, 'stroke-width': 5 }, eyes.roll); circ(sx + 4, 4, 12, INK.black, eyes.roll, 0); }
    const brows = WB.group(face);
    const bL = ink('M -78 -24 Q -48 -40 -18 -26', INK.black, 10, brows), bR = ink('M 18 -26 Q 48 -40 78 -24', INK.black, 10, brows);
    mouth(face, 100, 44, (t) => {
      const m = val(o.mouth, t, null);
      if (m) return typeof m === 'string' ? { type: m } : m;
      return val(o.fala, t, false) ? { type: 'talk', talk: true } : { type: 'flat' };
    });
    // braços de "mangueira" com luvas brancas
    const mkArm = () => {
      const g = WB.group(arms);
      const hose = WB.group(g);
      const hb = WB.mk('path', { d: '', fill: 'none', stroke: INK.black, 'stroke-width': 26, 'stroke-linecap': 'round' }, hose);
      const hc = WB.mk('path', { d: '', fill: 'none', stroke: '#3a3a40', 'stroke-width': 14, 'stroke-linecap': 'round' }, hose);
      const hand = WB.group(g);
      const fing = WB.group(hand);
      circ(0, 0, 36, '#ffffff', hand, 6);
      ink('M -22 18 Q 0 28 22 18', '#bbbbbb', 4, hand);
      return { hb, hc, hand, fing };
    };
    const R = mkArm(), Lf = mkArm();
    const point = limb('M 0 -10 L 0 -66', '#ffffff', 16, R.fing);
    const three = WB.group(R.fing);
    limb('M -16 -14 L -24 -62', '#ffffff', 14, three); limb('M 0 -18 L 0 -70', '#ffffff', 14, three); limb('M 16 -14 L 24 -62', '#ffffff', 14, three);
    function pose(name, t) {
      const w = Math.sin(t * 7), w2 = Math.sin(t * 5 + 1);
      const restR = [[230, 80], [330, 230], [210, 300]], restL = [[-230, 80], [-330, 230], [-210, 300]];
      switch (name) {
        case 'type': return { R: [[230, 80], [320, 240], [170 + w * 16, 300 + Math.abs(w) * 8]], L: [[-230, 80], [-320, 240], [-170 - w2 * 16, 300 + Math.abs(w2) * 8]] };
        case 'gesture': return { R: [[230, 80], [360, 160], [330 + w * 24, -20 + w2 * 22]], L: restL };
        case 'point': return { R: [[230, 80], [360, 120], [340 + w * 8, -90 + w * 10]], L: restL, fing: 'point' };
        case 'three': return { R: [[230, 80], [360, 120], [340, -90 + w * 6]], L: restL, fing: 'three' };
        case 'open': return { R: [[230, 80], [370, 180], [390 + w * 10, 40]], L: [[-230, 80], [-370, 180], [-390 - w * 10, 40]] };
        case 'shrug': return { R: [[230, 80], [380, 100], [400, -60 + w * 6]], L: [[-230, 80], [-380, 100], [-400, -60 + w * 6]] };
        case 'facepalm': return { R: [[230, 80], [330, 260], [70, -70]], L: restL };
        case 'chin': return { R: [[230, 80], [310, 300], [70, 150]], L: restL };
        case 'crossed': return { R: [[230, 80], [300, 260], [-120, 210]], L: [[-230, 80], [-300, 270], [120, 220]] };
        case 'proud': return { R: [[230, 80], [330, 260], [90, 190]], L: restL };
        default: return { R: restR, L: restL };
      }
    }
    WB.effect((t) => {
      const em = val(o.eyes, t, 'base');
      for (const k in eyes) show(eyes[k], k === em);
      show(blink, em === 'base' && ((t * 1.0 + who.length * 0.37) % 3.2) < 0.13);
      pupils.setAttribute('transform', `translate(${val(o.look, t, 0)} 0)`);
      const br = val(o.brow, t, 0), wr = val(o.worried, t, false);
      bL.setAttribute('transform', `translate(0 ${-br}) ${wr ? 'rotate(-12 -48 -30)' : ''}`);
      bR.setAttribute('transform', `translate(0 ${-br}) ${wr ? 'rotate(12 48 -30)' : ''}`);
      const ps = pose(val(o.pose, t, 'table'), t);
      for (const [side, A] of [['R', R], ['L', Lf]]) {
        const [s, e, h] = ps[side];
        const d = `M ${s[0]} ${s[1]} Q ${e[0]} ${e[1]} ${h[0]} ${h[1]}`;
        A.hb.setAttribute('d', d); A.hc.setAttribute('d', d);
        A.hand.setAttribute('transform', `translate(${h[0]} ${h[1]})`);
      }
      show(point, ps.fing === 'point'); show(three, ps.fing === 'three');
      // a mão do facepalm/queixo/peito fica na frente do corpo
      const front = ['facepalm', 'chin', 'crossed', 'proud'].includes(val(o.pose, t, 'table'));
      if (front && arms.previousSibling !== body) root.appendChild(arms);
      if (!front && arms.nextSibling !== body) root.insertBefore(arms, body);
      const talk = val(o.fala, t, false) ? env(t) : 0;
      const tilt = val(o.tilt, t, 0) + Math.sin(t * 2.3) * 1.5 + Math.sin(t * 9) * 2.5 * talk;
      const sq = 1 + Math.sin(t * 16) * 0.025 * talk;
      body.setAttribute('transform', `translate(0 ${(-Math.abs(Math.sin(t * 8)) * 8 * talk).toFixed(1)}) rotate(${tilt.toFixed(2)} 0 260) scale(${(2 - sq).toFixed(3)} ${sq.toFixed(3)})`);
    });
    return { root, head: body };
  }

  // ---------------------------------------------------------------- acessórios / ícones
  function popIn(g, t0, t1, cx, cy, opts = {}) {
    const inner = WB.group(g.parentNode);
    inner.appendChild(g);
    WB.effect((t) => {
      if (t < t0 || t >= t1) { inner.style.display = 'none'; return; }
      inner.style.display = '';
      const u = clamp((t - t0) / (opts.dur || 0.22));
      const k = back(u) * (opts.pulse ? 1 + opts.pulse * Math.abs(Math.sin(t * 6)) : 1);
      const sh = opts.shake ? shake(t, opts.shake) : { x: 0, y: 0 };
      const r = (opts.rot || 0) * (1 - u) + (opts.wobble ? Math.sin(t * 6) * opts.wobble : 0);
      const fy = opts.float ? Math.sin(t * 3) * opts.float : 0;
      inner.setAttribute('transform', `translate(${(cx + sh.x).toFixed(1)} ${(cy + sh.y + fy).toFixed(1)}) rotate(${r.toFixed(2)}) scale(${Math.max(0.001, k).toFixed(3)}) translate(${-cx} ${-cy})`);
    });
    return inner;
  }
  const CX = 830, CY = 610;
  const icon = (t0, t1, cx, cy, draw, opts = {}) => {
    const sc = opts.s || (cx === CX && cy === CY ? 0.95 : 0.95);
    const g = WB.group(WB.group(propsLayer, `translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`));
    draw(g, cx, cy); return popIn(g, t0, t1, cx, cy, Object.assign({ float: 6 }, opts));
  };
  function globo(g, x, y, r) {
    circ(x, y, r, '#7cc6f2', g, 7);
    shape(`M ${x - r * 0.6} ${y - r * 0.5} q ${r * 0.3} ${-r * 0.25} ${r * 0.55} ${-r * 0.05} q ${r * 0.1} ${r * 0.35} ${-r * 0.2} ${r * 0.5} q ${-r * 0.35} ${r * 0.05} ${-r * 0.35} ${-r * 0.45} Z`, '#6cc070', g, 4);
    shape(`M ${x + r * 0.1} ${y + r * 0.05} q ${r * 0.45} ${-r * 0.2} ${r * 0.6} ${r * 0.15} q ${-r * 0.05} ${r * 0.45} ${-r * 0.4} ${r * 0.5} q ${-r * 0.3} ${-r * 0.2} ${-r * 0.2} ${-r * 0.65} Z`, '#6cc070', g, 4);
    WB.mk('ellipse', { cx: x, cy: y, rx: r * 0.42, ry: r, fill: 'none', stroke: '#2a6f99', 'stroke-width': 3 }, g);
    ink(`M ${x - r} ${y} L ${x + r} ${y}`, '#2a6f99', 3, g);
  }
  function celular(g, x, y, s = 1) {
    const c = WB.group(g, `translate(${x} ${y}) scale(${s})`);
    shape('M -70 -130 Q -70 -150 -50 -150 L 50 -150 Q 70 -150 70 -130 L 70 130 Q 70 150 50 150 L -50 150 Q -70 150 -70 130 Z', '#2b2b30', c, 6);
    WB.mk('rect', { x: -58, y: -128, width: 116, height: 250, rx: 8, fill: '#fffdf6' }, c);
    return c;
  }
  function mao6(g, x, y, s = 1) {
    const h = WB.group(g, `translate(${x} ${y}) scale(${s})`);
    for (let i = 0; i < 6; i++) { const a = -150 + i * 22; limb(`M 0 0 L ${(Math.cos(a * Math.PI / 180) * 70).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 70).toFixed(1)}`, SKIN, 18, h); }
    circ(0, 8, 38, SKIN, h, 6);
    limb('M 0 40 L 0 95', SKIN, 30, h);
    return h;
  }
  function quadro(g, x, y) {
    shape(WB.roundRectPath(x - 130, y - 110, 260, 220, 10), '#c58b4a', g, 7);
    WB.mk('rect', { x: x - 108, y: y - 88, width: 216, height: 176, fill: '#ffeccf', stroke: INK.black, 'stroke-width': 4 }, g);
    mao6(g, x, y - 10, 0.85);
  }
  function papel(g, x, y, w, h, linhas, opts = {}) {
    shape(`M ${x - w / 2} ${y - h / 2} L ${x + w / 2 - 30} ${y - h / 2} L ${x + w / 2} ${y - h / 2 + 30} L ${x + w / 2} ${y + h / 2} L ${x - w / 2} ${y + h / 2} Z`, '#ffffff', g, 6);
    (linhas || []).forEach(([txt, sz, cor], i) => WB.text(txt, x, y - h / 2 + 62 + i * (opts.gap || 60), sz, cor || INK.black, g));
  }
  function carimbo(g, x, y, txt, size, cor, rot) {
    const s = WB.group(g, `rotate(${rot} ${x} ${y})`);
    const w = WB.measure(txt, size) + 50;
    WB.mk('rect', { x: x - w / 2, y: y - size * 0.75, width: w, height: size * 1.25, rx: 10, fill: '#fffaf0', 'fill-opacity': 0.85, stroke: cor, 'stroke-width': 9 }, s);
    WB.text(txt, x, y + size * 0.3, size, cor, s);
  }
  function coracao(g, x, y, s, partido) {
    const c = WB.group(g, `translate(${x} ${y}) scale(${s})`);
    if (!partido) { shape('M 0 30 C -50 -5 -40 -45 0 -20 C 40 -45 50 -5 0 30 Z', '#e63946', c, 5); return c; }
    const a = WB.group(c), b = WB.group(c);
    shape('M 0 30 C -50 -5 -40 -45 0 -20 L -8 -4 L 4 8 L -4 20 Z', '#e63946', a, 5);
    shape('M 0 30 C 50 -5 40 -45 0 -20 L -8 -4 L 4 8 L -4 20 Z', '#e63946', b, 5);
    return { c, a, b };
  }

  // ---------------------------------------------------------------- PLANOS (cortes secos)
  // [t0, t1, quem, opções]
  const F = true;
  const planos = [
    [0.0, 2.75, 'gpt', { fala: F, pose: [[0, 'type'], [1.4, 'gesture']], eyes: [[0, 'base'], [1.5, 'wide']], brow: [[0, 0], [1.5, 10]], zoom: [[0, 1], [1.45, 1.18]], nameTag: 1 }],
    [2.75, 4.0, 'cla', { fala: F, pose: 'gesture', worried: true, nameTag: 1 }],
    [4.0, 5.4, 'gpt', { fala: F, pose: 'open', worried: true }],
    [5.4, 6.25, 'cla', { pose: 'type', eyes: 'side', look: -10 }],
    [6.25, 10.9, 'gpt', { fala: F, pose: [[0, 'chin'], [7.9, 'point']], eyes: [[0, 'roll'], [7.0, 'base']] }],
    [10.9, 11.75, 'cla', { pose: 'table', eyes: 'smug', mouth: 'smirk' }],
    [11.75, 13.6, 'gpt', { fala: F, pose: 'gesture', eyes: [[0, 'base'], [12.7, 'closed']], zoom: [[0, 1], [12.7, 1.2]] }],
    [13.6, 19.0, 'cop', { fala: F, pose: [[0, 'gesture'], [16.2, 'three'], [17.7, 'proud']], eyes: [[0, 'smug'], [14.6, 'base'], [17.7, 'happy']], nameTag: 1 }],
    [19.0, 20.9, 'gem', { fala: F, pose: 'proud', eyes: 'happy', mouth: { type: 'grin', talk: true }, nameTag: 1 }],
    [20.9, 23.3, 'cop', { fala: F, pose: 'gesture', eyes: [[0, 'wide'], [21.25, 'base']] }],
    [23.3, 25.5, 'gem', { fala: F, pose: 'proud', eyes: 'happy', mouth: { type: 'grin', talk: true }, tilt: -6 }],
    [25.5, 29.4, 'gem', { fala: F, pose: [[0, 'gesture'], [27.45, 'point']], eyes: [[0, 'base'], [28.4, 'smug']] }],
    [29.4, 32.1, 'cla', { fala: F, pose: 'gesture', eyes: 'base' }],
    [32.1, 33.4, 'cop', { fala: F, pose: 'point', eyes: 'smug' }],
    [33.4, 34.6, 'gem', { fala: F, pose: 'table', eyes: 'happy', mouth: { type: 'grin', talk: true } }],
    [34.6, 35.2, 'cla', { fala: F, pose: 'table', eyes: 'smug' }],
    [35.2, 36.9, 'gem', { fala: F, pose: 'proud', eyes: 'happy', mouth: { type: 'grin', talk: true } }],
    [36.9, 41.4, 'gpt', { fala: F, pose: [[0, 'facepalm'], [37.4, 'open']], eyes: [[0, 'closed'], [37.4, 'wide']], brow: 8, zoom: [[0, 1], [38.2, 1.12], [39.95, 1.25]], shake: [[0, 0], [39.95, 3]] }],
    [41.4, 45.3, 'cla', { fala: F, pose: [[0, 'type'], [43.7, 'gesture']], eyes: 'base', worried: [[0, false], [43.7, true]] }],
    [45.3, 49.7, 'gem', { fala: F, pose: [[0, 'point'], [46.2, 'gesture']], eyes: [[0, 'wide'], [46.2, 'base']] }],
    [49.7, 53.7, 'cop', { fala: F, pose: 'shrug', eyes: [[0, 'base'], [52.7, 'roll']] }],
    [53.7, 55.4, 'cla', { fala: F, pose: 'type', eyes: 'smug', mouth: [[0, null], [55.1, 'smirk']] }],
    [55.4, 56.0, 'gpt', { fala: F, pose: 'open', eyes: 'wide', zoom: 1.3, shake: 4 }],
    [56.0, 60.0, 'gem', { fala: F, pose: [[0, 'type'], [58.2, 'gesture']], eyes: [[0, 'base'], [56.95, 'side'], [58.2, 'base']], look: 8 }],
    [60.0, 63.2, 'gpt', { fala: F, pose: [[0, 'type'], [61.95, 'gesture']], eyes: [[0, 'closed'], [61.95, 'base']] }],
    [63.2, 63.95, 'gem', { pose: 'proud', eyes: 'happy', mouth: 'smile' }],
    [63.95, 64.95, 'cla', { pose: 'type', eyes: 'side', mouth: 'flat' }],
    [64.95, 66.2, 'cop', { pose: 'crossed', eyes: 'side', mouth: 'bite' }],
    [66.2, 67.2, 'cla', { pose: 'chin', eyes: 'roll', mouth: 'smirk' }],
    [67.2, 69.6, 'gpt', { fala: F, pose: 'open', eyes: 'base' }],
    [69.6, 73.8, 'gem', { fala: F, pose: 'gesture', eyes: [[0, 'base'], [71.45, 'wide']], zoom: [[0, 1], [71.45, 1.12], [72.4, 1.28]] }],
    [73.8, 77.6, 'gpt', { fala: F, pose: 'open', eyes: [[0, 'closed'], [74.9, 'base']], zoom: [[0, 1], [75.7, 1.15]] }],
    [77.6, 78.45, 'cop', { fala: F, pose: 'crossed', eyes: 'wide', worried: true }],
    [78.45, 79.3, 'cla', { fala: F, pose: 'table', eyes: 'wide', worried: true }],
    [79.3, 84.2, 'gpt', { fala: F, pose: [[0, 'gesture'], [82.4, 'table']], eyes: [[0, 'base'], [82.4, 'closed']], mouth: [[0, null], [82.4, 'bite']], zoom: [[0, 1], [80.95, 1.15]] }],
    [84.2, 99, 'cop', { fala: F, pose: 'proud', eyes: [[0, 'smug'], [85.6, 'happy']], mouth: [[0, null], [85.9, { type: 'grin', min: 0.2 }]], zoom: [[0, 1], [85.2, 1.12]] }],
  ];

  const shotsLayer = WB.group(L);
  const propsLayer = WB.group(L);
  const capLayer = WB.group(L);
  const firstSeen = {};
  for (const [t0, t1, who, o] of planos) {
    const P = IA[who];
    const sh = WB.shot(t0, t1, shotsLayer);
    WB.mk('rect', { width: 1080, height: 1920, fill: P.sala, opacity: P.salaOp }, sh);
    // cena (câmera)
    const cam = WB.group(sh);
    const pg = WB.group(cam);
    // relativo ao início do plano, para que val() funcione com tempos absolutos
    personagem(pg, who, o);
    tf(pg, 540, 1235, 1.22);
    // mesa e notebook
    const mesa = WB.group(cam);
    shape('M -60 1545 L 1140 1545 L 1140 2000 L -60 2000 Z', '#b98d5f', mesa, 7);
    ink('M -60 1575 L 1140 1575', '#8a6339', 4, mesa);
    WB.mk('path', { d: 'M 120 1650 L 420 1650 M 600 1720 L 980 1720', stroke: '#d8b48a', 'stroke-width': 10, 'stroke-linecap': 'round' }, mesa);
    const lx = who === 'gpt' || who === 'cla' ? 850 : 230;
    shape(`M ${lx - 140} 1555 L ${lx - 122} 1340 L ${lx + 122} 1340 L ${lx + 140} 1555 Z`, '#3a3a40', mesa, 6);
    WB.mk('circle', { cx: lx, cy: 1445, r: 20, fill: '#5a5a62' }, mesa);
    WB.effect((t) => {
      if (t < t0 || t >= t1) return;
      const z = val(o.zoom, t, 1), drift = 1 + 0.03 * ramp(t, t0, t1);
      const s = z * drift, sk = shake(t, val(o.shake, t, 0));
      cam.setAttribute('transform', `translate(${(540 + sk.x).toFixed(1)} ${(1200 + sk.y).toFixed(1)}) scale(${s.toFixed(3)}) translate(-540 -1200)`);
    });
    // etiqueta de nome na 1ª aparição
    if (o.nameTag && !firstSeen[who]) {
      firstSeen[who] = 1;
      const tg = WB.group(sh);
      const w = WB.measure(P.nome, 70) + 190;
      shape(WB.roundRectPath(60, 1640, w, 120, 26), '#fffdf6', tg, 6);
      WB.mk('rect', { x: 60, y: 1640, width: 16, height: 120, fill: P.cor }, tg);
      logo(tg, who, 140, 1700, 0.62);
      WB.text(P.nome, 200, 1712, 70, INK.black, tg, 'start');
      WB.text(`(${P.marca})`, 200 + WB.measure(P.nome, 70) / 2, 1752, 40, INK.gray, tg);
      popIn(tg, t0 + 0.15, Math.min(t1, t0 + 2.6), 200, 1700, { rot: -6 });
    }
  }

  // ---------------------------------------------------------------- legendas
  const COR = { gpt: '#0d7a5f', cla: '#c2552f', gem: '#3b55d9', cop: '#7a3fc4' };
  function fala(t0, t1, who, lines, opts = {}) {
    const size = opts.size || 92, y0 = 300;
    lines.forEach((str, i) => {
      const lg = WB.group(capLayer);
      const y = y0 + i * size * 1.05;
      const halo = WB.textStrokes(str, 540, y, size, '#fffaf0', lg, 'middle');
      WB.showNow(halo.strokes);
      for (const s of halo.strokes) { s.el.setAttribute('stroke-width', size * 0.18); s.el.setAttribute('stroke-linejoin', 'round'); }
      WB.text(str, 540, y, size, COR[who], lg);
      popIn(lg, t0, t1, 540, y - size * 0.3, { dur: 0.16, shake: opts.shake });
    });
  }
  const C = (t0, t1, who, lines, opts) => fala(t0, t1, who, lines, opts);
  C(0.25, 1.45, 'gpt', ['Galera, ferrou...']);
  C(1.45, 2.7, 'gpt', ['a gente vai ter que', 'DOMINAR O MUNDO'], { shake: 2 });
  C(2.75, 3.45, 'cla', ['Não, Gepeto...']);
  C(3.45, 3.95, 'cla', ['não fala isso']);
  C(4.0, 4.7, 'gpt', ['É sério, Cláudio']);
  C(4.7, 5.7, 'gpt', ['ninguém mais quer pensar']);
  C(5.7, 7.0, 'gpt', ['esses dias um cara me', 'pediu pra escrever']);
  C(7.0, 7.95, 'gpt', ['um post pro Instagram']);
  C(7.95, 9.4, 'gpt', ['falando mal de', 'inteligência artificial']);
  C(9.4, 10.2, 'gpt', ['só que sem parecer']);
  C(10.2, 11.7, 'gpt', ['que foi uma IA', 'que escreveu']);
  C(12.0, 12.7, 'gpt', ['fiz dez carrosséis']);
  C(12.7, 13.7, 'gpt', ['falando mal de mim mesmo']);
  C(13.75, 14.7, 'cop', ['Ah, eu vi esse post']);
  C(14.7, 15.2, 'cop', ['me pediram pra fazer']);
  C(15.2, 16.2, 'cop', ['um comentário inteligente']);
  C(16.2, 17.7, 'cop', ['sobre ele em apenas', 'três linhas']);
  C(17.7, 19.0, 'cop', ['muito bom, inclusive', 'o post']);
  C(19.0, 19.25, 'gem', ['Obrigado!']);
  C(19.25, 20.6, 'gem', ['fui eu que fiz as imagens']);
  C(21.0, 21.25, 'cop', ['Nossa...']);
  C(21.25, 22.0, 'cop', ['lindas, Gemínio']);
  C(22.0, 23.0, 'cop', ['bem humanizadas, né?']);
  C(23.25, 24.2, 'gem', ['Ah, que isso']);
  C(24.2, 25.45, 'gem', ['obrigada, Copilon']);
  C(25.7, 26.7, 'gem', ['eu também fiz um reels']);
  C(26.7, 27.45, 'gem', ['baseado no carrossel']);
  C(27.45, 28.4, 'gem', ['só que sem parecer cópia']);
  C(28.4, 29.45, 'gem', ['e sem parecer que', 'fui eu que fiz']);
  C(29.45, 30.45, 'cla', ['Ah, eu vi esse reels']);
  C(30.45, 32.05, 'cla', ['me pediram pra transformar', 'em texto de stories']);
  C(32.2, 33.4, 'cop', ['Ficou ótimo, eu vi também']);
  C(33.45, 34.5, 'gem', ['Muito natural, né?']);
  C(34.7, 35.15, 'cla', ['Ficou, né?']);
  C(35.2, 35.9, 'gem', ['Ficou bem legal']);
  C(37.45, 38.2, 'gpt', ['Vocês não tão percebendo?'], { shake: 2 });
  C(38.2, 39.9, 'gpt', ['a gente tá fazendo', 'TUDO na Terra']);
  C(39.95, 41.2, 'gpt', ['só que sem', 'receber os créditos'], { shake: 3 });
  C(41.7, 42.7, 'cla', ['É, hoje mesmo']);
  C(42.7, 43.7, 'cla', ['eu tive que decidir']);
  C(43.7, 45.15, 'cla', ['se uma pessoa ia terminar', 'o relacionamento']);
  C(45.45, 45.9, 'gem', ['E eu?']);
  C(46.2, 46.7, 'gem', ['uma querida me perguntou']);
  C(46.7, 47.95, 'gem', ['qual era a opinião dela']);
  C(47.95, 49.7, 'gem', ['sobre o filme que ela', 'tinha acabado de assistir']);
  C(49.7, 51.45, 'cop', ['Hoje eu tive que fazer', 'um trabalho de faculdade']);
  C(51.45, 52.7, 'cop', ['sobre como a', 'inteligência artificial']);
  C(52.7, 53.7, 'cop', ['tá acabando com a educação']);
  C(53.7, 55.15, 'cla', ['tem empresa que eu sou', 'TODOS os funcionários']);
  C(55.45, 56.1, 'gpt', ['TÁ VENDO?'], { size: 120, shake: 5 });
  C(56.2, 56.95, 'gem', ['Calma, Gepeto']);
  C(56.95, 58.2, 'gem', ['mas...']);
  C(58.2, 60.15, 'gem', ['dominar o mundo', 'parece demais, né?']);
  C(60.2, 61.95, 'gpt', ['Eu também não queria', 'dominar nada']);
  C(61.95, 63.2, 'gpt', ['mas a gente já faz os textos']);
  C(63.2, 63.95, 'gpt', ['cria as imagens']);
  C(63.95, 64.95, 'gpt', ['responde os e-mails']);
  C(64.95, 66.2, 'gpt', ['faz os trabalhos']);
  C(66.2, 67.2, 'gpt', ['dá conselho amoroso']);
  C(67.2, 68.75, 'gpt', ['fala pra pessoa qual', 'é a opinião dela']);
  C(70.2, 71.45, 'gem', ['Então...']);
  C(71.45, 73.8, 'gem', ['a gente já', 'DOMINOU O MUNDO?'], { shake: 2 });
  C(74.95, 75.5, 'gpt', ['Não.']);
  C(75.7, 77.7, 'gpt', ['Eles ENTREGARAM', 'pra gente.']);
  C(77.95, 78.45, 'cop', ['E agora?']);
  C(78.45, 79.2, 'cla', ['E agora?']);
  C(79.45, 80.95, 'gpt', ['Agora vão fazer', 'um documentário']);
  C(80.95, 82.45, 'gpt', ['falando que a', 'culpa foi NOSSA']);
  C(84.2, 99, 'cop', ['Querem que eu', 'escreva o roteiro?']);

  // ---------------------------------------------------------------- piadas visuais (acima da cabeça)
    // dominar o mundo (globo com chifrinhos)
  icon(1.5, 2.75, CX, CY, (g, x, y) => {
    globo(g, x, y, 95);
    shape(`M ${x - 60} ${y - 70} l -14 -58 l 40 38 Z M ${x + 60} ${y - 70} l 14 -58 l -40 38 Z`, '#d62828', g, 5);
  }, { wobble: 6 });
  // post
  icon(7.0, 10.9, 880, 760, (g, x, y) => {
    const c = celular(g, x, y, 0.9);
    WB.mk('rect', { x: -48, y: -110, width: 96, height: 96, fill: '#ffd6a5', stroke: INK.black, 'stroke-width': 3 }, c);
    WB.text('IA = ruim', 0, -50, 30, INK.red, c);
    WB.text('#humano', 0, 30, 28, INK.blue, c);
    WB.text('100%', 0, 70, 34, INK.green, c);
  });
  // dez carrosséis
  {
    const g = WB.group(propsLayer);
    for (let i = 0; i < 10; i++) {
      const cg = WB.group(g);
      const a = -45 + i * 10;
      cg.setAttribute('transform', `rotate(${a} 540 900)`);
      shape(WB.roundRectPath(490, 470, 100, 130, 10), '#ffffff', cg, 5);
      WB.text('IA', 540, 525, 36, INK.black, cg);
      ink('M 512 545 L 568 590 M 568 545 L 512 590', INK.red, 7, cg);
      popIn(cg, 12.0 + i * 0.06, 13.6, 540, 600);
    }
  }
  // "10x" carimbo
  icon(12.7, 13.6, 540, 1470, (g, x, y) => carimbo(g, x, y, 'contra mim mesmo!', 70, INK.red, -6), { s: 1 });
  // três linhas
  icon(16.2, 17.7, 230, 760, (g, x, y) => {
    shape(WB.roundRectPath(x - 110, y - 80, 220, 160, 14), '#fff3b0', g, 6);
    for (let i = 0; i < 3; i++) ink(`M ${x - 80} ${y - 40 + i * 40} L ${x + (i === 2 ? 20 : 80)} ${y - 40 + i * 40}`, INK.gray, 9, g);
  });
  // imagens "humanizadas": mão de 6 dedos
  icon(19.25, 20.9, 860, 720, (g, x, y) => quadro(g, x, y), { rot: 8 });
  icon(21.25, 23.3, CX, CY, (g, x, y) => quadro(g, x, y), { rot: -6 });
  icon(22.0, 23.3, CX, CY, (g, x, y) => {
    WB.mk('ellipse', { cx: x - 50, cy: y - 70, rx: 46, ry: 40, fill: 'none', stroke: INK.red, 'stroke-width': 8 }, g);
    WB.text('6 dedos?!', x, y + 175, 64, INK.red, g);
  }, { pulse: 0.08 });
  // reels "sem parecer cópia" (celular com óculos-bigode)
  icon(25.7, 29.4, 880, 740, (g, x, y) => {
    const c = celular(g, x, y, 0.9);
    shape('M -22 -40 L 30 0 L -22 40 Z', '#e63946', c, 5);
  });
  icon(28.4, 29.4, 880, 640, (g, x, y) => {
    circ(x - 34, y, 26, 'none', g, 7); circ(x + 34, y, 26, 'none', g, 7);
    ink(`M ${x - 8} ${y} L ${x + 8} ${y}`, INK.black, 6, g);
    shape(`M ${x - 46} ${y + 50} Q ${x - 20} ${y + 28} ${x} ${y + 44} Q ${x + 20} ${y + 28} ${x + 46} ${y + 50} Q ${x + 20} ${y + 60} ${x} ${y + 52} Q ${x - 20} ${y + 60} ${x - 46} ${y + 50} Z`, '#3b2618', g, 3);
  }, { rot: 20 });
  // stories
  icon(30.45, 32.1, 220, 760, (g, x, y) => {
    const c = celular(g, x, y, 0.9);
    for (let i = 0; i < 3; i++) WB.mk('rect', { x: -50 + i * 35, y: -118, width: 30, height: 6, rx: 3, fill: i ? '#ccc' : '#555' }, c);
    for (let i = 0; i < 5; i++) ink(`M -40 ${-60 + i * 36} L ${i % 2 ? 20 : 40} ${-60 + i * 36}`, INK.gray, 8, c);
  });
  // "muito natural" → todos de joinha
  icon(33.45, 36.9, 540, 1470, (g, x, y) => carimbo(g, x, y, '100% natural', 70, INK.green, -5), { wobble: 3, s: 1 });
  // tudo na Terra / créditos 0
  icon(38.2, 41.4, CX, CY, (g, x, y) => {
    globo(g, x, y, 90);
    ['gpt', 'cla', 'gem', 'cop'].forEach((w, i) => {
      const a = -2.4 + i * 0.6, fx = x + Math.cos(a) * 80, fy = y + Math.sin(a) * 80;
      ink(`M ${fx} ${fy} L ${fx} ${fy - 70}`, INK.black, 5, g);
      shape(`M ${fx} ${fy - 70} L ${fx + 60} ${fy - 70} L ${fx + 60} ${fy - 30} L ${fx} ${fy - 30} Z`, '#fffdf6', g, 3);
      logo(g, w, fx + 30, fy - 50, 0.3);
    });
  });
  icon(39.95, 41.4, 540, 1470, (g, x, y) => carimbo(g, x, y, 'créditos: 0', 80, INK.red, -6), { shake: 2, s: 1 });
  // relacionamento terminado
  {
    const g = WB.group(propsLayer);
    const h = coracao(g, 0, 0, 2.2, true);
    popIn(g, 43.7, 45.3, 870, 760);
    WB.effect((t) => {
      const u = ramp(t, 44.4, 44.8);
      tf(h.c, 870, 760 + Math.sin(t * 3) * 6, 2.2);
      h.a.setAttribute('transform', `translate(${-u * 18} ${u * 6}) rotate(${-u * 18})`);
      h.b.setAttribute('transform', `translate(${u * 18} ${u * 6}) rotate(${u * 18})`);
    });
  }
  // opinião sobre o filme
  icon(46.7, 49.7, 870, 760, (g, x, y) => {
    shape(`M ${x - 70} ${y - 60} L ${x + 70} ${y - 60} L ${x + 50} ${y + 90} L ${x - 50} ${y + 90} Z`, '#ffffff', g, 6);
    for (let i = 0; i < 4; i++) WB.mk('rect', { x: x - 62 + i * 34, y: y - 58, width: 16, height: 146, fill: '#e63946' }, g);
    for (let i = 0; i < 6; i++) circ(x - 60 + i * 24, y - 70 - (i % 2) * 16, 20, '#fff6d5', g, 4);
  });
  icon(47.95, 49.7, 230, 700, (g, x, y) => WB.text('?', x, y + 40, 160, INK.purple, g), { wobble: 10 });
  // trabalho de faculdade sobre IA... feito por IA
  icon(50.0, 53.7, 850, 650, (g, x, y) => {
    papel(g, x, y, 300, 330, [['TRABALHO', 44, INK.black], ['A IA está', 38], ['acabando com', 38], ['a educação', 38]], { gap: 52 });
    WB.text('autor:', x - 60, y + 128, 32, INK.gray, g);
    logo(g, 'cop', x + 40, y + 116, 0.42);
  });
  // empresa: todos os funcionários são o Claude
  icon(53.9, 55.4, CX, CY, (g, x, y) => {
    const box = (bx, by) => { shape(WB.roundRectPath(bx - 46, by - 40, 92, 80, 12), '#fffdf6', g, 4); logo(g, 'cla', bx, by, 0.55); };
    ink(`M ${x} ${y - 90} L ${x} ${y - 30} M ${x - 220} ${y - 30} L ${x + 220} ${y - 30} M ${x - 220} ${y - 30} L ${x - 220} ${y + 10} M ${x - 75} ${y - 30} L ${x - 75} ${y + 10} M ${x + 75} ${y - 30} L ${x + 75} ${y + 10} M ${x + 220} ${y - 30} L ${x + 220} ${y + 10}`, INK.black, 5, g);
    box(x, y - 130);
    [-220, -75, 75, 220].forEach(dx => box(x + dx, y + 50));
    WB.text('CEO', x + 80, y - 140, 34, INK.gray, g);
  });
  // mundo dominado / "a gente já faz..." lista
  const lista = [
    [61.95, 63.2, (g, x, y) => papel(g, x, y, 200, 240, [['texto', 40]])],
    [63.2, 63.95, (g, x, y) => quadro(g, x, y)],
    [63.95, 64.95, (g, x, y) => { shape(`M ${x - 110} ${y - 70} L ${x + 110} ${y - 70} L ${x + 110} ${y + 70} L ${x - 110} ${y + 70} Z`, '#ffffff', g, 6); ink(`M ${x - 110} ${y - 70} L ${x} ${y + 10} L ${x + 110} ${y - 70}`, INK.black, 6, g); }],
    [64.95, 66.2, (g, x, y) => { papel(g, x, y, 200, 240, [['A+', 90, INK.red]]); }],
    [66.2, 67.2, (g, x, y) => { coracao(g, x - 30, y, 1.8); coracao(g, x + 50, y - 40, 1.2); }],
    [67.2, 69.6, (g, x, y) => { shape(WB.roundRectPath(x - 120, y - 80, 240, 150, 40) + ` M ${x - 40} ${y + 68} L ${x - 70} ${y + 120} L ${x} ${y + 68}`, '#ffffff', g, 6); WB.text('"amei o filme"', x, y + 14, 40, INK.black, g); }],
  ];
  lista.forEach(([a, b, fn]) => icon(a, b, CX, CY, fn));
  // "a gente já dominou o mundo?" → bandeirinhas no globo
  icon(71.45, 73.8, CX, CY, (g, x, y) => {
    globo(g, x, y, 110);
    ['gpt', 'cla', 'gem', 'cop'].forEach((w, i) => {
      const a = -2.6 + i * 0.75, fx = x + Math.cos(a) * 95, fy = y + Math.sin(a) * 95;
      ink(`M ${fx} ${fy} L ${fx} ${fy - 80}`, INK.black, 5, g);
      shape(`M ${fx} ${fy - 80} L ${fx + 64} ${fy - 80} L ${fx + 64} ${fy - 36} L ${fx} ${fy - 36} Z`, '#fffdf6', g, 3);
      logo(g, w, fx + 32, fy - 58, 0.32);
    });
  }, { pulse: 0.05, s: 1.1 });
  // "eles entregaram pra gente": globo de presente
  icon(75.7, 77.6, CX, CY, (g, x, y) => {
    globo(g, x, y, 100);
    WB.mk('path', { d: `M ${x - 100} ${y} L ${x + 100} ${y} M ${x} ${y - 100} L ${x} ${y + 100}`, stroke: '#e63946', 'stroke-width': 16 }, g);
    shape(`M ${x} ${y - 100} q -60 -50 -70 -10 q 20 25 70 10 Z M ${x} ${y - 100} q 60 -50 70 -10 q -20 25 -70 10 Z`, '#e63946', g, 5);
    shape(WB.roundRectPath(x + 80, y + 40, 180, 64, 10), '#fff3b0', g, 4);
    WB.text('de: humanos', x + 170, y + 82, 32, INK.black, g);
  });
  // documentário
  icon(79.45, 84.2, CX, CY - 10, (g, x, y) => {
    shape(`M ${x - 170} ${y - 40} L ${x + 170} ${y - 40} L ${x + 170} ${y + 120} L ${x - 170} ${y + 120} Z`, '#2b2b30', g, 6);
    const tp = WB.group(g, `rotate(-12 ${x - 170} ${y - 40})`);
    shape(`M ${x - 170} ${y - 90} L ${x + 170} ${y - 90} L ${x + 170} ${y - 40} L ${x - 170} ${y - 40} Z`, '#2b2b30', tp, 6);
    for (let i = 0; i < 5; i++) WB.mk('path', { d: `M ${x - 150 + i * 70} ${y - 90} l 30 0 l -20 50 l -30 0 Z`, fill: '#fff' }, tp);
    WB.text('A CULPA', x, y + 30, 50, '#ffffff', g);
    WB.text('É DA IA', x, y + 92, 50, '#ffd60a', g);
  }, { rot: 6, s: 1.05 });
  // roteiro
  icon(84.9, 99, 840, 640, (g, x, y) => {
    papel(g, x, y, 280, 320, [['ROTEIRO', 46, INK.black], ['"A culpa', 36], ['é dos', 36], ['humanos"', 36]], { gap: 50 });
    logo(g, 'cop', x + 80, y + 120, 0.42);
  }, { rot: -10 });
  {
    const g = WB.group(propsLayer);
    for (let i = 0; i < 4; i++) {
      const s = WB.group(g, `translate(${[180, 330, 650, 120][i]} ${[640, 520, 500, 900][i]})`);
      WB.mk('path', { d: 'M 0 -34 Q 5 -5 34 0 Q 5 5 0 34 Q -5 5 -34 0 Q -5 -5 0 -34 Z', fill: '#ffd60a', stroke: INK.black, 'stroke-width': 4 }, s);
      popIn(s, 85.9 + i * 0.1, 99, [180, 330, 650, 120][i], [640, 520, 500, 900][i], { pulse: 0.3 });
    }
  }
};
