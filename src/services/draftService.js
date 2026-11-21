//
// OrderDraft persistence service.
// localStorage today; the function signatures are the interface Part 3 will swap for a backend.
//

/**
 * @typedef {Object} DraftPhoto
 * @property {string} id
 * @property {string} name
 * @property {string} [previewUrl]   - object URL or data URL (transient)
 * @property {string} [assetId]      - IndexedDB asset id (transient)
 * @property {number} [width]        - natural pixel width
 * @property {number} [height]       - natural pixel height
 * @property {string} [category]     - event tag
 * @property {boolean} [lowResolution] - flagged by quality check
 */

/**
 * @typedef {Object} OrderDraft
 * @property {string} id
 * @property {string} productType        - 'wedding-album' | 'photobook'
 * @property {string} [themeId]
 * @property {string} [orientation]
 * @property {string} [size]
 * @property {number} [customWidth]
 * @property {number} [customHeight]
 * @property {string} [paper]
 * @property {string} [lamination]
 * @property {string} [cover]
 * @property {number} [sheetsOrPages]
 * @property {DraftPhoto[]} photos
 * @property {Array<Object>} pages       - generated sheets/pages
 * @property {Object} [pricing]          - last calculatePrice() result
 * @property {number} [step]             - wizard step the user left off at
 * @property {string} createdAt
 * @property {string} updatedAt
 */

const LS_KEY = 'snavyo_order_draft';

/**
 * Photos are stored WITHOUT previewUrl (object URLs are session-only).
 * assetId is kept so the provider can rehydrate blob URLs from IndexedDB after refresh.
 */
function serialisable(draft) {
  if (!draft) return null;
  const copy = { ...draft };
  copy.photos = (draft.photos || []).map((p) => {
    const { previewUrl, file, ...rest } = p;
    return rest;
  });
  return copy;
}

function revive(draft) {
  if (!draft) return null;
  return {
    ...draft,
    photos: (draft.photos || []).map((p) => ({ ...p, previewUrl: null, assetId: null })),
    pages: draft.pages || [],
    pricing: draft.pricing || null,
    step: draft.step || 1,
  };
}

export const DraftService = {
  /** Save the draft (without binary blob fields). Returns true on success. */
  save(draft) {
    try {
      const payload = serialisable({ ...draft, updatedAt: new Date().toISOString() });
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('DraftService.save failed:', err);
      return false;
    }
  },

  /** Load the draft, or null when none exists / storage is unreadable. */
  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return revive(JSON.parse(raw));
    } catch (err) {
      console.error('DraftService.load failed:', err);
      return null;
    }
  },

  /** Delete the draft. */
  delete() {
    try {
      localStorage.removeItem(LS_KEY);
      return true;
    } catch (err) {
      console.error('DraftService.delete failed:', err);
      return false;
    }
  },

  /** True when a saved draft exists. */
  has() {
    try {
      return Boolean(localStorage.getItem(LS_KEY));
    } catch (err) {
      return false;
    }
  },

  /** Update updatedAt and save; convenience for "save on every change". */
  touch(draft) {
    return this.save({ ...draft, updatedAt: new Date().toISOString() });
  },
};