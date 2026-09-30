# Setup

## Requirements

- Node.js 18 or newer
- npm
- Modern Chromium, Firefox, or Safari browser
- Camera permission for local development

## Install

```bash
git clone https://github.com/vallabhatech/CyberAscii_Vision.git
cd CyberAscii_Vision
npm install
```

## Development

```bash
npm run dev
```

Open the Vite URL printed in the terminal and allow camera access.

## Production verification

```bash
npm run build
npm run preview
```

Verify:

- camera starts
- ASCII output renders
- controls change the renderer
- audio feedback works after user interaction
- PNG snapshot downloads
- no console errors appear

## Environment variables

No application API key is required.

Do not add camera data, credentials, or local environment files to Git.

## Troubleshooting setup

If dependencies become inconsistent:

```text
Windows CMD:
rmdir /s /q node_modules
npm install
npm run build

PowerShell:
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```
