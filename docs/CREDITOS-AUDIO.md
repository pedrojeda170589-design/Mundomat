# Audio de MundoTest26: origen y licencias

| Qué | Dónde | Origen | Licencia / uso comercial |
|---|---|---|---|
| Música de fondo (inicio, mapas, cuento, leyenda, fábula, festejo) | `public/audio/musica/` | Compuesta y sintetizada por código para MundoTest26 (`scripts/musica/componer.py`): sin muestras, bancos de sonido ni servicios externos | Obra propia del proyecto |
| Voz de los cuentos, leyendas y fábulas | `public/audio/cuentos/voz/` | Generada con Kokoro-82M (voz `em_alex`) usando `kokoro-onnx` (`scripts/voz/`) | Pesos Apache 2.0; `kokoro-onnx` MIT: permiten uso comercial |
| Grabaciones del docente (opcional) | `public/audio/cuentos/<id>-<n>.mp3`, `public/audio/letras/` | Voz de Pedro | Propia |

Reglas para sumar audio nuevo (Claude y Antigravity): **no** usar música, efectos ni voces de
sitios o apps con licencias poco claras (Suno gratis, CapCut, YouTube, etc.). Ante la duda,
generar por código o consultar antes.
