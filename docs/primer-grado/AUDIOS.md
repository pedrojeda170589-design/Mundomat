# Audios de las letras (1.º grado)

La voz del navegador lee bien palabras y oraciones, pero **no puede decir el
sonido aislado de una letra** (el fonema): si le pedís «m», dice «eme». Por eso
los fonemas tienen que estar grabados por una persona. Mientras un audio no
exista, la app usa la voz del navegador con un respaldo («mmmm, como en
mamá»), así que se pueden grabar de a poco: cada archivo que se agrega empieza
a usarse solo, sin tocar código.

## Dónde van

Carpeta del proyecto: `public/audio/letras/`
(en la compu: `C:\Users\Remberto Pedro\mundomat-git\public\audio\letras\`).

Nombres **exactamente** como en la tabla: minúscula, sin tildes, terminados en
`.mp3`. La ñ se escribe `enie`.

## 1. Obligatorios: los sonidos (21 archivos, 16 grabaciones)

Son los que usan las actividades «Escuchá el sonido: ¿qué letra suena así?» y
«¿Cuál empieza con este sonido?».

| Archivo | Cómo decirlo | Palabra para guiarte |
|---|---|---|
| `a_fonema.mp3` | «aaaa» sostenida, 1 segundo | avión |
| `e_fonema.mp3` | «eeee» | elefante |
| `i_fonema.mp3` | «iiii» | isla |
| `o_fonema.mp3` | «oooo» | oso |
| `u_fonema.mp3` | «uuuu» | uva |
| `m_fonema.mp3` | «mmmm» con la boca cerrada, sin vocal | mamá |
| `n_fonema.mp3` | «nnnn» sin vocal | nube |
| `l_fonema.mp3` | «llll» (lengua arriba), sin vocal | luna |
| `s_fonema.mp3` | «ssss» como una serpiente | sol |
| `f_fonema.mp3` | «ffff» como inflar un globo | foca |
| `j_fonema.mp3` | «jjjj» suave, desde la garganta | jirafa |
| `r_fonema.mp3` | «rrrr» vibrante fuerte (la de ratón) | ratón |
| `ll_fonema.mp3` | «shhhh» / «yyyy» como se dice en Santa Cruz | lluvia |
| `enie_fonema.mp3` | «ñññ» nasal, sostenida medio segundo | ñandú |
| `p_fonema.mp3` | «p · p · p» corta, soplando, **sin** «e» ni «a» | pato |
| `t_fonema.mp3` | «t · t · t» corta, sin vocal | tomate |
| `d_fonema.mp3` | «d · d · d» corta, sin vocal | dado |
| `c_fonema.mp3` | «k · k · k» corta, sin vocal | casa |
| `g_fonema.mp3` | «g · g · g» corta, sin vocal (la de gato) | gato |
| `b_fonema.mp3` | «b · b · b» corta, sin vocal | bote |
| `v_fonema.mp3` | **la misma grabación que la B** (copiá el archivo) | vaca |

Ahorro: la **V** es una copia de la **B** (en castellano suenan igual).

Consejos para los sonidos:

- **Sonidos que se pueden estirar** (vocales, m, n, l, s, f, j, r, ll, ñ):
  sostenerlos entre 1 y 1,5 segundos, parejo, sin terminar en vocal.
- **Sonidos explosivos** (p, t, d, c, g, b): no se pueden estirar. Decirlos
  tres veces, cortos y separados por medio segundo. El error más común es
  agregar una vocal («pe», «te»): el chico tiene que escuchar solo el golpe.

## 2. Opcionales: los nombres de las letras (29 archivos)

Los usa la actividad «¿Cómo se llama esta letra?». La voz del navegador los
dice bastante bien, así que **no son urgentes**; grabalos si querés que toda la
app tenga tu voz o si algún nombre suena raro en las tablets del aula.

| Archivo | Decir | Archivo | Decir |
|---|---|---|---|
| `a_nombre.mp3` | a | `b_nombre.mp3` | be |
| `e_nombre.mp3` | e | `v_nombre.mp3` | ve (o «uve») |
| `i_nombre.mp3` | i | `g_nombre.mp3` | ge |
| `o_nombre.mp3` | o | `enie_nombre.mp3` | eñe |
| `u_nombre.mp3` | u | `j_nombre.mp3` | jota |
| `m_nombre.mp3` | eme | `ll_nombre.mp3` | elle (doble ele) |
| `p_nombre.mp3` | pe | `h_nombre.mp3` | hache |
| `l_nombre.mp3` | ele | `ch_nombre.mp3` | che |
| `s_nombre.mp3` | ese | `y_nombre.mp3` | ye |
| `t_nombre.mp3` | te | `z_nombre.mp3` | zeta |
| `n_nombre.mp3` | ene | `q_nombre.mp3` | cu |
| `d_nombre.mp3` | de | `k_nombre.mp3` | ka |
| `r_nombre.mp3` | erre | `x_nombre.mp3` | equis |
| `c_nombre.mp3` | ce | `w_nombre.mp3` | doble ve |
| `f_nombre.mp3` | efe | | |

Usá en la app el mismo nombre que usás en el aula (por ejemplo «ve corta» o
«uve»), así los chicos no se confunden.

## Cómo grabar

1. Lugar silencioso, sin eco (un placard con ropa o el auto funcionan muy bien).
2. Celular o micrófono a unos 20 cm de la boca, siempre a la misma distancia.
3. Con el grabador del celular o con **Audacity** (gratis, en la compu):
   grabar, recortar el silencio de antes y después, `Efecto → Normalizar`
   (−1 dB) y `Archivo → Exportar → MP3`.
4. Formato: MP3, mono, 64–128 kbps, menos de 3 segundos cada uno.
5. Probá cada archivo escuchándolo antes de guardarlo con su nombre.

## Para que aparezcan en la app

Copiá los archivos a `public\audio\letras\` y subilos como siempre
(`git add public/audio`, commit y push). O pasámelos y los agrego yo.
No hace falta tenerlos todos: cada archivo nuevo reemplaza a la voz del
navegador solo para esa letra.

## Cuentos para escuchar (opcional)

Los mundos de cuentos de 1.º (11101–11119) leen cada cuento escena por escena
(en 2.º y 3.º los chicos leen y el audio queda en el botón 🔊). Si no hay
grabación, lee la voz del navegador. Para que se escuche **tu voz** (lo
ideal: los chicos te conocen), grabá una pista por escena y guardala en
`public\audio\cuentos\` con el nombre `<cuento>-<escena>.mp3`, escenas 1 a 6.
En la escena 1 decí también el título.

Textos (el orden de cada grado está en `src/lib/cuentos/recorrido.ts`):
cuentos `tres-chanchitos`, `gallinita-roja`, `ricitos-osos`, `caperucita`,
`patito-feo`, `musicos-bremen`, `juan-porotos`, `traje-emperador`,
`medias-flamencos`, `tortuga-gigante`; leyendas `leyenda-calafate`,
`leyenda-hornero`, `leyenda-yerba-mate`, `leyenda-siete-colores`,
`leyenda-koonch`, `leyenda-elal`, `leyenda-ballena`, `leyenda-iguazu`;
fábulas `liebre-tortuga`, `leon-raton`, `zorro-cuervo`, `cigarra-hormiga`,
`pastorcito-mentiroso`, `raton-campo-ciudad`, `gallina-huevos-oro`.
Por ejemplo: `leyenda-calafate-1.mp3` … `leyenda-calafate-6.mp3`.

Leé exactamente el texto de cada escena (está en
`src/lib/cuentos/catalogo.ts`), despacio y con expresión. Cada pista dura
entre 10 y 25 segundos. Mismo formato que las letras (MP3 mono).
