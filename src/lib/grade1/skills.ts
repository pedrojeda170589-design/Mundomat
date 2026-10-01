// Habilidades de 1.º grado: el seguimiento es por habilidad, no solo por
// materia. Cada actividad dice qué habilidades trabaja y cada respuesta suma
// a esas habilidades (ver src/lib/skills.ts).
import { WorldSubject } from "@/types";

export interface SkillDef {
  id: string;
  subject: WorldSubject;
  label: string;
  // Eje o bloque del diseño curricular al que pertenece.
  axis: string;
  // Qué se espera que el alumno logre (para el docente).
  description: string;
  // Sugerencia de práctica cuando cuesta (para el docente y la familia).
  practice: string;
}

export const GRADE1_SKILLS: SkillDef[] = [
  // ---------- Lengua ----------
  { id: "l-oralidad", subject: "lengua", axis: "Comprensión y producción oral", label: "Oralidad y conversación", description: "Respeta turnos, saluda, pregunta y responde según la situación.", practice: "Conversar en ronda: escuchar al otro y responder con oraciones completas." },
  { id: "l-escucha", subject: "lengua", axis: "Comprensión y producción oral", label: "Escucha atenta", description: "Escucha y distingue sonidos, palabras y consignas.", practice: "Juegos de «¿qué suena?» y consignas de dos pasos." },
  { id: "l-segmentacion", subject: "lengua", axis: "Conciencia fonológica", label: "Palabras largas y cortas (sílabas orales)", description: "Separa palabras en sílabas al decirlas y compara su largo.", practice: "Decir palabras aplaudiendo cada sílaba." },
  { id: "l-rimas", subject: "lengua", axis: "Conciencia fonológica", label: "Rimas", description: "Reconoce palabras que terminan igual.", practice: "Buscar palabras que rimen con nombres de compañeros." },
  { id: "l-silaba-inicial", subject: "lengua", axis: "Conciencia fonológica", label: "Sílaba inicial y final", description: "Identifica con qué sílaba empieza o termina una palabra.", practice: "Jugar al «veo veo» con sílabas: «veo algo que empieza con ma»." },
  { id: "l-sonido-inicial", subject: "lengua", axis: "Conciencia fonológica", label: "Sonido inicial", description: "Reconoce el primer sonido de una palabra.", practice: "Alargar el primer sonido: «mmmmesa»." },
  { id: "l-vocales", subject: "lengua", axis: "Sistema de escritura", label: "Vocales", description: "Reconoce las vocales, su nombre y su sonido.", practice: "Buscar vocales en carteles y en su nombre." },
  { id: "l-letra-nombre", subject: "lengua", axis: "Sistema de escritura", label: "Nombre de las letras", description: "Reconoce letras y sabe cómo se llaman (M → «eme»).", practice: "Abecedario con dibujos en el aula." },
  { id: "l-grafema-fonema", subject: "lengua", axis: "Sistema de escritura", label: "Letra y sonido", description: "Relaciona cada letra con su sonido (M → /m/).", practice: "Letras móviles: decir el sonido al mostrar la letra." },
  { id: "l-silabas", subject: "lengua", axis: "Lectura", label: "Lectura de sílabas", description: "Lee sílabas directas (ma, pe, lo…).", practice: "Tarjetas de sílabas con las letras ya trabajadas." },
  { id: "l-lectura-palabras", subject: "lengua", axis: "Lectura", label: "Lectura de palabras", description: "Lee palabras con las letras trabajadas y las asocia a su dibujo.", practice: "Leer etiquetas de objetos del aula." },
  { id: "l-lectura-oraciones", subject: "lengua", axis: "Lectura", label: "Lectura de oraciones", description: "Lee oraciones breves con apoyo de imágenes.", practice: "Leer epígrafes cortos de dibujos." },
  { id: "l-comprension-oral", subject: "lengua", axis: "Literatura y comprensión", label: "Comprensión de lo escuchado", description: "Comprende cuentos y textos leídos por el docente: personajes, lugar, qué pasó.", practice: "Después de un cuento: ¿quién?, ¿dónde?, ¿qué pasó primero?" },
  { id: "l-comprension-lectora", subject: "lengua", axis: "Lectura", label: "Comprensión de lo que lee", description: "Entiende lo que lee por sí mismo en textos breves.", practice: "Leer una oración y dibujar lo que dice." },
  { id: "l-literatura", subject: "lengua", axis: "Literatura", label: "Literatura (poemas, coplas, adivinanzas)", description: "Disfruta y juega con poemas, coplas, rondas y adivinanzas.", practice: "Recitar coplas y crear adivinanzas en familia." },
  { id: "l-escritura", subject: "lengua", axis: "Escritura", label: "Escritura de palabras", description: "Escribe palabras con letras móviles o a mano, con las letras trabajadas.", practice: "Escribir listas (de compras, de juegos) con ayuda." },
  { id: "l-trazos", subject: "lengua", axis: "Escritura", label: "Trazado de letras", description: "Traza letras siguiendo la dirección correcta.", practice: "Repasar letras en el aire, en arena o con el dedo." },
  { id: "l-textos-breves", subject: "lengua", axis: "Escritura", label: "Textos breves (listas, títulos, mensajes)", description: "Reconoce y arma listas, títulos, epígrafes, mensajes e invitaciones.", practice: "Armar juntos la invitación de un cumpleaños o un acto." },

  // ---------- Matemática ----------
  { id: "m-cantidades", subject: "matematica", axis: "Número", label: "Reconocer cantidades", description: "Reconoce cantidades chicas de un vistazo y las compara.", practice: "Dados y dedos: ¿cuántos hay sin contar uno por uno?" },
  { id: "m-conteo", subject: "matematica", axis: "Número", label: "Conteo", description: "Cuenta colecciones haciendo corresponder un número a cada objeto.", practice: "Contar objetos señalando cada uno." },
  { id: "m-numeros-10", subject: "matematica", axis: "Número", label: "Números hasta 10", description: "Lee, escribe y asocia los números hasta 10 con cantidades.", practice: "Tarjetas de números y colecciones." },
  { id: "m-numeros-100", subject: "matematica", axis: "Número", label: "Números hasta 100", description: "Lee y ordena números hasta 100 y encuentra regularidades.", practice: "Cuadro de números del 1 al 100." },
  { id: "m-comparar", subject: "matematica", axis: "Número", label: "Comparar (mayor, menor, igual)", description: "Compara cantidades y números.", practice: "¿Quién tiene más? con figuritas o fichas." },
  { id: "m-orden", subject: "matematica", axis: "Número", label: "Orden, anterior y posterior", description: "Ordena números y encuentra el anterior y el siguiente.", practice: "Recta numérica en el piso." },
  { id: "m-composicion", subject: "matematica", axis: "Operaciones", label: "Componer y descomponer", description: "Arma un número de distintas formas (5 y 5, 6 y 4…).", practice: "Formar 10 con dos colores de fichas." },
  { id: "m-suma", subject: "matematica", axis: "Operaciones", label: "Agregar y juntar (suma)", description: "Resuelve situaciones de agregar y juntar.", practice: "Problemas con juguetes: tenía 3, me dieron 2." },
  { id: "m-resta", subject: "matematica", axis: "Operaciones", label: "Quitar y perder (resta)", description: "Resuelve situaciones de quitar, perder y comparar.", practice: "Problemas con golosinas o figuritas." },
  { id: "m-calculo-mental", subject: "matematica", axis: "Operaciones", label: "Cálculo mental inicial", description: "Usa cálculos fáciles (dobles, +1, +10, 5+5).", practice: "Juegos de dados: sumar los puntos." },
  { id: "m-problemas", subject: "matematica", axis: "Operaciones", label: "Problemas", description: "Comprende y resuelve problemas sencillos de la vida cotidiana.", practice: "Problemas de la vida diaria: compras, juegos, la mesa." },
  { id: "m-dinero", subject: "matematica", axis: "Número", label: "Dinero", description: "Reconoce monedas y billetes y paga cantidades sencillas.", practice: "Jugar al almacén con billetes de juguete." },
  { id: "m-patrones", subject: "matematica", axis: "Número", label: "Patrones y regularidades", description: "Continúa y describe series y patrones.", practice: "Collares de colores que se repiten." },
  { id: "m-clasificar", subject: "matematica", axis: "Número", label: "Clasificar", description: "Agrupa objetos según una característica.", practice: "Ordenar juguetes por color, forma o tamaño." },
  { id: "m-espacio", subject: "matematica", axis: "Espacio", label: "Posiciones y recorridos", description: "Usa arriba/abajo, adelante/atrás, izquierda/derecha y describe recorridos.", practice: "Juego del tesoro con indicaciones." },
  { id: "m-geometria", subject: "matematica", axis: "Geometría", label: "Figuras y cuerpos", description: "Reconoce figuras y cuerpos geométricos.", practice: "Buscar formas en objetos de la casa." },
  { id: "m-medida", subject: "matematica", axis: "Medida", label: "Medidas y tiempo", description: "Compara longitudes y usa nociones de tiempo (días, semana, reloj).", practice: "Comparar largos con hilos; usar el calendario." },

  // ---------- Ciencias Sociales ----------
  { id: "s-identidad", subject: "sociales", axis: "Las sociedades y los espacios", label: "Identidad y familia", description: "Reconoce su identidad, su nombre y la diversidad de familias.", practice: "Contar la historia de su nombre." },
  { id: "s-convivencia", subject: "sociales", axis: "Las actividades humanas y la organización social", label: "Convivencia, normas y derechos", description: "Reconoce normas, acuerdos, derechos y responsabilidades.", practice: "Armar los acuerdos de convivencia del aula." },
  { id: "s-espacios", subject: "sociales", axis: "Las sociedades y los espacios", label: "Espacios cercanos y mapas", description: "Describe la escuela, el barrio y lugares cercanos; lee representaciones sencillas.", practice: "Dibujar el camino de casa a la escuela." },
  { id: "s-trabajos", subject: "sociales", axis: "Las actividades humanas y la organización social", label: "Trabajos e instituciones", description: "Reconoce trabajos y para qué sirven las instituciones.", practice: "Entrevistar a un familiar sobre su trabajo." },
  { id: "s-tiempo", subject: "sociales", axis: "Las sociedades a través del tiempo", label: "Pasado y presente", description: "Ordena hechos en el tiempo y reconoce cambios y permanencias.", practice: "Comparar fotos de antes y de ahora." },
  { id: "s-cultura", subject: "sociales", axis: "Las sociedades a través del tiempo", label: "Diversidad, costumbres y fechas", description: "Conoce costumbres, fiestas, tradiciones y efemérides.", practice: "Compartir una costumbre de la familia." },

  // ---------- Ciencias Naturales ----------
  { id: "n-seres-vivos", subject: "naturales", axis: "Los seres vivos", label: "Seres vivos", description: "Distingue seres vivos y no vivos y sus necesidades.", practice: "Observar una planta y registrar qué necesita." },
  { id: "n-animales", subject: "naturales", axis: "Los seres vivos", label: "Animales y ambientes", description: "Describe características observables de animales y dónde viven.", practice: "Clasificar animales de láminas según su ambiente." },
  { id: "n-plantas", subject: "naturales", axis: "Los seres vivos", label: "Plantas", description: "Reconoce partes y cuidados de las plantas.", practice: "Sembrar una semilla y observarla." },
  { id: "n-cuerpo", subject: "naturales", axis: "Los seres vivos", label: "Cuerpo y salud", description: "Reconoce partes del cuerpo, sentidos y hábitos saludables.", practice: "Rutina de higiene y alimentación." },
  { id: "n-materiales", subject: "naturales", axis: "Los materiales", label: "Materiales y objetos", description: "Reconoce materiales y propiedades observables.", practice: "Clasificar objetos de la casa por su material." },
  { id: "n-fenomenos", subject: "naturales", axis: "La Tierra, el universo y sus cambios", label: "Agua, aire, cielo y estaciones", description: "Observa fenómenos: agua, aire, día y noche, estaciones.", practice: "Registrar el tiempo y el cielo durante una semana." },
  { id: "n-ambiente", subject: "naturales", axis: "La Tierra, el universo y sus cambios", label: "Cuidado del ambiente", description: "Propone acciones para cuidar el ambiente.", practice: "Separar residuos en casa." },
];

export function getGrade1Skill(id: string): SkillDef | undefined {
  return GRADE1_SKILLS.find((s) => s.id === id);
}
