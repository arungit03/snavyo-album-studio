import { useState, useRef } from 'react';
import {
  Image,
  Layout,
  Palette,
  Type,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  FolderOpen,
  Filter,
  Heart,
  ImagePlus,
} from 'lucide-react';
import WeddingTemplateModal from './WeddingTemplateModal';
import WeddingGalleryModal from './WeddingGalleryModal';
import { WEDDING_TEMPLATES } from '@/utils/templateData';

const TABS = [
  { id: 'photos', label: 'Photos', icon: Image },
  { id: 'layouts', label: 'Layouts', icon: Layout },
  { id: 'backgrounds', label: 'Background', icon: Palette },
  { id: 'typography', label: 'Text', icon: Type },
  { id: 'decorations', label: 'Decor', icon: Sparkles },
];

export default function LeftSidebar({
  project,
  activeSheet,
  onAddPhoto,
  onAddText,
  onAddDecoration,
  onApplyBackground,
  onApplyWeddingTemplate,
  onApplyWeddingGalleryTemplate,
  onApplyLayout,
  onUploadPhotos,
}) {
  const [activeTab, setActiveTab] = useState('photos');
  const [photoFilter, setPhotoFilter] = useState('all'); // all | unused | used
  const [weddingTemplateOpen, setWeddingTemplateOpen] = useState(false);
  const [weddingGalleryOpen, setWeddingGalleryOpen] = useState(false);
  const fileInputRef = useRef(null);

  const photos = project?.photos || [];
  const isWeddingProject = project?.event?.id === 'wedding';

  // Determine which photos are currently used in the active sheet or whole project
  const usedPhotoIds = new Set();
  (project?.sheets || []).forEach((sheet) => {
    (sheet.layers || []).forEach((layer) => {
      if (layer.type === 'photo' && layer.photoId) {
        usedPhotoIds.add(layer.photoId);
      }
    });
  });

  const filteredPhotos = photos.filter((p) => {
    if (photoFilter === 'used') return usedPhotoIds.has(p.id);
    if (photoFilter === 'unused') return !usedPhotoIds.has(p.id);
    return true;
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUploadPhotos(files);
    }
  };

  return (
    <aside className="w-60 xl:w-72 bg-white border-r border-snavyo-lavender/80 flex flex-col h-full flex-shrink-0 select-none z-20">
      {/* Tab Navigation Icons */}
      <div className="flex items-center justify-around border-b border-snavyo-lavender bg-snavyo-background/60 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? 'bg-white text-snavyo-purple shadow-sm border border-snavyo-lavender'
                  : 'text-snavyo-text-secondary hover:text-snavyo-purple'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary">
                Photo Library ({photos.length})
              </h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-snavyo-purple text-white text-xs font-bold shadow-sm hover:bg-snavyo-purple-dark transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-snavyo-background rounded-lg p-1 border border-snavyo-lavender text-[11px]">
              <button
                type="button"
                onClick={() => setPhotoFilter('all')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  photoFilter === 'all' ? 'bg-white text-snavyo-purple shadow-sm' : 'text-snavyo-text-secondary'
                }`}
              >
                All ({photos.length})
              </button>
              <button
                type="button"
                onClick={() => setPhotoFilter('unused')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  photoFilter === 'unused' ? 'bg-white text-snavyo-purple shadow-sm' : 'text-snavyo-text-secondary'
                }`}
              >
                Unused ({photos.length - usedPhotoIds.size})
              </button>
              <button
                type="button"
                onClick={() => setPhotoFilter('used')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  photoFilter === 'used' ? 'bg-white text-snavyo-purple shadow-sm' : 'text-snavyo-text-secondary'
                }`}
              >
                Used ({usedPhotoIds.size})
              </button>
            </div>

            {/* Photo Grid */}
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {filteredPhotos.map((photo) => {
                  const isUsed = usedPhotoIds.has(photo.id);
                  return (
                    <div
                      key={photo.id}
                      className="group relative rounded-xl border border-snavyo-lavender/80 overflow-hidden bg-snavyo-background aspect-[4/3] cursor-pointer hover:border-snavyo-purple transition-all"
                      onClick={() => onAddPhoto(photo)}
                      title="Click to add photo frame to active sheet"
                    >
                      <img
                        src={photo.previewUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isUsed && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Used
                        </div>
                      )}
                      <div className="absolute inset-0 bg-snavyo-purple/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                        <Plus className="w-4 h-4 mr-1" /> Add Frame
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-snavyo-lavender rounded-2xl p-6 text-center hover:border-snavyo-purple/60 transition-colors cursor-pointer bg-snavyo-background/40"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-10 h-10 rounded-full bg-snavyo-lavender flex items-center justify-center mx-auto mb-2 text-snavyo-purple">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-snavyo-text-main">Drop wedding photos here</p>
                <p className="text-[11px] text-snavyo-text-secondary mt-1">
                  or click to browse JPEG, PNG, WebP
                </p>
              </div>
            )}
          </div>
        )}

        {/* LAYOUTS TAB */}
        {activeTab === 'layouts' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Smart Spread Layouts
              </h3>
              <p className="text-[11px] text-snavyo-text-secondary leading-snug">
                Apply a professionally balanced composition. All elements remain 100% editable.
              </p>
            </div>

            <div className="space-y-3">
              {/* Grand Hero */}
              <button
                type="button"
                onClick={() => onApplyLayout('grand-hero')}
                className="w-full p-3 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple hover:shadow-sm bg-white text-left transition-all"
              >
                <div className="h-14 bg-snavyo-background rounded-lg border border-snavyo-lavender flex gap-1.5 p-1.5 mb-2">
                  <div className="w-2/3 bg-snavyo-purple/20 border border-snavyo-purple/40 rounded flex items-center justify-center text-[9px] font-bold text-snavyo-purple">
                    Grand Hero Photo (60%)
                  </div>
                  <div className="w-1/3 flex flex-col gap-1">
                    <div className="h-1/2 bg-snavyo-lavender rounded" />
                    <div className="h-1/2 bg-snavyo-lavender rounded" />
                  </div>
                </div>
                <div className="font-bold text-xs text-snavyo-text-main">1. Grand Hero Spread</div>
                <div className="text-[10px] text-snavyo-text-secondary">
                  1 Large cinematic hero on left page + 2 supporting photos on right
                </div>
              </button>

              {/* Balanced Editorial */}
              <button
                type="button"
                onClick={() => onApplyLayout('editorial')}
                className="w-full p-3 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple hover:shadow-sm bg-white text-left transition-all"
              >
                <div className="h-14 bg-snavyo-background rounded-lg border border-snavyo-lavender flex gap-1.5 p-1.5 mb-2">
                  <div className="w-1/2 flex gap-1">
                    <div className="w-1/2 bg-snavyo-lavender rounded" />
                    <div className="w-1/2 bg-snavyo-lavender rounded" />
                  </div>
                  <div className="w-1/2 flex gap-1">
                    <div className="w-1/2 bg-snavyo-lavender rounded" />
                    <div className="w-1/2 bg-snavyo-lavender rounded" />
                  </div>
                </div>
                <div className="font-bold text-xs text-snavyo-text-main">2. Luxury Editorial Spread</div>
                <div className="text-[10px] text-snavyo-text-secondary">
                  4 balanced portrait frames with generous white borders
                </div>
              </button>

              {/* Cinematic 3-Photo */}
              <button
                type="button"
                onClick={() => onApplyLayout('cinematic')}
                className="w-full p-3 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple hover:shadow-sm bg-white text-left transition-all"
              >
                <div className="h-14 bg-snavyo-background rounded-lg border border-snavyo-lavender flex gap-1.5 p-1.5 mb-2">
                  <div className="w-1/3 bg-snavyo-lavender rounded" />
                  <div className="w-1/3 bg-snavyo-purple/20 border border-snavyo-purple/40 rounded flex items-center justify-center text-[9px] font-bold text-snavyo-purple">
                    Hero
                  </div>
                  <div className="w-1/3 bg-snavyo-lavender rounded" />
                </div>
                <div className="font-bold text-xs text-snavyo-text-main">3. Cinematic 3-Photo Spread</div>
                <div className="text-[10px] text-snavyo-text-secondary">
                  Symmetrical cinematic trio with central spotlight
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BACKGROUNDS TAB */}
        {activeTab === 'backgrounds' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Wedding Backgrounds
              </h3>
              <p className="text-[11px] text-snavyo-text-secondary">
                Add a designed atmosphere to the active spread. Each treatment stays print-friendly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {isWeddingProject && (
                <>
                  <button type="button" onClick={() => setWeddingTemplateOpen(true)} className="group col-span-2 rounded-xl border border-[#d7b8a6] bg-[#fff4ec] p-2 text-left transition-all hover:border-[#8c5a4c] hover:shadow-sm">
                    <div className="relative h-24 overflow-hidden rounded-lg border border-[#ead1c2] bg-[#f9e8dc]">
                      <img src={WEDDING_TEMPLATES.classic.preview} alt="Wed-Day wedding template" className="h-full w-full object-cover" />
                      <span className="absolute bottom-2 left-2 rounded-full bg-[#4b2b2a]/85 px-2 py-1 text-[9px] font-bold text-white">Personalise template</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-[#4b2b2a]">{WEDDING_TEMPLATES.classic.label}</span>
                      <Heart className="h-3.5 w-3.5 fill-[#8c5a4c] text-[#8c5a4c]" />
                    </div>
                  </button>
                  <button type="button" onClick={() => setWeddingGalleryOpen(true)} className="group col-span-2 rounded-xl border border-[#c9c3bb] bg-[#f4f2ef] p-2 text-left transition-all hover:border-[#6d675f] hover:shadow-sm">
                    <div className="relative h-24 overflow-hidden rounded-lg border border-[#d9d4ce] bg-[#e9e6e1]">
                      <img src={WEDDING_TEMPLATES.gallery.preview} alt="Wedding gallery spread template" className="h-full w-full object-cover" />
                      <span className="absolute bottom-2 left-2 rounded-full bg-[#37332f]/85 px-2 py-1 text-[9px] font-bold text-white">Auto-fit photo frames</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-[#37332f]">{WEDDING_TEMPLATES.gallery.label}</span>
                      <ImagePlus className="h-3.5 w-3.5 text-[#6d675f]" />
                    </div>
                  </button>
                </>
              )}
              {[
                {
                  name: 'Petal Veil',
                  color: '#FFF9F7',
                  border: '#F1CFC8',
                  background: 'radial-gradient(circle at 12% 20%, rgba(234, 159, 166, .28) 0 7%, transparent 8%), radial-gradient(circle at 82% 75%, rgba(248, 205, 178, .3) 0 9%, transparent 10%), linear-gradient(135deg, #fffaf8 0%, #fdf0ef 52%, #fff9f4 100%)',
                },
                {
                  name: 'Champagne Silk',
                  color: '#F7F0DF',
                  border: '#DEC797',
                  background: 'repeating-linear-gradient(112deg, rgba(255,255,255,.34) 0 2px, transparent 2px 16px), linear-gradient(135deg, #fff9eb 0%, #ead8ae 48%, #fff8e8 100%)',
                },
                {
                  name: 'Pressed Florals',
                  color: '#F8F5FF',
                  border: '#DCCBFA',
                  background: 'radial-gradient(ellipse at 18% 28%, rgba(168, 128, 206, .3) 0 4%, transparent 5%), radial-gradient(ellipse at 78% 68%, rgba(211, 145, 174, .28) 0 5%, transparent 6%), linear-gradient(145deg, #fffaff, #f0e8fb 58%, #fff8f5)',
                },
                {
                  name: 'Rosewater Blush',
                  color: '#FCEDEF',
                  border: '#F2C0CB',
                  background: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,.72), transparent 28%), linear-gradient(150deg, #fff8f7 0%, #f9d9df 50%, #f5e8ef 100%)',
                },
                {
                  name: 'Garden Sage',
                  color: '#EEF5F0',
                  border: '#BFD8C7',
                  background: 'radial-gradient(circle at 20% 80%, rgba(105, 147, 121, .18) 0 10%, transparent 11%), linear-gradient(125deg, #f9fcf7 0%, #dcebe0 50%, #eef5ed 100%)',
                },
                {
                  name: 'Pearl Glow',
                  color: '#F6F5F0',
                  border: '#D7D2C2',
                  background: 'radial-gradient(circle at 50% -10%, rgba(255,255,255,.95), transparent 45%), linear-gradient(120deg, #eeeae2 0%, #fffdf8 48%, #e8e5ee 100%)',
                },
                {
                  name: 'Velvet Plum',
                  color: '#301941',
                  border: '#5E3B71',
                  background: 'radial-gradient(circle at 20% 15%, rgba(210, 155, 204, .22), transparent 30%), linear-gradient(135deg, #1d102d 0%, #422052 55%, #24122f 100%)',
                  dark: true,
                },
                {
                  name: 'Midnight Blue Hour',
                  color: '#151C35',
                  border: '#39466E',
                  background: 'radial-gradient(circle at 78% 20%, rgba(220, 196, 146, .25) 0 2px, transparent 3px), radial-gradient(circle at 24% 68%, rgba(255,255,255,.12) 0 1px, transparent 2px), linear-gradient(145deg, #111629 0%, #263557 58%, #14172c 100%)',
                  dark: true,
                },
              ].map((bg) => (
                <button
                  key={bg.name}
                  type="button"
                  onClick={() => onApplyBackground(bg)}
                  className="group p-2 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple hover:shadow-sm flex flex-col items-center gap-1.5 transition-all text-left"
                >
                  <div
                    className="w-full h-12 rounded-lg shadow-inner border transition-transform group-hover:scale-[1.02]"
                    style={{ background: bg.background, borderColor: bg.border }}
                  />
                  <span className={`text-[10px] font-bold ${bg.dark ? 'text-snavyo-text-main' : 'text-snavyo-text-main'}`}>
                    {bg.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TYPOGRAPHY TAB */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Typography & Quotes
              </h3>
              <p className="text-[11px] text-snavyo-text-secondary">
                Click to add editable wedding headings and calligraphy text.
              </p>
            </div>

            <div className="space-y-2">
              {(project?.event?.textSuggestions || [
                'Wedding Moments',
                'Forever Together',
                'Our Wedding Story',
                'A Lifetime of Love',
              ]).map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => onAddText(text, 'Playfair Display', 32)}
                  className="w-full p-2.5 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple hover:bg-snavyo-lavender/30 text-left transition-all"
                >
                  <div className="font-serif text-sm font-bold text-snavyo-text-main line-clamp-1">
                    {text}
                  </div>
                  <div className="text-[10px] text-snavyo-text-secondary mt-0.5">
                    Click to add heading to sheet
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={() => onAddText('Enter Your Text Here', 'sans-serif', 20)}
                className="w-full p-2.5 rounded-xl border-2 border-dashed border-snavyo-lavender hover:border-snavyo-purple text-center text-xs font-bold text-snavyo-purple hover:bg-snavyo-lavender/20 transition-all mt-2"
              >
                + Add Custom Text Layer
              </button>
            </div>
          </div>
        )}

        {/* DECORATIONS TAB */}
        {activeTab === 'decorations' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-1">
                Luxury Gold Decorations
              </h3>
              <p className="text-[11px] text-snavyo-text-secondary">
                Add refined borders, dividers, and ornamental flourishes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Gold Center Line', type: 'line', color: '#D4AF62' },
                { name: 'Minimal Border', type: 'border', color: '#D4AF62' },
                { name: 'Corner Filigree', type: 'corner', color: '#D4AF62' },
                { name: 'Floral Motif', type: 'floral', color: '#7550B8' },
              ].map((dec) => (
                <button
                  key={dec.name}
                  type="button"
                  onClick={() => onAddDecoration(dec)}
                  className="p-3 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple flex flex-col items-center justify-center gap-1.5 transition-all text-center bg-white"
                >
                  <Sparkles className="w-5 h-5 text-snavyo-gold" />
                  <span className="text-[10px] font-bold text-snavyo-text-main">{dec.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <WeddingTemplateModal
        isOpen={weddingTemplateOpen}
        onClose={() => setWeddingTemplateOpen(false)}
        onApply={onApplyWeddingTemplate}
      />
      <WeddingGalleryModal
        isOpen={weddingGalleryOpen}
        onClose={() => setWeddingGalleryOpen(false)}
        onApply={onApplyWeddingGalleryTemplate}
      />
    </aside>
  );
}

