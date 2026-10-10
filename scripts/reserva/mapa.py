"""Genera src/lib/reserva/mapaDatos.ts (el mapa de la Reserva patagónica).

Fuentes (descargarlas aparte, no van al repo):
- Natural Earth 10m admin 0 y admin 1 (dominio público): países y provincias.
- IGN, SIG 250 (CC BY 4.0), departamentos de Santa Cruz, en la versión GeoJSON
  de github.com/mgaitan/departamentos_argentina (departamentos-santa_cruz.json).

Uso: python3 scripts/reserva/mapa.py <adm0.geojson> <adm1.geojson> <santa_cruz.json> <salida.ts>
"""
import json, math, sys
from shapely.geometry import shape, box, Polygon, MultiPolygon
from shapely.ops import unary_union

adm0_p, adm1_p, sc_p, out_p = sys.argv[1:5]
LAT0 = -40.0
K = 30.0  # unidades por grado de latitud
COSL = math.cos(math.radians(LAT0))
LON_MIN, LON_MAX, LAT_MIN, LAT_MAX = -75.5, -52.5, -56.0, -21.0

def px(lon, lat):
    return ((lon - LON_MIN) * COSL * K, (LAT_MAX - lat) * K)

W, H = px(LON_MAX, LAT_MIN)

def ruta(geom, nd=1):
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, "geoms", []))
    out = []
    for p in polys:
        if p.is_empty or not isinstance(p, Polygon):
            continue
        for ring in [p.exterior, *p.interiors]:
            pts = [px(x, y) for x, y in ring.coords]
            if len(pts) < 4:
                continue
            s = "M" + "L".join(f"{x:.{nd}f} {y:.{nd}f}" for x, y in pts[:-1]) + "Z"
            out.append(s)
    return "".join(out)

def caja(geom, margen=0.6):
    a, b, c, d = geom.bounds  # lon_min, lat_min, lon_max, lat_max
    x1, y1 = px(a - margen, d + margen)
    x2, y2 = px(c + margen, b - margen)
    return [round(x1, 1), round(y1, 1), round(x2 - x1, 1), round(y2 - y1, 1)]

def centro(geom):
    p = geom.representative_point()
    x, y = px(p.x, p.y)
    return [round(x, 1), round(y, 1)]

marco = box(LON_MIN, LAT_MIN, LON_MAX, LAT_MAX)
a0 = {f["properties"]["ADM0_A3"]: shape(f["geometry"]) for f in json.load(open(adm0_p))["features"]}
a1 = [f for f in json.load(open(adm1_p))["features"] if f["properties"]["adm0_a3"] == "ARG"]

vecinos = []
for k in ["CHL", "BOL", "PRY", "BRA", "URY"]:
    g = a0[k].intersection(marco).simplify(0.04, preserve_topology=True)
    if not g.is_empty:
        vecinos.append({"id": k, "d": ruta(g)})

PATAGONIA = {"AR-Q": "neuquen", "AR-R": "rio-negro", "AR-U": "chubut", "AR-Z": "santa-cruz", "AR-V": "tierra-del-fuego"}
malvinas = a0["FLK"]
provincias = []
for f in a1:
    p = f["properties"]
    iso = p["iso_3166_2"]
    g = shape(f["geometry"])
    if iso == "AR-C":
        continue  # CABA: demasiado chica para este mapa
    if iso == "AR-V":
        g = unary_union([g, malvinas])  # Islas Malvinas: Tierra del Fuego, Antártida e Islas del Atlántico Sur
    g = g.intersection(marco).simplify(0.025, preserve_topology=True)
    provincias.append({
        "id": PATAGONIA.get(iso, iso.lower()),
        "nombre": "Tierra del Fuego, Antártida e Islas del Atlántico Sur" if iso == "AR-V" else (p.get("name_es") or p["name"]),
        "patagonia": iso in PATAGONIA,
        "d": ruta(g),
        "caja": caja(g),
        "centro": centro(shape(f["geometry"]).simplify(0.05) if iso != "AR-V" else shape(f["geometry"])),
    })

NOMBRES = {
    "RIO CHICO": ("rio-chico", "Río Chico"),
    "LAGO BUENOS AIRES": ("lago-buenos-aires", "Lago Buenos Aires"),
    "DESEADO": ("deseado", "Deseado"),
    "MAGALLANES": ("magallanes", "Magallanes"),
    "CORPEN AIKE": ("corpen-aike", "Corpen Aike"),
    "LAGO ARGENTINO": ("lago-argentino", "Lago Argentino"),
    "GÜER AIKE": ("guer-aike", "Güer Aike"),
}
departamentos = []
for f in json.load(open(sc_p))["features"]:
    nom = f["properties"]["departamento"]
    ident, bonito = NOMBRES[nom]
    g = shape(f["geometry"]).buffer(0).simplify(0.008, preserve_topology=True)
    departamentos.append({"id": ident, "nombre": bonito, "d": ruta(g), "caja": caja(g, 0.25), "centro": centro(g)})

