"""Procesa el arte que entrega Antigravity (arte/coleccion/**) y lo deja listo
para la app (public/theme/...), con fondo transparente y en el tamaño y la
posición de su molde.

Uso (lo corre Claude al revisar):
  python3 scripts/coleccion/procesar_arte.py            # todo lo de arte/coleccion
  python3 scripts/coleccion/procesar_arte.py veterinaria mascota-gato
Después: npx tsx scripts/coleccion/listar-imagenes.ts

- Avatares: retrato en 440x440, con la cabeza a la misma altura y del mismo
  tamaño que el personaje de siempre indicado en `comoAvatar` (así los gorros
  y lentes caen en su lugar).
- Objetos que se usan puestos: en el lienzo de su `molde` (mismo tamaño y
  misma caja), así se ubican igual que el molde en todos los personajes.
- Mascotas y objetos de mano: 360x360, apoyados abajo.

Requiere: pip install rembg pillow numpy onnxruntime
"""
import json, os, subprocess, sys, glob
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
THEME = os.path.join(ROOT, "public", "theme")

catalogo = json.loads(subprocess.check_output(["npx", "tsx", "scripts/coleccion/lista-para-dibujar.ts", "--json"], cwd=ROOT))

_s = None
# Con MM_RELLENO=1 se quita el fondo blanco «pintando» desde los bordes
# (sirve para personajes blancos o con partes claras, que rembg borra).
def relleno_blanco(im, tol=26):
    from collections import deque
    from PIL import ImageFilter
    a = np.asarray(im.convert("RGB")).astype(int)
    h, w, _ = a.shape
    claro = (255 - a).max(axis=2) <= tol
    mask = np.zeros((h, w), bool)
    q = deque([(y, x) for x in range(w) for y in (0, h - 1)] + [(y, x) for y in range(h) for x in (0, w - 1)])
    while q:
        y, x = q.popleft()
        if mask[y, x] or not claro[y, x]:
            continue
        mask[y, x] = True
        if y > 0: q.append((y - 1, x))
        if y < h - 1: q.append((y + 1, x))
        if x > 0: q.append((y, x - 1))
        if x < w - 1: q.append((y, x + 1))
    alfa = Image.fromarray(((~mask) * 255).astype("uint8")).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = im.convert("RGBA")
    out.putalpha(alfa)
    return out

def quitar_fondo(im):
    a = np.array(im.convert("RGBA"))
    if (a[..., 3] < 10).mean() > 0.05:  # ya viene transparente
        return Image.fromarray(a)
    if os.environ.get("MM_RELLENO"):
        return relleno_blanco(im)
    global _s
    from rembg import remove, new_session
    if _s is None:
        _s = new_session("isnet-general-use")
    out = np.array(remove(im.convert("RGB"), session=_s))
    out[..., 3] = np.where(out[..., 3] < 24, 0, out[..., 3])
    return Image.fromarray(out)

def recortar(im):
    bb = im.split()[3].getbbox()
    return im.crop(bb) if bb else im

def buscar_molde(nombre):
    for c in ["accessories-tienda", "accessories-temporada", "accessories-estandar", "accessories"]:
        p = os.path.join(THEME, c, f"{nombre}.png")
        if os.path.exists(p):
            return Image.open(p).convert("RGBA")
    raise SystemExit(f"No encuentro el molde {nombre}")

def encajar(pieza, caja_w, caja_h):
    k = min(caja_w / pieza.width, caja_h / pieza.height)
    return pieza.resize((max(1, round(pieza.width * k)), max(1, round(pieza.height * k))), Image.LANCZOS)

def procesar(id_, ruta):
    info = catalogo.get(id_)
    if not info:
        print(f"⚠️  {id_}: no está en el catálogo (revisá el nombre del archivo)"); return None
    pieza = recortar(quitar_fondo(Image.open(ruta)))
    if info["tipo"] == "avatar":
        tpl = Image.open(os.path.join(THEME, "avatars", f"{info['comoAvatar']}.png")).convert("RGBA")
        x0, y0, x1, y1 = tpl.split()[3].getbbox()
        p = encajar(pieza, 440, y1 - y0)
        lienzo = Image.new("RGBA", (440, 440), (0, 0, 0, 0))
        cx = (x0 + x1) // 2
        lienzo.alpha_composite(p, (max(0, min(440 - p.width, cx - p.width // 2)), y1 - p.height))
    elif info.get("slot") in ("pet", "prop") or not info.get("molde"):
        p = encajar(pieza, 344, 344)
        lienzo = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
        lienzo.alpha_composite(p, ((360 - p.width) // 2, 360 - 8 - p.height))
    else:
        tpl = buscar_molde(info["molde"])
        x0, y0, x1, y1 = tpl.split()[3].getbbox()
        p = encajar(pieza, x1 - x0, y1 - y0)
        lienzo = Image.new("RGBA", tpl.size, (0, 0, 0, 0))
        lienzo.alpha_composite(p, (x0 + (x1 - x0 - p.width) // 2, y0 + (y1 - y0 - p.height) // 2))
    destino = os.path.join(THEME, info["carpeta"], f"{id_}.png")
    lienzo.save(destino, optimize=True)
    print(f"✅ {id_} → public/theme/{info['carpeta']}/{id_}.png")
    return destino

if __name__ == "__main__":
    pedidos = set(sys.argv[1:])
    rutas = sorted(sum((glob.glob(os.path.join(ROOT, "arte", "coleccion", "*", f"*.{e}")) for e in ("png", "jpg", "jpeg", "webp")), []))
    for r in rutas:
        id_ = os.path.splitext(os.path.basename(r))[0]
        if not pedidos or id_ in pedidos:
            procesar(id_, r)
