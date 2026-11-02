// SNAVYO ALBUM STUDIO - High-Resolution Print Export Service
// Generates print-ready JPEG, PNG, Multi-page PDF, and ZIP archives at true 300 PPI

import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { pixelsForSize, PPI, calculateSafetyGuides } from '../utils/albumData.js';

// Helper to trigger browser download
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Load image asynchronously
function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // Resolve null gracefully to prevent stopping the export
    img.src = src;
  });
}

// Recreate the selected wedding treatment as a print-safe canvas gradient.
// CSS texture details remain visible in the editor while the main palette is
// preserved in JPEG, PNG, and PDF exports.
function paintSheetBackground(ctx, sheet, width, height) {
  const background = sheet?.background;
  const cssColors = background?.css?.match(/#[0-9a-f]{6}/gi) || [];
  const colors = [...new Set(cssColors)];

  if (colors.length >= 2) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = background?.value || '#FFFFFF';
  }

  ctx.fillRect(0, 0, width, height);
}

export const ExportService = {
  // Preflight Print Lab Inspector
  runPreflightCheck(project, sheetIndex = null) {
    const warnings = [];
    const albumSize = project?.albumSize || { spreadWidth: 36, height: 12, inches: '12 × 36' };
    const sheetsToCheck =
      sheetIndex !== null && project?.sheets?.[sheetIndex]
        ? [project.sheets[sheetIndex]]
        : project?.sheets || [];

    sheetsToCheck.forEach((sheet, idx) => {
      const sheetNum = sheet.sheetNumber || idx + 1;
      const layers = sheet.layers || [];

      if (layers.length === 0) {
        warnings.push({
          type: 'info',
          message: `Sheet ${sheetNum} has no photos or artwork elements.`,
        });
      }

      layers.forEach((layer) => {
        if (layer.type === 'photo' && !layer.previewUrl) {
          warnings.push({
            type: 'warning',
            message: `Sheet ${sheetNum}: Contains an empty photo frame ("${layer.name || 'Photo'}").`,
          });
        }

        // Check center cutting spine overlap (between 48% and 52% width)
        const layerLeft = layer.x || 0;
        const layerRight = layerLeft + (layer.width || 0);
        if (layerLeft < 50 && layerRight > 50) {
          warnings.push({
            type: 'caution',
            message: `Sheet ${sheetNum}: "${layer.name || layer.type}" crosses the center cutting line (50%). Subjects may be cut by the album fold.`,
          });
        }

        // Check safety margin boundaries (outer 1% to 2%)
        if (layerLeft < 1 || layer.y < 1 || layerRight > 99 || (layer.y + (layer.height || 0)) > 99) {
          warnings.push({
            type: 'caution',
            message: `Sheet ${sheetNum}: "${layer.name || layer.type}" extends into the outer 100 px safety trim margin.`,
          });
        }
      });
    });

    return {
      passed: warnings.filter((w) => w.type === 'caution').length === 0,
      warnings,
      specs: {
        dimensions: albumSize.inches,
        cm: albumSize.cm,
        ppi: albumSize.ppi || PPI,
        pixels: pixelsForSize(albumSize.spreadWidth, albumSize.height, albumSize.ppi || PPI),
      },
    };
  },

  // Render a sheet to an HTML5 Canvas at exact pixel dimensions WITHOUT guide overlays
  async renderSheetToCanvas(sheet, albumSize, targetPpi = PPI) {
    const spreadW = albumSize.spreadWidth || 36;
    const spreadH = albumSize.height || 12;
    const px = pixelsForSize(spreadW, spreadH, targetPpi);

    const canvas = document.createElement('canvas');
    canvas.width = px.width;
    canvas.height = px.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to create 2D canvas context for rendering.');
    }

    // 1. Fill Base Background
    paintSheetBackground(ctx, sheet, px.width, px.height);

    // 2. Render Layers in Stacking Order
    const layers = sheet.layers || [];
    for (const layer of layers) {
      if (layer.type === 'decoration') {
        ctx.save();
        ctx.fillStyle = layer.color || '#D4AF62';
        const dx = (layer.x / 100) * px.width;
        const dy = (layer.y / 100) * px.height;
        const dw = (layer.width / 100) * px.width;
        const dh = Math.max(2, ((layer.height || 4) / 600) * px.height);
        ctx.fillRect(dx, dy, dw, dh);
        ctx.restore();
      } else if (layer.type === 'photo') {
        const lx = (layer.x / 100) * px.width;
        const ly = (layer.y / 100) * px.height;
        const lw = (layer.width / 100) * px.width;
        const lh = (layer.height / 100) * px.height;

        if (layer.previewUrl) {
          const img = await loadImage(layer.previewUrl);
          if (img) {
            ctx.save();
            ctx.globalAlpha = layer.opacity ?? 1;

            // Apply Brightness & Contrast Adjustments
            const brightness = layer.adjustments?.brightness || 100;
            const contrast = layer.adjustments?.contrast || 100;
            if (ctx.filter !== undefined) {
              ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
            }

            // Draw photo clipped inside frame
            ctx.drawImage(img, lx, ly, lw, lh);
            ctx.restore();
          }
        } else {
          // Draw subtle empty placeholder if photo missing
          ctx.save();
          ctx.fillStyle = '#FAF8FF';
          ctx.strokeStyle = '#D4AF62';
          ctx.lineWidth = 2;
          ctx.fillRect(lx, ly, lw, lh);
          ctx.strokeRect(lx, ly, lw, lh);
          ctx.restore();
        }
      } else if (layer.type === 'text') {
        ctx.save();
        ctx.globalAlpha = layer.opacity ?? 1;

        // Scale font size proportionally to 300 PPI canvas
        const scaleFactor = px.height / 600;
        const fontSizePx = (layer.fontSize || 24) * scaleFactor;

        ctx.font = `${layer.fontWeight || 'bold'} ${fontSizePx}px ${layer.fontFamily || 'serif'}`;
        ctx.fillStyle = layer.color || '#29213A';
        ctx.textBaseline = 'top';

        const tx = (layer.x / 100) * px.width;
        const ty = (layer.y / 100) * px.height;
        ctx.fillText(layer.text || '', tx, ty);
        ctx.restore();
      }
    }

    return canvas;
  },

  // Export Single Sheet as High-Res JPEG
  async exportSheetAsJPEG(sheet, albumSize, filename, targetPpi = PPI, quality = 0.95) {
    const canvas = await this.renderSheetToCanvas(sheet, albumSize, targetPpi);
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadBlob(blob, filename || `Sheet_${sheet.sheetNumber || 1}_300DPI.jpg`);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        'image/jpeg',
        quality
      );
    });
  },

  // Export Single Sheet as Lossless PNG
  async exportSheetAsPNG(sheet, albumSize, filename, targetPpi = PPI) {
    const canvas = await this.renderSheetToCanvas(sheet, albumSize, targetPpi);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, filename || `Sheet_${sheet.sheetNumber || 1}_300DPI.png`);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 'image/png');
    });
  },

  // Export Single Sheet as Print-Ready PDF
  async exportSheetAsPDF(sheet, albumSize, filename, targetPpi = PPI) {
    const spreadW = albumSize.spreadWidth || 36;
    const spreadH = albumSize.height || 12;
    const canvas = await this.renderSheetToCanvas(sheet, albumSize, targetPpi);
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Create jsPDF document with exact physical dimensions in inches
    const doc = new jsPDF({
      orientation: spreadW >= spreadH ? 'landscape' : 'portrait',
      unit: 'in',
      format: [spreadW, spreadH],
    });

    doc.addImage(imgData, 'JPEG', 0, 0, spreadW, spreadH);
    doc.save(filename || `Sheet_${sheet.sheetNumber || 1}_PrintReady.pdf`);
    return true;
  },

  // Export Complete Multi-Page Album PDF
  async exportCompleteAlbumPDF(project, filename, targetPpi = 150, onProgress = null) {
    const albumSize = project?.albumSize || { spreadWidth: 36, height: 12 };
    const spreadW = albumSize.spreadWidth || 36;
    const spreadH = albumSize.height || 12;
    const sheets = project?.sheets || [];
    const total = sheets.length;

    if (total === 0) return false;

    const doc = new jsPDF({
      orientation: spreadW >= spreadH ? 'landscape' : 'portrait',
      unit: 'in',
      format: [spreadW, spreadH],
    });

    for (let i = 0; i < total; i++) {
      if (onProgress) {
        onProgress({ current: i + 1, total, message: `Rendering Sheet ${i + 1} of ${total}...` });
      }

      const canvas = await this.renderSheetToCanvas(sheets[i], albumSize, targetPpi);
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (i > 0) {
        doc.addPage([spreadW, spreadH], spreadW >= spreadH ? 'landscape' : 'portrait');
      }
      doc.addImage(imgData, 'JPEG', 0, 0, spreadW, spreadH);
    }

    if (onProgress) {
      onProgress({ current: total, total, message: 'Generating print PDF document...' });
    }

    const cleanTitle = (project?.name || 'Wedding_Album').replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(filename || `${cleanTitle}_Complete_Album.pdf`);
    return true;
  },

  // Export All Sheets in a ZIP Archive
  async exportAllSheetsAsZIP(project, filename, format = 'jpeg', targetPpi = PPI, onProgress = null) {
    const albumSize = project?.albumSize || { spreadWidth: 36, height: 12 };
    const sheets = project?.sheets || [];
    const total = sheets.length;

    if (total === 0) return false;

    const zip = new JSZip();
    const folderName = (project?.name || 'Album_Sheets').replace(/[^a-zA-Z0-9_-]/g, '_');
    const folder = zip.folder(folderName) || zip;

    for (let i = 0; i < total; i++) {
      if (onProgress) {
        onProgress({ current: i + 1, total, message: `Rendering Sheet ${i + 1} of ${total}...` });
      }

      const canvas = await this.renderSheetToCanvas(sheets[i], albumSize, targetPpi);
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const ext = format === 'png' ? 'png' : 'jpg';

      const blob = await new Promise((res) => canvas.toBlob(res, mime, 0.95));
      if (blob) {
        const sheetNumStr = String(i + 1).padStart(2, '0');
        folder.file(`Sheet_${sheetNumStr}_${albumSize.inches.replace(/\s+/g, '')}.${ext}`, blob);
      }
    }

    if (onProgress) {
      onProgress({ current: total, total, message: 'Compressing ZIP archive...' });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      if (onProgress) {
        onProgress({
          current: total,
          total,
          message: `Compressing package: ${Math.round(metadata.percent)}%`,
        });
      }
    });

    const cleanTitle = (project?.name || 'Wedding_Album').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadBlob(zipBlob, filename || `${cleanTitle}_All_Sheets_300DPI.zip`);
    return true;
  },
};
