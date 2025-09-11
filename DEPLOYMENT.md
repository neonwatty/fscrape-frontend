# Deployment Guide

This guide covers deploying the Forum Scraper Frontend application to various platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

Before deploying, ensure:

1. **Build passes all checks**:
   ```bash
   npm run build
   npm run test:all
   npm run validate:export
   ```

2. **Database is ready**:
   ```bash
   npm run db:validate
   ```

3. **Environment configured** (see [Environment Variables](#environment-variables))

## 🚀 GitHub Pages Deployment

### Automatic Deployment (Recommended)

The application automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

```yaml
# .github/workflows/deploy.yml handles:
- Building the application
- Running tests
- Validating static export
- Deploying to GitHub Pages
```

### Manual Deployment

1. **Configure repository settings**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

2. **Build and deploy**:
   ```bash
   # Build the application
   npm run build:prod
   
   # Validate export
   npm run validate:export
   
   # Deploy (if using gh-pages package)
   npm run deploy:gh-pages
   ```

3. **Custom domain** (optional):
   - Add `CNAME` file in `public/` directory
   - Configure DNS settings

### GitHub Actions Configuration

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run validate:export
      - uses: actions/upload-pages-artifact@v3
      - uses: actions/deploy-pages@v4
```

## ▲ Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/neonwatty/fscrape-frontend)

### Manual Setup

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure** (`vercel.json`):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "out",
     "framework": "nextjs",
     "trailingSlash": true
   }
   ```

### Production Deployment

```bash
vercel --prod
```

## 🔷 Netlify Deployment

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/neonwatty/fscrape-frontend)

### Manual Setup

1. **Configure** (`netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "out"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
   ```

2. **Deploy via CLI**:
   ```bash
   npm i -g netlify-cli
   netlify deploy
   netlify deploy --prod
   ```

### Drag & Drop Deploy

1. Build locally: `npm run build`
2. Drag `out` folder to Netlify dashboard

## 🖥️ Self-Hosted Deployment

### Using Node.js Server

1. **Install dependencies**:
   ```bash
   npm ci --production
   ```

2. **Build application**:
   ```bash
   npm run build
   ```

3. **Serve static files**:
   ```bash
   npx serve out -p 3000
   ```

### Using Nginx

1. **Build application**:
   ```bash
   npm run build
   ```

2. **Nginx configuration**:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     root /var/www/fscrape-frontend/out;
     
     location / {
       try_files $uri $uri/ $uri.html /index.html;
     }
     
     # Security headers
     add_header X-Frame-Options "DENY";
     add_header X-Content-Type-Options "nosniff";
     
     # Compression
     gzip on;
     gzip_types text/plain text/css application/json application/javascript;
     
     # Cache static assets
     location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

3. **Copy files**:
   ```bash
   sudo cp -r out/* /var/www/fscrape-frontend/
   sudo nginx -s reload
   ```

### Using Apache

1. **Apache configuration** (`.htaccess`):
   ```apache
   RewriteEngine On
   
   # Security headers
   Header set X-Frame-Options "DENY"
   Header set X-Content-Type-Options "nosniff"
   
   # Compression
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/css application/javascript
   </IfModule>
   
   # Cache control
   <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg)$">
     Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>
   
   # SPA routing
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   ```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
# Build image
docker build -t fscrape-frontend .

# Run container
docker run -p 80:80 fscrape-frontend

# Using Docker Compose
docker-compose up -d
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    volumes:
      - ./database.db:/usr/share/nginx/html/database.db:ro
```

## 🔐 Environment Variables

### Development

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
```

### Production

Set in deployment platform:
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
NODE_ENV=production
```

### Build-time Variables

```bash
# During build
NEXT_PUBLIC_BUILD_ID=$(git rev-parse HEAD) npm run build
```

## 📝 Post-Deployment

### 1. Verify Deployment

```bash
# Check deployment status
curl -I https://your-domain.com

# Validate PWA
npx lighthouse https://your-domain.com

# Test functionality
npm run test:e2e -- --headed
```

### 2. Monitor Performance

- Set up monitoring (e.g., Google Analytics, Sentry)
- Configure uptime monitoring
- Check Web Vitals scores

### 3. Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP policy active
- [ ] Dependencies up to date

### 4. SEO Configuration

- [ ] Robots.txt configured
- [ ] Sitemap generated
- [ ] Meta tags optimized
- [ ] Open Graph tags set

## 🔧 Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm ci
npm run build
```

### 404 Errors

Ensure trailing slashes in Next.js config:
```javascript
module.exports = {
  trailingSlash: true,
  output: 'export',
}
```

### Database Issues

```bash
# Validate database
npm run db:validate

# Regenerate database
npm run db:update
```

### Service Worker Issues

```bash
# Clear service worker cache
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### Performance Issues

1. Check bundle size:
   ```bash
   npm run analyze
   ```

2. Optimize images:
   ```bash
   npm run optimize:images
   ```

3. Enable caching headers

## 🔄 Rollback Procedure

### GitHub Pages

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

### Vercel/Netlify

Use dashboard to rollback to previous deployment

### Self-Hosted

```bash
# Keep previous build
mv out out.backup
# Restore if needed
mv out.backup out
```

## 📊 Deployment Checklist

- [ ] Tests passing
- [ ] Build successful
- [ ] Static export validated
- [ ] Database included
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup created
- [ ] Documentation updated

## 🆘 Support

For deployment issues:
- Check [GitHub Issues](https://github.com/neonwatty/fscrape-frontend/issues)
- Review [CI/CD logs](https://github.com/neonwatty/fscrape-frontend/actions)
- Contact maintainers

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)