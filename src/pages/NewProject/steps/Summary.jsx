import { useState } from 'react';
import { pixelsForSize, PPI, SAFETY_MARGIN_PX } from '@/utils/albumData';
import { Button } from '@/components/common/Button';
import {
  Heart,
  Layout,
  FileCheck,
  Layers,
  ShieldCheck,
  ArrowRight,
  Palette,
  Sparkles,
  Edit3
} from 'lucide-react';

export default function Summary({ event, albumSize, sheetCount, onCreate }) {
  const defaultTitle = event
    ? `${event.label} Album - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'My Wedding Album';

  const [projectName, setProjectName] = useState(defaultTitle);

  const pixels = albumSize
    ? pixelsForSize(albumSize.spreadWidth, albumSize.height, albumSize.ppi || PPI)
    : null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onCreate(projectName.trim() || defaultTitle);
  };

  return (
    <div className="space-y-6">
      {/* Project Name Header Input */}
      <div className="bg-white rounded-premium-xl border border-snavyo-lavender p-5 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-snavyo-text-secondary mb-2 flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-snavyo-purple" />
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Priya & Rahul - Royal Wedding Album"
          className="w-full text-lg font-bold text-snavyo-text-main p-3 rounded-xl border border-snavyo-lavender focus:border-snavyo-purple focus:ring-2 focus:ring-snavyo-purple/20 bg-snavyo-background/40"
        />
      </div>

      {/* Grid of Key Technical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Event Card */}
        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: event?.colors?.primary || '#7550B8' }}
            >
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">
                Event Type
              </span>
              <h4 className="text-base font-bold text-snavyo-text-main">{event?.label}</h4>
            </div>
          </div>
          <p className="text-xs text-snavyo-text-secondary leading-relaxed">
            {event?.description}
          </p>
          <div className="pt-2 border-t border-snavyo-lavender/50 flex items-center gap-2 text-xs">
            <Palette className="w-3.5 h-3.5 text-snavyo-gold" />
            <span className="text-snavyo-text-secondary">Signature Palette:</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: event?.colors?.primary }}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: event?.colors?.secondary }}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: event?.colors?.accent }}
              />
            </div>
          </div>
        </div>

        {/* Album Dimensions Card */}
        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-snavyo-purple flex items-center justify-center text-white shadow-sm">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">
                Spread Dimensions
              </span>
              <h4 className="text-base font-bold text-snavyo-text-main">
                {albumSize?.inches} in ({albumSize?.cm} cm)
              </h4>
            </div>
          </div>
          <div className="space-y-1 text-xs text-snavyo-text-secondary font-mono">
            <div>Spread Width: {albumSize?.spreadWidth}&quot; • Height: {albumSize?.height}&quot;</div>
            <div>Each Page: {albumSize?.pageWidth}&quot; × {albumSize?.height}&quot;</div>
            <div className="text-snavyo-purple font-semibold font-sans">
              Resolution: {pixels?.width.toLocaleString()} × {pixels?.height.toLocaleString()} px @ {PPI} PPI
            </div>
          </div>
        </div>

        {/* Sheets & Pages Card */}
        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">
                Album Volume
              </span>
              <h4 className="text-base font-bold text-snavyo-text-main">
                {sheetCount} Spreads ({sheetCount * 2} Pages)
              </h4>
            </div>
          </div>
          <p className="text-xs text-snavyo-text-secondary">
            Recommended photo capacity: <strong>{sheetCount * 2} to {sheetCount * 6} photos</strong>.
            All sheets start clean and editable, ready for photos and smart layout variations.
          </p>
        </div>

        {/* Print Safety Margin Specifications Card */}
        <div className="bg-white rounded-premium-xl border border-snavyo-lavender/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-gold shadow-sm">
              <ShieldCheck className="w-5 h-5 text-snavyo-purple" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">
                Print Lab Safe Guides
              </span>
              <h4 className="text-base font-bold text-snavyo-text-main">
                {SAFETY_MARGIN_PX} px Safety Margins Active
              </h4>
            </div>
          </div>
          <ul className="text-xs text-snavyo-text-secondary space-y-1">
            <li>• 100 px top, bottom, left, and right outer bleed margins.</li>
            <li>• 100 px clearance on both sides of center fold spine line.</li>
            <li>• Non-exportable: guides will never appear in final artwork.</li>
          </ul>
        </div>
      </div>

      {/* Confirmation & Launch Card */}
      <div className="bg-gradient-to-r from-snavyo-purple to-snavyo-purple-dark text-white rounded-premium-xl p-6 shadow-luxury">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-snavyo-gold text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Step 5: Launch Album Studio
            </div>
            <h3 className="font-serif text-xl font-bold">Ready to design your wedding album</h3>
            <p className="text-xs text-snavyo-lavender/80 mt-1 max-w-xl">
              Clicking below creates the album workspace, sets up all {sheetCount} print-accurate sheets with safety margins,
              and opens the professional design studio.
            </p>
          </div>
          <Button
            variant="gold"
            size="lg"
            onClick={handleSubmit}
            className="whitespace-nowrap shadow-lg flex-shrink-0"
          >
            Create Album Project <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
