# Testing Guide

Testing is currently manual and build-based.

## Build test

```bash
npm install
npm run build
```

## Functional checklist

- [ ] App loads without console errors.
- [ ] Camera permission prompt appears.
- [ ] Camera feed renders as ASCII.
- [ ] Matrix mode works.
- [ ] BW mode works.
- [ ] Retro mode works.
- [ ] Color mode works.
- [ ] All character sets work.
- [ ] Brightness changes are visible.
- [ ] Contrast changes are visible.
- [ ] Font size changes are visible.
- [ ] Resolution changes affect sampling.
- [ ] Snapshot downloads a PNG.
- [ ] Audio starts after permitted interaction.
- [ ] Denied camera permission shows a readable error.
- [ ] Hidden tabs stop expensive rendering.
- [ ] Resizing the viewport does not break the canvas.
- [ ] Production build serves correctly.

## Performance checks

Use browser DevTools to verify frame rate remains responsive, memory does not grow continuously, hidden tabs do not keep the renderer busy, and canvas contexts are reused.
