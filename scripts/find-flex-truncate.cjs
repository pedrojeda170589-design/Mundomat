const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const files = walk('./src');
const hits = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  // Regex to match className attributes even if multiline
  const re = /className\s*=\s*({?["'`][\s\S]*?["'`]}?)/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const raw = match[1];
    // check if raw contains 'truncate'
    if (/\btruncate\b/.test(raw)) {
      // check if it has \bflex\b or \binline-flex\b
      if (/\bflex\b/.test(raw) || /\binline-flex\b/.test(raw)) {
        // compute line number
        const linesBefore = content.substring(0, match.index).split('\n').length;
        hits.push({ file: f, line: linesBefore, raw: raw.replace(/\s+/g, ' ').slice(0, 120) });
      }
    }
  }
}

console.log('Hits found:', hits.length);
hits.forEach(h => console.log(`${h.file}:${h.line} -> ${h.raw}`));
