export const TEMPLATE_DEFAULTS = { blackThreshold: 42, saturationThreshold: 34, minimumAreaFraction: 0.015, minimumFillRatio: 0.68, edgeSoftness: 2, aspectTolerance: 0.04 };

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function orientationFor(width, height) {
  const ratio = width / Math.max(1, height);
  return ratio >= 0.9 && ratio <= 1.1 ? 'square' : ratio > 1.1 ? 'landscape' : 'portrait';
}

/** Detect connected near-black slot regions from a row-major RGBA image. */
export function detectTemplateSlots({ data, width, height }, options = {}) {
  const settings = { ...TEMPLATE_DEFAULTS, ...options };
  const count = width * height;
  const mask = new Uint8Array(count);
  for (let i = 0, p = 0; i < count; i++, p += 4) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    if (luminance <= settings.blackThreshold && saturation <= settings.saturationThreshold && data[p + 3] > 32) mask[i] = 1;
  }

  const visited = new Uint8Array(count);
  const queue = new Int32Array(count);
  const minArea = Math.max(1, Math.floor(count * settings.minimumAreaFraction));
  const candidates = [];
  let componentCount = 0;
  const neighbors = [-1, 1, -width, width];
  for (let index = 0; index < count; index++) {
    if (!mask[index] || visited[index]) continue;
    componentCount++;
    let head = 0, tail = 0, minX = width, minY = height, maxX = -1, maxY = -1;
    let sumX = 0, sumY = 0, sumXX = 0, sumYY = 0, sumXY = 0;
    visited[index] = 1; queue[tail++] = index;
    while (head < tail) {
      const at = queue[head++], x = at % width, y = Math.floor(at / width);
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      sumX += x; sumY += y; sumXX += x * x; sumYY += y * y; sumXY += x * y;
      for (const offset of neighbors) {
        const next = at + offset;
        if (next < 0 || next >= count || visited[next]) continue;
        if ((offset === -1 && x === 0) || (offset === 1 && x === width - 1)) continue;
        if (mask[next]) { visited[next] = 1; queue[tail++] = next; }
      }
    }
    const boxW = maxX - minX + 1, boxH = maxY - minY + 1;
    const fillRatio = tail / (boxW * boxH);
    if (tail < minArea || fillRatio < settings.minimumFillRatio) continue;
    const covarianceX = sumXX / tail - (sumX / tail) ** 2;
    const covarianceY = sumYY / tail - (sumY / tail) ** 2;
    const covarianceXY = sumXY / tail - (sumX / tail) * (sumY / tail);
    let rotation = 0.5 * Math.atan2(2 * covarianceXY, covarianceX - covarianceY) * 180 / Math.PI;
    if (rotation > 45) rotation -= 90;
    if (rotation < -45) rotation += 90;
    if (Math.abs(rotation) < 0.5) rotation = 0;
    candidates.push({ x: minX, y: minY, pixelWidth: boxW, pixelHeight: boxH, area: tail, fillRatio, rotation });
  }
  candidates.sort((a, b) => a.x - b.x || a.y - b.y);
  const slots = candidates.map((slot, index) => {
    const { x, y, pixelWidth, pixelHeight, rotation } = slot;
    const angle = Math.abs(rotation) * Math.PI / 180;
    const denominator = Math.cos(2 * angle);
    const orientedW = Math.abs(rotation) > 0.5 && denominator > 0.05 ? (pixelWidth * Math.cos(angle) - pixelHeight * Math.sin(angle)) / denominator : pixelWidth;
    const orientedH = Math.abs(rotation) > 0.5 && denominator > 0.05 ? (pixelHeight * Math.cos(angle) - pixelWidth * Math.sin(angle)) / denominator : pixelHeight;
    const centerX = x + pixelWidth / 2, centerY = slot.y + pixelHeight / 2;
    const slotX = centerX - orientedW / 2, slotY = centerY - orientedH / 2;
    return {
      id: `slot-${index + 1}`, number: index + 1,
      x: slotX / width, y: slotY / height, w: orientedW / width, h: orientedH / height,
      rotation, orientation: orientationFor(orientedW, orientedH),
      page: centerX < width / 2 ? 'left' : 'right',
      pixelBounds: { x, y, width: pixelWidth, height: pixelHeight },
      fillRatio: Number(slot.fillRatio.toFixed(3)),
    };
  });
  return { slots, mask, settings, ignoredRegions: Math.max(0, componentCount - candidates.length) };
}

/** Make near-black detected pixels transparent with a small soft edge and bleed. */
export function makeTemplateOverlay({ data, width, height }, mask, dilatePx = 2) {
  const output = Buffer.from(data);
  const expanded = new Uint8Array(mask.length);
  const softEdge = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) if (mask[i]) output[i * 4 + 3] = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const x = i % width, y = Math.floor(i / width);
    for (let dy = -dilatePx; dy <= dilatePx; dy++) for (let dx = -dilatePx; dx <= dilatePx; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
        const ni = ny * width + nx;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < dilatePx) expanded[ni] = 1;
        else softEdge[ni] = 1;
      }
    }
  }
  for (let i = 0; i < expanded.length; i++) {
    if (expanded[i]) output[i * 4 + 3] = 0;
    else if (softEdge[i]) output[i * 4 + 3] = Math.min(output[i * 4 + 3], 128);
  }
  return output;
}

