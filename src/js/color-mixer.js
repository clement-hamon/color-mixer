/**
 * Color Mixer Game JavaScript Application
 * Handles color mixing game mechanics, level progression, and user interactions
 */

class ColorMixerGame {
  constructor() {
    this.gameConfig = null;
    this.currentLevel = 1;
    this.currentScore = 0;
    this.attemptsLeft = 10;
    this.timeLeft = 300; // 5 minutes
    this.gameTimer = null;
    this.mixingSlots = [];
    this.playerColor = '#000000';
    this.isGameActive = false;

    this.initializeElements();
    this.loadGameConfig();
    this.initializeHeroAnimation();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.elements = {
      // Game stats
      currentLevel: document.getElementById('currentLevel'),
      currentScore: document.getElementById('currentScore'),
      attemptsLeft: document.getElementById('attemptsLeft'),
      timeLeft: document.getElementById('timeLeft'),

      // Target color
      targetColorPreview: document.getElementById('targetColorPreview'),
      levelName: document.getElementById('levelName'),
      levelDescription: document.getElementById('levelDescription'),
      hintText: document.getElementById('hintText'),

      // Game areas
      availableColorsContainer: document.getElementById('availableColorsContainer'),
      mixingCanvas: document.getElementById('mixingCanvas'),
      playerColorPreview: document.getElementById('playerColorPreview'),

      // Color comparison
      matchProgress: document.getElementById('matchProgress'),
      playerHex: document.getElementById('playerHex'),
      targetHex: document.getElementById('targetHex'),
      submitBtn: document.getElementById('submitBtn'),

      // Other
      heroColorPreview: document.getElementById('heroColorPreview'),
      brandLink: document.getElementById('brandLink')
    };

    // Check if critical elements exist
    const criticalElements = ['availableColorsContainer', 'mixingCanvas', 'playerColorPreview'];
    const missingElements = criticalElements.filter((id) => !this.elements[id]);

    if (missingElements.length > 0) {
      console.warn('Missing critical DOM elements:', missingElements);
    }

    this.bindEventListeners();
  }

