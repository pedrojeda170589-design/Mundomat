# AG-22 · «Mi escuela»: colorear y remodelar la escuela con lápices de colores

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** después de AG-21, AG-23 y AG-20. **No empieces** hasta que Claude marque en `TAREAS.md` que las imágenes están listas (fila CL de imágenes de la escuela); mientras tanto podés armar la lógica y las pruebas con imágenes provisorias.

## El pedido de Pedro
«Una visión tipo 3D de la escuela, en blanco y negro, y que los alumnos le vayan agregando las cosas con las que cuenta (espacios y áreas) y también cosas que les gustaría que tenga: un jardín, juegos, cambiar el color de la escuela. Los objetos y remodelaciones se habilitan a medida que interactúan con la app (como esos juegos de remodelar tipo Candy Crush). Al terminar un mundo el alumno gana **lápices**, que se usan para las remodelaciones. Los lápices ganados en una etapa/eje tienen que ser el **120 %** de los necesarios para remodelar toda la parte habilitada. Y que el avatar pueda **caminar** por la escuela.»

Decisiones de Pedro: **una escuela por alumno** (se puede mirar la de un compañero, no tocarla); **solo decorar** (sin preguntas de contenido); la escuela real se dibuja a partir de **fotos** que manda Pedro.

## 1. Idea general
- Pantalla nueva **«Mi escuela»** (`/student/escuela`) con botón en el mapa y en «Mi perfil».
- La escuela es una **ilustración isométrica** (vista «3D» desde arriba en diagonal). Arranca **en blanco y negro, como un dibujo para colorear**.
- La escuela está dividida en **zonas** (frente, aula, patio, comedor…). Cada zona se **habilita** cuando el alumno empieza el **módulo** de contenidos que le corresponde (`src/lib/mapa/modulos.ts`), y se **colorea y equipa** gastando lápices.
- Cada zona tiene **mejoras**: colorear la zona (pasa de blanco y negro a color), objetos **reales** (lo que la escuela tiene de verdad: mástil, bancos, pizarrón…) y objetos **soñados** (lo que les gustaría: tobogán, jardín, pileta, mural…). El alumno compra las mejoras en el orden que quiera dentro de la zona.
- El avatar del alumno (`AvatarDisplay`) aparece en la escuela y **camina** a donde toca el alumno.

## 2. Lápices de colores (la moneda de la escuela)
**No los confundas** con el «lápiz dorado» del dictado ni con las monedas de la tienda: son otra cosa. Nombre en pantalla: «lápices de colores» (✏️).

- **Se ganan al completar un mundo** que pertenezca a un módulo de `MODULOS` (3.º: 53 mundos en 14 módulos). Cada mundo da **12 lápices**.
- **Cada zona cuesta en total 10 × (cantidad de mundos de su módulo)**. Así, completar el módulo da exactamente el **120 %** de lo que cuesta la zona entera (12 / 10 = 1,2), como pidió Pedro. Ejemplo: «Números y cálculo» tiene 4 mundos → 48 lápices; su zona cuesta 40.
- **Los lápices no se guardan: se calculan.** `lapicesGanados(progress, grade)` = 12 × mundos completados que están en algún módulo del grado. `lapicesGastados` = suma del precio de las mejoras compradas. `saldo = ganados − gastados`. Ventajas: los alumnos que ya completaron mundos tienen sus lápices desde el primer día, y no hay forma de ganarlos dos veces.
- Los lápices que sobran de una zona (el 20 % extra) **sirven para cualquier zona habilitada**.
- Las funciones van en `src/lib/escuela/lapices.ts` (puras, con `now`/datos inyectables para las pruebas).

## 3. Zonas y mejoras (`src/lib/escuela/zonas.ts`)
Una zona por módulo. **Los nombres y los objetos reales finales los define Claude con las fotos de Pedro**; hasta entonces usá esta propuesta (3.º grado):

| Materia | Módulo (mundos) | Zona | Costo total |
|---|---|---|---|
| Matemática | Números y cálculo (4) | Frente y entrada (mástil, cartel, portón) | 40 |
| Matemática | Tablas y repartos (4) | Aula de 3.º | 40 |
| Matemática | Figuras y medidas (2) | Galería | 20 |
| Matemática | Problemas y números grandes (4) | Playón y cancha | 40 |
| Lengua | Hablar, leer y escribir (4) | Biblioteca | 40 |
| Lengua | Palabras y leyendas (4) | Pasillo y carteleras (mural) | 40 |
| Lengua | Escribir y opinar (5) | Salón de usos múltiples / actos | 50 |
| Lengua | Lectores autónomos (5) | Sala de computación | 50 |
| Sociales | Paisajes y autoridades (3) | Dirección y entrada de familias | 30 |
| Sociales | Trabajo y patrimonio (3) | Comedor y cocina | 30 |
| Sociales | Transportes e historia (3) | Dormitorios (escuela hogar) | 30 |
| Naturales | Seres vivos y materiales (4) | Huerta e invernadero | 40 |
| Naturales | Naturaleza, sonido y cielo (4) | Jardín y árboles | 40 |
| Naturales | Investigadores (4) | Plaza de juegos | 40 |

- **Cuándo se habilita una zona:** cuando el alumno tiene **desbloqueado** el primer mundo de su módulo (la misma regla de avance del mapa; no hace falta completarlo). Zonas no habilitadas: grises con candado y el cartel «Se habilita con el módulo "Tablas y repartos" de Matemática».
- **Mejoras de cada zona** (`MejoraEscuela`): `{ id, zona, tipo: "color" | "real" | "sueno", label, precio, imagen?, lugar? }`.
  - Una mejora `color` por zona (colorea esa parte del edificio o del terreno).
  - De 3 a 6 objetos `real` y de 2 a 4 `sueno` por zona.
  - **La suma de los precios de las mejoras de una zona = su costo total** (la prueba lo verifica). Precios entre 3 y 12.
