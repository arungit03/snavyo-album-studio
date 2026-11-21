//
// Vitest unit tests for pricing functions.
// Run with: npx vitest run src/utils/pricing.test.js
//

import { describe, it, expect } from 'vitest';
import { calculatePrice, estimatePageCount, getDefaultOptions, validateConfig, pageCountFor } from './pricing.js';
import { PRICING } from '../constants/pricing.js';
import { PRODUCT_TYPES } from '../constants/products.js';

describe('calculatePrice', () => {
  it('should calculate wedding album price with default options', () => {
    const result = calculatePrice({
      productType: 'wedding-album',
      sizeOrSpread: '12x36',
      sheetsOrPages: 30,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
      orientation: 'horizontal',
    });

    expect(result.productType).toBe('wedding-album');
    expect(result.sheetsOrPages).toBe(30);
    expect(result.base).toBe(PRICING.weddingAlbum.basePerSheet.toFixed(2));
    expect(parseFloat(result.extras)).toBeGreaterThan(0);
    expect(result.subtotal).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(result.subtotal);
  });

  it('should calculate photobook price with default options', () => {
    const result = calculatePrice({
      productType: 'photobook',
      sizeOrSpread: 'A4',
      sheetsOrPages: 80,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
      orientation: 'horizontal',
    });

    expect(result.productType).toBe('photobook');
    expect(result.sheetsOrPages).toBe(80);
    expect(parseFloat(result.base)).toBe(PRICING.photobook.basePerPage);
    expect(result.total).toBeGreaterThan(0);
  });

  it('should apply paper type modifier correctly', () => {
    const base = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    const upgraded = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'non-tearable',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    expect(parseFloat(upgraded.extras)).toBeGreaterThan(parseFloat(base.extras));
  });

  it('should apply cover modifier correctly', () => {
    const softcover = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    const hardcover = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
      orientation: 'horizontal',
    });

    expect(hardcover.total).toBeGreaterThan(softcover.total);
    expect(hardcover.total - softcover.total).toBeCloseTo(PRICING.cover.hardcover.modifier * (1 + PRICING.tax.rate), 2);
  });

  it('should apply lamination modifier correctly', () => {
    const noLam = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    // Note: both gloss and matte have same modifier in current config
    const matte = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'matte',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    expect(parseFloat(matte.extras)).toBeCloseTo(parseFloat(noLam.extras), 2);
  });

  it('should apply orientation modifier for non-horizontal', () => {
    const horizontal = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    const vertical = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'vertical',
    });

    expect(parseFloat(vertical.extras)).toBeGreaterThan(parseFloat(horizontal.extras));
  });

  it('should apply free shipping over threshold', () => {
    const result = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 100, // Large order
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
      orientation: 'horizontal',
    });

    // If subtotal exceeds free threshold, shipping should be 0
    if (result.subtotal >= PRICING.shipping.freeThreshold) {
      expect(result.shipping).toBe(0);
    }
  });

  it('should include tax in total when enabled', () => {
    const result = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'softcover',
      orientation: 'horizontal',
    });

    if (PRICING.tax.enabled) {
      expect(result.tax).toBeGreaterThan(0);
      expect(result.total).toBeCloseTo(result.subtotal + result.shipping + result.tax, 2);
    }
  });

  it('should throw error for unknown product type', () => {
    expect(() => calculatePrice({ productType: 'invalid' })).toThrow('Unknown product type');
  });

  it('should handle custom size object', () => {
    const result = calculatePrice({
      productType: 'wedding-album',
      sizeOrSpread: { width: 30, height: 10 },
      sheetsOrPages: 20,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
      orientation: 'horizontal',
    });

    expect(result.size).toContain('custom');
  });

  it('should return breakdown array with all modifiers', () => {
    const result = calculatePrice({
      productType: 'wedding-album',
      sheetsOrPages: 10,
      paper: 'non-tearable',
      lamination: 'matte',
      cover: 'hardcover',
      orientation: 'vertical',
    });

    expect(result.breakdown).toBeInstanceOf(Array);
    expect(result.breakdown.length).toBeGreaterThanOrEqual(3); // paper, cover, lamination, orientation
    result.breakdown.forEach(item => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('amount');
      expect(item).toHaveProperty('type');
    });
  });
});

