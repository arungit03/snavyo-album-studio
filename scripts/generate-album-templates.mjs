import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TEMPLATES_OUTPUT_DIR = path.resolve('src/assets/templates');
if (!fs.existsSync(TEMPLATES_OUTPUT_DIR)) {
  fs.mkdirSync(TEMPLATES_OUTPUT_DIR, { recursive: true });
}

// 16 Spread Template Definitions
// Dimensions: 2400 x 1200 (2:1 ratio)
const SPREAD_TEMPLATES = [
  {
    id: '01-royal-grand-wedding-spread',
    name: 'Royal Grand Wedding Spread',
    bg: { from: '#3F0713', to: '#5C0D20', type: 'damask', accent: '#D4AF62' },
    title: 'THE ROYAL WEDDING SPREAD',
    slots: [
      { x: 120, y: 140, w: 960, h: 920, label: 'Grand Hero Portrait' },
      { x: 1320, y: 140, w: 440, h: 920, label: 'Bridal Portrait' },
      { x: 1840, y: 140, w: 440, h: 920, label: 'Groom Portrait' }
    ]
  },
  {
    id: '02-traditional-gold-mandap-spread',
    name: 'Traditional Gold Mandap Spread',
    bg: { from: '#FFFDF9', to: '#F9F3E8', type: 'ivory-gold', accent: '#C59B3C' },
    title: 'AUSPICIOUS MANDAP CEREMONY',
    slots: [
      { x: 140, y: 160, w: 940, h: 880, label: 'Mandap Rituals' },
      { x: 1320, y: 140, w: 940, h: 420, label: 'Sacred Vows' },
      { x: 1320, y: 620, w: 940, h: 420, label: 'Garland Exchange' }
    ]
  },
  {
    id: '03-luxury-editorial-minimal-spread',
    name: 'Luxury Editorial Minimal Spread',
    bg: { from: '#FDFCFA', to: '#F6F5F2', type: 'minimal', accent: '#94A3B8' },
    title: 'CONTEMPORARY EDITORIAL',
    slots: [
      { x: 160, y: 160, w: 420, h: 880, label: 'Detail Frame 01' },
      { x: 660, y: 160, w: 420, h: 880, label: 'Detail Frame 02' },
      { x: 1320, y: 160, w: 420, h: 880, label: 'Detail Frame 03' },
      { x: 1820, y: 160, w: 420, h: 880, label: 'Detail Frame 04' }
    ]
  },
  {
    id: '04-cinematic-gold-spotlight-spread',
    name: 'Cinematic Gold Spotlight Spread',
    bg: { from: '#151318', to: '#26202B', type: 'gold-glow', accent: '#E5A93B' },
    title: 'CINEMATIC SPOTLIGHT FEATURE',
    slots: [
      { x: 140, y: 200, w: 460, h: 800, label: 'Side Spotlight' },
      { x: 700, y: 140, w: 1000, h: 920, label: 'Cinematic Center Hero' },
      { x: 1800, y: 200, w: 460, h: 800, label: 'Side Spotlight' }
    ]
  },
  {
    id: '05-romantic-blush-floral-spread',
    name: 'Romantic Blush Floral Spread',
    bg: { from: '#FFF7F9', to: '#FCE7ED', type: 'floral-blush', accent: '#D87A97' },
    title: 'ROMANTIC BLUSH & FLORAL DREAMS',
    slots: [
      { x: 140, y: 150, w: 920, h: 900, label: 'Romantic Couple' },
      { x: 1320, y: 150, w: 920, h: 420, label: 'Ring Detail' },
      { x: 1320, y: 630, w: 920, h: 420, label: 'Sweet Moments' }
    ]
  },
  {
    id: '06-elegant-vows-ceremony-spread',
    name: 'Elegant Vows Ceremony Spread',
    bg: { from: '#FAF8F5', to: '#F0ECE4', type: 'pearl', accent: '#78716C' },
    title: 'SACRED PROMISES & VOWS',
    slots: [
      { x: 160, y: 160, w: 880, h: 880, label: 'Promise Moment' },
      { x: 1320, y: 160, w: 440, h: 880, label: 'His Vows' },
      { x: 1820, y: 160, w: 440, h: 880, label: 'Her Vows' }
    ]
  },
  {
    id: '07-haldi-sunshine-marigold-spread',
    name: 'Haldi Sunshine Marigold Spread',
    bg: { from: '#FFFBEB', to: '#FEF08A', type: 'marigold', accent: '#D97706' },
    title: 'SUNSHINE HALDI CELEBRATION',
    slots: [
      { x: 150, y: 150, w: 920, h: 420, label: 'Turmeric Application' },
      { x: 150, y: 630, w: 920, h: 420, label: 'Family Blessings' },
      { x: 1320, y: 150, w: 440, h: 900, label: 'Joyful Bride' },
      { x: 1820, y: 150, w: 440, h: 900, label: 'Joyful Groom' }
    ]
  },
  {
    id: '08-haldi-golden-turmeric-spread',
    name: 'Haldi Golden Turmeric Spread',
    bg: { from: '#FEF3C7', to: '#FDE68A', type: 'golden-turmeric', accent: '#B45309' },
    title: 'GOLDEN TURMERIC TRADITIONS',
    slots: [
      { x: 160, y: 160, w: 900, h: 880, label: 'Haldi Spotlight' },
      { x: 1320, y: 160, w: 920, h: 880, label: 'Splash of Joy' }
    ]
  },
  {
    id: '09-mehendi-emerald-henna-spread',
    name: 'Mehendi Emerald Henna Spread',
    bg: { from: '#042F2E', to: '#0F4C44', type: 'emerald-henna', accent: '#34D399' },
    title: 'EMERALD HENNA BRIDAL ART',
    slots: [
      { x: 160, y: 160, w: 880, h: 880, label: 'Bridal Henna Hands' },
      { x: 1360, y: 160, w: 880, h: 880, label: 'Intricate Feet Art' }
    ]
  },
  {
    id: '10-mehendi-floral-vines-spread',
    name: 'Mehendi Floral Vines Spread',
    bg: { from: '#064E3B', to: '#0B6850', type: 'green-vines', accent: '#6EE7B7' },
    title: 'MEHENDI CELEBRATION & MUSIC',
    slots: [
      { x: 150, y: 150, w: 440, h: 900, label: 'Henna Detail' },
      { x: 650, y: 150, w: 440, h: 900, label: 'Bridesmaids' },
      { x: 1320, y: 150, w: 920, h: 900, label: 'Featured Henna Pose' }
    ]
  },
  {
    id: '11-sangeet-rhythm-violet-spread',
    name: 'Sangeet Rhythm Violet Spread',
    bg: { from: '#1E0B36', to: '#381264', type: 'violet-stage', accent: '#E879F9' },
    title: 'SANGEET RHYTHM & DANCE NIGHT',
    slots: [
      { x: 140, y: 160, w: 920, h: 880, label: 'Stage Couple Dance' },
      { x: 1320, y: 160, w: 440, h: 880, label: 'Dance Troupe' },
      { x: 1820, y: 160, w: 440, h: 880, label: 'Dhol Beats' }
    ]
  },
  {
    id: '12-reception-grand-evening-spread',
    name: 'Reception Grand Evening Spread',
    bg: { from: '#0C101B', to: '#171E33', type: 'navy-gold', accent: '#F59E0B' },
    title: 'THE GRAND RECEPTION EVENING',
    slots: [
      { x: 150, y: 160, w: 900, h: 880, label: 'Grand Entrance' },
      { x: 1350, y: 160, w: 900, h: 880, label: 'Celebration Toast' }
    ]
  },
  {
    id: '13-baby-soft-cloud-spread',
    name: 'Baby Soft Cloud Spread',
    bg: { from: '#EFF6FF', to: '#DBEAFE', type: 'baby-clouds', accent: '#60A5FA' },
    title: 'WELCOME LITTLE ANGEL',
    slots: [
      { x: 150, y: 220, w: 600, h: 760, label: 'Sweet Dreams' },
      { x: 850, y: 140, w: 700, h: 920, label: 'Center Baby Portrait' },
      { x: 1650, y: 220, w: 600, h: 760, label: 'Tiny Fingers' }
    ]
  },
  {
    id: '14-baby-playful-dreams-spread',
    name: 'Baby Playful Dreams Spread',
    bg: { from: '#FEFCE8', to: '#FEF08A', type: 'playful-mint', accent: '#FBBF24' },
    title: 'MILESTONES & PLAYFUL GIGGLES',
    slots: [
      { x: 160, y: 180, w: 440, h: 840, label: 'Month 03' },
      { x: 660, y: 180, w: 440, h: 840, label: 'Month 06' },
      { x: 1300, y: 180, w: 440, h: 840, label: 'Month 09' },
      { x: 1800, y: 180, w: 440, h: 840, label: 'First Year' }
    ]
  },
  {
    id: '15-travel-wanderlust-adventure-spread',
    name: 'Travel Wanderlust Adventure Spread',
    bg: { from: '#F5F5F4', to: '#E7E5E4', type: 'travel-parchment', accent: '#0D9488' },
    title: 'WANDERLUST ADVENTURE DIARIES',
    slots: [
      { x: 150, y: 160, w: 920, h: 880, label: 'Mountain Panorama' },
      { x: 1320, y: 160, w: 440, h: 880, label: 'Trail Exploration' },
      { x: 1820, y: 160, w: 440, h: 880, label: 'Local Encounters' }
    ]
  },
  {
    id: '16-travel-journal-horizon-spread',
    name: 'Travel Journal Horizon Spread',
    bg: { from: '#F0F9FF', to: '#E0F2FE', type: 'coastal-horizon', accent: '#0284C7' },
    title: 'OCEAN HORIZONS & EXPEDITIONS',
    slots: [
      { x: 150, y: 160, w: 460, h: 880, label: 'Coastal Sunrise' },
      { x: 680, y: 160, w: 460, h: 880, label: 'Island Vibes' },
      { x: 1320, y: 160, w: 920, h: 880, label: 'Sunset Horizon' }
    ]
  }
];

