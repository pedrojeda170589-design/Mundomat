# Voces de los cuentos

- **Motor:** [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), pesos con licencia
  **Apache 2.0** (permite uso comercial), entrenado con audio de dominio público y con
  licencias permisivas. Se usa con `kokoro-onnx` (MIT). Voz: `em_alex` (español).
- Los audios generados (`public/audio/cuentos/voz/*.mp3`) son de MundoTest26.
- Se descartó la voz argentina de Piper (`es_AR-daniela`): está afinada a partir de un modelo
  entrenado con datos de la Blizzard Challenge 2013, que **prohíben el uso comercial**.
- Prioridad en la app: grabación del docente por escena (`/audio/cuentos/<id>-<n>.mp3`) →
  voz Kokoro por oración → voz del navegador.

Para regenerar (por ejemplo, cuando cambian o se agregan textos):

```
pip install kokoro-onnx soundfile
# modelo: kokoro-v1.0.onnx y voices-v1.0.bin (releases de github.com/thewh1teagle/kokoro-onnx)
npx tsx scripts/voz/listar-oraciones.ts > /tmp/oraciones.json
python3 scripts/voz/generar_voces.py /tmp/oraciones.json <carpeta_del_modelo>
```
