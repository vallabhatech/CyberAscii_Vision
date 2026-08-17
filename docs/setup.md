# Setup Guide

This guide provides detailed instructions for setting up the CyberAscii Vision development environment.

## Prerequisites

### Required Software

- **Node.js**: Version 18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  - Verify npm: `npm --version`

- **Git**: For cloning the repository (optional if downloading ZIP)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Required Accounts

- **Google AI Account**: For Gemini API access
  - Visit [Google AI Studio](https://ai.google.dev/)
  - Sign in with Google account
  - Create API key in the API keys section

### Browser Requirements

- Modern browser with support for:
  - MediaDevices API (camera access)
  - Canvas API (graphics rendering)
  - Web Audio API (sound generation)
  - ES2022 JavaScript features

**Recommended Browsers**:
- Chrome/Edge (latest version)
- Firefox (latest version)
- Safari (latest version)

## Installation Steps

### 1. Clone or Download Repository

**Option A: Clone with Git**
```bash
git clone <repository-url>
cd CyberAscii_Vision
```

**Option B: Download ZIP**
1. Download repository as ZIP
2. Extract to desired location
3. Navigate to extracted directory

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- react and react-dom (UI framework)
- @google/genai (AI SDK)
- lucide-react (icons)
- @vitejs/plugin-react (Vite plugin)
- typescript (TypeScript compiler)
- vite (build tool)

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
GEMINI_API_KEY=your_actual_api_key_here
```

**Getting a Gemini API Key**:

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the generated key
6. Paste it into your `.env.local` file

**Important Security Notes**:
- Never commit `.env.local` to version control
- Never share your API key publicly
- The `.gitignore` file already excludes `.env.local`
- Consider using environment-specific variables for production

### 4. Verify Installation

Run the development server to verify everything is set up correctly:

```bash
npm run dev
```

Expected output:
```
  VITE v6.2.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Open `http://localhost:3000` in your browser and verify:
- The application loads without errors
- Camera permissions are requested
- ASCII feed displays when camera is allowed
- Controls are visible and functional

## Development Setup

### Recommended VS Code Extensions

For the best development experience, install these VS Code extensions:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript Importer**: Auto-import TypeScript modules
- **Tailwind CSS IntelliSense**: Tailwind CSS autocompletion
- **GitLens**: Git integration
- **Thunder Client**: API testing (if testing Gemini API directly)

### IDE Configuration

**TypeScript Configuration** (`tsconfig.json`):
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Path aliases: `@/*` maps to project root

**Vite Configuration** (`vite.config.ts`):
- Development server: port 3000, host 0.0.0.0
- React plugin enabled
- Environment variable handling
- Path resolution for `@` alias

## Troubleshooting Installation Issues

### Node.js Version Issues

**Problem**: Version too old
```bash
# Check current version
node --version

# If version < 18, upgrade using nvm (Node Version Manager)
nvm install 18
nvm use 18
```

### Dependency Installation Failures

**Problem**: `npm install` fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Permission Issues (Windows)

**Problem**: Permission denied during installation
```bash
# Run PowerShell as Administrator
# Or configure npm to use a different directory
npm config set prefix %APPDATA%\npm
```

### Environment Variable Issues

**Problem**: API key not working
- Verify `.env.local` file exists in project root
- Check for typos in variable name (`GEMINI_API_KEY`)
- Ensure no extra spaces around the key
- Restart development server after adding `.env.local`
- Check browser console for API errors

### Camera Access Issues

**Problem**: Camera not working
- Ensure browser has camera permissions
- Check if another application is using the camera
- Try HTTPS if running locally (some browsers require HTTPS for camera)
- Test camera on [WebRTC Samples](https://webrtc.github.io/samples/)

### Port Already in Use

**Problem**: Port 3000 already in use
```bash
# Option 1: Kill process using port 3000
npx kill-port 3000

# Option 2: Use different port (modify vite.config.ts)
# Change port in server configuration
```

## Production Build Setup

### Building for Production

```bash
npm run build
```

This creates an optimized `dist/` directory containing:
- Minified JavaScript
- Optimized CSS
- Bundled dependencies
- Production-ready assets

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

### Environment Variables in Production

For production builds, set environment variables before building:

```bash
# Linux/Mac
export GEMINI_API_KEY=your_production_key
npm run build

# Windows PowerShell
$env:GEMINI_API_KEY="your_production_key"
npm run build

# Windows CMD
set GEMINI_API_KEY=your_production_key
npm run build
```

## Docker Setup (Optional)

If you prefer using Docker for development:

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  cyberascii:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - .:/app
      - /app/node_modules
```

### Running with Docker

```bash
# Build and start
docker-compose up

# Stop
docker-compose down
```

## CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    
    - name: Deploy
      run: # Add your deployment commands here
```

## Verification Checklist

After completing setup, verify:

- [ ] Node.js version is 18 or higher
- [ ] Dependencies installed successfully
- [ ] `.env.local` file created with API key
- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Camera permissions work
- [ ] ASCII feed displays correctly
- [ ] Controls are functional
- [ ] Audio effects play
- [ ] AI analysis works (with valid API key)
- [ ] Production build creates successfully
- [ ] No console errors in browser

## Next Steps

After successful setup:

1. **Explore the codebase**: Read through component files
2. **Customize parameters**: Adjust default options in `App.tsx`
3. **Add new features**: Implement additional visual modes or controls
4. **Test deployment**: Try deploying to a static hosting service
5. **Contribute**: Follow contributing guidelines in README.md

## Support Resources

- **Vite Documentation**: [https://vitejs.dev/](https://vitejs.dev/)
- **React Documentation**: [https://react.dev/](https://react.dev/)
- **TypeScript Documentation**: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
- **Google AI Documentation**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Web Audio API**: [https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Canvas API**: [https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
