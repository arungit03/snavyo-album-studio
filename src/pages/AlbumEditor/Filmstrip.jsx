import { Plus, Copy, Trash2, Layers } from 'lucide-react';

export default function Filmstrip({
  project,
  activeSheetIndex,
  onSelectSheet,
  onAddSheet,
  onDuplicateSheet,
  onDeleteSheet,
}) {
  const sheets = project?.sheets || [];
  const albumSize = project?.albumSize || { spreadWidth: 36, height: 12 };
  const ratio = (albumSize.spreadWidth || 36) / (albumSize.height || 12);

  return (
    <footer className="h-24 flex-shrink-0 bg-[#fbfaff]/95 backdrop-blur-sm border-t border-snavyo-lavender px-5 py-2.5 flex items-center gap-5 shadow-[0_-6px_20px_rgba(75,48,125,0.06)] select-none z-20">
      {/* Navigator label and primary action */}
      <div className="w-32 flex-shrink-0 self-stretch flex flex-col justify-center border-r border-snavyo-lavender/80 pr-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-snavyo-text-secondary flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-snavyo-purple" />
          Spreads
        </span>
        <span className="mt-0.5 font-serif text-sm font-bold text-snavyo-text-main">
          {sheets.length} {sheets.length === 1 ? 'spread' : 'spreads'}
        </span>
        <button
          type="button"
          onClick={onAddSheet}
          className="mt-1.5 inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-lg bg-snavyo-purple text-white text-[10px] font-bold hover:bg-snavyo-purple-dark transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" /> New spread
        </button>
      </div>

      {/* Horizontal scrollable spread navigator */}
      <div className="flex-1 min-w-0 overflow-x-auto flex items-center gap-3 py-1 scrollbar-thin">
        {sheets.map((sheet, index) => {
          const isActive = index === activeSheetIndex;
          const photoCount = (sheet.layers || []).filter((l) => l.type === 'photo').length;

          return (
            <div
              key={sheet.id || index}
              onClick={() => onSelectSheet(index)}
              className={`w-44 flex-shrink-0 flex flex-col gap-1.5 p-1.5 rounded-xl border transition-all cursor-pointer group relative ${
                isActive
                  ? 'bg-gradient-to-b from-purple-50 to-white border-snavyo-purple shadow-[0_4px_16px_rgba(117,80,184,0.2),_0_0_0_1.5px_rgba(212,175,98,0.5)] ring-1 ring-amber-400/40'
                  : 'bg-white/80 border-snavyo-lavender/80 hover:border-snavyo-purple/50 hover:bg-white hover:shadow-xs'
              }`}
            >
              {/* Miniature Spread Canvas Preview */}
              <div
                className="h-12 w-full bg-white border border-snavyo-lavender/80 rounded-lg shadow-xs relative flex items-center justify-center overflow-hidden"
                style={{
                  aspectRatio: `${ratio} / 1`,
                  background: sheet.background?.image
                    ? `url(${sheet.background.image}) center / 100% 100% no-repeat`
                    : sheet.background?.css || sheet.background?.value || '#FFFFFF',
                }}
              >
                {/* Center fold dotted line */}
                <div className="absolute top-0 bottom-0 left-1/2 border-r border-dashed border-snavyo-purple/50" />

                {/* Render miniature boxes for photos */}
                {(sheet.layers || []).map((layer) => {
                  if (layer.type === 'photo') {
                    return (
                      <div
                        key={layer.id}
                        className="absolute bg-snavyo-purple/30 rounded-xs border border-snavyo-purple/50"
                        style={{
                          left: `${layer.x}%`,
                          top: `${layer.y}%`,
                          width: `${layer.width}%`,
                          height: `${layer.height}%`,
                        }}
                      />
                    );
                  }
                  return null;
                })}

                <span className="text-[10px] font-bold text-snavyo-text-secondary/70 z-10">
                  {index + 1}
                </span>
              </div>

              {/* Title and inline actions */}
              <div className="flex items-center justify-between w-full px-0.5 text-[10px]">
                <span className={`font-bold ${isActive ? 'text-snavyo-purple' : 'text-snavyo-text-main'}`}>
                  Sheet {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  {photoCount > 0 && (
                    <span className="text-[9px] text-snavyo-text-secondary">
                      {photoCount} photo{photoCount === 1 ? '' : 's'}
                    </span>
                  )}
                  {isActive && (
                    <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-snavyo-purple/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSheet(index);
                    }}
                    className="p-0.5 text-snavyo-text-secondary hover:text-snavyo-purple"
                    title="Duplicate Sheet"
                  >
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                  {sheets.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSheet(index);
                      }}
                      className="p-0.5 text-rose-500 hover:text-rose-700"
                      title="Delete Sheet"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
}

