import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * ThemeCard — displays a single template with cover image, name, tag, and a CTA.
 * Renders an accessible luxury card with alt text, hover effects, and focus states.
 */
export default function ThemeCard({ theme }) {
  if (!theme) return null;

  return (
    <article className="group bg-white rounded-2xl border border-snavyo-lavender/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(117,80,184,0.14)] hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden bg-snavyo-background">
        <img
          src={theme.coverImage}
          alt={`${theme.name} template cover`}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Ambient vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category / Occasion Tag */}
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-200 border border-amber-300/40 text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          {theme.tag}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-[#FAF8FF]/60">
        <h3 className="font-serif text-base font-bold text-snavyo-text-main group-hover:text-snavyo-purple transition-colors line-clamp-1">
          {theme.name}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1">
          {theme.supportedOrientations.map((o) => (
            <span
              key={o}
              className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-snavyo-purple border border-purple-200/60"
            >
              {o}
            </span>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-snavyo-lavender/70 flex items-center justify-between mt-auto">
          <span className="text-[10px] font-medium text-snavyo-text-secondary tracking-wide">
            {theme.supportedProductTypes.join(' · ')}
          </span>
          <Link
            to={`/new-project?template=${theme.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-snavyo-purple group-hover:text-purple-900 group-hover:bg-purple-100/70 px-2.5 py-1 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-snavyo-gold"
          >
            <span>Use design</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}