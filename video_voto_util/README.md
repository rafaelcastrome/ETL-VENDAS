# Voto útil no 1º turno: vídeo em whiteboard animation

Vídeo vertical (1080x1920, 30 fps) no estilo "papel e caneta": uma mão com marcador desenha cada elemento em tempo real enquanto a narração explica.

Resultado: `voto_util_explicacao.mp4`

## Pipeline

```bash
pip install edge-tts                 # TTS (voz pt-BR-AntonioNeural, rate +10%)
npm install                          # opentype.js (texto -> contornos SVG)
python3 gerar_audio.py               # audio/cenaN.mp3 + narration.mp3 + timeline.json
node render.js                       # Playwright captura os quadros e o FFmpeg monta o .mp4
node render.js --preview 3,20.5      # (opcional) salva PNGs de instantes específicos em preview/
```

- `gerar_audio.py`: gera uma faixa por cena, mede a duração com `ffprobe`, concatena tudo em `narration.mp3` e grava o início e o fim de cada cena em `timeline.json`. Se o serviço do edge-tts estiver inacessível, usa uma voz offline (`espeak-ng` + MBROLA `mb-br3`) e registra isso no campo `motor_tts`.
- `index.html`: a animação. Expõe `window.seekToTime(segundos)`, que define de forma determinística o `stroke-dashoffset` de cada traço e a posição da mão (`getPointAtLength`). Os textos usam a fonte Caveat (Google Fonts), convertida em contornos SVG para poderem ser "escritos" pela caneta. Para ver a animação com áudio, sirva a pasta por HTTP e abra `index.html?play` (clique para começar).
- `render.js`: sobe um servidor HTTP local, abre 4 páginas no Chromium, chama `seekToTime(f/30)` em cada quadro, tira o screenshot e compila com `libx264`/`yuv420p` + áudio `aac`.