export function templateFitsAspect(templateRatio, sheetRatio, tolerance = TEMPLATE_DEFAULTS.aspectTolerance) {
  return Math.abs(templateRatio / sheetRatio - 1) <= tolerance;
}

/** Automatically calculate cover-crop parameters and optimal portrait/landscape centering */
export function calculateAutoFitSettings(photoWidth, photoHeight, slotOrientation) {
  const isPhotoPortrait = (photoHeight || 0) > (photoWidth || 0);
  const isSlotPortrait = slotOrientation === 'portrait';
  const cropY = isPhotoPortrait ? 38 : 50;
  return {
    fitMode: 'cover',
    cropX: 50,
    cropY,
    cropScale: 1,
    orientationMatch: slotOrientation === 'square' || (isPhotoPortrait && isSlotPortrait) || (!isPhotoPortrait && slotOrientation === 'landscape'),
  };
}

/** Crop math that guarantees full slot coverage without changing photo proportions. */
export function coverCrop(photoWidth, photoHeight, slotWidth, slotHeight, focusX = 50, focusY = 50, zoom = 1) {
  const scale = Math.max(slotWidth / photoWidth, slotHeight / photoHeight) * Math.max(1, zoom);
  const sourceWidth = slotWidth / scale, sourceHeight = slotHeight / scale;
  const sx = clamp((photoWidth - sourceWidth) * focusX / 100, 0, photoWidth - sourceWidth);
  const sy = clamp((photoHeight - sourceHeight) * focusY / 100, 0, photoHeight - sourceHeight);
  return { sx, sy, sw: sourceWidth, sh: sourceHeight, scale, covers: sourceWidth * scale >= slotWidth - 1e-6 && sourceHeight * scale >= slotHeight - 1e-6 };
}

/** Stable greedy orientation pairing; ties preserve source photo order. */
export function matchPhotosToSlots(photos = [], slots = []) {
  const remaining = photos.map((photo, index) => ({ photo, index }));
  return slots.map((slot, index) => {
    const wanted = slot.orientation;
    let choice = remaining.findIndex(({ photo }) => wanted === 'square' || photo.orientation === wanted || photo.orientation === 'square');
    if (choice < 0) choice = 0;
    const picked = remaining.splice(choice, 1)[0];
    return { slotId: slot.id || `slot-${index + 1}`, photo: picked?.photo || null, photoIndex: picked?.index ?? null };
  });
}

/** Assign ordered photos to template spreads using remaining capacity, orientation fit, and no immediate template repeats. */
export function distributePhotosAcrossTemplates(photos = [], pageCount = 1, templates = []) {
  const usable = templates.filter((template) => (template.slots || []).length);
  const result = [];
  let cursor = 0, previousId = null;
  while (cursor < photos.length && result.length < pageCount && usable.length) {
    const remaining = photos.slice(cursor);
    const candidates = usable.map((template) => {
      const slots = template.slots;
      const count = Math.min(slots.length, remaining.length);
      let mismatch = 0;
      for (let i = 0; i < count; i++) {
        const photo = remaining[i];
        const orientation = photo.orientation || orientationFor(photo.width || 0, photo.height || 1);
        if (slots[i].orientation !== 'square' && orientation !== 'square' && slots[i].orientation !== orientation) mismatch += 2;
        else if (slots[i].orientation !== orientation) mismatch += 0.5;
      }
      const leftoverPenalty = remaining.length < slots.length ? (slots.length - remaining.length) * 2 : 0;
      const repeatPenalty = template.id === previousId ? 1000 : 0;
      return { template, score: Math.abs(slots.length - remaining.length) + mismatch + leftoverPenalty + repeatPenalty };
    }).sort((a, b) => a.score - b.score);
    let chosen = candidates[0];
    if (chosen?.template.id === previousId && candidates.length > 1) chosen = candidates[1];
    const assigned = remaining.slice(0, Math.min(chosen.template.slots.length, remaining.length));
    result.push({ template: chosen.template, photos: assigned, sheetIndex: result.length });
    cursor += assigned.length;
    previousId = chosen.template.id;
  }
  return result;
}

export function effectivePpi(photoWidth, photoHeight, sourceCrop, slotWidthIn, slotHeightIn) {
  const cropW = sourceCrop?.sw || photoWidth, cropH = sourceCrop?.sh || photoHeight;
  return Math.min(cropW / Math.max(slotWidthIn, 0.001), cropH / Math.max(slotHeightIn, 0.001));
}
