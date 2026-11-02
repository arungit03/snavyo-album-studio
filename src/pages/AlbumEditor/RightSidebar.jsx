import { useState } from 'react';
import {
  Layers,
  Sliders,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  Type,
  Image,
  Sparkles,
  Move,
  Maximize2,
  Eraser,
} from 'lucide-react';

export default function RightSidebar({
  project,
  activeSheet,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onReorderLayer,
  onUpdateSheetBackground,
  eraserMode = false,
  eraserSize = 16,
  onToggleEraser,
  onEraserSizeChange,
  onClearEraser,
}) {
  const [tab, setTab] = useState('layers'); // 'layers' | 'properties'

  const layers = activeSheet?.layers || [];
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const albumSize = project?.albumSize;

  return (
    <aside className="w-60 xl:w-72 bg-white border-l border-snavyo-lavender/80 flex flex-col h-full flex-shrink-0 select-none z-20">
      {/* Top Tabs */}
      <div className="flex items-center border-b border-snavyo-lavender bg-snavyo-background/60 p-1">
        <button
          type="button"
          onClick={() => setTab('layers')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            tab === 'layers'
              ? 'bg-white text-snavyo-purple shadow-sm border border-snavyo-lavender'
              : 'text-snavyo-text-secondary hover:text-snavyo-purple'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers ({layers.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('properties')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            tab === 'properties'
              ? 'bg-white text-snavyo-purple shadow-sm border border-snavyo-lavender'
              : 'text-snavyo-text-secondary hover:text-snavyo-purple'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Properties</span>
        </button>
      </div>

      {/* Main Tab Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 'layers' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-snavyo-text-secondary">
                Stacking Order (Top to Bottom)
              </span>
            </div>

            {/* Layer List */}
            {layers.length > 0 ? (
              <div className="space-y-1.5">
                {[...layers].reverse().map((layer, reverseIdx) => {
                  const actualIdx = layers.length - 1 - reverseIdx;
                  const isSelected = selectedLayerId === layer.id;

                  const LayerIcon =
                    layer.type === 'photo' ? Image : layer.type === 'text' ? Type : Sparkles;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-snavyo-lavender/60 border-snavyo-purple shadow-xs'
                          : 'bg-white border-snavyo-lavender/60 hover:border-snavyo-purple/40'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-snavyo-background flex items-center justify-center text-snavyo-purple flex-shrink-0">
                        <LayerIcon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-snavyo-text-main truncate">
                          {layer.name || (layer.type === 'text' ? layer.text : `${layer.type} layer`)}
                        </div>
                        <div className="text-[10px] text-snavyo-text-secondary">
                          {layer.type} • {Math.round(layer.x)}%, {Math.round(layer.y)}%
                        </div>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderLayer(actualIdx, 'up');
                          }}
                          disabled={actualIdx === layers.length - 1}
                          className="p-1 text-snavyo-text-secondary hover:text-snavyo-purple disabled:opacity-30"
                          title="Bring Forward"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderLayer(actualIdx, 'down');
                          }}
                          disabled={actualIdx === 0}
                          className="p-1 text-snavyo-text-secondary hover:text-snavyo-purple disabled:opacity-30"
                          title="Send Backward"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLayer(layer.id);
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700"
                          title="Delete Layer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-snavyo-lavender rounded-xl bg-snavyo-background/30 text-xs text-snavyo-text-secondary">
                No artwork layers yet on this sheet. Add photos or text from the left panel.
              </div>
            )}

            {/* Background Layer (Fixed at bottom) */}
            <div className="p-2.5 rounded-xl border border-snavyo-lavender bg-snavyo-background/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md border shadow-xs"
                  style={{ background: activeSheet?.background?.css || activeSheet?.background?.value || '#FFFFFF' }}
                />
                <span className="text-xs font-bold text-snavyo-text-main">Base Background</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-snavyo-text-secondary bg-white px-1.5 py-0.5 rounded border border-snavyo-lavender">
                Bottom
              </span>
            </div>
          </div>
        ) : (
          /* PROPERTIES TAB */
          <div className="space-y-4">
            {selectedLayer ? (
              <div className="space-y-4">
                <div className="border-b border-snavyo-lavender pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-snavyo-purple">
                    Selected: {selectedLayer.name || selectedLayer.type}
                  </h4>
                </div>

                {/* Text Layer Properties */}
                {selectedLayer.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-snavyo-text-secondary mb-1">
                        Text Content
                      </label>
                      <input
                        type="text"
                        value={selectedLayer.text || ''}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { text: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border border-snavyo-lavender bg-white text-snavyo-text-main focus:border-snavyo-purple focus:ring-1 focus:ring-snavyo-purple font-serif"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-snavyo-text-secondary mb-1">
                        <span>Font Size</span>
                        <span>{selectedLayer.fontSize || 24} px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={selectedLayer.fontSize || 24}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })
                        }
                        className="w-full accent-snavyo-purple h-1.5 bg-snavyo-lavender rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-snavyo-text-secondary mb-1">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedLayer.color || '#29213A'}
                          onChange={(e) =>
                            onUpdateLayer(selectedLayer.id, { color: e.target.value })
                          }
                          className="w-8 h-8 rounded border border-snavyo-lavender cursor-pointer"
                        />
                        <span className="text-xs font-mono text-snavyo-text-main">
                          {selectedLayer.color || '#29213A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo Layer Properties */}
                {selectedLayer.type === 'photo' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-semibold text-snavyo-text-secondary">
                      <span>Width</span>
                      <span>{Math.round(selectedLayer.width || 30)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={selectedLayer.width || 30}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, { width: Number(e.target.value) })
                      }
                      className="w-full accent-snavyo-purple h-1.5 bg-snavyo-lavender rounded-lg"
                    />

                    <div className="flex justify-between text-[11px] font-semibold text-snavyo-text-secondary">
                      <span>Height</span>
                      <span>{Math.round(selectedLayer.height || 50)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={selectedLayer.height || 50}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, { height: Number(e.target.value) })
                      }
                      className="w-full accent-snavyo-purple h-1.5 bg-snavyo-lavender rounded-lg"
                    />

                    <div className="pt-2 border-t border-snavyo-lavender">
                      <span className="text-[11px] font-bold text-snavyo-text-main block mb-2">
                        Photo Adjustments
                      </span>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] text-snavyo-text-secondary">
                            <span>Brightness</span>
                            <span>{selectedLayer.adjustments?.brightness || 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="60"
                            max="140"
                            value={selectedLayer.adjustments?.brightness || 100}
                            onChange={(e) =>
                              onUpdateLayer(selectedLayer.id, {
                                adjustments: {
                                  ...selectedLayer.adjustments,
                                  brightness: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full accent-snavyo-purple h-1 bg-snavyo-lavender rounded-lg"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] text-snavyo-text-secondary">
                            <span>Contrast</span>
                            <span>{selectedLayer.adjustments?.contrast || 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="60"
                            max="140"
                            value={selectedLayer.adjustments?.contrast || 100}
                            onChange={(e) =>
                              onUpdateLayer(selectedLayer.id, {
                                adjustments: {
                                  ...selectedLayer.adjustments,
                                  contrast: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full accent-snavyo-purple h-1 bg-snavyo-lavender rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-snavyo-lavender space-y-2">
                      <span className="text-[11px] font-bold text-snavyo-text-main block">Crop & Fit</span>
                      <div>
                        <div className="flex justify-between text-[10px] text-snavyo-text-secondary"><span>Horizontal focus</span><span>{Math.round(selectedLayer.cropX ?? 50)}%</span></div>
                        <input type="range" min="0" max="100" value={selectedLayer.cropX ?? 50} onChange={(e) => onUpdateLayer(selectedLayer.id, { cropX: Number(e.target.value) })} className="w-full accent-snavyo-purple h-1 bg-snavyo-lavender rounded-lg" aria-label="Photo horizontal crop position" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-snavyo-text-secondary"><span>Vertical focus</span><span>{Math.round(selectedLayer.cropY ?? 50)}%</span></div>
                        <input type="range" min="0" max="100" value={selectedLayer.cropY ?? 50} onChange={(e) => onUpdateLayer(selectedLayer.id, { cropY: Number(e.target.value) })} className="w-full accent-snavyo-purple h-1 bg-snavyo-lavender rounded-lg" aria-label="Photo vertical crop position" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-snavyo-text-secondary"><span>Crop zoom</span><span>{(selectedLayer.cropScale || 1).toFixed(1)}×</span></div>
                        <input type="range" min="1" max="2.5" step="0.05" value={selectedLayer.cropScale || 1} onChange={(e) => onUpdateLayer(selectedLayer.id, { cropScale: Number(e.target.value) })} className="w-full accent-snavyo-purple h-1 bg-snavyo-lavender rounded-lg" aria-label="Photo crop zoom" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-snavyo-lavender space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-snavyo-text-main flex items-center gap-1.5"><Eraser className="w-3.5 h-3.5 text-snavyo-purple" /> Image Eraser</span>
                        <button type="button" onClick={onToggleEraser} aria-pressed={eraserMode} className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-colors ${eraserMode ? 'bg-snavyo-purple text-white' : 'border border-snavyo-lavender text-snavyo-text-secondary hover:text-snavyo-purple'}`}>
                          {eraserMode ? 'Active' : 'Use eraser'}
                        </button>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-snavyo-text-secondary"><span>Brush size</span><span>{eraserSize}px</span></div>
                        <input type="range" min="4" max="40" value={eraserSize} onChange={(e) => onEraserSizeChange(Number(e.target.value))} className="w-full accent-snavyo-purple h-1.5 bg-snavyo-lavender rounded-lg" aria-label="Eraser brush size" />
                      </div>
                      {(selectedLayer.eraserStrokes?.length || 0) > 0 && (
                        <button type="button" onClick={() => onClearEraser(selectedLayer.id)} className="w-full rounded-lg border border-snavyo-lavender py-1.5 text-[10px] font-bold text-snavyo-text-secondary hover:border-snavyo-purple hover:text-snavyo-purple">Clear erased areas</button>
                      )}
                      <p className="text-[10px] leading-snug text-snavyo-text-secondary">Paint directly over the selected photo. The album background remains untouched.</p>
                    </div>
                  </div>
                )}

                {/* Common Transform Controls */}
                <div className="pt-2 border-t border-snavyo-lavender space-y-2">
                  <span className="text-[11px] font-bold text-snavyo-text-main block">
                    Position (Percentage)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-snavyo-text-secondary block mb-0.5">X:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(selectedLayer.x || 0)}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, { x: Number(e.target.value) })
                        }
                        className="w-full p-1.5 rounded border border-snavyo-lavender bg-white font-mono text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-snavyo-text-secondary block mb-0.5">Y:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(selectedLayer.y || 0)}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, { y: Number(e.target.value) })
                        }
                        className="w-full p-1.5 rounded border border-snavyo-lavender bg-white font-mono text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-snavyo-text-secondary block mb-0.5">Rotation:</span>
                    <input
                      type="number"
                      min="-180"
                      max="180"
                      value={Math.round(selectedLayer.rotation || 0)}
                      onChange={(e) => onUpdateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-snavyo-lavender bg-white font-mono text-center"
                      aria-label="Layer rotation in degrees"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLayer(selectedLayer.id)}
                  className="w-full py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors mt-4"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Layer
                </button>
              </div>
            ) : (
              /* Sheet Global Properties */
              <div className="space-y-4">
                <div className="border-b border-snavyo-lavender pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-snavyo-purple">
                    Sheet Document Specs
                  </h4>
                </div>

                <div className="bg-snavyo-background/60 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-snavyo-text-secondary">Physical Size:</span>
                    <span className="font-bold text-snavyo-text-main">{albumSize?.inches} in</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-snavyo-text-secondary">Metric Size:</span>
                    <span className="font-bold text-snavyo-text-main">{albumSize?.cm} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-snavyo-text-secondary">Print Resolution:</span>
                    <span className="font-bold text-snavyo-text-main">{albumSize?.ppi || 300} PPI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-snavyo-text-secondary">Pixel Dimensions:</span>
                    <span className="font-mono text-snavyo-text-main font-semibold">
                      {albumSize?.pixels?.width.toLocaleString()} × {albumSize?.pixels?.height.toLocaleString()} px
                    </span>
                  </div>
                </div>

                {/* Sheet Background Setting */}
                <div>
                  <label className="block text-[11px] font-bold text-snavyo-text-main mb-1.5">
                    Sheet Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeSheet?.background?.value || '#FFFFFF'}
                      onChange={(e) => onUpdateSheetBackground(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-snavyo-lavender cursor-pointer"
                    />
                    <span className="text-xs font-mono text-snavyo-text-main">
                      {activeSheet?.background?.value || '#FFFFFF'}
                    </span>
                  </div>
                </div>

                {/* Safety Margins Guide Info */}
                <div className="p-3 bg-snavyo-lavender/30 rounded-xl border border-snavyo-lavender text-xs text-snavyo-text-secondary space-y-1.5">
                  <div className="font-bold text-snavyo-text-main flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-snavyo-purple" /> Printing Preflight
                  </div>
                  <p className="text-[11px] leading-tight">
                    • 100 px safety margins active on all 4 borders.
                  </p>
                  <p className="text-[11px] leading-tight">
                    • 100 px clearance active on both sides of the center cutting line (200 px total width).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

