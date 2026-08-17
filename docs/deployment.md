# Deployment Guide

This guide covers deploying CyberAscii Vision to various hosting platforms.

## Deployment Overview

CyberAscii Vision is a static web application that can be deployed to any static hosting service. The build process creates a `dist/` directory containing all necessary files.

## Prerequisites for Deployment

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Environment Variables**:
   - Set `GEMINI_API_KEY` before building
   - API key will be embedded in the production bundle

3. **Domain Name** (Optional):
   - Register domain for custom URL
   - Configure DNS records

## Build Process

### Production Build

```bash
# Set environment variable
export GEMINI_API_KEY=your_production_api_key

# Build application
npm run build
```

**Output**: `dist/` directory containing:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- Other static assets

### Build Verification

```bash
# Preview production build locally
npm run preview
```

Visit `http://localhost:4173` to verify the build works correctly.

## Deployment Platforms

### Vercel

Vercel is recommended for React applications with Vite.

**Deployment Steps**:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow Prompts**:
   - Link to existing project or create new
   - Set project name
   - Configure build settings (auto-detected)

4. **Environment Variables**:
   - Add `GEMINI_API_KEY` in Vercel dashboard
   - Settings → Environment Variables

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

**Vercel Configuration** (optional `vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify

Netlify is another excellent option for static sites.

**Deployment Steps**:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Environment Variables**:
   - Add in Netlify dashboard: Site settings → Environment variables
   - Variable: `GEMINI_API_KEY`

4. **Configuration** (optional `netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### GitHub Pages

Free hosting for GitHub repositories.

**Deployment Steps**:

1. **Install gh-pages**:
   ```bash
   npm install -g gh-pages
   ```

2. **Update vite.config.ts**:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   });
   ```

3. **Build and Deploy**:
   ```bash
   npm run build
   gh-pages -d dist
   ```

4. **Access**:
   - URL: `https://your-username.github.io/your-repo-name/`

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### AWS S3 + CloudFront

For AWS infrastructure users.

**Deployment Steps**:

1. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Enable Static Hosting**:
   - In AWS Console → S3 → Properties → Static website hosting
   - Enable and set index document to `index.html`

3. **Upload Files**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Set Bucket Policy** (public read):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

5. **Configure CloudFront** (optional, for CDN):
   - Create CloudFront distribution
   - Origin: S3 bucket
   - Default cache behavior: redirect HTTP to HTTPS

### Firebase Hosting

Google's hosting solution with free SSL.

**Deployment Steps**:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase login
   firebase init
   ```
   - Select Hosting
   - Use `dist` as public directory
   - Configure as single-page app

3. **Deploy**:
   ```bash
   firebase deploy
   ```

4. **Environment Variables**:
   - Use Firebase functions or separate config for API keys
   - Consider using Firebase Realtime Database for key storage

### Docker Deployment

For containerized deployments.

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and Run**:
```bash
docker build -t cyberascii-vision .
docker run -p 80:80 -e GEMINI_API_KEY=your_key cyberascii-vision
```

## Environment Variables in Production

### Security Considerations

**Important**: The current implementation embeds the API key in the client-side bundle. For production:

1. **Use Restrictive API Keys**:
   - Set HTTP referrer restrictions in Google Cloud Console
   - Limit to specific domains
   - Set usage quotas

2. **Consider Backend Proxy** (Future):
   - Move API calls to backend service
   - Keep API key server-side
   - Frontend calls backend instead of direct API

3. **User Consent**:
   - Inform users about data sent to external APIs
   - Provide privacy policy
   - Allow opt-out of AI features

### Setting Environment Variables

**Vercel**:
- Dashboard → Settings → Environment Variables
- Add `GEMINI_API_KEY`
- Redeploy after adding

**Netlify**:
- Site settings → Environment variables
- Add `GEMINI_API_KEY`
- Redeploy after adding

**GitHub Pages**:
- Use GitHub Secrets in Actions workflow
- Key injected during build process

## Custom Domain Configuration

### Vercel Custom Domain

1. **Add Domain**:
   - Dashboard → Settings → Domains
   - Add custom domain

2. **Configure DNS**:
   - Add CNAME record pointing to Vercel
   - Example: `www.yourdomain.com` → `cname.vercel-dns.com`

3. **SSL**:
   - Automatic SSL provided by Vercel
   - HTTP automatically redirects to HTTPS

### Netlify Custom Domain

1. **Add Domain**:
   - Site settings → Domain management
   - Add custom domain

2. **Configure DNS**:
   - Add CNAME record pointing to Netlify
   - Example: `www.yourdomain.com` → `your-site.netlify.app`

3. **SSL**:
   - Automatic SSL provided by Netlify
   - Let's Encrypt certificates

## Performance Optimization

### Build Optimizations

**Current Optimizations** (Vite default):
- Code splitting
- Tree shaking
- Minification
- Asset optimization

**Additional Optimizations**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ai-vendor': ['@google/genai'],
        }
      }
    }
  }
});
```

