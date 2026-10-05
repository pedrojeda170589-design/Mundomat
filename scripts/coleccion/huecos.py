"""Vacía los huecos blancos encerrados (ojos de antifaces, marcos de anteojos
sin vidrio): lo que se ve a través tiene que ser la cara del avatar.

Uso: python3 scripts/coleccion/huecos.py public/theme/.../antifaz.png [...]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage


def vaciar_huecos(im: Image.Image, min_frac: float = 0.004) -> Image.Image:
    a = np.array(im.convert("RGBA")).astype(np.int16)
    rgb, al = a[..., :3], a[..., 3]
    brillo = rgb.mean(-1)
    sat = rgb.max(-1) - rgb.min(-1)
    blanco = (brillo > 200) & (sat < 40) & (al > 0)
    # Lo que NO es blanco ni transparente arma el «marco».
    marco = (al > 30) & ~blanco
    marco = ndimage.binary_closing(marco, iterations=2)
    relleno = ndimage.binary_fill_holes(marco)
    hueco = relleno & ~marco
    lab, n = ndimage.label(hueco)
    total = al.size
    out = a.copy()
    for i in range(1, n + 1):
        comp = lab == i
        if comp.sum() < min_frac * total:
            continue  # brillitos chicos: se quedan
        borde = ndimage.binary_dilation(comp, iterations=2)
        out[..., 3][borde & blanco] = 0
        out[..., 3][comp] = 0
    return Image.fromarray(out.astype(np.uint8))


if __name__ == "__main__":
    for p in sys.argv[1:]:
        vaciar_huecos(Image.open(p)).save(p, optimize=True)
        print("✅", p)
