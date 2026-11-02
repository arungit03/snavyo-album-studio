# SNAVYO ALBUM STUDIO – Architectural Design Specification
**Date:** 2026-11-02  
**Version:** 2.0  
**Status:** Approved for Implementation Planning  
**Target Platform:** Windows 11 Desktop Application (Standalone)  

---

## 1. System Vision & Branding
**SNAVYO ALBUM STUDIO** is a standalone Windows desktop software crafted specifically for professional wedding photographers, album designers, and high-end photo studios.

### Visual Identity
* **Primary Royal Purple:** `#0F051D` (Deep Void), `#1A0B2E` (Royal Velvet), `#2B124C` (Rich Amethyst)
* **Accent Gold:** `#D4AF37` (Polished Gold), `#F5D77F` (Champagne Gold), `#996515` (Antique Bronze)
* **Neutral Accents:** `#121217` (Dark Surface), `#FBF8F2` (Ivory Print Preview), `#E0E0E0` (UI Text)
* **Feel:** Premium, luxury photography studio software (inspired by Apple Pro apps and Adobe Creative Cloud, with SNAVYO VISUALS signature royal purple & gold elegance).

---

## 2. Core Architecture & Technology Stack

```
+--------------------------------------------------------------------------------+
|                         SNAVYO ALBUM STUDIO (DESKTOP)                          |
+--------------------------------------------------------------------------------+
|  ELECTRON MAIN PROCESS (Node.js)                                               |
|  - Native Window & Menu Management                                             |
|  - Local File System Access (.snavyo project files, photo assets)              |
|  - Layered PSD Import/Export Engine via 'ag-psd'                               |
|  - High-Resolution 300 DPI Export Pipeline (JPEG, PNG, TIFF, PSD)              |
|  - Native IPC Bridge (electron.contextBridge)                                  |
+--------------------------------------------------------------------------------+
                                       ^
                                       | IPC Channels (safe & typed)
                                       v
+--------------------------------------------------------------------------------+
|  ELECTRON RENDERER PROCESS (Vite + React + Tailwind CSS)                       |
|  - UI State Store (Zustand with Immer, multi-level Undo/Redo)                  |
|  - Interactive Canvas Engine (Konva.js / React-Konva)                          |
|    * Viewport zoom, pan, rulers, snap-to-grid, center spine indicator          |
|    * Photo frame clipping, transform handles, magnetic guidelines              |
|  - Smart Layout Engine (Heuristic 3-variation generator)                       |
|  - Non-Destructive Photo Editing Engine (WebGL / Canvas2D filter pipeline)     |
|  - Background & Gold Vector Decoration Engine                                  |
|  - Hybrid AI Photo Classifier (Local heuristics + optional Cloud AI)          |
+--------------------------------------------------------------------------------+
```

### Dependencies
* **Desktop Shell:** Electron 35+
* **Frontend:** React 19 / 18, Vite, Tailwind CSS, Lucide React (luxury iconography)
* **Interactive Canvas:** `konva`, `react-konva`
* **PSD Engine:** `ag-psd` (Pure JS/TS reading and writing of layered Adobe Photoshop PSD files)
* **Image Processing & Metadata:** HTML5 OffscreenCanvas, Exif extraction, optional `sharp` for fast local native processing
* **State Management:** `zustand` (fast, lightweight, simple for beginners, built-in undo/redo)

---

## 3. Project File Format (`.snavyo`) & Data Schema

A `.snavyo` file is a structured, human-readable JSON project file referencing local image files or packaging assets:

