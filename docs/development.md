# Development Guide

This guide covers the development workflow, coding standards, and best practices for contributing to CyberAscii Vision.

## Development Workflow

### Getting Started

1. **Fork and Clone**:
   ```bash
   git clone <your-fork-url>
   cd CyberAscii_Vision
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment**:
   ```bash
   # Create .env.local with your Gemini API key
   echo "GEMINI_API_KEY=your_key_here" > .env.local
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Branch Strategy

**Main Branch**: `main` - Production-ready code

**Feature Branches**: `feature/description` - New features
**Bugfix Branches**: `bugfix/description` - Bug fixes
**Hotfix Branches**: `hotfix/description` - Urgent production fixes

**Example**:
```bash
git checkout -b feature/add-new-color-mode
```

### Development Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Edit files following coding standards
   - Test changes locally
   - Commit with clear messages

3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new color mode option"
   ```

4. **Push to Remote**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**:
   - Go to repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Request review

## Project Structure

### Directory Layout

```
CyberAscii_Vision/
├── components/          # React components
│   ├── AnalysisModal.tsx
│   ├── AsciiCanvas.tsx
│   └── ControlPanel.tsx
├── services/           # External API integrations
│   └── geminiService.ts
├── utils/              # Utility functions
│   ├── asciiConverter.ts
│   └── soundEffects.ts
├── docs/               # Documentation
├── App.tsx             # Main application component
├── index.tsx           # React entry point
├── index.html          # HTML template
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
└── .env.local          # Environment variables (not in git)
```

### File Naming Conventions

- **Components**: PascalCase (`AsciiCanvas.tsx`)
- **Utilities**: camelCase (`asciiConverter.ts`)
- **Services**: camelCase (`geminiService.ts`)
- **Types**: camelCase (`types.ts`)
- **Configuration**: kebab-case or camelCase depending on tool

## Coding Standards

### TypeScript

**Type Safety**:
- Always define interfaces for component props
- Use TypeScript types instead of `any`
- Enable strict mode in `tsconfig.json`

**Example**:
```typescript
// Good
interface AsciiCanvasProps {
  options: AsciiOptions;
  onCapture: (imageData: string) => void;
}

export const AsciiCanvas: React.FC<AsciiCanvasProps> = ({ options, onCapture }) => {
  // Component logic
};

// Bad
export const AsciiCanvas = ({ options, onCapture }: any) => {
  // Component logic
};
```

### React Patterns

**Functional Components**:
- Use functional components with hooks
- Avoid class components
- Use `React.FC` for component typing

**Hooks**:
- Use `useState` for local state
- Use `useEffect` for side effects
- Use `useCallback` for event handlers
- Use `useRef` for DOM references

**Example**:
```typescript
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependency]);

  useEffect(() => {
    // Side effect logic
    return () => {
      // Cleanup
    };
  }, [dependency]);

  return <div ref={ref}>Content</div>;
};
```

### Code Style

**General Guidelines**:
- Use 2 spaces for indentation
- Use single quotes for strings
- Use trailing commas in multi-line structures
- Keep lines under 100 characters
- Use meaningful variable names

**Example**:
```typescript
// Good
const processImage = (
  imageData: ImageData,
  options: ProcessingOptions,
): ProcessedImage => {
  const result = performProcessing(imageData, options);
  return result;
};

