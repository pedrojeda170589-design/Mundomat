import { WORLDS } from "@/lib/worlds";

for (const w of WORLDS) {
  console.log(`ID: ${w.id} | Subject: ${w.subject} | Cat: ${w.category} | Name: ${w.name}`);
}
