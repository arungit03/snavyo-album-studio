import { useState, useEffect } from 'react';
import {
  Download,
  X,
  FileText,
  Archive,
  Image,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  Settings2,
} from 'lucide-react';
import { ExportService } from '@/services/exportService';
import { PPI } from '@/utils/albumData';

export default function ExportModal({
  isOpen,
  onClose,
  project,
  activeSheetIndex = 0,
}) {
  const [tab, setTab] = useState('sheet'); // 'sheet' | 'album' | 'preflight'
  const [targetPpi, setTargetPpi] = useState(300);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: '' });
  const [preflight, setPreflight] = useState(null);

  const activeSheet = project?.sheets?.[activeSheetIndex] || { sheetNumber: 1 };
  const albumSize = project?.albumSize || { spreadWidth: 36, height: 12, inches: '12 × 36' };
  const totalSheets = project?.sheets?.length || 1;

  useEffect(() => {
    if (isOpen && project) {
      const result = ExportService.runPreflightCheck(project, tab === 'sheet' ? activeSheetIndex : null);
      setPreflight(result);
    }
  }, [isOpen, project, activeSheetIndex, tab]);

  if (!isOpen || !project) return null;

  const baseFilename = (project?.name || 'Album')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/__+/g, '_');

  // Export handlers
  const handleExportJPEG = async () => {
    setIsExporting(true);
    setProgress({ current: 1, total: 1, message: 'Rendering 300 PPI High-Res JPEG...' });
    try {
      const filename = `${baseFilename}_Sheet_${activeSheetIndex + 1}_${albumSize.inches.replace(/\s+/g, '')}_${targetPpi}DPI.jpg`;
      await ExportService.exportSheetAsJPEG(activeSheet, albumSize, filename, targetPpi);
    } catch (err) {
      console.error('JPEG Export failed:', err);
      alert('Export failed. Please check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    setProgress({ current: 1, total: 1, message: 'Rendering Lossless PNG...' });
    try {
      const filename = `${baseFilename}_Sheet_${activeSheetIndex + 1}_${albumSize.inches.replace(/\s+/g, '')}_${targetPpi}DPI.png`;
      await ExportService.exportSheetAsPNG(activeSheet, albumSize, filename, targetPpi);
    } catch (err) {
      console.error('PNG Export failed:', err);
      alert('Export failed. Please check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSinglePDF = async () => {
    setIsExporting(true);
    setProgress({ current: 1, total: 1, message: 'Compiling Print-Ready PDF...' });
    try {
      const filename = `${baseFilename}_Sheet_${activeSheetIndex + 1}_PrintReady.pdf`;
      await ExportService.exportSheetAsPDF(activeSheet, albumSize, filename, targetPpi);
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert('Export failed. Please check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAlbumPDF = async () => {
    setIsExporting(true);
    try {
      const filename = `${baseFilename}_Complete_Album_${totalSheets}Sheets.pdf`;
      await ExportService.exportCompleteAlbumPDF(project, filename, targetPpi === 300 ? 200 : targetPpi, setProgress);
    } catch (err) {
      console.error('Complete Album PDF Export failed:', err);
      alert('Album PDF Export failed. Please check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllZIP = async () => {
    setIsExporting(true);
    try {
      const filename = `${baseFilename}_All_${totalSheets}_Sheets_300DPI.zip`;
      await ExportService.exportAllSheetsAsZIP(project, filename, 'jpeg', targetPpi, setProgress);
    } catch (err) {
      console.error('ZIP Export failed:', err);
      alert('ZIP Export failed. Please check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-premium-xl max-w-xl w-full shadow-2xl border border-snavyo-lavender overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-snavyo-purple to-snavyo-purple-dark text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-snavyo-gold text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> SNAVYO Print Engine
            </div>
            <h2 className="font-serif text-xl font-bold mt-0.5">Export Wedding Album</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-snavyo-lavender bg-snavyo-background/60 p-1">
          <button
            type="button"
            onClick={() => setTab('sheet')}
            disabled={isExporting}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'sheet'
                ? 'bg-white text-snavyo-purple shadow-xs'
                : 'text-snavyo-text-secondary hover:text-snavyo-purple'
            }`}
          >
            Current Sheet {activeSheetIndex + 1}
          </button>
          <button
            type="button"
            onClick={() => setTab('album')}
            disabled={isExporting}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'album'
                ? 'bg-white text-snavyo-purple shadow-xs'
                : 'text-snavyo-text-secondary hover:text-snavyo-purple'
            }`}
          >
            Complete Album ({totalSheets} Spreads)
          </button>
          <button
            type="button"
            onClick={() => setTab('preflight')}
            disabled={isExporting}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              tab === 'preflight'
                ? 'bg-white text-snavyo-purple shadow-xs'
                : 'text-snavyo-text-secondary hover:text-snavyo-purple'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-snavyo-gold" />
            <span>Preflight Inspection</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Resolution Selector */}
          <div className="bg-snavyo-background/70 rounded-xl p-3 border border-snavyo-lavender flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-snavyo-text-main flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-snavyo-purple" />
                Target Output Resolution:
              </span>
              <span className="text-[10px] text-snavyo-text-secondary">
                {targetPpi === 300
                  ? 'Master print lab resolution (100% full scale)'
                  : targetPpi === 150
                  ? 'High quality proof / client review'
                  : 'Fast lightweight web preview'}
              </span>
            </div>
            <select
              value={targetPpi}
              onChange={(e) => setTargetPpi(Number(e.target.value))}
              disabled={isExporting}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-snavyo-lavender bg-white text-snavyo-text-main focus:outline-none focus:ring-1 focus:ring-snavyo-purple"
            >
              <option value={300}>300 PPI (Print Standard)</option>
              <option value={150}>150 PPI (Proofing)</option>
              <option value={72}>72 PPI (Web Draft)</option>
            </select>
          </div>

          {/* TAB 1: CURRENT SHEET */}
          {tab === 'sheet' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Print Lab Clean Export Guarantee:</strong> 100 px safety margin borders,
                  center cutting guides, and spine fold markings are automatically excluded from the exported artwork.
                </div>
              </div>

              <div className="space-y-2.5">
                {/* JPEG */}
                <button
                  type="button"
                  onClick={handleExportJPEG}
                  disabled={isExporting}
                  className="w-full p-3.5 rounded-xl border border-snavyo-lavender bg-white hover:border-snavyo-purple hover:shadow-sm text-left flex items-center justify-between transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple group-hover:scale-105 transition-transform">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-snavyo-text-main">
                        High-Resolution JPEG (.jpg)
                      </h4>
                      <p className="text-[10px] text-snavyo-text-secondary">
                        Standard photo lab format at {targetPpi} PPI (100% Quality)
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-snavyo-purple" />
                </button>

                {/* PNG */}
                <button
                  type="button"
                  onClick={handleExportPNG}
                  disabled={isExporting}
                  className="w-full p-3.5 rounded-xl border border-snavyo-lavender bg-white hover:border-snavyo-purple hover:shadow-sm text-left flex items-center justify-between transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple group-hover:scale-105 transition-transform">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-snavyo-text-main">
                        Lossless PNG (.png)
                      </h4>
                      <p className="text-[10px] text-snavyo-text-secondary">
                        Maximum digital clarity with zero compression artifacts
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-snavyo-purple" />
                </button>

                {/* PDF */}
                <button
                  type="button"
                  onClick={handleExportSinglePDF}
                  disabled={isExporting}
                  className="w-full p-3.5 rounded-xl border border-snavyo-lavender bg-white hover:border-snavyo-purple hover:shadow-sm text-left flex items-center justify-between transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-snavyo-text-main">
                        Print-Ready Single Sheet PDF (.pdf)
                      </h4>
                      <p className="text-[10px] text-snavyo-text-secondary">
                        Exact physical spread size: {albumSize.inches} in ({albumSize.cm} cm)
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-snavyo-purple" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETE ALBUM */}
          {tab === 'album' && (
            <div className="space-y-4">
              <div className="p-3 bg-snavyo-lavender/40 border border-snavyo-lavender rounded-xl text-xs text-snavyo-text-secondary">
                Export all <strong>{totalSheets} spreads</strong> into a single delivery package.
                Progress will be displayed below.
              </div>

              <div className="space-y-2.5">
                {/* Complete Album PDF */}
                <button
                  type="button"
                  onClick={handleExportAlbumPDF}
                  disabled={isExporting}
                  className="w-full p-3.5 rounded-xl border border-snavyo-lavender bg-white hover:border-snavyo-purple hover:shadow-sm text-left flex items-center justify-between transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-snavyo-purple text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-snavyo-text-main">
                        Complete Album PDF (All {totalSheets} Spreads)
                      </h4>
                      <p className="text-[10px] text-snavyo-text-secondary">
                        Single multi-page PDF document ready for print bookbinders
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-snavyo-purple" />
                </button>

                {/* ZIP Archive */}
                <button
                  type="button"
                  onClick={handleExportAllZIP}
                  disabled={isExporting}
                  className="w-full p-3.5 rounded-xl border border-snavyo-lavender bg-white hover:border-snavyo-purple hover:shadow-sm text-left flex items-center justify-between transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-snavyo-gold text-snavyo-purple-dark flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Archive className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-snavyo-text-main">
                        All Sheets ZIP Archive (.zip)
                      </h4>
                      <p className="text-[10px] text-snavyo-text-secondary">
                        Contains Sheet_01.jpg, Sheet_02.jpg ... at 300 PPI
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-snavyo-purple" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PREFLIGHT INSPECTION */}
          {tab === 'preflight' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white border border-snavyo-lavender rounded-xl space-y-2">
                <div className="flex items-center justify-between font-bold text-snavyo-text-main">
                  <span>Preflight Status</span>
                  {preflight?.passed ? (
                    <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-4 h-4" /> Ready for Print
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-4 h-4" /> Review Recommended
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-snavyo-text-secondary font-mono">
                  Physical: {albumSize.inches} in ({albumSize.cm} cm) @ 300 PPI
                </div>
              </div>

              {/* Warning list */}
              {preflight?.warnings?.length > 0 ? (
                <div className="space-y-1.5">
                  {preflight.warnings.map((w, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
                        w.type === 'caution'
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-snavyo-background border-snavyo-lavender text-snavyo-text-secondary'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
                      <span>{w.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="font-bold">Zero Preflight Errors Detected</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    All elements respect the 100 px safety margins and center cutting spine fold.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Progress bar during active export */}
          {isExporting && (
            <div className="p-4 bg-snavyo-lavender/60 border border-snavyo-purple/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-snavyo-purple">
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-snavyo-purple border-t-transparent animate-spin" />
                  {progress.message || 'Processing high-res export...'}
                </span>
                {progress.total > 0 && (
                  <span>
                    {progress.current} / {progress.total}
                  </span>
                )}
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                <div
                  className="bg-snavyo-purple h-full transition-all duration-300"
                  style={{
                    width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '60%',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-snavyo-background border-t border-snavyo-lavender flex items-center justify-between text-xs">
          <span className="text-snavyo-text-secondary font-mono text-[11px]">
            {albumSize.inches} in • {targetPpi} PPI
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-lg border border-snavyo-lavender bg-white text-snavyo-text-secondary hover:text-snavyo-text-main font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