```typescript
interface SnavyoProject {
  version: "2.0";
  metadata: {
    id: string;
    title: string;
    createdAt: string;
    modifiedAt: string;
    targetLabProfile: "sRGB" | "AdobeRGB";
  };
  settings: {
    widthInches: number;      // e.g. 36
    heightInches: number;     // e.g. 12
    dpi: 300;                 // 300 PPI output resolution
    orientation: "landscape" | "portrait";
    pixelWidth: number;       // e.g. 10800
    pixelHeight: number;      // e.g. 3600
    bleedMarginInches: 0.25;  // Safe print bleed area
    centerSpineInches: 0.5;   // Center book fold safety zone
  };
  photos: {
    id: string;
    fileName: string;
    filePath: string;
    width: number;
    height: number;
    effectivePPI: number;
    aiCategory: "Bride" | "Groom" | "Couple" | "Traditional" | "Group" | "Candid" | "Cinematic" | "Rituals" | "Other";
    manualCategory?: string;
  }[];
  sheets: {
    id: string;
    index: number;
    title: string;            // e.g. "Sheet 1 (Spread 1)"
    background: {
      type: "solid" | "gradient" | "texture" | "ivory" | "champagne" | "blush" | "sage" | "dusty_blue";
      value: string;
      opacity: number;
    };
    decorations: {
      id: string;
      type: "gold_line" | "floral_corner" | "geometric_frame" | "arabic_arch" | "minimal_divider";
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      color: string;          // Gold: #D4AF37
      opacity: number;
    }[];
    frames: {
      id: string;
      photoId?: string;
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      zIndex: number;
      crop: { x: number; y: number; zoom: number };
      border: { width: number; color: string; radius: number };
      shadow: { enabled: boolean; color: string; blur: number; offsetX: number; offsetY: number };
      adjustments: PhotoAdjustments;
    }[];
  }[];
}

interface PhotoAdjustments {
  exposure: number;       // -2.0 to +2.0
  contrast: number;       // -100 to +100
  highlights: number;     // -100 to +100
  shadows: number;        // -100 to +100
  whites: number;         // -100 to +100
  blacks: number;         // -100 to +100
  temperature: number;    // -100 (Cool) to +100 (Warm)
  tint: number;           // -100 (Green) to +100 (Magenta)
  vibrance: number;       // -100 to +100
  saturation: number;     // -100 to +100
  clarity: number;        // -100 to +100
  sharpening: number;     // 0 to 100
  colorGrade: {
    shadows: { hue: number; sat: number };
    highlights: { hue: number; sat: number };
  };
}
```

---

## 4. Smart Album Layout Engine

### Multi-Photo Auto-Splitting
* When a user imports a bulk collection (e.g., 50 photographs), the engine distributes them across sheets based on rules:
  * 1 to 20 photos per sheet.
  * 50 photos = Sheet 1 (20) + Sheet 2 (20) + Sheet 3 (10).
  * Grouping prioritizes event categories (e.g. Ritual photos grouped together, Bride solo portraits together).

### Three Layout Variations Generator
For any selected subset of photos on a sheet, the engine computes three distinct design layouts:
1. **Variation 1 – Grand Hero Spread:**
   * One primary hero photograph receives 50%–70% of visual space (spanning the left or right side of the spread).
   * Secondary supporting photos are arranged in a clean, elegant vertical or 2×2 grid on the opposing side.
2. **Variation 2 – Editorial & Cinematic Spread:**
   * Asymmetrical magazine spread with generous whitespace, delicate gold divider lines, and panoramic/widescreen aspect ratios.
3. **Variation 3 – Balanced Rhythmic Harmony:**
   * Symmetrical multi-frame grid with consistent gutters, subtle drop shadows, and ornamental floral/gold corner embellishments.

---

## 5. Background & Decoration Engine
* **Luxury Palettes:** Ivory (`#FFFFF0`), Champagne (`#F7E7CE`), Warm Beige (`#F5F5DC`), Soft Blush (`#FFE4E1`), Sage (`#9CAF88`), Dusty Blue (`#7A8B99`), Royal Studio Purple (`#1A0B2E`).
* **Auto-Color Suggestion:** Extracts dominant harmonious tones from the loaded photographs to recommend matching background tints.
* **Vector Accents:** Minimalist vector gold lines, royal wedding arches, delicate botanical leaf corners, and geometric borders.

---

## 6. Advanced Non-Destructive Photo Editor
* Built using a GPU-accelerated Canvas2D / WebGL filter pipeline.
* Sliders for all professional adjustments:
  * Exposure, Contrast, Highlights, Shadows, Whites, Blacks.
  * Temperature (Kelvin shift), Tint, Vibrance, Saturation.
  * Clarity, Texture, Sharpening.
  * Split-toning Color Grading (warm gold highlights + cool velvet shadows).
* **Non-destructive:** Source photos are never modified. All values are stored in the project file and applied dynamically on screen and during 300 DPI export.
* Batch operations: "Copy Adjustments", "Apply to All on Sheet", "Apply to Whole Album".

---

## 7. Photoshop PSD Import & Export System

### PSD Import:
* Uses `ag-psd` to parse standard `.psd` files.
* Extracts raster image layers, layer positions, opacity, blend modes, and text content.
* Automatically converts PSD layers into SNAVYO canvas frames and decoration elements.
* Shows graceful fallback alerts for unsupported Adobe-proprietary features (e.g. 3D layers or smart vector shapes).

