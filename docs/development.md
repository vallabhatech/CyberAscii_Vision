# Development Guide

## Principles

1. Keep frame processing local and deterministic.
2. Never put network requests inside the animation loop.
3. Reuse typed arrays, canvas contexts, and other hot-path objects.
4. Put hard limits on work derived from viewport size.
5. Pause expensive work when the tab is hidden.
6. Keep browser permissions explicit and minimal.

## Hot path

The critical path is:

```
video frame → sampled canvas → ImageData → smoothing → ASCII mapping → visible canvas
```

Changes to this path should be tested on both low-power and high-resolution devices.

## Git workflow

Use focused commits with conventional prefixes:

```text
feat:
fix:
perf:
refactor:
docs:
chore:
```

Examples:

```text
perf: reduce per-frame canvas allocations
docs: update deployment guide
fix: handle denied camera permissions
```

## Before pushing

```bash
npm run build
```

Check the browser manually for camera permission behavior, frame stability, control changes, snapshot export, and responsive layout.
