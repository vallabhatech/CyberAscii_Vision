# Deployment

CyberAscii Vision builds to static files and can be deployed directly to Vercel.

## Vercel

Recommended project settings:

```
Framework: Vite
Build command: npm run build
Output directory: dist
Install command: npm install
```

Every push to the connected Git branch can produce a deployment. The repository also includes vercel.json with cache and security headers.

### Production checklist

- HTTPS is enabled.
- Camera permission is allowed for the deployed origin.
- npm run build succeeds.
- No API keys are required.
- Browser console has no runtime errors.
- Snapshot export works.
- Camera permission failure shows a useful UI message.

## Static hosting

The generated dist/ directory can be served by any static web server.

```bash
npm run build
```

Upload the contents of dist/ to your static host.

## CDN and caching

Hashed Vite assets can be cached aggressively because their filenames change when their contents change. index.html remains short-lived so new deployments become visible quickly.

## CI

The repository uses GitHub Actions to verify installation and production builds on pushes and pull requests.

The CI workflow does not require application secrets.
