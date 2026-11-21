/**
 * SectionHeading — reusable section title + optional eyebrow + description.
 * Accessible: renders an h2 by default; pass `as` to change level.
 */
export default function SectionHeading({ eyebrow, title, description, align = 'center', as: Tag = 'h2', className = '' }) {
  const alignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-snavyo-gold-dark mb-2">
          {eyebrow}
        </span>
      )}
      <Tag className="font-serif text-2xl md:text-3xl font-bold text-snavyo-text-main tracking-tight">
        {title}
      </Tag>
      {description && (
        <p className="mt-2 text-xs md:text-sm text-snavyo-text-secondary max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}