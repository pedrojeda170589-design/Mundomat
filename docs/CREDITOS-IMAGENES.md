# Imágenes de MundoTest26: origen, derechos y auditoría

Auditoría hecha por Claude el 4 de octubre de 2026, a pedido de Pedro: «todas las imágenes deben
poder comercializarse; hacé una auditoría para prevenir conflictos de autoría».

> **Aviso:** esto es una revisión práctica, no asesoramiento legal. Antes de vender la app a escuelas
> o al Estado conviene que un abogado de propiedad intelectual revise este documento y los términos
> vigentes de cada herramienta.

## 1. De dónde sale cada imagen

| Origen | Qué incluye | Derechos |
|---|---|---|
| **ChatGPT (OpenAI)**, cuenta de Pedro | Avatares, islas, mapas, escenas de cuentos, accesorios, colecciones y opciones de drops | Los términos de OpenAI le asignan al usuario los derechos que pudiera haber sobre lo generado y permiten el uso comercial. Ver los puntos 2 y 3. |
| **Dibujadas por código** (Claude: `scripts/`, SVG, recoloreo) | Sombrero de brujita, antifaz, vinchas pampa y reno, lentes de copos, corbatines, sombrero de paisano, Lápiz dorado | Son obra del proyecto, sin material de terceros. Los recoloreos parten de imágenes propias de la app. |
| **Antigravity** | Hasta hoy, ninguna imagen | Si genera alguna, se anota acá con la herramienta y la fecha. |

## 2. Lo que hay que saber de las imágenes hechas con IA

- **Uso comercial:** está permitido por los términos de OpenAI. Hay que revisarlos de vez en cuando, porque pueden cambiar.
- **Exclusividad:** puede no haberla. En muchos países, Argentina incluida (Ley 11.723), una imagen hecha solo por una máquina puede no tener protección de derecho de autor. Es decir, otro podría copiarla.
  - Lo que sí protege al proyecto es el **aporte humano**: la elección, la edición, el recorte, la composición, la integración en la app y los textos.
  - La **marca** (nombre y logo de la app) se protege registrándola en el INPI.
- **Parecido a obras de terceros:** la IA puede generar algo parecido a un personaje famoso. Por eso cada lámina se revisa antes de usarla (punto 4).

## 3. Reglas para todas las imágenes nuevas

1. **Sin terceros:** ningún personaje, mascota, marca, logo, escudo de club o diseño de película existente. Tampoco «parecidos» que se reconozcan.
2. **Prompts sin marcas:** nunca nombres de estudios, artistas o marcas (nada de «estilo Pixar», «Disney», «Sanrio»…). El estilo se describe con palabras: «3D tierno, render suave, colores vivos». *Nota: algunas láminas viejas de islas usaban «Pixar-like» en el prompt. El estilo en sí no está protegido y no aparecen personajes de Pixar, pero de ahora en más no se usa.*
3. **Sin texto en las imágenes,** salvo los números de los drops (6 y 7).
4. **Símbolos patrios** (bandera, escarapela, escudo, mapa de Malvinas): se pueden usar, siempre con respeto y sin deformarlos.
5. **Pueblos originarios:** con respeto, sin disfraces ni caricaturas. Los atuendos se describen como «inspirados en», sin copiar piezas sagradas.
6. **Objetos que se ponen en la cara o la cabeza** (pedido de Pedro, 5/10/2026): se dibujan de frente, **sin patillas** (ni las puntas a los costados) y con los **marcos sin vidrio**, para que no se vea nada «a través» que debería quedar tapado por la cabeza. Se piden sobre fondo verde liso y se procesan con `scripts/coleccion/anteojos_verde.py`, que deja los huecos transparentes y conserva el tamaño y el lugar de la imagen anterior (las viejas quedan en `arte/coleccion/anteojos-viejos/`).
7. **Registro de cada lámina** en la tabla del final: fecha, herramienta, tema y prompt (los prompts quedan en `scripts/coleccion/` y en el historial).

## 4. Revisión de lo que ya está en la app (4/10/2026)

- **Avatares (29) y accesorios (84):** los revisé uno por uno en hojas de contacto y **no encontré personajes ni marcas de terceros**.
  - Los próceres (San Martín, Belgrano, Juana Azurduy) son figuras históricas, de dominio público.
  - Los personajes de Halloween (calabaza, fantasma, brujita, vampirito…) son genéricos.
