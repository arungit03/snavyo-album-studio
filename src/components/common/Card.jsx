export function OptionCard({ children, selected = false, className = '' }) {
  return (
    <div
      className={[
        'group relative bg-white rounded-premium-xl border p-8 transition-all duration-300 ease-out cursor-pointer',
        selected
          ? 'border-snavyo-purple bg-snavyo-lavender shadow-gold'
          : 'border-transparent hover:border-snavyo-purple/50 hover:shadow-luxury hover:-translate-y-1',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

export function SectionCard({ children, className = '' }) {
  return (
    <div className={['bg-white rounded-premium-xl shadow-luxury border border-white/70 p-6 transition-colors', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
