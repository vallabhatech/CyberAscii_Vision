# Testing Guide

This document covers testing strategies and procedures for CyberAscii Vision.

## Testing Overview

CyberAscii Vision currently uses manual testing procedures. Automated testing infrastructure is not yet implemented in the project.

## Manual Testing Procedures

### Prerequisites for Testing

1. **Environment Setup**:
   - Node.js 18+ installed
   - Dependencies installed (`npm install`)
   - Gemini API key configured in `.env.local`
   - Modern browser with camera support

2. **Hardware Requirements**:
   - Working webcam
   - Microphone (optional, for future features)
   - Sufficient RAM for browser rendering

### Functional Testing

#### Camera Functionality

**Test Case 1: Camera Permission Request**
- **Steps**:
  1. Start application: `npm run dev`
  2. Open browser to `http://localhost:3000`
  3. Observe browser permission dialog
- **Expected Result**: Browser requests camera permission
- **Actual Result**: Pass/Fail

**Test Case 2: Camera Feed Start**
- **Steps**:
  1. Allow camera permissions
  2. Wait for initialization
  3. Observe ASCII feed
- **Expected Result**: ASCII art displays real-time camera feed
- **Actual Result**: Pass/Fail

**Test Case 3: Camera Denial Handling**
- **Steps**:
  1. Deny camera permissions
  2. Observe error display
- **Expected Result**: Error message displayed explaining camera access required
- **Actual Result**: Pass/Fail

**Test Case 4: Mirror Effect**
- **Steps**:
  1. Move hand to right side of frame
  2. Observe ASCII feed movement
- **Expected Result**: Movement appears mirrored (left-right)
- **Actual Result**: Pass/Fail

#### Visual Controls Testing

**Test Case 5: Font Size Slider**
- **Steps**:
  1. Locate font size slider
  2. Drag to minimum (6px)
  3. Observe character size
  4. Drag to maximum (24px)
  5. Observe character size
- **Expected Result**: Character size changes smoothly between 6px and 24px
- **Actual Result**: Pass/Fail

**Test Case 6: Brightness Slider**
- **Steps**:
  1. Locate brightness slider
  2. Drag to minimum (0.5)
  3. Observe image brightness
  4. Drag to maximum (2.0)
  5. Observe image brightness
- **Expected Result**: Brightness adjusts smoothly from dark to bright
- **Actual Result**: Pass/Fail

**Test Case 7: Contrast Slider**
- **Steps**:
  1. Locate contrast slider
  2. Drag to minimum (0.5)
  3. Observe image contrast
  4. Drag to maximum (3.0)
  5. Observe image contrast
- **Expected Result**: Contrast adjusts smoothly from low to high
- **Actual Result**: Pass/Fail

**Test Case 8: Color Mode Switching**
- **Steps**:
  1. Click each color mode button (matrix, bw, retro, color)
  2. Observe visual changes
- **Expected Result**: Each mode displays correct color scheme
- **Actual Result**: Pass/Fail

**Test Case 9: Character Set Switching**
- **Steps**:
  1. Click each character set button (simple, complex, binary, blocks)
  2. Observe character changes
- **Expected Result**: Each set displays correct character types
- **Actual Result**: Pass/Fail

#### AI Analysis Testing

**Test Case 10: AI Analysis Trigger**
- **Steps**:
  1. Ensure API key is configured
  2. Click scan button (eye icon)
  3. Observe loading animation
- **Expected Result**: Analysis modal opens with loading state
- **Actual Result**: Pass/Fail

**Test Case 11: AI Analysis Success**
- **Steps**:
  1. Wait for analysis to complete
  2. Observe results display
- **Expected Result**: Analysis results show description, threat level, and tags
- **Actual Result**: Pass/Fail

**Test Case 12: AI Analysis Error Handling**
- **Steps**:
  1. Remove or invalidate API key
  2. Click scan button
  3. Observe error handling
- **Expected Result**: Graceful error message displayed
- **Actual Result**: Pass/Fail

**Test Case 13: Modal Close**
- **Steps**:
  1. Open analysis modal
  2. Click close button
  3. Click scan button again
- **Expected Result**: Modal opens and closes correctly
- **Actual Result**: Pass/Fail

#### Audio Testing

**Test Case 14: Startup Sound**
- **Steps**:
  1. Start application
  2. Allow camera permissions
  3. Listen for startup sound
- **Expected Result**: Sci-fi startup sound plays
- **Actual Result**: Pass/Fail

**Test Case 15: Ambient Hum**
- **Steps**:
  1. After camera starts
  2. Listen for background hum
- **Expected Result**: Low ambient drone sound plays continuously
- **Actual Result**: Pass/Fail

**Test Case 16: Scan Sound**
- **Steps**:
  1. Click screenshot button
  2. Listen for scan sound
- **Expected Result**: High-pitched scan sound plays
- **Actual Result**: Pass/Fail

