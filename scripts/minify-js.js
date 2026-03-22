/**
 * minify-js.js
 *
 * Reads src/js/main.js, minifies it with Terser,
 * and writes the result to dist/js/main.min.js.
 *
 * Usage:  node scripts/minify-js.js
 */

const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const INPUT = path.resolve(__dirname, "..", "src", "js", "main.js");
const OUTPUT = path.resolve(__dirname, "..", "dist", "js", "main.min.js");

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Source JS not found: ${INPUT}`);
    process.exit(1);
  }

  const code = fs.readFileSync(INPUT, "utf8");

  const result = await minify(code, {
    compress: {
      drop_console: false,
      passes: 2,
    },
    mangle: true,
    output: {
      comments: false,
    },
  });

  if (result.error) {
    console.error("Terser minification error:", result.error);
    process.exit(1);
  }

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT, result.code, "utf8");
  console.log(`Minified JS written to ${OUTPUT}`);
}

main();
