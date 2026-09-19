// Utilidad de lectura en voz alta (Web Speech API del navegador).
// No requiere ningún servicio externo ni clave de API: funciona directo en
// el navegador del alumno.

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  const spanish =
    voices.find((v) => v.lang?.toLowerCase().startsWith("es-ar")) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ||
    null;
  cachedVoice = spanish;
  return spanish;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
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
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function speak(text: string) {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(sanitizeForSpeech(text));
  utterance.lang = "es-AR";
  utterance.rate = 0.95;
  const voice = pickSpanishVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

// En algunos navegadores la lista de voces carga async; esto la "precalienta".
export function warmUpVoices() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
  };
}