### PSD Export:
* Compiles the entire 12×36" (or 12×30") spread at 300 DPI into a real layered PSD.
* Layer Hierarchy in exported PSD:
  ```
  SNAVYO ALBUM SPREAD
  ├── Background
  │   └── Solid / Gradient / Texture Layer
  ├── Decorations
  │   ├── Gold Border Elements
  │   └── Vector Ornaments
  ├── Photo Layers
  │   ├── Photo 01 - Hero (Layer Mask + Image)
  │   ├── Photo 02 (Layer Mask + Image)
  │   └── Photo 03 (Layer Mask + Image)
  ├── Borders & Frames
  └── Text Elements
  ```
* Guaranteed to open in Adobe Photoshop CS6, CC, and modern Photoshop editions with fully editable, movable layers.

---

## 8. High-Resolution Print Export System
* Output formats: **JPEG (300 DPI, 100% Quality)**, **Lossless PNG (300 DPI)**, **TIFF**, and **Layered PSD**.
* Accurate 300 PPI dimension output:
  * 12 × 36 inches = 10,800 × 3,600 pixels.
  * 12 × 30 inches = 9,000 × 3,600 pixels.
* Memory management: Uses chunked canvas rendering / offscreen workers to ensure smooth export without browser memory crashes.
* Quality Assurance: Calculates effective PPI based on user cropping. Alerts designer if effective PPI drops below 200 PPI, but never prevents export.

---

## 9. Error Handling & Testing Strategy
* **Non-destructive project saving:** Project files are written using atomic writes (write to `.tmp` then rename) to prevent corruption during unexpected shutdowns.
* **Autosave & Recovery:** Auto-saves project state to local app data every 3 minutes.
* **Component Testing:** Unit tests for layout geometry calculation, photo distribution math, and PSD structure generation.
* **Visual Testing:** Interactive canvas snapshot verification.

---

## 10. Step-by-Step Development Roadmap (20 Stages)
1. **Stage 1:** Project Scaffolding (Electron + Vite + React + Tailwind + SNAVYO Royal Purple/Gold Theme).
2. **Stage 2:** Opening Dashboard (New Project, Recent, Sheet Size Selection: 12x36, 12x30, Custom).
3. **Stage 3:** Interactive Workspace Layout & Rulers (Top bar, Left dock, Right inspector, Bottom filmstrip).
4. **Stage 4:** Photo Upload & Asset Library (Drag-and-drop import, thumbnail caching, metadata inspection).
5. **Stage 5:** Interactive Canvas & Konva Viewport (Zoom, pan, center spine fold, safe bleed margins).
6. **Stage 6:** Photo Frame System & Clipping (Drag photo onto frame, crop, scale, rotate, transform handles).
7. **Stage 7:** Smart Layout Engine (Auto-calculate grids based on photo count and portrait/landscape orientation).
8. **Stage 8:** 3 Layout Variations Generator (Hero, Editorial, Balanced spreads).
9. **Stage 9:** Background & Decoration Engine (Ivory, Champagne, Blush palettes, gold vector dividers).
10. **Stage 10:** Non-Destructive Photo Editor (Exposure, Contrast, Highlights, Shadows, Temp, Tint, Vibrance sliders).
11. **Stage 11:** Multi-Sheet Album Management (Add, duplicate, delete, reorder spreads in filmstrip).
12. **Stage 12:** Project Storage (`.snavyo` file save, auto-save, and reopen).
13. **Stage 13:** PSD Import Engine (Parse `.psd` layers and map into SNAVYO canvas frames).
14. **Stage 14:** Editable Layered PSD Export Engine (Generate `.psd` with grouped, labeled layers using `ag-psd`).
15. **Stage 15:** Photoshop Compatibility Verification (Test PSD output against Adobe Photoshop specs).
16. **Stage 16:** High-Res 300 DPI Export (10,800 × 3,600 px JPEG, PNG, TIFF).
17. **Stage 17:** AI Photo Classifier (Offline heuristics + optional Cloud AI for Bride, Groom, Rituals).
18. **Stage 18:** Photo Quality & Effective PPI Inspector (Print resolution warnings).
19. **Stage 19:** Performance Optimization & Memory Management.
20. **Stage 20:** Windows Desktop Packaging & Installer (`electron-builder`).
