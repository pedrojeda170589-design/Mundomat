"""Procesa las ilustraciones de la Reserva patagónica (public/theme/reserva).

  postal <archivo> <territorio>       → postales/<territorio>.jpg (1280×720)
  emblema <archivo> <id>              → emblemas/<id>.png (lado mayor 320 px, sin modificar el dibujo)
  lamina <archivo> <carpeta> id×9     → <carpeta>/<id>.png (lámina 3×3 sobre magenta,
                                        sin fondo, lado mayor 320 px; "skip" saltea)
"""
import os, sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "coleccion"))
sys.dont_write_bytecode = True
from islas_lamina import cortes, distancia_magenta, sin_fondo, limpiar  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "public", "theme", "reserva")
LADO = 320


def destino(carpeta, nombre):
    d = os.path.join(ROOT, carpeta)
    os.makedirs(d, exist_ok=True)
    return os.path.join(d, nombre)


def postal(path, territorio):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    alto = round(w * 9 / 16)
    if alto <= h:
        top = (h - alto) // 2
        im = im.crop((0, top, w, top + alto))
    else:
        ancho = round(h * 16 / 9)
        left = (w - ancho) // 2
        im = im.crop((left, 0, left + ancho, h))
    im = im.resize((1280, 720), Image.LANCZOS)
    out = destino("postales", f"{territorio}.jpg")
    im.save(out, quality=82, optimize=True, progressive=True)
    print("ok", out)


def emblema(path, id_):
    im = Image.open(path).convert("RGBA")
    im.thumbnail((LADO, LADO), Image.LANCZOS)
    out = destino("emblemas", f"{id_}.png")
    im.save(out, optimize=True)
    print("ok", out, im.size)


def lamina(path, carpeta, ids):
    img = Image.open(path).convert("RGB")
    tinta = distancia_magenta(np.asarray(img).astype(float)) > 90
    xs = cortes(tinta.sum(axis=0), 3, img.width)
    ys = cortes(tinta.sum(axis=1), 3, img.height)
    for k, id_ in enumerate(ids[:9]):
        if id_ == "skip":
            continue
        r, c = divmod(k, 3)
        pieza = limpiar(sin_fondo(img.crop((xs[c], ys[r], xs[c + 1], ys[r + 1]))))
        bb = pieza.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox()
        if not bb:
            print("VACÍA", id_)
            continue
        pieza = pieza.crop(bb)
        pieza.thumbnail((LADO, LADO), Image.LANCZOS)
        out = destino(carpeta, f"{id_}.png")
        pieza.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(out, optimize=True)
        print("ok", out, pieza.size)


if __name__ == "__main__":
    cmd, *args = sys.argv[1:]
    if cmd == "postal":
        postal(*args)
    elif cmd == "emblema":
        emblema(*args)
    elif cmd == "lamina":
        lamina(args[0], args[1], args[2:])
