// Buzón de la clase (parte que puede usarse también en el navegador): los alumnos se mandan SOLO mensajes ya establecidos
// (no hay texto libre), regalitos y monedas, pensados para la buena
// convivencia. El docente puede ver todo el historial y apagarlo.
import { getAccessoryById } from "@/types";
import { TEXTO_RESPUESTA } from "@/lib/regalosObjetosShared";


// "objeto": un compañero te quiere regalar uno de sus objetos ganados (lo
// aceptás o no); "objeto-respuesta": aviso a quien regaló (ver regalosObjetos.ts).
export type MessageKind = "mensaje" | "regalo" | "monedas" | "desafio" | "objeto" | "objeto-respuesta";

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
  { id: "animo", text: "Si te equivocás, no pasa nada: ¡seguimos!", emoji: "🌈" },
];

// Saludos para el compañero que cumple años (se ofrecen desde el pizarrón
// y en el buzón cuando el compañero cumple hoy).
export const BIRTHDAY_MESSAGES: PresetMessage[] = [
  { id: "cumple", text: "¡Feliz cumpleaños!", emoji: "🎂" },
  { id: "cumple-dia", text: "¡Que pases un día hermoso!", emoji: "🌞" },
  { id: "cumple-muchos", text: "¡Que cumplas muchos más!", emoji: "🎉" },
  { id: "cumple-deseo", text: "¡Te deseo lo mejor en tu día!", emoji: "🌟" },
  { id: "cumple-festejo", text: "¡Hoy festejamos con vos!", emoji: "🥳" },
  { id: "cumple-amigo", text: "¡Feliz cumple! Me alegra que seas mi compañero/a.", emoji: "💛" },
];

// Mensajes que acompañan un desafío a un duelo de memoria.
export const CHALLENGE_MESSAGES: PresetMessage[] = [
  { id: "duelo", text: "¡Te desafío a un duelo de memoria!", emoji: "⚔️" },
  { id: "duelo-finde", text: "¿Jugamos un duelo este fin de semana?", emoji: "🃏" },
  { id: "duelo-amistoso", text: "¡Juguemos un duelo amistoso!", emoji: "🤝" },
  { id: "duelo-revancha", text: "¿Querés la revancha?", emoji: "🔁" },
  { id: "duelo-suerte", text: "¡Que gane el mejor! Suerte.", emoji: "🍀" },
];

export const ALL_TEXT_MESSAGES: PresetMessage[] = [];

export const PRESET_GIFTS: PresetMessage[] = [
  { id: "flor", text: "una flor", emoji: "🌸" },
  { id: "estrella", text: "una estrella", emoji: "⭐" },
  { id: "chocolate", text: "un chocolate", emoji: "🍫" },
  { id: "globo", text: "un globo", emoji: "🎈" },
  { id: "trofeo", text: "un trofeo", emoji: "🏆" },
  { id: "abrazo", text: "un abrazo", emoji: "🤗" },
  { id: "torta", text: "una porción de torta", emoji: "🍰" },
  { id: "regalito", text: "un regalito", emoji: "🎁" },
];

ALL_TEXT_MESSAGES.push(...PRESET_MESSAGES, ...BIRTHDAY_MESSAGES);

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
  duelId?: string; // desafío: el duelo al que invita
  giftId?: string; // objeto: el regalo (ver regalosObjetos.ts)
  itemId?: string; // objeto: cuál
  read?: boolean;
}

export function isOnline(iso: string | undefined, now = Date.now()): boolean {
  return !!iso && now - new Date(iso).getTime() < 3 * 60_000;
}

export function describeMessage(m: ClassMessage): { emoji: string; text: string } {
  if (m.kind === "objeto") {
    return { emoji: "🎀", text: `te quiere regalar: ${getAccessoryById(m.itemId ?? "")?.label ?? "un objeto"}` };
  }
  if (m.kind === "objeto-respuesta") {
    const t = TEXTO_RESPUESTA[(m.presetId ?? "aceptado") as keyof typeof TEXTO_RESPUESTA] ?? "respondió tu regalo";
    return { emoji: m.presetId === "aceptado" ? "💝" : "↩️", text: `${t}: ${getAccessoryById(m.itemId ?? "")?.label ?? "un objeto"}` };
  }
  if (m.kind === "monedas") return { emoji: "🪙", text: `te regaló ${m.amount} ${m.amount === 1 ? "moneda" : "monedas"}` };
  if (m.kind === "regalo") {
    const g = PRESET_GIFTS.find((x) => x.id === m.presetId);
    return { emoji: g?.emoji ?? "🎁", text: `te mandó ${g?.text ?? "un regalo"}` };
  }
  if (m.kind === "desafio") {
    const c = CHALLENGE_MESSAGES.find((x) => x.id === m.presetId);
    return { emoji: c?.emoji ?? "⚔️", text: c?.text ?? "¡Te desafío a un duelo de memoria!" };
  }
  const p = ALL_TEXT_MESSAGES.find((x) => x.id === m.presetId);
  return { emoji: p?.emoji ?? "💌", text: p?.text ?? "" };
}

export function sameArgDay(isoA: string, isoB: string): boolean {
  const f = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(iso));
  return f(isoA) === f(isoB);
}
