# Color Mixer 🎨

A beautiful, interactive color mixing application built with Bootstrap 5 and vanilla JavaScript. Mix colors in real-time and explore different color combinations with an intuitive interface.

![Color Mixer Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Color+Mixer+Preview)

## ✨ Features

- **Real-time Color Mixing**: Blend two colors and see instant results
- **Multiple Color Formats**: View colors in HEX, RGB, and HSL formats
- **Interactive Interface**: Smooth animations and responsive design
- **One-click Copy**: Copy color values to clipboard instantly
- **Random Color Generator**: Generate random color combinations
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + R`: Generate random colors
  - `Ctrl/Cmd + C`: Copy mixed color (when not in input field)
- **Accessibility**: Full keyboard navigation and screen reader support
- **Mobile Responsive**: Works perfectly on all device sizes

## 🚀 Live Demo

Visit the live application: [Color Mixer on GitHub Pages](https://clementhamon.github.io/color-mixer/)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.2
- **Icons**: Bootstrap Icons
- **Development**: ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/clementhamon/color-mixer.git
   cd color-mixer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   This will start a live server at `http://localhost:3000/src`

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm run build` | Build project for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is properly formatted |

## 🏗️ Project Structure

```
color-mixer/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── .husky/
│   └── pre-commit             # Git pre-commit hooks
├── src/
│   ├── css/
│   │   └── styles.css         # Custom styles
│   ├── js/
│   │   └── color-mixer.js     # Main application logic
│   └── index.html             # Main HTML file
├── dist/                      # Production build output
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies and scripts
└── README.md               # Project documentation
```

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment process:

1. **Automatic Deployment**: Every push to the `main` branch triggers deployment
2. **Quality Checks**: Code is linted and formatted before deployment
3. **Build Process**: Project is built and optimized for production
4. **GitHub Pages**: Deployed to `https://yourusername.github.io/color-mixer/`

### Manual Deployment Setup

1. **Enable GitHub Pages** in your repository settings
2. **Set source** to "GitHub Actions"
3. **Push to main branch** to trigger deployment

## 🔍 Code Quality

This project maintains high code quality through:

- **ESLint**: JavaScript linting with strict rules
- **Prettier**: Code formatting for consistent style
- **Husky**: Git hooks for pre-commit quality checks
- **GitHub Actions**: Automated CI/CD pipeline

### Code Quality Standards

- ES6+ JavaScript features
- Consistent 2-space indentation
- Single quotes for strings
- Semicolons required
- No unused variables
- JSDoc comments for functions

## 🎨 Color Mixing Algorithm

The application uses linear interpolation in RGB color space:

```javascript
// Mix two colors with a given ratio (0-100)
const mixedColor = {
  r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
  g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
  b: Math.round(color1.b * (1 - ratio) + color2.b * ratio)
};
```

## 🌟 Features Roadmap

- [ ] Color palette generation
- [ ] Color harmony suggestions
- [ ] Save favorite color combinations
- [ ] Export color palettes
- [ ] Color blind accessibility mode
- [ ] Advanced color spaces (LAB, XYZ)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add JSDoc comments for new functions
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [Bootstrap Icons](https://icons.getbootstrap.com/) for the icon set
- [GitHub Pages](https://pages.github.com/) for free hosting
- [GitHub Actions](https://github.com/features/actions) for CI/CD

## 📧 Contact

Clement Hamon - [@clementhamon](https://github.com/clementhamon)

Project Link: [https://github.com/clementhamon/color-mixer](https://github.com/clementhamon/color-mixer)

---

Made with ❤️ and lots of ☕
