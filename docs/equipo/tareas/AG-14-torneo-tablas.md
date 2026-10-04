# AG-14 · Torneo de velocidad con las tablas (fin de semana)

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Hacela **después de la tanda piloto de AG-13** (mientras Claude revisa el piloto) y antes de AG-07.
Antes de empezar: `git merge main` y leé `docs/equipo/tareas/_COMUN-mejoras-panel.md` (reglas comunes).

## Pedido de Pedro

> En las actividades de fin de semana, torneos de velocidad con las tablas de multiplicar: hacer la
> tabla en orden, 2×0 = 0, 2×1 = 2… hasta 2×10 = 20. Siempre empieza en N×0 y termina en N×10. Arriba
> aparece la multiplicación y abajo 3 opciones para elegir, mientras corre el tiempo. El premio
> depende del tiempo total: si es bajo (por ejemplo, menos de 35 segundos) ganan un objeto. En las
> tablas del 3, 4, 5… el tiempo sube: 38, 41 segundos…

## Cómo funciona

- Nuevo juego en la **Aventura de fin de semana** (`/student/weekend`, sábados y domingos, hora argentina):
  tarjeta **«⚡ Torneo de las tablas»**. El alumno elige la tabla (del 2 al 10).
- Cuenta regresiva 3-2-1 y empieza el reloj (décimas de segundo, visible arriba).
- 11 pasos **en orden**: N×0, N×1, … N×10. Arriba la cuenta grande («4 × 7 = ?»); abajo **3 botones
  grandes** con opciones.
  - Opciones: la correcta y dos cercanas y distintas entre sí, nunca negativas: N×(k−1), N×(k+1) o la
    correcta ±1/±2 cuando k es 0 o 10. Orden al azar.
  - Si acierta: se marca en verde y pasa al siguiente sin esperar (≤ 250 ms).
  - Si se equivoca: el botón tiembla en rojo, **+3 segundos de penalidad** y tiene que elegir de nuevo
    (no avanza hasta acertar). Así todos terminan la tabla completa.
- Al terminar: tiempo final (con penalidades), errores, la tabla completa repasada (N×0 … N×10 = …)
  y la medalla.

## Tiempos y premios

Meta de cada tabla (oro): **35 s para la del 2 y +3 s por cada tabla más** (decisión de Claude, siguiendo
el ejemplo de Pedro: 11 respuestas a ~3,2 s cada una en la del 2; las tablas más altas piden pensar más).

| Tabla | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| 🥇 Oro (≤) | 35 s | 38 s | 41 s | 44 s | 47 s | 50 s | 53 s | 56 s | 59 s |
| 🥈 Plata (≤) | 50 s | 53 s | 56 s | 59 s | 62 s | 65 s | 68 s | 71 s | 74 s |
| 🥉 Bronce | terminó la tabla | | | | | | | | |

Fórmula en `src/lib/torneo/tiempos.ts`: `metaOro(n) = 35 + 3 × (n − 2)`, `metaPlata(n) = metaOro(n) + 15`
(constantes arriba del archivo para que Pedro las ajuste).

- **Monedas** (una vez por tabla y por día): oro 15 🪙, plata 8 🪙, bronce 3 🪙.
- **Objeto**: la **primera vez** que logra oro en una tabla de cada grupo gana su objeto (no se vende):
  - tablas 2 a 4 → «Vincha relámpago» ⚡ (cabeza, molde `cuernitos-dragon`)
  - tablas 5 a 7 → «Lentes turbo» 🕶️ (ojos, molde `lentes-aviador`)
  - tablas 8 a 10 → «Medalla del rayo» 🏅 (colgante, molde `sol-de-mayo`)
  Agregalos a `ACCESSORY_CATALOG_PREMIO` (`group: "premio"`, `fitLike` = molde) y sumá las 3 imágenes a la
  lista de AG-13 en `arte/coleccion/legendarios/` (`vincha-relampago`, `lentes-turbo`, `medalla-rayo`).
- **Torneo del curso**: ranking del fin de semana por tabla (mejor tiempo de cada alumno), los 5 primeros,
  **solo con el nombre visible/apodo** (nunca el nombre real, ver AG-07). Se reinicia cada sábado.

## Servidor (todo se valida ahí)

- `POST /api/torneo` `{ code, tabla, ms, errores }`: valida fin de semana (hora argentina), tabla 2–10,
  `ms` entre 5 000 y 600 000 y `errores` 0–50; calcula medalla con `tiempos.ts`, acredita monedas y
  objeto (una sola vez como dice arriba) y guarda el mejor tiempo del fin de semana.
- Campos nuevos opcionales en `StudentProgress` (cambio aditivo):
  `tablasTorneo?: Record<string /* "AAAA-MM-DD" del sábado */, Record<number /* tabla */, { mejorMs: number; medalla: "oro"|"plata"|"bronce"; monedasDia?: string[] }>>`.
- `GET /api/torneo?code=&tabla=`: ranking del curso de ese fin de semana (máximo 5, con nombre visible).
- Informe docente (Registro de `/admin` y `/docente/alumno`): tablas jugadas, mejor tiempo y errores
  (sirve para ver qué tabla le cuesta).

## Comprobar

- `scripts/test-torneo.ts`: opciones (3 distintas, una correcta, no negativas, para todas las tablas y k),
  metas por tabla, medallas en los bordes (35,0 s oro; 35,1 s plata en la del 2), penalidad, monedas una
  vez por día, objeto una sola vez por grupo, rechazo fuera del fin de semana.
- Probarlo en el celular (390 px de ancho): botones grandes, nada se corre al tocar rápido.
- `test-simulation.ts`, `npx tsc --noEmit`, `npx eslint src`, `npm run build`.

## Qué NO tocar

`src/lib/coleccion/**`, `src/lib/tiempo-limitado.ts`, `src/lib/vuelta.ts`, `ShopModal.tsx`,
`AvatarDisplay.tsx`, `public/theme/**`. En `types/index.ts`, `data.ts` y la página del fin de semana,
solo cambios **aditivos** (anotalos en el resumen).
