# Repertorio de imágenes de MundoTest26

Todas las imágenes las hace **Claude** en el ChatGPT de Pedro (estilo 3D tierno, fondo blanco para objetos y avatares). Las imágenes son de uso libre para la app: no copian personajes, marcas ni obras conocidas. **Antigravity no genera imágenes**: programa con las rutas de este archivo y, si falta alguna, la anota en su resumen para que Claude la haga.

Créditos y fechas: `docs/CREDITOS-IMAGENES.md`. Las láminas originales (3×3) quedan en la computadora de Pedro, en `Descargas/cuentos_mm/laminas/` y `Descargas/cuentos_mm/monte-leon/`.

## Cómo se procesan
- Lámina 3×3 → `scripts/coleccion/cortar_lamina.py` corta 9 imágenes → `scripts/coleccion/procesar_arte.py <ids>` quita el fondo, ajusta al molde y guarda en `public/theme/...` (avatares con `MM_RELLENO=1`).
- Después: `npx tsx scripts/coleccion/listar-imagenes.ts` regenera `src/lib/coleccion/imagenes-listas.ts` (**un objeto sin imagen no aparece** en la tienda ni en el perfil).
- Estado al día de las colecciones: `npx tsx scripts/coleccion/lista-para-dibujar.ts`.

## 1. El profe Pedro (`public/theme/profe/*.png`)
Hechas a partir de la foto de Pedro, con su autorización. Componente `src/components/Profe.tsx`.
- **Poses:** saluda, trofeo, aplaude, animo, lee, lupa, mate, explica, reloj, festejo, retrato.
- **Vestimentas por mundo:** andinista, guardaparque, cientifico, astronomo, explorador, gaucho, escritor, matematico, almacenero.

## 2. Paisajes de Santa Cruz para el mapa por módulos (`public/theme/santa-cruz/*.jpg`, 1024×1536)
cerro-ventana, chalten, glaciar, cueva-manos, bosque-petrificado, puerto-deseado (ver `src/lib/mapa/modulos.ts`).

## 3. Tabla pitagórica (`public/descargas/tabla-pitagorica.pdf` y `.png`)
Generadas por `scripts/descargas/tabla-pitagorica.mjs` con el modelo de Pedro.

## 4. Colecciones (avatares y objetos)
- Avatares: `public/theme/avatars/<id>.png` (440×440). Objetos de tienda: `public/theme/accessories-tienda/<id>.png`. Premios y legendarios: `public/theme/accessories-temporada/<id>.png`.
- Láminas 0 a 21: temporadas, logros de cuentos y leyendas, camino de premios (ids en `/tmp/sheets.json` de la sesión de Claude; la lista oficial sale de `src/lib/coleccion/temporadas.ts`, `logros.ts`, `racha.ts`).
- **Six-Seven** (drop del 25/11): anteojos-67, vincha-67, gorra-67, monio-67, medalla-67, squishy-6, squishy-7, globos-67, cadena-67.

## 5. Repaso de las tablas (premios por vueltas, `accessories-temporada/<base>-<metal>.png`)
Cada objeto en **oro, plata y bronce** (`src/lib/torneo/vueltas.ts`):

| Mes | Objeto (nivel ×) | Superespecial (desde A1) |
|---|---|---|
| Julio | cronometro-tablas | trofeo-tablas |
| Agosto | gorra-tablas | corona-tablas |
| Septiembre | banderin-tablas | estrella-fugaz |
| Octubre | vincha-relampago | antifaz-estelar |
| Noviembre | lentes-turbo | collar-estrella |
| Diciembre | medalla-rayo | cetro-numeros |

Además, los premios anteriores (vincha-relampago, lentes-turbo, medalla-rayo, sin metal) quedan para quien ya los tenía.

