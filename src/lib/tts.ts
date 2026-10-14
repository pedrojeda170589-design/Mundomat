// Utilidad de lectura en voz alta (Web Speech API del navegador).
// No requiere ningún servicio externo ni clave de API: funciona directo en
// el navegador del alumno.
//
// Revisado el 14/10/2026 (pedido de Pedro: «verificá que la voz del navegador
// funcione correctamente»). Problemas conocidos de los navegadores que acá se
// evitan:
// - La lista de voces llega tarde (getVoices() vacío al principio): se espera
//   el evento «voiceschanged» antes de hablar.
// - En Chrome, hablar justo después de cancel() a veces no suena: se deja una
//   pausa cortita entre los dos.
// - Si el objeto de la frase no queda guardado, Chrome lo puede descartar y
//   corta la lectura a la mitad: se guarda en una variable del módulo.
// - Sin voz en español, el navegador lee con una voz en inglés y no se
//   entiende: se avisa con `estadoVoz()` para que la pantalla lo muestre.

let cachedVoice: SpeechSynthesisVoice | null = null;
let actual: SpeechSynthesisUtterance | null = null; // evita que se descarte
let turno = 0; // cada pedido nuevo invalida los anteriores

function voces(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

// Preferencia: español de la Argentina, después de Latinoamérica, después
// cualquier español. Entre iguales, las voces «naturales» o de Google/Microsoft
// suenan mejor que las básicas.
function pickSpanishVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const es = voces().filter((v) => v.lang?.toLowerCase().replace("_", "-").startsWith("es"));
  if (es.length === 0) return null;
  const puntaje = (v: SpeechSynthesisVoice) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    let p = l === "es-ar" ? 40 : ["es-419", "es-us", "es-mx", "es-cl", "es-uy", "es-co"].includes(l) ? 30 : l === "es-es" ? 20 : 10;
    if (/natural|online|google|microsoft/i.test(v.name)) p += 5;
    if (v.localService) p += 1;
    return p;
  };
  cachedVoice = [...es].sort((a, b) => puntaje(b) - puntaje(a))[0];
  return cachedVoice;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

// «ok»: hay voz en español. «sin-espanol»: el navegador tiene voces pero
// ninguna en español. «sin-voz»: el navegador no puede leer en voz alta.
// «cargando»: todavía no llegó la lista de voces.
export type EstadoVoz = "ok" | "sin-espanol" | "sin-voz" | "cargando";

export function estadoVoz(): EstadoVoz {
  if (!isSpeechSupported()) return "sin-voz";
  const vs = voces();
  if (vs.length === 0) return "cargando";
  return pickSpanishVoice() ? "ok" : "sin-espanol";
}

// Espera a que el navegador cargue las voces (como mucho `ms`).
export function esperarVoces(ms = 1500): Promise<void> {
  if (!isSpeechSupported() || voces().length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const fin = () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", fin);
      resolve();
    };
    window.speechSynthesis.addEventListener?.("voiceschanged", fin);
    setTimeout(fin, ms);
  });
}

// Los símbolos matemáticos (×, ÷, −, +, =) no siempre se leen bien con la
// voz del navegador: algunas voces los saltean en silencio (por ejemplo
// "1 × 3" se escucha como "1 3" en vez de "1 por 3"). Para que la lectura
// en voz alta sea clara, los reemplazamos por su forma hablada antes de
// pasarle el texto al sintetizador. El texto que se ve en pantalla no se
// toca, solo lo que se lee en voz alta.
function sanitizeForSpeech(text: string): string {
  return text
    .replace(/×/g, " por ")
    .replace(/÷/g, " dividido ")
    .replace(/−/g, " menos ")
    .replace(/\s\+\s/g, " más ")
    .replace(/\s=\s/g, " igual a ")
    .replace(/_{2,}/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function speak(text: string, onEnd?: () => void, rate = 0.95) {
  if (!isSpeechSupported()) {
    onEnd?.();
    return;
  }
  const mio = ++turno;
  const synth = window.speechSynthesis;
  synth.cancel();
  void esperarVoces().then(() => {
    // Pausa cortita después de cancel() (Chrome a veces se «traga» la frase).
    setTimeout(() => {
      if (mio !== turno) return; // llegó otro pedido mientras tanto
      const u = new SpeechSynthesisUtterance(sanitizeForSpeech(text));
      u.lang = "es-AR";
      u.rate = rate;
      const voice = pickSpanishVoice();
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      }
      if (onEnd) {
        u.onend = () => onEnd();
        u.onerror = () => onEnd();
      }
      actual = u;
      // Si quedó en pausa (pasa en Chrome después de un rato), lo reanuda.
      if (synth.paused) synth.resume();
      synth.speak(u);
    }, 80);
  });
}

export function stopSpeaking() {
  turno++;
  if (isSpeechSupported()) window.speechSynthesis.cancel();
  actual = null;
}

// En algunos navegadores la lista de voces carga async; esto la "precalienta".
export function warmUpVoices() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
  };
}

// Para que el linter no marque `actual` como sin uso: es a propósito.
export function fraseActual(): SpeechSynthesisUtterance | null {
  return actual;
}
