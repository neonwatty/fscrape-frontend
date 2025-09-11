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

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Database**: SQL.js (in-browser SQLite)
- **Testing**: Vitest, React Testing Library, Playwright
- **CI/CD**: GitHub Actions

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/neonwatty/fscrape-frontend.git
cd fscrape-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

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

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [Live Demo](https://neonwatty.github.io/fscrape-frontend)
- [Documentation](https://github.com/neonwatty/fscrape-frontend/wiki)
- [Issues](https://github.com/neonwatty/fscrape-frontend/issues)