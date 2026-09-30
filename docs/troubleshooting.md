# Troubleshooting

## Camera does not start

- Confirm the browser has camera permission.
- Use HTTPS in production.
- Close other applications that may be using the camera.
- Reload after changing permission settings.

## Black or frozen output

- Check the browser console.
- Confirm the camera stream is active.
- Try increasing font size or lowering resolution.
- Check that hardware acceleration is available.

## Low frame rate

- Increase font size.
- Lower the resolution control.
- Close other heavy browser tabs.
- Test in a current Chromium, Firefox, or Safari release.

The renderer already caps work at 30 FPS and limits sampled dimensions.

## Audio is silent

Some browsers require a user gesture before starting an audio context. Click a control once and retry.

## Snapshot does not download

Check whether the browser blocks downloads or popup-like actions. The snapshot is generated locally with the Canvas API.

## Build failure

```bash
npm install
npm run build
```

If the lockfile is inconsistent, remove node_modules and reinstall from the committed lockfile.

## Deployment failure

Check the build command, output directory, supported Node.js version, and the first failing step in deployment logs.

## Privacy check

The core renderer should not make network requests for camera frames. If browser DevTools shows unexpected frame uploads, investigate the change before deploying.
