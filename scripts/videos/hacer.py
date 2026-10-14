"""Videos cortos de animación de MundoTest26 (pedido de Pedro, 14/10/2026).

Se arman por código con las ilustraciones que ya tiene la app (fondos, el
profe, islas, premios, postales de la Reserva y escenas de Monte León), con
movimiento, zoom, brillos y textos. La música y los efectos son originales:
se sintetizan con los instrumentos de scripts/musica/componer.py.

Uso:  python3 scripts/videos/hacer.py [bienvenida|festejo|reserva|monte-leon ...]
Salida: public/videos/<nombre>.mp4 (cuadrado 720×720, H.264 + AAC) y
        public/videos/<nombre>.jpg (cuadro de portada).
Necesita numpy, Pillow y ffmpeg. La letra es Fredoka (licencia SIL OFL,
scripts/videos/Fredoka-OFL.txt).
"""
import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", ".."))
PUB = os.path.join(RAIZ, "public")
SALIDA = os.path.join(PUB, "videos")
sys.path.insert(0, os.path.join(RAIZ, "scripts", "musica"))
sys.dont_write_bytecode = True
import componer as M  # noqa: E402

S = 720  # lado del video
FPS = 30
FUENTE = os.path.join(AQUI, "Fredoka.ttf")
RNG = np.random.default_rng(14)

_cache = {}


def img(rel):
    if rel not in _cache:
        _cache[rel] = Image.open(os.path.join(PUB, rel) if not os.path.isabs(rel) else rel).convert("RGBA")
    return _cache[rel]


def fuente(tam, peso="Bold"):
    k = ("f", tam, peso)
    if k not in _cache:
        f = ImageFont.truetype(FUENTE, tam)
        f.set_variation_by_name(peso)
        _cache[k] = f
    return _cache[k]


# ---------------------------------------------------------------- curvas
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def prog(t, t0, t1):
    return clamp((t - t0) / max(1e-6, t1 - t0))


def ease_out(x):
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    return 3 * x * x - 2 * x * x * x


def ease_back(x, s=1.7):
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def aparece(t, t0, dur=0.5):
    """0→1 con rebote (para que las cosas «salten» a la pantalla)."""
    return ease_back(prog(t, t0, t0 + dur)) if t >= t0 else 0.0


# ---------------------------------------------------------------- dibujo
def fondo_cubre(im, zoom=1.0, cx=0.5, cy=0.5):
    """Recorta `im` para llenar el cuadro, con zoom y centro (0..1)."""
    w, h = im.size
    lado = min(w, h) / zoom
    x0 = clamp(cx * w - lado / 2, 0, w - lado)
    y0 = clamp(cy * h - lado / 2, 0, h - lado)
    return im.crop((int(x0), int(y0), int(x0 + lado), int(y0 + lado))).resize((S, S), Image.LANCZOS)


def pegar(base, im, cx, cy, alto, alpha=1.0, rot=0.0):
    """Pega `im` centrada en (cx, cy) con `alto` píxeles de alto."""
    if alto <= 1 or alpha <= 0.01:
        return
    w = max(1, int(im.width * alto / im.height))
    p = im.resize((w, int(alto)), Image.LANCZOS)
    if rot:
        p = p.rotate(rot, resample=Image.BICUBIC, expand=True)
    if alpha < 1:
        a = p.split()[3].point(lambda v: int(v * alpha))
        p.putalpha(a)
    base.alpha_composite(p, (int(cx - p.width / 2), int(cy - p.height / 2)))


def texto(base, s, cx, cy, tam, color=(255, 214, 64), borde=(60, 30, 10), alpha=1.0, escala=1.0, ancho_borde=None):
    if alpha <= 0.01 or escala <= 0.02:
        return
    f = fuente(max(6, int(tam * escala)))
    capa = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    sw = ancho_borde if ancho_borde is not None else max(2, int(tam * escala / 9))
    lineas = s.split("\n")
    alto_l = f.size * 1.12
    y = cy - alto_l * len(lineas) / 2
    for ln in lineas:
        d.text((cx, y + alto_l / 2), ln, font=f, fill=color, anchor="mm", stroke_width=sw, stroke_fill=borde)
        y += alto_l
    if alpha < 1:
        capa.putalpha(capa.split()[3].point(lambda v: int(v * alpha)))
    base.alpha_composite(capa)