santa = unary_union([shape(f["geometry"]).buffer(0) for f in json.load(open(sc_p))["features"]]).buffer(0.002).simplify(0.008, preserve_topology=True)
LOC = {
    "gobernador-gregores": ("Gobernador Gregores", -70.25, -48.75),
    "perito-moreno": ("Perito Moreno", -70.93, -46.59),
    "los-antiguos": ("Los Antiguos", -71.62, -46.55),
    "puerto-deseado": ("Puerto Deseado", -65.90, -47.75),
    "caleta-olivia": ("Caleta Olivia", -67.52, -46.44),
    "pico-truncado": ("Pico Truncado", -67.96, -46.80),
    "las-heras": ("Las Heras", -68.93, -46.54),
    "puerto-san-julian": ("Puerto San Julián", -67.72, -49.31),
    "piedra-buena": ("Comandante Luis Piedra Buena", -68.91, -49.98),
    "puerto-santa-cruz": ("Puerto Santa Cruz", -68.52, -50.02),
    "el-calafate": ("El Calafate", -72.27, -50.34),
    "el-chalten": ("El Chaltén", -72.89, -49.33),
    "rio-gallegos": ("Río Gallegos", -69.22, -51.62),
    "rio-turbio": ("Río Turbio", -72.30, -51.53),
    "28-de-noviembre": ("28 de Noviembre", -72.21, -51.58),
    "ushuaia": ("Ushuaia", -68.30, -54.80),
    "rawson": ("Rawson", -65.10, -43.30),
    "viedma": ("Viedma", -63.00, -40.81),
    "neuquen": ("Neuquén", -68.06, -38.95),
    "bariloche": ("San Carlos de Bariloche", -71.31, -41.13),
    "puerto-madryn": ("Puerto Madryn", -65.04, -42.77),
}
localidades = [{"id": k, "nombre": n, "x": round(px(lo, la)[0], 1), "y": round(px(lo, la)[1], 1)} for k, (n, lo, la) in LOC.items()]

# Recuadro de la Antártida Argentina (sector entre los 25° O y 74° O, al sur de
# los 60° S) y las islas del Atlántico Sur, en proyección polar sencilla.
def polar(lon, lat):
    r = (90 + lat)  # grados desde el polo
    a = math.radians(lon + 49.5)  # centra el sector
    return (r * math.sin(a), -r * math.cos(a))
sector = Polygon([(-74, -60), *[(-74 + i * 49 / 20, -60) for i in range(21)], (-25, -90), (-74, -90)])
ata = a0["ATA"].intersection(box(-74, -90, -25, -60)).simplify(0.15, preserve_topology=True)
islas = unary_union([a0["SGS"], a0["FLK"]]).simplify(0.05, preserve_topology=True)
def ruta_polar(geom):
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, "geoms", []))
    out = []
    for p in polys:
        if p.is_empty or not isinstance(p, Polygon):
            continue
        pts = [polar(x, y) for x, y in p.exterior.coords]
        out.append("M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in pts[:-1]) + "Z")
    return "".join(out)
cuña = "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in [polar(-74, -90)] + [polar(-74 + i * 49 / 20, -60) for i in range(21)]) + "Z"
pts = [polar(x, y) for g in [ata, islas] for p in (g.geoms if hasattr(g, "geoms") else [g]) for x, y in p.exterior.coords]
pts += [polar(-74 + i * 49 / 20, -60) for i in range(21)] + [polar(0, -90)]
xs, ys = [p[0] for p in pts], [p[1] for p in pts]
antartida = {
    "d": ruta_polar(ata),
    "islas": ruta_polar(islas),
    "sector": cuña,
    "caja": [round(min(xs) - 1, 2), round(min(ys) - 1, 2), round(max(xs) - min(xs) + 2, 2), round(max(ys) - min(ys) + 2, 2)],
}

datos = {
    "ancho": round(W, 1), "alto": round(H, 1),
    "vecinos": vecinos, "provincias": provincias, "departamentos": departamentos,
    "santaCruz": {"d": ruta(santa), "caja": caja(santa, 0.4)},
    "localidades": localidades, "antartida": antartida,
}
with open(out_p, "w", encoding="utf-8") as fh:
    fh.write("// Archivo generado por scripts/reserva/mapa.py. No editar a mano.\n")
    fh.write("// Fuentes: Natural Earth (dominio público) e IGN, SIG 250 (CC BY 4.0).\n")
    fh.write("export const MAPA = " + json.dumps(datos, ensure_ascii=False) + " as const;\n")
print("ok", round(W), round(H), len(provincias), len(departamentos), round(len(json.dumps(datos)) / 1024), "KB")
