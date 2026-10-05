// Textos de las condiciones del aula abierta («Jugar gratis»).
//
// ⚠️ BORRADOR: Pedro tiene que reemplazar estos textos por los definitivos.
// Cada vez que cambie cualquier texto de este archivo, hay que subir
// VERSION_CONDICIONES: cada matrícula guarda la versión que aceptó la persona
// adulta (campo `version_condiciones`) y la fecha y hora de aceptación.
//
// Este archivo se puede usar en el servidor y en el navegador.

export const VERSION_CONDICIONES = "2026-10-04-borrador";

// Días de la prueba y momento en que se borra el nombre (a contar desde la
// inscripción).
export const DIAS_PRUEBA = 30;

// Qué pasa a los 30 días (se muestra en la inscripción y en el juego).
export const QUE_PASA_A_LOS_30_DIAS = [
  "La prueba termina y ya no se puede seguir jugando con ese código.",
  "El nombre o apodo se reemplaza por un número y se borra de todos lados: no queda ninguna lista que una ese número con el nombre.",
  "Los resultados (mundos superados y aciertos) quedan guardados solo con ese número, sin datos que identifiquen a la persona.",
  "Antes de esa fecha, la familia puede borrar todo en cualquier momento con el botón «Eliminar cuenta y datos».",
];

// Pantalla previa a la inscripción, dirigida a madres, padres y tutores.
export const TEXTO_TUTORES = {
  titulo: "Para la persona adulta responsable",
  parrafos: [
    "MundoTest26 es un juego educativo para chicas y chicos de primaria. Como quien va a jugar puede ser menor de edad, esta inscripción la tiene que hacer una madre, un padre o la persona tutora.",
    `La prueba es gratuita y dura ${DIAS_PRUEBA} días. Para inscribir solo pedimos un nombre de pila o un apodo: no pedimos apellido, correo, teléfono, documento, dirección ni fotos.`,
    "Guardamos lo que hace falta para que el juego funcione: el nombre de pila o apodo, el código de acceso y el avance en los mundos (respuestas correctas e incorrectas, monedas y avatar).",
  ],
  casilla:
    "Soy la madre, el padre o la persona tutora de quien va a jugar. Leí los Términos y la Política de privacidad y acepto que use MundoTest26 durante la prueba.",
};

export const TERMINOS = {
  titulo: "Términos de uso del aula abierta",
  secciones: [
    {
      titulo: "1. Qué es",
      texto: `El aula abierta de MundoTest26 permite probar gratis el juego durante ${DIAS_PRUEBA} días. Es una propuesta educativa: no tiene publicidad ni compras con dinero real (las monedas del juego no valen dinero).`,
    },
    {
      titulo: "2. Quién se inscribe",
      texto: "La inscripción la hace una persona adulta responsable (madre, padre o tutor/a), que acepta estos términos en nombre de quien va a jugar.",
    },
    {
      titulo: "3. Uso del código",
      texto: "Cada inscripción recibe un código de acceso personal. Es como una llave: conviene no compartirlo. Con ese código se juega y también se puede borrar la cuenta.",
    },
    {
      titulo: "4. Convivencia",
      texto: "En el aula abierta no hay mensajes entre jugadores ni duelos con personas desconocidas.",
    },
    {
      titulo: "5. Final de la prueba",
      texto: QUE_PASA_A_LOS_30_DIAS.join(" "),
    },
    {
      titulo: "6. Cambios",
      texto: "Si estos términos cambian, se avisa en esta página con una nueva versión. Cada inscripción guarda la versión que se aceptó.",
    },
  ],
};

export const PRIVACIDAD = {
  titulo: "Política de privacidad del aula abierta",
  secciones: [
    {
      titulo: "Qué datos pedimos",
      texto: "Solo un nombre de pila o apodo. No pedimos apellido, correo, teléfono, documento, dirección, fecha de nacimiento ni fotos.",
    },
    {
      titulo: "Qué datos se generan al jugar",
      texto: "El avance en el juego: mundos superados, respuestas correctas e incorrectas, tiempo de juego, monedas y el avatar elegido. También guardamos la fecha y hora en que la persona adulta aceptó las condiciones y la versión que aceptó.",
    },
    {
      titulo: "Para qué los usamos",
      texto: "Solo para que el juego funcione, mostrar el informe de avance a la familia y mejorar la propuesta educativa. No los vendemos ni los compartimos con terceros con fines comerciales.",
    },
    {
      titulo: "Cuánto tiempo los guardamos",
      texto: QUE_PASA_A_LOS_30_DIAS.join(" "),
    },
    {
      titulo: "Cómo borrar todo",
      texto: "En cualquier momento, desde el juego, con el botón «Eliminar cuenta y datos». Se borran de verdad la cuenta, los resultados y los registros asociados, y se muestra una confirmación.",
    },
    {
      titulo: "Derechos",
      texto: "Las personas responsables pueden pedir acceso, rectificación o supresión de los datos, según la Ley 25.326 de Protección de los Datos Personales de la República Argentina.",
    },
  ],
};