def cartel(base, cx, cy, w, h, alpha=1.0, color=(255, 248, 225, 235), borde=(180, 120, 40, 255)):
    if alpha <= 0.01:
        return
    capa = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    r = int(min(w, h) * 0.28)
    d.rounded_rectangle((cx - w / 2 + 4, cy - h / 2 + 8, cx + w / 2 + 4, cy + h / 2 + 8), r, fill=(0, 0, 0, 70))
    d.rounded_rectangle((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), r, fill=color, outline=borde, width=5)
    if alpha < 1:
        capa.putalpha(capa.split()[3].point(lambda v: int(v * alpha)))
    base.alpha_composite(capa)


def brillo_dorado(base, cx, cy, radio, t, alpha=1.0):
    """Rayos dorados que giran detrás de un premio."""
    if alpha <= 0.01:
        return
    capa = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    n = 14
    for k in range(n):
        a0 = t * 0.6 + k * 2 * math.pi / n
        a1 = a0 + math.pi / n * 0.55
        pts = [(cx, cy), (cx + radio * math.cos(a0), cy + radio * math.sin(a0)), (cx + radio * math.cos(a1), cy + radio * math.sin(a1))]
        d.polygon(pts, fill=(255, 215, 90, int(110 * alpha)))
    capa = capa.filter(ImageFilter.GaussianBlur(3))
    halo = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(halo).ellipse((cx - radio * 0.55, cy - radio * 0.55, cx + radio * 0.55, cy + radio * 0.55), fill=(255, 236, 150, int(150 * alpha)))
    halo = halo.filter(ImageFilter.GaussianBlur(radio * 0.18))
    base.alpha_composite(capa)
    base.alpha_composite(halo)


class Chispas:
    """Estrellitas que titilan en lugares al azar."""

    def __init__(self, n, zona=(0, 0, S, S), seed=1):
        r = np.random.default_rng(seed)
        self.p = [(r.uniform(zona[0], zona[2]), r.uniform(zona[1], zona[3]), r.uniform(0, 6.3), r.uniform(5, 13)) for _ in range(n)]

    def dibujar(self, base, t, alpha=1.0):
        if alpha <= 0.01:
            return
        d = ImageDraw.Draw(base)
        for x, y, fase, tam in self.p:
            v = (math.sin(t * 4 + fase) + 1) / 2
            if v < 0.35:
                continue
            a = int(255 * v * alpha)
            s = tam * v
            d.line((x - s, y, x + s, y), fill=(255, 250, 210, a), width=3)
            d.line((x, y - s, x, y + s), fill=(255, 250, 210, a), width=3)
            d.ellipse((x - 2.5, y - 2.5, x + 2.5, y + 2.5), fill=(255, 255, 255, a))


