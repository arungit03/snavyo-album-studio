import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * ThemeCard — displays a single template with cover image, name, tag, and a CTA.
 * Renders an accessible card with alt text and focus states.
 */
export default function ThemeCard({ theme }) {
  if (!theme) return null;

  return (
    <article className="group bg-white rounded-premium-xl border border-snavyo-lavender/80 shadow-sm hover:shadow-luxury hover:border-snavyo-purple/50 transition-all duration-200 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-snavyo-background">
        <img
          src={theme.coverImage}
          alt={`${theme.name} template cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-snavyo-purple/90 text-white text-[10px] font-bold uppercase tracking-wider">
          {theme.tag}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif text-base font-bold text-snavyo-text-main group-hover:text-snavyo-purple transition-colors">
          {theme.name}
        </h3>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {theme.supportedOrientations.map((o) => (
            <span
              key={o}
              className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-snavyo-lavender/60 text-snavyo-purple"
            >
              {o}
            </span>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-snavyo-lavender/50 flex items-center justify-between mt-auto">
          <span className="text-[10px] font-semibold text-snavyo-text-secondary">
            {theme.supportedProductTypes.join(' · ')}
          </span>
          <Link
            to={`/create?theme=${theme.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-snavyo-purple group-hover:translate-x-0.5 transition-transform focus:outline-none focus:ring-2 focus:ring-snavyo-gold rounded"
          >
            Use this design
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}