//
// Central pricing configuration for SNAVYO ALBUM STUDIO.
// EDIT NUMBERS HERE ONLY - all UI and tests read from this file.
// All prices in USD, rounded to 2 decimal places.
//

export const PRICING = {
  weddingAlbum: {
    basePerSheet: 29.99,      // PLACEHOLDER: base price per sheet
    minSheets: 1,
    maxSheets: 100,
    defaultSheets: 30,
  },
  photobook: {
    basePerPage: 9.99,        // PLACEHOLDER: base price per page
    minPages: 24,
    maxPages: 100,
    defaultPages: 80,
  },
  paper: {
    'premium-photo': { modifier: 0.15, label: 'Premium Photo Paper' },      // 15% upcharge
    'non-tearable': { modifier: 0.25, label: 'Non-Tearable Paper' },        // 25% upcharge
  },
  cover: {
    hardcover: { modifier: 40.00, label: 'Hardcover' },
    softcover: { modifier: 0.00, label: 'Softcover' },
  },
  lamination: {
    gloss: { modifier: 20.00, label: 'Gloss' },
    matte: { modifier: 20.00, label: 'Matte' },
  },
  orientation: {
    horizontal: { modifier: 0.00, label: 'Horizontal' },
    vertical: { modifier: 0.05, label: 'Vertical' },      // 5% upcharge
    square: { modifier: 0.05, label: 'Square' },          // 5% upcharge
  },
  shipping: {
    flat: 12.99,            // PLACEHOLDER: flat shipping rate
    freeThreshold: 500.00,  // PLACEHOLDER: free shipping over this amount
  },
  tax: {
    rate: 0.08,             // PLACEHOLDER: 8% tax rate
    enabled: true,
  },
};

export const DEFAULT_PRICING = {
  weddingAlbum: {
    basePerSheet: PRICING.weddingAlbum.basePerSheet,
    paper: 'premium-photo',
    cover: 'hardcover',
    lamination: 'gloss',
    orientation: 'horizontal',
  },
  photobook: {
    basePerPage: PRICING.photobook.basePerPage,
    paper: 'premium-photo',
    cover: 'hardcover',
    lamination: 'gloss',
    orientation: 'horizontal',
  },
};