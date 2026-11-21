import { PAPER_TYPES, COVER_OPTIONS, LAMINATION_OPTIONS } from '@/constants/products';

/**
 * Step 3 — paper, lamination, cover.
 */
export default function StepFinish({ draft, setField }) {
  const groups = [
    { label: 'Paper type', key: 'paper', options: PAPER_TYPES },
    { label: 'Lamination', key: 'lamination', options: LAMINATION_OPTIONS },
    { label: 'Cover', key: 'cover', options: COVER_OPTIONS },
  ];

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <fieldset key={group.key}>
          <legend className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-2">
            {group.label}
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.options.map((opt) => {
              const active = draft[group.key] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setField({ [group.key]: opt.id })}
                  aria-pressed={active}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-snavyo-purple ring-2 ring-snavyo-purple bg-white shadow-gold'
                      : 'border-snavyo-lavender/70 bg-white hover:border-snavyo-purple/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-snavyo-text-main">{opt.label}</span>
                    {opt.priceModifier > 0 && (
                      <span className="text-[10px] font-bold text-snavyo-gold-dark bg-snavyo-gold/15 px-2 py-0.5 rounded-full">
                        +${opt.priceModifier}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-snavyo-text-secondary mt-1">{opt.description}</p>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}