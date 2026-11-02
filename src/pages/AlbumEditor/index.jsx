import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storageService';
import { createDefaultSheet, EVENTS, ALBUM_SIZES, pixelsForSize, PPI } from '@/utils/albumData';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import CanvasWorkspace from './CanvasWorkspace';
import RightSidebar from './RightSidebar';
import Filmstrip from './Filmstrip';
import ExportModal from './ExportModal';
import { WEDDING_TEMPLATES, WEDDING_GALLERY_SLOTS } from '@/utils/templateData';

export default function AlbumEditor() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  const [showCenterSpine, setShowCenterSpine] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [eraserSize, setEraserSize] = useState(16);

  const handleSelectLayer = useCallback((layerId) => {
    setSelectedLayerId(layerId);
    // Only exit eraser mode when deselecting (null) or switching to a different layer
    setEraserMode((prev) => {
      if (!prev) return false;          // wasn't erasing anyway
      if (layerId === null) return false; // deselected → stop erasing
      return prev;                       // same or new layer — keep eraser on
    });
  }, []);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const hasLoadedRef = useRef(false);

  const commitProject = useCallback((updater) => {
    setProject((current) => {
      if (!current) return current;
      const next = typeof updater === 'function' ? updater(current) : updater;
      if (next === current) return current;
      setUndoStack((stack) => [...stack, current].slice(-60));
      setRedoStack([]);
      return next;
    });
  }, []);

  // Load project on mount or when projectId changes
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      if (projectId) {
        const found = await StorageService.getProject(projectId);
        if (isMounted) {
          if (found) {
            const hydrated = await StorageService.hydrateProjectAssets(found);
            setProject(hydrated);
            setActiveSheetIndex(found.activeSheetIndex || 0);
          } else {
            console.warn('Project not found, creating fallback project for id:', projectId);
            const defaultEvent = EVENTS[0];
            const defaultSize = ALBUM_SIZES.find((s) => s.id === '12x36') || ALBUM_SIZES[4];
            const fallbackProject = {
              id: projectId,
              name: 'Royal Wedding Album',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              event: defaultEvent,
              albumSize: {
                ...defaultSize,
                ppi: PPI,
                pixels: pixelsForSize(defaultSize.spreadWidth, defaultSize.height, PPI),
              },
              sheetCount: 30,
              activeSheetIndex: 0,
              sheets: Array.from({ length: 30 }, (_, i) => createDefaultSheet(i + 1, defaultEvent)),
              photos: [],
            };
            await StorageService.saveProject(fallbackProject);
            setProject(fallbackProject);
          }
          hasLoadedRef.current = true;
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const persistProject = useCallback(async (value = project) => {
    if (!value) return;
    setIsSaving(true);
    await StorageService.saveProject({ ...value, activeSheetIndex });
    setIsSaving(false);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [project, activeSheetIndex]);

  // Save Project
  const handleSave = useCallback(async () => {
    await persistProject();
  }, [persistProject]);

  useEffect(() => {
    if (!project || !hasLoadedRef.current) return undefined;
    const timer = window.setTimeout(() => persistProject(project), 900);
    return () => window.clearTimeout(timer);
  }, [project, activeSheetIndex, persistProject]);

  const handleUndo = useCallback(() => {
    setUndoStack((stack) => {
      if (!stack.length) return stack;
      const previous = stack[stack.length - 1];
      setProject((current) => {
        setRedoStack((redo) => [...redo, current].slice(-60));
        return previous;
      });
      return stack.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setRedoStack((stack) => {
      if (!stack.length) return stack;
      const next = stack[stack.length - 1];
      setProject((current) => {
        setUndoStack((undo) => [...undo, current].slice(-60));
        return next;
      });
      return stack.slice(0, -1);
    });
  }, []);

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if (e.key === 'Delete' && selectedLayerId) {
        // Don't delete while user is typing in an input/textarea/contenteditable
        const tag = document.activeElement?.tagName?.toUpperCase();
        const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
          || document.activeElement?.isContentEditable;
        if (isEditing) return;
        handleDeleteLayer(selectedLayerId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleRedo, handleUndo, selectedLayerId]);

  // Upload photos into project
  const handleUploadPhotos = async (files) => {
    const newPhotos = await Promise.all(files.map(async (file) => {
      const assetId = 'asset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7);
      const stored = await StorageService.saveAsset({ id: assetId, blob: file, name: file.name, type: file.type, size: file.size });
      const url = stored
        ? URL.createObjectURL(file)
        : await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
      return {
        id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: file.name,
        previewUrl: url,
        assetId: stored ? assetId : null,
        sizeBytes: file.size,
        category: 'All',
        width: 1920,
        height: 1080,
      };
    }));

    commitProject((prev) => {
      const updated = {
        ...prev,
        photos: [...(prev?.photos || []), ...newPhotos],
      };
      return updated;
    });
  };

  // Add photo frame to active sheet
  const handleAddPhoto = (photo) => {
    const activeSheet = project?.sheets?.[activeSheetIndex];
    if (!activeSheet) return;

    const newLayer = {
      id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'photo',
      name: photo.name || 'Photo Frame',
      photoId: photo.id,
      previewUrl: photo.previewUrl,
      x: 10 + (activeSheet.layers.length % 5) * 5,
      y: 15 + (activeSheet.layers.length % 5) * 5,
      width: 35,
      height: 70,
      opacity: 1,
      adjustments: { brightness: 100, contrast: 100 },
    };

    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = {
        ...activeSheet,
        layers: [...activeSheet.layers, newLayer],
      };
      return { ...prev, sheets: updatedSheets };
    });
    setSelectedLayerId(newLayer.id);
  };

  // Add typography layer
  const handleAddText = (text, fontFamily = 'Playfair Display', fontSize = 28) => {
    const activeSheet = project?.sheets?.[activeSheetIndex];
    if (!activeSheet) return;

    const newLayer = {
      id: 'layer_text_' + Date.now(),
      type: 'text',
      name: text,
      text,
      fontFamily,
      fontSize,
      color: project?.event?.colors?.text || '#29213A',
      fontWeight: 'bold',
      x: 30,
      y: 8,
      opacity: 1,
    };

    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = {
        ...activeSheet,
        layers: [...activeSheet.layers, newLayer],
      };
      return { ...prev, sheets: updatedSheets };
    });
    setSelectedLayerId(newLayer.id);
  };

  // Add gold decoration line
  const handleAddDecoration = (dec) => {
    const activeSheet = project?.sheets?.[activeSheetIndex];
    if (!activeSheet) return;

    const newLayer = {
      id: 'layer_dec_' + Date.now(),
      type: 'decoration',
      name: dec.name,
      decorType: dec.type,
      color: dec.color || '#D4AF62',
      x: 40,
      y: 90,
      width: 20,
      height: 4,
    };

    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = {
        ...activeSheet,
        layers: [...activeSheet.layers, newLayer],
      };
      return { ...prev, sheets: updatedSheets };
    });
    setSelectedLayerId(newLayer.id);
  };

  // Apply a designed background treatment or a plain color to the active sheet
  const handleApplyBackground = (background) => {
    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      const currentBackground = updatedSheets[activeSheetIndex].background || {};
      const isDesignedBackground = typeof background === 'object';
      updatedSheets[activeSheetIndex] = {
        ...updatedSheets[activeSheetIndex],
        background: {
          ...currentBackground,
          type: isDesignedBackground ? 'design' : 'color',
          value: isDesignedBackground ? background.color : background,
          css: isDesignedBackground ? background.background : null,
          image: null,
          templateId: null,
        },
      };
      return { ...prev, sheets: updatedSheets };
    });
  };

  const handleApplyWeddingTemplate = (details) => {
    const activeSheet = project?.sheets?.[activeSheetIndex];
    if (!activeSheet) return;

    const makeId = (suffix) => `wedding_template_${suffix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const formatDate = (value) => {
      if (!value) return '';
      const [year, month, day] = value.split('-');
      return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };
    const formatTime = (value) => {
      if (!value) return '';
      const [hours, minutes] = value.split(':');
      const date = new Date(1970, 0, 1, Number(hours), Number(minutes));
      return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    };

    const mask = (id, x, y, width, height) => ({
      id: makeId(id),
      type: 'template-mask',
      name: 'Template text area',
      x,
      y,
      width,
      height,
      color: '#FCE9DC',
    });

    const text = (id, value, x, y, fontSize, width = 42) => ({
      id: makeId(id),
      type: 'text',
      name: value,
      text: value,
      fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
      fontSize,
      color: '#5B382F',
      fontWeight: 'bold',
      x,
      y,
      width,
      opacity: 1,
    });

    const templateLayers = [
      mask('names-mask', 53, 30, 46, 27),
      mask('message-mask', 53, 57, 45, 17),
      mask('details-mask', 53, 76, 27, 22),
      {
        id: makeId('photo'),
        type: 'photo',
        name: 'Wedding template photo',
        previewUrl: details.photoPreview,
        x: 2,
        y: 24,
        width: 49,
        height: 57,
        templateShape: true,
        opacity: 1,
        adjustments: { brightness: 100, contrast: 100 },
      },
      text('names', details.coupleNames, 55, 34, 28),
      text('date', `Date: ${formatDate(details.date)}`, 55, 77, 12, 30),
      text('time', `Time: ${formatTime(details.time)}`, 55, 83, 12, 30),
      text('location', `Place: ${details.location}`, 55, 89, 12, 42),
    ];

    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = {
        ...updatedSheets[activeSheetIndex],
        background: {
          type: 'template',
          value: '#FCE9DC',
          css: null,
          image: WEDDING_TEMPLATES.classic.background,
          templateId: WEDDING_TEMPLATES.classic.id,
        },
        layers: templateLayers,
      };
      return { ...prev, sheets: updatedSheets };
    });
    setSelectedLayerId(null);
    setEraserMode(false);
  };

  const handleApplyWeddingGalleryTemplate = ({ photos }) => {
    const activeSheet = project?.sheets?.[activeSheetIndex];
    if (!activeSheet) return;

    const templateLayers = photos.map((photo, index) => {
      const slot = WEDDING_GALLERY_SLOTS[index];
      return {
        id: `gallery_photo_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
        type: 'photo',
        name: `Gallery photo ${index + 1}`,
        previewUrl: photo.previewUrl,
        ...slot,
        opacity: 1,
        adjustments: { brightness: 100, contrast: 100 },
      };
    });

    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = {
        ...updatedSheets[activeSheetIndex],
        background: {
          type: 'template',
          value: '#F2F0EC',
          css: null,
          image: WEDDING_TEMPLATES.gallery.background,
          templateId: WEDDING_TEMPLATES.gallery.id,
        },
        layers: templateLayers,
      };
      return { ...prev, sheets: updatedSheets };
    });
    setSelectedLayerId(null);
  };

  // Apply smart layout composition (Grand Hero, Editorial, Cinematic)
  const handleApplyLayout = (layoutType) => {
    const photos = project?.photos || [];
    const p1 = photos[0]?.previewUrl || null;
    const p2 = photos[1]?.previewUrl || null;
    const p3 = photos[2]?.previewUrl || null;
    const p4 = photos[3]?.previewUrl || null;

    let newLayers = [];

    if (layoutType === 'grand-hero') {
      // Large Hero on Left Page (x: 5 to 45), 2 Supporting on Right Page (x: 55 to 90)
      newLayers = [
        {
          id: 'layer_hero_' + Date.now(),
          type: 'photo',
          name: 'Grand Hero Photo',
          photoId: photos[0]?.id || null,
          previewUrl: p1,
          x: 5,
          y: 8,
          width: 42,
          height: 84,
          opacity: 1,
        },
        {
          id: 'layer_sub1_' + Date.now(),
          type: 'photo',
          name: 'Supporting Photo 1',
          photoId: photos[1]?.id || null,
          previewUrl: p2,
          x: 54,
          y: 8,
          width: 41,
          height: 40,
          opacity: 1,
        },
        {
          id: 'layer_sub2_' + Date.now(),
          type: 'photo',
          name: 'Supporting Photo 2',
          photoId: photos[2]?.id || null,
          previewUrl: p3,
          x: 54,
          y: 52,
          width: 41,
          height: 40,
          opacity: 1,
        },
      ];
    } else if (layoutType === 'editorial') {
      // 4 Balanced portrait frames with breathing room
      newLayers = [
        { id: 'l1', type: 'photo', name: 'Frame 1', photoId: photos[0]?.id, previewUrl: p1, x: 6, y: 12, width: 19, height: 76, opacity: 1 },
        { id: 'l2', type: 'photo', name: 'Frame 2', photoId: photos[1]?.id, previewUrl: p2, x: 28, y: 12, width: 19, height: 76, opacity: 1 },
        { id: 'l3', type: 'photo', name: 'Frame 3', photoId: photos[2]?.id, previewUrl: p3, x: 53, y: 12, width: 19, height: 76, opacity: 1 },
        { id: 'l4', type: 'photo', name: 'Frame 4', photoId: photos[3]?.id, previewUrl: p4, x: 75, y: 12, width: 19, height: 76, opacity: 1 },
      ];
    } else {
      // Cinematic 3-Photo spread
      newLayers = [
        { id: 'l1', type: 'photo', name: 'Left Frame', photoId: photos[0]?.id, previewUrl: p1, x: 5, y: 15, width: 26, height: 70, opacity: 1 },
        { id: 'l2', type: 'photo', name: 'Center Hero', photoId: photos[1]?.id, previewUrl: p2, x: 37, y: 10, width: 26, height: 80, opacity: 1 },
        { id: 'l3', type: 'photo', name: 'Right Frame', photoId: photos[2]?.id, previewUrl: p3, x: 69, y: 15, width: 26, height: 70, opacity: 1 },
      ];
    }

    commitProject((prev) => {
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = {
        ...updatedSheets[activeSheetIndex],
        layers: newLayers,
      };
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Update layer properties (x, y, width, height, adjustments, text, etc.)
  const handleUpdateLayer = (layerId, patch) => {
    commitProject((prev) => {
      const activeSheet = prev.sheets[activeSheetIndex];
      const updatedLayers = activeSheet.layers.map((l) =>
        l.id === layerId ? { ...l, ...patch } : l
      );
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = { ...activeSheet, layers: updatedLayers };
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Delete layer
  const handleDeleteLayer = (layerId) => {
    commitProject((prev) => {
      const activeSheet = prev.sheets[activeSheetIndex];
      const updatedLayers = activeSheet.layers.filter((l) => l.id !== layerId);
      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = { ...activeSheet, layers: updatedLayers };
      return { ...prev, sheets: updatedSheets };
    });
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
  };

  // Reorder layer
  const handleReorderLayer = (index, direction) => {
    commitProject((prev) => {
      const activeSheet = prev.sheets[activeSheetIndex];
      const updatedLayers = [...activeSheet.layers];
      const targetIndex = direction === 'up' ? index + 1 : index - 1;
      if (targetIndex < 0 || targetIndex >= updatedLayers.length) return prev;

      const temp = updatedLayers[index];
      updatedLayers[index] = updatedLayers[targetIndex];
      updatedLayers[targetIndex] = temp;

      const updatedSheets = [...prev.sheets];
      updatedSheets[activeSheetIndex] = { ...activeSheet, layers: updatedLayers };
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Multi-sheet management
  const handleAddSheet = () => {
    commitProject((prev) => {
      const newSheetNumber = prev.sheets.length + 1;
      const newSheet = createDefaultSheet(newSheetNumber, prev.event);
      return {
        ...prev,
        sheetCount: newSheetNumber,
        sheets: [...prev.sheets, newSheet],
      };
    });
    setActiveSheetIndex(project?.sheets?.length || 0);
  };

  const handleDuplicateSheet = (index) => {
    commitProject((prev) => {
      const source = prev.sheets[index];
      const clone = {
        ...JSON.parse(JSON.stringify(source)),
        id: 'sheet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        sheetNumber: prev.sheets.length + 1,
        title: `${source.title || 'Sheet'} (Copy)`,
      };
      const newSheets = [...prev.sheets];
      newSheets.splice(index + 1, 0, clone);
      return {
        ...prev,
        sheetCount: newSheets.length,
        sheets: newSheets,
      };
    });
    setActiveSheetIndex(index + 1);
  };

  const handleDeleteSheet = (index) => {
    if ((project?.sheets?.length || 1) <= 1) {
      alert('An album must have at least one sheet.');
      return;
    }
    commitProject((prev) => {
      const newSheets = prev.sheets.filter((_, i) => i !== index);
      return {
        ...prev,
        sheetCount: newSheets.length,
        sheets: newSheets,
      };
    });
    setActiveSheetIndex(Math.max(0, index - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-snavyo-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-snavyo-purple border-t-transparent animate-spin mb-4" />
        <h2 className="font-serif text-xl font-bold text-snavyo-text-main">
          Opening SNAVYO Album Studio...
        </h2>
        <p className="text-xs text-snavyo-text-secondary mt-1">
          Loading print canvas, safety guides, and layer assets.
        </p>
      </div>
    );
  }

  const activeSheet = project?.sheets?.[activeSheetIndex] || { layers: [] };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#EBE5F5]">
      {/* Top Application Toolbar */}
      <TopToolbar
        project={project}
        activeSheetIndex={activeSheetIndex}
        onSheetChange={setActiveSheetIndex}
        zoom={zoom}
        onZoomChange={setZoom}
        showGuides={showGuides}
        onToggleGuides={() => setShowGuides(!showGuides)}
        showCenterSpine={showCenterSpine}
        onToggleCenterSpine={() => setShowCenterSpine(!showCenterSpine)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onSave={handleSave}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
        onExport={() => setExportModalOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Drawer (Photos, Layouts, Backgrounds, Text, Decor) */}
        <LeftSidebar
          project={project}
          activeSheet={activeSheet}
          onAddPhoto={handleAddPhoto}
          onAddText={handleAddText}
          onAddDecoration={handleAddDecoration}
          onApplyBackground={handleApplyBackground}
          onApplyWeddingTemplate={handleApplyWeddingTemplate}
          onApplyWeddingGalleryTemplate={handleApplyWeddingGalleryTemplate}
          onApplyLayout={handleApplyLayout}
          onUploadPhotos={handleUploadPhotos}
        />

        {/* Center Interactive Spread Canvas */}
        <CanvasWorkspace
          project={project}
          activeSheetIndex={activeSheetIndex}
          zoom={zoom}
          onZoomChange={setZoom}
          showGuides={showGuides}
          showCenterSpine={showCenterSpine}
          showGrid={showGrid}
          selectedLayerId={selectedLayerId}
          onSelectLayer={handleSelectLayer}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          eraserMode={eraserMode}
          eraserSize={eraserSize}
          onToggleEraser={() => setEraserMode((value) => !value)}
          onEraserSizeChange={setEraserSize}
          onClearEraser={(layerId) => handleUpdateLayer(layerId, { eraserStrokes: [] })}
        />

        {/* Right Inspector (Layers, Object & Document Properties) */}
        <RightSidebar
          project={project}
          activeSheet={activeSheet}
          selectedLayerId={selectedLayerId}
          onSelectLayer={handleSelectLayer}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onReorderLayer={handleReorderLayer}
          onUpdateSheetBackground={handleApplyBackground}
          eraserMode={eraserMode}
          eraserSize={eraserSize}
          onToggleEraser={() => setEraserMode((value) => !value)}
          onEraserSizeChange={setEraserSize}
          onClearEraser={(layerId) => handleUpdateLayer(layerId, { eraserStrokes: [] })}
        />
      </div>

      {/* Bottom Multi-Sheet Filmstrip */}
      <Filmstrip
        project={project}
        activeSheetIndex={activeSheetIndex}
        onSelectSheet={setActiveSheetIndex}
        onAddSheet={handleAddSheet}
        onDuplicateSheet={handleDuplicateSheet}
        onDeleteSheet={handleDeleteSheet}
      />

      {/* Real High-Resolution Print Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        project={project}
        activeSheetIndex={activeSheetIndex}
      />
    </div>
  );
}

