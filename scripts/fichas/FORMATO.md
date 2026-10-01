# Fichas de refuerzo complementarias — formato

Pedro (docente de 3.º grado, Santa Cruz, Patagonia) quiere que las fichas PDF NO sean "la app en papel".
Tienen que ser un recurso que COMPLEMENTE el aprendizaje de cada mundo: actividades con objetos reales,
juegos en familia, observación, pequeñas investigaciones, producción propia, conversación. NO deben repetir
las preguntas ni el formato de las actividades del mundo en la app (opción múltiple, verdadero/falso, unir,
ordenar, completar el resultado, etc.).

Para cada mundo hay 2 versiones (fichas distintas, mismo contenido curricular, propuestas diferentes).

## JSON de salida (un archivo por materia)

```json
{
  "1": [
    {
      "title": "Detectives de números en casa",
      "purpose": "Una o dos oraciones para la familia: qué se refuerza y cómo acompañar (sin dar las respuestas).",
      "blocks": [
        {
          "kind": "hacer",            // hacer | juego | investigo | creo | converso
          "title": "Buscamos números",
          "steps": ["Paso corto 1.", "Paso corto 2."],
          "table": { "cols": ["Objeto", "Número", "¿Para qué sirve?"], "rows": 5 },   // opcional
          "draw": "Dibujá ...",       // opcional: recuadro para dibujar con esta consigna
          "lines": 3                  // opcional: renglones para escribir (0–6)
        }
      ],
      "selfCheck": ["Puedo leer números grandes que encuentro en mi casa.", "..."]   // 3 frases "Puedo..."
    },
    { ...versión 2... }
  ]
}
```

## Reglas

- Español rioplatense con voseo, para chicos de 8–9 años (3.º grado) que leen con un adulto cerca. Frases cortas.
- Cada versión: 3 o 4 bloques, de al menos 3 tipos distintos. Siempre al menos un "juego" (en familia o con
  compañeros, con reglas claras y materiales caseros: dados, cartas, porotos, tapitas, papel, hilo, regla, balanza
  de cocina, calendario, etc.) y al menos uno de "investigo" u "converso" (observar, preguntar a un adulto,
  registrar, comparar).
- Contexto local cuando sume: Santa Cruz, Gobernador Gregores, viento, estancia, ovejas, guanaco, choique,
  lenga, calafate, río Chico, meseta, nieve, frío, mate.
- Nada que requiera comprar cosas, internet o impresora extra. Seguridad: nada con fuego, cuchillos o
  químicos; experimentos con agua, sal, arena, hielo, aceite de cocina son ok con un adulto.
- Pasos de 1 oración cada uno (máx. 5 pasos por bloque). "table" con 2–4 columnas y 3–6 filas.
  "draw" y "lines" solo cuando aporten. Que entre en 2 hojas A4 por ficha.
- Contenido correcto y alineado con el mundo (leé su nombre, descripción y categoría en
  /home/claude/mundomat/src/lib/worlds.ts, y mirá su generador de actividades en
  /home/claude/mundomat/src/lib/activities.ts — función según `category` — para saber QUÉ contenido trabaja y
  para NO copiar sus actividades).
- "purpose" orientado a la familia, sin respuestas.
- Sin emojis en los textos (la fuente PDF no los muestra).
- No inventar datos (fechas, cifras) dudosos; si hay hechos (efemérides, ciencia), que sean correctos.