class Papelitos:
    """Papel picado que cae (festejo)."""

    COLORES = [(255, 87, 87), (255, 196, 0), (64, 196, 255), (110, 220, 120), (200, 120, 255), (255, 140, 200)]

    def __init__(self, n, t0, seed=3):
        r = np.random.default_rng(seed)
        self.t0 = t0
        self.p = [
            dict(x=S / 2 + r.normal(0, 40), y=S * 0.45, vx=r.normal(0, 260), vy=r.uniform(-620, -260), rot=r.uniform(0, 360), vr=r.uniform(-400, 400),
                 c=self.COLORES[int(r.integers(len(self.COLORES)))], w=r.uniform(8, 16), h=r.uniform(5, 9))
            for _ in range(n)
        ]

    def dibujar(self, base, t):
        dt = t - self.t0
        if dt < 0:
            return
        capa = Image.new("RGBA", base.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(capa)
        for q in self.p:
            x = q["x"] + q["vx"] * dt * 0.8
            y = q["y"] + q["vy"] * dt + 420 * dt * dt
            if y > S + 30:
                continue
            a = math.radians(q["rot"] + q["vr"] * dt)
            w, h = q["w"], q["h"] * abs(math.cos(a * 1.7)) + 1
            c, s_ = math.cos(a), math.sin(a)
            pts = [(x + c * dx - s_ * dy, y + s_ * dx + c * dy) for dx, dy in ((-w, -h), (w, -h), (w, h), (-w, h))]
            d.polygon(pts, fill=q["c"] + (235,))
        base.alpha_composite(capa)


def degradado(c1, c2):
    y = np.linspace(0, 1, S)[:, None, None]
    a = np.array(c1, float)[None, None, :] * (1 - y) + np.array(c2, float)[None, None, :] * y
    a = np.repeat(a, S, axis=1)
    return Image.fromarray(np.dstack([a, np.full((S, S, 1), 255.0)]).astype("uint8"), "RGBA")


def fundido(base, t, dur, entrada=0.4, salida=0.6):
    """Fundido desde y hacia blanco cálido al principio y al final."""
    a = 0.0
    if t < entrada:
        a = 1 - t / entrada
    elif t > dur - salida:
        a = (t - (dur - salida)) / salida
    if a > 0:
        base.alpha_composite(Image.new("RGBA", base.size, (255, 248, 230, int(255 * clamp(a)))))


# ---------------------------------------------------------------- sonido
def efecto_destello(dur=0.9):
    n = int(dur * M.SR)
    t = np.arange(n) / M.SR
    y = np.zeros(n)
    for k, f in enumerate([1760, 2217, 2637, 3520]):
        i = int(k * 0.06 * M.SR)
        tt = t[: n - i]
        y[i:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 7) * 0.5
    return y


def efecto_pop(dur=0.25):
    n = int(dur * M.SR)
    t = np.arange(n) / M.SR
    f = 500 + 900 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / M.SR) * np.exp(-t * 18)


def efecto_arpa(dur=0.6):
    """Arpegio rápido hacia arriba (caja de música): reemplaza al «whoosh» de
    viento, que a Pedro no le gustó (14/10/2026)."""
    notas = [72, 76, 79, 84, 88]  # do mayor, sube
    paso = min(0.07, dur / (len(notas) + 2))
    n = int((dur + 0.6) * M.SR)
    y = np.zeros(n)
    for k, m in enumerate(notas):
        s_ = M.music_box(M.midi_hz(m), 0.6)
        i = int(k * paso * M.SR)
        j = min(n, i + len(s_))
        y[i:j] += s_[: j - i] * (0.6 + 0.1 * k)
    return y / max(1e-9, np.abs(y).max())


def mezclar(musica, efectos, dur):
    """musica: (n,2) normalizada; efectos: lista de (señal, segundo, ganancia)."""
    n = int(dur * M.SR)
    st = np.zeros((n, 2))
    m = musica[:n]
    st[: len(m)] += m * 0.8
    for sig, at, g in efectos:
        i = int(at * M.SR)
        j = min(n, i + len(sig))
        st[i:j, 0] += sig[: j - i] * g
        st[i:j, 1] += sig[: j - i] * g
    fade = int(0.8 * M.SR)
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    st[: int(0.05 * M.SR)] *= np.linspace(0, 1, int(0.05 * M.SR))[:, None]
    st /= max(1e-9, np.abs(st).max())
    return st * 0.85


