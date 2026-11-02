import { useRef, useState, useEffect } from 'react';
import { Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { calculateSafetyGuides } from '../../utils/albumData';

function createEraserMask(strokes = []) {
  // ALL coordinates are in 0-100 space matching viewBox="0 0 100 100" with preserveAspectRatio="none"
  const connectedStroke = strokes.slice(1).map((stroke, index) => {
    const previous = strokes[index];
    const width = Math.max(0.5, ((previous.size + stroke.size) / 2));
    return `<line x1="${previous.x}" y1="${previous.y}" x2="${stroke.x}" y2="${stroke.y}" stroke="black" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
  const brushEnds = strokes
    .map((stroke) => `<circle cx="${stroke.x}" cy="${stroke.y}" r="${Math.max(0.4, stroke.size / 2)}" fill="black"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><filter id="soft"><feGaussianBlur stdDeviation="0.25"/></filter></defs><mask id="erase"><rect width="100" height="100" fill="white"/><g filter="url(#soft)">${connectedStroke}${brushEnds}</g></mask><rect width="100" height="100" fill="white" mask="url(#erase)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

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
  eraserMode = false,
  eraserSize = 16,
  onToggleEraser,
  onEraserSizeChange,
  onClearEraser,
}) {
  const containerRef = useRef(null);
  const spreadRef = useRef(null);

  const [containerDims, setContainerDims] = useState({ width: 800, height: 500 });
  const [interaction, setInteraction] = useState(null);
  const interactionRef = useRef(null);
  const eraseFrameRef = useRef(null);
  const [brushCursor, setBrushCursor] = useState(null);

  const setActiveInteraction = (next) => {
    interactionRef.current = next;
    setInteraction(next);
  };

  const activeSheet = project?.sheets?.[activeSheetIndex] || { layers: [] };
  const selectedLayer = activeSheet.layers?.find((layer) => layer.id === selectedLayerId);
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

  // Handle layer dragging / erasing
  const handleMouseDown = (e, layer, mode = 'move') => {
    e.stopPropagation();
    e.preventDefault();

    // In eraser mode: if clicking a different layer just switch selection (don't start erase)
    if (eraserMode && selectedLayerId !== layer.id) {
      onSelectLayer(layer.id);
      return;
    }

    // Only call onSelectLayer when NOT in eraser mode, to avoid resetting eraserMode
    if (!eraserMode) {
      onSelectLayer(layer.id);
    }

    const rect = spreadRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + (layer.x / 100 + (layer.width || 0) / 200) * rect.width;
    const centerY = rect.top + (layer.y / 100 + (layer.height || 0) / 200) * rect.height;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    if (eraserMode && layer.type === 'photo' && mode === 'move') {
      const layerEl = spreadRef.current?.querySelector(`[data-layer-id="${layer.id}"]`);
      const photoRect = layerEl ? layerEl.getBoundingClientRect() : {
        left: rect.left + (layer.x / 100) * rect.width,
        top: rect.top + (layer.y / 100) * rect.height,
        width: (layer.width / 100) * rect.width,
        height: (layer.height / 100) * rect.height,
      };
      const point = {
        x: Math.max(0, Math.min(100, ((e.clientX - photoRect.left) / photoRect.width) * 100)),
        y: Math.max(0, Math.min(100, ((e.clientY - photoRect.top) / photoRect.height) * 100)),
        size: (eraserSize / Math.min(photoRect.width, photoRect.height)) * 100,
      };
      setBrushCursor({ x: point.x, y: point.y });
      setActiveInteraction({ mode: 'erase', layerId: layer.id, strokes: [...(layer.eraserStrokes || []), point] });
      return;
    }

    setActiveInteraction({
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.x,
      origY: layer.y,
      origWidth: layer.width || 30,
      origHeight: layer.height || 30,
      origRotation: layer.rotation || 0,
      startAngle,
      centerX,
      centerY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const current = interactionRef.current;
      if (!current || !selectedLayerId || !spreadRef.current) return;
      const rect = spreadRef.current.getBoundingClientRect();

      if (current.mode === 'erase') {
        const layer = activeSheet.layers.find((item) => item.id === current.layerId);
        if (!layer) return;
        const layerEl = spreadRef.current?.querySelector(`[data-layer-id="${layer.id}"]`);
        const photoRect = layerEl ? layerEl.getBoundingClientRect() : {
          left: rect.left + (layer.x / 100) * rect.width,
          top: rect.top + (layer.y / 100) * rect.height,
          width: (layer.width / 100) * rect.width,
          height: (layer.height / 100) * rect.height,
        };
        const point = {
          x: Math.max(0, Math.min(100, ((e.clientX - photoRect.left) / photoRect.width) * 100)),
          y: Math.max(0, Math.min(100, ((e.clientY - photoRect.top) / photoRect.height) * 100)),
          size: (eraserSize / Math.min(photoRect.width, photoRect.height)) * 100,
        };
        setBrushCursor({ x: point.x, y: point.y });
        const previous = current.strokes[current.strokes.length - 1];
        const distance = previous ? Math.hypot(point.x - previous.x, point.y - previous.y) : Infinity;
        if (distance > 0.25) {
          const next = { ...current, strokes: [...current.strokes, point] };
          interactionRef.current = next;
          if (!eraseFrameRef.current) {
            eraseFrameRef.current = requestAnimationFrame(() => {
              eraseFrameRef.current = null;
              setInteraction(interactionRef.current);
            });
          }
        }
        return;
      }

      const deltaX = ((e.clientX - current.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - current.startY) / rect.height) * 100;

      if (current.mode === 'resize') {
        onUpdateLayer(selectedLayerId, {
          width: Math.max(5, Math.min(100 - current.origX, current.origWidth + deltaX)),
          height: Math.max(5, Math.min(100 - current.origY, current.origHeight + deltaY)),
        });
      } else if (current.mode === 'rotate') {
        const angle = Math.atan2(e.clientY - current.centerY, e.clientX - current.centerX) * (180 / Math.PI);
        onUpdateLayer(selectedLayerId, { rotation: Math.round(current.origRotation + angle - current.startAngle) });
      } else {
        onUpdateLayer(selectedLayerId, {
          x: Math.max(0, Math.min(100 - current.origWidth, current.origX + deltaX)),
          y: Math.max(0, Math.min(100 - current.origHeight, current.origY + deltaY)),
        });
      }
    };

    const handleMouseUp = () => {
      const current = interactionRef.current;
      if (current?.mode === 'erase') {
        onUpdateLayer(current.layerId, { eraserStrokes: current.strokes });
      }
      interactionRef.current = null;
      setInteraction(null);
    };

    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (eraseFrameRef.current) {
        cancelAnimationFrame(eraseFrameRef.current);
        eraseFrameRef.current = null;
      }
    };
  }, [Boolean(interaction), selectedLayerId, onUpdateLayer, activeSheet.layers, eraserSize]);

  const handleEraserHover = (event, layer) => {
    if (!eraserMode || selectedLayerId !== layer.id) return;
    const layerEl = spreadRef.current?.querySelector(`[data-layer-id="${layer.id}"]`);
    const rect = spreadRef.current?.getBoundingClientRect();
    if (!rect) return;
    const photoRect = layerEl ? layerEl.getBoundingClientRect() : {
      left: rect.left + (layer.x / 100) * rect.width,
      top: rect.top + (layer.y / 100) * rect.height,
      width: (layer.width / 100) * rect.width,
      height: (layer.height / 100) * rect.height,
    };
    setBrushCursor({
      x: Math.max(0, Math.min(100, ((event.clientX - photoRect.left) / photoRect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - photoRect.top) / photoRect.height) * 100)),
    });
  };

  const handleSpreadClick = () => {
    onSelectLayer(null);
    setBrushCursor(null);
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
      {eraserMode && selectedLayer?.type === 'photo' && (
        <div className="absolute left-1/2 top-3 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[#d8c2b6] bg-[#fffaf7]/95 px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6d3f35]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3dfd4] text-[11px]">✦</span>
            Image eraser
          </div>
          <div className="h-5 w-px bg-[#ead9d0]" />
          <label className="flex items-center gap-2 text-[10px] font-semibold text-[#805d56]">
            Size
            <input type="range" min="4" max="40" value={eraserSize} onChange={(event) => onEraserSizeChange(Number(event.target.value))} className="w-24 accent-[#8c5a4c]" aria-label="Eraser size" />
            <span className="w-7 text-right font-mono">{eraserSize}px</span>
          </label>
          {(selectedLayer.eraserStrokes?.length || 0) > 0 && (
            <button type="button" onClick={() => onClearEraser(selectedLayer.id)} className="rounded-lg px-2 py-1 text-[10px] font-bold text-[#805d56] hover:bg-[#f6e8df]">Reset</button>
          )}
          <button type="button" onClick={onToggleEraser} className="rounded-lg bg-[#6d3f35] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#4b2b2a]">Done</button>
        </div>
      )}
      {/* The Printable Album Spread Canvas (Physical Book Spread Simulation) */}
      <div
        ref={spreadRef}
        className="relative bg-white rounded-sm transition-all duration-150 origin-center select-none"
        style={{
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
          background: activeSheet.background?.css || activeSheet.background?.value || '#FFFFFF',
          backgroundImage: activeSheet.background?.image
            ? `url(${activeSheet.background.image})`
            : undefined,
          backgroundSize: activeSheet.background?.image ? '100% 100%' : undefined,
          backgroundPosition: activeSheet.background?.image ? 'center' : undefined,
          backgroundRepeat: 'no-repeat',
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
        {activeSheet.layers?.map((layer, layerIndex) => {
          const isSelected = selectedLayerId === layer.id;
          const visibleEraserStrokes = layer.id === selectedLayerId && interaction?.mode === 'erase'
            ? interaction.strokes
            : layer.eraserStrokes;

          if (layer.type === 'photo') {
            return (
              <div
                key={layer.id}
                data-layer-id={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onMouseMove={(e) => handleEraserHover(e, layer)}
                onMouseLeave={() => setBrushCursor(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedLayerId !== layer.id) onSelectLayer(layer.id);
                }}
                className={`absolute group transition-shadow ${eraserMode && selectedLayerId === layer.id ? 'cursor-crosshair' : 'cursor-move'} ${
                  isSelected
                    ? 'ring-2 ring-snavyo-purple ring-offset-2 shadow-luxury'
                    : 'hover:ring-1 hover:ring-snavyo-purple/50'
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width}%`,
                  height: `${layer.height}%`,
                  transform: `rotate(${layer.rotation || 0}deg)`,
                  transformOrigin: 'center',
                  overflow: 'hidden',
                  // Selected layer always on top; otherwise use array order (1-based)
                  zIndex: isSelected ? 200 : layerIndex + 1,
                  clipPath: layer.templateShape
                    ? 'polygon(0 0, 94% 0, 100% 18%, 96% 42%, 100% 66%, 92% 100%, 7% 100%, 0 80%, 3% 54%, 0 28%)'
                    : undefined,
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
                      objectPosition: `${layer.cropX ?? 50}% ${layer.cropY ?? 50}%`,
                      transform: `scale(${layer.cropScale || 1})`,
                      transformOrigin: 'center',
                      ...(visibleEraserStrokes?.length
                        ? {
                            maskImage: `url("${createEraserMask(visibleEraserStrokes)}")`,
                            WebkitMaskImage: `url("${createEraserMask(visibleEraserStrokes)}")`,
                            maskSize: '100% 100%',
                            WebkitMaskSize: '100% 100%',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: '0 0',
                            WebkitMaskPosition: '0 0',
                          }
                        : {}),
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-snavyo-lavender/40 border-2 border-dashed border-snavyo-purple/40 rounded-sm flex flex-col items-center justify-center p-2 text-center text-snavyo-purple">
                    <ImageIcon className="w-5 h-5 mb-1 opacity-70" />
                    <span className="text-[9px] font-bold">Empty Frame</span>
                    <span className="text-[7px] opacity-70">Insert Photo</span>
                  </div>
                )}

                {eraserMode && isSelected && brushCursor && (
                  <div
                    className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#6d3f35]/20 shadow-[0_0_0_1px_rgba(109,63,53,0.8)]"
                    style={{ left: `${brushCursor.x}%`, top: `${brushCursor.y}%`, width: `${eraserSize}px`, height: `${eraserSize}px` }}
                  />
                )}

                {/* Selected Overlay Handles */}
                {isSelected && (
                  <>
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
                    <div onMouseDown={(e) => handleMouseDown(e, layer, 'rotate')} aria-label="Rotate layer" role="button" className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 cursor-crosshair rounded-full border-2 border-white bg-snavyo-purple shadow" title="Rotate layer" />
                    <div onMouseDown={(e) => handleMouseDown(e, layer, 'resize')} aria-label="Resize layer" role="button" className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize rounded-sm border-2 border-white bg-snavyo-purple shadow" title="Resize layer" />
                  </>
                )}
              </div>
            );
          }

          if (layer.type === 'template-mask') {
            return (
              <div
                key={layer.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width}%`,
                  height: `${layer.height}%`,
                  backgroundColor: layer.color || '#FCE9DC',
                }}
              />
            );
          }

          if (layer.type === 'text') {
            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedLayerId !== layer.id) onSelectLayer(layer.id);
                }}
                className={`absolute group cursor-move p-1 rounded transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-snavyo-purple ring-offset-2 bg-snavyo-purple/5'
                    : 'hover:ring-1 hover:ring-snavyo-purple/40'
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  maxWidth: '80%',
                  transform: `rotate(${layer.rotation || 0}deg)`,
                  transformOrigin: 'center',
                  zIndex: isSelected ? 200 : layerIndex + 1,
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
                  <>
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
                    <div onMouseDown={(e) => handleMouseDown(e, layer, 'rotate')} aria-label="Rotate layer" role="button" className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 cursor-crosshair rounded-full border-2 border-white bg-snavyo-purple shadow" title="Rotate layer" />
                    <div onMouseDown={(e) => handleMouseDown(e, layer, 'resize')} aria-label="Resize layer" role="button" className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize rounded-sm border-2 border-white bg-snavyo-purple shadow" title="Resize layer" />
                  </>
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
                  if (selectedLayerId !== layer.id) onSelectLayer(layer.id);
                }}
                className={`absolute group cursor-move transition-shadow ${
                  isSelected ? 'ring-2 ring-snavyo-purple ring-offset-2' : ''
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  width: `${layer.width || 20}%`,
                  height: `${layer.height || 4}%`,
                  backgroundColor: layer.color || '#D4AF62',
                  transform: `rotate(${layer.rotation || 0}deg)`,
                  transformOrigin: 'center',
                  zIndex: isSelected ? 200 : layerIndex + 1,
                }}
              >
                {isSelected && (
                  <>
                    <div onMouseDown={(e) => handleMouseDown(e, layer, 'rotate')} aria-label="Rotate decoration" role="button" className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 cursor-crosshair rounded-full border-2 border-white bg-snavyo-purple shadow" title="Rotate decoration" />
                    <div onMouseDown={(e) => handleMouseDown(e, layer, 'resize')} aria-label="Resize decoration" role="button" className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize rounded-sm border-2 border-white bg-snavyo-purple shadow" title="Resize decoration" />
                  </>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
