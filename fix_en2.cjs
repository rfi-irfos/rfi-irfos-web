const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'frontend', 'src', 'content');
let e = fs.readFileSync(path.join(root, 'en.ts'), 'utf8');
function swap(s, from, to) {
  const i = s.indexOf(from);
  if (i === -1) { console.error('NOT FOUND:', JSON.stringify(from).slice(0,90)); process.exitCode = 1; return s; }
  return s.slice(0, i) + to + s.slice(i + from.length);
}
// Competitive Trace EN (still old)
e = swap(e,
  "By the time a competitor\\'s pivot hits the press, it has usually been sitting in their code for months. We read the code first: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing.\\n\\nBenchmarked across six layers of the corpus - code, SDK, data-flow, tracker, privacy, supply-chain - so you\\'re acting on evidence while everyone else is still speculating in the boardroom.\\n\\nThe same corpus we use for disclosures. They have no idea they\\'re being watched.",
  "A competitor's strategic shift usually sits in their code for months before it reaches the press. We observe that change where it forms: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing. Across six corpus layers (code, SDK, data-flow, trackers, privacy, supply-chain), we translate the observation into a defensible relationship between technical change and business meaning. You act on evidence while others are still speculating. The observed corpus is the same one we use for disclosures.");
// Sector Map EN (still old)
e = swap(e,
  "A snapshot is stale the moment it prints. You get the risk profile of every major player in your sector, across all nine intelligence layers, refreshed every quarter - so you see the shift while it\\'s still forming, not after it\\'s already priced in.\\n\\nFirst report within 14 calendar days. After that, you\\'re always looking at the sector three months ahead of whoever is still reading last year\\'s market report.",
  "A snapshot is stale the moment it prints. We maintain the risk profile of every relevant actor in your sector across all nine intelligence layers as a continuous intelligence picture - refreshed every quarter. The capability is not the delivery of a document, but the continuous observation of how relationships, dependencies and exposures shift across the sector. You see the change forming, not after it has already been priced in. First picture within 14 calendar days; after that the view stays three months ahead of the market.");
fs.writeFileSync(path.join(root, 'en.ts'), e, 'utf8');
console.log('en.ts Competitive + Sector fixed');
