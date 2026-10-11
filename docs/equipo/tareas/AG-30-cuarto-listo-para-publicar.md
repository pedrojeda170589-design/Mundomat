# AG-30 · 4.º grado listo para publicar: últimos detalles y revisión final

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue. 4.º sigue con `publicado: false` (lo publica Pedro cuando lo decida).

**Antes de empezar:** `git checkout antigravity && git merge -X theirs main`. Si algo choca, gana main.

## Revisión de AG-29 (unida a main como borrador oculto)
**Muy bien.**
- Lengua se revisó de verdad: 247 líneas cambiadas en los 28 mundos.
- Los 28 ejemplos «después» del informe están en el código, tal cual.
- Ya no hay correctas alargadas con relleno; Claude solo volvió «con la letra J» a «con J».
- Los arreglos de Naturales (bivalvo, microceldas, camiones, guanaco) están bien.
- Un detalle del informe: los «antes» eran de tu rama vieja (AG-28 con relleno), no de main. La próxima vez copialos de main.

## 1. Lengua: los distractores de chiste que quedan
Cambialos por errores que un chico de 4.º podría cometer de verdad:
- línea ~267: «Seres mitológicos con poderes mágicos y varitas»;
- ~369: «Metáfora de una idea luminosa» (en la pregunta de la cartela de la historieta);
- ~370 y ~391: «De derecha a izquierda y de abajo hacia arriba (al revés)»;
- ~443: «carece de dibujos coloridos en las esquinas del libro» y «obliga a leer de derecha a izquierda»;
- ~830: «memorizar la lista de autores» y «cambiar la cantidad de párrafos».

Buscá el mismo patrón en el resto de Lengua y en Matemática.

## 2. Matemática de 4.º: revisión a mano
Matemática de 4.º no pasó todavía por una revisión a mano como Sociales, Naturales y Lengua. Mundo por mundo:
- **Cuentas:** que cada cuenta y cada respuesta estén bien. Rehacé la cuenta vos, no la copies.
- **Una sola correcta:** que no haya dos opciones que den el mismo número o que sean equivalentes (por ejemplo «1/2» y «2/4» en la misma pregunta).
- **Distractores:** errores típicos (llevarse mal, confundir × con +, correr la coma), no números al azar.
- **Pistas:** que guíen («pensá en cuántos grupos de 10 hay») sin dar el resultado.
- **Problemas:** con datos de la Patagonia y números creíbles (precios, distancias, temperaturas).

## 3. Repaso final de las cuatro materias
Corré el juego en `npm run dev` con un alumno de 4.º y jugá **una vuelta de cada mundo** de las cuatro materias. Anotá en TAREAS.md, en una tabla, cualquier cosa rara:
- imagen que no carga;
- consigna cortada;
- respuesta que no se puede elegir;
- pista que no corresponde.

## Pruebas
- Agregá a `test-grado4.ts` una lista de frases de chiste que no pueden aparecer en ninguna materia, con las de arriba.
- `npx tsc --noEmit`, `npx eslint src` y los tests de siempre en verde.

## Entrega
En TAREAS.md:
- Lengua: cada distractor viejo → nuevo, copiados de main y del código nuevo.
- Matemática: por mundo, cuántas preguntas cambiaste y un ejemplo antes → después, copiados del código.
- La tabla del repaso final.

Marcá AG-30 «✅ LISTA PARA REVISAR».
