// Buzón de la clase (parte que puede usarse también en el navegador): los alumnos se mandan SOLO mensajes ya establecidos
// (no hay texto libre), regalitos y monedas, pensados para la buena
// convivencia. El docente puede ver todo el historial y apagarlo.


export type MessageKind = "mensaje" | "regalo" | "monedas";

export interface PresetMessage {
  id: string;
  text: string;
  emoji: string;
}

export const PRESET_MESSAGES: PresetMessage[] = [
  { id: "bien", text: "¡Muy bien, seguí así!", emoji: "💪" },
  { id: "genial", text: "¡Qué genial lo que lograste!", emoji: "🌟" },
  { id: "podes", text: "¡Vamos, vos podés!", emoji: "🚀" },
  { id: "gracias", text: "¡Gracias por ayudarme!", emoji: "🙏" },
  { id: "equipo", text: "¡Qué buen equipo somos!", emoji: "🤝" },
  { id: "medalla", text: "¡Felicitaciones por tu medalla!", emoji: "🏅" },
  { id: "finde", text: "¿Jugamos la aventura del finde?", emoji: "🃏" },
  { id: "extrano", text: "¡Te extrañamos en clase!", emoji: "💛" },
  { id: "perdon", text: "Perdón si te molesté.", emoji: "🙂" },
  { id: "amigo", text: "¡Me alegra ser tu compañero/a!", emoji: "😊" },
  { id: "cumple", text: "¡Feliz cumpleaños!", emoji: "🎂" },
  { id: "animo", text: "Si te equivocás, no pasa nada: ¡seguimos!", emoji: "🌈" },
];

export const PRESET_GIFTS: PresetMessage[] = [
  { id: "flor", text: "una flor", emoji: "🌸" },
  { id: "estrella", text: "una estrella", emoji: "⭐" },
  { id: "chocolate", text: "un chocolate", emoji: "🍫" },
  { id: "globo", text: "un globo", emoji: "🎈" },
  { id: "trofeo", text: "un trofeo", emoji: "🏆" },
  { id: "abrazo", text: "un abrazo", emoji: "🤗" },
];

export const COIN_AMOUNTS = [1, 3, 5];
export const MAX_COINS_SENT_PER_DAY = 10;
export const MAX_MESSAGES_PER_DAY = 20;

export interface ClassMessage {
  id: string;
  at: string;
  from: string; // código
  to: string; // código
  kind: MessageKind;
  presetId?: string;
  amount?: number;
  read?: boolean;
}

export function isOnline(iso: string | undefined, now = Date.now()): boolean {
  return !!iso && now - new Date(iso).getTime() < 3 * 60_000;
}

export function describeMessage(m: ClassMessage): { emoji: string; text: string } {
  if (m.kind === "monedas") return { emoji: "🪙", text: `te regaló ${m.amount} ${m.amount === 1 ? "moneda" : "monedas"}` };
  if (m.kind === "regalo") {
    const g = PRESET_GIFTS.find((x) => x.id === m.presetId);
    return { emoji: g?.emoji ?? "🎁", text: `te mandó ${g?.text ?? "un regalo"}` };
  }
  const p = PRESET_MESSAGES.find((x) => x.id === m.presetId);
  return { emoji: p?.emoji ?? "💌", text: p?.text ?? "" };
}

export function sameArgDay(isoA: string, isoB: string): boolean {
  const f = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(iso));
  return f(isoA) === f(isoB);
}
