/**
 * Color Mixer JavaScript Application
 * Handles color mixing, conversion, and user interactions
 */

class ColorMixer {
  constructor() {
    this.color1 = '#ff6b6b';
    this.color2 = '#4ecdc4';
    this.mixRatio = 50;
    this.mixedColor = '';

    this.initializeElements();
    this.bindEventListeners();
    this.updateMixedColor();
    this.initializeHeroAnimation();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.elements = {
      color1Input: document.getElementById('color1'),
      color2Input: document.getElementById('color2'),
      color1Hex: document.getElementById('color1Hex'),
      color2Hex: document.getElementById('color2Hex'),
      mixRatio: document.getElementById('mixRatio'),
      ratioValue: document.getElementById('ratioValue'),
      color1Preview: document.getElementById('color1Preview'),
      color2Preview: document.getElementById('color2Preview'),
      mixedColorPreview: document.getElementById('mixedColorPreview'),
      mixedHex: document.getElementById('mixedHex'),
      mixedRgb: document.getElementById('mixedRgb'),
      mixedHsl: document.getElementById('mixedHsl'),
      heroColorPreview: document.getElementById('heroColorPreview'),
      brandLink: document.getElementById('brandLink')
    };
  }

  /**
   * Bind event listeners to DOM elements
   */
  bindEventListeners() {
    // Color input events
    this.elements.color1Input.addEventListener('input', (e) => {
      this.updateColor1(e.target.value);
    });

    this.elements.color2Input.addEventListener('input', (e) => {
      this.updateColor2(e.target.value);
    });

    // Hex input events
    this.elements.color1Hex.addEventListener('input', (e) => {
      if (this.isValidHex(e.target.value)) {
        this.updateColor1(e.target.value);
      }
    });

    this.elements.color2Hex.addEventListener('input', (e) => {
      if (this.isValidHex(e.target.value)) {
        this.updateColor2(e.target.value);
      }
    });

    // Mix ratio slider
    this.elements.mixRatio.addEventListener('input', (e) => {
      this.updateMixRatio(parseInt(e.target.value));
    });

    // Brand link click
    this.elements.brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            this.randomizeColors();
            break;
          case 'c':
            if (e.target.tagName !== 'INPUT') {
              e.preventDefault();
              this.copyToClipboard();
            }
            break;
        }
      }
    });
  }

  /**
   * Update color 1
   * @param {string} color - Hex color value
   */
  updateColor1(color) {
    this.color1 = color;
    this.elements.color1Input.value = color;
    this.elements.color1Hex.value = color;
    this.elements.color1Preview.style.backgroundColor = color;
    this.updateMixedColor();
  }

  /**
   * Update color 2
   * @param {string} color - Hex color value
   */
  updateColor2(color) {
    this.color2 = color;
    this.elements.color2Input.value = color;
    this.elements.color2Hex.value = color;
    this.elements.color2Preview.style.backgroundColor = color;
    this.updateMixedColor();
  }

  /**
   * Update mix ratio
   * @param {number} ratio - Mix ratio (0-100)
   */
  updateMixRatio(ratio) {
    this.mixRatio = ratio;
    this.elements.ratioValue.textContent = `${ratio}%`;
    this.updateMixedColor();
  }

  /**
   * Mix two colors based on the current ratio
   */
  updateMixedColor() {
    const rgb1 = this.hexToRgb(this.color1);
    const rgb2 = this.hexToRgb(this.color2);

    if (!rgb1 || !rgb2) {
      return;
    }

    const ratio = this.mixRatio / 100;
    const mixedRgb = {
      r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
      g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
      b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)
    };

    this.mixedColor = this.rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);

    this.updateMixedColorDisplay(mixedRgb);
  }

  /**
   * Update the mixed color display
   * @param {Object} rgb - RGB color object
   */
  updateMixedColorDisplay(rgb) {
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Update preview
    this.elements.mixedColorPreview.style.backgroundColor = this.mixedColor;

    // Update color information
    this.elements.mixedHex.textContent = this.mixedColor;
    this.elements.mixedRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    this.elements.mixedHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    // Add animation class
    this.elements.mixedColorPreview.classList.add('fade-in-up');
    setTimeout(() => {
      this.elements.mixedColorPreview.classList.remove('fade-in-up');
    }, 600);
  }

  /**
   * Generate random colors
   */
  randomizeColors() {
    const randomColor1 = this.generateRandomColor();
    const randomColor2 = this.generateRandomColor();

    this.updateColor1(randomColor1);
    this.updateColor2(randomColor2);

    // Add some visual feedback
    this.showNotification('Random colors generated!', 'success');
  }

  /**
   * Generate a random hex color
   * @returns {string} Random hex color
   */
  generateRandomColor() {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  }

  /**
   * Copy mixed color hex to clipboard
   */
  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.mixedColor);
      this.showNotification('Color copied to clipboard!', 'success');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.mixedColor;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Color copied to clipboard!', 'success');
    }
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  /**
   * Initialize hero section color animation
   */
  initializeHeroAnimation() {
    let animationId;

    const animateHeroColor = () => {
      const time = Date.now() * 0.001;
      const color1 = this.generateAnimatedColor(time, 0);
      const color2 = this.generateAnimatedColor(time, Math.PI);

      if (this.elements.heroColorPreview) {
        this.elements.heroColorPreview.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
      }

      animationId = requestAnimationFrame(animateHeroColor);
    };

    animateHeroColor();

    // Stop animation when not in view to save performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateHeroColor();
        } else {
          cancelAnimationFrame(animationId);
        }
      });
    });

    if (this.elements.heroColorPreview) {
      observer.observe(this.elements.heroColorPreview);
    }
  }

  /**
   * Generate animated color for hero section
   * @param {number} time - Current time
   * @param {number} offset - Phase offset
   * @returns {string} Hex color
   */
  generateAnimatedColor(time, offset) {
    const r = Math.floor(127 + 127 * Math.sin(time * 0.5 + offset));
    const g = Math.floor(127 + 127 * Math.sin(time * 0.3 + offset + Math.PI / 3));
    const b = Math.floor(127 + 127 * Math.sin(time * 0.7 + offset + (Math.PI * 2) / 3));

    return this.rgbToHex(r, g, b);
  }

  /**
   * Scroll to mixer section
   */
  scrollToMixer() {
    document.getElementById('mixer').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  /**
   * Scroll to top
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color
   * @returns {Object|null} RGB object or null if invalid
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  /**
   * Convert RGB to hex
   * @param {number} r - Red value
   * @param {number} g - Green value
   * @param {number} b - Blue value
   * @returns {string} Hex color
   */
  rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  /**
   * Convert RGB to HSL
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {Object} HSL object
   */
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Validate hex color
   * @param {string} hex - Hex color to validate
   * @returns {boolean} Whether the hex is valid
   */
  isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }
}

// Global functions for HTML onclick handlers
/* eslint-disable no-unused-vars */
function scrollToMixer() {
  colorMixer.scrollToMixer();
}

function randomizeColors() {
  colorMixer.randomizeColors();
}

function copyToClipboard() {
  colorMixer.copyToClipboard();
}
/* eslint-enable no-unused-vars */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.colorMixer = new ColorMixer();
  console.log('Color Mixer initialized successfully!');
});

// Add some performance monitoring in development
if (process?.env?.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    console.log('Page load performance:', {
      domContentLoaded: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
      loadComplete: performance.getEntriesByType('navigation')[0].loadEventEnd
    });
  });
}