// Bad
const p = (d: any, o: any) => {
  const r = doIt(d, o);
  return r;
};
```

## Component Development

### Creating New Components

1. **Define Props Interface**:
```typescript
interface NewComponentProps {
  title: string;
  onAction: () => void;
  isActive?: boolean;
}
```

2. **Create Component**:
```typescript
export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onAction,
  isActive = false,
}) => {
  return (
    <div className={`component ${isActive ? 'active' : ''}`}>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

3. **Add to Parent Component**:
```typescript
import { NewComponent } from './components/NewComponent';

// In parent component
<NewComponent
  title="My Component"
  onAction={handleAction}
  isActive={true}
/>
```

### Component Best Practices

- **Single Responsibility**: Each component should do one thing well
- **Props vs State**: Use props for data passed down, state for internal data
- **Composition**: Build complex UIs from simple components
- **Performance**: Use `React.memo` for expensive components
- **Accessibility**: Add ARIA labels and semantic HTML

## State Management

### Local State

Use React's built-in state management for simple cases:

```typescript
const [count, setCount] = useState(0);
const [options, setOptions] = useState<AsciiOptions>({
  fontSize: 12,
  brightness: 1.0,
  // ...
});
```

### Prop Drilling

For simple prop passing, drill props through components:

```typescript
// Parent
const [options, setOptions] = useState<AsciiOptions>({...});

// Child
<ChildComponent options={options} setOptions={setOptions} />
```

### Context API (Future Enhancement)

For complex state, consider Context API:

```typescript
// context.tsx
const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({...});
  
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};
```

## Styling Guidelines

### Tailwind CSS

The project uses Tailwind CSS via CDN. Follow these patterns:

**Utility Classes**:
- Use Tailwind utilities for styling
- Avoid custom CSS when possible
- Use responsive prefixes (`md:`, `lg:`) for responsive design

**Example**:
```typescript
<div className="bg-black text-green-500 p-4 rounded-lg border border-green-900">
  <h2 className="text-xl font-bold">Title</h2>
</div>
```

### Custom CSS

For custom styles, add to `index.html`:

```css
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
```

### Theme Consistency

Maintain the cyberpunk theme:
- **Colors**: Black background, green accents (#00ff41, #00ff00)
- **Fonts**: JetBrains Mono for ASCII, Share Tech Mono for UI
- **Effects**: Scanlines, glowing borders, monospace text
- **Animations**: Pulse, scan, fade effects

## Testing (Manual)

Since the project doesn't have automated tests, follow this manual testing process:

### Feature Testing Checklist

**Camera Functionality**:
- [ ] Camera permissions request appears
- [ ] Camera feed starts successfully
- [ ] ASCII conversion displays correctly
- [ ] Mirror effect works (horizontal flip)

**Visual Controls**:
- [ ] Font size slider changes character size
- [ ] Brightness slider adjusts image brightness
- [ ] Contrast slider adjusts image contrast
- [ ] Color mode buttons switch themes correctly
- [ ] Character set buttons change ASCII characters

**AI Analysis**:
- [ ] Scan button triggers analysis
- [ ] Loading animation displays
- [ ] Analysis results appear
- [ ] Error handling works (without API key)
- [ ] Modal closes correctly

**Audio Effects**:
- [ ] Startup sound plays on camera start
- [ ] Ambient hum plays continuously
- [ ] Scan sound plays on capture
- [ ] Analysis sounds play correctly
- [ ] Button sounds play on interaction

**Screenshot**:
- [ ] Screenshot button saves PNG
- [ ] Download filename includes timestamp
- [ ] Image quality is acceptable

### Browser Testing

Test in multiple browsers:
- Chrome/Edge (primary)
- Firefox
- Safari
- Mobile browsers (if applicable)

### Performance Testing

Monitor performance:
- CPU usage during rendering
- Memory usage over time
- Frame rate (should be ~60fps)
- API response times

## Debugging

### Browser DevTools

**React DevTools**:
- Install React DevTools extension
- Inspect component hierarchy
- Monitor props and state
- Profile component performance

**Console Logging**:
```typescript
console.log('Debug info:', data);
console.error('Error occurred:', error);
console.warn('Warning message:', warning);
```

**Network Tab**:
- Monitor API requests
- Check response times
- Verify request payloads

### Common Issues

**State Not Updating**:
- Check if you're mutating state directly
- Verify dependency arrays in useEffect
- Ensure setState is called correctly

**Component Not Re-rendering**:
- Check if props are actually changing
- Verify React.memo usage
- Check for stale closures

**Performance Issues**:
- Profile with React DevTools
- Check for unnecessary re-renders
- Optimize expensive calculations

## Git Workflow

### Commit Messages

Follow conventional commits:

```
feat: add new color mode
fix: resolve camera permission issue
docs: update README
style: format code
refactor: simplify component structure
test: add manual testing checklist
chore: update dependencies
```

### Pull Request Process

1. **Update Branch**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Create PR**:
   - Clear title and description
   - List changes made
   - Reference related issues
   - Add screenshots for UI changes

3. **Review Process**:
   - Address review feedback
   - Make requested changes
   - Update PR as needed

4. **Merge**:
   - Squash commits if needed
   - Delete feature branch after merge

## Performance Optimization

### React Performance

**Use React.memo**:
```typescript
export const ExpensiveComponent = React.memo<Props>(({ prop1 }) => {
  // Expensive rendering
});
```

**Use useCallback**:
```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);
```

**Lazy Loading** (Future):
```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### Canvas Performance

**Optimize Rendering**:
- Use requestAnimationFrame
- Minimize canvas size
- Batch operations
- Use offscreen canvas for processing

**Example**:
```typescript
useEffect(() => {
  const renderLoop = () => {
    // Rendering logic
    animationRef.current = requestAnimationFrame(renderLoop);
  };
  
  animationRef.current = requestAnimationFrame(renderLoop);
  
  return () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
}, [dependencies]);
```

## Dependencies

### Adding Dependencies

**Production Dependencies**:
```bash
npm install package-name
```

**Development Dependencies**:
```bash
npm install --save-dev package-name
```

**Considerations**:
- Is the dependency necessary?
- Is it well-maintained?
- Does it add significant bundle size?
- Are there alternatives?

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update
```

**Caution**: Test thoroughly after updating dependencies.

## Documentation

### Code Comments

Add comments for complex logic:

```typescript
// Apply temporal smoothing to reduce ASCII flickering
// Uses low-pass filter with 0.75 inertia factor
const smoothedValue = prev + (target - prev) * (1 - inertia);
```

### JSDoc

Use JSDoc for function documentation:

```typescript
/**
 * Converts pixel brightness to ASCII character
 * @param brightness - Pixel brightness value (0-255)
 * @param densityType - Character density map to use
 * @returns ASCII character corresponding to brightness
 */
export const getAsciiChar = (
  brightness: number,
  densityType: keyof typeof DENSITY_MAPS
): string => {
  // Implementation
};
```

### README Updates

Update README.md when:
- Adding new features
- Changing dependencies
- Modifying setup process
- Adding new configuration options

## Development Tools

### Recommended VS Code Extensions

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Importer**: Auto-imports
- **Tailwind CSS IntelliSense**: Tailwind autocompletion
- **GitLens**: Git integration
- **Thunder Client**: API testing

### VS Code Settings

Recommended `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Troubleshooting Development Issues

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port in vite.config.ts
```

### Hot Module Replacement Not Working

- Restart dev server
- Clear browser cache
- Check file watcher limits

### TypeScript Errors

- Clear node_modules and reinstall
- Check tsconfig.json configuration
- Verify TypeScript version compatibility

### Styling Issues

- Verify Tailwind CDN is loaded
- Check class names are correct
- Inspect element in DevTools

## Contributing Guidelines

### Before Contributing

1. Read existing code to understand patterns
2. Check for similar features/components
3. Discuss major changes in issue first
4. Follow coding standards

### After Contributing

1. Test your changes thoroughly
2. Update documentation if needed
3. Ensure no console errors
4. Follow commit message conventions

### Code Review Etiquette

- Be constructive in feedback
- Explain reasoning for suggestions
- Accept feedback graciously
- Focus on code quality, not personality

## Resources

- **React Documentation**: [https://react.dev/](https://react.dev/)
- **TypeScript Documentation**: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
- **Vite Documentation**: [https://vitejs.dev/](https://vitejs.dev/)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)
- **Web Audio API**: [https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Canvas API**: [https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
