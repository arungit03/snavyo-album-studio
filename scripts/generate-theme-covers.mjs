import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const THEMES_CONFIG = [
  // Wedding
  {
    id: 'wedding-classic',
    name: 'Classic Royal',
    category: 'Wedding',
    photoId: '1583939003579-730e3918a45a',
    palette: { primary: '#601124', accent: '#D4AF62', secondary: '#3D0A16' },
    subtitle: 'Grand Indian Royal Wedding Album'
  },
  {
    id: 'wedding-modern',
    name: 'Modern Minimal',
    category: 'Wedding',
    photoId: '1519741497674-611481863552',
    palette: { primary: '#2D3142', accent: '#E0A96D', secondary: '#1A1C24' },
    subtitle: 'Clean Editorial Contemporary Photobook'
  },
  {
    id: 'wedding-cinematic',
    name: 'Cinematic Gold',
    category: 'Wedding',
    photoId: '1511285560929-80b456fea0bc',
    palette: { primary: '#4A2C00', accent: '#FFD700', secondary: '#231500' },
    subtitle: 'Golden Hour Cinematic Wedding Story'
  },

  // Engagement
  {
    id: 'engagement-romantic',
    name: 'Romantic Blush',
    category: 'Engagement',
    photoId: '1522673607200-164d1b6ce486',
    palette: { primary: '#8B4F67', accent: '#F4C2C2', secondary: '#4E2737' },
    subtitle: 'Soft Pastel Romance Keepsake'
  },
  {
    id: 'engagement-elegant',
    name: 'Elegant Vows',
    category: 'Engagement',
    photoId: '1606800052052-a08af7148866',
    palette: { primary: '#4A5568', accent: '#E2E8F0', secondary: '#2D3748' },
    subtitle: 'Timeless Ring Ceremony & Vows'
  },
  {
    id: 'engagement-gold',
    name: 'Golden Promise',
    category: 'Engagement',
    photoId: '1515934751635-c81c6bc9a2d8',
    palette: { primary: '#7B4B1B', accent: '#E5A93B', secondary: '#452A0F' },
    subtitle: 'Sunset Golden Hour Promise Book'
  },

  // Reception
  {
    id: 'reception-grand',
    name: 'Grand Evening',
    category: 'Reception',
    photoId: '1469371670807-013ccf25f16a',
    palette: { primary: '#1A1F36', accent: '#D4AF62', secondary: '#0D101C' },
    subtitle: 'Illuminated Ballroom Grand Celebration'
  },
  {
    id: 'reception-royal',
    name: 'Royal Celebration',
    category: 'Reception',
    photoId: '1520854221256-17451cc331bf',
    palette: { primary: '#2D1B4E', accent: '#C5A059', secondary: '#180E2B' },
    subtitle: 'Chandelier Night & Champagne Toasts'
  },
  {
    id: 'reception-gala',
    name: 'Gala Night',
    category: 'Reception',
    photoId: '1511795409834-ef04bbd61622',
    palette: { primary: '#1B263B', accent: '#F0E6D2', secondary: '#0D131D' },
    subtitle: 'Midnight Sparkler Festive Reception'
  },

  // Haldi
  {
    id: 'haldi-sunshine',
    name: 'Sunshine Haldi',
    category: 'Haldi',
    photoId: '1610030469983-98e550d6193c',
    palette: { primary: '#D97706', accent: '#FEF3C7', secondary: '#78350F' },
    subtitle: 'Festive Marigold Turmeric Rituals'
  },
  {
    id: 'haldi-marigold',
    name: 'Marigold Fest',
    category: 'Haldi',
    photoId: '1596461404969-9ae70f2830c1',
    palette: { primary: '#EA580C', accent: '#FDE047', secondary: '#7C2D12' },
    subtitle: 'Joyous Petals & Golden Joy'
  },
  {
    id: 'haldi-golden',
    name: 'Golden Turmeric',
    category: 'Haldi',
    photoId: '1532712938310-34cb3982ef74',
    palette: { primary: '#CA8A04', accent: '#FEF08A', secondary: '#713F12' },
    subtitle: 'Auspicious Golden Celebration'
  },

  // Mehendi
  {
    id: 'mehendi-emerald',
    name: 'Emerald Henna',
    category: 'Mehendi',
    photoId: '1560707303-4e980ce876ad',
    palette: { primary: '#065F46', accent: '#A7F3D0', secondary: '#022C22' },
    subtitle: 'Intricate Bridal Henna Patterns'
  },
  {
    id: 'mehendi-floral',
    name: 'Floral Vines',
    category: 'Mehendi',
    photoId: '1609357605129-26f69add5d6e',
    palette: { primary: '#166534', accent: '#BBF7D0', secondary: '#052E16' },
    subtitle: 'Botanical Henna & Green Festivities'
  },
  {
    id: 'mehendi-peacock',
    name: 'Peacock Dance',
    category: 'Mehendi',
    photoId: '1595152772835-219674b2a8a6',
    palette: { primary: '#0F766E', accent: '#99F6E4', secondary: '#042F2E' },
    subtitle: 'Traditional Henna Motifs & Merriment'
  },

  // Sangeet
  {
    id: 'sangeet-rhythm',
    name: 'Rhythm Night',
    category: 'Sangeet',
    photoId: '1516450360452-9312f5e86fc7',
    palette: { primary: '#7C3AED', accent: '#FDE047', secondary: '#4C1D95' },
    subtitle: 'Musical Beats & Dance Floor Energy'
  },
  {
    id: 'sangeet-dhol',
    name: 'Dhol Beats',
    category: 'Sangeet',
    photoId: '1545128485-c400e7702796',
    palette: { primary: '#BE185D', accent: '#FBCFE8', secondary: '#700736' },
    subtitle: 'Celebration of Sound & Joy'
  },
  {
    id: 'sangeet-stage',
    name: 'Stage Lights',
    category: 'Sangeet',
    photoId: '1492684223066-81342ee5ff30',
    palette: { primary: '#6D28D9', accent: '#F472B6', secondary: '#3B0764' },
    subtitle: 'Dynamic Stage Performance Album'
  },

  // Baby & Kids
  {
    id: 'baby-soft',
    name: 'Soft Cloud',
    category: 'Baby and Kids',
    photoId: '1555252333-9f8e92e65df9',
    palette: { primary: '#818CF8', accent: '#E0E7FF', secondary: '#3730A3' },
    subtitle: 'Newborn Pure Memories & Sweet Sleep'
  },
  {
    id: 'baby-playful',
    name: 'Playful Dreams',
    category: 'Baby and Kids',
    photoId: '1502086223501-7ea6ecd79368',
    palette: { primary: '#38BDF8', accent: '#E0F2FE', secondary: '#0369A1' },
    subtitle: 'Toddler Giggles & Milestone Moments'
  },
  {
    id: 'baby-tiny',
    name: 'Tiny Toes',
    category: 'Baby and Kids',
    photoId: '1519689680058-324335c77eba',
    palette: { primary: '#FB7185', accent: '#FFE4E6', secondary: '#9F1239' },
    subtitle: 'Tiny Hands, Little Feet, Big Love'
  },

  // Travel
  {
    id: 'travel-adventure',
    name: 'Wanderlust',
    category: 'Travel',
    photoId: '1469854523086-cc02fe5d8800',
    palette: { primary: '#0D9488', accent: '#CCFBF1', secondary: '#115E59' },
    subtitle: 'Scenic Mountain & Road Expeditions'
  },
  {
    id: 'travel-journey',
    name: 'Journal Pages',
    category: 'Travel',
    photoId: '1488646953014-85cb44e25828',
    palette: { primary: '#854D0E', accent: '#FEF9C3', secondary: '#422006' },
    subtitle: 'Vintage Scrapbook & Travel Diaries'
  },
  {
    id: 'travel-horizon',
    name: 'Horizon Lines',
    category: 'Travel',
    photoId: '1507525428034-b723cf961d3e',
    palette: { primary: '#0284C7', accent: '#BAE6FD', secondary: '#075985' },
    subtitle: 'Coastal Sunsets & Ocean Horizons'
  }
];

