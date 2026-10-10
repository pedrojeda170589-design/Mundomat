# AG-26 · Cierre del avatar (AG-20/25) y Ciencias Sociales de 4.º reescrita a mano

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue.

**Antes de empezar:** `git checkout antigravity && git pull origin main && git merge main`. Si `docs/equipo/TAREAS.md` choca, en las filas AG-20, AG-24, AG-25 y AG-26 quedate con la versión de main.

Claude revisó AG-25 (commit 085e93a) y **no la unió a main**.
- **Parte A (avatar):** quedó casi lista. Faltan los arreglos de abajo y se une.
- **Parte B (4.º):** los tests dan verde, pero en buena parte porque **el texto se cambió para pasar los controles, no para mejorar las actividades**. Por eso cambia la forma de trabajar (ver «Regla nueva»).

## Regla nueva (vale para siempre, está en el README)
- **Prohibido modificar textos para que un test pase sin mejorar la actividad.** Eso incluye:
  - agregar frases o códigos para que cada opción sea «única»;
  - borrar palabras de una pista y dejarla cortada;
  - pegar frases de otro tema en las opciones incorrectas;
  - inflar los distractores para emparejar largos.
- **Prohibido bajar las exigencias de un test**, o hacer que dependa de cómo se corre (por ejemplo, de un contador en memoria).
- Si un control no se puede cumplir escribiendo bien, **avisá en TAREAS.md**. No lo esquives.

---

## Parte A · Avatar: lo que falta para unirlo

### A2 (obligatorio): guardar desde una versión vieja sigue borrando capas
Las versiones viejas de `ProfileEditor` mandan **los 8 lugares** en cada guardado. El bucle de `src/lib/data.ts` ~496-500 reemplaza el primer objeto de cada lugar y **borra los demás objetos de ese lugar**.

Claude lo reprodujo así:
1. Capas iniciales `[gorra-67, vincha-67 (x:3), squishy-6, squishy-7 (s:1.3)]`.
2. Se manda el pedido viejo: `headwear: "gorra-67"`, `pet: "squishy-6"` y el resto `null`.
3. Resultado: `[gorra-67, squishy-6]`. Se perdieron la vincha y la segunda mascota.

Qué hacer:
- Si el id que llega **ya está** en las capas, ese lugar no se toca.
- Solo se reemplaza o se saca cuando el id es **distinto**.
- `null` saca **un** objeto de ese lugar solo si el alumno tenía uno solo ahí. Si tenía varios, no se saca ninguno.
- Los tweaks del formato viejo (~583-593) **no** se aplican si el alumno ya tiene capas: hoy pisan los ajustes de cada capa.
- Test: el pedido completo de 8 lugares, con el caso de arriba, deja las 4 capas intactas.

### A6: «Adelante» y «Atrás» cuentan mascotas y objetos de mano
`canMoveAdelante`/`canMoveAtras` (`ProfileEditor.tsx` ~285) cuentan también las mascotas y el objeto de mano. Con `[gorra, squishy, lentes]`, tocar «Adelante» en la gorra la cambia de lugar con el squishy y no se ve ningún cambio.

Calculá los vecinos y los cambios **solo entre las capas del personaje**.

### Vista previa de la tienda
La vista previa (`ShopModal.tsx` ~68-79) agrega el objeto al final de la lista, pero `AvatarDisplay` dibuja solo el primer objeto de mano y las 3 primeras mascotas:
- Si ya tiene un objeto de mano, el que se está mirando **no aparece**. En la vista previa, sacá el que tiene.
- Con 3 mascotas, la cuarta tampoco aparece. Sacá la más vieja.

### Otros
- Los errores del catálogo, como «Ya tenés 5 accesorios», tienen que verse también **arriba, donde se toca**, no solo abajo junto a Guardar.
- La regla de la gorra del aniversario va a una función pura en `avatarCapas.ts`. Usala desde `progress/route.ts`, y que el test llame a **esa** función: hoy el test copia la regla.
- `data.ts` ~596: `Object.assign(next, { ok: true })` mete `ok` dentro del progreso. Devolvé `{ ok: true, progress: next }`.
- La captura de `docs/equipo/capturas/` tiene que mostrar dos objetos **superpuestos** que cambian de orden. Hoy los paneles 1 y 2 son idénticos, y en el 3 no se ve el `globos-67`.
- Anotá en TAREAS que `/docente/alumno` (~227) todavía lee `avatar_accessories`, que viene de la plataforma. Queda para otra tarea.

