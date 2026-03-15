#!/usr/bin/env node
/**
 * Captura screenshot de una URL y lo guarda en public/
 * Uso: node scripts/screenshot-site.mjs <url> <output>
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const url = process.argv[2] || "https://psicologamargaritapardo.cl/";
const output = process.argv[3] || path.join(rootDir, "public", "margarita.png");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
  await page.screenshot({
    path: output,
    fullPage: false,
    type: "png",
  });
  await browser.close();
  console.log(`Screenshot guardado en: ${output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
