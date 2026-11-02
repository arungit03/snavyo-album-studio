import { useState } from 'react';
import { pixelsForSize, PPI } from '@/utils/albumData';
import { Button } from '@/components/common/Button';
import { Ruler, Check, Info } from 'lucide-react';

export default function AlbumSizeSelection({
  sizes,
  onSelect,
  selected,
  customWidth,
  customHeight,
  onCustomChange,
  onCustomHeightChange,
}) {
  const [tab, setTab] = useState('standard'); // 'standard' | 'custom'
  const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'
  const [customPpi, setCustomPpi] = useState(300);

  const handleCustomApply = () => {
    let w = parseFloat(customWidth);
    let h = parseFloat(customHeight);
    if (!w || !h || w <= 0 || h <= 0) {
      alert('Please enter valid positive dimensions.');
      return;
    }

    // Convert cm to inches if needed
    let widthInches = w;
    let heightInches = h;
    if (unit === 'cm') {
      widthInches = w / 2.54;
      heightInches = h / 2.54;
    }

    // Spread width is typically larger than height
    const spreadWidth = Math.max(widthInches, heightInches);
    const spreadHeight = Math.min(widthInches, heightInches);
    const ppi = parseInt(customPpi, 10) || 300;
    const px = pixelsForSize(spreadWidth, spreadHeight, ppi);

    const customObj = {
      id: `custom_${spreadWidth.toFixed(1)}x${spreadHeight.toFixed(1)}`,
      inches: `${spreadHeight.toFixed(1)} × ${spreadWidth.toFixed(1)}`,
      cm: `${(spreadHeight * 2.54).toFixed(1)} × ${(spreadWidth * 2.54).toFixed(1)}`,
      spreadWidth: parseFloat(spreadWidth.toFixed(2)),
      height: parseFloat(spreadHeight.toFixed(2)),
      pageWidth: parseFloat((spreadWidth / 2).toFixed(2)),
      orientation: 'Landscape Spread',
      category: 'Custom Album',
      description: `Custom ${spreadHeight.toFixed(1)}" × ${spreadWidth.toFixed(1)}" spread (${(spreadWidth / 2).toFixed(1)}" per page)`,
      ppi,
      pixels: px,
    };

    onSelect(customObj);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-snavyo-lavender pb-3">
        <button
          type="button"
          onClick={() => setTab('standard')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === 'standard'
              ? 'bg-snavyo-purple text-white shadow-sm'
              : 'text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-snavyo-lavender/50'
          }`}
        >
          Standard Print Sizes (9)
        </button>
        <button
          type="button"
          onClick={() => setTab('custom')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === 'custom'
              ? 'bg-snavyo-purple text-white shadow-sm'
              : 'text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-snavyo-lavender/50'
          }`}
        >
          Custom Dimensions
        </button>
      </div>

      {tab === 'standard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sizes.map((size) => {
            const isSelected = selected === size.id;
            const px = pixelsForSize(size.spreadWidth, size.height, PPI);
            const ratio = size.spreadWidth / size.height;

            return (
              <button
                key={size.id}
                type="button"
                onClick={() => onSelect(size)}
                className={`flex flex-col p-4 rounded-premium-xl border transition-all duration-200 text-left cursor-pointer group relative ${
                  isSelected
                    ? 'bg-white border-snavyo-purple shadow-gold ring-2 ring-snavyo-purple'
                    : 'bg-white border-snavyo-lavender/70 hover:border-snavyo-purple/50 hover:shadow-luxury hover:-translate-y-0.5'
                }`}
              >
                {/* Visual Spread Preview with Center Fold Spine */}
                <div className="w-full h-24 bg-snavyo-background rounded-lg border border-snavyo-lavender/60 relative overflow-hidden flex items-center justify-center p-2 mb-3">
                  <div
                    className="h-16 bg-white border border-snavyo-purple/30 rounded shadow-sm relative flex items-center justify-center overflow-hidden"
                    style={{
                      aspectRatio: `${ratio} / 1`,
                      maxWidth: '100%',
                    }}
                  >
                    {/* Left page label */}
                    <span className="text-[8px] font-semibold text-snavyo-text-secondary opacity-60 w-1/2 text-center">
                      Left
                    </span>
                    {/* Dotted Center Fold Spine */}
                    <div className="h-full border-r border-dashed border-snavyo-purple/60 absolute left-1/2 top-0 bottom-0" />
                    {/* Right page label */}
                    <span className="text-[8px] font-semibold text-snavyo-text-secondary opacity-60 w-1/2 text-center">
                      Right
                    </span>

                    {/* Badge */}
                    <div className="absolute bottom-0.5 px-1 bg-snavyo-purple/90 text-white text-[7px] font-mono rounded">
                      {size.inches} in
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className="font-serif text-lg font-bold text-snavyo-text-main group-hover:text-snavyo-purple transition-colors">
                    {size.inches} in
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-snavyo-lavender text-snavyo-purple">
                    {size.category}
                  </span>
                </div>

                <div className="text-xs text-snavyo-text-secondary mt-0.5">
                  {size.cm} cm
                </div>

                <div className="mt-2 text-[11px] text-snavyo-text-secondary/90 leading-tight">
                  {size.description}
                </div>

                <div className="mt-3 pt-2.5 border-t border-snavyo-lavender/40 w-full flex items-center justify-between text-[11px]">
                  <span className="text-snavyo-text-secondary font-mono">
                    {px.width.toLocaleString()} × {px.height.toLocaleString()} px
                  </span>
                  <span className="font-semibold text-snavyo-purple">
                    @ {PPI} PPI
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-snavyo-purple text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-premium-xl border border-snavyo-lavender p-6 space-y-6">
          <div className="flex items-center gap-2 text-snavyo-text-main font-bold text-base">
            <Ruler className="w-5 h-5 text-snavyo-purple" />
            <h3>Custom Album Spread Dimensions</h3>
          </div>
          <p className="text-xs text-snavyo-text-secondary">
            Enter your custom print dimensions. In wedding albums, the spread width represents the open flat album (left + right page).
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-snavyo-text-secondary uppercase">Unit:</span>
            <button
              type="button"
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                unit === 'inches' ? 'bg-snavyo-purple text-white' : 'bg-snavyo-lavender text-snavyo-purple'
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                unit === 'cm' ? 'bg-snavyo-purple text-white' : 'bg-snavyo-lavender text-snavyo-purple'
              }`}
            >
              Centimetres (cm)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Spread Width ({unit})
              </label>
              <input
                type="number"
                step="0.5"
                min="6"
                max="60"
                value={customWidth}
                onChange={(e) => onCustomChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-snavyo-lavender bg-white text-snavyo-text-main focus:border-snavyo-purple focus:ring-1 focus:ring-snavyo-purple"
                placeholder={unit === 'inches' ? 'e.g. 36' : 'e.g. 91.4'}
              />
              <span className="text-[10px] text-snavyo-text-secondary mt-1 block">
                Total open flat width (Left + Right page)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Height ({unit})
              </label>
              <input
                type="number"
                step="0.5"
                min="6"
                max="30"
                value={customHeight}
                onChange={(e) => onCustomHeightChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-snavyo-lavender bg-white text-snavyo-text-main focus:border-snavyo-purple focus:ring-1 focus:ring-snavyo-purple"
                placeholder={unit === 'inches' ? 'e.g. 12' : 'e.g. 30.5'}
              />
              <span className="text-[10px] text-snavyo-text-secondary mt-1 block">
                Vertical height of the album sheet
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Resolution (PPI)
              </label>
              <select
                value={customPpi}
                onChange={(e) => setCustomPpi(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-snavyo-lavender bg-white text-snavyo-text-main focus:border-snavyo-purple focus:ring-1 focus:ring-snavyo-purple text-xs font-semibold"
              >
                <option value={300}>300 PPI (Industry Print Standard)</option>
                <option value={240}>240 PPI (Standard)</option>
                <option value={150}>150 PPI (Draft / Screen)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="luxury" size="sm" onClick={handleCustomApply}>
              Apply Custom Size
            </Button>
          </div>
        </div>
      )}

      {/* Printing safety notice */}
      <div className="flex items-start gap-2.5 p-3.5 bg-snavyo-lavender/40 rounded-xl border border-snavyo-lavender text-xs text-snavyo-text-secondary">
        <Info className="w-4 h-4 text-snavyo-purple flex-shrink-0 mt-0.5" />
        <p>
          All SNAVYO spreads automatically include standard <strong>100 px safety margins</strong> and a{' '}
          <strong>centre cutting spine guide</strong> (100 px clearance on both sides) to guarantee perfect print lab binding.
        </p>
      </div>
    </div>
  );
}
