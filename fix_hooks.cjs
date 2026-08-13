const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'frontend', 'src', 'content');
const en = fs.readFileSync(path.join(root, 'en.ts'), 'utf8');
let e = en;
function swap(s, from, to) {
  const i = s.indexOf(from);
  if (i === -1) { console.error('NOT FOUND:', JSON.stringify(from).slice(0,90)); process.exitCode = 1; return s; }
  return s.slice(0, i) + to + s.slice(i + from.length);
}
e = swap(e,
  "Know before it\\'s public. One query, hundreds of apps, an answer nobody else can pull.",
  "Know before it\\'s public. One question, the full app ecosystem, an answer with a provenance chain.");
e = swap(e,
  "The whole sector, mapped and refreshed before your competitors know the ground moved.",
  "Your entire sector as a connected intelligence picture - re-resolved every quarter.");
e = swap(e,
  "A standing early-warning system for your sector. Built so you\\'re never the last to know.",
  "A standing early-warning system for your sector - continuous observation, not a monthly report.");
// Competitive Trace hook (EN) - find it
e = swap(e,
  "See the move before they announce it.",
  "See the move before they announce it - in the code, not the press release.");
fs.writeFileSync(path.join(root, 'en.ts'), e, 'utf8');
console.log('en.ts hooks fixed');