const OUTPUT_DIR = path.resolve('public/themes');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchImageBuffer(photoId) {
  const url = `https://images.unsplash.com/photo-${photoId}?w=1000&auto=format&fit=crop&q=80`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch photo ${photoId}: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Generate cover SVG overlay
function buildCoverSvgOverlay(theme, width, height) {
  const name = escapeXml(theme.name.toUpperCase());
  const category = escapeXml(theme.category.toUpperCase());
  const subtitle = escapeXml(theme.subtitle);
  const accent = theme.palette.accent;

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.4" />
          <stop offset="35%" stop-color="#000000" stop-opacity="0.05" />
          <stop offset="65%" stop-color="#000000" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/>
        </filter>
      </defs>

      <!-- Vignette Gradient -->
      <rect width="${width}" height="${height}" fill="url(#vignette)" />

      <!-- Ornate Outer Foil Border -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="6"
            fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.85" />
      <rect x="26" y="26" width="${width - 52}" height="${height - 52}" rx="4"
            fill="none" stroke="${accent}" stroke-width="0.75" stroke-opacity="0.6" stroke-dasharray="4,3" />

      <!-- Corner Brackets -->
      <path d="M 16 34 L 16 16 L 34 16" fill="none" stroke="${accent}" stroke-width="3" />
      <path d="M ${width - 16} 34 L ${width - 16} 16 L ${width - 34} 16" fill="none" stroke="${accent}" stroke-width="3" />
      <path d="M 16 ${height - 34} L 16 ${height - 16} L 34 ${height - 16}" fill="none" stroke="${accent}" stroke-width="3" />
      <path d="M ${width - 16} ${height - 34} L ${width - 16} ${height - 16} L ${width - 34} ${height - 16}" fill="none" stroke="${accent}" stroke-width="3" />

      <!-- Top Badge -->
      <g filter="url(#shadow)">
        <rect x="${width / 2 - 110}" y="36" width="220" height="26" rx="13"
              fill="rgba(20, 20, 24, 0.75)" stroke="${accent}" stroke-width="1" stroke-opacity="0.8"/>
        <text x="${width / 2}" y="53" font-family="sans-serif" font-size="10" font-weight="700"
              letter-spacing="2" fill="${accent}" text-anchor="middle">SNAVYO STUDIO</text>
      </g>

      <!-- Bottom Title Banner & Typography -->
      <g filter="url(#shadow)">
        <text x="${width / 2}" y="${height - 105}" font-family="sans-serif" font-size="11" font-weight="700"
              letter-spacing="3" fill="${accent}" text-anchor="middle">${category} COLLECTION</text>

        <text x="${width / 2}" y="${height - 65}" font-family="Georgia, serif" font-size="34" font-weight="bold"
              letter-spacing="1" fill="#FFFFFF" text-anchor="middle">${name}</text>

        <line x1="${width / 2 - 80}" y1="${height - 50}" x2="${width / 2 + 80}" y2="${height - 50}"
              stroke="${accent}" stroke-width="1.5" stroke-opacity="0.9" />

        <text x="${width / 2}" y="${height - 34}" font-family="sans-serif" font-size="11"
              letter-spacing="1.5" fill="rgba(255, 255, 255, 0.88)" text-anchor="middle">${subtitle}</text>
      </g>
    </svg>
  `);
}

// Generate spread preview SVG overlay (simulating an album spread with photo frames)
function buildSpreadSvgOverlay(theme, pageNum, width, height) {
  const accent = theme.palette.accent;
  const name = escapeXml(theme.name);

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spreadBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#18151D" stop-opacity="0.6" />
          <stop offset="50%" stop-color="#0E0C12" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#18151D" stop-opacity="0.6" />
        </linearGradient>
      </defs>

      <!-- Dark luxury backing -->
      <rect width="${width}" height="${height}" fill="url(#spreadBg)" />

      <!-- Center spine divider -->
      <line x1="${width / 2}" y1="10" x2="${width / 2}" y2="${height - 10}" stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-dasharray="3,3" />

      <!-- Outer border -->
      <rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.4" />

      <!-- Page Spread Frames simulation -->
      ${pageNum === 1 ? `
        <!-- Left: Large Featured Hero frame -->
        <rect x="25" y="25" width="${width / 2 - 45}" height="${height - 50}" rx="4" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.7" />
        <text x="${width / 4}" y="${height / 2}" font-family="Georgia, serif" font-size="13" fill="${accent}" text-anchor="middle">Featured Portrait</text>

        <!-- Right: Wedding details typography -->
        <text x="${3 * width / 4}" y="${height / 2 - 25}" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${name}</text>
        <text x="${3 * width / 4}" y="${height / 2 + 5}" font-family="sans-serif" font-size="10" letter-spacing="2" fill="${accent}" text-anchor="middle">THE CELEBRATION</text>
        <line x1="${3 * width / 4 - 50}" y1="${height / 2 + 18}" x2="${3 * width / 4 + 50}" y2="${height / 2 + 18}" stroke="${accent}" stroke-width="1" />
        <text x="${3 * width / 4}" y="${height / 2 + 35}" font-family="sans-serif" font-size="9" fill="rgba(255,255,255,0.7)" text-anchor="middle">Spread 01 — Ceremony</text>
      ` : pageNum === 2 ? `
        <!-- Editorial 4-photo layout -->
        <rect x="25" y="25" width="${width / 4 - 20}" height="${height - 50}" rx="3" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
        <rect x="${width / 4 + 15}" y="25" width="${width / 4 - 25}" height="${height - 50}" rx="3" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
        <rect x="${width / 2 + 15}" y="25" width="${width / 4 - 25}" height="${height - 50}" rx="3" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
        <rect x="${3 * width / 4 + 5}" y="25" width="${width / 4 - 20}" height="${height - 50}" rx="3" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
        <text x="${width / 2}" y="${height - 16}" font-family="sans-serif" font-size="8" letter-spacing="1" fill="${accent}" text-anchor="middle">Editorial Trio &amp; Solo Frames · Spread 02</text>
      ` : `
        <!-- Left: Duo portraits -->
        <rect x="25" y="25" width="${width / 2 - 45}" height="${height / 2 - 32}" rx="3" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
        <rect x="25" y="${height / 2 + 7}" width="${width / 2 - 45}" height="${height / 2 - 32}" rx="3" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />

        <!-- Right: Panorama frame -->
        <rect x="${width / 2 + 20}" y="25" width="${width / 2 - 45}" height="${height - 50}" rx="4" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.7" />
        <text x="${3 * width / 4}" y="${height / 2}" font-family="Georgia, serif" font-size="13" fill="${accent}" text-anchor="middle">Grand Panorama</text>
        <text x="${width / 2}" y="${height - 16}" font-family="sans-serif" font-size="8" letter-spacing="1" fill="${accent}" text-anchor="middle">Moments &amp; Memories · Spread 03</text>
      `}
    </svg>
  `);
}

