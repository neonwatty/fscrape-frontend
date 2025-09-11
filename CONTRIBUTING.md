# Contributing to Forum Scraper Frontend

Thank you for your interest in contributing to Forum Scraper Frontend! We welcome contributions from the community and are excited to work with you.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

Please note that this project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/fscrape-frontend.git
   cd fscrape-frontend
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/neonwatty/fscrape-frontend.git
   ```

## 💻 Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- VS Code (recommended) or your preferred editor

### Initial Setup

```bash
# Install dependencies
npm install

# Set up pre-commit hooks
npm run prepare

# Run tests to verify setup
npm run test

# Start development server
npm run dev
```

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## 🤝 How to Contribute

### Types of Contributions

- **Bug Fixes**: Fix issues reported in GitHub Issues
- **Features**: Implement new features or enhance existing ones
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize code for better performance
- **Accessibility**: Improve accessibility features

### Finding Issues to Work On

- Check [GitHub Issues](https://github.com/neonwatty/fscrape-frontend/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on an issue to express interest before starting work

## 🔄 Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, maintainable code
   - Follow existing patterns and conventions
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   # Run all tests
   npm run test:all
   
   # Type checking
   npm run type-check
   
   # Linting
   npm run lint
   
   # Format code
   npm run format
   ```

4. **Commit your changes** (see [Commit Guidelines](#commit-guidelines))

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type; use proper typing
- Export types/interfaces when reusable
- Use descriptive variable and function names

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Implement proper error boundaries
- Follow React best practices

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and sizing
- Use CSS variables for theming

### File Organization

```
components/
├── ComponentName/
│   ├── ComponentName.tsx       # Main component
│   ├── ComponentName.test.tsx  # Tests
│   ├── ComponentName.stories.tsx # Storybook stories (if applicable)
│   └── index.ts                # Export
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new components and utilities
- Aim for >80% code coverage
- Use descriptive test names
- Test edge cases and error states

```typescript
describe('ComponentName', () => {
  it('should render correctly with default props', () => {
    // Test implementation
  });
  
  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

### E2E Tests

- Add E2E tests for critical user flows
- Test across different viewports
- Include accessibility checks

## 📦 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or corrections
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

### Examples

```bash
feat(dashboard): add new metrics visualization

fix(posts): resolve pagination issue on mobile

docs(readme): update installation instructions

test(analytics): add unit tests for chart components
```

## 🔀 Pull Request Process

1. **Before submitting**:
   - Ensure all tests pass
   - Update documentation
   - Add/update tests as needed
   - Run `npm run validate:export` for static export validation

2. **PR Title**: Use conventional commit format

3. **PR Description**: Include:
   - Summary of changes
   - Related issue numbers
   - Screenshots (for UI changes)
   - Testing steps
   - Breaking changes (if any)

4. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] E2E tests pass
   - [ ] Manual testing completed
   
   ## Screenshots
   (if applicable)
   
   ## Checklist
   - [ ] Code follows project style
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   ```

5. **Review Process**:
   - PRs require at least one approval
   - Address all review comments
   - Keep PR focused and small when possible
   - Resolve conflicts promptly

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/error messages
- Environment details (browser, OS, etc.)

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Mockups/examples (if applicable)

## 📚 Additional Resources

- [Project Architecture](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](docs/API.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎉 Recognition

Contributors will be recognized in:
- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- GitHub contributors page
- Release notes

## 💬 Getting Help

- Open a [GitHub Discussion](https://github.com/neonwatty/fscrape-frontend/discussions)
- Join our community chat (if available)
- Check existing issues and documentation

Thank you for contributing to Forum Scraper Frontend! 🚀