**Test Case 17: Analysis Sounds**
- **Steps**:
  1. Click scan button for analysis
  2. Listen for analysis start sound
  3. Wait for completion
  4. Listen for completion sound
- **Expected Result**: Computing chatter and success trill play
- **Actual Result**: Pass/Fail

**Test Case 18: Button Sounds**
- **Steps**:
  1. Click control panel buttons
  2. Listen for button sounds
- **Expected Result**: Subtle click sound plays on each button
- **Actual Result**: Pass/Fail

#### Screenshot Testing

**Test Case 19: Screenshot Capture**
- **Steps**:
  1. Click camera icon button
  2. Check downloads folder
- **Expected Result**: PNG file downloaded with timestamp filename
- **Actual Result**: Pass/Fail

**Test Case 20: Screenshot Quality**
- **Steps**:
  1. Open downloaded screenshot
  2. Verify image quality
- **Expected Result**: ASCII art is clearly visible and properly formatted
- **Actual Result**: Pass/Fail

### Browser Compatibility Testing

#### Chrome/Edge Testing

**Test Case 21: Chrome Full Functionality**
- **Browser**: Chrome (latest version)
- **Steps**: Run all functional test cases
- **Expected Result**: All tests pass
- **Actual Result**: Pass/Fail

**Test Case 22: Edge Full Functionality**
- **Browser**: Edge (latest version)
- **Steps**: Run all functional test cases
- **Expected Result**: All tests pass
- **Actual Result**: Pass/Fail

#### Firefox Testing

**Test Case 23: Firefox Full Functionality**
- **Browser**: Firefox (latest version)
- **Steps**: Run all functional test cases
- **Expected Result**: All tests pass
- **Actual Result**: Pass/Fail

#### Safari Testing

**Test Case 24: Safari Full Functionality**
- **Browser**: Safari (latest version)
- **Steps**: Run all functional test cases
- **Expected Result**: All tests pass (may require user interaction for audio)
- **Actual Result**: Pass/Fail

### Performance Testing

**Test Case 25: Frame Rate**
- **Steps**:
  1. Open browser DevTools Performance tab
  2. Record performance while running
  3. Analyze frame rate
- **Expected Result**: Consistent 60fps (or close to display refresh rate)
- **Actual Result**: Pass/Fail

**Test Case 26: Memory Usage**
- **Steps**:
  1. Open browser DevTools Memory tab
  2. Monitor memory usage over 5 minutes
  3. Check for memory leaks
- **Expected Result**: Stable memory usage, no significant leaks
- **Actual Result**: Pass/Fail

**Test Case 27: CPU Usage**
- **Steps**:
  1. Monitor CPU usage during operation
  2. Check for excessive CPU consumption
- **Expected Result**: Reasonable CPU usage (< 30% on modern hardware)
- **Actual Result**: Pass/Fail

**Test Case 28: API Response Time**
- **Steps**:
  1. Trigger AI analysis
  2. Measure time from click to result
- **Expected Result**: Response time < 5 seconds
- **Actual Result**: Pass/Fail

### Responsive Design Testing

**Test Case 29: Desktop Resolution**
- **Resolution**: 1920x1080
- **Steps**: Resize browser to desktop resolution
- **Expected Result**: Layout adapts correctly, all controls visible
- **Actual Result**: Pass/Fail

**Test Case 30: Tablet Resolution**
- **Resolution**: 768x1024
- **Steps**: Resize browser to tablet resolution
- **Expected Result**: Layout adapts correctly, controls accessible
- **Actual Result**: Pass/Fail

**Test Case 31: Mobile Resolution**
- **Resolution**: 375x667
- **Steps**: Resize browser to mobile resolution
- **Expected Result**: Layout adapts, controls remain usable
- **Actual Result**: Pass/Fail

### Error Scenario Testing

**Test Case 32: Network Failure**
- **Steps**:
  1. Disconnect network
  2. Trigger AI analysis
- **Expected Result**: Graceful error message displayed
- **Actual Result**: Pass/Fail

**Test Case 33: API Rate Limit**
- **Steps**:
  1. Trigger multiple rapid AI analyses
  2. Observe rate limit handling
- **Expected Result**: Error message or graceful degradation
- **Actual Result**: Pass/Fail

**Test Case 34: Invalid API Key**
- **Steps**:
  1. Set invalid API key
  2. Trigger AI analysis
- **Expected Result**: Appropriate error message
- **Actual Result**: Pass/Fail

## Test Reporting

### Test Results Template

```markdown
# Test Results - [Date]

## Environment
- Browser: [Browser Name and Version]
- OS: [Operating System]
- Node.js Version: [Version]
- API Key: [Configured/Not Configured]

## Functional Tests
| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| TC01 | Camera permission request | Pass/Fail | ✅/❌ |
| TC02 | Camera feed start | Pass/Fail | ✅/❌ |
| ... | ... | ... | ... |

## Browser Compatibility
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅/❌ | Notes |
| Firefox | Latest | ✅/❌ | Notes |
| ... | ... | ... | ... |

## Performance
| Metric | Expected | Actual | Status |
|--------|----------|--------|--------|
| Frame Rate | 60fps | [Value] | ✅/❌ |
| Memory Usage | Stable | [Value] | ✅/❌ |
| ... | ... | ... | ... |

## Issues Found
1. [Description of issue]
2. [Description of issue]

## Recommendations
[Recommendations for improvements]
```

