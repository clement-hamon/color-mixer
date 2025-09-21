# Contributing to Color Mixer

Thank you for your interest in contributing to Color Mixer! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a positive environment for all contributors

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/color-mixer.git
   cd color-mixer
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```

## Code Quality Standards

This project maintains high code quality through automated tools:

### ESLint Configuration
- ES6+ JavaScript features
- Single quotes for strings
- Semicolons required
- 2-space indentation
- No unused variables
- Consistent spacing and formatting

### Prettier Configuration
- 100 character line width
- Single quotes
- No trailing commas
- 2-space indentation

### Pre-commit Hooks
Husky runs automatic checks before each commit:
- ESLint linting
- Prettier formatting check

## Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow existing code style
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   bun run lint        # Check for linting errors
   bun run format      # Format your code
   bun run build       # Test the build process
   bun run dev         # Test locally
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## Commit Message Format

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add color harmony suggestions`
- `fix: resolve color mixing calculation bug`
- `docs: update README with new features`
- `style: fix ESLint warnings in color-mixer.js`

## Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Use a clear, descriptive title
   - Describe what your changes do
   - Reference any related issues
   - Include screenshots for UI changes

4. **Wait for review**
   - Address any feedback
   - Make additional commits if needed
   - Keep the conversation professional

## Types of Contributions

### Bug Reports
- Use the issue templates
- Include steps to reproduce
- Provide browser/environment information
- Include screenshots if relevant

### Feature Requests
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Be open to alternative solutions

### Code Contributions
- New features
- Bug fixes
- Performance improvements
- Code refactoring
- Documentation improvements

### Design Contributions
- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Visual design updates

## Project Structure

```
color-mixer/
├── .github/workflows/     # CI/CD configuration
├── .husky/               # Git hooks
├── src/                  # Source code
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── index.html       # Main HTML file
├── dist/                # Build output
├── docs/                # Documentation
└── package.json         # Dependencies and scripts
```

## Coding Guidelines

### JavaScript
- Use ES6+ features (arrow functions, const/let, template literals)
- Add JSDoc comments for functions
- Handle errors gracefully
- Use meaningful variable names
- Keep functions small and focused

### CSS
- Use CSS custom properties for theming
- Follow BEM methodology when possible
- Ensure responsive design
- Consider accessibility (contrast, focus states)
- Use modern CSS features

### HTML
- Use semantic HTML elements
- Include proper accessibility attributes
- Ensure valid HTML structure
- Optimize for performance

## Testing

Currently, the project uses:
- ESLint for code quality
- Prettier for code formatting
- Manual testing for functionality

Future testing improvements:
- Unit tests for JavaScript functions
- Integration tests for user interactions
- Accessibility testing
- Cross-browser testing

## Documentation

When contributing:
- Update README.md if needed
- Add JSDoc comments for new functions
- Update this CONTRIBUTING.md if process changes
- Include inline comments for complex logic

## Questions and Support

If you have questions:
1. Check existing issues and documentation
2. Create a new issue with the "question" label
3. Be specific about what you need help with

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to Color Mixer! 🎨
