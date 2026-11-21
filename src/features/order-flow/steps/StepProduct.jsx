import { PRODUCT_TYPES } from '@/constants/products';
import { THEME_CATEGORIES, THEMES } from '@/constants/themes';
import ThemeCard from '@/components/ThemeCard';

/**
 * Step 1 — product type (wedding album vs photobook) + theme selection.
 * Preselects theme from ?theme= query (handled by the parent page).
 */
export default function StepProduct({ draft, setField }) {
  const productOptions = Object.values(PRODUCT_TYPES);

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-2">
          Product type
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {productOptions.map((p) => {
            const active = draft.productType === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setField({ productType: p.id })}
                aria-pressed={active}
                className={`p-4 rounded-premium-xl border text-left transition-all ${
                  active
                    ? 'border-snavyo-purple ring-2 ring-snavyo-purple bg-white shadow-gold'
                    : 'border-snavyo-lavender/70 bg-white hover:border-snavyo-purple/50'
                }`}
              >
                <div className="font-serif text-base font-bold text-snavyo-text-main">{p.label}</div>
                <p className="text-xs text-snavyo-text-secondary mt-1">{p.description}</p>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-snavyo-purple">
                  {p.id === 'wedding-album'
                    ? `${p.sheetRange[0]}–${p.sheetRange[1]} sheets · ${p.sizeRange.length} sizes`
                    : `${p.pageRange[0]}–${p.pageRange[1]} pages · ${p.sizeRange.length} sizes`}
                </div>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-3">
          Theme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setField({ themeId: theme.id })}
              aria-pressed={draft.themeId === theme.id}
              className={`text-left rounded-premium-xl border transition-all overflow-hidden ${
                draft.themeId === theme.id
                  ? 'border-snavyo-purple ring-2 ring-snavyo-purple shadow-gold'
                  : 'border-snavyo-lavender/70 hover:border-snavyo-purple/50'
              }`}
            >
              <img
                src={theme.coverImage}
                alt={`${theme.name} theme cover`}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
              <div className="p-3 bg-white">
                <div className="text-xs font-bold text-snavyo-text-main">{theme.name}</div>
                <div className="text-[10px] text-snavyo-text-secondary mt-0.5">
                  {THEME_CATEGORIES.find((c) => c.id === theme.category)?.name || theme.tag}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}