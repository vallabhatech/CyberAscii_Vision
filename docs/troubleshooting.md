# Troubleshooting Guide

This guide helps diagnose and resolve common issues with CyberAscii Vision.

## Quick Diagnosis

### Issue Categories

1. **Camera/Video Issues** - Problems with webcam access and display
2. **Visual/Rendering Issues** - Problems with ASCII conversion and display
3. **Audio Issues** - Problems with sound effects
4. **AI Analysis Issues** - Problems with Gemini API integration
5. **Performance Issues** - Slow performance or high resource usage
6. **Build/Deployment Issues** - Problems with building or deploying
7. **Browser Compatibility** - Issues specific to certain browsers

## Camera/Video Issues

### Camera Not Working

**Symptoms**:
- Error message about camera access
- Black screen instead of ASCII feed
- Permission denied errors

**Solutions**:

1. **Check Browser Permissions**:
   - Click the lock/icon in the address bar
   - Ensure camera permission is allowed
   - Refresh the page after granting permission

2. **Check Camera Availability**:
   - Verify camera works in other applications
   - Check if another app is using the camera
   - Try closing other camera applications

3. **Browser-Specific Fixes**:
   ```bash
   # Chrome/Edge: Check site settings
   # Settings → Privacy and security → Site Settings → Camera
   
   # Firefox: Check permissions
   # Options → Privacy & Security → Permissions → Camera
   
   # Safari: Check preferences
   # Safari → Preferences → Websites → Camera
   ```

4. **HTTPS Requirement**:
   - Some browsers require HTTPS for camera access
   - Use `localhost` for development (HTTP allowed)
   - Use HTTPS for production deployments

