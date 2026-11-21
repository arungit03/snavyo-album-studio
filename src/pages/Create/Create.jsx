import { useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { getThemeById, THEMES } from '@/constants/themes';
import { calculatePrice, getDefaultOptions } from '@/utils/pricing';
import SectionHeading from '@/components/SectionHeading';

/**
 * Create page — stub for the Smart Create flow.
 * Reads ?theme=<id> from the URL and shows the selected theme with a price estimate.
 * Full Smart Create implementation lands in Part 2.
 */
export default function Create() {
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get('theme');
  const theme = themeId ? getThemeById(themeId) : null;

  const defaults = getDefaultOptions('wedding-album');
  const price = calculatePrice(defaults);

  return (
    <div className="min-h-screen bg-snavyo-background px-6 py-10 md:py-14">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Smart Create"
          title={theme ? `Selected: ${theme.name}` : 'Create a new design'}
          description={
            theme
              ? `Theme "${theme.name}" (${theme.tag}) is selected. The full Smart Create flow lands in Part 2.`
              : 'Start from a blank design.'
          }
        />

        {theme && (
          <div className="mt-8 bg-white rounded-premium-xl border border-snavyo-lavender/80 shadow-sm p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={theme.coverImage}
                alt={`${theme.name} cover preview`}
                className="w-full sm:w-40 rounded-xl border border-snavyo-lavender object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-serif text-xl font-bold text-snavyo-text-main">{theme.name}</h3>
                <p className="text-xs text-snavyo-text-secondary mt-1">{theme.description || `A ${theme.tag} themed design.`}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                  {theme.supportedOrientations.map((o) => (
                    <span key={o} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-snavyo-lavender text-snavyo-purple">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-white rounded-premium-xl border border-snavyo-lavender/80 shadow-sm p-5 md:p-6">
          <h3 className="font-serif text-base font-bold text-snavyo-text-main mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-snavyo-gold" aria-hidden="true" /> Price estimate
          </h3>
          <ul className="space-y-1.5 text-xs text-snavyo-text-secondary">
            <li className="flex justify-between"><span>Base ({defaults.productType})</span><span className="font-mono">${price.base}</span></li>
            <li className="flex justify-between"><span>Extras</span><span className="font-mono">${price.extras}</span></li>
            <li className="flex justify-between"><span>Shipping</span><span className="font-mono">${price.shipping.toFixed(2)}</span></li>
            <li className="flex justify-between"><span>Tax</span><span className="font-mono">${price.tax.toFixed(2)}</span></li>
            <li className="flex justify-between font-bold text-snavyo-text-main pt-2 border-t border-snavyo-lavender/60">
              <span>Estimated total</span>
              <span className="font-serif text-lg text-snavyo-purple">${price.total.toFixed(2)}</span>
            </li>
          </ul>
          <p className="text-[10px] text-snavyo-text-secondary mt-3">
            Placeholder pricing. Edit src/constants/pricing.js to change every displayed number.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button variant="luxury" to="/new-project">
            Continue to album editor
          </Button>
          <p className="text-[10px] text-snavyo-text-secondary mt-3">
            Available themes: {THEMES.length} · This page is a stub until Part 2 lands.
          </p>
        </div>
      </div>
    </div>
  );
}
