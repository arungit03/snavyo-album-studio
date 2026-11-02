# SNAVYO ALBUM STUDIO

Professional wedding album designing platform by **SNAVYO VISUALS**.

**Tagline:** CREATE. DESIGN. RELIVE.

## Overview

SNAVYO ALBUM STUDIO is a modern, responsive web application that transforms wedding photographs into beautiful, professional, print-ready album sheets using intelligent automatic design generation.

Built for wedding photographers, photography studios, album designers, photo editing businesses, and album printing companies.

## Tech Stack

- **Frontend:** React.js + Tailwind CSS + JavaScript
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Build Tool:** Vite
- **PDF Export:** jsPDF
- **ZIP Export:** JSZip
- **Canvas Engine:** HTML5 Canvas API (browser-based)

## Getting Started

### Prerequisites

- Node.js v20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/arungit03/snavyo-album-studio.git
cd snavyo-album-studio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`.

## Project Structure

```
SNAVYO-ALBUM-STUDIO/
├── public/          # Static assets (logo, fonts, images)
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Application pages (Home, Dashboard, Editor, etc.)
│   ├── features/    # Feature modules (events, sizes, upload, layout, etc.)
│   ├── hooks/       # Custom React hooks
│   ├── services/    # API and backend services
│   ├── contexts/    # React context providers
│   ├── utils/       # Utility functions
│   ├── constants/   # App constants and config
│   ├── styles/      # Global styles
│   ├── App.jsx      # Root component with routing
│   ├── index.css    # Global CSS / Tailwind
│   └── main.jsx     # App entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features

- 22 event categories (Wedding, Engagement, Reception, Haldi, Mehendi, Sangeet, etc.)
- Multiple standard album sizes (8×24 up to 18×36 inches) plus custom dimensions
- 1–100 sheets per project
- Photo upload, library, categorisation, and quality checking
- Professional album editor with canvas, layers, and properties panels
- AI-assisted automatic layout generation (three variations per sheet)
- Background and decoration engine
- Automatic text and typography suggestions
- Photo colour correction (non-destructive)
- Creative Sheet generator
- Multi-sheet album management
- PSD import and export
- JPEG, PNG, PDF, and layered PSD export at 300 PPI
- Project save, autosave, and recovery
- Print-ready output with safety guides (excluded from exports)

## Brand Identity

- **Primary background:** Light purple `#F5F0FF`
- **Primary purple:** `#7550B8`
- **Gold accent:** `#D4AF62`
- **White cards:** `#FFFFFF`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## License

© SNAVYO VISUALS. All rights reserved.
