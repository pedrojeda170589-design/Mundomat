# Metodología de multiplicación y división en MundoTest26

Fuente: la planificación de Pedro, «3er T. 001 – Plan. Matemática» (3.º «U», 3.er trimestre 2026), clases 1 a 9.
Este documento dice cómo esa secuencia se convierte en mundos y actividades del juego, y cómo se proyecta a los otros grados.

## La secuencia de Pedro (lo que el juego respeta)

1. **La tabla pitagórica como cuadro de doble entrada.** Multiplicar es encontrar el cruce de una fila y una columna.
2. **Regularidades:**
   - dobles: la fila del 4 es el doble de la del 2, y la del 8 es el doble de la del 4;
   - la diagonal y la propiedad conmutativa (3 × 5 = 5 × 3);
   - la tabla del 5 termina en 0 o 5, la del 10 en 0;
   - en la tabla del 9, las cifras suman 9.
3. **Consolidación con problemas y juego:** arreglos rectangulares, valor unitario y el juego de cartas españolas («quien dice primero el producto se lleva las cartas»).
4. **Reparto con material concreto:** cajitas y tapitas, de a una por vez, con **sobrante** (resto).
5. **Partes de la división:** dividendo, divisor, cociente y resto, con los signos ÷ y :.
6. **La tabla pitagórica para dividir:** en la fila del divisor se busca el dividendo y se sube hasta el número de arriba de esa columna (el cociente). Por ejemplo, 18 ÷ 2 = 9 porque 2 × 9 = 18.
7. **Familias de operaciones:** con 7, 8 y 56 salen cuatro cuentas.
8. **Partición:** «de a cuántos». Por ejemplo, 35 cartas en montoncitos de 5.
9. **Detectives de problemas:** datos que no sirven y problemas de dos pasos.

## Qué hay en el juego (3.º grado)

| Mundo | Qué cambió |
|---|---|
| 5 a 7 · Tablas | La **actividad 1** es la tabla pitagórica interactiva: se toca el cruce de fila y columna. La **actividad 3** es una regularidad de la tabla (conmutativa, dobles, terminaciones del 5 y del 10, o la tabla del 9). |
| 8 · El Valle de los Repartos | Sigue la secuencia completa, con números al azar en cada vuelta (antes eran siempre los mismos). Ver la lista de abajo. |
| Torneo de las tablas (fin de semana) | Es el «torneo de multiplicaciones» de la clase 3, contra reloj. Aparece **desde 3.º grado y de julio en adelante**, cuando las tablas ya se trabajaron en clase. |

Las 10 actividades del mundo 8:

1. Cruce en la tabla pitagórica.
2. Dobles (de la fila del 2 a la del 4, o de la del 4 a la del 8).
3. Reparto exacto en 2 cajitas.
4. Reparto con sobrante.
5. Partes de la división.
6. División con la tabla pitagórica (búsqueda inversa).
7. Familia de operaciones.
8. Partición con cartas españolas.
9. El dato que no sirve (huerta de Gobernador Gregores).
10. Desafío final: encontrar el error de un reparto.

Actividades nuevas:
- `pitagorica`: una tabla de 10 × 10 que se puede tocar.
  - Modo «cruce»: se toca el casillero del producto.
  - Modo «inversa»: primero se toca el dividendo en la fila del divisor y después el número de arriba de esa columna.
- `reparto`: cajitas y tapitas. Se toca una cajita para poner una tapita, y el juego no deja «adelantar» una cajita. Al final se responde cuánto le tocó a cada una y cuánto sobró.

Las pruebas están en `scripts/test-division.ts`.

## Proyección a otros grados

- **2.º grado** (cuadro del 1 al 100, tablas del 2, 5 y 10, reparto):
  - Usar la tabla pitagórica **parcial** (filas del 2, 5 y 10) en modo «cruce».
  - Hacer el reparto con cajitas **sin resto** primero.
  - No hay división formal todavía.
- **3.º grado:** lo de arriba. A partir de julio, el torneo de las tablas.
- **4.º grado:**
  - **Multiplicación:** por dos cifras, apoyada en la tabla y en la descomposición: 24 × 6 = 20 × 6 + 4 × 6.
  - **División:** con dividendo de dos y tres cifras usando la tabla para estimar el cociente («¿cuántas veces entra?»), y la relación dividendo = divisor × cociente + resto.
  - **Problemas:** de proporcionalidad directa, con tablas de valores, que son la tabla pitagórica de una sola fila.
- **5.º a 7.º grado:**
  - **Divisibilidad:** múltiplos y divisores leídos en la tabla.
  - **Fracciones:** fracciones equivalentes, que son las filas proporcionales de la tabla. Por ejemplo, 2/3 = 4/6 = 6/9.
  - **Proporcionalidad:** constante de proporcionalidad.
  - **Factores:** mínimo común múltiplo y máximo común divisor.

Para Antigravity (AG-17 y siguientes): las actividades `pitagorica` y `reparto` ya existen y se pueden usar en los contenidos de 4.º en adelante. En los mundos de división conviene seguir este orden: material concreto → partes → tabla → familias → problemas.
