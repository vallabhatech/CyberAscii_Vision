# Change Log

This file records the repository history visible from GitHub and the modernization work performed on 2026-09-30.

## Historical commits

| Commit | Date | Summary |
|---|---|---|
| 3f46550d | 2026-08-17 | Finalized and verified project documentation. |
| 38265cf7 | 2026-08-17 | Added development, testing, deployment, and troubleshooting documentation. |
| a166428a | 2026-08-17 | Added architecture and setup documentation. |
| 8df18b1e | 2026-08-17 | Created the comprehensive project README. |
| 8a186bede | 2026-04-22 | Removed environment configuration from tracking. |
| d9dc5685 | 2026-04-22 | Consolidated the project into a clean commit. |

## 2026-09-30 modernization

### 4a1fe1d9 — refactor: remove external AI integration and clean runtime surface
- Removed the external generative-AI dependency.
- Removed the AI analysis service and analysis modal.
- Removed external AI configuration from Vite.
- Removed the import map and external AI module reference.
- Updated project metadata and runtime status messaging.

### 0c7b534f — perf: cap render work and make camera pipeline adaptive
- Added a 30 FPS render cap.
- Added adaptive sampling with explicit upper bounds.
- Reused canvas contexts and smoothing buffers.
- Switched resizing to ResizeObserver.
- Paused rendering while the browser tab is hidden.
- Improved camera constraints and cleanup.

### 5440910c — chore: harden deployment and refresh project documentation
- Reworked documentation around the client-only architecture.
- Added Vercel cache/security headers.
- Added GitHub Actions build verification.
- Added this repository change log.
