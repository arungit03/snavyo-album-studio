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
- **Backend & Auth:** Firebase (Authentication, Firestore)
- **Payments:** Razorpay
- **Server:** Node.js (dev server)
- **Testing:** Vitest
- **Linting:** ESLint
- **Env:** dotenv

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

# Run tests
npm test

# Run lint
npm run lint

# Start API/server
npm run server
```

The app will open at `http://localhost:5173`.

## Project Structure

```
SNAVYO-ALBUM-STUDIO/
├── public/                # Static assets (logo, fonts, images)
├── src/
│   ├── components/        # Reusable UI components
│   ├── components/common/ # Shared primitives (Button, BrandMark, SectionHeading, …)
│   ├── pages/             # Application pages (Home, Editor, Dashboard, …)
│   ├── features/          # Feature modules (auth, cart, order flow)
│   ├── services/          # API and backend services (export, auth, draft, order, photo, upload)
│   ├── utils/             # Utility functions (pricing, album builder, album data)
│   ├── constants/         # App constants and config (events, themes, products, pricing)
│   ├── App.jsx            # Root component with routing
│   ├── index.css          # Global CSS / Tailwind
│   ├── main.jsx           # App entry point
│   └── firebase.js        # Firebase configuration
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vitest.config.js
```

## Key Features

### Products
- **Wedding Albums** — 1–100 sheets, standard sizes from 8×24″ up to 18×36″ plus custom dimensions
- **Photo Books** — 24–100 pages, A5 / A4 / A3 sizes

### Occasions & Themes
- **22 event categories** — Wedding, Engagement, Reception, Pre-Wedding, Post-Wedding, Haldi, Mehendi, Sangeet, Birthday, Baby Shower, Maternity, Newborn, Naming Ceremony, Cradle Ceremony, Puberty Function, Housewarming, Wedding Anniversary, Retirement, Graduation, Corporate Events, Family Function, Other Events
- **8 theme categories** with ~24 editable themes (Wedding, Engagement, Reception, Haldi, Mehendi, Sangeet, Baby & Kids, Travel)
- Each theme carries its own colors, typography, decoratives, and text suggestions

### Smart Create Flow
- Choose a theme, orientation, album size, and paper finish from the template gallery
- Upload photos — the editor arranges them into editable layers
- Photos distributed across pages, keeping orientation groups together
- Three auto-layout variations per sheet (**Grand Hero**, **Editorial**, **Cinematic**), cycled so consecutive sheets differ
- Per-page re-layout (reshuffle) to try a different variation on any sheet

### Professional Album Editor
- HTML5 Canvas-based workspace with a physical book-spread simulation (center fold line)
- Layered editing — photos, text, shapes, backgrounds, and decorations are all individual layers
- Move, resize, and rotate every layer
- Image eraser to cut out parts of a photo layer, with adjustable brush size
- Layer controls: opacity, brightness/contrast adjustments, fit mode (cover/contain), crop position and scale, template shapes
- Theme backgrounds (color / gradient / image) per sheet
- Zoom, grid overlay, and toggleable guides
- **300 PPI print resolution** with 100 px outer safety margins and a 200 px center cutting clearance (Adobe InDesign-style guides, excluded from exports)
- Empty-frame placeholders and delete-layer controls

### Print-Ready Export
- Single sheet: **JPEG, PNG, or print-ready PDF** at true 300 PPI
- Complete album: **multi-page PDF** (one page per sheet) with progress tracking
- All sheets: **ZIP archive** (JPEG or PNG) at 300 PPI
- Preflight print inspection — flags empty frames, center-spine overlaps, and safety-margin violations before export

### Storefront & Orders
- Live price calculator driven from a single config file (base per sheet/page, paper, cover, lamination, orientation, shipping, tax)
- Orientations: Horizontal, Vertical, Square
- Paper types: Premium Photo Paper, Non-Tearable Paper
- Covers: Hardcover, Softcover
- Laminations: Gloss, Matte
- Cart, order draft, and order management contexts
- Authentication (login/signup) with protected routes
- Razorpay checkout integration
- Order history via dashboard

### Brand Identity
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
| `npm test` | Run the test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint on the source |
| `npm run server` | Start the Node.js API server |

## License

© SNAVYO VISUALS. All rights reserved.