## Automated Testing (Future)

### Recommended Test Frameworks

**Unit Testing**:
- **Vitest**: Fast unit test framework (works with Vite)
- **React Testing Library**: Component testing utilities

**Integration Testing**:
- **Playwright**: End-to-end testing
- **Cypress**: Alternative E2E testing framework

**Example Test Structure** (Future Implementation):

```typescript
// AsciiCanvas.test.tsx
import { render, screen } from '@testing-library/react';
import { AsciiCanvas } from './AsciiCanvas';

describe('AsciiCanvas', () => {
  it('should render canvas element', () => {
    render(<AsciiCanvas options={mockOptions} onCapture={mockOnCapture} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should call onCapture when scan button clicked', () => {
    const mockOnCapture = vi.fn();
    render(<AsciiCanvas options={mockOptions} onCapture={mockOnCapture} />);
    
    // Simulate button click
    expect(mockOnCapture).toHaveBeenCalled();
  });
});
```

### Testing Configuration (Future)

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

## Continuous Integration (Future)

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
```

## Test Data Management

### Mock Data

For consistent testing, use mock data:

```typescript
// test/mockData.ts
export const mockAsciiOptions: AsciiOptions = {
  fontSize: 12,
  brightness: 1.0,
  contrast: 1.0,
  colorMode: 'matrix',
  density: 'complex',
  resolution: 0.2,
};

export const mockAnalysisResult: AnalysisResult = {
  description: "Test subject analysis",
  threatLevel: "LOW",
  tags: ["test", "mock", "data"],
};
```

## Test Environment Setup

### Local Test Environment

1. **Create test configuration**:
   ```bash
   # .env.test
   GEMINI_API_KEY=test_key_for_testing
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

### Staging Environment

For pre-production testing:
1. Deploy to staging server
2. Run full test suite
3. Perform manual exploratory testing
4. Performance testing under load

## Regression Testing

### When to Run Regression Tests

- Before major releases
- After significant refactoring
- After dependency updates
- After bug fixes

### Regression Test Checklist

- [ ] All previous functionality still works
- [ ] No new bugs introduced
- [ ] Performance not degraded
- [ ] Browser compatibility maintained
- [ ] API integrations working

## Accessibility Testing

### Manual Accessibility Tests

**Test Case 35: Keyboard Navigation**
- **Steps**: Navigate interface using only keyboard
- **Expected Result**: All controls accessible via keyboard
- **Actual Result**: Pass/Fail

**Test Case 36: Screen Reader Compatibility**
- **Steps**: Test with screen reader software
- **Expected Result**: All elements properly announced
- **Actual Result**: Pass/Fail

**Test Case 37: Color Contrast**
- **Steps**: Check color contrast ratios
- **Expected Result**: WCAG AA compliant contrast ratios
- **Actual Result**: Pass/Fail

## Security Testing

### Basic Security Checks

**Test Case 38: API Key Exposure**
- **Steps**: Check browser console and network tab
- **Expected Result**: API key not exposed in client-side code
- **Actual Result**: Pass/Fail

**Test Case 39: Input Validation**
- **Steps**: Test with invalid inputs
- **Expected Result**: Graceful error handling
- **Actual Result**: Pass/Fail

## Testing Best Practices

1. **Test Early**: Test during development, not just before release
2. **Test Often**: Run tests frequently during development
3. **Document Tests**: Keep test cases documented and updated
4. **Automate When Possible**: Reduce manual testing burden
5. **Test Edge Cases**: Don't just test happy paths
6. **Mock External Dependencies**: Isolate unit tests from external APIs
7. **Keep Tests Independent**: Tests should not depend on each other
8. **Use Version Control**: Track test changes with code changes

## Troubleshooting Test Failures

### Common Issues

**Camera Not Available in Test Environment**:
- Ensure camera permissions are granted
- Check if another application is using camera
- Verify browser supports camera access

**API Tests Failing**:
- Verify API key is valid
- Check network connectivity
- Monitor API quota limits

**Performance Tests Failing**:
- Close other applications
- Check system resources
- Verify test environment specifications

## Resources

- **Vitest Documentation**: [https://vitest.dev/](https://vitest.dev/)
- **React Testing Library**: [https://testing-library.com/react](https://testing-library.com/react/)
- **Playwright Documentation**: [https://playwright.dev/](https://playwright.dev/)
- **Web Accessibility Testing**: [https://www.w3.org/WAI/test-evaluators/](https://www.w3.org/WAI/test-evaluators/)
