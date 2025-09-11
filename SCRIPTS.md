# NPM Scripts Documentation

This document provides comprehensive documentation for all available npm scripts in the fscrape-frontend project.

## Table of Contents

- [Development](#development)
- [Building](#building)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Database](#database)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Maintenance](#maintenance)

## Development

### `npm run dev`
Starts the Next.js development server on http://localhost:3000
- Hot module replacement enabled
- Error overlay for debugging
- Fast refresh for React components

### `npm run dev:turbo`
Starts development server with Turbopack (experimental)
- Faster bundling and HMR
- Improved performance for large projects

### `npm run dev:debug`
Starts development server with Node.js inspector
- Enables debugging in Chrome DevTools
- Access via chrome://inspect

### `npm run dev:clean`
Cleans build cache and starts fresh development server
- Removes .next and out directories
- Useful when encountering cache issues

## Building

### `npm run build`
Creates production build of the application
- Optimizes bundle size
- Generates static HTML files
- Creates .next and out directories

### `npm run build:prod`
Builds with production environment explicitly set
- Sets NODE_ENV=production
- Applies production optimizations
- Removes development-only code

### `npm run build:analyze`
Builds and analyzes bundle size
- Generates bundle analyzer report
- Helps identify large dependencies
- Useful for optimization

### `npm run build:clean`
Cleans and rebuilds the application
- Removes previous build artifacts
- Ensures fresh build

### `npm start`
Starts production server
- Serves built application
- Requires build to be run first

### `npm run serve`
Serves static export locally
- Uses serve package
- Runs on port 3000 by default

## Code Quality

### `npm run lint`
Runs ESLint on the codebase
- Checks for code quality issues
- Reports warnings and errors

### `npm run lint:fix`
Automatically fixes linting issues
- Fixes formatting problems
- Updates code to match style guide

### `npm run lint:strict`
Runs linting with zero-tolerance for warnings
- Fails on any warning
- Use for CI/CD pipelines

### `npm run type-check`
Runs TypeScript type checking
- Validates types without building
- Reports type errors

### `npm run type-check:watch`
Runs type checking in watch mode
- Continuously checks types
- Useful during development

### `npm run format`
Formats code with Prettier
- Applies consistent formatting
- Updates all files in place

### `npm run format:check`
Checks code formatting without changing files
- Reports formatting issues
- Used in CI/CD

### `npm run check-all`
Runs all quality checks
- Type checking
- Linting
- Format checking

## Testing

### `npm test`
Runs Vitest in watch mode
- Interactive test runner
- Re-runs on file changes

### `npm run test:ui`
Opens Vitest UI
- Visual test interface
- Browse and debug tests

### `npm run test:run`
Runs tests once and exits
- Used in CI/CD
- No watch mode

### `npm run test:watch`
Runs tests in watch mode
- Re-runs affected tests
- Useful during development

### `npm run test:coverage`
Runs tests with coverage report
- Shows code coverage metrics
- Generates coverage directory

### `npm run test:e2e`
Runs Playwright end-to-end tests
- Tests full user workflows
- Runs in headless mode

### `npm run test:e2e:ui`
Opens Playwright test UI
- Visual test runner
- Debug and inspect tests

### `npm run test:e2e:debug`
Runs E2E tests in debug mode
- Step through tests
- Inspect page state

### `npm run test:e2e:headed`
Runs E2E tests with visible browser
- See tests executing
- Useful for debugging

### `npm run test:e2e:install`
Installs Playwright browsers and dependencies
- Required before running E2E tests
- Downloads browser binaries

### `npm run test:all`
Runs all test suites
- Unit tests
- E2E tests

## Database

### `npm run db:update`
Updates or manages the database
```bash
# Generate sample database
npm run db:update -- --generate

# Update from remote
REMOTE_DB_URL=http://example.com/db.sqlite npm run db:update -- --remote

# Backup current database
npm run db:update -- --backup

# Validate database
npm run db:update -- --validate

# Optimize database
npm run db:update -- --optimize
```

### `npm run db:validate`
Validates database structure and content
- Checks schema requirements
- Validates data integrity
- Reports statistics

### `npm run db:backup`
Creates backup of current database
- Copies to backup directory
- Adds timestamp to filename

## Deployment

### `npm run deploy:validate`
Builds and validates static export
- Checks all routes exported
- Validates build output
- Ensures GitHub Pages compatibility

### `npm run deploy:preview`
Builds and previews static site locally
- Serves on port 3001
- Test before deployment

### `npm run deploy:prod`
Runs production deployment script
- Validates environment
- Builds application
- Prepares for deployment

## CI/CD

### `npm run ci`
Runs complete CI pipeline
- All quality checks
- All test suites
- Used in GitHub Actions

### `npm run ci:install`
Installs dependencies for CI
- Uses npm ci for faster install
- Includes legacy peer deps flag

### `npm run ci:test`
Runs tests with CI-specific reporter
- JSON output format
- Machine-readable results

## Maintenance

### `npm run clean`
Complete cleanup and reinstall
- Removes all build artifacts
- Deletes node_modules
- Fresh npm install

### `npm run clean:cache`
Cleans build cache only
- Removes .next and out
- Keeps dependencies

### `npm run clean:deps`
Reinstalls dependencies
- Removes node_modules and package-lock
- Fresh dependency install

### `npm run deps:check`
Checks for dependency updates
- Lists available updates
- Shows version changes

### `npm run deps:update`
Updates all dependencies
- Updates package.json
- Installs new versions

### `npm run deps:audit`
Runs security audit
- Checks for vulnerabilities
- Reports security issues

### `npm run deps:audit:fix`
Attempts to fix vulnerabilities
- Updates vulnerable packages
- May require manual intervention

## Git Hooks

### `npm run precommit`
Runs before git commit
- Runs all quality checks
- Ensures code quality

### `npm run prepush`
Runs before git push
- Runs test suite
- Prevents pushing broken code

## Lifecycle Hooks

### `prebuild`
Automatically runs before build
- Runs quality checks
- Ensures code is valid

### `postbuild`
Automatically runs after build
- Copies .nojekyll file
- Displays success message

### `postinstall`
Automatically runs after npm install
- Installs Playwright dependencies
- Sets up development environment

## Legacy Scripts

These scripts are maintained for backwards compatibility:

- `npm run jest` - Legacy Jest runner
- `npm run jest:watch` - Jest watch mode
- `npm run jest:coverage` - Jest coverage
- `npm run analyze` - Alias for build:analyze
- `npm run validate:export` - Alias for deploy:validate
- `npm run preview:static` - Alias for deploy:preview

## Quick Reference

### Common Development Workflows

```bash
# Start development
npm run dev

# Run tests while developing
npm test

# Check code before committing
npm run check-all

# Build for production
npm run build:prod

# Deploy to GitHub Pages
npm run deploy:validate
```

### Troubleshooting

```bash
# Clear all caches and restart
npm run clean

# Update dependencies
npm run deps:update

# Check for security issues
npm run deps:audit

# Validate database
npm run db:validate
```

## Environment Variables

Some scripts use environment variables:

- `NODE_ENV` - Set to 'development', 'test', or 'production'
- `REMOTE_DB_URL` - URL for remote database updates
- `ANALYZE` - Set to 'true' to enable bundle analysis
- `NEXT_PUBLIC_BASE_PATH` - Base path for deployment
- `NEXT_PUBLIC_ASSET_PREFIX` - Asset prefix for CDN