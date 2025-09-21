import { GameConfig, Level, ColorMatchResult } from '../types/Game.js';
import { GameElements } from '../types/DOM.js';
import { ColorUtils } from '../utils/ColorUtils.js';
import { DOMUtils } from '../utils/DOMUtils.js';
import { NotificationUtils } from '../utils/NotificationUtils.js';
import { ConfigService } from '../services/ConfigService.js';
import { GameStateManager } from './GameState.js';
import { GameStats } from '../components/GameStats.js';
import { ColorPalette } from '../components/ColorPalette.js';
import { MixingCanvas } from '../components/MixingCanvas.js';
import { ColorComparison } from '../components/ColorComparison.js';

export class ColorMixerGame {
  private gameConfig!: GameConfig;
  private gameState!: GameStateManager;
  private elements: GameElements;
  private gameTimer: ReturnType<typeof setInterval> | null = null;
  private animationId: number | null = null;

  // Components
  private gameStats: GameStats;
  private colorPalette: ColorPalette;
  private mixingCanvas: MixingCanvas;
  private colorComparison: ColorComparison;

  constructor() {
    this.elements = DOMUtils.initializeElements();
    this.gameStats = new GameStats(this.elements);
    this.colorPalette = new ColorPalette(this.elements);
    this.mixingCanvas = new MixingCanvas(this.elements);
    this.colorComparison = new ColorComparison(this.elements);

    this.bindEventListeners();
    this.loadGameConfig();
    this.initializeHeroAnimation();
  }

