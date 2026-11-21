import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { detectTemplateSlots, makeTemplateOverlay } from '../src/utils/templateProcessor.js';

const SCAN_DIRS = [
  path.resolve('src/assets/templates'),
  path.resolve('src/assets/template')
];

const OUTPUT_DIR = path.resolve('public/template-generated');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatTitle(name) {
  return name
    .replace(/^\d+-/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return null;

  const baseName = path.basename(filePath, ext);
  const id = slugify(baseName);
  const name = formatTitle(baseName);

  console.log(`Processing template: ${name} (${id})...`);

  // Check for sidecar JSON
  const sidecarPath = path.join(path.dirname(filePath), `${baseName}.json`);
  let sidecar = {};
  if (fs.existsSync(sidecarPath)) {
    try {
      sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
    } catch {
      // ignore JSON errors
    }
  }

  // Load image with sharp to get raw pixel buffer
  const image = sharp(filePath);
  const meta = await image.metadata();
  const width = meta.width;
  const height = meta.height;

  // Extract raw RGBA
  const raw = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer();

  const imgObj = { data: raw, width, height };

  // Detect slots
  const { slots, mask } = detectTemplateSlots(imgObj, {
    minimumAreaFraction: sidecar.minimumAreaFraction || 0.012,
    minimumFillRatio: 0.65
  });

  console.log(`  -> Found ${slots.length} slots in ${name}`);

  // Save original in output dir
  const origPath = path.join(OUTPUT_DIR, `${id}.original.png`);
  await sharp(filePath)
    .png({ compressionLevel: 6 })
    .toFile(origPath);

  // Generate transparent overlay
  const overlayBuffer = makeTemplateOverlay(imgObj, mask, 2);
  const overlayPath = path.join(OUTPUT_DIR, `${id}.overlay.png`);
  await sharp(overlayBuffer, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 6 })
    .toFile(overlayPath);

  return {
    id: sidecar.id || id,
    name: sidecar.name || name,
    tags: sidecar.tags || [],
    width,
    height,
    aspectRatio: width / height,
    imagePath: `/template-generated/${id}.original.png`,
    overlayPath: `/template-generated/${id}.overlay.png`,
    slots
  };
}

async function run() {
  const seenIds = new Set();
  const manifest = [];

  for (const dir of SCAN_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
          const res = await processImage(fullPath);
          if (res && !seenIds.has(res.id)) {
            seenIds.add(res.id);
            manifest.push(res);
          }
        }
      }
    }
  }

  // Sort manifest by name
  manifest.sort((a, b) => a.name.localeCompare(b.name));

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`✅ Processed ${manifest.length} templates. Manifest written to ${manifestPath}`);
}

run().catch((err) => {
  console.error('Fatal error during build-templates:', err);
  process.exit(1);
});
