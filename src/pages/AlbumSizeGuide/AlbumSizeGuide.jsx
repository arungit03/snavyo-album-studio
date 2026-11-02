import { useState } from 'react';
import { Layout, Ruler, Shield, Columns, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALBUM_SIZES, PPI, pixelsForSize, calculateSafetyGuides } from '@/utils/albumData';
import { Button } from '@/components/common/Button';

export default function AlbumSizeGuide() {
  const [selectedSize, setSelectedSize] = useState(ALBUM_SIZES[4]); // 12x36
  const [customW, setCustomW] = useState(36);
  const [customH, setCustomH] = useState(12);

  const activeSpreadWidth = selectedSize ? selectedSize.spreadWidth : customW;
  const activeHeight = selectedSize ? selectedSize.height : customH;
  const activePx = pixelsForSize(activeSpreadWidth, activeHeight, PPI);
  const activeRatio = activeSpreadWidth / activeHeight;

  return (
    <div className="min-h-screen bg-snavyo-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" to="/">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-snavyo-purple">
            Print Lab Specification Guide
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-snavyo-lavender p-6 sm:p-8 shadow-luxury">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-snavyo-text-main">
            Wedding Album Size & Safety Guide
          </h1>
          <p className="text-sm text-snavyo-text-secondary mt-2 max-w-3xl leading-relaxed">
            Professional wedding albums are designed and printed as continuous flat <strong>spreads</strong>.
            For example, a standard 12 × 36-inch album opens into a 36-inch wide spread (two 12 × 18-inch pages)
            with a center cutting and binding spine.
          </p>

          {/* Interactive Proportional Spread Diagram */}
          <div className="mt-8 p-6 bg-snavyo-background rounded-2xl border border-snavyo-lavender space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-snavyo-purple">
                  Live Spread Preview (300 PPI Output)
                </span>
                <h3 className="font-serif text-lg font-bold text-snavyo-text-main">
                  {selectedSize ? `${selectedSize.inches} in (${selectedSize.cm} cm)` : `${customH}" × ${customW}" Custom Spread`}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-snavyo-purple block">
                  {activePx.width.toLocaleString()} × {activePx.height.toLocaleString()} px
                </span>
                <span className="text-[11px] text-snavyo-text-secondary">@ 300 PPI Print Resolution</span>
              </div>
            </div>

            {/* The Visual Proportional Spread */}
            <div className="w-full flex items-center justify-center p-4 bg-white/70 rounded-xl border border-snavyo-lavender">
              <div
                className="relative bg-white border-2 border-snavyo-purple/60 rounded shadow-md overflow-hidden max-w-full"
                style={{
                  width: 'min(100%, 720px)',
                  aspectRatio: `${activeRatio} / 1`,
                }}
              >
                {/* 100px outer safety guides overlay */}
                <div className="absolute inset-[3%] border border-dashed border-rose-400/80 pointer-events-none z-10 flex items-start justify-start p-1">
                  <span className="text-[8px] font-mono text-rose-500 font-bold bg-white/80 px-1 rounded">
                    100 px Outer Safety Margin
                  </span>
                </div>

                {/* 100px Center clearance zone (200px total width) */}
                <div className="absolute top-0 bottom-0 left-[48%] right-[48%] bg-amber-500/10 border-x border-dashed border-amber-400 pointer-events-none z-10 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-amber-600 uppercase tracking-widest rotate-90">
                    Spine Zone
                  </span>
                </div>

                {/* Center Cutting Spine Line */}
                <div className="absolute top-0 bottom-0 left-1/2 border-r-2 border-dashed border-snavyo-purple z-20" />

                {/* Left Page & Right Page labels */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 flex flex-col items-center justify-center p-2 text-center border-r border-snavyo-lavender/40">
                    <span className="text-xs font-serif font-bold text-snavyo-text-main">Left Page</span>
                    <span className="text-[10px] text-snavyo-text-secondary">
                      {selectedSize?.pageWidth || (customW / 2).toFixed(1)}&quot; × {activeHeight}&quot;
                    </span>
                    <span className="text-[9px] font-mono text-snavyo-purple/80">
                      {Math.round(activePx.width / 2).toLocaleString()} × {activePx.height.toLocaleString()} px
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-xs font-serif font-bold text-snavyo-text-main">Right Page</span>
                    <span className="text-[10px] text-snavyo-text-secondary">
                      {selectedSize?.pageWidth || (customW / 2).toFixed(1)}&quot; × {activeHeight}&quot;
                    </span>
                    <span className="text-[9px] font-mono text-snavyo-purple/80">
                      {Math.round(activePx.width / 2).toLocaleString()} × {activePx.height.toLocaleString()} px
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-snavyo-text-secondary pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-snavyo-lavender">
                <Shield className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>100 px safety margins protect faces from outer trim.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-snavyo-lavender">
                <Columns className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>200 px center clearance protects subjects from book spine crease.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-snavyo-lavender">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>All guides are non-exportable and never appear in print files.</span>
              </div>
            </div>
          </div>

          {/* Standard 9 Sizes Table */}
          <div className="mt-8 space-y-4">
            <h3 className="font-serif text-xl font-bold text-snavyo-text-main flex items-center gap-2">
              <Layout className="w-5 h-5 text-snavyo-purple" />
              Standard Wedding Album Print Dimensions (Section 7.1)
            </h3>
            <div className="overflow-x-auto border border-snavyo-lavender rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-snavyo-background text-snavyo-text-secondary uppercase tracking-wider font-semibold border-b border-snavyo-lavender">
                  <tr>
                    <th className="p-3.5">Standard Size</th>
                    <th className="p-3.5">Metric (cm)</th>
                    <th className="p-3.5">Full Spread (W × H)</th>
                    <th className="p-3.5">Single Page Size</th>
                    <th className="p-3.5">300 PPI Resolution</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-snavyo-lavender/60">
                  {ALBUM_SIZES.map((size) => {
                    const px = pixelsForSize(size.spreadWidth, size.height, PPI);
                    const isSelected = selectedSize?.id === size.id;

                    return (
                      <tr
                        key={size.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-snavyo-lavender/50 font-bold' : 'hover:bg-snavyo-lavender/20'
                        }`}
                      >
                        <td className="p-3.5 font-bold text-snavyo-text-main flex items-center gap-1.5">
                          {size.inches} in
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-snavyo-purple" />
                          )}
                        </td>
                        <td className="p-3.5 text-snavyo-text-secondary">{size.cm} cm</td>
                        <td className="p-3.5 font-mono text-snavyo-text-main">
                          {size.spreadWidth}&quot; × {size.height}&quot;
                        </td>
                        <td className="p-3.5 font-mono text-snavyo-text-secondary">
                          {size.pageWidth}&quot; × {size.height}&quot;
                        </td>
                        <td className="p-3.5 font-mono text-snavyo-purple font-semibold">
                          {px.width.toLocaleString()} × {px.height.toLocaleString()} px
                        </td>
                        <td className="p-3.5 text-snavyo-text-secondary">{size.category}</td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-snavyo-lavender text-snavyo-purple hover:bg-snavyo-purple hover:text-white transition-colors"
                          >
                            Preview
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
