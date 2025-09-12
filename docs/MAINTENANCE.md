# Maintenance Guide

## Overview

This guide provides comprehensive instructions for maintaining the Forum Scraper Frontend application, including routine maintenance tasks, monitoring procedures, troubleshooting, and update processes.

## Table of Contents

- [Quick Start](#quick-start)
- [Automated Maintenance](#automated-maintenance)
- [Manual Maintenance Tasks](#manual-maintenance-tasks)
- [Health Monitoring](#health-monitoring)
- [Dependency Management](#dependency-management)
- [Security Auditing](#security-auditing)
- [Performance Monitoring](#performance-monitoring)
- [Backup Procedures](#backup-procedures)
- [Troubleshooting](#troubleshooting)
- [Emergency Procedures](#emergency-procedures)

## Quick Start

### Running Maintenance Scripts

```bash
# Run interactive maintenance menu
./scripts/maintenance.sh

# Run automatic full maintenance
./scripts/maintenance.sh --auto

# Run health check
node scripts/health-check.js
```

### Quick Health Check

```bash
# Check system health
npm run health-check

# Check for security vulnerabilities
npm run deps:audit

# Check for outdated dependencies
npm run deps:check
```

## Automated Maintenance

### Setting Up Scheduled Maintenance

#### Using Cron (Linux/macOS)

Add to crontab (`crontab -e`):

```bash
# Daily health check at 2 AM
0 2 * * * cd /path/to/fscrape-frontend && node scripts/health-check.js >> logs/health-check.log 2>&1

# Weekly full maintenance on Sunday at 3 AM
0 3 * * 0 cd /path/to/fscrape-frontend && ./scripts/maintenance.sh --auto >> logs/maintenance.log 2>&1

# Monthly dependency audit on the 1st at 4 AM
0 4 1 * * cd /path/to/fscrape-frontend && npm audit >> logs/audit.log 2>&1
```

#### Using Task Scheduler (Windows)

Create scheduled tasks for:

1. Daily health checks
2. Weekly maintenance
3. Monthly security audits

### GitHub Actions Automation

```yaml
# .github/workflows/maintenance.yml
name: Scheduled Maintenance

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: node scripts/health-check.js

  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
```

## Manual Maintenance Tasks

### Daily Tasks

#### 1. Health Check

```bash
node scripts/health-check.js
```

**What it checks:**

- System requirements
- Dependencies integrity
- File structure
- Configuration validity
- Database connectivity
- Build status

#### 2. Log Review

```bash
# Check error logs
tail -f logs/error.log

# Check maintenance logs
cat logs/maintenance_*.log | grep ERROR

# Check build logs
cat logs/build_*.log
```

### Weekly Tasks

#### 1. Dependency Updates

```bash
# Check for updates
npm run deps:check

# Update dependencies (interactive)
npm run deps:update

# Test after updates
npm run test:all
```

#### 2. Cache Cleanup

```bash
# Clean all caches
npm run clean:cache

# Clean npm cache
npm cache clean --force

# Clean Next.js cache
rm -rf .next
```

#### 3. Database Maintenance

```bash
# Validate database
npm run db:validate

# Backup database
npm run db:backup

# Update database
npm run db:update
```

### Monthly Tasks

#### 1. Full System Audit

```bash
# Run complete maintenance
./scripts/maintenance.sh
# Select option 1 for full maintenance
```

#### 2. Performance Review

```bash
# Build and analyze bundle
npm run build:analyze

# Run Lighthouse audit
npm run lighthouse

# Check build size
du -sh .next out
```

#### 3. Security Audit

```bash
# Full security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for critical updates
npm audit --audit-level=critical
```

## Health Monitoring

### Health Check Dashboard

The health check script provides a comprehensive system status:

```bash
node scripts/health-check.js
```

**Output includes:**

- ✅ Passed checks (green)
- ⚠️ Warnings (yellow)
- ❌ Failed checks (red)
- Health score percentage

### Key Metrics to Monitor

#### System Metrics

| Metric          | Healthy | Warning | Critical |
| --------------- | ------- | ------- | -------- |
| Node.js Version | ≥18.0.0 | ≥16.0.0 | <16.0.0  |
| Free Memory     | >1GB    | >500MB  | <500MB   |
| Disk Space      | >1GB    | >500MB  | <500MB   |
| CPU Usage       | <70%    | <85%    | >85%     |

#### Application Metrics

| Metric         | Target | Action if Exceeded |
| -------------- | ------ | ------------------ |
| Build Size     | <10MB  | Optimize bundles   |
| Page Load Time | <3s    | Check performance  |
| Memory Usage   | <500MB | Check for leaks    |
| Error Rate     | <1%    | Review error logs  |

### Monitoring Tools Integration

#### Setting Up Monitoring

1. **Application Monitoring**

```javascript
// lib/monitoring.js
export function initMonitoring() {
  // Track page views
  // Monitor errors
  // Log performance metrics
}
```

2. **Error Tracking**

```javascript
// app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
```

## Dependency Management

### Checking Dependencies

```bash
# Check for outdated packages
npm outdated

# Check with more details
npx npm-check-updates

# Check specific package
npm view [package-name] versions
```

### Updating Dependencies

#### Safe Updates (Patch/Minor)

```bash
# Update within semver ranges
npm update

# Update specific package
npm update [package-name]
```

#### Major Updates

```bash
# Check breaking changes first
npx npm-check-updates -u

# Update package.json
npm install

# Run tests
npm run test:all
```

### Dependency Best Practices

1. **Regular Updates**
   - Check weekly for patch updates
   - Check monthly for minor updates
   - Plan quarterly for major updates

2. **Testing After Updates**

   ```bash
   # Always run after updates
   npm run test:all
   npm run build
   npm run type-check
   ```

3. **Rollback Plan**

   ```bash
   # Before updates
   cp package.json package.json.backup
   cp package-lock.json package-lock.json.backup

   # To rollback
   mv package.json.backup package.json
   mv package-lock.json.backup package-lock.json
   npm ci
   ```

## Security Auditing

### Regular Security Checks

#### Weekly Security Audit

```bash
# Basic audit
npm audit

# Detailed audit
npm audit --json > audit-report.json

# Only show critical
npm audit --audit-level=critical
```

#### Fixing Vulnerabilities

```bash
# Auto-fix (safe)
npm audit fix

# Force fixes (may break)
npm audit fix --force

# Manual fix for specific package
npm install [package-name]@latest
```

### Security Best Practices

1. **Dependency Scanning**
   - Enable Dependabot on GitHub
   - Use `npm audit` in CI/CD pipeline
   - Review security advisories regularly

2. **Code Security**

   ```bash
   # ESLint security rules
   npm install --save-dev eslint-plugin-security

   # Add to .eslintrc
   {
     "plugins": ["security"],
     "extends": ["plugin:security/recommended"]
   }
   ```

3. **Environment Security**
   - Never commit `.env` files
   - Use secrets management
   - Rotate credentials regularly

## Performance Monitoring

### Performance Metrics

#### Build Performance

```bash
# Measure build time
time npm run build

# Analyze bundle
npm run build:analyze

# Check chunk sizes
ls -lh .next/static/chunks/
```

#### Runtime Performance

1. **Lighthouse Audit**

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

2. **Web Vitals Monitoring**

```javascript
// lib/web-vitals.js
export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics
}
```

### Performance Optimization

#### Quick Wins

```bash
# Optimize images
npm run optimize:images

# Minify CSS/JS
npm run build:prod

# Enable compression
npm install compression
```

#### Advanced Optimization

1. Code splitting
2. Lazy loading
3. Resource hints
4. Service worker caching

## Backup Procedures

### Automated Backups

#### Daily Backup Script

```bash
#!/bin/bash
# backup-daily.sh

BACKUP_DIR="/backups/daily"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup code
tar -czf "$BACKUP_DIR/code_$TIMESTAMP.tar.gz" \
  app components lib public package.json

# Backup database
cp -r public/data "$BACKUP_DIR/db_$TIMESTAMP"

# Keep only last 7 days
find "$BACKUP_DIR" -mtime +7 -delete
```

### Manual Backup

#### Full Backup

```bash
# Create backup directory
mkdir -p backups/$(date +%Y%m%d)

# Backup everything
tar -czf backups/$(date +%Y%m%d)/full-backup.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=out \
  .

# Verify backup
tar -tzf backups/$(date +%Y%m%d)/full-backup.tar.gz | head
```

#### Selective Backup

```bash
# Backup source code only
tar -czf code-backup.tar.gz app components lib

# Backup configuration
tar -czf config-backup.tar.gz \
  package.json \
  next.config.js \
  tsconfig.json \
  tailwind.config.js

# Backup data
tar -czf data-backup.tar.gz public/data
```

### Restore Procedures

#### From Full Backup

```bash
# Extract backup
tar -xzf backups/20240101/full-backup.tar.gz

# Reinstall dependencies
npm ci

# Rebuild application
npm run build
```

#### From Selective Backup

```bash
# Restore code
tar -xzf code-backup.tar.gz

# Restore config
tar -xzf config-backup.tar.gz

# Restore data
tar -xzf data-backup.tar.gz
```

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails with memory error

```bash
# Solution: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Problem**: Module not found errors

```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Dependency Issues

**Problem**: Peer dependency conflicts

```bash
# Solution: Use legacy deps
npm install --legacy-peer-deps

# Or force resolutions
npm install --force
```

**Problem**: Package vulnerabilities

```bash
# Solution: Update and audit
npm update
npm audit fix
```

#### Performance Issues

**Problem**: Slow build times

```bash
# Solution: Clear caches
npm run clean:cache
rm -rf .next

# Use Turbopack (experimental)
npm run dev:turbo
```

**Problem**: Large bundle size

```bash
# Solution: Analyze and optimize
npm run build:analyze
# Remove unused dependencies
# Implement code splitting
```

### Debug Mode

#### Enable Debug Logging

```bash
# Set debug environment
DEBUG=* npm run dev

# Specific debug namespace
DEBUG=next:* npm run dev
```

#### Verbose Output

```bash
# npm with verbose
npm install --verbose

# Build with detailed output
npm run build -- --debug
```

## Emergency Procedures

### Critical Failure Recovery

#### 1. Immediate Actions

```bash
# Stop all processes
pkill -f node

# Check system status
node scripts/health-check.js

# Review error logs
tail -n 100 logs/error.log
```

#### 2. Rollback Procedure

```bash
# Revert to last known good commit
git log --oneline -10
git checkout [last-good-commit]

# Restore from backup
tar -xzf backups/last-good-backup.tar.gz

# Reinstall dependencies
rm -rf node_modules
npm ci
```

#### 3. Data Recovery

```bash
# Restore database from backup
cp backups/db/backup.db public/data/

# Validate restored data
npm run db:validate
```

### Disaster Recovery Plan

#### Level 1: Application Issues

1. Run health check
2. Review logs
3. Restart application
4. Clear caches if needed

#### Level 2: Dependency Issues

1. Backup current state
2. Clean node_modules
3. Reinstall dependencies
4. Run tests

#### Level 3: Data Corruption

1. Stop application
2. Backup corrupted data
3. Restore from last backup
4. Validate restoration
5. Run integrity checks

#### Level 4: Complete Failure

1. Document current state
2. Restore from full backup
3. Rebuild application
4. Restore data
5. Full system test

## Maintenance Checklist

### Daily

- [ ] Run health check
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Verify backups completed

### Weekly

- [ ] Update dependencies
- [ ] Run security audit
- [ ] Clean caches
- [ ] Database maintenance
- [ ] Review monitoring alerts

### Monthly

- [ ] Full system maintenance
- [ ] Performance audit
- [ ] Security review
- [ ] Update documentation
- [ ] Test disaster recovery

### Quarterly

- [ ] Major dependency updates
- [ ] Architecture review
- [ ] Security penetration testing
- [ ] Performance optimization
- [ ] Backup restoration test

## Support

### Getting Help

1. **Check Documentation**
   - [User Guide](./USER_GUIDE.md)
   - [API Documentation](./API.md)
   - [Architecture](./ARCHITECTURE.md)

2. **GitHub Issues**
   - [Report bugs](https://github.com/neonwatty/fscrape-frontend/issues)
   - [Request features](https://github.com/neonwatty/fscrape-frontend/issues/new)

3. **Community Support**
   - [Discussions](https://github.com/neonwatty/fscrape-frontend/discussions)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/fscrape)

### Maintenance Logs

All maintenance activities are logged to:

- `logs/maintenance_*.log` - Maintenance script output
- `logs/health-check-*.json` - Health check reports
- `logs/audit_*.json` - Security audit results
- `logs/build_*.log` - Build process logs

---

**Last Updated**: 2025-09-11
**Version**: 1.0.0
