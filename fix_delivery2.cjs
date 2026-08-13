const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'frontend', 'src', 'content');

// DE: trim the two over-long delivery texts
let d = fs.readFileSync(path.join(root, 'de.ts'), 'utf8');
d = d.split("delivery: 'Erstes Briefing innerhalb von 14 Kalendertagen, danach monatlich.' }")
      .join("delivery: 'Briefing ab 14 Kalendertagen, danach monatlich.' }");
d = d.split("delivery: 'Vollständiger Bericht innerhalb von 7 Kalendertagen, Umfang individuell abgestimmt.' }")
      .join("delivery: 'Bericht ab 7 Kalendertagen, Umfang individuell.' }");
fs.writeFileSync(path.join(root, 'de.ts'), d, 'utf8');
console.log('de.ts delivery trimmed');

// EN
let e = fs.readFileSync(path.join(root, 'en.ts'), 'utf8');
e = e.split("delivery: 'First briefing within 14 calendar days, then monthly.' }")
      .join("delivery: 'Briefing from 14 calendar days, then monthly.' }");
e = e.split("delivery: 'Full report within 7 calendar days, scope agreed individually.' }")
      .join("delivery: 'Report from 7 calendar days, scope individual.' }");
fs.writeFileSync(path.join(root, 'en.ts'), e, 'utf8');
console.log('en.ts delivery trimmed');
