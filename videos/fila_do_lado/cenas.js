// "Por que a fila do lado anda mais rápido?" (Caderno Amarelo)
// Folha 1 (cenas 1-3): mercado com 3 caixas + probabilidade.
// Folha 2 (cenas 4-5): estudo da Nature (1999) com as faixas + os 3 motivos.
// Folha 3 (cenas 6-7): moral, fila única e redes.
window.CENAS = function (WB) {
  const { INK, C } = WB;
  const QX = [250, 540, 830];   // centro de cada fila/caixa

  // ---------- CENA 1: o mercado ----------
  WB.write(1, 0.02, 0.16, 'Por que a fila do lado', 540, 140, 88, INK.black, { anchor: 'middle' });
  const t2 = WB.write(1, 0.16, 0.26, 'anda mais rápido?', 540, 240, 96, INK.red, { anchor: 'middle' });
  WB.draw(1, 0.26, 0.29, C.underline(540 - t2.width / 2, 540 + t2.width / 2, 270));
  WB.draw(1, 0.30, 0.42, QX.map((x, i) => [
    C.box(x - 60, 330, x + 60, 400, INK.black, 7),
    WB.textStrokes(String(i + 1), x, 384, 54, INK.black, null, 'middle').strokes,
  ]));
  const heads = [];
  QX.forEach((x, q) => {
    const n = q === 1 ? 5 : 4;
    for (let k = 0; k < n; k++) {
      if (q === 1 && k === n - 1) continue;          // o último da fila do meio é "você"
      heads.push(WB.strokePath(WB.circlePath(x, 470 + k * 72, 24), INK.black, 6));
    }
  });
  WB.draw(1, 0.42, 0.56, heads);
  // você: carinha brava no fim da fila do meio
  const vy = 470 + 4 * 72;
  WB.draw(1, 0.56, 0.62, [
    WB.strokePath(WB.circlePath(540, vy, 28), INK.red, 7),
    WB.strokePath(`M 528 ${vy - 8} L 532 ${vy - 6} M 552 ${vy - 8} L 548 ${vy - 6}`, INK.red, 6),
    WB.strokePath(`M 528 ${vy + 14} Q 540 ${vy + 4} 552 ${vy + 14}`, INK.red, 5),
    WB.textStrokes('você', 585, vy + 16, 50, INK.red).strokes,
  ]);
  // a fila do lado "voando"
  WB.draw(1, 0.62, 0.72, [
    WB.strokePath(`M 880 500 L 940 500 M 880 560 L 950 560 M 880 620 L 935 620`, INK.orange, 6),
    WB.textStrokes('zum!', 880, 450, 52, INK.orange).strokes,
  ]);
  // balão "de novo?!"
  WB.draw(1, 0.74, 0.88, [
    WB.strokePath(WB.roundRectPath(110, 740, 300, 92, 30), INK.black, 6),
    WB.strokePath(`M 380 800 L 500 ${vy} L 360 828`, INK.black, 6),
    WB.textStrokes('de novo?!', 260, 805, 60, INK.red, null, 'middle').strokes,
  ]);

  // ---------- CENA 2: a conta ----------
  WB.write(2, 0.16, 0.34, 'Sua fila ser a mais rápida:', 540, 935, 60, INK.black, { anchor: 'middle' });
  WB.write(2, 0.34, 0.50, '1 em 3 = 33%', 540, 1030, 92, INK.green, { anchor: 'middle' });
  WB.write(2, 0.54, 0.66, 'Outra fila ganhar:', 540, 1120, 60, INK.black, { anchor: 'middle' });
  const p67 = WB.write(2, 0.66, 0.84, '2 em 3 = 67%!', 540, 1215, 92, INK.red, { anchor: 'middle' });
  WB.draw(2, 0.85, 0.90, C.underline(540 - p67.width / 2, 540 + p67.width / 2, 1240));

  // ---------- CENA 3: mais caixas ----------
  WB.write(3, 0.04, 0.33, '5 caixas? 1 em 5 = 20%', 540, 1330, 68, INK.black, { anchor: 'middle' });
  WB.write(3, 0.38, 0.56, 'O universo não te odeia.', 540, 1425, 66, INK.blue, { anchor: 'middle' });
  WB.write(3, 0.56, 0.78, 'Só tem mais filas que você!', 540, 1505, 66, INK.blue, { anchor: 'middle' });
  WB.restHand(3, 0.80, 0.99);

  // ---------- CENA 4: o estudo da Nature ----------
  WB.newPage(4, 0.0, 0.05);
  const est = WB.write(4, 0.06, 0.14, 'Tem até estudo!', 540, 165, 100, INK.red, { anchor: 'middle' });
  WB.draw(4, 0.14, 0.16, C.underline(540 - est.width / 2, 540 + est.width / 2, 195));
  const nat = WB.textStrokes('revista Nature, 1999', 540, 272, 54, INK.gray, null, 'middle');
  WB.draw(4, 0.17, 0.24, [C.box(540 - nat.width / 2 - 24, 222, 540 + nat.width / 2 + 24, 292, INK.gray, 5), nat.strokes]);
  // pista vista de cima: sua faixa (esq.) e a faixa do lado (dir.)
  let dash = '';
  for (let y = 330; y < 780; y += 60) dash += `M 520 ${y} L 520 ${y + 34} `;
  WB.draw(4, 0.24, 0.32, [
    WB.strokePath(WB.roughLine(260, 320, 260, 790, 2), INK.black, 7),
    WB.strokePath(WB.roughLine(780, 320, 780, 790, 2), INK.black, 7),
    WB.strokePath(dash, INK.black, 6),
  ]);
  const car = (cx, cy, color, parent) => [
    WB.strokePath(WB.roundRectPath(cx - 42, cy - 62, 84, 124, 20), color, 7, parent),
    WB.strokePath(WB.roundRectPath(cx - 28, cy - 34, 56, 34, 8), color, 5, parent),
  ];
  const passa = WB.group();
  WB.draw(4, 0.32, 0.42, [car(390, 560, INK.blue), car(650, 700, INK.orange, passa)]);
  WB.write(4, 0.42, 0.50, 'sua faixa', 390, 380, 48, INK.blue, { anchor: 'middle' });
  WB.write(4, 0.50, 0.56, '120 alunos de autoescola', 540, 870, 60, INK.black, { anchor: 'middle' });
  WB.write(4, 0.56, 0.72, '70%: "a do lado é mais rápida!"', 540, 960, 64, INK.orange, { anchor: 'middle' });
  WB.write(4, 0.74, 0.92, '(mas era um pouquinho mais lenta)', 540, 1040, 54, INK.red, { anchor: 'middle' });

  // ---------- CENA 5: os motivos ----------
  WB.moveGroup(5, 0.03, 0.16, passa, 0, -300, { grab: { x: 650, y: 760 }, arc: 0, color: INK.orange });
  WB.write(5, 0.17, 0.22, 'fui!', 698, 445, 50, INK.orange);
  WB.writeLines(5, 0.24, 0.42, ['1. Quem te passa fica', '    um tempão na sua frente'], 120, 1150, 60, INK.black, { lineHeight: 70 });
  WB.writeLines(5, 0.45, 0.63, ['2. Quem você passa', '    some no retrovisor'], 120, 1300, 60, INK.black, { lineHeight: 70 });
  WB.write(5, 0.66, 0.86, '3. Ser ultrapassado incomoda mais!', 120, 1455, 60, INK.red);
  WB.restHand(5, 0.88, 0.99);

  // ---------- CENA 6: moral + fila única ----------
  WB.newPage(6, 0.0, 0.05);
  const mor = WB.write(6, 0.06, 0.15, 'Moral da história', 540, 175, 100, INK.red, { anchor: 'middle' });
  WB.draw(6, 0.15, 0.17, C.underline(540 - mor.width / 2, 540 + mor.width / 2, 205));
  WB.write(6, 0.18, 0.30, 'Trocar de fila toda hora', 540, 305, 68, INK.black, { anchor: 'middle' });
  WB.write(6, 0.30, 0.42, 'só te faz perder o lugar!', 540, 385, 68, INK.black, { anchor: 'middle' });
  // fila única em zigue-zague levando a 3 caixas
  const zig = 'M 180 450 L 700 450 Q 740 450 740 490 Q 740 530 700 530 L 230 530 Q 190 530 190 570 Q 190 610 230 610 L 790 610';
  WB.draw(6, 0.45, 0.55, [
    WB.strokePath(zig, INK.blue, 8),
    WB.strokePath(WB.arrowHead(790, 610, 0, 24), INK.blue, 8),
    [480, 560, 640].map(y => C.box(830, y - 30, 920, y + 30, INK.black, 6)),
  ]);
  WB.write(6, 0.55, 0.61, 'fila única', 465, 705, 64, INK.blue, { anchor: 'middle' });
  WB.write(6, 0.63, 0.76, 'ninguém fica preso atrás', 540, 800, 60, INK.black, { anchor: 'middle' });
  WB.write(6, 0.76, 0.88, 'do cliente das moedinhas!', 540, 875, 60, INK.black, { anchor: 'middle' });
  WB.draw(6, 0.88, 0.94, [[0, 1, 2].map(i => WB.strokePath(WB.circlePath(925 + i * 6, 780 - i * 14, 24), INK.orange, 6))]);

  // ---------- CENA 7: comenta + redes ----------
  WB.ctaRedes(7, 0.04, 0.62, { y: 950, iconSize: 160, titulo: 'Comenta e me segue!' });
};