## 6. Viaje a Monte León (AG-19). Ids en `src/lib/monteLeon/arte.ts`
| Qué | Ruta | Uso |
|---|---|---|
| Isla del mapa | `public/theme/monte-leon/isla.png` | tarjeta del mundo especial |
| Mochila vacía | `public/theme/monte-leon/mochila.png` | pantalla «Mi mochila» |
| Botella de agua | `accessories-temporada/botella-agua-ml.png` | objeto de mano |
| Anteojos de sol | `accessories-temporada/anteojos-sol-ml.png` | puesto (lentes) |
| Gorra para el sol | `accessories-temporada/gorra-ml.png` | puesto (cabeza) |
| Protector solar | `accessories-temporada/protector-solar-ml.png` | objeto de mano |
| Bocadillos | `accessories-temporada/bocadillos-ml.png` | objeto de mano |
| Golosina | `accessories-temporada/golosina-ml.png` | objeto de mano |
| Pingüino de peluche | `accessories-temporada/pinguino-peluche-ml.png` | mascota (mochila completa) |
| Medalla del viaje | `accessories-temporada/medalla-monte-leon.png` | colgante (27/10) |
| Avatar explorador | `avatars/explorador-monte-leon.png` | superespecial |
| Avatar guardaparque | `avatars/guardaparque-monte-leon.png` | superespecial |
| Avatar pingüino | `avatars/pinguino-monte-leon.png` | superespecial |
| Escena: el viaje | `monte-leon/escenas/viaje-ruta.jpg` | etapa 1 |
| Escena: Cabeza del León | `monte-leon/escenas/cabeza-del-leon.jpg` | etapa 2 |
| Escena: pingüinera | `monte-leon/escenas/pinguinera.jpg` | etapa 3 |
| Escena: lobería | `monte-leon/escenas/loberia.jpg` | etapa 3 |
| Escena: estepa | `monte-leon/escenas/estepa.jpg` | etapa 3 |
| Escena: guardaparque | `monte-leon/escenas/guardaparque.jpg` | etapa 4 |

Las escenas son 1536×1024 (3:2), en JPG.

## 6 bis. Islas de 4.º grado (`public/theme/grados/4/islas/mundo-<id>.png`)
Las 108 islas de 4.º (8/10/2026), estilo «glaciares»: isla flotante con hielo celeste, carámbanos, lengas y un hilo de agua turquesa, y el tema de cada mundo arriba. Ambiente `THEMES.glaciar` (`src/lib/grades.ts`). Se hicieron en 12 láminas sobre fondo magenta y se procesaron con `scripts/coleccion/islas_lamina.py <lámina> 4 <id1> … <id9>`; las láminas quedan en `Descargas/cuentos_mm/islas4/`. El fondo del mapa de 4.º usa los paisajes de Santa Cruz de cada módulo.

## 7. Cuentos
- `public/theme/grados/1/cuentos/tortuga-gigante-2.jpg`: corregida (la tortuga tenía tres ojos).

## 8. Anteojos y antifaces (regla del 5/10/2026)
Todo lo que se pone en la cara se dibuja **de frente, sin patillas y sin vidrio** (nada que «se vea a través» y que debería tapar la cabeza), sobre fondo verde, y se procesa con `scripts/coleccion/anteojos_verde.py <lámina> <id1> … <id9>`. Las versiones anteriores quedan en `arte/coleccion/anteojos-viejos/`.

## Estado (8/10/2026)
- Islas de 4.º: 108 de 108.
- Pendiente: «Mi escuela» (AG-22/CL-22), cuando lleguen las fotos de Pedro.

## Estado (6/10/2026)
- **Colecciones: 260 de 260 ítems con imagen** (láminas 0 a 21 completas).
- Monte León completo; los 36 premios del repaso de las tablas; 25 anteojos y antifaces rehechos de frente, sin patillas y sin vidrio.
- Si Antigravity agrega un ítem nuevo al catálogo, aparece en `npx tsx scripts/coleccion/lista-para-dibujar.ts` y lo dibuja Claude.
