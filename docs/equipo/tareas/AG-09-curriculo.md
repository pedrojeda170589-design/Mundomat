# AG-09 · Vínculo con el diseño curricular (PRIORIDAD 3)

Leé primero `_COMUN-mejoras-panel.md`.

- Cada mundo (3.º en `src/lib/worlds.ts`, 1.º y 2.º en `src/lib/grade*/worlds.ts`, y los
  mundos de comprensión) tiene que tener: **área, eje y contenido/objetivo** del diseño
  curricular que trabaja. 1.º y 2.º ya tienen `objective` y `contents`; 3.º no.
- **Datos fuera del código de los mundos**, para poder cambiar de provincia sin tocar código:
  `src/lib/curriculo/santa-cruz.json` (y un `nap.json` si se puede), con la forma
  `{ "<worldId>": { "area": "...", "eje": "...", "contenido": "...", "fuente": "DC Santa Cruz 1.er ciclo, p. X", "validado": false } }`
  y un selector `curriculoActivo` (por defecto `santa-cruz`, después vendrá por escuela).
- Fuente: los PDF y textos de `docs/curriculo/` (columna del grado que corresponda). Citá la
  página o sección.
- **Todos los campos nuevos con `"validado": false`**. En el panel se muestran con la etiqueta
  «⚠️ pendiente de validar» hasta que un docente los marque como revisados (botón «Revisé este
  dato» en `/admin`, que guarda la validación en el store, no en el JSON).
- Mostrarlo en el Panel Docente junto al nombre del mundo («La Aldea de los Números ·
  Matemática · Numeración») en Habilitar Mundos, Registro y el Resumen del curso.
- Test: todos los mundos de los 3 grados tienen entrada; ninguna está vacía.

## Pendiente para Pedro
Que revise una muestra y marque como validados los que estén bien.