---

## Parte B · Solo Ciencias Sociales de 4.º, reescrita a mano

**En esta tarea no toques Lengua, Naturales ni Matemática.** Lo único que se conserva de B es lo que ya quedó bien:
- 42017 (8 tipos de pregunta);
- el `getSig` sin el orden de las tarjetas;
- los paréntesis parejos;
- las correcciones de B9.

Trabajá **mundo por mundo** (s1 a s27). En cada mundo:

1. **Sacá todo texto agregado para los controles:**
   - las 32 colas «según relevamiento específico del sector 2_2_2…»; los chicos las verían y la voz las leería;
   - las frases sueltas pegadas a los distractores;
   - los distractores inflados.
2. **Cada pregunta tiene una sola respuesta correcta y 2 distractores reales**, cortos y del mismo tipo:
   - si la respuesta es un lugar, otros lugares de Santa Cruz o de la Patagonia;
   - si es una fecha, fechas cercanas;
   - si es una autoridad, otras autoridades.

   Nada de camellos, elefantes, aeropuertos, globos aerostáticos, centauros ni sirenas (`sociales.ts` ~279, 407, 727, 739).
3. **Cada pista se escribe para su pregunta**, completa y en buen castellano. Orienta sin decir la respuesta. Nada de pistas cortadas ni de otro tema: por ejemplo, la pista de la trutruka (~459) describe el kultrún, que es uno de los distractores.
4. **Verdadero/falso:** las falsas son errores **creíbles**, como una fecha o un lugar cercano, o una causa confundida. Nada de «camellos importados», «carbón cae del cielo», «carabelas submarinas». Tienen que ser 4 pares por mundo **distintos de verdad**, no la misma idea dicha de otra forma.
5. **Sin duplicados:** la pregunta de la Isla Pingüino aparece 4 veces (~114, 210, 338, 351). Cada pregunta del banco tiene que ser distinta, no una paráfrasis de otra.
6. **Bug del verdadero/falso:** `getTfActivity` (~1417) avanza la rotación y además se llama dentro de `getExtra*`. El contador avanza dos veces por vuelta y **solo salen los pares 0 y 2**. Arreglalo en las tres materias: es un arreglo de código, no de texto.
7. **s7-ex-1:** el orden es arbitrario y la pista lo dice. Reemplazala por otra actividad.
8. **Vocabulario de 4.º:** nada de «personería» (aparece 7 veces), «litosférica», «geoide» ni palabras parecidas.
9. **Preámbulo** (~803): no es un «texto poético».

### Variedad, medida en serio
La rotación en memoria (`fromBank` y los contadores) **se borra al recargar la página o al cambiar de dispositivo**, así que no sirve para medir. El test tiene que medir la repetición **con estado nuevo en cada vuelta**, limpiando los contadores entre vuelta y vuelta. Con eso, que repita algo entre dos vueltas seguidas en **menos del 50 %** de los casos.

Si el banco no alcanza, escribí más preguntas **buenas**; no paráfrasis.

### Controles nuevos en `scripts/test-grado4.ts` (solo Sociales)
- Ningún texto con dígitos y guiones bajos (`/\d+_\d+/`) ni con «relevamiento».
- **Largo:** la correcta es la más larga en ≤ 34 % de las preguntas **y** la más corta en ≤ 34 %.
- Ninguna pista termina en palabra cortada, ni tiene «de, o.», «los sino» o dos espacios.
- Cada uno de los 4 pares de verdadero/falso de cada mundo sale al menos una vez en 40 vueltas.
- Repetición entre vueltas medida con estado nuevo (ver arriba).

## Entrega
`npx tsc --noEmit`, `npx eslint src`, `test-avatar-capas`, `test-grado4`, `test-torneo` y los de siempre en verde.

En TAREAS.md:
- Parte A, punto por punto.
- Parte B: la lista de los 27 mundos con «revisado» y, en cada uno, **un ejemplo de pregunta antes → después**.
- AG-26 marcada «✅ LISTA PARA REVISAR».

Después de esta, Claude unirá el avatar a main. Naturales y Lengua van en tareas siguientes, con el mismo método.