  /**
   * Bind event listeners to DOM elements
   */
  bindEventListeners() {
    // Brand link click - check if element exists first
    if (this.elements.brandLink) {
      this.elements.brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToTop();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            this.resetGame();
            break;
          case 'h':
            e.preventDefault();
            this.showHint();
            break;
        }
      }
    });
  }

  /**
   * Load game configuration from JSON file
   */
  async loadGameConfig() {
    try {
      const response = await fetch('data/game-config.json');
      this.gameConfig = await response.json();
      this.initializeGame();
    } catch (error) {
      console.error('Failed to load game configuration:', error);
      this.showNotification('Failed to load game configuration', 'error');
    }
  }

  /**
   * Initialize the game with the first level
   */
  initializeGame() {
    this.currentLevel = 1;
    this.currentScore = 0;
    this.attemptsLeft = this.gameConfig.gameSettings.maxAttempts;
    this.timeLeft = this.gameConfig.gameSettings.timeLimit;
    this.isGameActive = true;

    this.updateGameStats();
    this.loadLevel(this.currentLevel);
    this.startTimer();
  }

  /**
   * Load a specific level
   */
  loadLevel(levelNumber) {
    const level = this.gameConfig.levels.find((l) => l.id === levelNumber);
    if (!level) {
      this.endGame();
      return;
    }

    this.currentLevelData = level;

    // Update level info
    this.elements.levelName.textContent = level.name;
    this.elements.levelDescription.textContent = level.description;
    this.elements.hintText.textContent = level.hints[0];
    this.elements.targetColorPreview.style.backgroundColor = level.targetColor;
    this.elements.targetHex.textContent = level.targetColor;

    // Setup available colors
    this.setupAvailableColors(level.availableColors);

    // Setup mixing canvas
    this.setupMixingCanvas(level.mixingSlots);

    // Reset player color
    this.playerColor = '#000000';
    this.updatePlayerColor();
  }

  /**
   * Setup available colors palette
   */
  setupAvailableColors(colors) {
    this.elements.availableColorsContainer.innerHTML = '';

    colors.forEach((color, _index) => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'col-md-2 mb-3';
      colorDiv.innerHTML = `
        <div class="available-color" style="background-color: ${color}" 
             data-color="${color}" 
             onclick="selectAvailableColor('${color}')">
          <div class="color-label">${color}</div>
        </div>
      `;
      this.elements.availableColorsContainer.appendChild(colorDiv);
    });
  }

  /**
   * Setup mixing canvas slots
   */
  setupMixingCanvas(slotCount) {
    this.elements.mixingCanvas.innerHTML = '';
    this.mixingSlots = new Array(slotCount).fill(null);

    for (let i = 0; i < slotCount; i++) {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'col-md-2 mb-3';
      slotDiv.innerHTML = `
        <div class="mixing-slot empty" data-slot="${i}" onclick="clearMixingSlot(${i})">
          <div class="slot-label">Slot ${i + 1}</div>
          <div class="remove-btn" style="display: none;">×</div>
        </div>
      `;
      this.elements.mixingCanvas.appendChild(slotDiv);
    }
  }

  /**
   * Select an available color
   */
  selectAvailableColor(color) {
    const emptySlot = this.mixingSlots.findIndex((slot) => slot === null);
    if (emptySlot !== -1) {
      this.addColorToSlot(color, emptySlot);
    } else {
      this.showNotification('All mixing slots are full! Clear a slot first.', 'warning');
    }
  }

  /**
   * Add color to mixing slot
   */
  addColorToSlot(color, slotIndex) {
    this.mixingSlots[slotIndex] = color;
    const slotElement = document.querySelector(`[data-slot="${slotIndex}"]`);
    slotElement.style.backgroundColor = color;
    slotElement.classList.remove('empty');
    slotElement.querySelector('.slot-label').textContent = color;
    slotElement.querySelector('.remove-btn').style.display = 'block';

    this.updateMixedColor();
  }

  /**
   * Clear a mixing slot
   */
  clearMixingSlot(slotIndex) {
    this.mixingSlots[slotIndex] = null;
    const slotElement = document.querySelector(`[data-slot="${slotIndex}"]`);
    slotElement.style.backgroundColor = '';
    slotElement.classList.add('empty');
    slotElement.querySelector('.slot-label').textContent = `Slot ${slotIndex + 1}`;
    slotElement.querySelector('.remove-btn').style.display = 'none';

    this.updateMixedColor();
  }

  /**
   * Clear all mixing slots
   */
  clearMixingCanvas() {
    for (let i = 0; i < this.mixingSlots.length; i++) {
      this.clearMixingSlot(i);
    }
  }

  /**
   * Update mixed color based on current mixing slots
   */
  updateMixedColor() {
    const activeColors = this.mixingSlots.filter((color) => color !== null);
    
    if (activeColors.length === 0) {
      this.playerColor = '#000000';
    } else if (activeColors.length === 1) {
      this.playerColor = activeColors[0];
    } else {
      this.playerColor = this.blendMultipleColors(activeColors);
    }

    this.updatePlayerColor();
    this.checkColorMatch();
  }

  /**
   * Mix colors in the mixing slots
   */
  mixColors() {
    const activeColors = this.mixingSlots.filter((color) => color !== null);
    if (activeColors.length === 0) {
      this.showNotification('Add colors to mixing slots first!', 'warning');
      return;
    }

    this.updateMixedColor();
  }

  /**
   * Blend multiple colors together
   */
  blendMultipleColors(colors) {
    if (colors.length === 0) {
      return '#000000';
    }
    if (colors.length === 1) {
      return colors[0];
    }

    let totalR = 0,
      totalG = 0,
      totalB = 0;

    colors.forEach((color) => {
      const rgb = this.hexToRgb(color);
      totalR += rgb.r;
      totalG += rgb.g;
      totalB += rgb.b;
    });

    const avgR = Math.round(totalR / colors.length);
    const avgG = Math.round(totalG / colors.length);
    const avgB = Math.round(totalB / colors.length);

    return this.rgbToHex(avgR, avgG, avgB);
  }

  /**
   * Update player color display
   */
  updatePlayerColor() {
    this.elements.playerColorPreview.style.backgroundColor = this.playerColor;
    this.elements.playerHex.textContent = this.playerColor;
  }

  /**
   * Check if player color matches target
   */
  checkColorMatch() {
    const targetRgb = this.hexToRgb(this.currentLevelData.targetColor);
    const playerRgb = this.hexToRgb(this.playerColor);

    const colorDistance = this.calculateColorDistance(targetRgb, playerRgb);
    const maxDistance = Math.sqrt(3 * 255 * 255); // Maximum possible distance
    const similarity = Math.max(0, 100 - (colorDistance / maxDistance) * 100);

    this.elements.matchProgress.style.width = `${similarity}%`;
    this.elements.matchProgress.textContent = `${Math.round(similarity)}%`;

    // Update progress bar color based on similarity
    this.elements.matchProgress.className = 'progress-bar';
    if (similarity >= 90) {
      this.elements.matchProgress.classList.add('bg-success');
    } else if (similarity >= 70) {
      this.elements.matchProgress.classList.add('bg-warning');
    } else {
      this.elements.matchProgress.classList.add('bg-danger');
    }

    // Enable submit button if close enough
    const isCloseEnough = colorDistance <= this.currentLevelData.tolerance;
    this.elements.submitBtn.disabled = !isCloseEnough;

    return { similarity, isMatch: isCloseEnough };
  }

  /**
   * Calculate color distance using Euclidean distance
   */
  calculateColorDistance(rgb1, rgb2) {
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  /**
   * Submit the current color
   */
  submitColor() {
    const result = this.checkColorMatch();

    if (result.isMatch) {
      this.handleCorrectAnswer(result.similarity);
    } else {
      this.handleIncorrectAnswer();
    }
  }

  /**
   * Handle correct answer
   */
  handleCorrectAnswer(similarity) {
    let points = 0;
    if (similarity >= 95) {
      points = this.gameConfig.gameSettings.scoreMultiplier.perfect;
      this.showNotification('Perfect match! 🎉', 'success');
    } else if (similarity >= 85) {
      points = this.gameConfig.gameSettings.scoreMultiplier.close;
      this.showNotification('Great match! 👏', 'success');
    } else {
      points = this.gameConfig.gameSettings.scoreMultiplier.far;
      this.showNotification('Good enough! ✓', 'success');
    }

    this.currentScore += points;
    this.currentLevel++;

    setTimeout(() => {
      if (this.currentLevel <= this.gameConfig.levels.length) {
        this.loadLevel(this.currentLevel);
        this.updateGameStats();
      } else {
        this.winGame();
      }
    }, 2000);
  }

  /**
   * Handle incorrect answer
   */
  handleIncorrectAnswer() {
    this.attemptsLeft--;
    this.updateGameStats();

    if (this.attemptsLeft <= 0) {
      this.endGame();
    } else {
      this.showNotification(`Not quite right. ${this.attemptsLeft} attempts left.`, 'warning');
    }
  }

  /**
   * Start game timer
   */
  startTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      this.updateTimeDisplay();

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  /**
   * Update time display
   */
  updateTimeDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.elements.timeLeft.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Update game statistics display
   */
  updateGameStats() {
    this.elements.currentLevel.textContent = this.currentLevel;
    this.elements.currentScore.textContent = this.currentScore;
    this.elements.attemptsLeft.textContent = this.attemptsLeft;
  }

  /**
   * Show hint for current level
   */
  showHint() {
    if (this.currentLevelData && this.currentLevelData.hints.length > 0) {
      const hint =
        this.currentLevelData.hints[Math.floor(Math.random() * this.currentLevelData.hints.length)];
      this.showNotification(`Hint: ${hint}`, 'info');
    }
  }

  /**
   * Skip current level
   */
  skipLevel() {
    if (this.attemptsLeft > 1) {
      this.attemptsLeft -= 2; // Penalty for skipping
      this.currentLevel++;

      if (this.currentLevel <= this.gameConfig.levels.length) {
        this.loadLevel(this.currentLevel);
        this.updateGameStats();
        this.showNotification('Level skipped!', 'info');
      } else {
        this.endGame();
      }
    } else {
      this.showNotification('Not enough attempts to skip!', 'warning');
    }
  }

  /**
   * Reset the game
   */
  resetGame() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.initializeGame();
    this.showNotification('Game reset!', 'info');
  }

  /**
   * End the game
   */
  endGame() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.isGameActive = false;

    this.showNotification(`Game Over! Final Score: ${this.currentScore}`, 'info');

    // Show restart option
    setTimeout(() => {
      if (confirm('Game Over! Would you like to restart?')) {
        this.resetGame();
      }
    }, 2000);
  }

  /**
   * Win the game
   */
  winGame() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.isGameActive = false;

    this.showNotification(
      `🎉 Congratulations! You completed all levels! Final Score: ${this.currentScore}`,
      'success'
    );

    setTimeout(() => {
      if (confirm('Congratulations! You won! Play again?')) {
        this.resetGame();
      }
    }, 3000);
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
   * Scroll to game section
   */
  scrollToGame() {
    document.getElementById('game').scrollIntoView({
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
function scrollToGame() {
  window.colorMixerGame.scrollToGame();
}

function selectAvailableColor(color) {
  window.colorMixerGame.selectAvailableColor(color);
}

function clearMixingSlot(slotIndex) {
  window.colorMixerGame.clearMixingSlot(slotIndex);
}

function mixColors() {
  window.colorMixerGame.mixColors();
}

function clearMixingCanvas() {
  window.colorMixerGame.clearMixingCanvas();
}

function submitColor() {
  window.colorMixerGame.submitColor();
}

function showHint() {
  window.colorMixerGame.showHint();
}

function skipLevel() {
  window.colorMixerGame.skipLevel();
}

function resetGame() {
  window.colorMixerGame.resetGame();
}
/* eslint-enable no-unused-vars */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.colorMixerGame = new ColorMixerGame();
  console.log('Color Mixer Game initialized successfully!');
});
