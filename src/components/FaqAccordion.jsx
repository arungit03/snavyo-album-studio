import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FaqAccordion — accessible FAQ accordion.
 * Each item is a button that toggles its panel; only one panel open at a time.
 */
export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.id || index}
            className={`rounded-premium-xl border transition-colors ${
              isOpen ? 'border-snavyo-purple/50 bg-white shadow-sm' : 'border-snavyo-lavender/70 bg-white'
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              id={`faq-button-${index}`}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-snavyo-gold rounded-premium-xl"
            >
              <span className="text-xs sm:text-sm font-bold text-snavyo-text-main">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-snavyo-purple flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-button-${index}`}
                className="px-4 pb-4 -mt-1"
              >
                <p className="text-xs text-snavyo-text-secondary leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}