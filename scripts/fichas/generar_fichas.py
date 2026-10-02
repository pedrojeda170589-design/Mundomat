"""Genera las fichas de refuerzo en PDF (private/fichas/mundo-<id>-<v>.pdf).

Las fichas NO son la app en papel: proponen actividades complementarias
(hacer con objetos reales, juegos en familia, investigar, conversar, crear)
sobre el contenido de cada mundo. El contenido está en
scripts/fichas/<materia>.json (formato en scripts/fichas/FORMATO.md).

Uso:  python3 scripts/fichas/generar_fichas.py
Requiere: reportlab y las fuentes Andika y Fredoka (ver FONT_DIR).
"""
import json
import os
import re

from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from reportlab.pdfgen import canvas

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.environ.get("FONT_DIR", "/tmp/fonts2")
OUT = os.path.join(ROOT, "private", "fichas")
ISLANDS = os.path.join(ROOT, "public", "theme", "islands")


def island_path(wid):
    """Isla del mundo según su grado (1.º: 11001+, 2.º: 21001+…; 3.º: 1–47)."""
    if wid >= 10000:
        return os.path.join(ROOT, "public", "theme", "grados", str(wid // 10000), "islas", f"mundo-{wid}.png")
    return os.path.join(ISLANDS, f"mundo-{wid}.png")


def find_font(filename):
    for d in (FONT_DIR, HERE, "/tmp/fonts2"):
        p = os.path.join(d, filename)
        if os.path.exists(p):
            return p
    return os.path.join(FONT_DIR, filename)


pdfmetrics.registerFont(TTFont("Andika", find_font("Andika-Regular.ttf")))
pdfmetrics.registerFont(TTFont("AndikaB", find_font("Andika-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Fredoka", find_font("Fredoka-Bold.ttf")))

W, H = A4
M = 40
BOTTOM = 46
SUBJ = {
    "matematica": ("Matemática", "#2563eb"),
    "lengua": ("Lengua", "#db2777"),
    "naturales": ("Ciencias Naturales", "#16a34a"),
    "sociales": ("Ciencias Sociales", "#d97706"),
}
KINDS = {
    "hacer": ("HAGO", "#0ea5e9"),
    "juego": ("JUGAMOS", "#f59e0b"),
    "investigo": ("INVESTIGO", "#10b981"),
    "converso": ("CONVERSAMOS", "#8b5cf6"),
    "creo": ("CREO", "#ec4899"),
}


def world_names():
    """Nombre y materia de cada mundo, leídos de src/lib/worlds.ts y src/lib/grade1/worlds.ts."""
    src = open(os.path.join(ROOT, "src", "lib", "worlds.ts"), encoding="utf-8").read()
    out = {}
    for m in re.finditer(r'\{\s*id: (\d+),\s*name: "([^"]+)",\s*emoji: "[^"]*",\s*subject: "(\w+)"', src):
        out[int(m.group(1))] = (m.group(2), m.group(3))

    g1_path = os.path.join(ROOT, "src", "lib", "grade1", "worlds.ts")
    if os.path.exists(g1_path):
        g1_src = open(g1_path, encoding="utf-8").read()
        bases = {"lengua": 11000, "matematica": 12000, "sociales": 13000, "naturales": 14000}
        for subj, base in bases.items():
            pattern = rf'build\("{subj}",\s*\[(.*?)\]\);'
            block_match = re.search(pattern, g1_src, re.DOTALL)
            if block_match:
                block = block_match.group(1)
                for m in re.finditer(r'\{\s*n:\s*(\d+),\s*name:\s*"([^"]+)"', block):
                    n = int(m.group(1))
                    name = m.group(2)
                    out[base + n] = (name, subj)
    return out


class Sheet:
    def __init__(self, path, wid, name, subject, version, data):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle(f"MundoTest26 · {name} · Ficha {version}")
        self.wid, self.name, self.subject, self.version, self.data = wid, name, subject, version, data
        self.label, self.col = SUBJ[subject]
        self.page = 0
        self.y = 0

    # ---- página ----
    def new_page(self):
        if self.page:
            self.footer()
            self.c.showPage()
        self.page += 1
        c = self.c
        top = H - M
        hh = 74 if self.page == 1 else 40
        c.setFillColor(HexColor(self.col))
        c.roundRect(M, top - hh, W - 2 * M, hh, 14, fill=1, stroke=0)
        c.setFillColor(white)
        if self.page == 1:
            c.setFont("AndikaB", 10)
            c.drawString(M + 16, top - 20, f"MundoTest26 · {self.label} · Ficha de refuerzo {self.version}")
            c.setFont("Fredoka", 19)
            c.drawString(M + 16, top - 44, self.fit(self.data["title"], "Fredoka", 19, W - 2 * M - 120))
            c.setFont("Andika", 10)
            c.drawString(M + 16, top - 62, f"Para seguir aprendiendo después de: {self.name}")
            img = island_path(self.wid)
            if os.path.exists(img):
                c.drawImage(ImageReader(img), W - M - 94, top - 90, 90, 90, mask="auto", preserveAspectRatio=True)
            y = top - hh - 22
            c.setFillColor(black)
            c.setFont("Andika", 12)
            c.drawString(M, y, "Nombre: ______________________________")
            c.drawString(W - M - 170, y, "Fecha: ____________")
            self.y = y - 16
        else:
            c.setFont("Fredoka", 14)
            c.drawString(M + 16, top - 26, self.fit(self.data["title"], "Fredoka", 14, W - 2 * M - 32))
            self.y = top - hh - 18
        c.setFillColor(black)

    def footer(self):
        c = self.c
        c.setFont("Andika", 8)
        c.setFillColor(HexColor("#6b7280"))
        c.drawCentredString(
            W / 2, 24, f"MundoTest26 · Ficha de refuerzo para hacer en casa o en el aula · Hoja {self.page}"
        )
        c.setFillColor(black)

    def ensure(self, h):
        if self.y - h < BOTTOM:
            self.new_page()

    @staticmethod
    def fit(text, font, size, maxw):
        if pdfmetrics.stringWidth(text, font, size) <= maxw:
            return text
        while text and pdfmetrics.stringWidth(text + "…", font, size) > maxw:
            text = text[:-1]
        return text + "…"

    def para(self, text, x, width, font="Andika", size=12, leading=15, color=black):
        lines = simpleSplit(text, font, size, width)
        self.ensure(leading * len(lines))
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for ln in lines:
            self.c.drawString(x, self.y - size, ln)
            self.y -= leading
        self.c.setFillColor(black)

    # ---- bloques ----
    def family_box(self):
        lines = ["Para la familia"] + simpleSplit(self.data["purpose"], "Andika", 10.5, W - 2 * M - 24)
        h = 14 * len(lines) + 14
        self.ensure(h + 8)
        c = self.c
        c.setFillColor(HexColor("#fef3c7"))
        c.setStrokeColor(HexColor("#f59e0b"))
        c.roundRect(M, self.y - h, W - 2 * M, h, 10, fill=1, stroke=1)
        c.setFillColor(HexColor("#78350f"))
        y = self.y - 17
        for i, ln in enumerate(lines):
            c.setFont("AndikaB" if i == 0 else "Andika", 10.5)
            c.drawString(M + 12, y, ln)
            y -= 14
        c.setFillColor(black)
        self.y -= h + 14

    def block_height(self, b):
        h = 30
        for s in b.get("steps", []):
            h += 15 * len(simpleSplit(s, "Andika", 12, W - 2 * M - 30)) + 3
        if b.get("table"):
            h += 22 * (b["table"]["rows"] + 1) + 10
        if b.get("draw"):
            h += 15 * len(simpleSplit(b["draw"], "Andika", 12, W - 2 * M)) + 140
        h += 24 * int(b.get("lines", 0) or 0)
        return h

    def block(self, n, b):
        label, kcol = KINDS.get(b["kind"], ("ACTIVIDAD", "#64748b"))
        # Si el bloque entero entra en una hoja nueva, no se corta.
        if self.block_height(b) <= self.y - BOTTOM or self.block_height(b) > H - 2 * M - 80:
            self.ensure(60)
        else:
            self.new_page()
        c = self.c
        # etiqueta del tipo de actividad
        c.setFont("AndikaB", 9)
        tw = pdfmetrics.stringWidth(label, "AndikaB", 9) + 16
        c.setFillColor(HexColor(kcol))
        c.roundRect(M, self.y - 16, tw, 16, 8, fill=1, stroke=0)
        c.setFillColor(white)
        c.drawString(M + 8, self.y - 12, label)
        c.setFillColor(HexColor(self.col))
        c.setFont("Fredoka", 15)
        c.drawString(M + tw + 8, self.y - 14, self.fit(f"{n}. {b['title']}", "Fredoka", 15, W - 2 * M - tw - 8))
        c.setFillColor(black)
        self.y -= 26
        for i, s in enumerate(b.get("steps", []), 1):
            lines = simpleSplit(s, "Andika", 12, W - 2 * M - 30)
            self.ensure(15 * len(lines))
            c.setFillColor(HexColor(kcol))
            c.circle(M + 9, self.y - 8, 8, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont("AndikaB", 9)
            c.drawCentredString(M + 9, self.y - 11, str(i))
            c.setFillColor(black)
            c.setFont("Andika", 12)
            for ln in lines:
                c.drawString(M + 26, self.y - 12, ln)
                self.y -= 15
            self.y -= 3
        if b.get("table"):
            self.table(b["table"]["cols"], b["table"]["rows"], kcol)
        if b.get("draw"):
            self.y -= 4
            self.para(b["draw"], M, W - 2 * M, font="AndikaB", size=11.5, leading=15)
            self.ensure(130)
            c.setStrokeColor(HexColor(kcol))
            c.setLineWidth(1.6)
            c.setDash(5, 4)
            c.roundRect(M, self.y - 124, W - 2 * M, 120, 12, fill=0, stroke=1)
            c.setDash()
            c.setStrokeColor(black)
            self.y -= 132
        for _ in range(int(b.get("lines", 0) or 0)):
            self.ensure(24)
            c.setStrokeColor(HexColor("#9ca3af"))
            c.setLineWidth(0.8)
            c.line(M, self.y - 20, W - M, self.y - 20)
            c.setStrokeColor(black)
            self.y -= 24
        self.y -= 14

    def table(self, cols, rows, kcol):
        c = self.c
        rh = 22
        h = rh * (rows + 1)
        self.ensure(h + 8)
        cw = (W - 2 * M) / len(cols)
        top = self.y - 4
        c.setFillColor(HexColor(kcol))
        c.rect(M, top - rh, W - 2 * M, rh, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("AndikaB", 10.5)
        for i, col in enumerate(cols):
            c.drawString(M + i * cw + 6, top - 15, self.fit(col, "AndikaB", 10.5, cw - 10))
        c.setFillColor(black)
        c.setStrokeColor(HexColor("#94a3b8"))
        c.setLineWidth(0.8)
        c.rect(M, top - h, W - 2 * M, h, fill=0, stroke=1)
        for r in range(1, rows + 1):
            c.line(M, top - rh * (r + 1) + rh, W - M, top - rh * (r + 1) + rh)
        for i in range(1, len(cols)):
            c.line(M + i * cw, top, M + i * cw, top - h)
        c.setStrokeColor(black)
        self.y = top - h - 10

    def self_check(self):
        items = self.data.get("selfCheck", [])
        need = 34 + 26 * len(items)
        self.ensure(need)
        c = self.c
        c.setFillColor(HexColor(self.col))
        c.setFont("Fredoka", 14)
        c.drawString(M, self.y - 14, "¿Cómo me fue? Pintá la carita que corresponde")
        c.setFillColor(black)
        self.y -= 28
        for it in items:
            c.setFont("Andika", 11.5)
            c.drawString(M, self.y - 13, self.fit(it, "Andika", 11.5, W - 2 * M - 120))
            for k, mood in enumerate(("feliz", "medio", "dificil")):
                self.face(W - M - 100 + k * 36, self.y - 9, mood)
            self.y -= 26
        c.setFont("Andika", 8.5)
        c.setFillColor(HexColor("#6b7280"))
        c.drawString(W - M - 118, self.y - 4, "Lo sé    Casi    Me cuesta")
        c.setFillColor(black)
        self.y -= 12

    def free_space(self):
        """Lo que queda de la última hoja: espacio libre para el chico."""
        if self.y - BOTTOM < 150:
            return
        c = self.c
        self.y -= 18
        c.setFillColor(HexColor(self.col))
        c.setFont("Fredoka", 14)
        c.drawString(M, self.y - 14, "Mi espacio")
        c.setFillColor(HexColor("#6b7280"))
        c.setFont("Andika", 10.5)
        c.drawString(M + 86, self.y - 13, "Dibujá o escribí lo que más te gustó descubrir con esta ficha.")
        c.setFillColor(black)
        top = self.y - 24
        c.setStrokeColor(HexColor(self.col))
        c.setLineWidth(1.4)
        c.setDash(5, 4)
        c.roundRect(M, BOTTOM, W - 2 * M, top - BOTTOM, 14, fill=0, stroke=1)
        c.setDash()
        c.setStrokeColor(black)
        self.y = BOTTOM

    def face(self, x, y, mood):
        c = self.c
        c.setStrokeColor(HexColor("#475569"))
        c.setLineWidth(1)
        c.circle(x, y, 10, fill=0, stroke=1)
        c.circle(x - 3.5, y + 3, 1.1, fill=1, stroke=0)
        c.circle(x + 3.5, y + 3, 1.1, fill=1, stroke=0)
        p = c.beginPath()
        if mood == "feliz":
            p.arc(x - 5, y - 7, x + 5, y + 1, 200, 140)
        elif mood == "medio":
            p.moveTo(x - 4.5, y - 4)
            p.lineTo(x + 4.5, y - 4)
        else:
            p.arc(x - 5, y - 8, x + 5, y - 1, 20, 140)
        c.drawPath(p, stroke=1, fill=0)
        c.setStrokeColor(black)

    def build(self):
        self.new_page()
        self.family_box()
        for i, b in enumerate(self.data["blocks"], 1):
            self.block(i, b)
        self.self_check()
        self.free_space()
        self.footer()
        self.c.save()
        return self.page


def main():
    os.makedirs(OUT, exist_ok=True)
    names = world_names()
    made = 0
    pages = {}
    for subject in ("matematica", "lengua", "naturales", "sociales"):
        # 3.º grado
        p3 = os.path.join(HERE, f"{subject}.json")
        if os.path.exists(p3):
            data = json.load(open(p3, encoding="utf-8"))
            for wid_s, versions in data.items():
                wid = int(wid_s)
                name, subj = names[wid]
                assert subj == subject, (wid, subj, subject)
                for v, ficha in enumerate(versions, 1):
                    path = os.path.join(OUT, f"mundo-{wid}-{v}.pdf")
                    pages[(wid, v)] = Sheet(path, wid, name, subject, v, ficha).build()
                    made += 1

        # 1.º grado
        p1 = os.path.join(HERE, f"primero-{subject}.json")
        if os.path.exists(p1):
            data = json.load(open(p1, encoding="utf-8"))
            for wid_s, versions in data.items():
                wid = int(wid_s)
                name, subj = names[wid]
                assert subj == subject, (wid, subj, subject)
                for v, ficha in enumerate(versions, 1):
                    path = os.path.join(OUT, f"mundo-{wid}-{v}.pdf")
                    pages[(wid, v)] = Sheet(path, wid, name, subject, v, ficha).build()
                    made += 1

    print(f"{made} fichas generadas en {OUT}")
    print("hojas por ficha:", sorted(set(pages.values())), "· más largas:", [k for k, p in pages.items() if p > 2])


if __name__ == "__main__":
    main()