  /**
   * Bind event listeners to DOM elements
   */
  private bindEventListeners(): void {
    // Brand link click
    if (this.elements.brandLink) {
      this.elements.brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        DOMUtils.scrollToTop();
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
   * Load game configuration and initialize
   */
  private async loadGameConfig(): Promise<void> {
    try {
      this.gameConfig = await ConfigService.loadGameConfig();
      this.gameState = new GameStateManager(this.gameConfig);
      this.initializeGame();
    } catch (error) {
      console.error('Failed to load game configuration:', error);
      NotificationUtils.showNotification('Failed to load game configuration', 'error');
    }
  }

  /**
   * Initialize the game with the first level
   */
  private initializeGame(): void {
    const state = this.gameState.getState();
    this.gameStats.updateGameStats(state.currentLevel, state.currentScore, state.attemptsLeft);
    this.loadLevel(state.currentLevel);
    this.startTimer();
  }

  /**
   * Load a specific level
   */
  private loadLevel(levelNumber: number): void {
    const level = this.gameState.getCurrentLevel();
    if (!level) {
      this.endGame();
      return;
    }

    // Update level info
    if (this.elements.levelName) this.elements.levelName.textContent = level.name;
    if (this.elements.levelDescription)
      this.elements.levelDescription.textContent = level.description;
    if (this.elements.hintText) this.elements.hintText.textContent = level.hints[0];
    if (this.elements.targetColorPreview) {
      this.elements.targetColorPreview.style.backgroundColor = level.targetColor;
    }
    if (this.elements.targetHex) this.elements.targetHex.textContent = level.targetColor;

    // Setup game components
    this.colorPalette.setupAvailableColors(level.availableColors);
    this.mixingCanvas.setupMixingCanvas(level.mixingSlots);
    this.gameState.initializeMixingSlots(level.mixingSlots);

    // Reset player color
    this.gameState.updateState({ playerColor: '#000000' });
    this.updatePlayerColor();
  }

  /**
   * Select an available color
   */
  selectAvailableColor(color: string): void {
    const state = this.gameState.getState();
    const emptySlot = state.mixingSlots.findIndex((slot) => slot === null);

    if (emptySlot !== -1) {
      this.addColorToSlot(color, emptySlot);
    } else {
      NotificationUtils.showNotification(
        'All mixing slots are full! Clear a slot first.',
        'warning'
      );
    }
  }

  /**
   * Add color to mixing slot
   */
  private addColorToSlot(color: string, slotIndex: number): void {
    this.gameState.addColorToSlot(color, slotIndex);
    this.mixingCanvas.updateSlot(slotIndex, color);
    this.updateMixedColor();
  }

  /**
   * Clear a mixing slot
   */
  clearMixingSlot(slotIndex: number): void {
    this.gameState.clearSlot(slotIndex);
    this.mixingCanvas.updateSlot(slotIndex, null);
    this.updateMixedColor();
  }

  /**
   * Clear all mixing slots
   */
  clearMixingCanvas(): void {
    const state = this.gameState.getState();
    for (let i = 0; i < state.mixingSlots.length; i++) {
      this.clearMixingSlot(i);
    }
  }

  /**
   * Update mixed color based on current mixing slots
   */
  private updateMixedColor(): void {
    const activeColors = this.gameState.getActiveColors();
    let playerColor: string;

    if (activeColors.length === 0) {
      playerColor = '#000000';
    } else if (activeColors.length === 1) {
      playerColor = activeColors[0];
    } else {
      playerColor = ColorUtils.blendMultipleColors(activeColors);
    }

    this.gameState.updateState({ playerColor });
    this.updatePlayerColor();
    this.checkColorMatch();
  }

  /**
   * Mix colors in the mixing slots
   */
  mixColors(): void {
    const activeColors = this.gameState.getActiveColors();
    if (activeColors.length === 0) {
      NotificationUtils.showNotification('Add colors to mixing slots first!', 'warning');
      return;
    }
    this.updateMixedColor();
  }

  /**
   * Update player color display
   */
  private updatePlayerColor(): void {
    const state = this.gameState.getState();
    this.colorComparison.updatePlayerColor(state.playerColor);
  }

  /**
   * Check if player color matches target
   */
  private checkColorMatch(): ColorMatchResult {
    const state = this.gameState.getState();
    const level = this.gameState.getCurrentLevel();

    if (!level) {
      return { similarity: 0, isMatch: false };
    }

    return this.colorComparison.checkColorMatch(
      state.playerColor,
      level.targetColor,
      level.tolerance
    );
  }

  /**
   * Submit the current color
   */
  submitColor(): void {
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
  private handleCorrectAnswer(similarity: number): void {
    const state = this.gameState.getState();
    let points = 0;

    if (similarity >= 95) {
      points = this.gameConfig.gameSettings.scoreMultiplier.perfect;
      NotificationUtils.showNotification('Perfect match! 🎉', 'success');
    } else if (similarity >= 85) {
      points = this.gameConfig.gameSettings.scoreMultiplier.close;
      NotificationUtils.showNotification('Great match! 👏', 'success');
    } else {
      points = this.gameConfig.gameSettings.scoreMultiplier.far;
      NotificationUtils.showNotification('Good enough! ✓', 'success');
    }

    this.gameState.updateState({
      currentScore: state.currentScore + points,
      currentLevel: state.currentLevel + 1
    });

    setTimeout(() => {
      const newState = this.gameState.getState();
      if (newState.currentLevel <= this.gameConfig.levels.length) {
        this.loadLevel(newState.currentLevel);
        this.gameStats.updateGameStats(
          newState.currentLevel,
          newState.currentScore,
          newState.attemptsLeft
        );
      } else {
        this.winGame();
      }
    }, 2000);
  }

  /**
   * Handle incorrect answer
   */
  private handleIncorrectAnswer(): void {
    const state = this.gameState.getState();
    const newAttemptsLeft = state.attemptsLeft - 1;

    this.gameState.updateState({ attemptsLeft: newAttemptsLeft });
    this.gameStats.updateGameStats(state.currentLevel, state.currentScore, newAttemptsLeft);

    if (newAttemptsLeft <= 0) {
      this.endGame();
    } else {
      NotificationUtils.showNotification(
        `Not quite right. ${newAttemptsLeft} attempts left.`,
        'warning'
      );
    }
  }

  /**
   * Start game timer
   */
  private startTimer(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    this.gameTimer = setInterval(() => {
      const state = this.gameState.getState();
      const newTimeLeft = state.timeLeft - 1;

      this.gameState.updateState({ timeLeft: newTimeLeft });
      this.gameStats.updateTimeDisplay(newTimeLeft);

      if (newTimeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  /**
   * Show hint for current level
   */
  showHint(): void {
    const level = this.gameState.getCurrentLevel();
    if (level && level.hints.length > 0) {
      const hint = level.hints[Math.floor(Math.random() * level.hints.length)];
      NotificationUtils.showNotification(`Hint: ${hint}`, 'info');
    }
  }

  /**
   * Skip current level
   */
  skipLevel(): void {
    const state = this.gameState.getState();
    if (state.attemptsLeft > 1) {
      this.gameState.updateState({
        attemptsLeft: state.attemptsLeft - 2,
        currentLevel: state.currentLevel + 1
      });

      const newState = this.gameState.getState();
      if (newState.currentLevel <= this.gameConfig.levels.length) {
        this.loadLevel(newState.currentLevel);
        this.gameStats.updateGameStats(
          newState.currentLevel,
          newState.currentScore,
          newState.attemptsLeft
        );
        NotificationUtils.showNotification('Level skipped!', 'info');
      } else {
        this.endGame();
      }
    } else {
      NotificationUtils.showNotification('Not enough attempts to skip!', 'warning');
    }
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.gameState.resetGame();
    this.initializeGame();
    NotificationUtils.showNotification('Game reset!', 'info');
  }

  /**
   * End the game
   */
  private endGame(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    const state = this.gameState.getState();
    this.gameState.updateState({ isGameActive: false });

    NotificationUtils.showNotification(`Game Over! Final Score: ${state.currentScore}`, 'info');

    setTimeout(() => {
      if (confirm('Game Over! Would you like to restart?')) {
        this.resetGame();
      }
    }, 2000);
  }

  /**
   * Win the game
   */
  private winGame(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    const state = this.gameState.getState();
    this.gameState.updateState({ isGameActive: false });

    NotificationUtils.showNotification(
      `🎉 Congratulations! You completed all levels! Final Score: ${state.currentScore}`,
      'success'
    );

    setTimeout(() => {
      if (confirm('Congratulations! You won! Play again?')) {
        this.resetGame();
      }
    }, 3000);
  }

  /**
   * Initialize hero section color animation
   */
  private initializeHeroAnimation(): void {
    const animateHeroColor = () => {
      const time = Date.now() * 0.001;
      const color1 = ColorUtils.generateAnimatedColor(time, 0);
      const color2 = ColorUtils.generateAnimatedColor(time, Math.PI);

      if (this.elements.heroColorPreview) {
        this.elements.heroColorPreview.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
      }

      this.animationId = requestAnimationFrame(animateHeroColor);
    };

    animateHeroColor();

    // Stop animation when not in view to save performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateHeroColor();
        } else if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
      });
    });

    if (this.elements.heroColorPreview) {
      observer.observe(this.elements.heroColorPreview);
    }
  }

  /**
   * Scroll to game section
   */
  scrollToGame(): void {
    DOMUtils.scrollToGame();
  }
}