- **Cuentos:**
  - Los clásicos infantiles (Caperucita, los tres chanchitos, Ricitos, el patito feo, los músicos de Bremen, Juan y los porotos, el traje del emperador) y las fábulas son de dominio público. Las ilustraciones no copian versiones de Disney ni de otros estudios.
  - Las leyendas son tradición oral; los textos los escribimos nosotros.
  - **Horacio Quiroga** («Las medias de los flamencos», «La tortuga gigante») murió en 1937. En Argentina la obra pasa a dominio público 70 años después de la muerte del autor, así que es de dominio público desde 2008.
- **Audio:** la música es original (compuesta por código) y la voz es Kokoro (Apache 2.0). Ver `docs/CREDITOS-AUDIO.md`.

## 5. Riesgos en las ideas nuevas (lámina de referencia de Pedro y drops)

| Idea | Riesgo | Qué hacemos |
|---|---|---|
| **«Butter»**, si se refiere a *Butterbear* (el oso de la confitería tailandesa) | 🔴 Personaje registrado | No se usa. Hacemos piezas originales de «manteca» (tostada con manteca, vincha y anteojos de manteca), sin oso con boina. |
| **Máscara de monstruo verde con tornillos** (tipo Frankenstein) | 🟠 La cabeza plana con tornillos en el cuello es un diseño reconocible de un estudio | Si hace falta, un «monstruito verde» original: redondo, sin cabeza plana ni tornillos. |
| **67 (six-seven)** | 🟢 Es un número y una moda; no tiene dueño | Sin copiar logos, tapas de canciones ni nombres de artistas. |
| **Squishies** (capibara, gato, nube, palta…) | 🟢 Genéricos | Diseños propios, sin parecerse a líneas comerciales de juguetes. |
| **Gato con moño en la oreja y bigotes** | 🟠 Puede recordar a una gatita famosa | Si es un gato, sin moño en la oreja y con boca dibujada. |
| **Tiburón, pirata, pelota de fútbol, trofeo** | 🟢 Genéricos | Sin escudos ni camisetas de clubes o selecciones, y sin el diseño de canciones o dibujos animados conocidos. |

## 6. Registro de láminas

| Fecha | Herramienta | Lámina | Uso |
|---|---|---|---|
| 04/10/2026 | ChatGPT (cuenta de Pedro) | Piloto de colecciones: veterinaria, perro ovejero, Guardián de la Tortuga, guardián de animales, exploradora con gato, gato, cámara, mochila para mascotas, conejo | Colección Animales y avatar de logro |
| 04/10/2026 | ChatGPT (cuenta de Pedro) | Opciones de drops A: 67 (anteojos, vincha, cadena, gorra, squishies 6 y 7, moño, globos, medalla) | Referencia, a elegir |
| 04/10/2026 | ChatGPT (cuenta de Pedro) | Opciones de drops B: squishies (capibara, tostada con manteca, gato bollito, estrella, nube, leche de frutilla, palta, dumpling, pingüino) | Referencia, a elegir |
| 04/10/2026 | ChatGPT (cuenta de Pedro) | Opciones de drops C: vinchas con resortes | Referencia, a elegir |
| 04/10/2026 | ChatGPT (cuenta de Pedro) | Opciones de drops D: anteojos de fiesta | Referencia, a elegir |

## Agregadas el 4/10/2026 (Claude, en el ChatGPT de Pedro)

Todas son ilustraciones nuevas, sin texto, sin marcas y sin personajes conocidos.

- **Fondos de Santa Cruz** (`public/theme/santa-cruz/*.jpg`). Paisajes reales pintados de nuevo, sin fotos de terceros:
  - Cerro Ventana
  - Fitz Roy / El Chaltén
  - Glaciar Perito Moreno
  - Cueva de las Manos (arte rupestre genérico, tratado con respeto)
  - Bosque Petrificado de Jaramillo
  - Ría Deseado
- **El profe Pedro con vestimentas** (`public/theme/profe/*.png`). Hechas a partir de su foto, con su autorización:
  - andinista, guardaparque, científico, astrónomo
  - explorador, gaucho, escritor, matemático, almacenero
