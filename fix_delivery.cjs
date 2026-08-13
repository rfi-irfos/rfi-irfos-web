const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'frontend', 'src', 'content');

// DE
let d = fs.readFileSync(path.join(root, 'de.ts'), 'utf8');
d = d.replace(
  "delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen; laufender Support nach Vereinbarung.' }",
  "delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen.' }"
);
fs.writeFileSync(path.join(root, 'de.ts'), d, 'utf8');
console.log('de.ts Full Spectrum delivery trimmed');

// EN
let e = fs.readFileSync(path.join(root, 'en.ts'), 'utf8');
e = e.replace(
  "delivery: 'Definition of Done + schedule within 14 calendar days; ongoing support by agreement.' }",
  "delivery: 'Definition of Done + schedule within 14 calendar days.' }"
);
fs.writeFileSync(path.join(root, 'en.ts'), e, 'utf8');
console.log('en.ts Full Spectrum delivery trimmed');
