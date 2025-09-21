# Deployment Setup Guide

This guide will help you deploy your Color Mixer application to GitHub Pages with automatic CI/CD.

## Prerequisites

- A GitHub account
- Git installed on your local machine

## Setup Steps

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `color-mixer` (or any name you prefer)
3. **Important**: Do NOT initialize with README, .gitignore, or license (we already have these)

### 2. Connect Local Repository to GitHub

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/color-mixer.git

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. Save the settings

### 4. Automatic Deployment

Once you've pushed your code and enabled GitHub Pages:

1. The GitHub Actions workflow will automatically run
2. It will lint, format, and build your code
3. If everything passes, it will deploy to GitHub Pages
4. Your site will be available at: `https://YOUR_USERNAME.github.io/color-mixer/`

## CI/CD Pipeline Features

The pipeline includes:

- **Code Quality Checks**: ESLint for JavaScript linting
- **Code Formatting**: Prettier for consistent code style
- **Automated Testing**: Ready for future test implementations
- **Automatic Deployment**: Deploys to GitHub Pages on main branch pushes
- **Pre-commit Hooks**: Prevents commits with linting/formatting issues

## Local Development Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Fix linting issues automatically
bun run lint:fix

# Format code
bun run format

# Check if code is properly formatted
bun run format:check
```

## Triggering Deployments

Deployments are triggered automatically when you:

1. Push commits to the `main` branch
2. Create a pull request to the `main` branch (runs checks only)

## Monitoring Deployments

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. You'll see all workflow runs with their status
4. Click on any run to see detailed logs

## Troubleshooting

### If deployment fails:

1. Check the **Actions** tab for error details
2. Common issues:
   - Linting errors: Fix code style issues
   - Formatting errors: Run `bun run format`
   - Build errors: Check for syntax errors

### If site doesn't load:

1. Check that GitHub Pages is enabled
2. Verify the repository is public (required for free GitHub Pages)
3. Wait a few minutes for deployment to complete

### Local development issues:

1. Make sure all dependencies are installed: `bun install`
2. Check Bun version (latest recommended)
3. Clear Bun cache: `bun pm cache rm`

## Security Notes

- The deployment uses GitHub's built-in `GITHUB_TOKEN`
- No additional secrets or tokens are required
- The token only has repository-level permissions

## Customization

To customize the deployment:

1. Edit `.github/workflows/ci-cd.yml`
2. Modify build commands in `package.json`
3. Adjust linting rules in `eslint.config.js`
4. Update formatting rules in `.prettierrc`

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Review the documentation in `README.md`
3. Ensure all prerequisites are met
4. Try running commands locally first