- **Premios del torneo de las tablas** (`public/theme/accessories-temporada/`): vincha relámpago, lentes turbo y medalla del rayo.
- **Premios de las vueltas del torneo** (`public/theme/accessories-temporada/*-oro|plata|bronce.png`), generados en ChatGPT el 5/10/2026: vincha relámpago, lentes turbo y medalla del rayo en dorado, plateado y bronce (y, a medida que se dibujan, los superespeciales: antifaz estelar, collar estrella y cetro de los números).
- **Six-Seven** (`public/theme/accessories-tienda/*-67.png`, `squishy-6/7`), y objetos de la lámina 9 (mate, termo, guitarra, bombo legüero, mascotas caballo, oveja y ovejero, poncho del gran explorador, bastón de caramelo), generados en ChatGPT el 5/10/2026.
- **Islas de 4.º grado** (`public/theme/grados/4/islas/`), generadas en ChatGPT el 8/10/2026 (12 láminas de 9): ilustraciones propias de objetos, paisajes y animales; sin marcas, personajes conocidos ni textos.
- **Viaje a Monte León** (`public/theme/monte-leon/`, `accessories-temporada/*-ml.png`, `medalla-monte-leon`, `avatars/*-monte-leon.png`), generados en ChatGPT el 5/10/2026: objetos de la mochila, pingüino de peluche, medalla, tres avatares superespeciales, seis escenas del parque (ilustraciones, no fotos) e isla del mapa.
- **Premios del repaso de las tablas en tres metales** (cronómetro, gorra y banderín de las tablas; trofeo, corona y estrella fugaz), ChatGPT, 5/10/2026.
- **Vestidor de cuerpo completo** (`public/theme/vestidor/`), generado en ChatGPT el 10/10/2026: cuatro personajes originales (solo cabeza y manos; la ropa térmica gris es una capa común) y 31 prendas, cada una pedida como edición de la misma imagen base. El 10/10/2026 se rehicieron la imagen base, los cuatro personajes y las 33 prendas con prompts **sin nombres de estudios ni marcas** (la primera versión había dicho por error «tipo Pixar»; se reemplazó entera).
- **Metas especiales** (`public/theme/avatars/{huemul,lobo-marino,choique,inventora,lectora,artista}.png` y objetos en `accessories-temporada/`), ChatGPT, 10/10/2026: personajes y objetos originales, sin marcas.
- **Cuento «La tortuga gigante», escena 2**: se le quitó el tercer ojo a la tortuga (retoque local, 5/10/2026).

## 7. Revisión del 5/10/2026 (imágenes nuevas)

Revisé una por una las láminas nuevas (Monte León, premios del repaso en tres metales, Six-Seven, láminas 9 a 15 de colecciones y los anteojos rehechos):

- **Sin personajes, marcas ni logos de terceros.** Los avatares de Monte León (explorador, guardaparque, pingüino) son personajes originales. En la escena del guardaparque el cartel tiene solo dibujos (pingüino, basura tachada, huella), sin el logo de Parques Nacionales ni texto; el uniforme es genérico.
- **Lugares reales** (Monte León, la Cabeza del León, la Ruta 3): son ilustraciones nuevas, no copias de fotos. Pintar un paisaje o un lugar público no infringe derechos.
- **Bandera argentina** (isla de Monte León, bufanda del pingüino): símbolo patrio, usado con respeto (regla 4).
- **«Six-Seven» y los números 6 y 7:** sin logos, tapas de canciones ni nombres de artistas.
- **Un error encontrado y corregido:** los objetos «mate» y «lupa» de la lámina 9 y 15 se habían procesado con la imagen equivocada (la pose del profe con el mate y con la lupa, que tiene el mismo nombre de archivo). Se rehicieron con el dibujo del objeto y `procesar_arte.py` ya no mezcla las poses del profe con los objetos. La foto de Pedro solo se usa en las poses del profe, con su autorización.
- **Anteojos y antifaces rehechos** (sin patillas y sin vidrio): lentes, anteojos de lectura, arcoíris, nube, margaritas, estrellas, carpincho, palta, manteca, rana, soles, copos, corazón, estrella, antifaz de carnaval, antifaz de murciélago (ahora con forma de murciélago), antiparras, lentes turbo, antifaces estelares, aviador, gafas de sol, lentes de sol, lentes de verano, anteojos 67 y anteojos de sol del viaje. Todos en ChatGPT (cuenta de Pedro), 5/10/2026. Los lentes de copos y el antifaz de murciélago antes estaban dibujados por código; ahora son de ChatGPT.
- **Lo que sigue vigente del punto 2:** el uso comercial está permitido por los términos de OpenAI, pero una imagen hecha solo con IA puede no tener derecho de autor exclusivo. Lo que protege al proyecto es el aporte humano y el registro de la marca. Esto no es asesoramiento legal.
- **Láminas 16 a 21 de colecciones** (exploradores y navegantes, selva, jardín y ciencia, montaña, fiesta, ambiente, lluvia y agua), ChatGPT, 6/10/2026. Revisadas: sin personajes ni marcas; el símbolo de reciclaje es de uso libre.
