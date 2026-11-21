import { describe, expect, it } from 'vitest';
import { coverCrop, detectTemplateSlots, distributePhotosAcrossTemplates, effectivePpi, makeTemplateOverlay, matchPhotosToSlots, templateFitsAspect, calculateAutoFitSettings } from './templateProcessor';

function image(width, height, fill = [255, 255, 255, 255]) {
  const data = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) data.set(fill, i * 4);
  return { data, width, height };
}
function rect(img, x, y, w, h, color = [0, 0, 0, 255]) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) img.data.set(color, (yy * img.width + xx) * 4);
}

describe('designer template processing', () => {
  it('finds multiple black rectangles, orders them, and classifies orientation', () => {
    const img = image(100, 60); rect(img, 8, 8, 18, 34); rect(img, 56, 10, 34, 18);
    const { slots } = detectTemplateSlots(img, { minimumAreaFraction: 0.04 });
    expect(slots.map((s) => s.orientation)).toEqual(['portrait', 'landscape']);
    expect(slots.map((s) => s.number)).toEqual([1, 2]);
    expect(slots.map((s) => s.page)).toEqual(['left', 'right']);
  });
  it('ignores tiny details and accepts rounded or notched slot edges', () => {
    const img = image(100, 100); rect(img, 30, 25, 40, 50); rect(img, 4, 4, 2, 2);
    for (let y = 25; y < 75; y++) for (let x = 30; x < 70; x++) if ((x < 34 && y < 29) || (x > 65 && y > 70)) img.data.set([255, 255, 255, 255], (y * 100 + x) * 4);
    expect(detectTemplateSlots(img).slots).toHaveLength(1);
  });
  it('estimates rotated component orientation', () => {
    const img = image(160, 160);
    for (let y = 0; y < 160; y++) for (let x = 0; x < 160; x++) {
      const dx = x - 80, dy = y - 80, a = Math.PI / 22.5;
      if (Math.abs(dx * Math.cos(a) + dy * Math.sin(a)) < 35 && Math.abs(-dx * Math.sin(a) + dy * Math.cos(a)) < 17) img.data.set([0, 0, 0, 255], (y * 160 + x) * 4);
    }
    const slots = detectTemplateSlots(img, { minimumAreaFraction: 0.015 }).slots;
    expect(Math.abs(slots[0].rotation)).toBeGreaterThan(2);
  });
  it('removes slot alpha and leaves the rest of the overlay opaque', () => {
    const img = image(40, 40); rect(img, 10, 10, 20, 20);
    const { mask } = detectTemplateSlots(img, { minimumAreaFraction: 0.1 });
    const overlay = makeTemplateOverlay(img, mask, 0);
    expect(overlay[(20 * 40 + 20) * 4 + 3]).toBe(0);
    expect(overlay[(2 * 40 + 2) * 4 + 3]).toBe(255);
  });
  it('covers slots with proportional crop, matches orientation, calculates PPI and checks aspect tolerance', () => {
    expect(coverCrop(4000, 3000, 400, 300).covers).toBe(true);
    const pairs = matchPhotosToSlots([{ id: 'l', orientation: 'landscape' }, { id: 'p', orientation: 'portrait' }], [{ id: 'p-slot', orientation: 'portrait' }, { id: 'l-slot', orientation: 'landscape' }]);
    expect(pairs.map((p) => p.photo.id)).toEqual(['p', 'l']);
    expect(effectivePpi(3000, 2000, { sw: 1500, sh: 1000 }, 10, 6)).toBe(150);
    expect(templateFitsAspect(3, 3.1)).toBe(true);
    expect(templateFitsAspect(3, 3.2)).toBe(false);
  });
  it('chooses sheet templates by slot count and avoids consecutive repeats', () => {
    const photos = Array.from({ length: 5 }, (_, i) => ({ id: `p${i}`, orientation: i % 2 ? 'landscape' : 'portrait' }));
    const templates = [
      { id: 'two', slots: [{ orientation: 'portrait' }, { orientation: 'landscape' }] },
      { id: 'three', slots: [{ orientation: 'portrait' }, { orientation: 'landscape' }, { orientation: 'square' }] },
    ];
    const plan = distributePhotosAcrossTemplates(photos, 4, templates);
    expect(plan.map((item) => item.photos.length)).toEqual([3, 2]);
    expect(plan[0].template.id).not.toBe(plan[1].template.id);
    expect(plan.flatMap((item) => item.photos).map((photo) => photo.id)).toEqual(photos.map((photo) => photo.id));
  });
  it('calculates auto-fit cover crop and orientation recommendations correctly', () => {
    const portraitFit = calculateAutoFitSettings(1000, 1500, 'portrait');
    expect(portraitFit.fitMode).toBe('cover');
    expect(portraitFit.cropY).toBe(38);
    expect(portraitFit.orientationMatch).toBe(true);

    const landscapeFit = calculateAutoFitSettings(1600, 900, 'landscape');
    expect(landscapeFit.cropY).toBe(50);
    expect(landscapeFit.orientationMatch).toBe(true);

    const mismatchFit = calculateAutoFitSettings(1000, 1500, 'landscape');
    expect(mismatchFit.orientationMatch).toBe(false);
  });
});
