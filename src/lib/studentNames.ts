// Utilidades para nombres visibles de alumnos y privacidad (AG-07).
//
// Reglas pedagógicas y de privacidad:
// 1. En las vistas de alumnos (buzón, novedades, competencia, etc.) NUNCA se muestra el apellido completo.
// 2. Se propone un nombre de pila a partir del nombre completo, pero el docente lo confirma o edita.
// 3. Si dos alumnos del mismo curso tienen el mismo nombre para mostrar, se les agrega dinámicamente
//    la inicial del apellido (ej. "Santiago S." y "Santiago R.").

const SURNAME_PREFIXES = ["de", "del", "de la", "de los", "de las", "di", "da", "san", "santa"];

const COMMON_SURNAMES = new Set([
  "garcia", "gonzalez", "rodriguez", "fernandez", "lopez", "martinez", "perez", "gomez",
  "sanchez", "diaz", "alvarez", "romero", "sosa", "torres", "ruiz", "ramirez", "flores",
  "acosta", "benitez", "medina", "herrera", "suarez", "aguirre", "gimenez", "gutierrez",
  "pereyra", "rojas", "molina", "castro", "ortiz", "silva", "nunez", "nuñez", "luna",
  "juarez", "cabrera", "rios", "morales", "godoy", "moreno", "ferreyra", "dominguez",
  "carrizo", "vega", "castillo", "ojeda", "correa", "ledesma", "lucero", "vera"
]);

/**
 * Propone un nombre para mostrar a partir del nombre completo cargado por el docente.
 * Maneja casos como "De Urquiza Iñaki" -> "Iñaki", "Garcia Maite" -> "Maite",
 * y "Lorenzo Daniel Perez Veron" -> "Lorenzo".
 */
export function proposeDisplayName(fullName: string): string {
  const clean = fullName.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0];

  const lower = clean.toLowerCase();

  // Caso: Apellido con partículas al inicio (ej. "De Urquiza Iñaki")
  for (const prefix of SURNAME_PREFIXES) {
    if (lower.startsWith(prefix + " ")) {
      return parts[parts.length - 1];
    }
  }

  // Caso: Dos palabras donde la primera es un apellido hispánico muy común (ej. "Garcia Maite")
  if (parts.length === 2 && COMMON_SURNAMES.has(parts[0].toLowerCase())) {
    return parts[1];
  }

  // Caso general: Primera palabra es el nombre de pila
  return parts[0];
}

/**
 * Obtiene la inicial del apellido principal para desambiguar duplicados.
 * Ejemplos:
 * - ("Santiago Benjamin Solorza Gomez", "Santiago") -> "S."
 * - ("De Urquiza Iñaki", "Iñaki") -> "U." o "D."
 * - ("Garcia Maite", "Maite") -> "G."
 */
export function getSurnameInitial(fullName: string, displayName: string): string {
  const clean = fullName.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");
  if (parts.length <= 1) return "";

  // Si displayName coincide con la última palabra (ej. "De Urquiza Iñaki" -> "Iñaki")
  if (parts[parts.length - 1].toLowerCase() === displayName.toLowerCase()) {
    if (parts.length > 2 && SURNAME_PREFIXES.includes(parts[0].toLowerCase())) {
      // "De Urquiza" -> tomamos "U."
      return parts[1][0].toUpperCase() + ".";
    }
    return parts[0][0].toUpperCase() + ".";
  }

  // Si son 2 palabras: "Nombre Apellido"
  if (parts.length === 2) {
    return parts[1][0].toUpperCase() + ".";
  }

  // Si son 3 palabras: [Nombre] [Apellido1] [Apellido2]
  // La segunda palabra suele ser el primer apellido
  if (parts.length === 3) {
    return parts[1][0].toUpperCase() + ".";
  }

  // Si son 4 o más palabras: [Nombre1] [Nombre2] [Apellido1] [Apellido2]
  // La penúltima palabra suele ser el primer apellido (ej. "Solorza" en "Santiago Benjamin Solorza Gomez")
  return parts[parts.length - 2][0].toUpperCase() + ".";
}

/**
 * Resuelve los nombres para mostrar de un conjunto de alumnos de la misma aula.
 * Si dos o más alumnos tienen el mismo nombre para mostrar, se les añade
 * dinámicamente la inicial del apellido. Si persistiera la colisión, se usa la segunda inicial.
 * Retorna un Map de `code` -> nombre para mostrar resuelto.
 */
export function resolveDisplayNames<T extends { code: string; name: string; displayName?: string }>(
  students: T[]
): Map<string, string> {
  const rawNames = new Map<string, string>();
  for (const s of students) {
    const raw = s.displayName?.trim() || proposeDisplayName(s.name) || "Compañero";
    rawNames.set(s.code, raw);
  }

  // Agrupar por nombre normalizado (minúsculas)
  const groups = new Map<string, T[]>();
  for (const s of students) {
    const raw = rawNames.get(s.code)!;
    const key = raw.toLowerCase();
    const list = groups.get(key) ?? [];
    list.push(s);
    groups.set(key, list);
  }

  const result = new Map<string, string>();

  for (const [, list] of groups) {
    if (list.length === 1) {
      const s = list[0];
      result.set(s.code, rawNames.get(s.code)!);
    } else {
      // Conflicto de nombres en el mismo curso: agregar inicial del apellido
      const withInitials = list.map((s) => {
        const raw = rawNames.get(s.code)!;
        const initial = getSurnameInitial(s.name, raw);
        return {
          student: s,
          raw,
          disambiguated: initial ? `${raw} ${initial}` : raw,
        };
      });

      // Chequear si con la primera inicial aún quedan duplicados
      const subGroups = new Map<string, typeof withInitials>();
      for (const item of withInitials) {
        const list2 = subGroups.get(item.disambiguated) ?? [];
        list2.push(item);
        subGroups.set(item.disambiguated, list2);
      }

      for (const [, subList] of subGroups) {
        if (subList.length === 1) {
          result.set(subList[0].student.code, subList[0].disambiguated);
        } else {
          // Desempate con segundo apellido o inicial completa
          for (const item of subList) {
            const parts = item.student.name.trim().split(/\s+/);
            const lastWord = parts[parts.length - 1];
            result.set(item.student.code, `${item.disambiguated} ${lastWord[0].toUpperCase()}.`);
          }
        }
      }
    }
  }

  return result;
}
