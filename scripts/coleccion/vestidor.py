"""Vestidor de cuerpo completo: recorta cuerpos base y prendas generadas en
ChatGPT sobre fondo magenta (#FF00FF).

Cada prenda se pidió como una EDICIÓN de la imagen del cuerpo base (misma
pose y posición), así que la prenda es lo que cambió entre las dos imágenes.

Uso:
  python3 scripts/coleccion/vestidor.py cuerpo <imagen.png> <id>
  python3 scripts/coleccion/vestidor.py separar <id> …   (deja solo cabeza y manos; nene-a también arma _termica.png)
  python3 scripts/coleccion/vestidor.py prenda <base.png> <vestido.png> <id> <zona> [umbral=70] [cierre=4]
  (para prendas de color parecido al gris de la base: umbral más bajo y cierre más grande)
Zonas: arriba, abajo, calzado, botas, abrigo, cabeza, extra (limitan dónde se busca
el cambio, para no levantar diferencias chicas de la cara o del fondo).

Salida: public/theme/vestidor/{cuerpos,prendas}/<id>.png (lienzo completo de
512 × 768, transparente fuera de la figura) y prendas/<id>-mini.png (recorte
para la tienda).
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
from islas_lamina import sin_fondo  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DEST = os.path.join(ROOT, "public", "theme", "vestidor")
ANCHO, ALTO = 512, 768

# Franja vertical (fracción de la altura) donde puede estar cada tipo de prenda.
ZONAS = {
    "arriba": (0.24, 0.66),
    "abajo": (0.50, 0.93),
    "calzado": (0.80, 1.00),
    "botas": (0.66, 1.00),  # calzado alto (se guarda en la zona calzado)
    "abrigo": (0.22, 0.80),
    "cabeza": (0.00, 0.145),  # solo arriba de las cejas: la cara queda la de cada personaje
    "extra": (0.18, 0.75),
}


def guardar(im: Image.Image, carpeta: str, nombre: str) -> str:
    os.makedirs(os.path.join(DEST, carpeta), exist_ok=True)
    out = os.path.join(DEST, carpeta, nombre)
    im.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(out, optimize=True)
    return out


def cuerpo(src: str, id_: str) -> None:
    im = sin_fondo(Image.open(src).convert("RGB")).resize((ANCHO, ALTO), Image.LANCZOS)
    print("ok", guardar(im, "cuerpos", f"{id_}.png"))


def separar(id_: str) -> None:
    """Idea de Pedro: el cuerpo es «invisible»; de cada personaje quedan solo
    la cabeza (con el cuello) y las manos, que llevan el color de piel. La
    ropa térmica gris y las medias pasan a una capa común (_termica.png) que
    va siempre debajo de la ropa. Así un personaje nuevo es solo cabeza y
    manos, y toda la ropa sirve para todos."""
    ruta = os.path.join(DEST, "cuerpos", f"{id_}.png")
    im = np.asarray(Image.open(ruta).convert("RGBA")).astype(float)
    r, g, b, a = (im[..., i] for i in range(4))
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = (mx - mn) / np.maximum(mx, 1)
    h, w = a.shape
    yy = np.arange(h)[:, None] * np.ones((1, w))
    gris = (sat < 0.12) & (a > 0) & (yy > h * 0.26)
    piel = (a > 0) & ~gris
    piel = ndimage.binary_opening(piel, iterations=2)
    lab, n = ndimage.label(piel)
    if n:
        areas = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        piel = np.isin(lab, [i + 1 for i, x in enumerate(areas) if x >= 400])
    piel = ndimage.binary_dilation(piel, iterations=1) & (a > 0)
    cab = np.dstack([im[..., :3], np.where(piel, a, 0)]).astype("uint8")
    print("ok", guardar(Image.fromarray(cab, "RGBA"), "cuerpos", f"{id_}.png"))
    if id_ == "nene-a":
        ter = np.dstack([im[..., :3], np.where(piel & (yy < h * 0.26), 0, a)]).astype("uint8")
        # La térmica sin la cabeza ni las manos (debajo de las manos queda la manga).
        ter[..., 3] = np.where(yy < h * 0.26, 0, ter[..., 3])
        print("ok", guardar(Image.fromarray(ter, "RGBA"), "cuerpos", "_termica.png"))


def prenda(base_src: str, vestido_src: str, id_: str, zona: str, umbral: int = 70, cierre: int = 4) -> None:
    base = np.asarray(Image.open(base_src).convert("RGB")).astype(int)
    vest_img = Image.open(vestido_src).convert("RGB")
    if vest_img.size != (base.shape[1], base.shape[0]):
        vest_img = vest_img.resize((base.shape[1], base.shape[0]), Image.LANCZOS)
    vest = np.asarray(vest_img).astype(int)
    h = base.shape[0]
    dif = np.abs(base - vest).sum(axis=2)
    # Lo que cambió, sin contar el fondo magenta de la imagen vestida.
    R, G, B = vest[..., 0], vest[..., 1], vest[..., 2]
    magenta = (R > 200) & (B > 200) & (G < 90)
    m = (dif > umbral) & ~magenta
    y0, y1 = ZONAS[zona]
    m[: int(h * y0)] = False
    m[int(h * y1):] = False
    # Limpieza: abrir (saca puntitos de textura), quedarse con las manchas
    # grandes, cerrar y rellenar agujeros (dibujos de la prenda parecidos al fondo).
    m = ndimage.binary_opening(m, iterations=3)
    lab, n = ndimage.label(m)
    if n:
        areas = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        grande = areas.max()
        keep = np.isin(lab, [i + 1 for i, a in enumerate(areas) if a >= grande * 0.04])
        m = keep
    m = ndimage.binary_closing(m, iterations=cierre)
    m = ndimage.binary_fill_holes(m)
    alfa = ndimage.gaussian_filter(m.astype(float), 1.0)
    alfa = np.clip((alfa - 0.25) / 0.5, 0, 1)
    # Bordes contra el fondo: se usa el recorte sin magenta (des-mezclado),
    # así no quedan halos rosados.
    limpio = np.asarray(sin_fondo(vest_img))
    alfa = alfa * (limpio[..., 3] / 255.0)
    rgba = np.dstack([limpio[..., :3], (alfa * 255).astype(np.uint8)])
    im = Image.fromarray(rgba, "RGBA").resize((ANCHO, ALTO), Image.LANCZOS)
    print("ok", guardar(im, "prendas", f"{id_}.png"))
    bb = im.split()[3].point(lambda v: 255 if v > 30 else 0).getbbox()
    if bb:
        mini = im.crop(bb)
        mini.thumbnail((160, 160), Image.LANCZOS)
        print("ok", guardar(mini, "prendas", f"{id_}-mini.png"))


if __name__ == "__main__":
    if sys.argv[1] == "separar":
        for x in sys.argv[2:]:
            separar(x)
    elif sys.argv[1] == "cuerpo":
        cuerpo(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == "prenda":
        extra = [int(x) for x in sys.argv[6:8]]
        prenda(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], *extra)
    else:
        print(__doc__)
