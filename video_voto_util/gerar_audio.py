"""Gera a narração de cada cena com edge-tts, mede as durações com ffprobe,
concatena tudo em narration.mp3 e salva os tempos das cenas em timeline.json."""
import asyncio
import json
import os
import subprocess

import edge_tts
import edge_tts.communicate as communicate

# O proxy de saída reassina o TLS; confia também no bundle dele, se existir.
CA_BUNDLE = "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA_BUNDLE):
    communicate._SSL_CTX.load_verify_locations(cafile=CA_BUNDLE)

VOICE = "pt-BR-AntonioNeural"
RATE = "+10%"
HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(HERE, "audio")

CENAS = [
    "Existe mesmo voto útil no primeiro turno? Vamos olhar para a matemática da urna no papel.",
    "Para vencer a eleição já no primeiro turno, qualquer candidato precisa atingir a linha mágica de cinquenta por cento mais um dos votos válidos.",
    "Imagine que o Candidato A está na frente com quarenta e três por cento. Logo atrás vem o Candidato B com vinte e oito por cento, e outros três nomes do mesmo campo político têm seis, cinco e quatro por cento.",
    "Muita gente diz: tire o voto dos candidatos menores e passe para o B para derrotar o A no primeiro turno. Mas veja o que acontece quando somamos tudo.",
    "O Candidato B chegou aos cinquenta por cento mais um para ganhar no primeiro turno? Não. E o Candidato A perdeu algum voto com essa troca? Zero. A barra dele continua intacta.",
    "Matematicamente, trocar votos dentro da oposição não tira um milímetro do líder no primeiro turno. Para reduzir a porcentagem dele, é preciso tirar votos diretamente dele ou trazer novos eleitores. No primeiro turno, essa disputa serve apenas para medir força política para o segundo turno.",
]

# Pequena pausa entre as cenas para a mão "respirar".
GAP = 0.6


def duracao(path):
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", path,
    ])
    return float(out.strip())


async def gerar_edge(texto, mp3):
    await edge_tts.Communicate(texto, VOICE, rate=RATE).save(mp3)


def gerar_espeak(texto, mp3):
    """Reserva offline (eSpeak-NG + MBROLA br3, pt-BR) caso o serviço do
    edge-tts esteja inacessível na rede."""
    wav = mp3[:-4] + "_espeak.wav"
    subprocess.check_call(["espeak-ng", "-v", "mb-br3", "-s", "165", "-w", wav, texto],
                          stderr=subprocess.DEVNULL)
    subprocess.check_call(["ffmpeg", "-y", "-v", "error", "-i", wav, "-b:a", "192k", mp3])
    os.remove(wav)


async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    motor = "edge-tts"
    for i, texto in enumerate(CENAS, 1):
        mp3 = os.path.join(AUDIO_DIR, f"cena{i}.mp3")
        if motor == "edge-tts":
            try:
                await gerar_edge(texto, mp3)
                continue
            except Exception as e:  # noqa: BLE001
                print(f"[aviso] edge-tts falhou ({type(e).__name__}: {e}); "
                      "usando voz offline espeak-ng/mbrola.")
                motor = "espeak-ng (mb-br3)"
                # Regera as cenas anteriores para manter a mesma voz no vídeo todo.
                for j in range(1, i):
                    gerar_espeak(CENAS[j - 1], os.path.join(AUDIO_DIR, f"cena{j}.mp3"))
        gerar_espeak(texto, mp3)

    # Converte cada cena em WAV (com o silêncio do intervalo) e concatena.
    lista = []
    cenas = []
    t = 0.0
    for i in range(1, len(CENAS) + 1):
        mp3 = os.path.join(AUDIO_DIR, f"cena{i}.mp3")
        wav = os.path.join(AUDIO_DIR, f"cena{i}.wav")
        d = duracao(mp3)
        pad = GAP if i < len(CENAS) else 2.5
        subprocess.check_call([
            "ffmpeg", "-y", "-v", "error", "-i", mp3, "-ar", "44100", "-ac", "2",
            "-af", f"apad=pad_dur={pad}", wav,
        ])
        dw = duracao(wav)
        cenas.append({"cena": i, "start": round(t, 3), "end": round(t + dw, 3),
                      "fala": round(d, 3), "texto": CENAS[i - 1]})
        t += dw
        lista.append(f"file '{wav}'")

    lista_path = os.path.join(AUDIO_DIR, "lista.txt")
    with open(lista_path, "w") as f:
        f.write("\n".join(lista) + "\n")
    subprocess.check_call([
        "ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lista_path,
        "-c:a", "libmp3lame", "-b:a", "192k", os.path.join(HERE, "narration.mp3"),
    ])

    total = duracao(os.path.join(HERE, "narration.mp3"))
    with open(os.path.join(HERE, "timeline.json"), "w") as f:
        json.dump({"total": round(total, 3), "motor_tts": motor, "cenas": cenas}, f, ensure_ascii=False, indent=2)
    for c in cenas:
        print(f"Cena {c['cena']}: {c['start']:.2f}s -> {c['end']:.2f}s")
    print(f"Total: {total:.2f}s  (voz: {motor})")


if __name__ == "__main__":
    asyncio.run(main())
