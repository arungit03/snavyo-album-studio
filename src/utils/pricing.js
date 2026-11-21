import { PRICING } from '../constants/pricing.js';
import { SIZE_DEFINITIONS, PRODUCT_TYPES, ESTIMATE_PAGE_COUNT } from '../constants/products.js';

const resolveProduct = (productType) => PRODUCT_TYPES[productType] || Object.values(PRODUCT_TYPES).find((item) => item.id === productType);

/**
 * Calculate the total price for a product order.
 * @param {Object} opts - Order options
 * @param {string} opts.productType - 'wedding-album' or 'photobook'
 * @param {string|Object} opts.sizeOrSpread - Size ID (e.g. '12x36', 'A4') or {width, height} object
 * @param {number} opts.sheetsOrPages - Number of sheets (album) or pages (photobook)
 * @param {string} opts.paper - Paper type ID (e.g. 'premium-photo', 'non-tearable')
 * @param {string} opts.lamination - Lamination type ID (e.g. 'gloss', 'matte')
 * @param {string} opts.cover - Cover type ID (e.g. 'hardcover', 'softcover')
 * @param {string} opts.orientation - Orientation ID (e.g. 'horizontal', 'vertical', 'square')
 * @returns {Object} Price breakdown with base, extras, subtotal, shipping, tax, total, breakdown[]
 */
export function calculatePrice({
  productType = 'wedding-album',
  sizeOrSpread = '12x36',
  sheetsOrPages = 30,
  paper = 'premium-photo',
  lamination = 'gloss',
  cover = 'hardcover',
  orientation = 'horizontal',
}) {
  const product = resolveProduct(productType);
  if (!product) {
    throw new Error(`Unknown product type: ${productType}`);
  }

  // Determine size configuration
  let sizeConfig;
  if (product.id === 'wedding-album') {
    if (typeof sizeOrSpread === 'object') {
      sizeConfig = {
        spreadWidth: sizeOrSpread.width || 36,
        height: sizeOrSpread.height || 12,
        label: `${sizeOrSpread.height || 12}" × ${sizeOrSpread.width || 36}" (custom)`,
      };
    } else if (SIZE_DEFINITIONS[sizeOrSpread]) {
      sizeConfig = SIZE_DEFINITIONS[sizeOrSpread];
    } else {
      sizeConfig = SIZE_DEFINITIONS['12x36'];
    }
  } else {
    if (SIZE_DEFINITIONS[sizeOrSpread]) {
      sizeConfig = SIZE_DEFINITIONS[sizeOrSpread];
    } else {
      sizeConfig = SIZE_DEFINITIONS.A4;
    }
  }

  // Base price per sheet/page
  const baseUnit = product.id === 'wedding-album'
    ? PRICING.weddingAlbum.basePerSheet
    : PRICING.photobook.basePerPage;

  // Sheet/page cost
  const sheetCost = baseUnit * sheetsOrPages;

  // Apply option modifiers
  let extras = 0;
  const breakdown = [];

  // Paper type modifier (percentage of sheet cost)
  const paperOption = PRICING.paper[paper];
  if (paperOption) {
    const paperCost = sheetCost * paperOption.modifier;
    extras += paperCost;
    breakdown.push({ label: paperOption.label, amount: paperCost.toFixed(2), type: 'paper' });
  }

  // Cover modifier (flat fee)
  const coverOption = PRICING.cover[cover];
  if (coverOption) {
    extras += coverOption.modifier;
    breakdown.push({ label: coverOption.label, amount: coverOption.modifier.toFixed(2), type: 'cover' });
  }

  // Lamination modifier (flat fee)
  const laminationOption = PRICING.lamination[lamination];
  if (laminationOption) {
    extras += laminationOption.modifier;
    breakdown.push({ label: `${laminationOption.label} Lamination`, amount: laminationOption.modifier.toFixed(2), type: 'lamination' });
  }

  // Orientation modifier (percentage of sheet cost)
  const orientationOption = PRICING.orientation[orientation];
  if (orientationOption && orientationOption.modifier > 0) {
    const orientCost = sheetCost * orientationOption.modifier;
    extras += orientCost;
    breakdown.push({ label: `${orientationOption.label} Orientation`, amount: orientCost.toFixed(2), type: 'orientation' });
  }

  // Subtotal
  const subtotal = parseFloat((sheetCost + extras).toFixed(2));

  // Shipping (free over threshold)
  let shipping = PRICING.shipping.flat;
  if (subtotal >= PRICING.shipping.freeThreshold) {
    shipping = 0;
  }

  // Tax
  let tax = 0;
  if (PRICING.tax.enabled) {
    tax = parseFloat(((subtotal + shipping) * PRICING.tax.rate).toFixed(2));
  }

  // Total
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  return {
    base: baseUnit.toFixed(2),
    baseUnit,
    extras: extras.toFixed(2),
    subtotal,
    shipping,
    tax,
    total,
    breakdown,
    productType,
    size: sizeConfig.label || sizeOrSpread,
    sizeConfig,
    sheetsOrPages,
    paper,
    lamination,
    cover,
    orientation,
  };
}

