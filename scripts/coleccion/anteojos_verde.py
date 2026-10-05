"""Anteojos y antifaces dibujados sobre FONDO VERDE (#00FF00), sin patillas y
con los marcos sin vidrio: se quita el verde (también el que se ve por los
huecos de los ojos) y se reemplaza la imagen que ya había, en el mismo lugar
y del mismo tamaño, así sigue calzando igual en la cara del avatar.

Pedido de Pedro (5/10/2026): «quitar las partes que deberían taparse con la
cabeza; por ejemplo, en los lentes transparentes, las patitas que se ven a
través del vidrio».

Uso: python3 scripts/coleccion/anteojos_verde.py <lamina.png> <id1> ... <id9>
     (un «-» para saltear un cuadro)
"""
import glob
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
THEME = os.path.join(ROOT, "public", "theme")


def sacar_verde(im: Image.Image) -> Image.Image:
    a = np.array(im.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # Distancia al verde del fondo (#00FF00): así no se borran los verdes de
    # los dibujos (palta, rana, hojas), que son más oscuros o apagados.
    dist = np.sqrt(r**2 + (255 - g) ** 2 + b**2)
    alpha = np.clip((dist - 35) / 45.0, 0, 1)
    # Bordes: sacar el reflejo verde solo donde se mezcla con el fondo.
    # (solo un poco y solo en grises/metales contaminados: los verdes propios
    # del dibujo —rana, palta— se dejan como están).
    cerca = ndimage.binary_dilation(alpha < 1, iterations=3)
    exceso = g - np.maximum(r, b)
    tocar = cerca & (exceso > 0) & (exceso < 45) & (np.minimum(r, b) > 90)
    g2 = np.where(tocar, g - 0.7 * exceso, g)
    out = np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)
    # Islas chiquitas y líneas finas (restos de la grilla): afuera.
    m = out[..., 3] > 30
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        objs = ndimage.find_objects(lab)
        for i, s in enumerate(sizes):
            sl = objs[i]
            alto, ancho = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
            if s < 0.01 * sizes.max() or alto <= 8 or ancho <= 8:
                out[..., 3][lab == i + 1] = 0
    return Image.fromarray(out)


def recortar(im: Image.Image) -> Image.Image:
    bb = im.split()[3].getbbox()
    return im.crop(bb) if bb else im


def destino(id_: str) -> str:
    for c in ["accessories-tienda", "accessories-temporada", "accessories-estandar", "accessories"]:
        p = os.path.join(THEME, c, f"{id_}.png")
        if os.path.exists(p):
            return p
    raise SystemExit(f"No encuentro la imagen actual de {id_} (hace falta para saber el tamaño y el lugar).")


def main():
    lamina, ids = sys.argv[1], sys.argv[2:]
    im = Image.open(lamina).convert("RGB")
    W, H = im.size
    for k, id_ in enumerate(ids[:9]):
        if id_ == "-":
            continue
        fila, col = divmod(k, 3)
        m = 10  # sin las líneas de la grilla
        celda = im.crop((col * W // 3 + m, fila * H // 3 + m, (col + 1) * W // 3 - m, (fila + 1) * H // 3 - m))
        pieza = recortar(sacar_verde(celda))
        p = destino(id_)
        viejo = Image.open(p).convert("RGBA")
        x0, y0, x1, y1 = viejo.split()[3].getbbox()
        kx = (x1 - x0) / pieza.width
        ky = (y1 - y0) / pieza.height
        s = min(kx, ky)
        pieza = pieza.resize((max(1, round(pieza.width * s)), max(1, round(pieza.height * s))), Image.LANCZOS)
        lienzo = Image.new("RGBA", viejo.size, (0, 0, 0, 0))
        lienzo.alpha_composite(pieza, (x0 + (x1 - x0 - pieza.width) // 2, y0 + (y1 - y0 - pieza.height) // 2))
        os.makedirs(os.path.join(ROOT, "arte", "coleccion", "anteojos-viejos"), exist_ok=True)
        resguardo = os.path.join(ROOT, "arte", "coleccion", "anteojos-viejos", f"{id_}.png")
        if not os.path.exists(resguardo):
            viejo.save(resguardo)
        lienzo.save(p, optimize=True)
        print(f"✅ {id_} → {os.path.relpath(p, ROOT)}")


if __name__ == "__main__":
    main()
