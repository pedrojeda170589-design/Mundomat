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

export function speak(text: string) {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
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
