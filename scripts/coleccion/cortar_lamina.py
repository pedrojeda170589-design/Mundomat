"""Corta una lámina 3x3 (fondo blanco) generada en ChatGPT en 9 imágenes
sueltas para arte/coleccion/<carpeta>/<id>.jpg (después se procesan con
procesar_arte.py).

Uso: python3 scripts/coleccion/cortar_lamina.py <lamina.png> <carpeta/id> x9
     (en el orden de la grilla; "skip" para saltear una celda)
"""
import os, sys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")

def cortes(dens, n, length):
    cuts = [0]
    for i in range(1, n):
        c = int(i * length / n); r = int(length / (2 * n) * 0.8)
        seg = dens[c - r:c + r]
        idx = np.where(seg <= seg.min() + 1)[0]
        runs = []; st = pv = idx[0]
        for x in idx[1:]:
            if x != pv + 1: runs.append((st, pv)); st = x
            pv = x
        runs.append((st, pv)); a, b = max(runs, key=lambda t: t[1] - t[0])
        cuts.append(c - r + (a + b) // 2)
    cuts.append(length)
    return cuts

def main(path, nombres):
    img = Image.open(path).convert("RGB")
    ink = np.array(img).astype(int).min(axis=2) < 235
    xs = cortes(ink.sum(axis=0), 3, img.width)
    ys = cortes(ink.sum(axis=1), 3, img.height)
    k = 0
    for r in range(3):
        for c in range(3):
            if k >= len(nombres): return
            n = nombres[k]; k += 1
            if n == "skip": continue
            pieza = img.crop((xs[c], ys[r], xs[c + 1], ys[r + 1]))
            # recorte al contenido + margen blanco
            a = np.array(pieza).astype(int).min(axis=2) < 235
            yy, xx = np.where(a)
            if len(xx):
                m = 12
                pieza = pieza.crop((max(0, xx.min() - m), max(0, yy.min() - m), min(pieza.width, xx.max() + m), min(pieza.height, yy.max() + m)))
            dest = os.path.join(ROOT, "arte", "coleccion", n + ".jpg")
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            pieza.save(dest, quality=92)
            print("✂️ ", n, pieza.size)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