### CDN Configuration

**Vercel**:
- Automatic CDN via Vercel Edge Network
- Global edge locations

**Netlify**:
- Automatic CDN via Netlify Edge
- Global edge locations

**CloudFront**:
- Configure edge locations
- Set cache behavior

### Asset Optimization

**Images**:
- Optimize screenshots before upload
- Use appropriate image formats
- Consider lazy loading

**Fonts**:
- Use font-display: swap
- Subset fonts if needed
- Consider system fonts fallback

## Monitoring and Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `App.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// In component return
<Analytics />
```

### Google Analytics

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

**Sentry**:
```bash
npm install @sentry/react
```

Configure in `index.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
});
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Build and Deploy

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
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Camera permissions work
- [ ] All visual controls functional
- [ ] AI analysis works with API key
- [ ] Audio effects play
- [ ] Screenshot functionality works
- [ ] No console errors
- [ ] Responsive design works on mobile
- [ ] SSL certificate valid
- [ ] Custom domain configured (if applicable)
- [ ] Analytics configured (if desired)
- [ ] Error tracking configured (if desired)

## Rollback Procedures

### Vercel Rollback

```bash
# View deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Netlify Rollback

1. Go to Deploys in Netlify dashboard
2. Find previous successful deployment
3. Click "Publish deploy"

### GitHub Pages Rollback

```bash
# Checkout previous commit
git checkout [previous-commit-hash]

# Rebuild and deploy
npm run build
gh-pages -d dist
```

## Troubleshooting Deployment

### Build Failures

**Issue**: Build fails with TypeScript errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Issue**: Environment variables not working
- Verify variables are set in platform dashboard
- Check variable names match exactly
- Redeploy after adding variables

### Runtime Issues

**Issue**: Camera not working in production
- Ensure HTTPS is enabled (required for camera)
- Check browser console for permission errors
- Verify domain is in API key referrer restrictions

**Issue**: API calls failing
- Verify API key is correctly set
- Check referrer restrictions in Google Cloud Console
- Monitor API quota limits
- Check browser console for CORS errors

### Performance Issues

**Issue**: Slow initial load
- Check bundle size
- Implement code splitting
- Optimize images and assets
- Consider CDN configuration

**Issue**: Slow frame rate
- Check device performance
- Reduce processing resolution
- Optimize canvas operations

## Maintenance

### Regular Updates

1. **Dependency Updates**:
   ```bash
   npm outdated
   npm update
   ```

2. **Security Patches**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Monitoring**:
   - Check analytics regularly
   - Monitor error rates
   - Review performance metrics

### Backup and Recovery

**Source Code**:
- Git repository serves as backup
- Use GitHub for remote backup

**Configuration**:
- Document environment variables
- Keep API keys secure
- Maintain deployment configuration

## Cost Considerations

### Hosting Costs

**Free Options**:
- Vercel (generous free tier)
- Netlify (free tier)
- GitHub Pages (free)
- Firebase Hosting (free tier)

**Paid Options**:
- AWS S3 + CloudFront (pay-as-you-go)
- Custom VPS hosting

### API Costs

**Google Gemini API**:
- Free tier: 15 requests/minute
- Paid tiers available for higher limits
- Monitor usage to control costs

## Scaling Considerations

### Current Limitations

- Client-side processing limited by device capabilities
- No backend scaling needed
- API rate limits may constrain usage

### Future Scaling

- Implement caching for API responses
- Add rate limiting for API calls
- Consider CDN for static assets
- Implement backend for heavy processing

## Security Best Practices

### Deployment Security

1. **HTTPS Only**:
   - Enable HTTPS for all deployments
   - Redirect HTTP to HTTPS
   - Use valid SSL certificates

2. **API Key Security**:
   - Use restrictive API keys
   - Set referrer restrictions
   - Monitor API usage
   - Rotate keys periodically

3. **Content Security Policy**:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline';">
   ```

4. **Headers**:
   - Set appropriate security headers
   - Use X-Frame-Options to prevent clickjacking
   - Implement X-Content-Type-Options

## Support Resources

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Netlify Documentation**: [https://docs.netlify.com/](https://docs.netlify.com/)
- **GitHub Pages**: [https://docs.github.com/en/pages](https://docs.github.com/en/pages)
- **AWS S3**: [https://docs.aws.amazon.com/s3/](https://docs.aws.amazon.com/s3/)
- **Firebase Hosting**: [https://firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
