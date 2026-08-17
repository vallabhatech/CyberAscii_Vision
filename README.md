# CyberAscii Vision

<div align="center">
  <img width="1200" height="475" alt="CyberAscii Vision Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A real-time camera-to-ASCII art converter with AI-powered scene analysis, featuring a cyberpunk security AI theme. Transform your webcam feed into dynamic ASCII art with multiple visual modes and analyze captured scenes using Google's Gemini AI.

## Features

- **Real-time ASCII Conversion**: Live webcam feed converted to ASCII art with smooth temporal smoothing
- **Multiple Visual Modes**: Matrix green, black & white, retro amber, and full color modes
- **Character Density Options**: Simple, complex, binary, and block character sets
- **Adjustable Parameters**: Font size, brightness, and contrast controls
- **AI-Powered Analysis**: Capture and analyze scenes using Google Gemini AI with cyberpunk-themed responses
- **Immersive Audio**: Sci-fi sound effects using Web Audio API (startup hum, scan sounds, analysis feedback)
- **Screenshot Functionality**: Save ASCII art captures as PNG images
- **Responsive Design**: Cyberpunk-themed UI with scanlines and animated elements
- **Performance Optimized**: Canvas-based rendering with temporal smoothing to reduce ASCII jitter

## Tech Stack

- **Frontend**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google GenAI SDK (@google/genai 1.40.0)
- **Icons**: Lucide React
- **Fonts**: JetBrains Mono, Share Tech Mono
- **Audio**: Web Audio API (native browser API)
- **Graphics**: Canvas API (native browser API)
- **Camera**: MediaDevices API (native browser API)

## Architecture Overview

CyberAscii Vision is a frontend-only React application that processes webcam video in real-time:

1. **Camera Access**: Uses MediaDevices API to capture webcam video
2. **Frame Processing**: Converts video frames to ASCII using canvas pixel manipulation
3. **Temporal Smoothing**: Applies low-pass filtering to reduce ASCII character flickering
4. **Rendering**: Draws ASCII characters to canvas with configurable styling
5. **AI Analysis**: Captures canvas snapshots and sends to Gemini API for scene analysis
6. **Audio Feedback**: Uses Web Audio API for immersive sci-fi sound effects

The application consists of three main components:
- `AsciiCanvas`: Handles camera capture, frame processing, and ASCII rendering
- `ControlPanel`: Provides UI controls for visual parameters
- `AnalysisModal`: Displays AI analysis results with cyberpunk theming

## Project Structure

```
CyberAscii_Vision/
├── components/
│   ├── AnalysisModal.tsx    # AI results display modal
│   ├── AsciiCanvas.tsx     # Main camera capture and ASCII rendering
│   └── ControlPanel.tsx     # UI controls for visual parameters
├── services/
│   └── geminiService.ts     # Google Gemini AI integration
├── utils/
│   ├── asciiConverter.ts    # ASCII character conversion logic
│   └── soundEffects.ts      # Web Audio API sound effects
├── App.tsx                  # Main application component
├── index.tsx                # React entry point
├── index.html               # HTML template with Tailwind CDN
├── types.ts                 # TypeScript type definitions
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── metadata.json            # App metadata and permissions
```

## Prerequisites

- **Node.js**: Version 18 or higher (for running the development server)
- **Google Gemini API Key**: Required for AI analysis features
- **Modern Browser**: Chrome, Firefox, Safari, or Edge with:
  - Camera permissions
  - Web Audio API support
  - Canvas API support

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CyberAscii_Vision
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   To get a Gemini API key:
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a project and generate an API key
   - Add the key to your `.env.local` file

## Local Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to `http://localhost:3000`

3. **Allow camera permissions**:
   The browser will request camera access - allow it to enable the ASCII feed

4. **Development workflow**:
   - The server runs on port 3000 by default
   - Hot module replacement is enabled for rapid development
   - Changes to TypeScript files will auto-reload

## Running the Application

### Development Mode
```bash
npm run dev
```
- Runs Vite development server on `http://localhost:3000`
- Enables hot module replacement
- Provides detailed error messages

### Production Build
```bash
npm run build
```
- Creates optimized production build in `dist/` directory
- Minifies JavaScript and CSS
- Optimizes assets for deployment

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing production builds before deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes (for AI features) |

**Note**: The AI analysis feature will not work without a valid Gemini API key. The ASCII conversion and visual effects will still function without it.

## Usage Guide

### Basic Controls

1. **Visual Controls** (bottom panel):
   - **Font Size**: Adjust ASCII character size (6-24px)
   - **Gain**: Control brightness (0.5-2.0)
   - **Contrast**: Adjust contrast (0.5-3.0)
   - **Mode**: Switch between color modes (matrix, bw, retro, color)
   - **Charset**: Change character density sets (simple, complex, binary, blocks)

2. **Capture Buttons** (floating):
   - **Camera Icon**: Save current ASCII frame as PNG screenshot
   - **Scan Eye Icon**: Capture and analyze current scene with AI

