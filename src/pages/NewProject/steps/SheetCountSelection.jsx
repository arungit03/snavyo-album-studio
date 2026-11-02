import { pixelsForSize, PPI, SHEET_PRESETS } from '@/utils/albumData';
import { Layers, Image, BookOpen, Sparkles } from 'lucide-react';

export default function SheetCountSelection({ onSelect, selected, albumSize }) {
  const currentCount = selected || 20;

  const handleChange = (num) => {
    const val = Math.max(1, Math.min(100, parseInt(num, 10) || 1));
    onSelect(val);
  };

  const pixels = albumSize
    ? pixelsForSize(albumSize.spreadWidth, albumSize.height, albumSize.ppi || PPI)
    : null;

  const totalPages = currentCount * 2;
  const minPhotos = currentCount * 2;
  const maxPhotos = currentCount * 6;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-premium-xl border border-snavyo-lavender p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-snavyo-text-main flex items-center gap-2">
              <Layers className="w-5 h-5 text-snavyo-purple" />
              Number of Album Sheets (1 – 100)
            </h3>
            <p className="text-xs text-snavyo-text-secondary mt-1">
              Select or type the number of spreads. Each sheet contains 2 pages (Left & Right).
            </p>
          </div>

          {/* Direct Numeric Input */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-snavyo-text-secondary uppercase">
              Sheets:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={currentCount}
              onChange={(e) => handleChange(e.target.value)}
              className="w-20 p-2 text-center text-xl font-bold rounded-xl border-2 border-snavyo-purple bg-snavyo-lavender/30 text-snavyo-text-main focus:outline-none focus:ring-2 focus:ring-snavyo-gold"
            />
          </div>
        </div>

        {/* Range Slider 1 to 100 */}
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="100"
            value={currentCount}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full accent-snavyo-purple cursor-pointer h-2 bg-snavyo-lavender rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-snavyo-text-secondary font-semibold">
            <span>1 Sheet (Mini)</span>
            <span>25 Sheets (Popular)</span>
            <span>50 Sheets (Deluxe)</span>
            <span>100 Sheets (Mega)</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-xs font-semibold text-snavyo-text-secondary uppercase tracking-wider block mb-2.5">
            Quick Sheet Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {SHEET_PRESETS.map((count) => {
              const isSelected = currentCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onSelect(count)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-snavyo-purple text-white shadow-sm ring-2 ring-snavyo-gold'
                      : 'bg-snavyo-background text-snavyo-text-main border border-snavyo-lavender hover:border-snavyo-purple/50'
                  }`}
                >
                  {count} {count === 1 ? 'Sheet' : 'Sheets'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Capacity & Production Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/70 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-snavyo-text-main">{totalPages} Pages</div>
            <div className="text-[11px] text-snavyo-text-secondary">
              {currentCount} spreads × 2 pages
            </div>
          </div>
        </div>

        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/70 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-snavyo-text-main">
              ~{minPhotos} – {maxPhotos} Photos
            </div>
            <div className="text-[11px] text-snavyo-text-secondary">
              Recommended photo capacity
            </div>
          </div>
        </div>

        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/70 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-snavyo-text-main">3 Variations</div>
            <div className="text-[11px] text-snavyo-text-secondary">
              Smart designs per sheet
            </div>
          </div>
        </div>
      </div>

      {albumSize && pixels && (
        <div className="bg-white/80 rounded-premium-xl border border-snavyo-lavender p-4 text-xs text-snavyo-text-secondary flex flex-wrap items-center justify-between gap-2">
          <span>
            Selected Size: <strong className="text-snavyo-text-main">{albumSize.inches} in</strong> ({albumSize.cm} cm)
          </span>
          <span>
            Print Pixels per Sheet: <strong className="text-snavyo-text-main font-mono">{pixels.width.toLocaleString()} × {pixels.height.toLocaleString()} px</strong>
          </span>
          <span>
            Resolution: <strong className="text-snavyo-text-main">300 PPI</strong>
          </span>
        </div>
      )}
    </div>
  );
}
