import { useRef, useState, useEffect } from 'react';
import { Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { calculateSafetyGuides } from '../../utils/albumData';

export default function CanvasWorkspace({
  project,
  activeSheetIndex,
  zoom = 1,
  onZoomChange,
  showGuides = true,
  showCenterSpine = true,
  showGrid = false,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
}) {
  const containerRef = useRef(null);
  const spreadRef = useRef(null);

  const [containerDims, setContainerDims] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const activeSheet = project?.sheets?.[activeSheetIndex] || { layers: [] };
  const albumSize = project?.albumSize || { spreadWidth: 36, height: 12, inches: '12 × 36' };
  const ratio = (albumSize.spreadWidth || 36) / (albumSize.height || 12);

  // Measure container dimensions for perfect responsive fitting
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerDims({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Compute base fit dimensions constrained by both available width and height
  const padX = 40;
  const padY = 50;
  const availW = Math.max(260, containerDims.width - padX);
  const availH = Math.max(160, containerDims.height - padY);

  let baseW = availW;
  let baseH = baseW / ratio;
  if (baseH > availH) {
    baseH = availH;
    baseW = baseH * ratio;
  }

  const finalWidth = Math.round(baseW * (zoom || 1));
  const finalHeight = Math.round(baseH * (zoom || 1));

  // Pixel dimensions at 300 PPI
  const spreadWidthPx = albumSize.pixels?.width || 10800;
  const heightPx = albumSize.pixels?.height || 3600;

  // Proportional percentages for safety guides
  const safetyLeftPct = (100 / spreadWidthPx) * 100;
  const safetyTopPct = (100 / heightPx) * 100;
  const safetyRightPct = 100 - safetyLeftPct;
  const safetyBottomPct = 100 - safetyTopPct;
  const centerFoldPct = 50;
  const centerClearanceWidthPct = (200 / spreadWidthPx) * 100;

  // Handle layer dragging
  const handleMouseDown = (e, layer) => {
    e.stopPropagation();
    onSelectLayer(layer.id);
    setIsDragging(true);

    const rect = spreadRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.x,
      origY: layer.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !selectedLayerId || !spreadRef.current) return;
      const rect = spreadRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragOffset.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragOffset.startY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(95, dragOffset.origX + deltaX));
      const newY = Math.max(0, Math.min(95, dragOffset.origY + deltaY));

      onUpdateLayer(selectedLayerId, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, selectedLayerId, onUpdateLayer]);

  const handleSpreadClick = () => {
    onSelectLayer(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#EBE5F5] overflow-auto flex flex-col items-center justify-center p-4 relative select-none"
      style={{
        backgroundImage: 'radial-gradient(rgba(117, 80, 184, 0.14) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
      onClick={handleSpreadClick}
    >
      {/* The Printable Album Spread Canvas (Physical Book Spread Simulation) */}
      <div
        ref={spreadRef}
        className="relative bg-white rounded-sm transition-all duration-150 origin-center select-none"
        style={{
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
          background: activeSheet.background?.css || activeSheet.background?.value || '#FFFFFF',
          boxShadow:
            '0 25px 60px -15px rgba(45, 20, 80, 0.25), 0 0 0 1px rgba(117, 80, 184, 0.15)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectLayer(null);
        }}
      >
        {/* Real book spine crease gradient down the center */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to right, transparent 48.8%, rgba(0,0,0,0.02) 49.5%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.02) 50.5%, transparent 51.2%)',
          }}
        />

        {/* Subtle Alignment Grid */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #7550B8 1px, transparent 1px), linear-gradient(to bottom, #7550B8 1px, transparent 1px)',
              backgroundSize: '4% 12%',
            }}
          />
        )}

        {/* 100 PX SAFETY MARGINS OVERLAY (ADOBE INDESIGN STYLE) */}
        {showGuides && (
          <div
            className="absolute pointer-events-none border border-dashed border-[#7550B8]/40 z-20"
            style={{
              top: `${safetyTopPct}%`,
              bottom: `${100 - safetyBottomPct}%`,
              left: `${safetyLeftPct}%`,
              right: `${100 - safetyRightPct}%`,
            }}
          >
            {/* Subtle corner tick mark badges */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-snavyo-purple/60" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-snavyo-purple/60" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-snavyo-purple/60" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-snavyo-purple/60" />
          </div>
        )}

        {/* CENTER FOLD CUTTING SPINE & 200 PX CLEARANCE */}
        {showCenterSpine && (
          <>
            {/* 200 px Center Clearance Zone */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none bg-[#D4AF62]/[0.05] border-x border-dashed border-[#D4AF62]/40 z-20 flex flex-col items-center justify-between py-1"
              style={{
                left: `${centerFoldPct - centerClearanceWidthPct / 2}%`,
                width: `${centerClearanceWidthPct}%`,
              }}
            >
              <span className="text-[7px] font-bold text-[#D4AF62] uppercase tracking-widest opacity-70">
                Spine
              </span>
              <span className="text-[7px] font-bold text-[#D4AF62] uppercase tracking-widest opacity-70">
                Zone
              </span>
            </div>

            {/* Exact Center Fold Line */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none border-r border-dashed border-snavyo-purple/80 z-20"
              style={{ left: `${centerFoldPct}%` }}
            >
              {/* Sleek spine notch indicators */}
              <div className="absolute top-0 -translate-x-1/2 text-snavyo-purple text-[8px] leading-none">
                ▼
              </div>
              <div className="absolute bottom-0 -translate-x-1/2 text-snavyo-purple text-[8px] leading-none">
                ▲
              </div>
            </div>
          </>
        )}

        {/* Subtle Page Labels (Left Page / Right Page) */}
        <div className="absolute bottom-1.5 left-2.5 text-[8px] font-bold text-snavyo-text-secondary/40 pointer-events-none uppercase tracking-wider">
          Left Page ({albumSize.pageWidth || 18}&quot; × {albumSize.height || 12}&quot;)
        </div>
        <div className="absolute bottom-1.5 right-2.5 text-[8px] font-bold text-snavyo-text-secondary/40 pointer-events-none uppercase tracking-wider">
          Right Page ({albumSize.pageWidth || 18}&quot; × {albumSize.height || 12}&quot;)
        </div>

        {/* RENDER ACTIVE SHEET LAYERS */}
        {activeSheet.layers?.map((layer) => {
          const isSelected = selectedLayerId === layer.id;

          if (layer.type === 'photo') {
            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }}
                className={`absolute group cursor-move transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-snavyo-purple ring-offset-2 shadow-luxury z-10'
                    : 'hover:ring-1 hover:ring-snavyo-purple/50'
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width}%`,
                  height: `${layer.height}%`,
                }}
              >
                {layer.previewUrl ? (
                  <img
                    src={layer.previewUrl}
                    alt={layer.name || 'Photo Frame'}
                    className="w-full h-full object-cover rounded-sm shadow-sm"
                    style={{
                      opacity: layer.opacity ?? 1,
                      filter: `brightness(${layer.adjustments?.brightness || 100}%) contrast(${layer.adjustments?.contrast || 100}%)`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-snavyo-lavender/40 border-2 border-dashed border-snavyo-purple/40 rounded-sm flex flex-col items-center justify-center p-2 text-center text-snavyo-purple">
                    <ImageIcon className="w-5 h-5 mb-1 opacity-70" />
                    <span className="text-[9px] font-bold">Empty Frame</span>
                    <span className="text-[7px] opacity-70">Insert Photo</span>
                  </div>
                )}

                {/* Selected Overlay Handles */}
                {isSelected && (
                  <div className="absolute -top-6 right-0 bg-white border border-snavyo-purple rounded-md shadow-sm px-1.5 py-0.5 flex items-center gap-1.5 z-30">
                    <span className="text-[9px] font-bold text-snavyo-purple">
                      {layer.name || 'Photo'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                      className="text-rose-500 hover:text-rose-700"
                      title="Delete Frame"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          }

          if (layer.type === 'text') {
            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }}
                className={`absolute group cursor-move p-1 rounded transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-snavyo-purple ring-offset-2 bg-snavyo-purple/5 z-10'
                    : 'hover:ring-1 hover:ring-snavyo-purple/40'
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  maxWidth: '80%',
                }}
              >
                <div
                  className="font-serif leading-tight select-none"
                  style={{
                    fontSize: `${layer.fontSize || 24}px`,
                    fontFamily: layer.fontFamily || 'Playfair Display',
                    color: layer.color || '#29213A',
                    fontWeight: layer.fontWeight || 'bold',
                    opacity: layer.opacity ?? 1,
                  }}
                >
                  {layer.text || 'Wedding Typography'}
                </div>

                {isSelected && (
                  <div className="absolute -top-6 right-0 bg-white border border-snavyo-purple rounded-md shadow-sm px-1.5 py-0.5 flex items-center gap-1.5 z-30">
                    <span className="text-[9px] font-bold text-snavyo-purple">Text Layer</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                      className="text-rose-500 hover:text-rose-700"
                      title="Delete Text"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          }

          if (layer.type === 'decoration') {
            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }}
                className={`absolute group cursor-move transition-shadow ${
                  isSelected ? 'ring-2 ring-snavyo-purple ring-offset-2 z-10' : ''
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width || 20}%`,
                  height: `${layer.height || 4}px`,
                  backgroundColor: layer.color || '#D4AF62',
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
