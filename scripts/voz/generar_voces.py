"""Genera la voz de los textos de los mundos de comprensión.

Motor: Kokoro-82M (pesos con licencia Apache 2.0) vía kokoro-onnx, voz «em_alex».
Uso:
  npx tsx scripts/voz/listar-oraciones.ts > /tmp/oraciones.json
  python3 scripts/voz/generar_voces.py /tmp/oraciones.json <carpeta_modelo>
  (la carpeta del modelo tiene kokoro-v1.0.onnx y voices-v1.0.bin)
Escribe public/audio/cuentos/voz/<hash>.mp3 y src/lib/cuentos/voz-manifest.ts.
Solo genera las oraciones que todavía no tienen audio.
"""
import json
import os
import re
import subprocess
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "audio", "cuentos", "voz")
MANIFEST = os.path.join(ROOT, "src", "lib", "cuentos", "voz-manifest.ts")
VOZ = "em_alex"
VELOCIDAD = 0.9


def para_leer(t: str) -> str:
    """Ajustes solo para la síntesis: rayas de diálogo y comillas."""
    t = t.replace("«", "").replace("»", "").replace("“", "").replace("”", "")
    t = re.sub(r"^\s*—", "", t)          # raya al comienzo
    t = re.sub(r"\s*—\s*", ", ", t)      # rayas de diálogo en el medio
    t = t.replace("…", "...")
    return re.sub(r"\s+", " ", t).strip(" ,")


def main():
    oraciones = json.load(open(sys.argv[1], encoding="utf-8"))
    modelo = sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    k = Kokoro(os.path.join(modelo, "kokoro-v1.0.onnx"), os.path.join(modelo, "voices-v1.0.bin"))
    nuevas = 0
    for h, texto in sorted(oraciones.items()):
        mp3 = os.path.join(OUT, f"{h}.mp3")
        if os.path.exists(mp3):
            continue
        audio, sr = k.create(para_leer(texto), voice=VOZ, speed=VELOCIDAD, lang="es")
        pad = np.zeros(int(sr * 0.12), dtype=audio.dtype)
        wav = mp3[:-4] + ".wav"
        sf.write(wav, np.concatenate([pad, audio, pad]), sr)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "loudnorm=I=-18:TP=-2",
                        "-ac", "1", "-ar", "24000", "-b:a", "48k", mp3], check=True)
        os.remove(wav)
        nuevas += 1
    hashes = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith(".mp3"))
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        fh.write("// Generado por scripts/voz/generar_voces.py: oraciones que tienen voz grabada.\n")
        fh.write("export const VOZ_DISPONIBLE = new Set<string>([\n")
        for i in range(0, len(hashes), 8):
            fh.write("  " + ", ".join(f'"{x}"' for x in hashes[i:i + 8]) + ",\n")
        fh.write("]);\n")
    print(f"nuevas: {nuevas}, total: {len(hashes)}")


if __name__ == "__main__":
    main()
