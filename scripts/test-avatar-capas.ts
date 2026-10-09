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

    // Asegurar que el alumno tiene mundos completados y una colección
    const prog = await getProgress(alumno.code);
    await saveProgress({
      ...prog,
      completedWorlds: [1, 2, 3, 4, 5],
      seasonalCollection: ["gorra", "lentes", "mascota-zorrito"],
      avatarCapas: undefined,
      avatarAccessories: {},
    });

    // Guardar capas válidas mediante updateStudentProfile
    const actualizado = await updateStudentProfile(alumno.code, {
      capas: [
        { id: "gorra", x: 2, y: 1 },
        { id: "lentes", s: 1.1 },
      ],
    });
    assert.ok(actualizado, "updateStudentProfile debe aceptar capas válidas");
    assert.equal(actualizado.avatarCapas?.length, 2);
    assert.equal(actualizado.avatarCapas?.[0].id, "gorra");
    assert.equal(actualizado.avatarCapas?.[1].id, "lentes");
    // avatarAccessories debe sincronizarse
    assert.equal(actualizado.avatarAccessories?.headwear, "gorra");
    assert.equal(actualizado.avatarAccessories?.eyewear, "lentes");

    // Intentar guardar un objeto que el alumno NO tiene
    const fallido = await updateStudentProfile(alumno.code, {
      capas: [{ id: "casco-vikingo" }],
    });
    assert.equal(fallido, null, "debe rechazar capas con objetos que no tiene");

    // 5. Préstamo vencido saca la capa
    console.log("  5. Verificando que préstamos vencidos sacan la capa...");
    const prestamoVencidoProgress: StudentProgress = {
      ...actualizado,
      prestamo67: {
        id: "lentes",
        semana: "2026-W41",
        hasta: new Date(Date.now() - 3600_000).toISOString(), // vencido hace 1 hora
      },
      avatarCapas: [
        { id: "gorra" },
        { id: "lentes" },
      ],
      avatarAccessories: {
        headwear: "gorra",
        eyewear: "lentes",
      },
    };
    const devuelto = devolverPrestamoVencido(prestamoVencidoProgress);
    assert.equal(devuelto.prestamo67, undefined, "debe borrar el préstamo vencido");
    assert.equal(
      devuelto.avatarCapas?.some((c) => c.id === "lentes"),
      false,
      "debe sacar el objeto de avatarCapas"
    );
    assert.equal(
      devuelto.avatarAccessories?.eyewear,
      undefined,
      "debe sacar el objeto de avatarAccessories"
    );
    assert.equal(
      devuelto.avatarCapas?.some((c) => c.id === "gorra"),
      true,
      "debe mantener los objetos válidos en avatarCapas"
    );

    // 6. Préstamos del torneo devueltos sacan la capa
    console.log("  6. Verificando que premios del torneo devueltos sacan la capa...");
    const torneoVencidoProgress: StudentProgress = {
      ...actualizado,
      torneoPrestados: [
        {
          id: "gorra",
          hastaVueltas: 10,
          vence: new Date(Date.now() - 3600_000).toISOString(), // vencido
        },
      ],
      avatarCapas: [
        { id: "gorra" },
      ],
      avatarAccessories: {
        headwear: "gorra",
      },
    };
    const limpiadoTorneo = ordenarPrestadosTorneo(torneoVencidoProgress);
    assert.equal(
      limpiadoTorneo.avatarCapas?.some((c) => c.id === "gorra"),
      false,
      "debe sacar el premio devuelto de avatarCapas"
    );
    assert.equal(
      limpiadoTorneo.avatarAccessories?.headwear,
      undefined,
      "debe sacar el premio devuelto de avatarAccessories"
    );

    // 7. Regalar un objeto saca la capa
    console.log("  7. Verificando que regalar un objeto saca la capa...");
    const conRegaloProgress: StudentProgress = {
      ...actualizado,
      seasonalCollection: ["gorra", "lentes"],
      avatarCapas: [
        { id: "gorra" },
        { id: "lentes" },
      ],
      avatarAccessories: {
        headwear: "gorra",
        eyewear: "lentes",
      },
    };
    const sinRegalo = sinObjeto(conRegaloProgress, "gorra");
    assert.equal(
      sinRegalo.avatarCapas?.some((c) => c.id === "gorra"),
      false,
      "regalar debe quitar el objeto de avatarCapas"
    );
    assert.equal(
      sinRegalo.avatarAccessories?.headwear,
      undefined,
      "regalar debe quitar el objeto de avatarAccessories"
    );
    assert.equal(
      sinRegalo.avatarCapas?.some((c) => c.id === "lentes"),
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
