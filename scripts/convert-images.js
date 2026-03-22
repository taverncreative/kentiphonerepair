/**
 * convert-images.js
 *
 * Converts all JPG / PNG files found in Images/ subdirectories to WebP,
 * copies existing .webp files and favicon.ico, resizes anything wider
 * than 1200 px, and writes everything to src/img/.
 *
 * Usage:  node scripts/convert-images.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT_DIR = path.resolve(__dirname, "..", "Images");
const OUTPUT_DIR = path.resolve(__dirname, "..", "src", "img");
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 80;

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Recursively collect every file under a directory
function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertImage(srcPath, destPath) {
  const image = sharp(srcPath);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if wider than MAX_WIDTH, preserving aspect ratio
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(destPath);
}

async function main() {
  ensureDir(OUTPUT_DIR);

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  const files = walk(INPUT_DIR);

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, ext);

    // Determine the relative subfolder inside Images/
    const relDir = path.relative(INPUT_DIR, path.dirname(filePath));
    const outDir = path.join(OUTPUT_DIR, relDir);
    ensureDir(outDir);

    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      // Convert to WebP
      const destPath = path.join(outDir, `${baseName}.webp`);
      try {
        await convertImage(filePath, destPath);
        console.log(`Converted: ${filePath} → ${destPath}`);
      } catch (err) {
        console.error(`Failed to convert ${filePath}: ${err.message}`);
      }
    } else if (ext === ".webp") {
      // Copy existing WebP files (resize if needed)
      const destPath = path.join(outDir, `${baseName}.webp`);
      try {
        const image = sharp(filePath);
        const metadata = await image.metadata();
        let pipeline = image;
        if (metadata.width && metadata.width > MAX_WIDTH) {
          pipeline = pipeline.resize({
            width: MAX_WIDTH,
            withoutEnlargement: true,
          });
        }
        await pipeline.webp({ quality: WEBP_QUALITY }).toFile(destPath);
        console.log(`Copied (WebP): ${filePath} → ${destPath}`);
      } catch (err) {
        console.error(`Failed to copy WebP ${filePath}: ${err.message}`);
      }
    } else if (path.basename(filePath).toLowerCase() === "favicon.ico") {
      // Copy favicon.ico as-is
      const destPath = path.join(outDir, "favicon.ico");
      try {
        fs.copyFileSync(filePath, destPath);
        console.log(`Copied: ${filePath} → ${destPath}`);
      } catch (err) {
        console.error(`Failed to copy ${filePath}: ${err.message}`);
      }
    }
  }

  console.log("\nImage conversion complete.");
}

main();