/**
 * Estimate page count based on number of photos and product type.
 * @param {number} photoCount - Number of photographs
 * @param {Object} productType - Product type object from PRODUCT_TYPES
 * @returns {number} Estimated page count (clamped to product range)
 */
export function estimatePageCount(photoCount, productType) {
  if (typeof productType === 'string') productType = resolveProduct(productType) || { id: productType };
  return ESTIMATE_PAGE_COUNT(photoCount, productType);
}

/**
 * Get default options for a product type.
 * @param {string} productType - 'wedding-album' or 'photobook'
 * @returns {Object} Default options
 */
export function getDefaultOptions(productType = 'wedding-album') {
  const product = resolveProduct(productType) || PRODUCT_TYPES.weddingAlbum;
  return {
    productType,
    sizeOrSpread: product.id === 'wedding-album' ? '12x36' : 'A4',
    sheetsOrPages: product.id === 'wedding-album'
      ? PRICING.weddingAlbum.defaultSheets
      : PRICING.photobook.defaultPages,
    paper: 'premium-photo',
    lamination: 'gloss',
    cover: 'hardcover',
    orientation: 'horizontal',
  };
}

/**
 * Validate configuration object.
 * @param {Object} config - Configuration to validate
 * @returns {Array} Array of validation error messages (empty if valid)
 */
export function validateConfig(config) {
  const errors = [];

  if (!config.productType || !resolveProduct(config.productType)) {
    errors.push('Invalid product type');
  }

  if (config.productType === 'wedding-album') {
    if (config.sheetsOrPages < PRICING.weddingAlbum.minSheets || config.sheetsOrPages > PRICING.weddingAlbum.maxSheets) {
      errors.push(`Wedding album must have ${PRICING.weddingAlbum.minSheets}-${PRICING.weddingAlbum.maxSheets} sheets`);
    }
    if (!SIZE_DEFINITIONS[config.sizeOrSpread] && typeof config.sizeOrSpread !== 'object') {
      errors.push('Invalid wedding album size');
    }
  } else if (config.productType === 'photobook') {
    if (config.sheetsOrPages < PRICING.photobook.minPages || config.sheetsOrPages > PRICING.photobook.maxPages) {
      errors.push(`Photo book must have ${PRICING.photobook.minPages}-${PRICING.photobook.maxPages} pages`);
    }
  }

  if (!PRICING.paper[config.paper]) {
    errors.push('Invalid paper type');
  }

  if (!PRICING.lamination[config.lamination]) {
    errors.push('Invalid lamination type');
  }

  if (!PRICING.cover[config.cover]) {
    errors.push('Invalid cover type');
  }

  return errors;
}

/* Export commonly used sizes for convenience */
export const WEDDING_SIZES = ['8x24', '10x30', '12x24', '12x30', '12x36', '15x30', '15x36', '18x24', '18x36'];
export const PHOTOBOOK_SIZES = ['A5', 'A4', 'A3'];

/**
 * Helper to get the appropriate page count based on photo count and product type.
 * @param {number} photoCount - Number of photos
 * @param {string} productType - 'wedding-album' or 'photobook'
 * @returns {number} Page count estimate
 */
export function pageCountFor(photoCount, productType) {
  const product = Object.values(PRODUCT_TYPES).find((p) => p.id === productType);
  if (!product) return Math.max(1, Math.ceil(photoCount / 4));
  const est = estimatePageCount(photoCount, product);
  const [min, max] = product.id === 'wedding-album'
    ? PRODUCT_TYPES.weddingAlbum.sheetRange
    : PRODUCT_TYPES.photobook.pageRange;
  return Math.max(min, Math.min(max, est));
}
