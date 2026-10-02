"""Generador de mapas e islas para 2.º grado (Bosque de Lengas).
# ⚠️ YA NO SE USA: las islas y mapas de 2.º ahora son ilustraciones (CL-06).
# No correr este script: pisaría public/theme/grados/2/**.
Genera:
- public/theme/grados/2/mapa/etapa-{1..4}.jpg (800x1200)
- public/theme/grados/2/islas/mundo-{wid}.png (340x340, RGBA transparente)
- public/theme/grados/2/islas/practica.png
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MAP_DIR = os.path.join(ROOT, "public", "theme", "grados", "2", "mapa")
ISLAND_DIR = os.path.join(ROOT, "public", "theme", "grados", "2", "islas")
FONT_PATH = os.path.join(ROOT, "scripts", "fichas", "Fredoka-Bold.ttf")

os.makedirs(MAP_DIR, exist_ok=True)
os.makedirs(ISLAND_DIR, exist_ok=True)


def draw_gradient_vertical(draw, width, height, top_color, bottom_color):
    for y in range(height):
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * y / height)
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * y / height)
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def generate_map_stage(stage: int):
    width, height = 800, 1200
    im = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(im)

    # 1. Cielo patagónico de montaña
    sky_top = (70, 130, 180) if stage <= 2 else (65, 115, 175)
    sky_bot = (220, 235, 245) if stage <= 2 else (245, 230, 205)
    draw_gradient_vertical(draw, width, 400, sky_top, sky_bot)

    # Nubes suaves
    for _ in range(5 + stage):
        cx = random.randint(50, 750)
        cy = random.randint(40, 200)
        rx = random.randint(60, 140)
        ry = random.randint(20, 45)
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(255, 255, 255, 160))

    # 2. Picos andinos con nieve
    peaks = [
        [(0, 320), (160, 140), (320, 320)],
        [(240, 320), (460, 100), (680, 320)],
        [(580, 320), (740, 160), (800, 320)],
    ]
    for p in peaks:
        draw.polygon(p, fill=(110, 130, 155))
        # Nieve en la cumbre
        tip = p[1]
        base_y = tip[1] + 65
        snow = [p[0][0] + (tip[0] - p[0][0]) * 0.6, base_y]
        snow_r = [p[2][0] + (tip[0] - p[2][0]) * 0.6, base_y]
        draw.polygon([tip, (snow[0], base_y), (tip[0], base_y + 15), (snow_r[0], base_y)], fill=(245, 250, 255))

    # 3. Laderas del bosque de lengas estratificado
    # Paleta del bosque: verde bosque, ocres, dorados y rojizos
    colors = [
        (45, 90, 60),      # verde oscuro
        (180, 120, 40),    # ocre lenga
        (205, 95, 30),     # rojizo otoño
        (75, 115, 55),     # musgo y verde hoja
    ]

    for band in range(5):
        y_top = 280 + band * 160
        y_bot = height
        fill_col = colors[(band + stage) % len(colors)]
        points = [(0, y_top + 40)]
        for x in range(0, width + 50, 40):
            var = int(25 * math.sin(x * 0.015 + band))
            points.append((x, y_top + var))
        points.append((width, height))
        points.append((0, height))
        draw.polygon(points, fill=fill_col)

    # 4. Árboles de lenga estilizados a lo largo de las laderas
    tree_colors = [
        (190, 80, 25),   # rojo lenga
        (225, 160, 35),  # dorado lenga
        (165, 125, 45),  # ocre
        (50, 105, 50),   # verde perenne
    ]
    for layer in range(4):
        base_y = 360 + layer * 200
        count = 16 + layer * 6
        tree_size = 35 + layer * 20
        for _ in range(count):
            tx = random.randint(20, width - 20)
            ty = base_y + random.randint(-40, 60)
            t_col = tree_colors[random.randint(0, len(tree_colors) - 1)]
            # Tronco
            draw.line([(tx, ty), (tx, ty + int(tree_size * 0.6))], fill=(70, 45, 30), width=max(2, layer + 1))
            # Copa de lenga (estratificada)
            draw.ellipse([tx - tree_size // 2, ty - tree_size, tx + tree_size // 2, ty], fill=t_col)
            draw.ellipse([tx - int(tree_size * 0.35), ty - int(tree_size * 1.3), tx + int(tree_size * 0.35), ty - int(tree_size * 0.5)], fill=t_col)

    # 5. Cascada y arroyo de montaña (etapas 3 y 4 más caudalosos)
    stream_pts = []
    sx = 520
    for sy in range(350, height, 20):
        sx += int(15 * math.sin(sy * 0.02) + (5 if stage > 2 else 0))
        stream_pts.append((sx, sy))
    for i in range(len(stream_pts) - 1):
        sw = int(6 + (stream_pts[i][1] / height) * 18)
        draw.line([stream_pts[i], stream_pts[i + 1]], fill=(130, 200, 245), width=sw)
        # Espuma blanca
        draw.line([stream_pts[i], stream_pts[i + 1]], fill=(255, 255, 255), width=max(1, sw // 3))

    # 6. Sendero de piedras que sube en zigzag
    trail_points = [
        (400, 1160),
        (260, 1000),
        (540, 840),
        (280, 680),
        (520, 520),
        (380, 380),
    ]
    # Dibujar sendero de tierra y piedras
    for i in range(len(trail_points) - 1):
        p1, p2 = trail_points[i], trail_points[i + 1]
        steps = 40
        for step in range(steps):
            t = step / steps
            px = int(p1[0] * (1 - t) + p2[0] * t + 8 * math.sin(t * math.pi * 3))
            py = int(p1[1] * (1 - t) + p2[1] * t)
            # Piedra del camino
            pr = random.randint(6, 12)
            stone_col = (175, 160, 140) if random.random() > 0.4 else (145, 130, 115)
            draw.ellipse([px - pr, py - pr // 2, px + pr, py + pr // 2], fill=stone_col, outline=(100, 85, 70))

    # 7. Detalles especiales según etapa:
    if stage >= 3:
        # Refugio de madera en la montaña
        rx, ry = 360, 340
        # Paredes de troncos
        draw.rectangle([rx - 45, ry - 30, rx + 45, ry + 25], fill=(115, 70, 40), outline=(60, 35, 20), width=3)
        # Techo a dos aguas con chimenea
        draw.polygon([(rx - 55, ry - 30), (rx, ry - 65), (rx + 55, ry - 30)], fill=(65, 75, 85), outline=(40, 45, 50), width=2)
        # Chimenea y humo
        draw.rectangle([rx + 20, ry - 75, rx + 32, ry - 50], fill=(130, 75, 55))
        for h in range(4):
            draw.ellipse([rx + 22 + h * 4, ry - 82 - h * 12, rx + 34 + h * 8, ry - 72 - h * 12], fill=(240, 240, 240, 150))
        # Puerta y ventana cálida
        draw.rectangle([rx - 12, ry - 5, rx + 12, ry + 25], fill=(70, 40, 20))
        draw.rectangle([rx + 20, ry - 15, rx + 35, ry], fill=(255, 220, 100))

    if stage == 4:
        # Huemul pastando en el claro cerca del refugio
        hx, hy = 470, 430
        # Cuerpo
        draw.ellipse([hx - 18, hy - 10, hx + 18, hy + 10], fill=(140, 95, 60))
        # Cuello y cabeza
        draw.polygon([(hx - 12, hy - 5), (hx - 22, hy - 25), (hx - 15, hy - 28), (hx - 5, hy - 8)], fill=(140, 95, 60))
        draw.ellipse([hx - 25, hy - 32, hx - 14, hy - 22], fill=(140, 95, 60))
        # Patas
        for lx in [-12, -4, 8, 14]:
            draw.line([(hx + lx, hy + 5), (hx + lx, hy + 24)], fill=(110, 70, 40), width=3)

    out_file = os.path.join(MAP_DIR, f"etapa-{stage}.jpg")
    im.save(out_file, "JPEG", quality=92)
    print(f"Mapa generado: {out_file}")


def draw_island_base(draw, cx, cy, w, h):
    """Dibuja la base de bosque 3D infantil: roca estratificada, tierra fértil oscura, musgo y lengas."""
    # 1. Sombra base proyectada
    draw.ellipse([cx - w // 2 - 10, cy + h // 4 - 6, cx + w // 2 + 10, cy + h // 2 + 25], fill=(20, 30, 20, 80))

    # 2. Cono rocoso inferior (tierra y estratos de roca)
    rock_points = [
        (cx - w // 2 + 15, cy),
        (cx - w // 3, cy + h // 2 + 35),
        (cx, cy + h // 2 + 55),
        (cx + w // 3, cy + h // 2 + 38),
        (cx + w // 2 - 15, cy),
    ]
    draw.polygon(rock_points, fill=(65, 45, 35))

    # Estratos de roca
    draw.line([(cx - w // 3 + 10, cy + h // 3), (cx + w // 3 - 10, cy + h // 3 + 5)], fill=(95, 75, 60), width=4)
    draw.line([(cx - w // 4, cy + h // 2 + 10), (cx + w // 4, cy + h // 2 + 12)], fill=(50, 35, 25), width=3)

    # 3. Plataforma superior de tierra oscura y césped/musgo
    draw.ellipse([cx - w // 2, cy - h // 3, cx + w // 2, cy + h // 3], fill=(48, 85, 40))  # Base musgo
    draw.ellipse([cx - w // 2 + 6, cy - h // 3 + 4, cx + w // 2 - 6, cy + h // 3 - 6], fill=(62, 115, 52)) # Superficie clara

    # 4. Arroyito que cruza la isla
    draw.arc([cx - w // 4, cy - h // 4, cx + w // 3, cy + h // 4], 30, 160, fill=(90, 185, 235), width=6)
    draw.arc([cx - w // 4, cy - h // 4, cx + w // 3, cy + h // 4], 30, 160, fill=(230, 248, 255), width=2)

    # 5. Hojas caídas doradas y rojizas de lenga
    leaf_colors = [(215, 140, 30), (195, 75, 25), (230, 175, 45)]
    random.seed(cx + cy)
    for _ in range(7):
        lx = cx + random.randint(-w // 3, w // 3)
        ly = cy + random.randint(-h // 4, h // 4)
        col = random.choice(leaf_colors)
        draw.ellipse([lx - 4, ly - 2, lx + 4, ly + 2], fill=col)

    # 6. Pequeño hongo rojo con pintas blancas
    hx, hy = cx + w // 3 - 15, cy - 6
    draw.rectangle([hx - 2, hy, hx + 2, hy + 8], fill=(235, 230, 220)) # Tallo
    draw.chord([hx - 8, hy - 8, hx + 8, hy + 4], 180, 360, fill=(225, 45, 35)) # Sombrerito
    draw.ellipse([hx - 4, hy - 5, hx - 2, hy - 3], fill=(255, 255, 255))
    draw.ellipse([hx + 2, hy - 6, hx + 4, hy - 4], fill=(255, 255, 255))

    # 7. Tronquito de madera caído
    tx, ty = cx - w // 3 + 10, cy + 6
    draw.polygon([(tx, ty), (tx + 22, ty - 6), (tx + 24, ty + 2), (tx + 2, ty + 8)], fill=(105, 65, 40))
    draw.ellipse([tx - 2, ty, tx + 4, ty + 8], fill=(135, 90, 55)) # Anillos


def draw_centerpiece(draw, cx, cy, wid: int, subject: str, emoji: str, name: str):
    """Dibuja el elemento 3D representativo del mundo sobre la isla de bosque."""
    # Intentar cargar fuente
    try:
        font_large = ImageFont.truetype(FONT_PATH, 58)
        font_num = ImageFont.truetype(FONT_PATH, 42)
    except Exception:
        font_large = ImageFont.load_default()
        font_num = ImageFont.load_default()

    # Si es zona de práctica
    if wid == 0:
        # Dianas y estrella dorada
        draw.ellipse([cx - 24, cy - 65, cx + 24, cy - 17], fill=(250, 204, 21), outline=(217, 119, 6), width=3)
        draw.ellipse([cx - 15, cy - 56, cx + 15, cy - 26], fill=(239, 68, 68))
        draw.ellipse([cx - 7, cy - 48, cx + 7, cy - 34], fill=(255, 255, 255))
        # Poste de madera
        draw.rectangle([cx - 4, cy - 17, cx + 4, cy + 6], fill=(115, 65, 35))
        return

    # Elemento según materia y temática
    if subject == "matematica":
        # Bloques de construcción / prismas / números dorados
        draw.rectangle([cx - 28, cy - 65, cx + 28, cy - 12], fill=(59, 130, 246), outline=(29, 78, 216), width=3)
        draw.polygon([(cx - 28, cy - 65), (cx - 10, cy - 80), (cx + 46, cy - 80), (cx + 28, cy - 65)], fill=(96, 165, 250), outline=(29, 78, 216), width=2)
        draw.polygon([(cx + 28, cy - 65), (cx + 46, cy - 80), (cx + 46, cy - 27), (cx + 28, cy - 12)], fill=(37, 99, 235), outline=(29, 78, 216), width=2)
        # Número o símbolo
        n_str = str(wid % 100)
        draw.text((cx - 16, cy - 62), n_str, fill=(255, 255, 255), font=font_num)

    elif subject == "lengua":
        # Libro mágico abierto o pergamino con pluma
        draw.polygon([(cx - 42, cy - 55), (cx, cy - 65), (cx + 42, cy - 55), (cx + 40, cy - 15), (cx, cy - 24), (cx - 40, cy - 15)], fill=(254, 243, 199), outline=(180, 83, 9), width=3)
        draw.line([(cx, cy - 65), (cx, cy - 24)], fill=(180, 83, 9), width=3)
        # Líneas de texto mágico
        draw.line([(cx - 32, cy - 44), (cx - 8, cy - 48)], fill=(217, 119, 6), width=2)
        draw.line([(cx - 32, cy - 34), (cx - 8, cy - 38)], fill=(217, 119, 6), width=2)
        draw.line([(cx + 8, cy - 48), (cx + 32, cy - 44)], fill=(217, 119, 6), width=2)
        draw.line([(cx + 8, cy - 38), (cx + 32, cy - 34)], fill=(217, 119, 6), width=2)
        # Cubierta de cuero
        draw.polygon([(cx - 44, cy - 13), (cx, cy - 22), (cx + 44, cy - 13), (cx + 42, cy - 8), (cx, cy - 17), (cx - 42, cy - 8)], fill=(146, 64, 14))

    elif subject == "sociales":
        # Casita patagónica o estela de piedra histórica
        draw.rectangle([cx - 26, cy - 48, cx + 26, cy - 8], fill=(245, 158, 11), outline=(180, 83, 9), width=3)
        draw.polygon([(cx - 34, cy - 48), (cx, cy - 76), (cx + 34, cy - 48)], fill=(220, 38, 38), outline=(153, 27, 27), width=3)
        draw.rectangle([cx - 8, cy - 26, cx + 8, cy - 8], fill=(115, 65, 35)) # Puerta
        draw.rectangle([cx + 10, cy - 40, cx + 20, cy - 30], fill=(254, 240, 138), outline=(180, 83, 9)) # Ventana

    elif subject == "naturales":
        # Árbol de lenga frondoso con fauna o calafate
        draw.rectangle([cx - 6, cy - 35, cx + 6, cy - 5], fill=(92, 51, 23)) # Tronco
        # Copa verde-dorada exuberante
        draw.ellipse([cx - 34, cy - 75, cx + 34, cy - 25], fill=(34, 197, 94), outline=(21, 128, 61), width=3)
        draw.ellipse([cx - 20, cy - 88, cx + 20, cy - 45], fill=(234, 179, 8), outline=(161, 98, 7), width=2)
        # Bayas moradas de calafate
        draw.ellipse([cx - 15, cy - 52, cx - 7, cy - 44], fill=(109, 40, 217))
        draw.ellipse([cx + 8, cy - 48, cx + 16, cy - 40], fill=(109, 40, 217))


def generate_island(wid: int, subject: str = "lengua", emoji: str = "🌲", name: str = ""):
    size = 340
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    cx, cy = size // 2, size // 2 + 35
    w, h = 260, 120

    # 1. Base del bosque
    draw_island_base(draw, cx, cy, w, h)

    # 2. Elemento central diorama
    draw_centerpiece(draw, cx, cy, wid, subject, emoji, name)

    fn = "practica.png" if wid == 0 else f"mundo-{wid}.png"
    out_file = os.path.join(ISLAND_DIR, fn)
    im.save(out_file, "PNG", optimize=True)


def main():
    print("Iniciando generación de mapas para 2.º grado...")
    for stage in (1, 2, 3, 4):
        generate_map_stage(stage)

    print("Iniciando generación de islas para 2.º grado...")
    # Isla de práctica
    generate_island(0, "lengua", "⭐", "Práctica")

    # Leer catálogo de 2.º grado
    import re
    w_path = os.path.join(ROOT, "src", "lib", "grade2", "worlds.ts")
    content = open(w_path, encoding="utf-8").read()
    
    # Parsear id, name, subject, emoji
    pattern = r'n:\s*(\d+),\s*name:\s*"([^"]+)",\s*emoji:\s*"([^"]+)"'
    # Buscar cada materia
    bases = {
        "lengua": (21000, "GRADE2_LENGUA"),
        "matematica": (22000, "GRADE2_MATEMATICA"),
        "sociales": (23000, "GRADE2_SOCIALES"),
        "naturales": (24000, "GRADE2_NATURALES"),
    }
    
    total = 1 # práctica
    for subj, (base, block_name) in bases.items():
        m_block = re.search(rf'export const {block_name}: WorldDef\[\] = build\("{subj}",\s*\[(.*?)\]\);', content, re.DOTALL)
        if m_block:
            block = m_block.group(1)
            for m in re.finditer(pattern, block):
                n = int(m.group(1))
                name = m.group(2)
                emoji = m.group(3)
                wid = base + n
                generate_island(wid, subj, emoji, name)
                total += 1

    print(f"¡Listo! Se generaron {total} islas en {ISLAND_DIR} y 4 mapas en {MAP_DIR}.")


if __name__ == "__main__":
    main()
