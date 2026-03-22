/**
 * minify-css.js
 *
 * Reads src/css/styles.css, minifies it with PostCSS + cssnano,
 * and writes the result to src/_includes/critical.css so it can
 * be inlined directly into templates.
 *
 * Usage:  node scripts/minify-css.js
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");

const INPUT = path.resolve(__dirname, "..", "src", "css", "styles.css");
const OUTPUT = path.resolve(__dirname, "..", "src", "_includes", "critical.css");

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Source CSS not found: ${INPUT}`);
    process.exit(1);
  }

  const css = fs.readFileSync(INPUT, "utf8");

  const result = await postcss([cssnano({ preset: "default" })]).process(css, {
    from: INPUT,
    to: OUTPUT,
  });

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT, result.css, "utf8");
  console.log(`Minified CSS written to ${OUTPUT}`);

  if (result.map) {
    fs.writeFileSync(`${OUTPUT}.map`, result.map.toString(), "utf8");
    console.log(`Source map written to ${OUTPUT}.map`);
  }
}

main();
