const fs = require('fs');

const data = JSON.parse(fs.readFileSync('docs/equipo/capturas/ag32/recorrido-reporte.json', 'utf8'));

const groups = {};

for (const screen of data) {
  for (const prob of screen.problemas) {
    if (prob.tipo === 'letra-chica') {
      const key = prob.selector;
      if (!groups[key]) {
        groups[key] = {
          count: 0,
          pantallas: new Set(),
          muestrasTexto: new Set(),
          detalles: new Set(),
        };
      }
      groups[key].count++;
      groups[key].pantallas.add(screen.pantalla);
      groups[key].muestrasTexto.add(prob.texto);
      groups[key].detalles.add(prob.detalle);
    }
  }
}

const sortedKeys = Object.keys(groups).sort((a, b) => groups[b].count - groups[a].count);

console.log(`Total grupos de selectores: ${sortedKeys.length}`);
for (const k of sortedKeys) {
  const g = groups[k];
  console.log(`\nSelector: ${k} (Ocurrencias: ${g.count})`);
  console.log(`Pantallas: ${Array.from(g.pantallas).join(', ')}`);
  console.log(`Textos: ${Array.from(g.muestrasTexto).slice(0, 5).join(' | ')}`);
  console.log(`Detalles: ${Array.from(g.detalles).join('; ')}`);
}
