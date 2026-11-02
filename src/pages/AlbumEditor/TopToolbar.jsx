import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Download,
  Shield,
  Columns,
  Grid,
  Check,
  Undo2,
  Redo2,
} from 'lucide-react';

export default function TopToolbar({
  project,
  activeSheetIndex,
  onSheetChange,
  zoom,
  onZoomChange,
  showGuides,
  onToggleGuides,
  showCenterSpine,
  onToggleCenterSpine,
  showGrid,
  onToggleGrid,
  onSave,
  isSaving,
  lastSavedTime,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  const totalSheets = project?.sheets?.length || 1;

  return (
    <header className="h-14 min-w-[980px] flex-shrink-0 overflow-x-auto bg-white border-b border-snavyo-lavender/80 px-4 flex items-center justify-between shadow-xs z-30 select-none">
      {/* Left: Branding & Back & Project Info */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="p-2 rounded-xl text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-snavyo-lavender/50 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="h-6 w-[1px] bg-snavyo-lavender" />

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-snavyo-text-main line-clamp-1 max-w-[200px] sm:max-w-[320px]">
              {project?.name || 'Untitled Album'}
            </h1>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: project?.event?.colors?.primary || '#7550B8' }}
            >
              {project?.event?.label || 'Wedding'}
            </span>
          </div>
          <div className="text-[11px] text-snavyo-text-secondary flex items-center gap-2">
            <span>
              {project?.albumSize?.inches} in • {project?.albumSize?.ppi || 300} PPI
            </span>
            <span>•</span>
            <span className="font-mono text-snavyo-purple font-semibold">
              Sheet {activeSheetIndex + 1} of {totalSheets}
            </span>
            {lastSavedTime && (
              <>
                <span>•</span>
                <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
                  <Check className="w-3 h-3" /> Saved {lastSavedTime}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Sheet Switcher & Canvas Viewport Controls */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Quick Sheet Selector */}
        <select
          value={activeSheetIndex}
          onChange={(e) => onSheetChange(Number(e.target.value))}
          className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-snavyo-lavender bg-snavyo-background text-snavyo-text-main focus:outline-none focus:ring-1 focus:ring-snavyo-purple"
        >
          {project?.sheets?.map((sheet, idx) => (
            <option key={sheet.id || idx} value={idx}>
              {sheet.title || `Sheet ${idx + 1}`}
            </option>
          ))}
        </select>

        <div className="h-6 w-[1px] bg-snavyo-lavender mx-1" />

        {/* View / Guides Toggles */}
        <button
          type="button"
          onClick={onToggleGuides}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            showGuides
              ? 'bg-snavyo-purple text-white shadow-sm'
              : 'text-snavyo-text-secondary hover:bg-snavyo-lavender/50'
          }`}
          title="Toggle 100px Safety Margins"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Safety Guides</span>
        </button>

        <button
          type="button"
          onClick={onToggleCenterSpine}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            showCenterSpine
              ? 'bg-snavyo-purple text-white shadow-sm'
              : 'text-snavyo-text-secondary hover:bg-snavyo-lavender/50'
          }`}
          title="Toggle Center Cutting Line & Fold Clearance"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Center Spine</span>
        </button>

        <button
          type="button"
          onClick={onToggleGrid}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            showGrid
              ? 'bg-snavyo-purple text-white shadow-sm'
              : 'text-snavyo-text-secondary hover:bg-snavyo-lavender/50'
          }`}
          title="Toggle Alignment Grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <div className="h-6 w-[1px] bg-snavyo-lavender mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-snavyo-background rounded-lg p-0.5 border border-snavyo-lavender">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))}
            className="p-1 rounded text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-bold px-1.5 text-snavyo-text-main">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(2.5, zoom + 0.1))}
            className="p-1 rounded text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1.0)}
            className="p-1 rounded text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-white text-[10px] font-bold"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-snavyo-lavender bg-snavyo-background p-0.5">
          <button type="button" onClick={onUndo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)" className="rounded-md p-1.5 text-snavyo-text-secondary transition-colors hover:bg-white hover:text-snavyo-purple disabled:cursor-not-allowed disabled:opacity-35">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onRedo} disabled={!canRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)" className="rounded-md p-1.5 text-snavyo-text-secondary transition-colors hover:bg-white hover:text-snavyo-purple disabled:cursor-not-allowed disabled:opacity-35">
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-snavyo-purple text-snavyo-purple hover:bg-snavyo-purple hover:text-white transition-all text-xs font-bold"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Project'}</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-snavyo-gold text-snavyo-purple-dark hover:bg-snavyo-purple hover:text-white transition-all text-xs font-bold shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Sheet</span>
        </button>
      </div>
    </header>
  );
}

