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
} from 'lucide-react';
import { templateFitsAspect } from '@/utils/templateProcessor';

const backgroundImageModules = import.meta.glob('../../assets/templates/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const backgroundImages = Object.entries(backgroundImageModules).map(([path, src]) => ({
  src,
  name: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
}));

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
  onApplyLayout,
  designerTemplates = [],
  onApplyDesignerTemplate,
  onUploadPhotos,
}) {
  const [activeTab, setActiveTab] = useState('photos');
  const [photoFilter, setPhotoFilter] = useState('all'); // all | unused | used
  const fileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const photos = project?.photos || [];
  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onApplyBackground({ image: reader.result, color: '#FFFFFF', background: null });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

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
                  ? 'bg-white text-snavyo-purple shadow-[0_2px_8px_rgba(117,80,184,0.12)] border border-snavyo-lavender/90'
                  : 'text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-white/60'
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
            <div className="rounded-2xl border border-amber-300/70 bg-gradient-to-b from-amber-50/50 via-white to-purple-50/30 p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="badge-gold">
                  <Sparkles className="w-2.5 h-2.5" />
                  Designer Templates
                </span>
                <span className="text-[10px] font-bold text-amber-800">
                  {designerTemplates.length} Available
                </span>
              </div>
              <p className="text-[10px] text-snavyo-text-secondary leading-tight">
                Click any template to apply its custom background and smart photo slots to this sheet.
              </p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5 scrollbar-thin">
                {designerTemplates.filter((template) => template.slots?.length).length ? designerTemplates.filter((template) => template.slots?.length).map((template) => (
                  <div key={template.id} className="rounded-xl border border-snavyo-lavender/80 bg-white/90 p-2 hover:border-amber-400 hover:shadow-xs transition-all group">
                    <button type="button" onClick={() => onApplyDesignerTemplate?.(template)} className="w-full flex items-center gap-2.5 text-left">
                      <img src={template.imagePath} alt="" className="h-10 w-16 rounded-md object-cover border border-snavyo-lavender/60 group-hover:scale-103 transition-transform" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-bold text-snavyo-text-main group-hover:text-snavyo-purple">{template.name}</span>
                        <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/50">{template.slots.length} photo slots</span>
                      </span>
                    </button>
                  </div>
                )) : <p className="text-[10px] text-snavyo-text-secondary">No detected templates yet.</p>}
              </div>
            </div>
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-secondary mb-1">Background images</h3>
              <p className="text-[11px] text-snavyo-text-secondary">Choose an image from src/assets/templates or upload your own.</p>
            </div>
            <input ref={backgroundInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleBackgroundImageUpload} className="hidden" aria-label="Upload a background image" />
            <button type="button" onClick={() => backgroundInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-snavyo-purple/40 bg-white p-3 text-xs font-bold text-snavyo-purple hover:bg-snavyo-lavender/40">
              <Upload className="h-4 w-4" /> Upload background image
            </button>
            {backgroundImages.length ? <div className="grid grid-cols-2 gap-2.5">
              {backgroundImages.map((bg) => {
                const bgSlug = bg.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const matched = designerTemplates.find((t) => {
                  const idSlug = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                  return idSlug.includes(bgSlug) || bgSlug.includes(idSlug);
                });
                return (
                  <button
                    key={bg.src}
                    type="button"
                    onClick={() => {
                      if (matched) {
                        onApplyDesignerTemplate?.(matched);
                      } else {
                        onApplyBackground({ image: bg.src, color: '#FFFFFF', background: null });
                      }
                    }}
                    className="group p-2 rounded-xl border border-snavyo-lavender hover:border-snavyo-purple hover:shadow-sm flex flex-col items-center gap-1.5 transition-all text-left relative"
                  >
                    <img src={bg.src} alt={bg.name} className="h-20 w-full rounded-lg border border-snavyo-lavender object-cover transition-transform group-hover:scale-[1.02]" />
                    <span className="line-clamp-1 text-[10px] font-bold text-snavyo-text-main">{bg.name}</span>
                    {matched?.slots?.length ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-snavyo-purple/10 text-snavyo-purple">
                        {matched.slots.length} photo slots
                      </span>
                    ) : null}
                  </button>
                );
              })}</div> : <p className="rounded-xl border border-snavyo-lavender bg-white p-3 text-[10px] text-snavyo-text-secondary">Add images to src/assets/templates to show them here.</p>}
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

    </aside>
  );
}