def musica_alegre(dur, bpm=116, prog_=("F", "C", "Dm", "Bb"), seed=17, raiz=65):
    beat = 60 / bpm
    bar = beat * 4
    tr = M.Track(dur + 1)
    sc = M.scale(raiz + 12, "major")
    mel = M.melody_line(sc, 64, seed, step_choices=(-1, 1, 2, -2, 0, 4))
    nb = int(math.ceil(dur / bar))
    for b in range(nb):
        t0 = b * bar
        root, kind = M.parse_chord(prog_[b % len(prog_)])
        notes = M.chord_notes(root, kind, 3)
        for k in range(8):
            tr.add(M.marimba(M.midi_hz(notes[k % 3] + 12), 0.4), t0 + k * beat / 2, 0.3, 0.3)
        for k in range(4):
            tr.add(M.bass(M.midi_hz(notes[0] - 12 + (7 if k == 2 else 0)), beat * 0.9), t0 + k * beat, 0.45)
            tr.add(M.shaker(), t0 + k * beat + beat / 2, 0.5, -0.5)
        tt = t0
        for k, d in enumerate([0.5, 0.5, 1, 1, 1] if b % 2 == 0 else [1, 0.5, 0.5, 2]):
            tr.add(M.music_box(M.midi_hz(mel[(b * 5 + k) % len(mel)]), 1.2), tt, 0.55, -0.25)
            tt += d * beat
    return tr.render(0.25)


def musica_aventura(dur, seed=23):
    """Charango, bombo y flauta (como la música de la meseta), corta."""
    bpm = 104
    beat = 60 / bpm
    bar = beat * 4
    prog_ = ("Am", "F", "C", "G")
    tr = M.Track(dur + 1)
    sc = M.scale(69, "minor")
    mel = M.melody_line(sc, 48, seed)
    for b in range(int(math.ceil(dur / bar))):
        t0 = b * bar
        root, kind = M.parse_chord(prog_[b % 4])
        notes = M.chord_notes(root, kind, 4)
        for k in range(8):
            tr.add(M.pluck(M.midi_hz(notes[k % 3]), 0.5, bright=0.7), t0 + k * beat / 2, 0.35, 0.2)
        tr.add(M.bombo(0.5, 0.8), t0, 0.5)
        tr.add(M.bombo(0.5, 0.6), t0 + 2.5 * beat, 0.4)
        tt = t0
        for k, d in enumerate([1, 1, 2] if b % 2 == 0 else [0.5, 0.5, 1, 2]):
            tr.add(M.flute(M.midi_hz(mel[(b * 4 + k) % len(mel)]), d * beat * 0.95), tt, 0.4, -0.2)
            tt += d * beat
    return tr.render(0.3)


