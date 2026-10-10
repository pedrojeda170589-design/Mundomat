"""Recorta las imágenes de las metas especiales (ChatGPT, fondo magenta).

Uso: python3 scripts/coleccion/metas_img.py <imagen.png> av-<id> | ob-<id>
  av-<id>: avatar → public/theme/avatars/<id>.png (440 × 440, como los demás)
  ob-<id>: objeto → public/theme/accessories-temporada/<id>.png (recortado, ≤ 320 px)
"""
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from islas_lamina import sin_fondo, limpiar  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")


def main(src: str, nombre: str) -> None:
    im = sin_fondo(Image.open(src).convert("RGB"))
    tipo, id_ = nombre.split("-", 1)
    if tipo == "av":
        im = im.resize((440, 440), Image.LANCZOS)
        out = os.path.join(ROOT, "public", "theme", "avatars", f"{id_}.png")
    else:
        im = limpiar(im)
        bb = im.split()[3].point(lambda v: 255 if v > 30 else 0).getbbox()
        im = im.crop(bb)
        im.thumbnail((320, 320), Image.LANCZOS)
        out = os.path.join(ROOT, "public", "theme", "accessories-temporada", f"{id_}.png")
    im.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(out, optimize=True)
    print("ok", out, im.size)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
