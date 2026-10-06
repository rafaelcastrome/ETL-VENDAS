#!/usr/bin/env python3
"""Transcreve a fala de um vídeo/áudio (pt-BR) com Whisper small via sherpa-onnx, para memes sem legenda.

  python3 transcrever.py video.mp4 [--trechos 1.2-3.7,3.7-6.7]

Instala sherpa-onnx (PyPI) e baixa o modelo de github.com/k2-fsa/sherpa-onnx/releases (asr-models)
para ~/.cache/whiteboard-video/asr na primeira vez. Sem --trechos, transcreve o arquivo inteiro e
também em pedaços separados pelos silêncios, com os tempos (use-os na timeline do meme).
"""
import os, subprocess, sys, tempfile, wave
import numpy as np

D = os.path.expanduser('~/.cache/whiteboard-video/asr/sherpa-onnx-whisper-small')
URL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2'


def preparar():
    try:
        import sherpa_onnx  # noqa: F401
    except ImportError:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', 'sherpa-onnx'])
    if not os.path.exists(f'{D}/small-encoder.onnx'):
        os.makedirs(os.path.dirname(D), exist_ok=True)
        subprocess.check_call(f'curl -sSL "{URL}" | tar xj -C "{os.path.dirname(D)}"', shell=True)


def main():
    src = sys.argv[1]
    trechos = None
    if '--trechos' in sys.argv:
        trechos = [tuple(map(float, p.split('-'))) for p in sys.argv[sys.argv.index('--trechos') + 1].split(',')]
    preparar()
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f'{D}/small-encoder.onnx', decoder=f'{D}/small-decoder.onnx', tokens=f'{D}/small-tokens.txt',
        language='pt', task='transcribe', num_threads=4)
    wav = tempfile.mktemp(suffix='.wav')
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', wav])
    w = wave.open(wav)
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    if trechos is None:
        # pedaços separados por silêncios de >= 0,4 s
        hop = 480
        r = np.sqrt(np.convolve(a ** 2, np.ones(hop) / hop, 'same')[::hop])
        voz = r > max(0.02, np.percentile(r, 90) * 0.15)
        trechos, ini, sil = [], None, 0
        for i, v in enumerate(voz):
            if v:
                ini = i if ini is None else ini
                sil = 0
            elif ini is not None:
                sil += 1
                if sil >= 13:
                    trechos.append((ini * hop / 16000, (i - sil + 1) * hop / 16000)); ini = None
        if ini is not None:
            trechos.append((ini * hop / 16000, len(a) / 16000))
        trechos = [(0.0, len(a) / 16000)] + trechos
    for s, e in trechos:
        st = rec.create_stream()
        st.accept_waveform(16000, a[int(max(0, s - 0.2) * 16000):int((e + 0.2) * 16000)])
        rec.decode_stream(st)
        print(f'{s:6.2f}–{e:6.2f}: {st.result.text}')


if __name__ == '__main__':
    main()
