import { WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";

console.log("Sample G1:", GRADE1_WORLDS[0].name, "| Obj:", GRADE1_WORLDS[0].objective, "| Cont:", GRADE1_WORLDS[0].contents);
console.log("Sample G2:", GRADE2_WORLDS[0].name, "| Obj:", GRADE2_WORLDS[0].objective, "| Cont:", GRADE2_WORLDS[0].contents);
console.log("Sample G3[0]:", WORLDS[0].name, "| Obj:", WORLDS[0].objective, "| Cont:", WORLDS[0].contents);
console.log("Sample G3 with Obj:", WORLDS.filter(w => w.objective).map(w => ({ id: w.id, name: w.name, obj: w.objective, cont: w.contents })));