# ---------------------------------------------------------------- salida
def grabar(nombre, dur, cuadro, audio, portada_t):
    os.makedirs(SALIDA, exist_ok=True)
    wav = os.path.join(SALIDA, f".{nombre}.wav")
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    raw = wav + ".raw"
    pcm.tofile(raw)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(M.SR), "-ac", "2", "-i", raw, wav], check=True)
    os.remove(raw)
    mp4 = os.path.join(SALIDA, f"{nombre}.mp4")
    p = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{S}x{S}", "-r", str(FPS), "-i", "-",
         "-i", wav, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
         "-movflags", "+faststart", "-shortest", mp4],
        stdin=subprocess.PIPE,
    )
    total = int(dur * FPS)
    for k in range(total):
        t = k / FPS
        fr = cuadro(t).convert("RGB")
        if abs(t - portada_t) < 0.5 / FPS:
            fr.save(os.path.join(SALIDA, f"{nombre}.jpg"), quality=80)
        p.stdin.write(fr.tobytes())
    p.stdin.close()
    p.wait()
    os.remove(wav)
    # Copia WebM (VP9 + Opus) para los navegadores sin H.264 (por ejemplo,
    # algunos Firefox o Chromium de Linux).
    webm = mp4[:-4] + ".webm"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38", "-row-mt", "1",
                    "-deadline", "good", "-cpu-used", "4", "-c:a", "libopus", "-b:a", "80k", webm], check=True)
    print(mp4, f"{dur:.1f}s", os.path.getsize(mp4) // 1024, "KB;", "webm", os.path.getsize(webm) // 1024, "KB")


# ================================================================ videos
def video_bienvenida():
    dur = 14.0
    fondo = img("theme/hero-landscape-day.jpg")
    profe = img("theme/profe/saluda.png")
    materias = [("theme/grados/4/islas/mundo-42001.png", "Matemática"), ("theme/grados/4/islas/mundo-41001.png", "Lengua"),
                ("theme/grados/4/islas/mundo-44001.png", "Naturales"), ("theme/grados/4/islas/mundo-43001.png", "Sociales")]
    cofre = img("theme/cofre.png")
    chispas = Chispas(26, (0, 0, S, S * 0.55), 2)
    t_mat = [3.2, 4.0, 4.8, 5.6]

    def cuadro(t):
        z = 1.25 - 0.2 * ease_in_out(prog(t, 0, dur))
        b = fondo_cubre(fondo, z, 0.66 + 0.14 * prog(t, 0, dur), 0.5).convert("RGBA")
        chispas.dibujar(b, t, 0.8)
        # título: cae y después sube un poco
        k = aparece(t, 0.3, 0.7)
        sube = ease_in_out(prog(t, 2.6, 3.2))
        ty = -120 + (150 - -120) * k - 60 * sube
        cartel(b, S / 2, ty, 560, 150, alpha=clamp(k * 2))
        texto(b, "¡Bienvenidos a\nMundoTest26!", S / 2, ty, 54, alpha=clamp(k * 2))
        # el profe saluda (entra desde la izquierda y se balancea)
        kp = ease_out(prog(t, 0.8, 1.6))
        bob = math.sin(t * 3) * 6
        pegar(b, profe, -150 + 260 * kp, S - 200 + bob, 380, alpha=kp, rot=math.sin(t * 2.4) * 3)
        # las cuatro materias, una por una
        for i, (ruta, nombre) in enumerate(materias):
            k = aparece(t, t_mat[i], 0.55)
            if k <= 0:
                continue
            col, fil = i % 2, i // 2
            cx = 395 + col * 190
            cy = 330 + fil * 190 + math.sin(t * 2.2 + i) * 5 * (t > t_mat[i] + 0.6)
            pegar(b, img(ruta), cx, cy - 10, 150 * k)
            texto(b, nombre, cx, cy + 72, 28, color=(255, 255, 255), borde=(40, 60, 90), alpha=clamp(k))
        # frase y cofre
        k = aparece(t, 7.2, 0.6)
        if k > 0:
            cartel(b, S / 2 + 60, 640, 560, 100, alpha=clamp(k))
            texto(b, "Superá mundos, ganá premios\ny armá tu colección", S / 2 + 60, 640, 30, color=(120, 60, 10), borde=(255, 248, 225), alpha=clamp(k), ancho_borde=2)
            pegar(b, cofre, 120, 590 - 10 * math.sin(t * 3), 110 * k)
        # cierre
        k = aparece(t, 10.6, 0.6)
        if k > 0:
            b.alpha_composite(Image.new("RGBA", b.size, (20, 40, 70, int(110 * clamp(k)))))
            pul = 1 + 0.05 * math.sin((t - 10.6) * 6)
            brillo_dorado(b, S / 2, S / 2, 330, t, clamp(k))
            texto(b, "¡A explorar!", S / 2, S / 2, 92, escala=k * pul)
        fundido(b, t, dur)
        return b

    ef = [(efecto_arpa(), 0.3, 0.5), (efecto_pop(), 0.9, 0.5)] + [(efecto_pop(), x, 0.6) for x in t_mat]
    ef += [(efecto_destello(), 7.2, 0.4), (efecto_destello(1.2), 10.6, 0.6)]
    audio = mezclar(musica_alegre(dur), ef, dur)
    grabar("bienvenida", dur, cuadro, audio, 11.6)


def video_festejo():
    dur = 8.0
    trofeo = img("theme/profe/trofeo.png")
    fondo = degradado((120, 200, 255), (255, 236, 180))
    pap = Papelitos(140, 0.9)
    pap2 = Papelitos(100, 3.2, seed=9)
    chispas = Chispas(30, (0, 0, S, S), 4)

    def cuadro(t):
        b = fondo.copy()
        k = aparece(t, 0.2, 0.8)
        brillo_dorado(b, S / 2, S / 2 + 20, 420, t, clamp(k))
        chispas.dibujar(b, t, clamp(k))
        salto = abs(math.sin(t * 3.2)) * 18 * (t > 1.2)
        pegar(b, trofeo, S / 2, S / 2 + 60 - salto, 420 * k, rot=math.sin(t * 2) * 4 * (t > 1.2))
        pap.dibujar(b, t)
        pap2.dibujar(b, t)
        kt = aparece(t, 0.9, 0.6)
        texto(b, "¡Mundo superado!", S / 2, 110, 76, escala=kt * (1 + 0.04 * math.sin(t * 5)))
        kt2 = aparece(t, 2.0, 0.6)
        texto(b, "¡Muy bien! Seguí así", S / 2, 640, 42, color=(255, 255, 255), borde=(30, 70, 120), alpha=clamp(kt2), escala=kt2)
        fundido(b, t, dur, entrada=0.25)
        return b

    st = M.pieza_festejo()
    musica = np.zeros((int(dur * M.SR), 2))
    musica[: len(st)] = st[: len(musica)]
    ef = [(efecto_arpa(0.5), 0.15, 0.5), (efecto_destello(), 0.9, 0.6), (efecto_pop(), 0.95, 0.5), (efecto_destello(1.2), 3.2, 0.5), (efecto_pop(), 2.0, 0.4)]
    audio = mezclar(musica, ef, dur)
    grabar("festejo", dur, cuadro, audio, 2.6)


def video_reserva():
    dur = 16.0
    mapa = img(os.path.join(AQUI, "mapa-patagonia.png"))  # escala 3 px por unidad del mapa
    esc = mapa.width / 528.6
    # caja de Santa Cruz en unidades del mapa (de src/lib/reserva/mapaDatos.ts)
    sc = (35.2, 737.9, 198.8, 215.9)
    postales = ["theme/reserva/postales/rio-chico.jpg", "theme/reserva/postales/lago-argentino.jpg", "theme/reserva/postales/chubut.jpg"]
    animales = [("huemul", True), ("maca-tobiano", True), ("cauquen-colorado", True), ("ballena-franca", False)]
    chispas = Chispas(20, (0, 0, S, S), 7)

    def vista_mapa(t):
        # del país entero (0–1 s) al zoom sobre Santa Cruz (1–3.5 s)
        k = ease_in_out(prog(t, 1.0, 3.5))
        lado0 = mapa.height * 1.0
        cx0, cy0 = mapa.width / 2, mapa.height / 2
        lado1 = max(sc[2], sc[3]) * esc * 1.25
        cx1, cy1 = (sc[0] + sc[2] / 2) * esc, (sc[1] + sc[3] / 2) * esc
        lado = lado0 + (lado1 - lado0) * k
        cx, cy = cx0 + (cx1 - cx0) * k, cy0 + (cy1 - cy0) * k
        lienzo = Image.new("RGBA", (int(lado), int(lado)), (191, 227, 245, 255))
        lienzo.alpha_composite(mapa, (int(lado / 2 - cx), int(lado / 2 - cy)))
        return lienzo.resize((S, S), Image.LANCZOS)

    def cuadro(t):
        if t < 5.0:
            b = vista_mapa(t)
        else:
            b = degradado((250, 236, 200), (200, 230, 210))
        kt = aparece(t, 0.4, 0.7)
        if t < 5.2:
            cartel(b, S / 2, 85, 640, 120, alpha=clamp(kt) * (1 - prog(t, 4.6, 5.2)))
            texto(b, "Reserva y expedición\npatagónica", S / 2, 85, 46, alpha=clamp(kt) * (1 - prog(t, 4.6, 5.2)))
        if 3.4 < t < 5.2:
            texto(b, "¡Empezamos en Río Chico!", S / 2, 650, 38, color=(255, 255, 255), borde=(130, 30, 30), alpha=prog(t, 3.4, 3.8) * (1 - prog(t, 4.8, 5.2)))
        # postales que llegan girando, como cartas
        if 5.0 <= t < 10.6:
            texto(b, "Recorré la Patagonia", S / 2, 70, 44, alpha=prog(t, 5.0, 5.4) * (1 - prog(t, 10.2, 10.6)))
            for i, ruta in enumerate(postales):
                k = aparece(t, 5.3 + i * 1.3, 0.7)
                if k <= 0:
                    continue
                im = img(ruta)
                w = 470
                h = int(w * im.height / im.width)
                carta = Image.new("RGBA", (w + 24, h + 24), (255, 255, 255, 255))
                carta.alpha_composite(im.resize((w, h), Image.LANCZOS), (12, 12))
                rot = (-8, 5, -3)[i] * k
                y = 250 + i * 95
                x = S / 2 + (1 - k) * (500 if i % 2 == 0 else -500)
                pegar(b, carta, x, y + 60, (h + 24) * 0.92, alpha=1 - prog(t, 10.2, 10.6), rot=rot)
        # animales con su sello de «En peligro»
        if t >= 10.4:
            chispas.dibujar(b, t)
            texto(b, "Conocé y cuidá su fauna", S / 2, 70, 44, alpha=prog(t, 10.4, 10.8))
            for i, (a, peligro) in enumerate(animales):
                k = aparece(t, 10.7 + i * 0.6, 0.55)
                if k <= 0:
                    continue
                cx = 200 + (i % 2) * 320
                cy = 245 + (i // 2) * 250
                cartel(b, cx, cy, 270, 225, alpha=clamp(k), color=(255, 255, 255, 240), borde=(230, 180, 60, 255))
                pegar(b, img(f"theme/reserva/especies/{a}.png"), cx, cy, 190 * k)
                if peligro and t > 10.7 + i * 0.6 + 0.4:
                    kk = aparece(t, 10.7 + i * 0.6 + 0.4, 0.4)
                    cartel(b, cx + 60, cy - 100, 170, 44, alpha=clamp(kk), color=(220, 38, 38, 255), borde=(255, 255, 255, 255))
                    texto(b, "En peligro", cx + 60, cy - 100, 26, color=(255, 255, 255), borde=(150, 20, 20), escala=kk, ancho_borde=2)
            k = aparece(t, 13.6, 0.6)
            if k > 0:
                cartel(b, S / 2, 655, 600, 90, alpha=clamp(k), color=(16, 120, 90, 240), borde=(255, 255, 255, 255))
                texto(b, "¡Explorá y armá tu reserva!", S / 2, 655, 40, color=(255, 255, 255), borde=(10, 70, 50), escala=k)
        fundido(b, t, dur)
        return b

    ef = [(efecto_arpa(1.2), 1.1, 0.6), (efecto_pop(), 3.4, 0.5)] + [(efecto_arpa(0.5), 5.3 + i * 1.3, 0.5) for i in range(3)]
    ef += [(efecto_pop(), 10.7 + i * 0.6, 0.55) for i in range(4)] + [(efecto_destello(1.2), 13.6, 0.6)]
    audio = mezclar(musica_aventura(dur), ef, dur)
    grabar("reserva", dur, cuadro, audio, 14.6)


def video_monte_leon():
    dur = 15.0
    escenas = [
        ("theme/monte-leon/escenas/viaje-ruta.jpg", "Viajamos por la ruta", 0.0),
        ("theme/monte-leon/escenas/pinguinera.jpg", "Pingüinos de Magallanes", 3.6),
        ("theme/monte-leon/escenas/loberia.jpg", "Lobos marinos", 6.8),
        ("theme/monte-leon/escenas/cabeza-del-leon.jpg", "", 9.8),
    ]
    mochila = img("theme/monte-leon/mochila.png")
    objetos = ["botella-agua-ml", "anteojos-sol-ml", "gorra-ml", "protector-solar-ml"]

    def escena_en(t):
        i = max(k for k, e in enumerate(escenas) if e[2] <= t)
        return i

    def cuadro(t):
        i = escena_en(t)
        ruta, rotulo, t0 = escenas[i]
        t1 = escenas[i + 1][2] if i + 1 < len(escenas) else dur
        k = prog(t, t0, t1 + 0.6)
        b = fondo_cubre(img(ruta), 1.12 + 0.12 * k, 0.4 + 0.2 * k, 0.5).convert("RGBA")
        # fundido cruzado con la escena anterior
        if i > 0 and t < t0 + 0.5:
            r0, _, a0 = escenas[i - 1]
            prev = fondo_cubre(img(r0), 1.24, 0.6, 0.5).convert("RGBA")
            prev.putalpha(int(255 * (1 - (t - t0) / 0.5)))
            b.alpha_composite(prev)
        if i == 0:
            kt = aparece(t, 0.3, 0.7)
            cartel(b, S / 2, 100, 560, 120, alpha=clamp(kt) * (1 - prog(t, 3.2, 3.6)))
            texto(b, "Viaje a Monte León", S / 2, 100, 56, alpha=clamp(kt) * (1 - prog(t, 3.2, 3.6)))
        if rotulo:
            kr = aparece(t, t0 + 0.6, 0.5)
            a = clamp(kr) * (1 - prog(t, t1 - 0.3, t1))
            cartel(b, S / 2, 640, 520, 86, alpha=a, color=(255, 255, 255, 235), borde=(30, 110, 160, 255))
            texto(b, rotulo, S / 2, 640, 40, color=(20, 80, 130), borde=(255, 255, 255), alpha=a, ancho_borde=2)
        if i == 3:
            b.alpha_composite(Image.new("RGBA", b.size, (255, 248, 230, int(120 * prog(t, 9.8, 10.4)))))
            km = aparece(t, 10.2, 0.6)
            pegar(b, mochila, S / 2, 390 + math.sin(t * 3) * 6, 280 * km)
            for j, o in enumerate(objetos):
                ko = aparece(t, 10.9 + j * 0.45, 0.5)
                ang = -math.pi / 2 + (j - 1.5) * 0.75
                cx = S / 2 + 250 * math.cos(ang) * ko
                cy = 400 + 230 * math.sin(ang) * ko + 60
                pegar(b, img(f"theme/accessories-temporada/{o}.png"), cx, cy, 110 * ko)
            kt = aparece(t, 12.6, 0.6)
            cartel(b, S / 2, 650, 600, 90, alpha=clamp(kt), color=(14, 116, 144, 240), borde=(255, 255, 255, 255))
            texto(b, "¡Preparamos la mochila!", S / 2, 650, 42, color=(255, 255, 255), borde=(10, 60, 80), escala=kt)
        fundido(b, t, dur)
        return b

    ef = [(efecto_arpa(0.6), e[2], 0.45) for e in escenas[1:]] + [(efecto_pop(), 10.2, 0.6)]
    ef += [(efecto_pop(), 10.9 + j * 0.45, 0.5) for j in range(4)] + [(efecto_destello(1.2), 12.6, 0.55)]
    audio = mezclar(musica_alegre(dur, bpm=108, prog_=("C", "G", "Am", "F"), seed=31, raiz=60), ef, dur)
    grabar("monte-leon", dur, cuadro, audio, 13.4)


VIDEOS = {"bienvenida": video_bienvenida, "festejo": video_festejo, "reserva": video_reserva, "monte-leon": video_monte_leon}

if __name__ == "__main__":
    for nombre in sys.argv[1:] or list(VIDEOS):
        VIDEOS[nombre]()
