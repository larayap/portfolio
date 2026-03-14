/**
 * Copia todos los skills de .agents/skills/ a .cursor/skills/
 * para que Cursor los reconozca. Ejecutar después de: npx skills add ...
 *
 * Uso: node scripts/sync-skills-to-cursor.cjs
 * o:  npm run skills:sync
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, ".agents", "skills");
const destDir = path.join(root, ".cursor", "skills");

if (!fs.existsSync(srcDir)) {
  console.log(".agents/skills no existe. Nada que sincronizar.");
  process.exit(0);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const entries = fs.readdirSync(srcDir, { withFileTypes: true });
const dirs = entries.filter((e) => e.isDirectory());

if (dirs.length === 0) {
  console.log(".agents/skills está vacío. Nada que sincronizar.");
  process.exit(0);
}

for (const d of dirs) {
  const src = path.join(srcDir, d.name);
  const dest = path.join(destDir, d.name);
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log("Sync:", d.name);
}

console.log("Listo. Skills en .cursor/skills:", dirs.map((d) => d.name).join(", "));
