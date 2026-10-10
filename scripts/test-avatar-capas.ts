// Pruebas de AG-20: Capas del avatar, orden adelante/atrás, 3 mascotas y 5 accesorios.
// Corre contra la base LOCAL y la deja como estaba.
//   npx tsx scripts/test-avatar-capas.ts
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isUsingRemoteStore } from "../src/lib/store";
import {
  getProgress,
  getStudents,
  saveProgress,
  updateStudentProfile,
} from "../src/lib/data";
import {
  MAX_ACCESORIOS,
  MAX_MASCOTAS,
  SLOT_ORDER_LEGACY,
  actualizarTweakCapa,
  agregarCapa,
  capasDe,
  capasToAccessories,
  isPet,
  moverCapaAdelante,
  moverCapaAtras,
  quitarCapa,
  validarCapas,
  equiparGorritoAniversario,
} from "../src/lib/avatarCapas";
import { sinObjeto } from "../src/lib/regalosObjetos";
import { devolverPrestamoVencido } from "../src/lib/torneo/prestamo";
import { ordenarPrestadosTorneo } from "../src/lib/torneo/vueltas";
import {
  ACCESSORY_CATALOG_PREMIO,
  ACCESSORY_CATALOG_TEMPORADA,
  ACCESSORY_CATALOG_TIENDA,
  AvatarCapa,
  StudentProgress,
  getAccessoryById,
} from "../src/types";

if (isUsingRemoteStore()) {
  throw new Error("Esta prueba usa la base local: sacá las variables de Upstash/KV.");
}

const DB = path.join(process.cwd(), ".data", "db.json");
const RESPALDO = path.join(process.cwd(), ".data", "db.antes-de-test-capas.json");

