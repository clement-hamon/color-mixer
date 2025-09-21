import { GameConfig, ColorMatchResult, DragDropData, MixingSlot } from '../types/Game.js';
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
import { ColorMixingSolver, type MixingStep } from '../utils/ColorMixingSolver.js';

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
  private colorSolver: ColorMixingSolver;

  constructor() {
    this.elements = DOMUtils.initializeElements();
    this.gameStats = new GameStats(this.elements);
    this.colorPalette = new ColorPalette(this.elements);
    this.mixingCanvas = new MixingCanvas(this.elements);
    this.colorComparison = new ColorComparison(this.elements);
    this.colorSolver = new ColorMixingSolver();

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
   * Initialize the game with a random target color
   */
  private initializeGame(): void {
    const state = this.gameState.getState();
    this.gameStats.updateGameStats(
      state.roundsCompleted + 1,
      state.currentScore,
      state.attemptsLeft
    );
    this.loadNewRound();
    this.startTimer();
  }

  /**
   * Load a new round with a random target color
   */
  private loadNewRound(): void {
    // Generate a new random target color
    this.gameState.generateNewTarget();
    const state = this.gameState.getState();

    // Update UI with new target
    if (this.elements.levelName)
      this.elements.levelName.textContent = `Round ${state.roundsCompleted + 1}`;
    if (this.elements.levelDescription)
      this.elements.levelDescription.textContent =
        'Mix colors to match the target as closely as possible!';
    if (this.elements.hintText)
      this.elements.hintText.textContent = 'The closer you get, the more points you earn!';
    if (this.elements.targetColorPreview) {
      this.elements.targetColorPreview.style.backgroundColor = state.targetColor;
    }
    if (this.elements.targetHex) this.elements.targetHex.textContent = state.targetColor;

    // Setup game components
    this.colorPalette.setupAvailableColors();
    this.mixingCanvas.setupMixingCanvas(this.gameConfig.gameSettings.mixingSlots);
    this.gameState.initializeMixingSlots(this.gameConfig.gameSettings.mixingSlots);

    // Reset player color
    this.gameState.updateState({ playerColor: '#000000' });
    this.updatePlayerColor();
  }

  /**
   * Select an available color
   */
  selectAvailableColor(color: string): void {
    const state = this.gameState.getState();
    const emptySlotIndex = state.mixingSlots.findIndex((slot) => slot.isEmpty);

    if (emptySlotIndex !== -1) {
      this.addColorToSlot(color, emptySlotIndex);
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
    const state = this.gameState.getState();
    this.mixingCanvas.updateSlot(slotIndex, state.mixingSlots[slotIndex]);
    this.updateMixedColor();
  }

  /**
   * Clear a mixing slot
   */
  clearMixingSlot(slotIndex: number): void {
    this.gameState.clearSlot(slotIndex);
    const state = this.gameState.getState();
    this.mixingCanvas.updateSlot(slotIndex, state.mixingSlots[slotIndex]);
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
   * Handle drag start for color palette
   */
  handleColorDragStart(event: DragEvent, color: string): void {
    if (!event.dataTransfer) return;

    const dragData: DragDropData = {
      sourceType: 'palette',
      sourceId: color,
      color: color
    };

    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'copy';
  }

  /**
   * Handle drop on mixing slot
   */
  handleSlotDrop(event: DragEvent, slotIndex: number): void {
    event.preventDefault();

    if (!event.dataTransfer) return;

    try {
      const dragData: DragDropData = JSON.parse(event.dataTransfer.getData('application/json'));
      this.addColorToSlot(dragData.color, slotIndex);

      NotificationUtils.showNotification(
        `${dragData.color} added to slot ${slotIndex + 1}`,
        'success'
      );
    } catch (error) {
      console.error('Error handling slot drop:', error);
      NotificationUtils.showNotification('Error adding color to slot', 'error');
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
    const tolerance = this.gameState.getTolerance();

    return this.colorComparison.checkColorMatch(state.playerColor, state.targetColor, tolerance);
  }

  /**
   * Submit the current color for scoring
   */
  submitColor(): void {
    const result = this.checkColorMatch();
    this.handleColorSubmission(result.similarity);
  }

  /**
   * Handle color submission with proximity-based scoring
   */
  private handleColorSubmission(similarity: number): void {
    const state = this.gameState.getState();
    let points = 0;

    // Calculate points based on similarity percentage
    if (similarity >= 95) {
      points = this.gameConfig.gameSettings.scoreMultiplier.perfect;
      NotificationUtils.showNotification(`Perfect match! 🎉 (+${points} points)`, 'success');
    } else if (similarity >= 85) {
      points = this.gameConfig.gameSettings.scoreMultiplier.close;
      NotificationUtils.showNotification(`Great match! 👏 (+${points} points)`, 'success');
    } else if (similarity >= 70) {
      points = this.gameConfig.gameSettings.scoreMultiplier.far;
      NotificationUtils.showNotification(`Good attempt! ✓ (+${points} points)`, 'success');
    } else if (similarity >= 50) {
      points = Math.floor(this.gameConfig.gameSettings.scoreMultiplier.far * 0.5);
      NotificationUtils.showNotification(`Getting warmer! (+${points} points)`, 'info');
    } else {
      points = Math.floor(this.gameConfig.gameSettings.scoreMultiplier.far * 0.25);
      NotificationUtils.showNotification(`Keep trying! (+${points} points)`, 'warning');
    }

    // Update score and round counter
    this.gameState.updateState({
      currentScore: state.currentScore + points,
      roundsCompleted: state.roundsCompleted + 1
    });

    // Check for score milestones
    this.checkScoreMilestone();

    // Start a new round after a brief delay
    setTimeout(() => {
      const newState = this.gameState.getState();
      this.loadNewRound();
      this.gameStats.updateGameStats(
        newState.roundsCompleted + 1,
        newState.currentScore,
        newState.attemptsLeft
      );
    }, 2000);
  }

  /**
   * Use an attempt (for actions that consume attempts)
   */
  private useAttempt(): void {
    const state = this.gameState.getState();
    const newAttemptsLeft = state.attemptsLeft - 1;

    this.gameState.updateState({ attemptsLeft: newAttemptsLeft });
    this.gameStats.updateGameStats(state.roundsCompleted + 1, state.currentScore, newAttemptsLeft);

    if (newAttemptsLeft <= 0) {
      this.endGame();
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
   * Show hint for color mixing
   */
  showHint(): void {
    const hints = [
      'Try mixing primary colors (red, blue, yellow) to create secondary colors!',
      'White lightens colors, black darkens them.',
      'Complementary colors mixed together create brown or gray tones.',
      'Start with one primary color and gradually add others.',
      'Small amounts of white can create pastels.'
    ];

    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    NotificationUtils.showNotification(`Hint: ${randomHint}`, 'info');
  }

  /**
   * Show algorithmic solution for current target
   */
  showSolution(): void {
    const state = this.gameState.getState();
    const tolerance = this.gameState.getTolerance();

    // Clear current mixing slots first
    this.clearMixingCanvas();

    // Solve the current target
    const result = this.colorSolver.solve(state.targetColor, {
      tolerance: tolerance,
      availableColors: [
        '#ff0000', // Red
        '#00ff00', // Green
        '#0000ff', // Blue
        '#ffffff', // White
        '#000000', // Black
        '#ffff00', // Yellow (Red + Green)
        '#ff00ff', // Magenta (Red + Blue)
        '#00ffff' // Cyan (Green + Blue)
      ],
      maxSlots: this.gameConfig.gameSettings.mixingSlots
    });

    if (result.success) {
      NotificationUtils.showNotification(
        `✅ Solution found! Accuracy: ${result.accuracy.toFixed(1)}%`,
        'success'
      );

      // Apply the solution step by step with animation
      this.applySolutionSteps(result.steps);

      // Show detailed explanation
      setTimeout(() => {
        NotificationUtils.showNotification(`💡 ${result.explanation}`, 'info');
      }, 2000);
    } else {
      NotificationUtils.showNotification(
        `⚠️ No exact solution found. Best attempt: ${result.accuracy.toFixed(1)}% accuracy`,
        'warning'
      );

      // Apply the best attempt
      this.applySolutionSteps(result.steps);

      setTimeout(() => {
        NotificationUtils.showNotification(`💡 ${result.explanation}`, 'info');
      }, 2000);
    }
  }

  /**
   * Apply solution steps with animation
   */
  private applySolutionSteps(steps: MixingStep[]): void {
    let stepIndex = 0;

    const applyNextStep = () => {
      if (stepIndex >= steps.length) return;

      const step = steps[stepIndex];
      if (step.action === 'add' && step.color) {
        this.addColorToSlot(step.color, step.slotIndex);

        // Show step description
        NotificationUtils.showNotification(`Step ${stepIndex + 1}: ${step.description}`, 'info');
      }

      stepIndex++;

      // Continue with next step after a delay
      if (stepIndex < steps.length) {
        setTimeout(applyNextStep, 1000);
      }
    };

    // Start applying steps
    setTimeout(applyNextStep, 500);
  }

  /**
   * Skip current round (generate new target)
   */
  skipRound(): void {
    const state = this.gameState.getState();
    if (state.attemptsLeft > 1) {
      this.gameState.updateState({
        attemptsLeft: state.attemptsLeft - 1
      });

      this.loadNewRound();
      const newState = this.gameState.getState();
      this.gameStats.updateGameStats(
        newState.roundsCompleted + 1,
        newState.currentScore,
        newState.attemptsLeft
      );
      NotificationUtils.showNotification('New target generated!', 'info');
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
   * Celebrate a high score milestone
   */
  private checkScoreMilestone(): void {
    const state = this.gameState.getState();
    const score = state.currentScore;

    // Check for score milestones
    if (score >= 50000 && score < 50100) {
      NotificationUtils.showNotification(
        "� Amazing! You've reached 50,000 points! You're a true color master!",
        'success'
      );
    } else if (score >= 25000 && score < 25100) {
      NotificationUtils.showNotification(
        "🎯 Incredible! 25,000 points! You're getting really good at this!",
        'success'
      );
    } else if (score >= 10000 && score < 10100) {
      NotificationUtils.showNotification(
        "⭐ Fantastic! You've hit 10,000 points! Keep it up!",
        'success'
      );
    } else if (score >= 5000 && score < 5100) {
      NotificationUtils.showNotification('🎉 Great job! 5,000 points earned!', 'success');
    }
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
