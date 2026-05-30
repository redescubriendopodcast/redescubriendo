// Fix remaining Spanish role_en fields
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data.js');
const raw = fs.readFileSync(filePath, 'utf8');
const i = raw.indexOf('{');
const j = raw.lastIndexOf('}');
const data = JSON.parse(raw.slice(i, j + 1));

const ROLE_FIXES = {
  "kevin_knuth":         "The Physicist Who Quantified the Impossibility of the Tic Tac",
  "almirante_thomas_wilson": "The DIA Vice-Director Who Was Denied Access",
  "edgar_mitchell":      "The Apollo 14 Astronaut and Custodian of the Wilson-Davis Memo",
  "john_e_mack":         "The Harvard Psychiatrist Who Paid the Price for Taking Abductions Seriously",
  "anna_paulina_luna":   "The Congresswoman Who Coordinated the Trump Declassification",
  "eric_burlison":       "The Legislator Who Brought Grusch onto the Congressional Staff",
  "kirsan_ilyumzhinov":  "The Sitting Leader Who Declared 'I Was Invited by Aliens'",
  "haim_eshed":          "The Israeli General Who Spoke of the 'Galactic Federation'",
  "nick_pope":           "The Real-Life 'X-Files Agent' of the British MoD",
  "russell_targ":        "The Laser Physicist Who Co-founded Remote Viewing at Stanford",
  "roberto_pinotti":     "The Dean of Italian Ufology and the 1933 Magenta Case",
  "tim_phillips":        "Kirkpatrick's Successor as AARO Director",
};

let fixed = 0;
for (const node of data.nodes) {
  const r = ROLE_FIXES[node.id];
  if (r) { node.role_en = r; fixed++; }
}
console.log(`✅ Roles fixed: ${fixed}`);

// Verify: any remaining Spanish role_en?
const still = data.nodes.filter(n => n.role && n.role_en === n.role && n.role.length > 3);
console.log(`⚠️  Still Spanish roles: ${still.length}`, still.map(n => n.id).join(', '));

const out = `// REDESCUBRIENDO — Dataset
// Nodes: ${data.nodes.length} — Edges: ${data.edges.length} — Threads: ${data.threads.length}
// Generado automáticamente por scripts/build-data.js. NO EDITAR A MANO.
// Para regenerar: npm run build

window.RDC_DATA = ${JSON.stringify(data, null, 2)};
`;
fs.writeFileSync(filePath, out, 'utf8');
console.log('✅ data.js written.');
