import { GameElements } from '../types/DOM.js';

export class DOMUtils {
  /**
   * Initialize DOM elements
   */
  static initializeElements(): GameElements {
    const elements: GameElements = {
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
      submitBtn: document.getElementById('submitBtn') as HTMLButtonElement,

      // Other
      heroColorPreview: document.getElementById('heroColorPreview'),
      brandLink: document.getElementById('brandLink')
    };

    // Check if critical elements exist
    const criticalElements = ['availableColorsContainer', 'mixingCanvas', 'playerColorPreview'];
    const missingElements = criticalElements.filter((id) => !elements[id as keyof GameElements]);

    if (missingElements.length > 0) {
      console.warn('Missing critical DOM elements:', missingElements);
    }

    return elements;
  }

  /**
   * Scroll to game section
   */
  static scrollToGame(): void {
    const gameElement = document.getElementById('game');
    if (gameElement) {
      gameElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Scroll to top
   */
  static scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
