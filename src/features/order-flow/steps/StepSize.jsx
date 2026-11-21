import { useState } from 'react';
import { ORIENTATIONS, SIZE_DEFINITIONS, PRODUCT_TYPES } from '@/constants/products';
import { Ruler, AlertTriangle } from 'lucide-react';

/**
 * Step 2 — orientation + size (with custom size validation for wedding albums).
 */
export default function StepSize({ draft, setField }) {
  const isAlbum = draft.productType === PRODUCT_TYPES.weddingAlbum.id;
  const sizes = isAlbum
    ? Object.entries(SIZE_DEFINITIONS).filter(([k]) => k !== 'A5' && k !== 'A4' && k !== 'A3')
    : Object.entries(SIZE_DEFINITIONS).filter(([k]) => k === 'A5' || k === 'A4' || k === 'A3');

  const [customW, setCustomW] = useState(String(draft.customWidth || 36));
  const [customH, setCustomH] = useState(String(draft.customHeight || 12));
  const [customError, setCustomError] = useState('');

  const applyCustom = () => {
    const w = parseFloat(customW);
    const h = parseFloat(customH);
    if (!w || !h || w <= 0 || h <= 0) {
      setCustomError('Enter positive numbers for width and height.');
      return;
    }
    if (w > 60 || h > 30) {
      setCustomError('Maximum supported spread is 60" × 30".');
      return;
    }
    if (w < 6 || h < 4) {
      setCustomError('Minimum supported spread is 6" × 4".');
      return;
    }
    setCustomError('');
    setField({ size: 'custom', customWidth: w, customHeight: h });
  };

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-2">
          Orientation
        </legend>
        <div className="flex flex-wrap gap-2">
          {ORIENTATIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setField({ orientation: o.id })}
              aria-pressed={draft.orientation === o.id}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                draft.orientation === o.id
                  ? 'bg-snavyo-purple text-white border-snavyo-purple'
                  : 'bg-white text-snavyo-text-secondary border-snavyo-lavender hover:border-snavyo-purple'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-2">
          Size {isAlbum ? '(spread)' : '(page)'}
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sizes.map(([id, def]) => (
            <button
              key={id}
              type="button"
              onClick={() => setField({ size: id })}
              aria-pressed={draft.size === id}
              className={`p-3 rounded-xl border text-left transition-all ${
                draft.size === id
                  ? 'border-snavyo-purple ring-2 ring-snavyo-purple bg-white shadow-gold'
                  : 'border-snavyo-lavender/70 bg-white hover:border-snavyo-purple/50'
              }`}
            >
              <div className="flex items-center gap-1.5 text-snavyo-purple">
                <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs font-bold text-snavyo-text-main">{def.label}</span>
              </div>
              <div className="text-[10px] text-snavyo-text-secondary mt-1">{def.category}</div>
            </button>
          ))}
          {isAlbum && (
            <div className="p-3 rounded-xl border border-dashed border-snavyo-lavender bg-snavyo-background/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary mb-2">
                Custom size
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[9px] text-snavyo-text-secondary">Width (in)</span>
                  <input
                    type="number"
                    step="0.5"
                    min="6"
                    max="60"
                    value={customW}
                    onChange={(e) => setCustomW(e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-snavyo-lavender bg-white"
                  />
                </label>
                <label className="block">
                  <span className="text-[9px] text-snavyo-text-secondary">Height (in)</span>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="30"
                    value={customH}
                    onChange={(e) => setCustomH(e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-snavyo-lavender bg-white"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={applyCustom}
                className="mt-2 w-full py-1.5 rounded-lg bg-snavyo-purple text-white text-[10px] font-bold hover:bg-snavyo-purple-dark transition-colors"
              >
                Apply custom
              </button>
              {customError && (
                <p className="mt-1.5 text-[10px] text-rose-600 flex items-center gap-1" role="alert">
                  <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {customError}
                </p>
              )}
              {draft.size === 'custom' && !customError && (
                <p className="mt-1.5 text-[10px] text-emerald-700">
                  Custom {draft.customWidth}" × {draft.customHeight}" applied.
                </p>
              )}
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
}