async function main() {
  console.log("🧪 Iniciando pruebas de AG-20 (capas del avatar)...");

  // 1. Migración y compatibilidad pura (capasDe y capasToAccessories)
  console.log("  1. Verificando migración desde formato viejo...");
  {
    const legacyProgress: Partial<StudentProgress> = {
      avatar: "estudiante-1",
      avatarAccessories: {
        headwear: "gorra",
        eyewear: "lentes-sol",
        face: "bufanda-rayas",
      },
      avatarTweaks: {
        headwear: { x: 2, y: -1, s: 1.1 },
        eyewear: { x: 0, y: 0, s: 0.95 },
      },
    };

    const migradas = capasDe(legacyProgress as StudentProgress);
    assert.equal(migradas.length, 3, "debe migrar los 3 accesorios equipados");

    // Verificar que respeta SLOT_ORDER_LEGACY (face -> eyewear -> headwear)
    const ids = migradas.map((c) => c.id);
    assert.equal(ids[0], "bufanda-rayas", "face debe ir primero (más atrás)");
    assert.equal(ids[1], "lentes-sol", "eyewear debe ir en el medio");
    assert.equal(ids[2], "gorra", "headwear debe ir último (más adelante)");

    // Verificar preservación de tweaks
    const gorraCapa = migradas.find((c) => c.id === "gorra")!;
    assert.equal(gorraCapa.x, 2);
    assert.equal(gorraCapa.y, -1);
    assert.equal(gorraCapa.s, 1.1);

    const lentesCapa = migradas.find((c) => c.id === "lentes-sol")!;
    assert.equal(lentesCapa.x, undefined); // x=0 no se guarda innecesariamente
    assert.equal(lentesCapa.y, undefined);
    assert.equal(lentesCapa.s, 0.95);

    // Cuando avatarCapas ya existe, capasDe lo devuelve directamente
    const conCapas: Partial<StudentProgress> = {
      avatarCapas: [
        { id: "gorra" },
        { id: "lentes-sol" }, // Lentes por encima de la gorra (orden invertido adrede)
      ],
      avatarAccessories: {
        headwear: "gorra",
        eyewear: "lentes-sol",
      },
    };
    const leidas = capasDe(conCapas as StudentProgress);
    assert.equal(leidas.length, 2);
    assert.equal(leidas[0].id, "gorra", "debe respetar el orden guardado");
    assert.equal(leidas[1].id, "lentes-sol");

    // Sincronización capasToAccessories
    const sync = capasToAccessories(leidas);
    assert.equal(sync.accessories.headwear, "gorra");
    assert.equal(sync.accessories.eyewear, "lentes-sol");
  }

  // 2. Límites y operaciones de capas (agregar, límites 5+3, mover adelante/atrás, quitar)
  console.log("  2. Verificando límites (5 accesorios + 3 mascotas) y operaciones...");
  {
    let capas: AvatarCapa[] = [];

    // Agregar accesorios hasta el límite (5)
    const acc1 = "gorra";
    const acc2 = "gorro";
    const acc3 = "lentes-sol";
    const acc4 = "gafas-sol";
    const acc5 = "bufanda-rayas";
    const acc6 = "sombrero"; // 6º accesorio, debe fallar

    assert.ok(agregarCapa(capas, acc1).ok);
    capas = (agregarCapa(capas, acc1) as { ok: true; capas: AvatarCapa[] }).capas;

    // Repetido no se puede
    const dupRes = agregarCapa(capas, acc1);
    assert.equal(dupRes.ok, false);
    assert.match(dupRes.error, /ya está puesto/i);

    capas = (agregarCapa(capas, acc2) as { ok: true; capas: AvatarCapa[] }).capas;
    capas = (agregarCapa(capas, acc3) as { ok: true; capas: AvatarCapa[] }).capas;
    capas = (agregarCapa(capas, acc4) as { ok: true; capas: AvatarCapa[] }).capas;
    capas = (agregarCapa(capas, acc5) as { ok: true; capas: AvatarCapa[] }).capas;
    assert.equal(capas.length, 5);

    // Intentar 6º accesorio
    const overflowAcc = agregarCapa(capas, acc6);
    assert.equal(overflowAcc.ok, false);
    assert.match(overflowAcc.error, /Ya tenés 5 accesorios: sacate uno/i);

    // Agregar hasta 3 mascotas (pets)
    const pet1 = "squishy-6";
    const pet2 = "squishy-7";
    const pet3 = "squishy-tostada";
    const pet4 = "squishy-gatito";
    assert.ok(isPet(pet1));
    assert.ok(isPet(pet2));
    assert.ok(isPet(pet3));
    assert.ok(isPet(pet4));

    capas = (agregarCapa(capas, pet1) as { ok: true; capas: AvatarCapa[] }).capas;
    capas = (agregarCapa(capas, pet2) as { ok: true; capas: AvatarCapa[] }).capas;
    capas = (agregarCapa(capas, pet3) as { ok: true; capas: AvatarCapa[] }).capas;
    assert.equal(capas.length, 8, "5 accesorios + 3 mascotas = 8 total");

    const overflowPet = agregarCapa(capas, pet4);
    assert.equal(overflowPet.ok, false);
    assert.match(overflowPet.error, /Ya tenés 3 mascotas/i);

    // Mover adelante y atrás
    // Actualmente el orden es [acc1, acc2, acc3, acc4, acc5, pet1, pet2, pet3]
    // Mover acc1 ("gorra") adelante
    const movidoAdelante = moverCapaAdelante(capas, acc1);
    assert.equal(movidoAdelante[0].id, acc2);
    assert.equal(movidoAdelante[1].id, acc1, "acc1 avanzó una posición");

    // Mover acc1 atrás
    const movidoAtras = moverCapaAtras(movidoAdelante, acc1);
    assert.equal(movidoAtras[0].id, acc1, "acc1 volvió a la primera posición");

    // Mover el primero hacia atrás no hace nada
    const topeAtras = moverCapaAtras(movidoAtras, acc1);
    assert.equal(topeAtras[0].id, acc1);

    // Mover el último hacia adelante no hace nada
    const ultimoId = capas[capas.length - 1].id;
    const topeAdelante = moverCapaAdelante(capas, ultimoId);
    assert.equal(topeAdelante[topeAdelante.length - 1].id, ultimoId);

    // Quitar capa
    const sinAcc2 = quitarCapa(capas, acc2);
    assert.equal(sinAcc2.length, 7);
    assert.ok(!sinAcc2.some((c) => c.id === acc2));

    // Tweaks por capa
    const conTweak = actualizarTweakCapa(capas, acc1, { x: 5.43, y: -7.89, s: 1.25 });
    const c1 = conTweak.find((c) => c.id === acc1)!;
    assert.equal(c1.x, 5.4);
    assert.equal(c1.y, -7.9);
    assert.equal(c1.s, 1.25);
  }

  // 3. Validación de servidor (validarCapas y updateStudentProfile)
  console.log("  3. Verificando validación del servidor...");
  {
    const equippable = new Set(["gorra", "lentes-sol", "bufanda-rayas"]);

    // Válido
    const vOk = validarCapas(
      [
        { id: "gorra", x: 1 },
        { id: "lentes-sol", s: 1.2 },
      ],
      equippable
    );
    assert.equal(vOk.ok, true);

    // Objeto que no tiene
    const vNoTiene = validarCapas([{ id: "sombrero" }], equippable);
    assert.equal(vNoTiene.ok, false);

    // Repetido
    const vRepetido = validarCapas([{ id: "gorra" }, { id: "gorra" }], equippable);
    assert.equal(vRepetido.ok, false);
    assert.match(vRepetido.error, /repetido/i);
  }

  // 4. Pruebas con la base de datos (con respaldo y restauración)
  console.log("  4. Verificando persistencia y desequipado con la base local...");
  fs.copyFileSync(DB, RESPALDO);
  try {
    const alumnos = await getStudents();
    const alumno = alumnos[0];
    assert.ok(alumno, "debe existir al menos un alumno");

    // 4. Fijar avatar del alumno de prueba y usar ids reales (A8)
    console.log("  4. Verificando persistencia en base local con updateStudentProfile...");
    const prog = await getProgress(alumno.code);
    await saveProgress({
      ...prog,
      avatar: "estudiante-1",
      completedWorlds: [1, 2, 3, 4, 5],
      shopCollection: ["squishy-6", "squishy-7"],
      seasonalCollection: ["sombrero-paja", "bufanda-rayas"],
      prestamo67: {
        id: "anteojos-67",
        semana: "2026-W41",
        hasta: new Date(Date.now() + 86400_000).toISOString(), // préstamo vigente por 24 hs
      },
      avatarCapas: undefined,
      avatarAccessories: {},
    });

    // Guardar capas válidas mediante updateStudentProfile
    const actualizado = await updateStudentProfile(alumno.code, {
      capas: [
        { id: "sombrero-paja", x: 2, y: 1 },
        { id: "anteojos-67", s: 1.1 },
        { id: "squishy-6" },
      ],
    });
    assert.ok(actualizado && actualizado.ok, "updateStudentProfile debe aceptar capas válidas");
    assert.equal(actualizado.progress.avatarCapas?.length, 3);
    assert.equal(actualizado.progress.avatarCapas?.[0].id, "sombrero-paja");
    assert.equal(actualizado.progress.avatarCapas?.[1].id, "anteojos-67");
    assert.equal(actualizado.progress.avatarCapas?.[2].id, "squishy-6");
    // avatarAccessories debe sincronizarse
    assert.equal(actualizado.progress.avatarAccessories?.headwear, "sombrero-paja");
    assert.equal(actualizado.progress.avatarAccessories?.eyewear, "anteojos-67");
    assert.equal(actualizado.progress.avatarAccessories?.pet, "squishy-6");

    // Intentar guardar un objeto que el alumno NO tiene
    const fallido = await updateStudentProfile(alumno.code, {
      capas: [{ id: "corona-flores" }],
    });
    assert.equal(fallido?.ok, false, "debe rechazar capas con objetos que no tiene");
    assert.ok(fallido.error.includes("No tenés el accesorio"), "debe dar error claro");

    // 5. Guardar se rechaza cuando el préstamo ya venció (A8)
    console.log("  5. Verificando que guardar se rechaza cuando el préstamo ya venció...");
    await saveProgress({
      ...actualizado.progress,
      shopCollection: ["squishy-6"], // No incluye anteojos-67
      prestamo67: {
        id: "anteojos-67",
        semana: "2026-W40",
        hasta: new Date(Date.now() - 3600_000).toISOString(), // vencido hace 1 hora
      },
    });
    const rechazoVencido = await updateStudentProfile(alumno.code, {
      capas: [{ id: "anteojos-67" }],
    });
    assert.equal(rechazoVencido?.ok, false, "debe rechazar capas con préstamo vencido");
    assert.ok(rechazoVencido.error.includes("No tenés el accesorio"));

    // 6. Guardar por el campo viejo accessories no borra las capas ni las mascotas 2 y 3 (A2, A8)
    console.log("  6. Verificando que guardar por accessories no borra las capas...");
    await saveProgress({
      ...actualizado.progress,
      avatar: "estudiante-1",
      shopCollection: ["squishy-6", "squishy-7"],
      seasonalCollection: ["sombrero-paja", "bufanda-rayas"],
      avatarCapas: [
        { id: "sombrero-paja" },
        { id: "bufanda-rayas" },
        { id: "squishy-6" },
        { id: "squishy-7" },
      ],
      avatarAccessories: {
        headwear: "sombrero-paja",
        face: "bufanda-rayas",
        pet: "squishy-6",
      },
    });

    const guardadoViejo = await updateStudentProfile(alumno.code, {
      accessories: { headwear: null },
    });
    assert.ok(guardadoViejo && guardadoViejo.ok);
    assert.equal(guardadoViejo.progress.avatarCapas?.length, 3, "debe quitar solo headwear");
    assert.equal(
      guardadoViejo.progress.avatarCapas?.some((c) => c.id === "sombrero-paja"),
      false,
      "sombrero-paja debe haber sido quitado"
    );
    assert.equal(
      guardadoViejo.progress.avatarCapas?.some((c) => c.id === "squishy-7"),
      true,
      "la segunda mascota debe preservarse intacta"
    );
    assert.equal(
      guardadoViejo.progress.avatarCapas?.some((c) => c.id === "bufanda-rayas"),
      true,
      "los demás accesorios deben preservarse intactos"
    );

    // Test de Claude A2: pedido completo de 8 lugares con capas múltiples no borra nada
    console.log("  6b. Verificando que pedido completo de 8 lugares viejo deja intactas las 4 capas (A2)...");
    await saveProgress({
      ...actualizado.progress,
      avatar: "estudiante-1",
      shopCollection: ["squishy-6", "squishy-7", "gorra-67", "vincha-67"],
      seasonalCollection: ["sombrero-paja", "bufanda-rayas"],
      avatarCapas: [
        { id: "gorra-67" },
        { id: "vincha-67", x: 3 },
        { id: "squishy-6" },
        { id: "squishy-7", s: 1.3 },
      ],
      avatarAccessories: {
        headwear: "gorra-67",
        pet: "squishy-6",
      },
    });

    const guardado8Lugares = await updateStudentProfile(alumno.code, {
      accessories: {
        headwear: "gorra-67",
        pet: "squishy-6",
        eyewear: null,
        pendant: null,
        torso: null,
        backpack: null,
        prop: null,
        face: null,
      },
    });
    assert.ok(guardado8Lugares && guardado8Lugares.ok);
    assert.equal(guardado8Lugares.progress.avatarCapas?.length, 4, "debe dejar intactas las 4 capas");
    assert.deepEqual(
      guardado8Lugares.progress.avatarCapas,
      [
        { id: "gorra-67" },
        { id: "vincha-67", x: 3 },
        { id: "squishy-6" },
        { id: "squishy-7", s: 1.3 },
      ],
      "las 4 capas y sus corrimientos/escalas deben mantenerse intactos"
    );

    // 7. La gorra del aniversario no pasa el límite de 5 accesorios (A5, A8)
    console.log("  7. Verificando que gorrito-aniversario no supera el límite de 5 accesorios...");
    const con5Accesorios: StudentProgress = {
      ...actualizado.progress,
      avatarAccessories: {
        face: "bufanda",
        eyewear: "lentes",
      },
      avatarCapas: [
        { id: "gorro" },
        { id: "gafas-sol" },
        { id: "bufanda" },
        { id: "gorra" },
        { id: "lentes" },
      ],
    };
    const conAniv = equiparGorritoAniversario(con5Accesorios);
    assert.equal(conAniv.avatarCapas?.length, 5, "no debe agregar el gorrito si ya tiene 5 accesorios");
    assert.equal(conAniv.avatarAccessories?.headwear, undefined, "no debe equipar el gorrito en accessories");

    // 8. Préstamo vencido saca la capa (devolverPrestamoVencido)
    console.log("  8. Verificando que devolverPrestamoVencido saca la capa...");
    const prestamoVencidoProgress: StudentProgress = {
      ...actualizado.progress,
      prestamo67: {
        id: "anteojos-67",
        semana: "2026-W41",
        hasta: new Date(Date.now() - 3600_000).toISOString(), // vencido hace 1 hora
      },
      avatarCapas: [
        { id: "sombrero-paja" },
        { id: "anteojos-67" },
      ],
      avatarAccessories: {
        headwear: "sombrero-paja",
        eyewear: "anteojos-67",
      },
    };
    const devuelto = devolverPrestamoVencido(prestamoVencidoProgress);
    assert.equal(devuelto.prestamo67, undefined, "debe borrar el préstamo vencido");
    assert.equal(
      devuelto.avatarCapas?.some((c) => c.id === "anteojos-67"),
      false,
      "debe sacar el objeto de avatarCapas"
    );
    assert.equal(
      devuelto.avatarAccessories?.eyewear,
      undefined,
      "debe sacar el objeto de avatarAccessories"
    );
    assert.equal(
      devuelto.avatarCapas?.some((c) => c.id === "sombrero-paja"),
      true,
      "debe mantener los objetos válidos en avatarCapas"
    );

    // 9. Préstamos del torneo devueltos sacan la capa (ordenarPrestadosTorneo)
    console.log("  9. Verificando que ordenarPrestadosTorneo saca la capa...");
    const torneoVencidoProgress: StudentProgress = {
      ...actualizado.progress,
      torneoPrestados: [
        {
          id: "anteojos-67",
          hastaVueltas: 10,
          vence: new Date(Date.now() - 3600_000).toISOString(), // vencido
        },
      ],
      avatarCapas: [
        { id: "anteojos-67" },
      ],
      avatarAccessories: {
        eyewear: "anteojos-67",
      },
    };
    const limpiadoTorneo = ordenarPrestadosTorneo(torneoVencidoProgress);
    assert.equal(
      limpiadoTorneo.avatarCapas?.some((c) => c.id === "anteojos-67"),
      false,
      "debe sacar el premio devuelto de avatarCapas"
    );
    assert.equal(
      limpiadoTorneo.avatarAccessories?.eyewear,
      undefined,
      "debe sacar el premio devuelto de avatarAccessories"
    );

    // 10. Regalar un objeto saca la capa (sinObjeto)
    console.log("  10. Verificando que regalar un objeto saca la capa...");
    const conRegaloProgress: StudentProgress = {
      ...actualizado.progress,
      seasonalCollection: ["sombrero-paja", "bufanda-rayas"],
      avatarCapas: [
        { id: "sombrero-paja" },
        { id: "bufanda-rayas" },
      ],
      avatarAccessories: {
        headwear: "sombrero-paja",
        face: "bufanda-rayas",
      },
    };
    const sinRegalo = sinObjeto(conRegaloProgress, "sombrero-paja");
    assert.equal(
      sinRegalo.avatarCapas?.some((c) => c.id === "sombrero-paja"),
      false,
      "regalar debe quitar el objeto de avatarCapas"
    );
    assert.equal(
      sinRegalo.avatarAccessories?.headwear,
      undefined,
      "regalar debe quitar el objeto de avatarAccessories"
    );
    assert.equal(
      sinRegalo.avatarCapas?.some((c) => c.id === "bufanda-rayas"),
      true,
      "debe conservar los demás objetos en avatarCapas"
    );
  } finally {
    fs.copyFileSync(RESPALDO, DB);
    fs.unlinkSync(RESPALDO);
    console.log("  ♻️ Base de datos restaurada correctamente.");
  }

  console.log("🎉 ¡Todas las pruebas de AG-20 pasaron en verde!");
}

main().catch((err) => {
  console.error("❌ Error en test-avatar-capas:", err);
  if (fs.existsSync(RESPALDO)) {
    fs.copyFileSync(RESPALDO, DB);
    fs.unlinkSync(RESPALDO);
    console.log("  ♻️ Base de datos restaurada tras error.");
  }
  process.exit(1);
});
