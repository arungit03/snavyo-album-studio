export default function BrandMark({ className = '', label = 'SNAVYO Album Studio' }) {
  return (
    <img
      src="/snavyo-mark.svg"
      alt={label}
      className={className}
      draggable="false"
    />
  );
}