async function run() {
  console.log(`Starting generation of 24 theme covers and 72 spread previews...`);
  const cache = new Map();

  for (let i = 0; i < THEMES_CONFIG.length; i++) {
    const theme = THEMES_CONFIG[i];
    console.log(`[${i + 1}/${THEMES_CONFIG.length}] Processing ${theme.name} (${theme.id})...`);

    // 1. Get photo buffer (cached)
    let photoBuf = cache.get(theme.photoId);
    if (!photoBuf) {
      photoBuf = await fetchImageBuffer(theme.photoId);
      cache.set(theme.photoId, photoBuf);
    }

    // 2. Generate cover image (800x600, 4:3)
    const coverWidth = 800;
    const coverHeight = 600;
    const baseCover = await sharp(photoBuf)
      .resize(coverWidth, coverHeight, { fit: 'cover', position: 'center' })
      .toBuffer();

    const coverOverlay = buildCoverSvgOverlay(theme, coverWidth, coverHeight);
    const coverOutPath = path.join(OUTPUT_DIR, `${theme.id}-cover.jpg`);

    await sharp(baseCover)
      .composite([{ input: coverOverlay }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(coverOutPath);

    // 3. Generate 3 spread preview pages (600x300, 2:1)
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const spreadWidth = 600;
      const spreadHeight = 300;
      const baseSpread = await sharp(photoBuf)
        .resize(spreadWidth, spreadHeight, { fit: 'cover', position: pageNum === 1 ? 'center' : pageNum === 2 ? 'top' : 'bottom' })
        .blur(pageNum === 1 ? 0.3 : 1)
        .toBuffer();

      const spreadOverlay = buildSpreadSvgOverlay(theme, pageNum, spreadWidth, spreadHeight);
      const spreadOutPath = path.join(OUTPUT_DIR, `${theme.id}-preview-${pageNum}.jpg`);

      await sharp(baseSpread)
        .composite([{ input: spreadOverlay }])
        .jpeg({ quality: 84, mozjpeg: true })
        .toFile(spreadOutPath);
    }
  }

  console.log('✅ Successfully generated all 24 theme covers and 72 spread preview pages!');
}

run().catch((err) => {
  console.error('Fatal error generating theme covers:', err);
  process.exit(1);
});