describe('estimatePageCount', () => {
  it('should estimate pages for wedding album (4 photos per page)', () => {
    const result = estimatePageCount(100, PRODUCT_TYPES.weddingAlbum);
    expect(result).toBe(25);
  });

  it('should estimate pages for photobook (2 photos per page, min 24)', () => {
    const result = estimatePageCount(10, PRODUCT_TYPES.photobook);
    expect(result).toBe(24); // minimum
  });

  it('should cap photobook pages at 100', () => {
    const result = estimatePageCount(500, PRODUCT_TYPES.photobook);
    expect(result).toBe(100); // maximum
  });
});

describe('getDefaultOptions', () => {
  it('should return wedding album defaults', () => {
    const defaults = getDefaultOptions('wedding-album');
    expect(defaults.productType).toBe('wedding-album');
    expect(defaults.sizeOrSpread).toBe('12x36');
    expect(defaults.sheetsOrPages).toBe(PRICING.weddingAlbum.defaultSheets);
    expect(defaults.paper).toBe('premium-photo');
    expect(defaults.cover).toBe('hardcover');
  });

  it('should return photobook defaults', () => {
    const defaults = getDefaultOptions('photobook');
    expect(defaults.productType).toBe('photobook');
    expect(defaults.sizeOrSpread).toBe('A4');
    expect(defaults.sheetsOrPages).toBe(PRICING.photobook.defaultPages);
  });
});

describe('validateConfig', () => {
  it('should return empty array for valid config', () => {
    const errors = validateConfig({
      productType: 'wedding-album',
      sizeOrSpread: '12x36',
      sheetsOrPages: 30,
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
    });
    expect(errors).toEqual([]);
  });

  it('should return errors for invalid product type', () => {
    const errors = validateConfig({ productType: 'invalid' });
    expect(errors).toContain('Invalid product type');
  });

  it('should return errors for out-of-range sheets', () => {
    const errors = validateConfig({
      productType: 'wedding-album',
      sizeOrSpread: '12x36',
      sheetsOrPages: 200, // > 100
      paper: 'premium-photo',
      lamination: 'gloss',
      cover: 'hardcover',
    });
    expect(errors.some(e => e.includes('1-100'))).toBe(true);
  });

  it('should return errors for invalid paper type', () => {
    const errors = validateConfig({
      productType: 'wedding-album',
      sizeOrSpread: '12x36',
      sheetsOrPages: 30,
      paper: 'invalid-paper',
      lamination: 'gloss',
      cover: 'hardcover',
    });
    expect(errors).toContain('Invalid paper type');
  });
});

describe('pageCountFor', () => {
  it('should return clamped page count for wedding album', () => {
    // 4 photos per sheet -> 25 sheets (within 1-100 range)
    expect(pageCountFor(100, 'wedding-album')).toBe(25);

    // Below minimum
    expect(pageCountFor(1, 'wedding-album')).toBe(1);

    // Above maximum
    expect(pageCountFor(500, 'wedding-album')).toBe(100);
  });

  it('should return clamped page count for photobook', () => {
    // 2 photos per page -> 12 pages, but min is 24
    expect(pageCountFor(24, 'photobook')).toBe(24);

    // 40 photos -> 20 pages, but min is 24
    expect(pageCountFor(40, 'photobook')).toBe(24);

    // 100 photos -> 50 pages (within 24-100 range)
    expect(pageCountFor(100, 'photobook')).toBe(50);

    // Above maximum
    expect(pageCountFor(500, 'photobook')).toBe(100);
  });

  it('should handle unknown product type gracefully', () => {
    // Should fallback to wedding-album behavior
    expect(pageCountFor(100, 'unknown')).toBe(25);
  });
});
