# Architecture

## Runtime model

CyberAscii Vision is a static, client-only React application.

```
Browser
├── Camera / MediaDevices
├── Hidden sampling canvas
│   ├── frame capture
│   ├── temporal smoothing
│   └── brightness/contrast processing
├── Visible canvas
│   └── ASCII rendering
└── Web Audio
    └── local feedback effects
```

No application server is required for the core experience.

## Component responsibilities

### App.tsx
Owns global rendering options and composes the HUD, renderer, and controls.

### AsciiCanvas.tsx
Owns camera lifecycle, canvas lifecycle, adaptive sampling, smoothing, rendering, visibility handling, and local snapshot export.

### ControlPanel.tsx
Owns user-facing renderer controls.

### asciiConverter.ts
Contains deterministic brightness-to-character mapping helpers.

### soundEffects.ts
Generates local interface feedback through the Web Audio API.

## Performance boundaries

The renderer has explicit limits:

- 30 FPS maximum
- 220 sampled columns maximum
- 140 sampled rows maximum
- reusable Float32Array smoothing buffer
- cached canvas rendering contexts
- visibility-aware rendering
- ResizeObserver for responsive layout

These limits prevent a large viewport from causing unbounded per-frame work.

## Scaling model

The application scales unusually well for a visual workload because computation is moved to each user's browser.

```
              ┌── Browser A → local camera processing
Vercel CDN ───┼── Browser B → local camera processing
              ├── Browser C → local camera processing
              └── Browser N → local camera processing
```

The hosting layer mainly serves static assets. There is no shared mutable state or per-user processing queue.

## Future expansion

If the project later needs server-backed features, keep them isolated behind a service boundary rather than putting network calls into the render loop. Candidate additions include saved presets, authentication, galleries, telemetry, or optional remote processing.
