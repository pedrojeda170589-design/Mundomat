# MundoMat 🚀

Videojuego educativo de Matemáticas para 3° grado — Escuela Hogar Primaria
Provincial Rural N°2 "Héroes de Malvinas".

## Qué incluye

- 14 mundos: los 10 originales (tablas del 1 al 10) más 4 nuevos (reparto,
  geometría, situaciones problemáticas, sumas y restas con 2-3 cifras).
- 10 actividades por mundo.
- Sistema de medallas (Bronce/Plata/Oro) según mundos completados.
- Sistema de monedas 🪙: se ganan por respuesta correcta y por completar un
  mundo. En los mundos avanzados (11 a 14), las monedas se usan para pedir
  una **pista** 💡 o activar la **lectura en voz alta** 🔊 de la consigna. En
  los mundos básicos (1 a 10) la lectura en voz alta es gratis, pensada para
  que sea accesible también en grados más chicos.
- Códigos de acceso individuales por alumno (no requieren contraseña).
- Panel Docente protegido con clave de administrador, con:
  - **Alumnos**: dos bloques — "Alumnos de aula" (el curso original) y
    "Alumnos agregados" (los que se sumen después) — con su código,
    posibilidad de agregar o eliminar estudiantes.
  - **Habilitar Mundos**: activar/desactivar qué mundos pueden jugar los
    alumnos.
  - **Registro y Fortalezas**: estadísticas por alumno (% de aciertos,
    tiempo jugado, mundos completados, fortalezas y contenidos a reforzar).

## Cómo correr el proyecto en tu computadora (opcional)

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. En desarrollo local, si no configurás las
variables de entorno de abajo, se usa una clave de administrador por
defecto: **docente2026**, y los datos se guardan en un archivo local
(`.data/db.json`) que no se sube a GitHub.

## Cómo desplegar en Vercel

1. Subí este proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), "Add New" → "Project" → importá ese
   repositorio. Vercel detecta que es Next.js automáticamente.
3. Antes de desplegar (o después, en Settings → Environment Variables),
   agregá:
   - `ADMIN_PASSWORD`: la clave que vas a usar para entrar al Panel Docente
     (elegí una propia, no dejes la de desarrollo).
4. Hacé el primer deploy.
5. **Muy importante para que los datos persistan entre alumnos y
   dispositivos**: en el proyecto de Vercel, andá a la pestaña **Storage**
   → agregá una base de datos tipo **Upstash for Redis** (o "KV") desde el
   Marketplace (tiene un plan gratuito) → conectala a este proyecto. Eso
   crea automáticamente las variables `KV_REST_API_URL` y
   `KV_REST_API_TOKEN`.
6. Volvé a desplegar (Redeploy) para que tome esas variables nuevas.

Sin el paso 5, la app funciona pero los datos no se guardan de forma
confiable entre visitas (el almacenamiento de las funciones de Vercel es
temporal).

## Estructura

- `src/lib/worlds.ts` — definición de los 14 mundos.
- `src/lib/activities.ts` — generador de las 10 actividades de cada mundo.
- `src/lib/store.ts` — capa de persistencia (Upstash Redis o archivo local).
- `src/lib/data.ts` — alumnos, progreso y configuración de mundos.
- `src/app/student/*` — flujo del alumno (código de acceso, mapa, juego).
- `src/app/admin/*` — Panel Docente.
- `src/app/api/*` — endpoints usados por ambos flujos.