5. **Test Camera API**:
   - Visit [WebRTC Samples](https://webrtc.github.io/samples/)
   - Test camera functionality on that site
   - If it fails there, it's a system/browser issue

### Camera Shows Black Screen

**Symptoms**:
- Camera permission granted but screen is black
- No error messages displayed

**Solutions**:

1. **Check Video Element**:
   - Open browser DevTools
   - Inspect the hidden video element
   - Verify it has a srcObject

2. **Camera Initialization**:
   - Refresh the page
   - Allow camera permissions again
   - Check browser console for errors

3. **Driver Issues**:
   - Update camera drivers
   - Check if camera is properly connected
   - Try a different USB port

4. **Multiple Cameras**:
   - If you have multiple cameras, the browser might select the wrong one
   - Check browser settings to select correct camera

### Camera Feed Laggy or Delayed

**Symptoms**:
- Significant delay between movement and display
- Low frame rate

**Solutions**:

1. **Reduce Processing Resolution**:
   - Increase font size in control panel
   - This reduces the number of characters to process

2. **Check System Resources**:
   - Close other applications
   - Check CPU usage
   - Ensure sufficient RAM available

3. **Browser Performance**:
   - Try a different browser
   - Disable browser extensions
   - Clear browser cache

## Visual/Rendering Issues

### ASCII Not Displaying Correctly

**Symptoms**:
- Garbled characters
- Wrong characters for brightness levels
- Characters not aligned properly

**Solutions**:

1. **Check Font Loading**:
   - Ensure JetBrains Mono font is loaded
   - Check browser DevTools Network tab
   - Verify font files are accessible

2. **Character Set Issues**:
   - Try different character density options
   - Switch between simple, complex, binary, blocks
   - Check if issue persists across all modes

3. **Canvas Size**:
   - Resize browser window
   - Check if canvas dimensions are correct
   - Look for console errors about canvas

### Colors Not Appearing Correctly

**Symptoms**:
- Wrong colors in color mode
- Matrix mode not green
- Color mode not showing colors

**Solutions**:

1. **Check Color Mode**:
   - Verify correct mode is selected
   - Try switching to different modes
   - Check if issue is mode-specific

2. **Browser Color Profile**:
   - Check browser color settings
   - Try different browser
   - Check monitor color settings

3. **CSS Issues**:
   - Inspect elements in DevTools
   - Check applied CSS colors
   - Verify Tailwind classes are correct

### Scanlines Not Visible

**Symptoms**:
- Missing scanline effect
- Overlay not appearing

**Solutions**:

1. **Check CSS**:
   - Inspect the scanline overlay div
   - Verify CSS is applied correctly
   - Check opacity settings

2. **Z-Index Issues**:
   - Check if other elements cover the overlay
   - Verify z-index of scanline element
   - Ensure pointer-events-none is set

## Audio Issues

### No Sound Playing

**Symptoms**:
- Complete silence
- No startup sound
- No button sounds

**Solutions**:

1. **Browser Audio Policy**:
   - Click anywhere on the page to enable audio
   - Some browsers require user interaction first
   - Check browser audio permissions

2. **Audio Context State**:
   - Open browser console
   - Check for audio context errors
   - Look for "AudioContext was not allowed to start" messages

3. **Volume Settings**:
   - Check system volume
   - Check browser volume
   - Check if muted in system settings

4. **Browser-Specific**:
   ```bash
   # Chrome: Check site settings for audio
   # Firefox: Check autoplay permissions
   # Safari: Check audio permissions in preferences
   ```

### Audio Distorted or Poor Quality

**Symptoms**:
- Crackling sounds
- Poor audio quality
- Inconsistent volume

**Solutions**:

1. **System Audio**:
   - Check system audio settings
   - Update audio drivers
   - Try different audio output device

2. **Browser Audio**:
   - Try different browser
   - Clear browser cache
   - Disable audio-related extensions

3. **Performance Issues**:
   - High CPU usage can affect audio
   - Close other applications
   - Check system resources

### Audio Not Stopping

**Symptoms**:
- Ambient hum continues after closing app
- Sounds overlap or don't stop

**Solutions**:

1. **Page Refresh**:
   - Refresh the page to stop all audio
   - This clears the audio context

2. **Browser Tab**:
   - Close the tab completely
   - Open new tab

3. **System Check**:
   - Check if other tabs are playing audio
   - Check system audio mixer

## AI Analysis Issues

### AI Analysis Not Working

**Symptoms**:
- Analysis always returns error
- Loading state never completes
- "Neural link connection failed" message

**Solutions**:

1. **API Key Verification**:
   ```bash
   # Check .env.local file exists
   ls -la .env.local
   
   # Verify API key format
   cat .env.local
   ```

2. **API Key Validity**:
   - Check if API key is valid in Google Cloud Console
   - Verify key hasn't been revoked
   - Check if key has quota available

3. **Network Connectivity**:
   - Check internet connection
   - Verify can reach Google's servers
   - Check for firewall/proxy issues

4. **Environment Variables**:
   - Restart development server after adding API key
   - Verify Vite is loading the variable
   - Check browser console for API key errors

### Slow AI Response

**Symptoms**:
- Analysis takes very long time
- Loading animation continues for extended period

**Solutions**:

1. **Network Speed**:
   - Check internet connection speed
   - Try again during off-peak hours
   - Check if Google services are slow

2. **Image Size**:
   - Larger images take longer to process
   - Consider reducing canvas resolution
   - Check if base64 string is very large

3. **API Rate Limits**:
   - Check if you've hit rate limits
   - Wait before trying again
   - Monitor API usage in Google Cloud Console

### Unexpected AI Responses

**Symptoms**:
- Responses don't match expected format
- Threat levels seem incorrect
- Tags are irrelevant

**Solutions**:

1. **Prompt Issues**:
   - Check prompt in `geminiService.ts`
   - Verify prompt is correctly formatted
   - Test prompt in Google AI Studio playground

2. **Response Parsing**:
   - Check if JSON parsing is working
   - Look for parsing errors in console
   - Verify response schema matches expectations

3. **Model Behavior**:
   - AI responses can vary
   - This is expected behavior
   - Consider refining the prompt

## Performance Issues

### Low Frame Rate

**Symptoms**:
- Choppy animation
- Frame rate below 30fps
- Laggy UI response

**Solutions**:

1. **Reduce Processing Load**:
   - Increase font size (fewer characters to process)
   - Reduce canvas resolution
   - Close other browser tabs

2. **System Resources**:
   - Check CPU usage
   - Close other applications
   - Ensure sufficient RAM

3. **Browser Optimization**:
   - Try different browser
   - Disable browser extensions
   - Clear browser cache
   - Enable hardware acceleration

4. **Code Optimization**:
   - Check for expensive operations in render loop
   - Optimize canvas operations
   - Reduce temporal smoothing if needed

### High Memory Usage

**Symptoms**:
- Browser using excessive memory
- Memory usage increases over time
- Browser becomes sluggish

**Solutions**:

1. **Memory Leaks**:
   - Refresh the page
   - Check for unclosed event listeners
   - Verify proper cleanup in useEffect

2. **Canvas Memory**:
   - Check if canvas size is too large
   - Verify frame buffers are properly cleaned up
   - Look for memory leaks in pixel processing

3. **Browser Memory**:
   - Try different browser
   - Clear browser cache
   - Restart browser

### High CPU Usage

**Symptoms**:
- Fan running loudly
- CPU usage near 100%
- System becomes unresponsive

**Solutions**:

1. **Reduce Processing**:
   - Increase font size
   - Lower temporal smoothing
   - Reduce frame rate (if possible)

2. **System Check**:
   - Close other applications
   - Check for background processes
   - Monitor CPU usage

3. **Browser Check**:
   - Try different browser
   - Disable extensions
   - Check for malicious processes

## Build/Deployment Issues

### Build Fails

**Symptoms**:
- `npm run build` command fails
- TypeScript errors during build
- Dependency resolution errors

**Solutions**:

1. **Clear Dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **TypeScript Errors**:
   - Check TypeScript version compatibility
   - Review tsconfig.json settings
   - Fix type errors in source code

3. **Dependency Issues**:
   ```bash
   npm outdated
   npm update
   npm run build
   ```

4. **Environment Variables**:
   - Verify .env.local exists
   - Check environment variable names
   - Restart development server

### Production Build Not Working

**Symptoms**:
- Build succeeds but app doesn't work in production
- Different behavior between dev and production
- Assets not loading

**Solutions**:

1. **Path Issues**:
   - Check base path in vite.config.ts
   - Verify asset paths are correct
   - Check for absolute vs relative paths

2. **Environment Variables**:
   - Verify API key is set for production
   - Check build-time variable injection
   - Ensure variables are available in production

3. **Asset Loading**:
   - Check if assets are included in build
   - Verify asset paths in dist/ directory
   - Check CDN configuration

### Deployment Errors

**Symptoms**:
- Deployment fails on platform
- Build succeeds but deployment fails
- Errors in deployment logs

**Solutions**:

1. **Platform-Specific**:
   - Check platform documentation
   - Review deployment logs
   - Verify platform configuration

2. **Build Output**:
   - Test production build locally: `npm run preview`
   - Verify dist/ directory contents
   - Check for missing files

3. **Configuration**:
   - Verify platform configuration files
   - Check environment variable settings
   - Review build commands

## Browser Compatibility Issues

### Chrome/Edge Specific Issues

**Symptoms**:
- Issues only in Chrome or Edge
- Different behavior than other browsers

**Solutions**:

1. **Update Browser**:
   - Ensure latest version
   - Check for known issues
   - Try Chrome beta/Canary

2. **Flags**:
   - Check experimental flags
   - Reset browser flags to default
   - Disable problematic flags

3. **Extensions**:
   - Disable all extensions
   - Test in incognito mode
   - Enable extensions one by one

### Firefox Specific Issues

**Symptoms**:
- Issues only in Firefox
- Different behavior than other browsers

**Solutions**:

1. **Update Firefox**:
   - Ensure latest version
   - Check for known issues
   - Try Firefox Nightly

2. **Configuration**:
   - Check about:config settings
   - Reset Firefox preferences
   - Try new profile

3. **Extensions**:
   - Disable all extensions
   - Test in private browsing
   - Enable extensions one by one

### Safari Specific Issues

**Symptoms**:
- Issues only in Safari
- Audio not working
- Camera not working

**Solutions**:

1. **Safari Preferences**:
   - Check camera permissions
   - Check audio permissions
   - Enable autoplay if needed

2. **Update Safari**:
   - Ensure latest macOS version
   - Update Safari
   - Check for known issues

3. **Safari Technology Preview**:
   - Test in Safari Technology Preview
   - Check if issue is fixed in newer version

## Development Environment Issues

### Node.js Version Issues

**Symptoms**:
- Version mismatch errors
- Dependency installation fails
- Build commands not working

**Solutions**:

1. **Check Version**:
   ```bash
   node --version
   npm --version
   ```

2. **Install Correct Version**:
   ```bash
   # Using nvm (Node Version Manager)
   nvm install 18
   nvm use 18
   ```

3. **Clear Cache**:
   ```bash
   npm cache clean --force
   ```

### Port Already in Use

**Symptoms**:
- "Port 3000 is already in use" error
- Development server won't start

**Solutions**:

1. **Kill Process**:
   ```bash
   # Find process using port 3000
   npx lsof -i :3000
   
   # Kill process
   npx kill-port 3000
   ```

2. **Use Different Port**:
   ```typescript
   // In vite.config.ts
   export default defineConfig({
     server: {
       port: 3001, // Use different port
     }
   });
   ```

3. **Restart Server**:
   - Stop current server (Ctrl+C)
   - Start again

### Hot Module Replacement Not Working

**Symptoms**:
- Changes not reflecting without refresh
- HMR errors in console
- Slow updates

**Solutions**:

1. **Restart Dev Server**:
   - Stop server (Ctrl+C)
   - Start again: `npm run dev`

2. **Clear Cache**:
   - Clear browser cache
   - Clear Vite cache
   - Restart browser

3. **Check File Watchers**:
   - Verify file watcher limits
   - Check for file system issues
   - Try on different OS if possible

## Getting Help

### Diagnostic Information

When reporting issues, collect this information:

1. **System Information**:
   - OS and version
   - Browser and version
   - Node.js version
   - Camera model (if known)

2. **Error Messages**:
   - Browser console errors
   - Terminal errors
   - Network errors

3. **Steps to Reproduce**:
   - Exact steps taken
   - Expected vs actual behavior
   - When issue occurs

4. **Configuration**:
   - Environment variables (sanitized)
   - Browser settings
   - Any custom modifications

### Support Channels

1. **Documentation**:
   - Check other documentation files
   - Search for similar issues
   - Review troubleshooting section

2. **Browser Console**:
   - Always check console for errors
   - Look for warning messages
   - Check network tab for failed requests

3. **Community**:
   - Check GitHub issues
   - Search for similar problems
   - Create new issue with details

### Common Debugging Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List dependencies
npm list

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Security audit
npm audit

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build application
npm run build

# Preview production build
npm run preview
```

## Prevention

### Best Practices

1. **Regular Updates**:
   - Keep dependencies updated
   - Update browser regularly
   - Update OS regularly

2. **Monitoring**:
   - Monitor performance regularly
   - Check for errors in console
   - Monitor API usage

3. **Testing**:
   - Test changes before deployment
   - Test in multiple browsers
   - Test on different devices

4. **Backup**:
   - Keep git commits regular
   - Tag stable versions
   - Document configuration changes

### Regular Maintenance

1. **Weekly**:
   - Check for dependency updates
   - Review error logs
   - Monitor performance

2. **Monthly**:
   - Update dependencies
   - Review security advisories
   - Test in all browsers

3. **Quarterly**:
   - Major dependency updates
   - Security audit
   - Performance review

## Resources

- **Vite Troubleshooting**: [https://vitejs.dev/guide/troubleshooting.html](https://vitejs.dev/guide/troubleshooting.html)
- **React Troubleshooting**: [https://react.dev/learn/troubleshooting](https://react.dev/learn/troubleshooting)
- **TypeScript Troubleshooting**: [https://www.typescriptlang.org/docs/handbook/troubleshooting.html](https://www.typescriptlang.org/docs/handbook/troubleshooting.html)
- **Google AI Troubleshooting**: [https://ai.google.dev/docs/troubleshooting](https://ai.google.dev/docs/troubleshooting)
- **MDN Web Docs**: [https://developer.mozilla.org/](https://developer.mozilla.org/)
