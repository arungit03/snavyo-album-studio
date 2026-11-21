//
// Product type definitions and option lists for SNAVYO ALBUM STUDIO storefront.
// All prices are PLACEHOLDER numbers - change one value in one file to update everywhere.
//
export const PRODUCT_TYPES = {
  weddingAlbum: {
    id: 'wedding-album',
    label: 'Wedding Album',
    description: 'Professional printed wedding album with custom sheets and layouts.',
    sheetRange: [1, 100],
    sizeRange: ['8x24', '10x30', '12x24', '12x30', '12x36', '15x30', '15x36', '18x24', '18x36', 'custom'],
  },
  photobook: {
    id: 'photobook',
    label: 'Photo Book',
    description: 'Digital photo book with printed pages, flexible page count and sizes.',
    pageRange: [24, 100],
    sizeRange: ['A5', 'A4', 'A3'],
  },
};

export const ORIENTATIONS = [
  { id: 'horizontal', label: 'Horizontal (Landscape)', description: 'Wide open spread', priceModifier: 0 },
  { id: 'vertical', label: 'Vertical (Portrait)', description: 'Tall portrait orientation', priceModifier: 0 },
  { id: 'square', label: 'Square', description: 'Equal sides layout', priceModifier: 0 },
];

export const PAPER_TYPES = [
  { id: 'premium-photo', label: 'Premium Photo Paper', description: 'High-gloss 300 PPI printed paper', priceModifier: 15 },
  { id: 'non-tearable', label: 'Non-Tearable Paper', description: 'Durable synthetic paper', priceModifier: 25 },
];

export const COVER_OPTIONS = [
  { id: 'hardcover', label: 'Hardcover', description: ' Sturdy hard cover with printed dust jacket', priceModifier: 40 },
  { id: 'softcover', label: 'Softcover', description: 'Flexible paperback cover', priceModifier: 0 },
];

export const LAMINATION_OPTIONS = [
  { id: 'gloss', label: 'Gloss Lamination', description: 'Glossy finish for protection and shine', priceModifier: 20 },
  { id: 'matte', label: 'Matte Lamination', description: 'Matte finish for reduced glare', priceModifier: 20 },
];

export const SIZE_DEFINITIONS = {
  // Wedding album sizes (spread dimensions in inches)
  '8x24': { label: '8 × 24 inches', spreadWidth: 24, height: 8, category: 'Mini Album' },
  '10x30': { label: '10 × 30 inches', spreadWidth: 30, height: 10, category: 'Standard Album' },
  '12x24': { label: '12 × 24 inches', spreadWidth: 24, height: 12, category: 'Standard Album' },
  '12x30': { label: '12 × 30 inches', spreadWidth: 30, height: 12, category: 'Standard Album' },
  '12x36': { label: '12 × 36 inches', spreadWidth: 36, height: 12, category: 'Premium Album' },
  '15x30': { label: '15 × 30 inches', spreadWidth: 30, height: 15, category: 'Premium Album' },
  '15x36': { label: '15 × 36 inches', spreadWidth: 36, height: 15, category: 'Luxury Album' },
  '18x24': { label: '18 × 24 inches', spreadWidth: 24, height: 18, category: 'Luxury Album' },
  '18x36': { label: '18 × 36 inches', spreadWidth: 36, height: 18, category: 'Luxury Album' },
  // Photo book sizes
  A5: { label: 'A5 9.5" × 6"', width: 9.5, height: 6, category: 'Small' },
  A4: { label: 'A4 12" × 9"', width: 12, height: 9, category: 'Medium' },
  A3: { label: 'A3 18" × 11.5"', width: 18, height: 11.5, category: 'Large' },
};

export const ESTIMATE_PAGE_COUNT = (photoCount, productType) => {
  // Rough estimation: 4 photos per page for albums, 2 photos per page for photobooks
  if (productType.id === 'wedding-album') {
    return Math.max(1, Math.ceil(photoCount / 4));
  } else if (productType.id === 'photobook') {
    return Math.max(24, Math.min(100, Math.ceil(photoCount / 2)));
  }
  return 30;
};