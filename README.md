# Toaster-Timer-Legacy

## Toaster (Beta) is available!! 
<div align="center">
  
<img width="6400" height="2400" alt="toaster- banner-logos" src="https://github.com/user-attachments/assets/1d585f40-b556-4f00-98ec-af1b870d3d87" />

**Toaster (Beta) is the world's first ai powered rubik's cube learning platform**

Check out the latest version at [Toaster (Beta)](https://toaster.cloustan.org).
More details coming soon.

# Toaster-Timer-Legacy
This project is deprecated and is **no longer maintaned.**

[View the Project](#about) • [Getting Started](#getting-started) • [Features](#features) • [Documentation](#documentation) • [Contributing](#contributing)


![GitHub License](https://img.shields.io/github/license/breadcubing/Toaster-Timer-Legacy)
![GitHub Stars](https://img.shields.io/github/stars/breadcubing/Toaster-Timer-Legacy)
![GitHub Last Commit](https://img.shields.io/github/last-commit/breadcubing/Toaster-Timer-Legacy)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## About

**Toaster-Timer-Legacy** is the legacy version of Toaster, a professional-grade **Rubik's Cube solving timer** and **scramble generator**. This repository serves as the foundation for the AI-powered interactive learning platform for cubing.

> **Related Project:** Check out the latest version at [Toaster (Beta)](https://github.com/cloustan/toaster) for the modern implementation!

### Why Toaster?

- ⚡ **Lightning Fast**: Optimized performance for competitive timing
- 🎯 **Accurate**: Precise timing measurements for serious cubers
- 🧩 **Smart Scrambles**: Generate valid Rubik's Cube scrambles
- 🎓 **Learning Platform**: Foundation for AI-powered cubing education
- 💻 **Open Source**: Community-driven development

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Precision Timer** | High-resolution timing with millisecond accuracy |
| **Scramble Generator** | Generate valid Rubik's Cube scrambles (2×2 to 7×7) |
| **Time Statistics** | Track and analyze your solve times |
| **Solve History** | Maintain complete solve records |
| **Inspection Time** | Official 15-second inspection period |

### Advanced Features

```
✓ Multiple puzzle types support
✓ Customizable timer settings
✓ Time statistics and analytics
✓ Export solve data
✓ Dark/Light theme support
✓ Responsive design
✓ Keyboard shortcuts
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/breadcubing/Toaster-Timer-Legacy.git
cd Toaster-Timer-Legacy
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

4. **Open in browser**

Navigate to `http://localhost:3000` in your web browser.

### Usage

#### Basic Timer Usage

1. Press **SPACE** or click **START** to begin timing
2. Release **SPACE** to stop the timer
3. Your time will be recorded in the history

#### Generate Scrambles

- The scramble generator creates valid sequences for your current puzzle
- Supports standard WCA (World Cube Association) notation
- Click **NEW SCRAMBLE** to generate a new sequence

#### View Statistics

- Access your statistics dashboard to view:
  - Average of 5 (Ao5)
  - Average of 12 (Ao12)
  - Average of 100 (Ao100)
  - Personal Best (PB)
  - Session statistics

---

## Project Structure

```
Toaster-Timer-Legacy/
├── timer-legacy/              # Main application directory
│   ├── public/                # Static assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS stylesheets
│   │   └── App.js             # Main App component
│   └── package.json           # Dependencies
├── LICENSE                    # License file
├── README.md                  # This file
└── .gitignore                # Git ignore rules
```

---

## Documentation

### Timer API

```javascript
// Initialize timer
const timer = new Timer();

// Start timing
timer.start();

// Stop timing and get result
const time = timer.stop(); // Returns time in milliseconds
```

### Scramble Generation

```javascript
// Generate scramble
const scramble = generateScramble('3x3'); // Options: '2x2', '3x3', '4x4', etc.

// Get readable format
console.log(scramble.toString()); // e.g., "R U R' U' R' F R2 U' R' U' R U R' F'"
```

### Time Calculations

```javascript
// Calculate average
const average = calculateAverage(times);

// Get statistics
const stats = getStatistics(timeArray);
// Returns: { min, max, mean, median, stdDev }
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
REACT_APP_TIMER_PRECISION=high
```

### Puzzle Types

| Puzzle | Code | Support |
|--------|------|---------|
| 2×2 | `2x2` | ✅ |
| 3×3 | `3x3` | ✅ |
| 4×4 | `4x4` | ✅ |
| 5×5 | `5x5` | ✅ |
| 6×6 | `6x6` | ✅ |
| 7×7 | `7x7` | ✅ |

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write clear commit messages
- Add comments for complex logic

### Development Workflow

```bash
# Install dev dependencies
npm install --save-dev

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test

# Build for production
npm run build
```

---

## Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Scramble Generation | ~2ms | Average 3×3 scramble |
| Timer Start | <1ms | Sub-millisecond response |
| Time Calculation | ~0.5ms | For 100 times |

---

## Troubleshooting

### Common Issues

**Timer not starting?**
- Ensure your browser allows microphone access (if using voice control)
- Try clearing browser cache and reloading
- Check browser console for errors

**Scramble appears invalid?**
- Verify you're using the correct puzzle type
- Scrambles follow WCA standard notation
- Report issues if problems persist

**Performance issues?**
- Reduce history size in settings
- Close other browser tabs
- Update to the latest version

---

## Roadmap

- [ ] Multi-language support
- [ ] Cloud synchronization
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Integration with CubeComps
- [ ] Video recording support

---

## Technology Stack

### Frontend
- **React** - UI Framework
- **Redux** - State Management
- **Tailwind CSS** - Styling
- **Chart.js** - Statistics Visualization

### Development Tools
- **Webpack** - Module bundler
- **Babel** - JavaScript compiler
- **ESLint** - Code linter
- **Jest** - Testing framework

---

## License

This project is licensed under the [BSL LICENSE](LICENSE) - see the LICENSE file for details.

---

## Acknowledgments

### Contributors

Thanks to all contributors who have helped with this project:

- **[breadcubing](https://github.com/breadcubing)** - Creator & Maintainer
- **[cloustan](https://github.com/cloustan)** - Original Toaster project

### Related Projects

- 🎯 [Toaster Beta](https://github.com/cloustan/toaster) - Modern version
- 📊 [CubeComps](https://www.cubecomps.com/) - Competition management
- 🏆 [WCA](https://www.worldcubeassociation.org/) - World Cube Association

### Resources

- [Cubing Guide](https://www.cubeskills.com/)
- [Roux Method](https://www.roux.ninja/)
- [CFOP Method](https://www.speedcubing.org/)

---

## Support & Contact

### Getting Help

- Active support is not provided, this project is deprecated and is **no longer maintaned.**
if you are using [Toaster (Beta)](https://github.com/cloustan/toaster), please use the report bug button on the dashboard of [Toaster (Beta)](https://github.com/cloustan/toaster).
- 📖 **Documentation**: See docs/ folder

### Quick Links

- [Report a Bug](https://github.com/breadcubing/Toaster-Timer-Legacy/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/breadcubing/Toaster-Timer-Legacy/issues/new?template=feature_request.md)
- [View Pull Requests](https://github.com/breadcubing/Toaster-Timer-Legacy/pulls)

---

<div align="center">

**[⬆ back to top](#-toaster-timer-legacy)**

Made with ❤️ by the Cubing Community

[GitHub](https://github.com/breadcubing/Toaster-Timer-Legacy) • [Issues](https://github.com/breadcubing/Toaster-Timer-Legacy/issues) • [Discussions](https://github.com/breadcubing/Toaster-Timer-Legacy/discussions)

</div>
