# CyberAscii Vision

CyberAscii Vision is a real-time camera-to-ASCII renderer with a cyberpunk terminal interface. Camera frames are processed locally in the browser and rendered to a canvas, with no external AI service or backend dependency.

## What it does

- Real-time webcam-to-ASCII rendering
- Matrix, monochrome, retro amber, and full-color modes
- Multiple character density maps
- Brightness, contrast, font-size, and sampling controls
- Temporal smoothing to reduce visual jitter
- Local PNG snapshot export
- Responsive camera pipeline with adaptive sampling
- Client-only architecture for simple deployment and horizontal scaling
- Cyberpunk HUD, scanlines, and Web Audio effects

## Architecture

```
Camera
  │
  ▼
MediaDevices API
  │
  ▼
Adaptive sampling canvas
  │
  ├── temporal smoothing
  ├── brightness / contrast
  └── ASCII mapping
        │
        ▼
Visible canvas
        │
        └── optional local PNG snapshot
```

The renderer is intentionally client-side. Each visitor processes their own camera feed on their own device, so the deployment does not need a database, session state, GPU server, or request queue.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Canvas API
- MediaDevices API
- Web Audio API
- Lucide React
- Tailwind CSS CDN for the visual layer

## Project structure

```
CyberAscii_Vision/
├── components/
│   ├── AsciiCanvas.tsx
│   └── ControlPanel.tsx
├── utils/
│   ├── asciiConverter.ts
│   └── soundEffects.ts
├── App.tsx
├── index.tsx
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── docs/
    ├── architecture.md
    ├── deployment.md
    ├── development.md
    ├── setup.md
    ├── testing.md
    └── troubleshooting.md
```

## Local setup

Requirements:

- Node.js 18+
- A modern browser with camera support
- HTTPS in production; localhost is suitable for development

```bash
git clone https://github.com/vallabhatech/CyberAscii_Vision.git
cd CyberAscii_Vision
npm install
npm run dev
```

Open the local Vite URL and allow camera access.

### Production build

```bash
npm run build
npm run preview
```

## Rendering and scalability

The renderer deliberately limits expensive work:

- Rendering is capped at 30 FPS.
- Sampling resolution is adaptive and capped to 220 columns × 140 rows.
- ResizeObserver handles layout changes without global resize churn.
- Canvas contexts are created once and reused.
- Rendering pauses while the tab is hidden.
- Temporal smoothing uses a reusable typed-array buffer.
- Vite splits React and icon dependencies into cacheable vendor chunks.

This keeps the application lightweight while allowing many independent users to run it at the same time. Scaling traffic therefore mostly means scaling static asset delivery, which Vercel handles through its edge network.

## Controls

- Font Size — changes the base character density.
- Gain — adjusts brightness.
- Contrast — changes tonal separation.
- Resolution — controls the amount of frame sampling.
- Mode — Matrix, BW, Retro, or Color.
- Charset — Simple, Complex, Binary, or Blocks.
- Snapshot — exports the current ASCII frame as PNG.

## Privacy

Camera frames are processed locally in the browser. The application does not upload camera frames to an external analysis service and does not require an application API key.

Camera access still depends on browser permission and the security policy of the page hosting the application.

## Deployment

The project is a static Vite application and is ready for Vercel, Netlify, GitHub Pages, object storage/CDN hosting, or any static web server.

For Vercel, connect the repository and use:

```
Build command: npm run build
Output directory: dist
```

See docs/deployment.md for deployment and caching details.

## Development

```bash
npm run dev
npm run build
npm run preview
```

Keep the render loop free of network requests and avoid allocating large objects every frame.

## Documentation

- Architecture: docs/architecture.md
- Setup: docs/setup.md
- Development: docs/development.md
- Testing: docs/testing.md
- Deployment: docs/deployment.md
- Troubleshooting: docs/troubleshooting.md

## License

This project is private. All rights reserved.