### Color Modes

- **Matrix**: Classic green-on-black Matrix style
- **BW**: Black and white high-contrast mode
- **Retro**: Amber monochrome (retro terminal style)
- **Color**: Full color preserving original colors

### Character Sets

- **Simple**: Basic ASCII characters ` .:-=+*#%@`
- **Complex**: Smooth density characters ` .^!*<&%$#@`
- **Binary**: Binary digits `01`
- **Blocks**: Unicode block characters ` ░▒▓█`

## API Integration

The application uses Google's Gemini AI for scene analysis:

- **Model**: `gemini-3-flash-preview`
- **Input**: Base64-encoded image from ASCII canvas
- **Output**: JSON response with description, threat level, and tags
- **Theme**: Cyberpunk security AI persona

**Response Schema**:
```typescript
{
  description: string;    // Robotic analysis of the subject
  threatLevel: string;    // LOW, MODERATE, CRITICAL, or UNKNOWN
  tags: string[];         // 3-5 identifying keywords
}
```

## Performance Considerations

- **Temporal Smoothing**: Uses 0.75 inertia factor for smooth ASCII transitions
- **Canvas Optimization**: Dual-canvas approach (hidden processing, visible rendering)
- **Resolution**: Adjustable via font size control
- **Audio**: Web Audio API with efficient oscillator management

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (may require user interaction for audio)
- **Mobile**: Limited support (camera permissions vary)

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted
- Check if another application is using the camera
- Try refreshing the page and re-granting permissions
- Verify browser supports MediaDevices API

### Audio Not Playing
- Some browsers require user interaction before playing audio
- Click anywhere on the page to enable audio context
- Check browser audio permissions
- Ensure Web Audio API is supported

### AI Analysis Failing
- Verify `GEMINI_API_KEY` is set in `.env.local`
- Check your API key has valid credits/quota
- Ensure network connectivity to Google's servers
- Check browser console for specific error messages

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is 18 or higher
- Check TypeScript version compatibility

## Security Considerations

- **API Keys**: Never commit `.env.local` or API keys to version control
- **Camera Data**: All processing is client-side; no video data is sent to external servers except for AI analysis
- **AI Requests**: Only base64 image data is sent to Gemini API; no personal data is transmitted
- **HTTPS**: Recommended for production deployment to ensure secure camera access

## Known Limitations

- **No Database**: Application is stateless; no persistent storage
- **No Authentication**: No user authentication system
- **Browser Dependent**: Requires modern browser with Canvas/Web Audio support
- **API Rate Limits**: Gemini API has usage quotas and rate limits
- **Single Camera**: Supports only one camera at a time
- **No Video Recording**: Cannot record video; only screenshots

## Future Improvements

Potential enhancements for future versions:
- Video recording capability
- Multiple camera support
- Custom character set editor
- Export to different formats (SVG, text)
- Offline AI analysis with local models
- Preset management system
- Advanced image filters
- Mobile app version

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes with clear messages
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Development Guidelines**:
- Follow existing code style and patterns
- Use TypeScript for all new code
- Add comments for complex logic
- Test camera and audio functionality
- Ensure cyberpunk theme consistency

## License

This project is private. All rights reserved.

## Links

- **AI Studio View**: [View in AI Studio](https://ai.studio/apps/drive/1SCMa-GxrevMhNTMLgp9C_R_J6ExzhCC3)
- **Google AI Studio**: [https://ai.google.dev/](https://ai.google.dev/)
- **Vite Documentation**: [https://vitejs.dev/](https://vitejs.dev/)
- **React Documentation**: [https://react.dev/](https://react.dev/)

## Documentation

For detailed documentation, see the `/docs` directory:

- **[Architecture Documentation](docs/architecture.md)**: High-level architecture, component breakdown, data flow diagrams, and technology stack details
- **[Setup Guide](docs/setup.md)**: Detailed installation instructions, environment setup, and troubleshooting installation issues
- **[API Documentation](docs/api.md)**: Google Gemini API integration details, authentication, request/response schemas, and security considerations
- **[Development Guide](docs/development.md)**: Development workflow, coding standards, component development patterns, and Git workflow
- **[Testing Guide](docs/testing.md)**: Manual testing procedures, test cases, browser compatibility testing, and performance testing
- **[Deployment Guide](docs/deployment.md)**: Deployment instructions for Vercel, Netlify, GitHub Pages, AWS S3, Firebase, and Docker
- **[Troubleshooting Guide](docs/troubleshooting.md)**: Comprehensive troubleshooting for camera, visual, audio, AI analysis, performance, and deployment issues

## Support

For issues or questions:
- Check the [troubleshooting guide](docs/troubleshooting.md) for detailed solutions
- Review browser console for error messages
- Verify environment variables are correctly set
- Ensure all dependencies are properly installed

---

Built with React, Vite, and Google Gemini AI. Cyberpunk theme inspired by classic sci-fi interfaces.
