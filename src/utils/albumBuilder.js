//
// Album page/sheet builder for the Smart Create flow.
// Reuses the same layout vocabulary as the editor (src/pages/AlbumEditor/index.jsx handleApplyLayout)
// and the size/photo math from src/utils/albumData.js — no duplicated constants.
//

import { PPI, SAFETY_MARGIN_PX, CENTER_CLEARANCE_PX } from './albumData';
import { PRODUCT_TYPES } from '@/constants/products';
import { estimatePageCount } from '@/utils/pricing';

/**
 * The three layout variations the editor offers per sheet (kept in the same order).
 * @type {Array<'grand-hero'|'editorial'|'cinematic'>}
 */
export const LAYOUT_VARIATIONS = ['grand-hero', 'editorial', 'cinematic'];

/**
 * Build photo layers for a page using one of the 3 editor layout variations.
 * Percentages match the editor's handleApplyLayout so pages render identically there.
 * @param {Array<{id:string, previewUrl:string, name?:string}>} photos
 * @param {'grand-hero'|'editorial'|'cinematic'} variant
 * @returns {Array<Object>} editor-compatible layer objects
 */
export function layoutLayers(photos, variant) {
  const list = Array.isArray(photos) ? photos : [];
  const [p1, p2, p3, p4] = list;
  const layer = (suffix, photo, x, y, width, height) => ({
    id: `layer_${variant}_${suffix}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'photo',
    name: photo?.name || `Photo ${suffix}`,
    photoId: photo?.id || null,
    previewUrl: photo?.previewUrl || null,
    x, y, width, height,
    opacity: 1,
    fitMode: 'cover',
    adjustments: { brightness: 100, contrast: 100 },
  });

  if (variant === 'grand-hero') {
    const layers = [];
    if (p1) layers.push(layer('hero', p1, 5, 8, 42, 84));
    if (p2) layers.push(layer('sub1', p2, 54, 8, 41, 40));
    if (p3) layers.push(layer('sub2', p3, 54, 52, 41, 40));
    return layers;
  }
  if (variant === 'editorial') {
    const slots = [
      [p1, 6, 12], [p2, 28, 12], [p3, 53, 12], [p4, 75, 12],
    ];
    return slots.filter(([p]) => p).map(([p, x], i) => layer(i + 1, p, x, 12, 19, 76));
  }
  // cinematic
  const slots = [
    [p1, 5, 15, 26, 70], [p2, 37, 10, 26, 80], [p3, 69, 15, 26, 70],
  ];
  return slots.filter(([p]) => p).map(([p, x, y, w, h], i) => layer(i + 1, p, x, y, w, h));
}

/**
 * Distribute photos across pages, keeping orientation groups together.
 * @param {Array} photos - ordered draft photos
 * @param {number} pageCount - target page count
 * @returns {Array<Array>} parallel arrays of photos per page
 */
export function distributePhotos(photos, pageCount) {
  const pages = Array.from({ length: pageCount }, () => []);
  if (!photos.length || pageCount <= 0) return pages;

  // Group by orientation first (portrait vs landscape), preserving upload order within groups.
  const portrait = photos.filter((p) => (p.height || 0) >= (p.width || 0));
  const landscape = photos.filter((p) => (p.width || 0) > (p.height || 0));
  const ordered = [...portrait, ...landscape];

  // Round-robin distribute so every page gets a similar count and orientation mix is stable.
  ordered.forEach((photo, index) => {
    pages[index % pageCount].push(photo);
  });
  return pages;
}

/**
 * Build the page models for a draft. Each page carries the theme background and one of
 * the 3 layout variations, cycled so consecutive sheets differ.
 * Mirrors the editor's layer shape so the draft can be handed to the Editor route unchanged.
 *
 * @param {Object} opts
 * @param {Array} opts.photos
 * @param {string} opts.productType - 'wedding-album' | 'photobook'
 * @param {number} opts.sheetsOrPages
 * @param {Object|null} opts.theme - theme object from constants/themes.js
 * @param {string} opts.orientation
 * @returns {{ pages: Array, usedPhotos: number, emptySlots: number, extraPhotos: number }}
 */
export function buildAlbumPages({ photos, productType, sheetsOrPages, theme, orientation }) {
  const pageCount = Math.max(1, Math.round(sheetsOrPages || 1));
  const distributed = distributePhotos(photos, pageCount);

  const background = theme
    ? { type: 'design', value: '#FFFFFF', css: theme.backgroundCss || null, image: null, templateId: theme.id }
    : { type: 'color', value: '#FFFFFF', css: null, image: null };

  const pages = distributed.map((pagePhotos, index) => {
    const variant = LAYOUT_VARIATIONS[index % LAYOUT_VARIATIONS.length];
    const layers = pagePhotos.length ? layoutLayers(pagePhotos, variant) : [];
    return {
      id: `page_${index + 1}_${Math.random().toString(36).slice(2, 6)}`,
      sheetNumber: index + 1,
      title: `Sheet ${index + 1}`,
      background: { ...background },
      layers,
      empty: pagePhotos.length === 0,
      layout: variant,
      orientation,
    };
  });

  const usedPhotos = photos.length;
  const capacity = pageCount * 4; // rough capacity for the summary strip
  return {
    pages,
    usedPhotos,
    emptySlots: Math.max(0, capacity - usedPhotos),
    extraPhotos: Math.max(0, usedPhotos - capacity),
  };
}

/**
 * Re-layout a single page with the next of the 3 layout variations (per-page re-shuffle).
 * @param {Object} page - existing page model
 * @param {Array} allPhotos - draft photos (to resolve photoId -> photo)
 * @returns {Object} new page model with same id/background, new layers + layout
 */
export function reshufflePage(page, allPhotos) {
  const byId = new Map((allPhotos || []).map((p) => [p.id, p]));
  const photos = (page.layers || [])
    .filter((l) => l.type === 'photo' && l.photoId)
    .map((l) => byId.get(l.photoId))
    .filter(Boolean);
  const currentIdx = LAYOUT_VARIATIONS.indexOf(page.layout);
  const next = LAYOUT_VARIATIONS[(currentIdx + 1) % LAYOUT_VARIATIONS.length];
  return {
    ...page,
    layers: layoutLayers(photos, next),
    layout: next,
  };
}

/** Convenience wrapper around estimatePageCount that clamps to product limits. */
export function pageCountFor(photoCount, productType) {
  const product = Object.values(PRODUCT_TYPES).find((p) => p.id === productType);
  if (!product) return estimatePageCount(photoCount, { id: productType });
  const est = estimatePageCount(photoCount, product);
  const [min, max] = product.id === 'wedding-album'
    ? PRODUCT_TYPES.weddingAlbum.sheetRange
    : PRODUCT_TYPES.photobook.pageRange;
  return Math.max(min, Math.min(max, est));
}

/** Print pixel spec for a draft size, reusing albumData.pixelsForSize constants. */
export function printSpec(sizeId, customSize) {
  const pixelMap = {
    '8x24': [24, 8], '10x30': [30, 10], '12x24': [24, 12], '12x30': [30, 12],
    '12x36': [36, 12], '15x30': [30, 15], '15x36': [36, 15], '18x24': [24, 18], '18x36': [36, 18],
  };
  let spreadW, h;
  if (sizeId === 'custom' && customSize) {
    spreadW = customSize.width;
    h = customSize.height;
  } else if (pixelMap[sizeId]) {
    [spreadW, h] = pixelMap[sizeId];
  } else if (sizeId === 'A5') {
    spreadW = 9.5; h = 6;
  } else if (sizeId === 'A4') {
    spreadW = 12; h = 9;
  } else if (sizeId === 'A3') {
    spreadW = 18; h = 11.5;
  } else {
    spreadW = 36; h = 12;
  }
  return {
    spreadWidthIn: spreadW,
    heightIn: h,
    pixels: {
      width: Math.round(spreadW * PPI),
      height: Math.round(h * PPI),
    },
    safetyMarginPx: SAFETY_MARGIN_PX,
    centerClearancePx: CENTER_CLEARANCE_PX,
  };
}