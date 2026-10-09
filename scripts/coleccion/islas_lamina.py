"""Corta una lámina 3x3 de islas sobre fondo magenta (#FF00FF) generada en
ChatGPT, quita el fondo y guarda cada isla en public/theme/grados/<g>/islas/.

Uso: python3 scripts/coleccion/islas_lamina.py <lamina.png> <grado> <id1> … <id9>
     ("skip" para saltear una celda). Las islas quedan de 300 px de alto,
     como las de 3.º.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
ALTO = 300


def distancia_magenta(a):
    # Distancia de cada píxel al magenta puro.
    return np.sqrt((a[..., 0] - 255) ** 2 + (a[..., 1] - 0) ** 2 + (a[..., 2] - 255) ** 2)


def cortes(dens, n, length):
    cuts = [0]
    for i in range(1, n):
        c = int(i * length / n)
        r = int(length / (2 * n) * 0.8)
        seg = dens[c - r:c + r]
        idx = np.where(seg <= seg.min() + 1)[0]
        runs = []
        st = pv = idx[0]
        for x in idx[1:]:
            if x != pv + 1:
                runs.append((st, pv))
                st = x
            pv = x
        runs.append((st, pv))
        a, b = max(runs, key=lambda t: t[1] - t[0])
        cuts.append(c - r + (a + b) // 2)
    cuts.append(length)
    return cuts


def sin_fondo(pieza):
    a = np.asarray(pieza.convert("RGB")).astype(float)
    d = distancia_magenta(a)
    # 0 = fondo, 1 = isla, con un borde suave.
    alfa = np.clip((d - 60) / 70, 0, 1)
    # Humo, vapor y haces de luz (blancos semitransparentes sobre magenta):
    # R y B quedan al máximo y G dice cuánto blanco hay → alfa = G/255, color blanco.
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    blanco = (R > 225) & (B > 225) & (G < np.minimum(R, B) - 12)
    alfa = np.where(blanco, np.minimum(alfa, G / 255), alfa)
    a[blanco] = 255
    # Haces de luz amarilla mezclados con el magenta (quedan rosados): en las
    # islas no hay rosa ni violeta, así que lo rosado se vuelve luz cálida.
    rosado = ~blanco & (R > 200) & (B > G + 25) & (alfa > 0)
    alfa = np.where(rosado, np.minimum(alfa, np.clip(1 - (B - G) / 255, 0, 1)), alfa)
    a[rosado] = [255, 236, 160]
    # «Des-mezcla» el magenta de los bordes semitransparentes:
    # observado = alfa·color + (1 − alfa)·magenta.
    M = np.array([255.0, 0.0, 255.0])
    semi = (alfa > 0.02) & (alfa < 0.98) & ~blanco
    al3 = np.maximum(alfa, 0.05)[..., None]
    limpio = np.clip((a - (1 - al3) * M) / al3, 0, 255)
    a = np.where(semi[..., None], limpio, a)
    out = np.dstack([a, alfa * 255]).astype("uint8")
    im = Image.fromarray(out, "RGBA")
    # Saca motas sueltas.
    al = im.split()[3].filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    im.putalpha(Image.fromarray(np.minimum(np.asarray(al), np.asarray(im.split()[3]))))
    return im


def limpiar(im):
    """Saca pedacitos de las islas vecinas: manchas que tocan el borde de la
    celda (salvo la isla principal), que quedan debajo de la isla, o motas
    muy chicas. Primero «afina» la máscara para cortar puentes de 1 o 2 px."""
    from scipy import ndimage
    al = np.asarray(im.split()[3])
    fina = ndimage.binary_erosion(al > 160, iterations=3)
    lab, n = ndimage.label(fina)
    if n == 0:
        return im
    areas = ndimage.sum(np.ones_like(al), lab, range(1, n + 1))
    mayor = int(np.argmax(areas)) + 1
    objs = ndimage.find_objects(lab)
    fondo_isla = objs[mayor - 1][0].stop
    h, w = al.shape
    sigue = np.zeros(n + 1, bool)
    for k in range(1, n + 1):
        o = objs[k - 1]
        toca = o[0].start <= 4 or o[1].start <= 4 or o[0].stop >= h - 4 or o[1].stop >= w - 4
        debajo = o[0].start >= fondo_isla - 5
        if k == mayor or not (toca or debajo or areas[k - 1] < areas[mayor - 1] * 0.002):
            sigue[k] = True
    keep = ndimage.binary_dilation(sigue[lab], iterations=6)
    a = np.array(im)
    a[..., 3] = np.where(keep, a[..., 3], 0)
    return Image.fromarray(a, "RGBA")


def main(path, grado, ids):
    img = Image.open(path).convert("RGB")
    a = np.asarray(img).astype(float)
    tinta = distancia_magenta(a) > 90
    xs = cortes(tinta.sum(axis=0), 3, img.width)
    ys = cortes(tinta.sum(axis=1), 3, img.height)
    dest = os.path.join(ROOT, "public", "theme", "grados", str(grado), "islas")
    os.makedirs(dest, exist_ok=True)
    k = 0
    for r in range(3):
        for c in range(3):
            if k >= len(ids):
                return
            id_ = ids[k]
            k += 1
            if id_ == "skip":
                continue
            pieza = limpiar(sin_fondo(img.crop((xs[c], ys[r], xs[c + 1], ys[r + 1]))))
            bb = pieza.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox()
            if not bb:
                print("VACÍA", id_)
                continue
            pieza = pieza.crop(bb)
            w = round(pieza.width * ALTO / pieza.height)
            pieza = pieza.resize((w, ALTO), Image.LANCZOS)
            out = os.path.join(dest, f"mundo-{id_}.png")
            # Paleta de 256 colores con transparencia (pesa ~4 veces menos).
            pieza.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(out, optimize=True)
            print("ok", out, pieza.size)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