function buildSpreadSvg(template, width = 2400, height = 1200) {
  const { bg, title, slots } = template;
  const safeTitle = title.replace(/&/g, '&amp;');
  const accent = bg.accent;

  // Build slot elements: near-black #080808 inside with elegant outer border
  const slotsSvg = slots.map((s, idx) => `
    <g>
      <!-- Outer Border -->
      <rect x="${s.x - 6}" y="${s.y - 6}" width="${s.w + 12}" height="${s.h + 12}" rx="6"
            fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.8" />
      <rect x="${s.x - 2}" y="${s.y - 2}" width="${s.w + 4}" height="${s.h + 4}" rx="4"
            fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.9" />

      <!-- Near-black Photo Slot region (RGB 8,8,8 for automatic detection) -->
      <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="2" fill="#080808" />

      <!-- Subtle inner slot indicator text (drawn inside slot in dark gray) -->
      <text x="${s.x + s.w / 2}" y="${s.y + s.h / 2 - 10}" font-family="sans-serif" font-size="20" font-weight="bold"
            fill="#222222" text-anchor="middle">PHOTO SLOT ${idx + 1}</text>
      <text x="${s.x + s.w / 2}" y="${s.y + s.h / 2 + 18}" font-family="sans-serif" font-size="14"
            fill="#1B1B1B" text-anchor="middle">${s.label}</text>
    </g>
  `).join('\n');

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg.from}" />
          <stop offset="100%" stop-color="${bg.to}" />
        </linearGradient>

        <pattern id="damaskPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 50 10 C 30 30 30 70 50 90 C 70 70 70 30 50 10 Z" fill="none" stroke="${accent}" stroke-width="0.75" stroke-opacity="0.12" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="${accent}" stroke-width="0.5" stroke-opacity="0.1" />
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
      <rect width="${width}" height="${height}" fill="url(#damaskPattern)" />

      <!-- Spread Outer Luxury Border -->
      <rect x="30" y="30" width="${width - 60}" height="${height - 60}" rx="8"
            fill="none" stroke="${accent}" stroke-width="2.5" stroke-opacity="0.6" />
      <rect x="42" y="42" width="${width - 84}" height="${height - 84}" rx="6"
            fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="6,4" />

      <!-- Spine Center Line -->
      <line x1="${width / 2}" y1="30" x2="${width / 2}" y2="${height - 30}"
            stroke="${accent}" stroke-width="1" stroke-dasharray="4,6" stroke-opacity="0.4" />

      <!-- Corner Ornaments -->
      <path d="M 24 60 L 24 24 L 60 24" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" />
      <path d="M ${width - 24} 60 L ${width - 24} 24 L ${width - 60} 24" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" />
      <path d="M 24 ${height - 60} L 24 ${height - 24} L 60 ${height - 24}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" />
      <path d="M ${width - 24} ${height - 60} L ${width - 24} ${height - 24} L ${width - 60} ${height - 24}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" />

      <!-- Photo Slots -->
      ${slotsSvg}

      <!-- Top Header Title -->
      <g>
        <rect x="${width / 2 - 240}" y="48" width="480" height="38" rx="19"
              fill="rgba(10, 10, 15, 0.45)" stroke="${accent}" stroke-width="1" stroke-opacity="0.7"/>
        <text x="${width / 2}" y="73" font-family="Georgia, serif" font-size="14" font-weight="bold"
              letter-spacing="3" fill="${accent}" text-anchor="middle">${safeTitle}</text>
      </g>

      <!-- Bottom Branding Footer -->
      <text x="${width / 4}" y="${height - 52}" font-family="sans-serif" font-size="12" letter-spacing="2"
            fill="${accent}" fill-opacity="0.8" text-anchor="middle">SNAVYO ALBUM STUDIO · SPREAD LEFT</text>
      <text x="${3 * width / 4}" y="${height - 52}" font-family="sans-serif" font-size="12" letter-spacing="2"
            fill="${accent}" fill-opacity="0.8" text-anchor="middle">PROFESSIONAL 300 PPI · SPREAD RIGHT</text>
    </svg>
  `;
}

async function run() {
  console.log(`Generating 16 panoramic spread templates in ${TEMPLATES_OUTPUT_DIR}...`);

  for (let i = 0; i < SPREAD_TEMPLATES.length; i++) {
    const t = SPREAD_TEMPLATES[i];
    console.log(`[${i + 1}/${SPREAD_TEMPLATES.length}] Generating ${t.name}...`);

    const svgContent = buildSpreadSvg(t, 2400, 1200);
    const outPngPath = path.join(TEMPLATES_OUTPUT_DIR, `${t.id}.png`);

    await sharp(Buffer.from(svgContent))
      .png({ compressionLevel: 6 })
      .toFile(outPngPath);
  }

  console.log('✅ Successfully created all 16 high-resolution album spread templates!');
}

run().catch((err) => {
  console.error('Fatal error generating album templates:', err);
  process.exit(1);
});
