"""Datos de las fichas de refuerzo de los mundos de cuentos.
1.º grado: 11101–11119 (19 fichas: dibujo y conversación)
2.º grado: 21101–21119 (19 fichas: escritura breve)
3.º grado: 31101–31106 (6 fichas: textos cortos, noticias, opinión)
Total: 44 fichas.
Sin emojis en los textos (la fuente PDF no los renderiza).
Formato según scripts/fichas/FORMATO.md.
"""

CUENTOS_FICHAS = {
  # =========================================================================
  # 1.º GRADO (11101 - 11119)
  # =========================================================================
  "11101": [{
    "title": "Los constructores del bosque",
    "purpose": "Conversar en familia sobre el esfuerzo y el trabajo bien hecho. Acompañen al niño en el dibujo y la renarración oral.",
    "blocks": [
      {
        "kind": "converso",
        "title": "La ronda de los chanchitos",
        "steps": [
          "Conversen sobre por qué la casa de ladrillos no se cayó con el soplido del lobo.",
          "Preguntale a tu familia qué casa les gustaría construir si vivieran en un bosque.",
          "Recuerden qué aprendieron los dos hermanos que hicieron sus casas apurados."
        ]
      },
      {
        "kind": "creo",
        "title": "Dibujo mi casa resistente",
        "steps": [
          "Imaginá una casa fuerte y segura para protegerte de cualquier tormenta."
        ],
        "draw": "Dibujá acá tu casa resistente con ladrillos, ventanas y una chimenea abrigada."
      },
      {
        "kind": "juego",
        "title": "El lobo soplador",
        "steps": [
          "Pongan una pelotita de papel en un extremo de la mesa.",
          "Por turnos, tomen aire profundo y soplen para llevarla hasta la otra punta.",
          "Comprueben quién logra moverla con más suavidad o con más potencia."
        ]
      }
    ],
    "selfCheck": [
      "Puedo contar qué casa construyó cada uno de los tres hermanos.",
      "Puedo explicar por qué el trabajo con dedicación dio mejor resultado.",
      "Puedo dibujar mi propia casa resistente para el bosque."
    ]
  }],

  "11102": [{
    "title": "El arbusto de la abuela Koonek",
    "purpose": "Descubrir una leyenda tradicional de Santa Cruz y valorar el cariño hacia los abuelos y la naturaleza.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Memoria de la Patagonia",
        "steps": [
          "Conversen sobre por qué la abuela Koonek se quedó en la meseta cuando su pueblo marchó.",
          "Pregunten a un adulto si alguna vez probó dulces o mermelada de calafate.",
          "Recuerden la promesa: quien come calafate siempre regresa a la Patagonia."
        ]
      },
      {
        "kind": "creo",
        "title": "Flores y frutos en la meseta",
        "steps": [
          "Recordá los colores que nacieron en el arbusto al llegar la primavera y el verano."
        ],
        "draw": "Dibujá el arbusto de calafate con sus flores amarillas y sus frutos violetas."
      },
      {
        "kind": "juego",
        "title": "Aves que regresan",
        "steps": [
          "Imiten en familia el vuelo de las aves que vuelven en primavera a visitar a la abuela.",
          "Vuelen con pasos suaves por la casa y aterricen junto a un árbol imaginario."
        ]
      }
    ],
    "selfCheck": [
      "Puedo recordar en qué planta se transformó la abuela Koonek.",
      "Puedo nombrar los colores de las flores y de los frutos del calafate.",
      "Puedo conversar en familia sobre las historias tradicionales de nuestra provincia."
    ]
  }],

  "11103": [{
    "title": "Paso a paso se llega lejos",
    "purpose": "Reflexionar sobre la constancia y el respeto hacia los demás sin burlarse de sus ritmos.",
    "blocks": [
      {
        "kind": "converso",
        "title": "La carrera del bosque",
        "steps": [
          "Conversen sobre por qué la liebre se quedó dormida en medio del camino.",
          "Recuerden la actitud de la tortuga que siguió caminando sin detenerse.",
          "Piensen en qué momentos de la vida diaria vale la pena avanzar paso a paso con paciencia."
        ]
      },
      {
        "kind": "creo",
        "title": "La medalla de la constancia",
        "steps": [
          "Diseñá un premio especial para quien no se rinde ante los desafíos difíciles."
        ],
        "draw": "Dibujá la medalla que recibió la tortuga al cruzar la línea de llegada."
      },
      {
        "kind": "juego",
        "title": "Caminata de tortugas",
        "steps": [
          "Marquen una línea de salida y una meta en el pasillo o patio.",
          "Caminen en cámara lenta, apoyando un pie detrás de otro sin detener la marcha.",
          "Gana quien camine con más calma y constancia sin tropezar."
        ]
      }
    ],
    "selfCheck": [
      "Puedo contar quién ganó la carrera y por qué razón lo logró.",
      "Puedo valorar el esfuerzo constante de la tortuga frente a la confianza excesiva.",
      "Puedo dibujar una medalla para premiar la perseverancia."
    ]
  }],

  "11104": [{
    "title": "Manos que ayudan a amasar",
    "purpose": "Fomentar la cooperación familiar y la colaboración solidaria en las tareas cotidianas.",
    "blocks": [
      {
        "kind": "converso",
        "title": "¿Quién ayuda en casa?",
        "steps": [
          "Recuerden qué respondían el pato, el gato y el chancho cada vez que la gallinita pedía ayuda.",
          "Conversen sobre por qué la gallinita decidió compartir el pan solo con sus pollitos.",
          "Nombren tres tareas de la casa en las que podemos colaborar todos los días."
        ]
      },
      {
        "kind": "hacer",
        "title": "Amasamos en familia",
        "steps": [
          "Acompañá a un adulto a mezclar en un bol dos tazas de harina, agua tibia y una pizca de sal.",
          "Amasá con las dos manos sobre la mesa hasta sentir la masa suave y blanda.",
          "Armen pancitos redondos con ayuda de un adulto para hornearlos en la merienda."
        ]
      },
      {
        "kind": "creo",
        "title": "El pan de la gallinita",
        "steps": [
          "Imaginá la mesa servida con el pan doradito recién horneado."
        ],
        "draw": "Dibujá a la gallinita roja compartiendo su pan caliente con sus pollitos."
      }
    ],
    "selfCheck": [
      "Puedo explicar por qué es importante colaborar antes de disfrutar de los resultados.",
      "Puedo nombrar a los tres animales que no quisieron ayudar a la gallinita.",
      "Puedo participar en una actividad sencilla de cocina en casa."
    ]
  }],

  "11105": [{
    "title": "Casitas de barro en el árbol",
    "purpose": "Observar las aves de nuestro entorno y valorar el trabajo paciente para construir un hogar.",
    "blocks": [
      {
        "kind": "investigo",
        "title": "Detectives de nidos",
        "steps": [
          "Salgan al patio o a la vereda y miren con atención las ramas altas de los árboles o postes.",
          "Observen si descubren algún nido redondo hecho con barro seco y pajitas.",
          "Conversen sobre cómo protegen los horneros a sus pichones del viento y la lluvia."
        ]
      },
      {
        "kind": "creo",
        "title": "El nido en la rama",
        "steps": [
          "Recordá la forma redonda como un horno que tiene la casita de esta pequeña ave."
        ],
        "draw": "Dibujá al hornero trabajando con su pico sobre una rama firme."
      },
      {
        "kind": "converso",
        "title": "El ave nacional",
        "steps": [
          "Recuerden la prueba de paciencia que cumplió el joven guaraní dentro del cuero.",
          "Conversen sobre por qué el hornero fue elegido como el ave nacional de la Argentina."
        ]
      }
    ],
    "selfCheck": [
      "Puedo explicar cómo fabrica su casa de barro el hornero con su pico.",
      "Puedo reconocer al hornero como el ave nacional de nuestro país.",
      "Puedo observar con respeto a los pájaros que habitan cerca de casa."
    ]
  }],

  "11106": [{
    "title": "Pequeños grandes amigos",
    "purpose": "Promover la empatía y la solidaridad, recordando que todas las personas tienen talentos para ayudar.",
    "blocks": [
      {
        "kind": "converso",
        "title": "La promesa cumplida",
        "steps": [
          "¿Por qué se rió el gran león cuando el ratoncito le prometió que algún día lo ayudaría?",
          "¿Qué herramientas utilizó el ratón para romper las cuerdas gruesas de los cazadores?",
          "Conversen sobre cómo los niños pequeños pueden ayudar a los adultos en situaciones difíciles."
        ]
      },
      {
        "kind": "creo",
        "title": "El rescate en la selva",
        "steps": [
          "Imaginá el momento de valentía en que el ratón socorre a su enorme amigo atrapado."
        ],
        "draw": "Dibujá al ratón mordiendo la red de cazadores para liberar al león."
      },
      {
        "kind": "juego",
        "title": "Teatro de sombras y manos",
        "steps": [
          "Usá dos dedos de una mano para imitar los pasitos del ratón.",
          "Abrí la otra mano con fuerza imitando la garra protectora del león.",
          "Recreen el diálogo de agradecimiento cuando el león queda finalmente libre."
        ]
      }
    ],
    "selfCheck": [
      "Puedo relatar cómo un animal pequeño salvó al rey de la selva.",
      "Puedo explicar por qué ningún acto de bondad es insignificante.",
      "Puedo dramatizar el encuentro entre los dos amigos."
    ]
  }],

  "11107": [{
    "title": "Cuidado y respeto en la casa del bosque",
    "purpose": "Conversar sobre los límites, el respeto a los espacios ajenos y pedir permiso antes de entrar.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Visita sin permiso",
        "steps": [
          "Conversen sobre si estuvo bien o mal que Ricitos de Oro entrara a una casa que no era suya.",
          "¿Cómo se sintió el osito chiquito al encontrar su tazón vacío y su sillita rota?",
          "¿Qué aprendió la nena cuando salió corriendo asustada por el bosque?"
        ]
      },
      {
        "kind": "creo",
        "title": "Los tres tazones de sopa",
        "steps": [
          "Recordá los tres tamaños de platos que estaban servidos sobre la mesa del comedor."
        ],
        "draw": "Dibujá el plato grande de papá oso, el mediano de mamá osa y el tazón chiquito del osito."
      },
      {
        "kind": "juego",
        "title": "Grande, mediano y pequeño",
        "steps": [
          "Busquen en la cocina o en la habitación tres objetos iguales de tres tamaños distintos.",
          "Ordénenlos en fila sobre la mesa desde el más chiquito hasta el más grande.",
          "Cambien el orden con los ojos tapados e intenten adivinar cuál falta."
        ]
      }
    ],
    "selfCheck": [
      "Puedo recordar qué sopa y qué camita eligió Ricitos de Oro.",
      "Puedo ordenar objetos según su tamaño: grande, mediano y pequeño.",
      "Puedo explicar por qué siempre debemos pedir permiso antes de tocar lo que no es nuestro."
    ]
  }],

  "11108": [{
    "title": "El regalo de la luna y la nube",
    "purpose": "Apreciar la tradición del mate como símbolo de encuentro, hospitalidad y afecto en nuestra comunidad.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Gratitud en la selva",
        "steps": [
          "Recuerden quiénes eran en verdad las jóvenes que caminaban por la selva misionera.",
          "Conversen sobre el gesto del anciano que compartió su comida humilde sin saber quiénes eran.",
          "¿Por qué el mate se comparte hoy como una señal de amistad y bienvenida?"
        ]
      },
      {
        "kind": "creo",
        "title": "El mate de la amistad",
        "steps": [
          "Diseñá un mate decorado con hojas y flores de la naturaleza."
        ],
        "draw": "Dibujá un mate con su bombilla plateada rodeado de ramas verdes de yerba."
      },
      {
        "kind": "hacer",
        "title": "Ronda de mate en casa",
        "steps": [
          "Acompañá a un adulto a calentar el agua y preparar el mate con yerba fresca.",
          "Siéntense juntos en la mesa y conversen sobre una anécdota alegre de la familia.",
          "Aprendé que el mate se recibe con una sonrisa y se devuelve con respeto."
        ]
      }
    ],
    "selfCheck": [
      "Puedo contar quiénes fueron Yasí y Araí según la leyenda guaraní.",
      "Puedo explicar qué significa compartir una ronda de mate en familia.",
      "Puedo dibujar los elementos tradicionales del mate."
    ]
  }],

  "11109": [{
    "title": "Cuidar lo nuestro con atención",
    "purpose": "Reflexionar sobre no dejarse engañar por halagos falsos y aprender a escuchar con sentido crítico.",
    "blocks": [
      {
        "kind": "converso",
        "title": "El queso en lo alto del árbol",
        "steps": [
          "¿Por qué el zorro le decía tantas cosas lindas a las plumas y a la voz del cuervo?",
          "¿Qué le ocurrió al queso cuando el cuervo abrió su pico para cantar con orgullo?",
          "Conversen sobre cómo reconocer cuando alguien nos dice algo lindo de corazón o por interés."
        ]
      },
      {
        "kind": "creo",
        "title": "El cuervo y su tesoro",
        "steps": [
          "Imaginá la escena en lo alto del árbol antes de que el queso cayera al suelo."
        ],
        "draw": "Dibujá al cuervo orgulloso sobre la rama más alta y al zorro mirándolo desde abajo."
      },
      {
        "kind": "juego",
        "title": "Palabras que alegran",
        "steps": [
          "Miren a cada integrante de la familia y díganle una cualidad verdadera que admiren de él.",
          "Comprueben lo lindo que se siente recibir palabras sinceras que nacen del cariño."
        ]
      }
    ],
    "selfCheck": [
      "Puedo relatar cómo consiguió el zorro quedarse con el queso del cuervo.",
      "Puedo explicar qué enseñanza deja esta fábula clásica.",
      "Puedo distinguir un halago sincero de uno interesado."
    ]
  }],

  "11110": [{
    "title": "Caminar por el sendero seguro",
    "purpose": "Conversar sobre el cuidado personal, respetar las advertencias de los adultos y no hablar con desconocidos.",
    "blocks": [
      {
        "kind": "converso",
        "title": "El consejo de mamá",
        "steps": [
          "¿Qué recomendación importante le dio su mamá a Caperucita antes de que cruzara el bosque?",
          "¿Por qué el lobo llegó primero a la casa de la abuelita?",
          "Conversen en familia sobre qué cuidados debemos tener al caminar por la calle o plazas."
        ]
      },
      {
        "kind": "creo",
        "title": "La canasta de cosas ricas",
        "steps": [
          "Imaginá una merienda saludable para llevarle a una persona querida que necesita cariño."
        ],
        "draw": "Dibujá la canasta con manzanas, frutas frescas, panes caseros y flores del jardín."
      },
      {
        "kind": "juego",
        "title": "El camino del bosque",
        "steps": [
          "Coloquen almohadones o líneas de lana en el suelo para armar un sendero sinuoso.",
          "Caminen sobre el camino manteniendo el equilibrio sin tocar los bordes exteriores.",
          "Lleguen a la meta imaginaria donde espera el abrazo de la familia."
        ]
      }
    ],
    "selfCheck": [
      "Puedo recordar la advertencia de la mamá antes de que Caperucita saliera de su casa.",
      "Puedo dibujar alimentos saludables para compartir en una merienda.",
      "Puedo explicar por qué no debemos hablar con personas extrañas ni apartarnos del camino."
    ]
  }],

  "11111": [{
    "title": "La noche de los siete colores",
    "purpose": "Apreciar la belleza de los paisajes del norte argentino y despertar la creatividad artística infantil.",
    "blocks": [
      {
        "kind": "converso",
        "title": "El secreto de los chicos",
        "steps": [
          "¿Por qué los cerros de Purmamarca eran antes solo grises y marrones según la leyenda?",
          "¿Cómo se organizaron los chicos del pueblo para pintar cada noche sin despertar a los grandes?",
          "¿Qué cara pusieron los vecinos cuando vieron el cerro iluminado de colores en la mañana?"
        ]
      },
      {
        "kind": "creo",
        "title": "Mi cerro multicolor",
        "steps": [
          "Usá tus lápices para llenar de franjas de colores distintos la silueta de la montaña."
        ],
        "draw": "Dibujá el Cerro de los Siete Colores con franjas prolijas de rojo, verde, amarillo y violeta."
      },
      {
        "kind": "investigo",
        "title": "Buscadores de colores",
        "steps": [
          "Busquen en casa siete objetos pequeños que representen siete colores diferentes del arcoíris.",
          "Ordénenlos en fila sobre la mesa y nombren cada color en voz alta."
        ]
      }
    ],
    "selfCheck": [
      "Puedo nombrar al menos cuatro colores que forman el cerro de Purmamarca.",
      "Puedo contar la leyenda tradicional de los chicos jujeños.",
      "Puedo pintar con franjas coloridas un paisaje montañoso."
    ]
  }],

  "11112": [{
    "title": "Cantar y trabajar con alegría",
    "purpose": "Reconocer la importancia de la previsión, el valor del esfuerzo y la solidaridad en el invierno.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Verano caluroso e invierno frío",
        "steps": [
          "¿Qué hacía la cigarra en verano mientras la hormiga cargaba granos bajo el sol?",
          "¿Por qué fue valioso que la hormiga abriera la puerta de su refugio cuando llegó la nieve?",
          "Conversen sobre cómo podemos equilibrar el juego y los deberes de la escuela."
        ]
      },
      {
        "kind": "creo",
        "title": "El refugio abrigado",
        "steps": [
          "Imaginá el interior del hormiguero donde la cigarra y la hormiga comparten la comida caliente."
        ],
        "draw": "Dibujá a los dos personajes merendando juntos y a salvo del viento invernal."
      },
      {
        "kind": "juego",
        "title": "Hormiguitas trabajadoras",
        "steps": [
          "Junten cinco broches de ropa o tapitas plásticas y colóquenlas en un rincón del salón.",
          "Llévenlas una a una hasta una cajita en el otro extremo sin que se caigan de la mano.",
          "Comprueben cómo con paciencia se puede llenar un almacén de provisiones."
        ]
      }
    ],
    "selfCheck": [
      "Puedo contar qué tareas realizaba cada personaje durante las estaciones del año.",
      "Puedo valorar el gesto bondadoso de la hormiga al convidar su comida.",
      "Puedo explicar por qué es necesario trabajar para tener provisiones en el futuro."
    ]
  }],

  "11113": [{
    "title": "Cada uno es hermoso y especial",
    "purpose": "Fortalecer la autoestima, celebrar las diferencias individuales y fomentar la inclusión en los juegos.",
    "blocks": [
      {
        "kind": "converso",
        "title": "El valor de las diferencias",
        "steps": [
          "¿Cómo se sentía el patito cuando los otros animales del corral se burlaban de su color gris?",
          "¿Qué sorpresa maravillosa descubrió al mirar su propio reflejo en el agua en primavera?",
          "Conversen sobre por qué todas las personas somos únicas, diferentes y valiosas."
        ]
      },
      {
        "kind": "creo",
        "title": "El cisne en el agua limpia",
        "steps": [
          "Dibujá al hermoso cisne blanco nadando tranquilo en la laguna junto a sus nuevos compañeros."
        ],
        "draw": "Dibujá al cisne con sus alas desplegadas y el agua azul que refleja su figura."
      },
      {
        "kind": "juego",
        "title": "El espejo de las virtudes",
        "steps": [
          "Pónganse frente a un espejo en familia y mírense con una gran sonrisa.",
          "Cada integrante nombrará tres cualidades hermosas de la persona que tiene al lado."
        ]
      }
    ],
    "selfCheck": [
      "Puedo relatar cómo el patito descubrió que en verdad era un hermoso cisne.",
      "Puedo expresar por qué nunca debemos burlarnos de quien es diferente a nosotros.",
      "Puedo reconocer cualidades lindas en mí y en mis compañeros."
    ]
  }],

  "11114": [{
    "title": "El suspiro que trajo el viento",
    "purpose": "Conocer la historia de la creación según el pueblo tehuelche y valorar el entorno natural santacruceño.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Cuando todo era oscuridad",
        "steps": [
          "¿Cómo nacieron el inmenso mar y el viento fuerte según la creencia de los tehuelches?",
          "¿Por qué Kóoch levantó una gran isla en el medio de las aguas?",
          "¿Qué recuerdan los pobladores de Santa Cruz cada vez que el viento sopla sobre los cerros?"
        ]
      },
      {
        "kind": "creo",
        "title": "La gran isla y sus criaturas",
        "steps": [
          "Imaginá la primera isla con el calor del sol, las nubes con lluvia y los primeros animales."
        ],
        "draw": "Dibujá el sol brillante, las olas del mar y la isla donde nacieron las plantas y animales."
      },
      {
        "kind": "juego",
        "title": "El soplo del viento patagónico",
        "steps": [
          "Respiren hondo inflando el pecho como si fueran Kóoch al principio de los tiempos.",
          "Suelten el aire despacio haciendo el sonido suave del viento sobre la hierba de la estepa."
        ]
      }
    ],
    "selfCheck": [
      "Puedo nombrar qué elementos de la naturaleza nacieron del llanto y el suspiro de Kóoch.",
      "Puedo relacionar el viento de nuestra provincia con la leyenda tehuelche.",
      "Puedo dibujar la isla donde comenzó la vida según el relato ancestral."
    ]
  }],

  "11115": [{
    "title": "La fuerza de la verdad",
    "purpose": "Comprender la importancia de la honestidad para cuidar la confianza de los amigos y la familia.",
    "blocks": [
      {
        "kind": "converso",
        "title": "¿Por qué nadie vino?",
        "steps": [
          "¿Por qué los vecinos del pueblo se cansaron de subir a la loma corriendo?",
          "¿Qué ocurrió la tarde en que el lobo apareció de verdad entre las ovejas?",
          "Conversen sobre qué le pasa a una persona que miente cuando después necesita que le crean."
        ]
      },
      {
        "kind": "creo",
        "title": "Las ovejas en la colina",
        "steps": [
          "Recordá el paisaje sereno de la loma donde pastaban las ovejas cuidadas por el pastor."
        ],
        "draw": "Dibujá a las ovejitas blancas comiendo pasto verde bajo el cielo despejado."
      },
      {
        "kind": "juego",
        "title": "La ronda de la sinceridad",
        "steps": [
          "Por turnos, cuenten una pequeña verdad sobre algo que hicieron hoy y que les dio alegría.",
          "Celebren con un aplauso cada vez que alguien comparte algo con honestidad y cariño."
        ]
      }
    ],
    "selfCheck": [
      "Puedo explicar por qué los vecinos no acudieron cuando el lobo atacó de verdad.",
      "Puedo reflexionar sobre las consecuencias negativas de inventar mentiras.",
      "Puedo practicar decir siempre la verdad con tranquilidad en casa."
    ]
  }],

  "11116": [{
    "title": "La orquesta de los cuatro amigos",
    "purpose": "Celebrar el trabajo en equipo, la amistad y el valor de los seres mayores en nuestra sociedad.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Juntos somos más fuertes",
        "steps": [
          "¿Qué tenían en común el burro, el perro, el gato y el gallo al encontrarse en el camino?",
          "¿Cómo se acomodaron para asustar a los ladrones que comían dentro de la casita?",
          "¿Por qué decidieron quedarse a vivir juntos tocando música en el bosque?"
        ]
      },
      {
        "kind": "creo",
        "title": "La torre de animales músicos",
        "steps": [
          "Recordá el orden en que se subieron uno arriba del otro frente a la ventana iluminada."
        ],
        "draw": "Dibujá al burro abajo, al perro sobre su lomo, al gato trepado y al gallo en la cima."
      },
      {
        "kind": "juego",
        "title": "Coro de la granja",
        "steps": [
          "Repartan entre los presentes los cuatro sonidos: rebuzno, ladrido, maullido y quiquiriquí.",
          "Canten una canción conocida reemplazando las palabras por los sonidos de cada animal.",
          "Escuchen lo divertido y potente que suena cuando todos cantan al mismo tiempo."
        ]
      }
    ],
    "selfCheck": [
      "Puedo nombrar en orden a los cuatro animales que formaron la banda musical.",
      "Puedo explicar cómo colaboraron en equipo para resolver su problema de vivienda.",
      "Puedo dibujar la torre de amigos frente a la ventana de la casa."
    ]
  }],

  "11117": [{
    "title": "El héroe que trajo el fuego",
    "purpose": "Descubrir la figura de Elal en la cultura aonikenk y valorar los saberes ancestrales de la Patagonia.",
    "blocks": [
      {
        "kind": "converso",
        "title": "El regalo del fuego",
        "steps": [
          "¿Quién trajo volando al niño Elal sobre su lomo hasta la cima del cerro Chaltén?",
          "¿Cómo consiguió Elal encender la primera chispa de fuego para abrigar a las personas?",
          "¿Qué enseñanzas prácticas brindó a los tehuelches para fabricar herramientas y vestidos?"
        ]
      },
      {
        "kind": "creo",
        "title": "El cerro Chaltén humeante",
        "steps": [
          "Imaginá la cumbre del cerro con la nube blanca que recuerda el fuego protector de Elal."
        ],
        "draw": "Dibujá la cima puntiaguda del Chaltén con su nube en la punta y chispas de luz brillante."
      },
      {
        "kind": "investigo",
        "title": "El abrigo del guanaco",
        "steps": [
          "Averigüen con la familia qué es un quillango y cómo se confeccionaba con cueros de guanaco.",
          "Conversen sobre cómo se protegían del frío extremo los antiguos habitantes de Santa Cruz."
        ]
      }
    ],
    "selfCheck": [
      "Puedo contar qué obsequio fundamental brindó Elal a los primeros pobladores patagónicos.",
      "Puedo reconocer la silueta del cerro Chaltén en los relatos tradicionales.",
      "Puedo explicar qué es un quillango y para qué servía en la meseta."
    ]
  }],

  "11118": [{
    "title": "La tranquilidad de nuestro hogar",
    "purpose": "Apreciar la sencillez, la paz de la vida cotidiana y la armonía con el entorno en que vivimos.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Dos maneras de vivir",
        "steps": [
          "¿Qué comida modesta pero tranquila compartieron en la cueva del campo junto al trigal?",
          "¿Qué grandes sobresaltos sufrieron cuando intentaron comer en la casa de la ciudad?",
          "¿Por qué el ratón de campo prefirió sus raíces y agua fresca antes que tortas con sustos?"
        ]
      },
      {
        "kind": "creo",
        "title": "La cueva junto al trigal",
        "steps": [
          "Imaginá el refugio sereno del campo donde no hay gatos al acecho ni ruidos molestos."
        ],
        "draw": "Dibujá la cuevita del ratón con sus espigas de trigo y su jarrito de agua fresca."
      },
      {
        "kind": "juego",
        "title": "El gato dormilón",
        "steps": [
          "Un jugador hace de gato y se sienta de espaldas en una silla con los ojos cerrados.",
          "Los ratones deben caminar en silencio extremo hasta tocar la silla sin ser escuchados.",
          "Si el gato escucha un ruido y dice '¡Miau!', los ratones vuelven a empezar."
        ]
      }
    ],
    "selfCheck": [
      "Puedo explicar por qué el ratón de campo decidió regresar a su hogar en la naturaleza.",
      "Puedo comparar la tranquilidad del campo con el bullicio de la ciudad.",
      "Puedo valorar los momentos de paz y serenidad en mi propia casa."
    ]
  }],

  "11119": [{
    "title": "La planta que trepó a las nubes",
    "purpose": "Despertar la imaginación fantástica y conversar sobre el ingenio para superar la escasez económica.",
    "blocks": [
      {
        "kind": "converso",
        "title": "Aventuras en el castillo del cielo",
        "steps": [
          "¿Por qué la mamá de Juan se enojó cuando él volvió del mercado con cinco porotos?",
          "¿Qué descubrió Juan cuando trepó por la enredadera gigante hasta las nubes?",
          "¿Cómo lograron Juan y su mamá vivir tranquilos y sin necesidades a partir de ese día?"
        ]
      },
      {
        "kind": "creo",
        "title": "La enredadera gigante",
        "steps": [
          "Imaginá una planta verde que crece tan alto que atraviesa el cielo azul."
        ],
        "draw": "Dibujá la planta trepando desde la ventana de la casita hasta las nubes esponjosas."
      },
      {
        "kind": "hacer",
        "title": "Semillitas en casa",
        "steps": [
          "Colocá un poco de algodón húmedo dentro de un vaso transparente o frasco de vidrio.",
          "Apoyá dos porotos secos entre el algodón y la pared del recipiente.",
          "Ubicá el vaso cerca de una ventana y observá cómo brotan las raíces en los próximos días."
        ]
      }
    ],
    "selfCheck": [
      "Puedo relatar la subida de Juan por la gran planta mágica.",
      "Puedo preparar un germinador sencillo con algodón y semillas en casa.",
      "Puedo dibujar el castillo que flotaba arriba de las nubes."
    ]
  }],

  # =========================================================================
  # 2.º GRADO (21101 - 21119)
  # =========================================================================
  "21101": [{
    "title": "Mensajes y advertencias en el bosque",
    "purpose": "Afianzar la escritura de oraciones breves y reflexionar sobre la importancia de atender los consejos de cuidado.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Un mensaje urgente para Caperucita",
        "steps": [
          "Escribí una nota breve para entregarle a Caperucita antes de que ingrese a la senda del bosque.",
          "Recordale por qué debe mantenerse sobre el camino y qué peligro encierra hablar con desconocidos."
        ],
        "lines": 4
      },
      {
        "kind": "investigo",
        "title": "El significado de atajo",
        "steps": [
          "Buscá en el diccionario o consultá con un adulto qué significa la palabra 'atajo'.",
          "Escribí una oración usando esa palabra para explicar cómo el lobo llegó antes a la casa."
        ],
        "lines": 2
      },
      {
        "kind": "converso",
        "title": "El final sin violencia",
        "steps": [
          "Conversen sobre cómo en nuestra versión el lobo huyó asustado sin que nadie saliera lastimado.",
          "¿De qué otras maneras inteligentes podemos resolver conflictos sin recurrir a la agresión?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un mensaje con consejos claros de seguridad para un personaje.",
      "Puedo explicar con mis palabras el significado del término 'atajo'.",
      "Puedo reflexionar sobre resoluciones pacíficas en los relatos de ficción."
    ]
  }],

  "21102": [{
    "title": "Crónica del origen patagónico",
    "purpose": "Desarrollar la escritura descriptiva y profundizar en la mitología y geografía de Santa Cruz.",
    "blocks": [
      {
        "kind": "creo",
        "title": "El orden de la creación",
        "steps": [
          "Escribí los cuatro elementos creados por Kóoch en el orden en que ocurrieron en la leyenda.",
          "Explicá brevemente qué provocó el llanto y qué provocó el suspiro del creador."
        ],
        "lines": 4
      },
      {
        "kind": "investigo",
        "title": "El viento en nuestra meseta",
        "steps": [
          "Preguntale a un familiar cómo influyen las ráfagas de viento en las actividades cotidianas de Santa Cruz.",
          "Anotá dos precauciones que se toman en casa cuando hay alerta por vientos fuertes."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "Relatos de los pueblos originarios",
        "steps": [
          "Conversen sobre por qué las comunidades ancestrales explicaban la naturaleza mediante relatos poéticos.",
          "¿Qué cosas de nuestro paisaje patagónico nos inspiran admiración y asombro hoy en día?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo enumerar por escrito los elementos que dieron origen al mundo según la leyenda.",
      "Puedo registrar testimonios de mi familia sobre las características de nuestro clima.",
      "Puedo valorar las leyendas tehuelches como parte de nuestra identidad regional."
    ]
  }],

  "21103": [{
    "title": "El pacto de honor en la selva",
    "purpose": "Practicar la redacción de diálogos y reflexionar sobre la gratitud y la superación de prejuicios.",
    "blocks": [
      {
        "kind": "creo",
        "title": "El diálogo del agradecimiento",
        "steps": [
          "Escribí las palabras que intercambiaron el león y el ratoncito al terminar la hazaña.",
          "Hacé que el león reconozca que se equivocó al burlarse del tamaño de su amigo."
        ],
        "lines": 4
      },
      {
        "kind": "converso",
        "title": "Solidaridad sin medidas",
        "steps": [
          "Recuerden alguna ocasión en que alguien menor o de menor fuerza ayudó a resolver un problema en casa.",
          "¿Por qué es fundamental no subestimar las capacidades de ningún integrante de la familia o del aula?"
        ]
      },
      {
        "kind": "juego",
        "title": "El desafío de los nudos",
        "steps": [
          "Aten tres nudos en una soga o cordón de lana.",
          "Utilicen únicamente la punta de los dedos para desatarlos con paciencia imitando al ratoncito.",
          "Comprueben cómo la destreza y la calma valen más que la fuerza bruta."
        ]
      }
    ],
    "selfCheck": [
      "Puedo escribir oraciones que expresen gratitud sincera entre dos personajes.",
      "Puedo fundamentar por qué no debemos juzgar a los demás por su apariencia o tamaño.",
      "Puedo ejercitar la paciencia al resolver una actividad manual."
    ]
  }],

  "21104": [{
    "title": "El vuelo del nuevo cisne",
    "purpose": "Estimular la expresión de sentimientos personales, la empatía y la escritura de cartas con sentido formativo.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Carta a los animales del corral",
        "steps": [
          "Escribí una carta breve firmada por el cisne dirigida a los patos que se burlaban de él.",
          "Contales qué descubriste sobre tu verdadera identidad y qué consejo les dejás sobre el respeto."
        ],
        "lines": 4
      },
      {
        "kind": "investigo",
        "title": "Aves acuáticas patagónicas",
        "steps": [
          "Buscá información sobre el cisne de cuello negro que habita en las lagunas de nuestra provincia.",
          "Anotá dos características físicas que lo distinguen de otras aves de la región."
        ],
        "lines": 2
      },
      {
        "kind": "converso",
        "title": "Construir un ambiente cariñoso",
        "steps": [
          "Conversen sobre qué actitudes en el recreo o en casa hacen sentir bienvenidas a todas las personas.",
          "Escriban una frase que sirva de lema contra las burlas en la escuela."
        ],
        "lines": 2
      }
    ],
    "selfCheck": [
      "Puedo expresar reflexiones sobre el respeto y la autoestima en un texto epistolar.",
      "Puedo registrar datos sobre las aves autóctonas de los humedales patagónicos.",
      "Puedo proponer acuerdos para evitar que otros se sientan rechazados o tristes."
    ]
  }],

  "21105": [{
    "title": "Ficha técnica del constructor alado",
    "purpose": "Aprender a organizar información científica y literaria mediante esquemas y cuadros comparativos.",
    "blocks": [
      {
        "kind": "hacer",
        "title": "Cuadro informativo del hornero",
        "steps": [
          "Completá el cuadro con los datos del ave según la leyenda y lo que aprendiste en ciencias."
        ],
        "table": {
          "cols": ["Pregunta", "Respuesta sobre el hornero"],
          "rows": 4
        }
      },
      {
        "kind": "creo",
        "title": "Manual breve del albañil con plumas",
        "steps": [
          "Escribí tres pasos ordenados explicando cómo junta el barro, cómo lo mezcla y cómo levanta su nido."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "La perseverancia en el trabajo",
        "steps": [
          "Conversen sobre por qué el hornero nunca abandona su nido a medio construir aunque sople el viento.",
          "¿Qué tareas de la escuela requieren que trabajemos con esa misma paciencia día a día?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo completar una tabla estructurada con datos precisos sobre una especie.",
      "Puedo redactar instrucciones secuenciales sobre un proceso de construcción natural.",
      "Puedo valorar la constancia y el trabajo paciente en mis propias actividades."
    ]
  }],

  "21106": [{
    "title": "Detectives de halagos engañosos",
    "purpose": "Desarrollar la capacidad de discernir entre elogios sinceros e interesados a través de la producción escrita.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Consejos para no caer en la trampa",
        "steps": [
          "Escribí una lista de tres advertencias útiles para que las aves del bosque no sean engañadas por zorros astutos.",
          "Explicá qué precauciones deben tomar antes de abrir el pico cuando tienen comida."
        ],
        "lines": 4
      },
      {
        "kind": "investigo",
        "title": "El vocabulario de Esopo",
        "steps": [
          "Releé la palabra 'adularte' que aparece en la última escena de la fábula.",
          "Escribí una definición con tus palabras y agregá un ejemplo de una situación real."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "El valor de la sinceridad",
        "steps": [
          "Conversen en familia sobre lo valioso que es decir la verdad sin fingir para obtener premios.",
          "¿Cómo nos damos cuenta de que un amigo nos felicita con alegría auténtica?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo formular recomendaciones preventivas para personajes de una fábula.",
      "Puedo explicar el significado de la palabra 'adular' en el contexto del relato.",
      "Puedo argumentar a favor de la honestidad en las relaciones de amistad."
    ]
  }],

  "21107": [{
    "title": "La cartelera cultural de Bremen",
    "purpose": "Promover la escritura creativa con formato de folleto publicitario y valorar los talentos comunitarios.",
    "blocks": [
      {
        "kind": "creo",
        "title": "El afiche del gran recital",
        "steps": [
          "Diseñá y escribí el cartel que anuncia el concierto de los cuatro músicos en la casita del bosque.",
          "Indicá el nombre de los cuatro integrantes, qué instrumentos tocan y el horario de la función."
        ],
        "lines": 4
      },
      {
        "kind": "hacer",
        "title": "La partitura de los sonidos",
        "steps": [
          "Completá el cuadro relacionando a cada animal con su sonido y la función que cumplió al asustar a los ladrones."
        ],
        "table": {
          "cols": ["Animal", "Sonido que emite", "Posición en la torre"],
          "rows": 4
        }
      },
      {
        "kind": "converso",
        "title": "Nadie sobra en el equipo",
        "steps": [
          "Conversen sobre por qué los dueños anteriores querían deshacerse de los animales por ser viejos.",
          "¿Por qué es indispensable cuidar y escuchar la experiencia de nuestros abuelos y mayores?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un texto breve de difusión con datos de horario, lugar y participantes.",
      "Puedo registrar y clasificar información en una tabla de doble entrada.",
      "Puedo fundamentar la importancia del respeto hacia las personas de la tercera edad."
    ]
  }],

  "21108": [{
    "title": "Guía de tradiciones patagónicas",
    "purpose": "Vincular la narración oral tehuelche con las costumbres gastronómicas y geográficas de Santa Cruz.",
    "blocks": [
      {
        "kind": "investigo",
        "title": "Secretos del calafate",
        "steps": [
          "Preguntale a un adulto cómo se recolectan los frutos del calafate cuidando las espinas del arbusto.",
          "Anotá qué productos tradicionales se elaboran con sus bayas en nuestra provincia."
        ],
        "lines": 3
      },
      {
        "kind": "creo",
        "title": "El cartel del viajero",
        "steps": [
          "Escribí un texto de bienvenida para quienes llegan a la terminal o aeropuerto de nuestra localidad.",
          "Contales la leyenda de Koonek y por qué el sabor dulce del fruto invita a volver siempre."
        ],
        "lines": 4
      },
      {
        "kind": "converso",
        "title": "Cuidar la flora autóctona",
        "steps": [
          "Conversen sobre la importancia de proteger las plantas nativas de la meseta y los ríos.",
          "¿Qué cuidados debemos tener al salir de campamento para no dañar los arbustos silvestres?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo describir las características y usos gastronómicos del fruto del calafate.",
      "Puedo redactar un texto turístico cálido que transmita una leyenda tradicional.",
      "Puedo reflexionar sobre la preservación de la vegetación típica de mi provincia."
    ]
  }],

  "21109": [{
    "title": "El acuerdo de las cuatro estaciones",
    "purpose": "Aprender a organizar planes de trabajo equilibrados que combinen responsabilidad, previsión y descanso.",
    "blocks": [
      {
        "kind": "creo",
        "title": "El pacto entre la cigarra y la hormiga",
        "steps": [
          "Escribí el contrato de convivencia que firmaron ambos insectos para el verano siguiente.",
          "Detallá cuántas horas dedicarán a juntar semillas y en qué momentos tocarán la guitarra para alegrar el trabajo."
        ],
        "lines": 4
      },
      {
        "kind": "hacer",
        "title": "Distribución del tiempo en casa",
        "steps": [
          "Armá un plan semanal con momentos para estudiar, para colaborar en el hogar y para jugar."
        ],
        "table": {
          "cols": ["Momento del día", "Tarea o deber", "Tiempo de juego o descanso"],
          "rows": 3
        }
      },
      {
        "kind": "converso",
        "title": "La generosidad frente al error",
        "steps": [
          "Conversen sobre cómo actuó la hormiga al no dejar a la cigarra afuera en la nieve.",
          "¿Por qué dar segundas oportunidades ayuda a que las personas aprendan y cambien?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un acuerdo con compromisos claros de trabajo y recreación.",
      "Puedo planificar el uso del tiempo semanal de manera armónica.",
      "Puedo valorar la importancia de perdonar y brindar apoyo a quien se equivocó."
    ]
  }],

  "21110": [{
    "title": "El periódico del pueblo y las nubes",
    "purpose": "Ejercitar la estructura básica de la noticia periodística y el análisis de motivaciones de los personajes.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Noticia extraordinaria",
        "steps": [
          "Escribí una noticia breve para el diario local sobre la planta gigante que apareció en el jardín de Juan.",
          "Inventá un titular atractivo y contá qué sucedió cuando Juan bajó con la gallina especial."
        ],
        "lines": 5
      },
      {
        "kind": "converso",
        "title": "¿Decisión acertada o imprudente?",
        "steps": [
          "Debatan en familia: ¿estuvo bien que Juan cambiara una vaca lechera por porotos que parecían comunes?",
          "¿Qué riesgos asumió Juan al trepar hasta el castillo del gigante en las nubes?"
        ]
      },
      {
        "kind": "investigo",
        "title": "El hacha y las herramientas",
        "steps": [
          "Anotá qué herramienta usó Juan para cortar la planta y qué precauciones deben tener los adultos al usarla.",
          "Escribí dos herramientas de trabajo rural que conozcas."
        ],
        "lines": 2
      }
    ],
    "selfCheck": [
      "Puedo escribir una noticia breve con titular y desarrollo de los hechos principales.",
      "Puedo fundamentar opiniones diversas sobre las decisiones de un personaje de cuento.",
      "Puedo nombrar herramientas rurales y las medidas de seguridad para su uso."
    ]
  }],

  "21111": [{
    "title": "El diploma de la amistad guaraní",
    "purpose": "Profundizar en la redacción de reconocimientos y valorar los dones de la naturaleza compartida.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Carta de gratitud del anciano",
        "steps": [
          "Escribí la respuesta del anciano cazador al despertar y descubrir la planta de yerba mate.",
          "Agradecé a Yasí y a Araí por el regalo y prometé convidar la infusión a todos los vecinos."
        ],
        "lines": 4
      },
      {
        "kind": "hacer",
        "title": "Vocabulario de la selva misionera",
        "steps": [
          "Completá el cuadro con el significado de tres palabras de origen guaraní que aparecen en el relato."
        ],
        "table": {
          "cols": ["Palabra", "¿Qué significa en la leyenda?"],
          "rows": 3
        }
      },
      {
        "kind": "converso",
        "title": "La hospitalidad cotidiana",
        "steps": [
          "Conversen sobre cómo recibimos en casa a las visitas que llegan de viaje o a los vecinos.",
          "¿Por qué compartir un mate o un vaso de agua es una señal de respeto y afecto?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo escribir un texto de gratitud con emoción y claridad de ideas.",
      "Puedo registrar palabras tradicionales y sus significados contextuales.",
      "Puedo explicar el sentido social de la hospitalidad y la generosidad."
    ]
  }],

  "21112": [{
    "title": "El tribunal de la honestidad",
    "purpose": "Reflexionar sobre el impacto de la mentira en la convivencia social y redactar cartas de desagravio.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Carta de desagravio a la comunidad",
        "steps": [
          "Escribí la carta de compromiso que el pastorcito presentó ante los pobladores de la comarca.",
          "Pedí disculpas por haberlos hecho correr en vano y prometé cumplir con fidelidad tu tarea de vigía."
        ],
        "lines": 5
      },
      {
        "kind": "converso",
        "title": "La confianza rota",
        "steps": [
          "Conversen sobre por qué cuesta tanto recuperar la credibilidad cuando engañamos varias veces.",
          "¿Qué acciones cotidianas nos ayudan a demostrar que somos personas confiables en quienes apoyarse?"
        ]
      },
      {
        "kind": "hacer",
        "title": "Causas y consecuencias del engaño",
        "steps": [
          "Completá el cuadro relacionando la mentira con sus efectos sobre los vecinos y sobre el propio pastor."
        ],
        "table": {
          "cols": ["Momento", "Lo que dijo el pastor", "Consecuencia real"],
          "rows": 3
        }
      }
    ],
    "selfCheck": [
      "Puedo redactar una carta de disculpas con argumentos serios de enmienda.",
      "Puedo identificar la relación directa entre engañar y perder el apoyo de los demás.",
      "Puedo completar un cuadro de causa y efecto basado en la fábula."
    ]
  }],

  "21113": [{
    "title": "El desfile de la sinceridad",
    "purpose": "Analizar la presión de grupo, la vanidad de los gobernantes y ejercitar la descripción de vestimentas reales.",
    "blocks": [
      {
        "kind": "creo",
        "title": "La confesión del emperador",
        "steps": [
          "Escribí lo que declaró el emperador al regresar avergonzado al palacio tras el grito del niño.",
          "Reconocé que por vanidad te negaste a admitir que los telares estaban completamente vacíos."
        ],
        "lines": 5
      },
      {
        "kind": "investigo",
        "title": "El telar tradicional",
        "steps": [
          "Averiguá cómo funciona un telar artesanal de madera y con qué fibras naturales se tejen mantas.",
          "Anotá dos materiales esenciales para tejer una tela abrigada de verdad."
        ],
        "lines": 2
      },
      {
        "kind": "converso",
        "title": "La valentía de decir la verdad",
        "steps": [
          "Conversen sobre por qué todos los adultos del pueblo preferían mentir antes que admitir la realidad.",
          "¿Por qué la voz del nene fue la única auténtica y valiente en medio de la multitud?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo escribir un parlamento reflexivo reconociendo un error propio de conducta.",
      "Puedo registrar datos sobre el funcionamiento de los telares artesanales.",
      "Puedo valorar la valentía moral de sostener la verdad frente a las presiones del entorno."
    ]
  }],

  "21114": [{
    "title": "Crónica turística de Purmamarca",
    "purpose": "Conocer la geografía de la Quebrada de Humahuaca y elaborar folletos informativos sobre patrimonio natural.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Texto para la guía de viajes",
        "steps": [
          "Escribí un texto descriptivo invitando a familias de todo el país a visitar Jujuy y su cerro famoso.",
          "Explicá cómo la leyenda relata el regalo nocturno de los niños del pueblo a su comunidad."
        ],
        "lines": 5
      },
      {
        "kind": "hacer",
        "title": "Los estratos del cerro",
        "steps": [
          "Completá el cuadro relacionando cuatro colores del cerro con minerales o elementos de la tierra."
        ],
        "table": {
          "cols": ["Color del estrato", "Elemento natural sugerido"],
          "rows": 4
        }
      },
      {
        "kind": "converso",
        "title": "Cuidar las bellezas de nuestro país",
        "steps": [
          "Conversen sobre qué normas debemos respetar cuando visitamos monumentos naturales y montañas protegidas.",
          "¿Por qué es indispensable no dejar residuos y respetar los senderos señalizados?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo componer un texto informativo con intención turística y descriptiva.",
      "Puedo relacionar tonalidades del relieve con componentes minerales de la naturaleza.",
      "Puedo proponer medidas de protección y cuidado para el patrimonio ambiental."
    ]
  }],

  "21115": [{
    "title": "El balance de los dos primos",
    "purpose": "Aprender a elaborar textos comparativos y argumentar sobre la calidad de vida y la tranquilidad interior.",
    "blocks": [
      {
        "kind": "hacer",
        "title": "Cuadro de contrastes",
        "steps": [
          "Completá la tabla comparando la vida cotidiana en el trigal con la vida en la residencia de la ciudad."
        ],
        "table": {
          "cols": ["Aspecto", "Ratón de campo", "Ratón de ciudad"],
          "rows": 4
        }
      },
      {
        "kind": "creo",
        "title": "La carta de agradecimiento y partida",
        "steps": [
          "Escribí la carta que el ratón campesino le envía a su primo citadino una vez instalado en su cueva.",
          "Explicá con razones sólidas por qué la paz del espíritu vale más que los manjares peligrosos."
        ],
        "lines": 4
      },
      {
        "kind": "converso",
        "title": "Nuestras prioridades",
        "steps": [
          "Conversen en familia sobre qué cosas materiales nos atraen pero a veces nos quitan la serenidad.",
          "¿Qué momentos simples de la vida familiar nos llenan de felicidad verdadera?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo completar una tabla comparativa exhaustiva entre dos entornos diferentes.",
      "Puedo argumentar por escrito a favor de la tranquilidad como valor supremo de vida.",
      "Puedo distinguir entre lujos superficiales y bienestar auténtico."
    ]
  }],

  "21116": [{
    "title": "Entrevista a orillas del río Paraná",
    "purpose": "Explorar el universo literario de Horacio Quiroga y ejercitar la escritura de entrevistas ficticias.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Reportaje a un flamenco en el agua",
        "steps": [
          "Escribí dos preguntas que le formularías a un flamenco y las respuestas que daría desde el río.",
          "Preguntale sobre el ardor en sus patas y qué le diría hoy al tatú bromista si lo encontrara."
        ],
        "lines": 5
      },
      {
        "kind": "investigo",
        "title": "Cuentos de la selva",
        "steps": [
          "Averiguá qué otros cuentos famosos integran el libro 'Cuentos de la selva' de Horacio Quiroga.",
          "Anotá los títulos de al menos dos relatos de esa célebre obra."
        ],
        "lines": 2
      },
      {
        "kind": "converso",
        "title": "La vanidad y sus trampas",
        "steps": [
          "Conversen sobre cómo la obsesión de los flamencos por deslumbrar en el baile los cegó por completo.",
          "¿Por qué es peligroso aceptar cosas dudosas con tal de lucir una moda llamativa?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar una entrevista imaginaria manteniendo coherencia con el texto narrativo.",
      "Puedo identificar obras representativas de la literatura clásica rioplatense.",
      "Puedo reflexionar sobre los riesgos de actuar por pura vanidad e imprudencia."
    ]
  }],

  "21117": [{
    "title": "Diario del gran viaje al Chaltén",
    "purpose": "Valorar la épica de la mitología tehuelche y ejercitar la escritura narrativa en primera persona.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Página del diario de Elal",
        "steps": [
          "Escribí un relato en primera persona como si fueras Elal al llegar a la cima del cerro nevado.",
          "Describí la alegría de golpear las dos piedras, ver brotar las chispas y regalarle calor a tu pueblo."
        ],
        "lines": 5
      },
      {
        "kind": "investigo",
        "title": "Toponimia de Santa Cruz",
        "steps": [
          "Buscá en libros o mapas escolares el significado originario de la palabra 'Chaltén'.",
          "Anotá qué nombre le pusieron los colonizadores posteriores (Fitz Roy) y por qué se mantiene su nombre nativo."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "Héroes protectores de la Patagonia",
        "steps": [
          "Conversen sobre cómo Elal cuidó a su pueblo enseñándole a cazar, abrigarse y respetar la tierra.",
          "¿Qué enseñanzas de los pueblos originarios debemos recuperar para cuidar nuestro medio ambiente?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un texto en primera persona con tono heroico y emotivo.",
      "Puedo explicar el origen del nombre tradicional del cerro Chaltén en Santa Cruz.",
      "Puedo valorar el legado cultural y ecológico de los pueblos aonikenk."
    ]
  }],

  "21118": [{
    "title": "El manifiesto contra la prisa",
    "purpose": "Desarrollar la capacidad de argumentar sobre la paciencia, el cuidado de los seres vivos y la codicia.",
    "blocks": [
      {
        "kind": "creo",
        "title": "La carta de la gallina prófuga",
        "steps": [
          "Escribí la carta que la gallina le envió al granjero desde su nuevo nido protegido en el bosque.",
          "Explicale que la ambición desesperada destruyó la dicha cotidiana que compartían en la granja."
        ],
        "lines": 5
      },
      {
        "kind": "hacer",
        "title": "Causas y pérdidas de la ambición",
        "steps": [
          "Completá el esquema indicando qué tenía el granjero al principio y qué le quedó al final por su apuro."
        ],
        "table": {
          "cols": ["Momento de la historia", "Situación material", "Estado emocional del granjero"],
          "rows": 2
        }
      },
      {
        "kind": "converso",
        "title": "El valor del proceso paulatino",
        "steps": [
          "Conversen en familia sobre por qué aprender a leer, andar en bicicleta o ahorrar dinero requiere tiempo.",
          "¿Qué sucede cuando queremos que las cosas maduren de golpe sin esperar los plazos naturales?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo componer un reclamo escrito argumentando sobre el respeto a los tiempos naturales.",
      "Puedo contrastar en una tabla la prosperidad paciente frente a la ruina de la codicia.",
      "Puedo dar ejemplos concretos de la vida diaria donde la prisa arruina buenos proyectos."
    ]
  }],

  "21119": [{
    "title": "Homenaje a la lealtad en el monte",
    "purpose": "Apreciar la narrativa solidaria de Quiroga y componer discursos breves de reconocimiento ciudadano.",
    "blocks": [
      {
        "kind": "creo",
        "title": "La placa de agradecimiento",
        "steps": [
          "Escribí el texto que el hombre colocó en el recinto de la tortuga gigante en Buenos Aires.",
          "Destacá la proeza heroica de haber caminado días y noches sin rendirse para salvar su vida."
        ],
        "lines": 5
      },
      {
        "kind": "hacer",
        "title": "La cadena de favores",
        "steps": [
          "Completá el cuadro comparando la curación que hizo el hombre con el auxilio que brindó la tortuga."
        ],
        "table": {
          "cols": ["Quién ayudó", "A quién salvó", "Qué sacrificio realizó"],
          "rows": 2
        }
      },
      {
        "kind": "converso",
        "title": "La amistad que trasciende las palabras",
        "steps": [
          "Conversen sobre cómo dos seres de especies tan distintas formaron un vínculo indestructible.",
          "¿Qué actos diarios en nuestra familia demuestran que cuidamos a quienes nos cuidan?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un texto conmemorativo formal reconociendo virtudes morales.",
      "Puedo sintetizar en un cuadro la reciprocidad solidaria entre dos personajes.",
      "Puedo reflexionar sobre la importancia del cuidado afectuoso en los momentos de vulnerabilidad."
    ]
  }],

  # =========================================================================
  # 3.º GRADO (31101 - 31106)
  # =========================================================================
  "31101": [{
    "title": "Diario íntimo de una travesía heroica",
    "purpose": "Ejercitar la narrativa en primera persona adoptando la voz de un personaje clásico y analizar la lealtad ética.",
    "blocks": [
      {
        "kind": "creo",
        "title": "La bitácora de la tortuga gigante",
        "steps": [
          "Escribí una página del diario personal de la tortuga durante la noche más agotadora de su marcha.",
          "Describí la fatiga en tus extremidades, el peso del enfermo sobre tu caparazón y la convicción interior que te impidió claudicar."
        ],
        "lines": 6
      },
      {
        "kind": "investigo",
        "title": "Horacio Quiroga y la selva misionera",
        "steps": [
          "Investigá datos biográficos sobre Horacio Quiroga y su experiencia pionera viviendo en la selva de Misiones.",
          "Anotá dos razones por las cuales ambientaba sus relatos infantiles en la naturaleza agreste."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "El deber de reciprocidad",
        "steps": [
          "Debatan en familia: ¿por qué la tortuga sintió una deuda moral irrevocable hacia el hombre?",
          "¿Qué compromisos éticos asumimos cuando alguien nos ayuda desinteresadamente en una crisis?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo construir una voz narrativa en primera persona transmitiendo reflexiones profundas de un personaje.",
      "Puedo recopilar y sintetizar datos biográficos del autor y su entorno literario.",
      "Puedo argumentar en un debate familiar sobre el principio ético de la reciprocidad solidaria."
    ]
  }],

  "31102": [{
    "title": "Crónica periodística del orden patagónico",
    "purpose": "Aprender a redactar una noticia periodística completa y analizar la función cosmogónica de las leyendas nativas.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Noticia de la costa patagónica",
        "steps": [
          "Redactá una noticia completa para un periódico regional informando el traslado definitivo de Góos hacia el mar.",
          "Incluí un titular llamativo, volanta, copete y un párrafo narrando la hazaña de Elal al transformarse en tábano."
        ],
        "lines": 6
      },
      {
        "kind": "hacer",
        "title": "Contraste de fuerzas y propósitos",
        "steps": [
          "Completá el cuadro analizando las características antitéticas entre la ballena y el héroe tehuelche."
        ],
        "table": {
          "cols": ["Criterio", "Ballena Góos", "Héroe Elal"],
          "rows": 4
        }
      },
      {
        "kind": "converso",
        "title": "El equilibrio ecológico en el mito",
        "steps": [
          "Conversen sobre cómo la leyenda explica la armonización territorial entre la fauna terrestre y la marina.",
          "¿Por qué el héroe no aniquila a la fiera sino que le asigna un medio ambiente propicio para su desarrollo?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo elaborar un texto informativo con la estructura formal de una crónica periodística.",
      "Puedo establecer comparaciones conceptuales sistemáticas en una tabla analítica.",
      "Puedo interpretar la función mitológica de ordenamiento ambiental en los relatos orales."
    ]
  }],

  "31103": [{
    "title": "Reescritura crítica de la ambición",
    "purpose": "Explorar finales alternativos fundamentados éticamente y profundizar en la estructura de la fábula moral.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Un final con aprendizaje y reconciliación",
        "steps": [
          "Reescribí el desenlace de la fábula imaginando que el granjero recapacita a tiempo antes de que la gallina huya.",
          "Relatá el diálogo donde el hombre reconoce su insensatez y establece una relación respetuosa con el animal."
        ],
        "lines": 6
      },
      {
        "kind": "converso",
        "title": "La sociedad de la inmediatez",
        "steps": [
          "Debatan en familia sobre el mensaje: 'por querer todo de golpe, había perdido lo que tenía'.",
          "¿Qué consecuencias perjudiciales produce en la actualidad la impaciencia por obtener recompensas sin esfuerzo sostenido?"
        ]
      },
      {
        "kind": "investigo",
        "title": "El legado de Esopo",
        "steps": [
          "Averiguá en qué consistía el propósito didáctico de las fábulas en la Grecia antigua.",
          "Anotá dos características estilísticas que diferencian una fábula moral de una novela de aventuras."
        ],
        "lines": 3
      }
    ],
    "selfCheck": [
      "Puedo reescribir creativamente el desenlace de una obra clásica manteniendo verosimilitud.",
      "Puedo reflexionar críticamente sobre los perjuicios individuales y sociales de la codicia.",
      "Puedo identificar los rasgos discursivos que definen al género fabulístico universal."
    ]
  }],

  "31104": [{
    "title": "Alegato y naturaleza en el trópico",
    "purpose": "Abordar la prosa dramática y contraponer explicaciones biológicas con recreaciones literarias de autor.",
    "blocks": [
      {
        "kind": "creo",
        "title": "El alegato del tatú ante la selva",
        "steps": [
          "Escribí el discurso de defensa del tatú al ser convocado por los animales para explicar su pesada broma.",
          "Hacé que intente justificar su trampa o bien que exprese un arrepentimiento genuino por el trágico destino de los flamencos."
        ],
        "lines": 6
      },
      {
        "kind": "investigo",
        "title": "Ciencia versus fantasía literaria",
        "steps": [
          "Investigá por qué la ornitología explica que los flamencos tienen patas y plumas rojizas (pigmentos carotenoides en su dieta).",
          "Escribí una comparación breve entre la explicación científica y la ficción poética de Horacio Quiroga."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "La alienación por las apariencias",
        "steps": [
          "Conversen sobre cómo el anhelo de reconocimiento social condujo a los flamencos a vestir atuendos criminales.",
          "¿En qué situaciones de la vida moderna las personas incurren en conductas desmedidas con tal de aparentar prestigio?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un texto argumentativo con voz propia y fundamentación de actos polémicos.",
      "Puedo cotejar una teoría biológica verificada con una narración ficcional maravillosa.",
      "Puedo analizar con madurez el impacto negativo de la vanidad en el juicio racional."
    ]
  }],

  "31105": [{
    "title": "El puente eterno de la memoria",
    "purpose": "Desarrollar la sensibilidad poética y comprender el vínculo entre la toponimia y los mitos fluviales del litoral.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Prosa lírica sobre el arcoíris",
        "steps": [
          "Escribí un texto de prosa poética describiendo el instante en que el sol ilumina el rocío de los saltos y forma el arcoíris.",
          "Evocá la mirada inmóvil de Tarobá desde la palmera hacia la roca de Naipí en medio de la corriente infinita."
        ],
        "lines": 6
      },
      {
        "kind": "investigo",
        "title": "Patrimonio de la Humanidad: Iguazú",
        "steps": [
          "Buscá datos sobre el Parque Nacional Iguazú en Misiones: fecha de creación, flora selvática y volumen de agua de sus caídas.",
          "Anotá dos razones que fundamentan su condición de maravilla natural del mundo contemporáneo."
        ],
        "lines": 3
      },
      {
        "kind": "converso",
        "title": "El heroísmo trágico en la tradición oral",
        "steps": [
          "Conversen sobre por qué muchas leyendas de amor concluyen con transformaciones geológicas o botánicas.",
          "¿Cómo logra el arte popular convertir una derrota física en una victoria espiritual inmortal?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo producir textos literarios con recursos poéticos, ritmo y densidad expresiva.",
      "Puedo registrar información institucional y geográfica sobre parques nacionales argentinos.",
      "Puedo interpretar el sentido trascendente de las metamorfosis míticas en el folclore guaraní."
    ]
  }],

  "31106": [{
    "title": "Ensayo sobre la serenidad y la opulencia",
    "purpose": "Aprender a redactar un texto argumentativo de opinión fundamentada confrontando estilos de vida antagónicos.",
    "blocks": [
      {
        "kind": "creo",
        "title": "Mi postura fundamentada",
        "steps": [
          "Escribí un ensayo breve de opinión tomando partido por la decisión del ratón campesino o justificando las tentaciones de la urbe.",
          "Desarrollá dos argumentos sólidos extraídos del texto y cerrá con una conclusión personal sobre qué significa vivir en paz."
        ],
        "lines": 6
      },
      {
        "kind": "hacer",
        "title": "Matriz de confrontación axiológica",
        "steps": [
          "Completá la matriz evaluando las ventajas y los costos de cada modelo de existencia."
        ],
        "table": {
          "cols": ["Dimensión", "Entorno campestre", "Entorno metropolitano"],
          "rows": 4
        }
      },
      {
        "kind": "converso",
        "title": "La serenidad como bien supremo",
        "steps": [
          "Debatan en familia sobre la clásica sentencia: 'prefiero mi comida simple y tranquila a tus tortas con sustos'.",
          "¿De qué maneras podemos preservar en nuestro hogar un clima de calma frente a las urgencias de la sociedad actual?"
        ]
      }
    ],
    "selfCheck": [
      "Puedo redactar un texto de opinión estructurado con tesis, argumentos y conclusión fundada.",
      "Puedo confeccionar una matriz comparativa profunda de costos y beneficios existenciales.",
      "Puedo sostener una argumentación reflexiva sobre las condiciones esenciales de la felicidad humana."
    ]
  }]
}