- **Pintar la escuela:** en la zona «Frente y entrada» hay una mejora «Elegir el color de la escuela». Una vez comprada, el alumno puede cambiar el color de las paredes **gratis cuando quiera** entre 8 colores (paleta en `zonas.ts`).

## 4. Datos (`StudentProgress.escuela`)
```ts
escuela?: {
  compras: string[];                    // ids de mejoras compradas
  lugares?: Record<string, string>;     // mejora "sueno" → id del lugar donde la puso
  colorParedes?: string;                // id de la paleta
};
```
- Los objetos `real` van siempre en su lugar fijo (el de la escuela de verdad). Los `sueno` se colocan en **lugares libres** de su zona (cada zona define sus `lugares` con coordenadas); el alumno los puede **mover** de un lugar libre a otro.
- Nada de datos personales nuevos. Al **eliminar la cuenta** se borra con el resto del progreso (verificalo con `test-privacidad`).

## 5. Servidor (`/api/escuela`)
- **GET** `?code=`: solo lectura; devuelve zonas habilitadas, saldo, compras, lugares y color.
- **POST** `{ code, action: "comprar", mejora }`: valida que la zona esté habilitada, que no la tenga, que le alcancen los lápices; guarda. `{ action: "mover", mejora, lugar }`: el lugar existe, es de esa zona y está libre. `{ action: "color", color }`: tiene la mejora del color y el color está en la paleta.
- Mismo patrón que las otras rutas: `checkCodeRateLimit`, `recordFailedCodeAttempt` con código inexistente, `isTrialExpired`. El **aula abierta** también puede usar «Mi escuela» (no tiene nada del aula piloto).
- **El servidor calcula todo**; el cliente nunca manda lápices ni precios.

## 6. Pantalla
- **Escena:** capas apiladas del mismo tamaño (las imágenes las hace Claude, ver punto 8):
  1. `escuela/base-color.png`: la escuela entera a color.
  2. `escuela/base-lineas.png`: el mismo dibujo en blanco y negro (líneas), **alineado píxel a píxel** con el de color.
  3. `escuela/zonas/<zona>.png`: máscara de cada zona (blanco = la zona).
  Una zona coloreada muestra la capa de color recortada con su máscara (CSS `mask-image`) sobre la de líneas, con una animación de «se va pintando» (de 0,6 a 1 s). El color de las paredes se aplica con un filtro sobre la máscara `escuela/zonas/paredes.png`.
  4. Objetos (`escuela/objetos/<id>.png`) en sus lugares, ordenados por la coordenada `y` (lo de abajo tapa a lo de arriba).
- **Avatar caminando:** el avatar se dibuja chico en la escena. Al tocar un punto del piso camina hasta ahí (a velocidad constante, se da vuelta según la dirección, un leve rebote al caminar). Usá un **grafo de caminos** simple (puntos y uniones en `zonas.ts`) para que no atraviese paredes: va al punto del grafo más cercano, sigue el camino más corto y termina en el punto tocado. No puede entrar a zonas no habilitadas.
- **Zoom y desplazamiento:** la escena es más grande que el celular: se arrastra con el dedo y se puede acercar/alejar (botones + y −). Que ande en un celular chico.
- **Panel de la zona** (al tocar una zona o con un botón): lista de mejoras con imagen, precio y botón «Pintar» / «Agregar»; las compradas con ✅. Arriba, el saldo: «✏️ 23 lápices». Si no alcanza: «Te faltan 5 lápices: completá mundos para ganar más».
- **Al completar un mundo:** en la pantalla de premio del mundo, una línea «+12 ✏️ lápices de colores para Mi escuela» con un botón «Ir a Mi escuela».
- **Ver la escuela de un compañero:** desde el buzón o el ranking del aula, «Ver su escuela» (solo mirar, sin comprar ni mover; mismas reglas de privacidad que el perfil: solo apodo y avatar).
- Textos de 11 px como mínimo; botones de 44 px; `role="dialog"` en los paneles.

## 7. Panel docente
Una línea en el resumen del curso: «Mi escuela: N alumnos colorearon al menos una zona». Nada más por ahora.

## 8. Imágenes (las hace Claude, no Antigravity)
Claude dibuja la escuela a partir de las fotos de Pedro y deja todo en `public/theme/escuela/` con un `escuela/README.md` que dice el tamaño de la escena, las coordenadas de cada lugar y el grafo de caminos (o los deja directamente en `zonas.ts`). Mientras tanto, usá rectángulos de colores como provisorios. **No generes imágenes.**

## 9. Pruebas (obligatorio)
`scripts/test-escuela.ts`:
- para cada módulo de 3.º: lápices del módulo = 1,2 × costo de su zona, y la suma de precios de las mejoras = costo de la zona;
- saldo calculado (ganados − gastados), sin poder gastar de más, sin comprar dos veces, sin comprar en una zona no habilitada;
- un alumno con mundos ya completados tiene sus lápices desde el principio;
- mover un objeto soñado a un lugar ocupado o de otra zona falla; cambiar el color sin la mejora falla;
- el grafo de caminos está conectado (desde la entrada se llega a todas las zonas);
- el GET no escribe nada; restaurá la base al final.
Captura de pantalla (Playwright, celular de 390 px) de la escuela en blanco y negro, con una zona coloreada y con el avatar caminando, en tu resumen.

## 10. Entrega
`npx tsc --noEmit`, `npx eslint src`, el test nuevo y los de siempre (`test-colecciones`, `test-privacidad`, `test-regalos`, `test-torneo`) en verde. Resumen en `TAREAS.md` con cada punto «hecho» y cómo lo probaste.
