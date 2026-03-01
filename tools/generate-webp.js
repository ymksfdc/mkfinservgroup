const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const OVERRIDE = process.argv.includes('--force');

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const inputPath = path.join(IMAGES_DIR, file);
  const outName = `${base}@2x.webp`;
  const outPath = path.join(IMAGES_DIR, outName);

  if (!OVERRIDE && fs.existsSync(outPath)) {
    console.log(`Skipping (exists): ${outName}`);
    return;
  }

  try {
    const img = sharp(inputPath);
    const meta = await img.metadata();
    const srcWidth = meta.width || 800;
    // target width: 2x source width, but cap at 2400 to avoid huge files
    let target = Math.min(Math.round(srcWidth * 2), 2400);
    // If source width looks suspiciously large, use sensible default 800->1600
    if (srcWidth > 2000) target = Math.min(1600, srcWidth);

    await img
      .resize({ width: target })
      .webp({ quality: 80 })
      .toFile(outPath);

    console.log(`Created: ${outName} (${target}px)`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('images directory not found:', IMAGES_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  // Only process raster sources, skip files that are already @2x.webp
  const sources = files.filter(f => !/@2x\.webp$/i.test(f) && !/logo@2x\.webp$/i.test(f));

  console.log(`Found ${sources.length} candidate images.`);
  for (const f of sources) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.webp' && /@2x\.webp$/i.test(f)) continue; // skip
    await processFile(f);
  }
}

main();
