# AGENTS.md — Agent Onboarding & Project Handoff Guide

## 1. Project Overview & Vision
**MotionSVG** is a zero-dependency, client-side studio web application that allows users to upload image decks (PNG, JPG, WebP, SVG, GIF) and compile them into a **pure, self-contained, CSS-animated SVG card stack carousel**.

### Core Goal
The output SVG file must animate seamlessly in a continuous loop using **pure CSS `@keyframes` animations embedded inside the SVG `<style>` tag**. No JavaScript is required for playback inside the exported SVG file, making it compatible with GitHub markdown, static sites, email templates, and design tools.

---

## 2. Technology Stack & Environment
- **Architecture:** 100% Vanilla Client-Side Web Application (No npm packages, build tools, or transpilers required).
- **Core Files:**
  - [`index.html`](file:///d:/Carousel/index.html): UI shell, controls panel, live preview viewport, and code output tabs.
  - [`style.css`](file:///d:/Carousel/style.css): Design system tokens, Glassmorphism UI, light/dark themes, and layout rules.
  - [`app.js`](file:///d:/Carousel/app.js): Application state, event listeners, image reader, dynamic SVG compiler, and export format generators.
- **Typography:** Google Fonts (`Outfit`, `Plus Jakarta Sans`).
- **Icons:** Inline SVGs.
- **State Storage:** `localStorage` (`theme` preference and `motionsvg_settings`).

---

## 3. Directory Structure & Workspace Rules

```
Carousel/
├── AGENTS.md         # Repository guide for AI agents
├── index.html        # Main Studio application HTML
├── style.css         # Main application stylesheet & theme tokens
└── app.js            # Main application logic & SVG generation engine
```

> [!IMPORTANT]
> **Workspace Boundary Rule:** Active development must occur **exclusively in the root directory** (`index.html`, `style.css`, `app.js`).

---

## 4. Architecture & Key Data Models

### Data Models in [`app.js`](file:///d:/Carousel/app.js)
1. **`cards` (Array of Objects):**
   ```javascript
   {
     id: string,       // Unique card ID ('card_170000000_abc12')
     name: string,     // Original filename
     type: string,     // MIME type ('image/png', 'image/svg+xml')
     size: string,     // Human-readable size ('120.5 KB')
     dataUrl: string   // Base64 encoded Data URL of image content
   }
   ```
2. **`settings` & `FACTORY_SETTINGS` (Object):**
   Holds layout, dimension, offset, opacity, timing, and animation parameters (e.g. `aspectRatio`, `cardWidth`, `cardHeight`, `borderRadius`, `cardShadow`, `stackOffset`, `scaleStep`, `stackDirection`, `maxVisibleCards`, `bgCardOpacity`, `loopDuration`, `transitionRatio`, `slideDirection`, `slideInDirection`, `timingEasing`).

### Key Functions Reference Map
- **[`init()`](file:///d:/Carousel/app.js#L82):** Loads saved settings & theme from `localStorage`, binds DOM events.
- **[`processFiles(fileList)`](file:///d:/Carousel/app.js#L431):** Ingests image files, converts them to base64 Data URIs, updates `cards` array.
- **[`renderCardList()`](file:///d:/Carousel/app.js#L484):** Renders the sidebar manager list for reordering/deleting card items.
- **[`updateCarousel()`](file:///d:/Carousel/app.js#L540):** **Core Dynamic SVG Compiler Engine**
  - Calculates keyframe percentage intervals based on card count `N`.
  - Computes card depth transforms via [`getStateProps(S)`](file:///d:/Carousel/app.js#L582).
  - Computes entry/exit movement vectors via [`getSlideOutTransform()`](file:///d:/Carousel/app.js#L603) and [`getSlideInStartTransform()`](file:///d:/Carousel/app.js#L614).
  - Builds the final animated SVG XML payload and populates live preview + export code blocks (SVG, HTML wrapper, React component).
- **[`downloadSVG()`](file:///d:/Carousel/app.js#L958):** Triggers file download of the generated SVG.

---

## 5. Local Development & Verification Workflow

### 1. Launching Local Server
Serve the project root with any static web server:
- PowerShell / Command Prompt: `npx serve .` or `python -m http.server 8000`

### 2. Manual Verification Checklist
When implementing features or bug fixes, perform the following verification steps:
1. Open the application in a browser.
2. Click **"Load Demo Samples"** or drag & drop 2+ images.
3. Test adjusting layout parameters (Aspect Ratio, Stack Offset, Border Radius) and confirm live stage updates.
4. Test animation parameters (Loop Duration, Slide Direction, Easing) and ensure CSS animation updates without console errors.
5. Click **"Copy SVG"** or **"Download SVG"** and open the output `.svg` in a new browser tab to verify self-contained playback.
6. Toggle Dark / Light theme to ensure all UI elements maintain proper contrast.

---

## 6. Project Roadmap & Suggested Future Tasks

If taking over development, the following high-priority features and enhancements are recommended:

1. **Client-Side Image Optimization:**
   - Compress and downscale uploaded raster images on a `<canvas>` before embedding into base64 Data URIs to reduce exported SVG filesize.
2. **Interactive SVG Controls:**
   - Implement pure CSS `:focus` / pseudo-radio button interactive step navigation embedded inside the SVG markup (allowing manual next/prev card clicking).
3. **Module Refactoring:**
   - Modularize [`app.js`](file:///d:/Carousel/app.js) into clean ES modules (`state.js`, `svg-compiler.js`, `ui-controller.js`, `exporters.js`).
4. **Media Exporters:**
   - Add Canvas MediaRecorder support to export the carousel animation to WebM / GIF formats directly in-browser.
