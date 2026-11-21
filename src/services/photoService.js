//
// Shared photo-processing helpers for the order flow and the editor.
// - Batch thumbnail generation via createImageBitmap (falls back to FileReader).
// - Print-resolution quality check relative to the chosen print size at 300 PPI.
// - Move/reorder helpers used by the upload grid.
//

import { PPI } from '@/utils/albumData';

/**
 * Read natural pixel dimensions of an image file without loading it fully into memory.
 * Uses createImageBitmap where available, else an Image + object URL.
 * @param {File} file
 * @returns {Promise<{width:number, height:number}>}
 */
export async function readImageDimensions(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'none' });
      const dims = { width: bitmap.width, height: bitmap.height };
      bitmap.close && bitmap.close();
      return dims;
    } catch (err) {
      // fall through to the Image path
    }
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

/**
 * Generate a small thumbnail object URL for a file.
 * Draws into a canvas capped at maxEdge px so 200+ photos stay cheap.
 * @param {File} file
 * @param {number} [maxEdge=480]
 * @returns {Promise<string>} object URL (caller must revoke)
 */
export async function makeThumbnail(file, maxEdge = 480) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close && bitmap.close();
    return canvas.toDataURL('image/jpeg', 0.82);
  } catch (err) {
    // Fallback: full data URL (slower, but always works)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Process files in batches so the UI never freezes on 200+ photos.
 * Yields control to the browser between batches and reports progress.
 *
 * @param {File[]} files
 * @param {{ onProgress?: (done:number, total:number) => void, batchSize?: number, maxEdge?: number }} [opts]
 * @returns {Promise<Array<{ id:string, name:string, file:File, previewUrl:string, width:number, height:number, category:string, lowResolution:boolean }>>}
 */
export async function processPhotos(files, opts = {}) {
  const { onProgress, batchSize = 12, maxEdge = 480 } = opts;
  const out = [];
  const total = files.length;

  for (let start = 0; start < total; start += batchSize) {
    const batch = files.slice(start, start + batchSize);
    const processed = await Promise.all(
      batch.map(async (file) => {
        const previewUrl = await makeThumbnail(file, maxEdge);
        const dims = await readImageDimensions(file);
        return {
          id: 'photo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
          name: file.name || 'photo',
          file,
          previewUrl,
          width: dims.width,
          height: dims.height,
          category: 'All',
          lowResolution: false,
        };
      }),
    );
    out.push(...processed);
    if (onProgress) onProgress(Math.min(total, start + batch.length), total);
    // yield to the event loop so the UI can paint
    await new Promise((r) => setTimeout(r, 0));
  }
  return out;
}

/**
 * Quality check: flag photos whose shorter side cannot cover the print size at 300 PPI.
 * A photo "may print soft" when its resolution is below ~80% of what the sheet needs.
 *
 * @param {Array<{width:number, height:number}>} photos
 * @param {{ spreadWidthIn:number, heightIn:number, framesPerSheet?: number }} sheetSpec
 * @param {number} [ppi=PPI]
 * @returns {Array<boolean>} parallel array: true => low resolution
 */
export function flagLowResolution(photos, sheetSpec, ppi = PPI) {
  const framesPerSheet = Math.max(1, sheetSpec.framesPerSheet || 3);
  // assume each frame covers ~half the sheet width and ~70% of height (typical layout)
  const frameWidthPx = ((sheetSpec.spreadWidthIn / 2) * ppi) / 1.6;
  const frameHeightPx = (sheetSpec.heightIn * ppi) / framesPerSheet;

  return photos.map((p) => {
    if (!p || !p.width || !p.height) return true;
    const ok = p.width >= frameWidthPx * 0.8 && p.height >= frameHeightPx * 0.8;
    return !ok;
  });
}

/**
 * Reorder an array by moving the item at `from` to `to`.
 * Returns a new array; input is untouched.
 */
export function moveItem(array, from, to) {
  const next = array.slice();
  if (from < 0 || from >= next.length || to < 0 || to >= next.length) return next;
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Revoke object URLs for a photo list (cleanup on unmount / replace). */
export function revokePhotoUrls(photos) {
  (photos || []).forEach((p) => {
    if (p && p.previewUrl && p.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(p.previewUrl);
    }
  });
}