# AG-20 · Editor del avatar: orden adelante/atrás, 3 mascotas y 5 accesorios

**Asignada a:** Antigravity · **Rama:** `antigravity` · Hacela **después** de AG-19 (Monte León es urgente).

Pedido de Pedro: «que se pueda elegir qué accesorio colocar adelante o atrás en el avatar, porque a veces se quieren poner los lentes sobre la gorra; además, que se puedan colocar hasta **3 mascotas** a la vez y **5 accesorios**».

## Cómo está hoy
- `AvatarAccessories = Partial<Record<AccessorySlot, string>>` (`src/types/index.ts`): **un objeto por casillero** (headwear, eyewear, face, pendant, torso, backpack, pet, prop).
- `AvatarDisplay.tsx` dibuja en un orden fijo (`SLOT_ORDER`, de atrás hacia adelante); las mascotas y los objetos de mano se dibujan aparte.
- `AvatarTweaks` guarda corrimiento y tamaño **por casillero**; `AcomodarObjetos.tsx` los edita.
- `updateStudentProfile` (`src/lib/data.ts`) valida casillero por casillero; `/api/profile` recibe `accessories` como objeto por casillero.
- Lo usan también: buzón, pizarrón, competencia, ranking del torneo, informes (todo lo que muestra el avatar de un compañero).

## Lo que hay que hacer
1. **Modelo nuevo, compatible con lo guardado.** Agregá a `StudentProgress` un campo `avatarCapas?: { id: string; x?: number; y?: number; s?: number }[]`: la **lista ordenada** de lo que lleva puesto (el primero se dibuja más atrás). Reglas:
   - como mucho **5 accesorios** (todo lo que no es mascota) y **3 mascotas** (slot `pet`);
   - un mismo objeto no puede estar dos veces;
   - se puede tener, por ejemplo, gorra + vincha + lentes a la vez (ya no hay «uno por casillero»), siempre dentro del máximo.
   - **Migración al leer:** si `avatarCapas` no existe, se arma desde `avatarAccessories` + `avatarTweaks` con el orden de `SLOT_ORDER` actual (así nadie pierde lo que tenía). Hacé la función pura `capasDe(progress)` en `src/lib/avatarCapas.ts` y usala en **todos** los lugares que dibujan un avatar.
   - Seguí escribiendo `avatarAccessories` (el primero de cada casillero) por compatibilidad mientras haya código viejo que lo lea.
2. **`AvatarDisplay`** recibe `capas` (y sigue aceptando `accessories`/`tweaks` viejos, usando `capasDe`). Dibuja en el orden de la lista; cada capa con su x/y/s. Las mascotas: hasta 3, una al lado de la otra abajo del personaje (que no tapen la cara), más chicas cuando hay 2 o 3.
3. **Editor («Mi perfil»)**:
   - Al tocar un objeto se suma arriba de todo (si hay lugar; si no, cartel «Ya tenés 5 accesorios: sacate uno» / «Ya tenés 3 mascotas»).
   - Lista «Lo que tengo puesto» con cada capa y botones **⬆️ Adelante** / **⬇️ Atrás** (mover una posición) y **✕ Sacar**. Ejemplo para probar: gorra + lentes → con «Adelante» los lentes quedan sobre la gorra.
   - `AcomodarObjetos` edita la capa elegida (no el casillero).
   - Que funcione con el dedo en un celular chico (botones de 44 px).
4. **Servidor**: `/api/profile` acepta `capas` (lista). `updateStudentProfile` valida: cada id existe, el alumno lo tiene (usa `getEquippableAccessoryIds` con la colección **y** los préstamos vigentes: `tiendaConPrestamo`), límites 5 + 3, sin repetidos, x/y/s dentro de `TWEAK_LIMITES`. Si algo no vale, error claro (no guardar a medias).
5. **Cosas que ya existen y no se pueden romper**:
   - Préstamo Six-Seven (`src/lib/torneo/prestamo.ts`) y premios del torneo prestados (`ordenarPrestadosTorneo` en `src/lib/torneo/vueltas.ts`): cuando vencen, hoy se sacan de `avatarAccessories`; ahora también tienen que salir de `avatarCapas`.
   - Regalar objetos (`src/lib/regalosObjetos.ts`): al regalar se saca del avatar; ahora también de `avatarCapas`.
   - Cumpleaños (corona de cumple encima de todo) y fondos.
   - Privacidad/eliminar cuenta: no guarda datos personales nuevos.

## Pruebas (obligatorio)
`scripts/test-avatar-capas.ts`: migración desde el formato viejo (mismo dibujo), límites 5 + 3, sin repetidos, mover adelante/atrás, validación del servidor (objeto que no tiene, prestado vencido), que préstamo vencido y regalo sacan la capa. Restaurá la base al final. Además, captura de pantalla (Playwright) de un avatar con gorra + lentes en los dos órdenes y con 3 mascotas, adjunta en tu resumen.

## Entrega
`npx tsc --noEmit`, `npx eslint src`, el test nuevo y los de siempre en verde (`test-torneo`, `test-regalos`, `test-colecciones`, `test-privacidad`). Resumen en `TAREAS.md` con cada punto.
