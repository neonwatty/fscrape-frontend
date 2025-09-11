# Forum Scraper Frontend

[![Deploy to GitHub Pages](https://github.com/neonwatty/fscrape-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/neonwatty/fscrape-frontend/actions/workflows/deploy.yml)
[![CI Tests](https://github.com/neonwatty/fscrape-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/neonwatty/fscrape-frontend/actions/workflows/test.yml)
[![Pull Request Checks](https://github.com/neonwatty/fscrape-frontend/actions/workflows/pr.yml/badge.svg)](https://github.com/neonwatty/fscrape-frontend/actions/workflows/pr.yml)

A modern, responsive frontend application for analyzing and visualizing forum data scraped from various platforms.

## 🚀 Features

- **Dashboard Analytics**: Real-time visualization of forum metrics and trends
- **Posts Explorer**: Browse, search, and filter through scraped forum posts
- **Comparison Tools**: Compare metrics across different platforms and time periods
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Static Export**: Fully static site generation for optimal performance
- **PWA Support**: Install as app, work offline, background sync
- **Performance Optimized**: Code splitting, lazy loading, virtualized lists
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Database**: SQL.js (in-browser SQLite)
- **Testing**: Vitest, React Testing Library, Playwright
- **CI/CD**: GitHub Actions
- **PWA**: Service Workers, Web App Manifest
- **Performance**: Web Vitals, Lighthouse CI

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/neonwatty/fscrape-frontend.git
cd fscrape-frontend

# Install dependencies
npm install

# Set up database (if needed)
npm run db:update

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 🏗️ Building

```bash
# Build for production
npm run build

# Build with production environment
npm run build:prod

# Validate static export
npm run validate:export

# Preview static build locally
npm run preview:static
```

## 📊 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `lint` | Run ESLint |
| `type-check` | Run TypeScript type checking |
| `format` | Format code with Prettier |
| `test` | Run Vitest tests |
| `test:e2e` | Run Playwright E2E tests |
| `validate:export` | Validate static export |

## 🚀 Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

```bash
# Build and validate
npm run build
npm run validate:export

# Deploy to GitHub Pages
git push origin main
```

## 📁 Project Structure

```
fscrape-frontend/
├── app/                # Next.js app router pages
├── components/         # React components
│   ├── analytics/     # Analytics components
│   ├── charts/        # Chart components
│   ├── dashboard/     # Dashboard components
│   ├── tables/        # Table components
│   └── ui/           # Base UI components
├── lib/               # Utility functions and hooks
├── public/            # Static assets
├── __tests__/         # Test files
├── e2e/              # E2E test specs
└── .github/          # GitHub Actions workflows
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎯 Performance

The application is optimized for performance:

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 200KB (gzipped)

## 🔐 Security

- Content Security Policy (CSP) headers
- HTTPS enforcement
- Regular dependency updates
- Security scanning in CI/CD pipeline

## 📄 License

This project is licensed under the ISC License. See [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://neonwatty.github.io/fscrape-frontend)
- [Documentation](./docs)
- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Issues](https://github.com/neonwatty/fscrape-frontend/issues)

## 👥 Team

Maintained by the Forum Scraper team. See [CONTRIBUTORS](CONTRIBUTORS.md) for a list of contributors.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)