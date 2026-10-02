"""Corta una hoja de 3x3 islas (fondo blanco) en 9 PNG con fondo transparente.

Uso:
  python3 scripts/imagenes/cortar_islas.py <hoja.png> <carpeta_salida> <id1> <id2> ... <id9>
  (los ids en el orden de la grilla: izquierda a derecha, arriba a abajo;
   "practica" guarda practica.png, "skip" no guarda nada, cualquier otro
   guarda mundo-<id>.png)

Requiere: pip install rembg pillow numpy scipy onnxruntime
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from rembg import remove, new_session

_s = None


def sess():
    global _s
    if _s is None:
        _s = new_session("isnet-general-use")
    return _s



def gaps(dens, n, length):
    """Find n-1 cut positions in the whitest bands near the expected grid lines."""
    cuts = [0]
    for i in range(1, n):
        c = int(i * length / n); r = int(length / (2 * n) * 0.8)
        seg = dens[c - r:c + r]
        idx = np.where(seg <= seg.min() + 1)[0]
        runs = []; st = idx[0]; pv = idx[0]
        for x in idx[1:]:
            if x != pv + 1: runs.append((st, pv)); st = x
            pv = x
        runs.append((st, pv)); a, b = max(runs, key=lambda t: t[1] - t[0])
        cuts.append(c - r + (a + b) // 2)
    cuts.append(length)
    return cuts


def process(path, ids, OUT, maxdim=340):
    os.makedirs(OUT, exist_ok=True)
    img = Image.open(path).convert('RGB')
    arr = np.array(img).astype(int)
    ink = (arr.min(axis=2) < 235)
    xs = gaps(ink.sum(axis=0), 3, img.width)
    ys = gaps(ink.sum(axis=1), 3, img.height)
    k = 0
    for r in range(3):
        for c in range(3):
            if k >= len(ids): return
            name = ids[k]; k += 1
            if name == "skip":
                continue
            piece = img.crop((xs[c], ys[r], xs[c + 1], ys[r + 1]))
            rgb = np.array(piece)
            a = np.array(remove(piece, session=sess()).getchannel('A')).astype(float)
            # El fondo es blanco puro: todo lo que no está conectado al blanco del
            # borde es isla (evita que la roca clara de abajo quede transparente).
            white = rgb.astype(int).min(axis=2) > 238
            lab, _ = ndimage.label(white)
            border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
            bg = np.isin(lab, list(border))
            solid = ndimage.binary_opening(~bg, iterations=2)
            a = np.maximum(a, np.where(solid, 255.0, 0.0))
            a = np.where(bg & (a < 250), np.minimum(a, 60), a)
            # keep only the largest blob (+ close neighbours) to drop stray bits
            lab, n = ndimage.label(a > 30)
            if n > 1:
                sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
                keep = [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.04]
                a = np.where(np.isin(lab, keep), a, 0)
            a = np.array(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(float)
            im = Image.fromarray(np.dstack([rgb, a.astype(np.uint8)]), 'RGBA')
            bb = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
            im = im.crop((max(0, bb[0] - 4), max(0, bb[1] - 4), min(im.width, bb[2] + 4), min(im.height, bb[3] + 4)))
            rr = maxdim / max(im.size)
            if rr < 1: im = im.resize((int(im.width * rr), int(im.height * rr)), Image.LANCZOS)
            fn = f'{OUT}/{"practica" if name == "practica" else "mundo-" + name}.png'
            # 256 colores (paleta con transparencia): ~10 veces más liviano.
            im.quantize(256, method=Image.Quantize.FASTOCTREE).save(fn, optimize=True)
            print(fn, im.size)


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(__doc__); sys.exit(1)
    process(sys.argv[1], sys.argv[3:], sys.argv[2])
