import { GameElements } from '../types/DOM.js';
import { ColorMatchResult } from '../types/Game.js';
import { ColorUtils } from '../utils/ColorUtils.js';

export class ColorComparison {
  constructor(private elements: GameElements) {}

  /**
   * Update player color display
   */
  updatePlayerColor(playerColor: string): void {
    if (this.elements.playerColorPreview) {
      this.elements.playerColorPreview.style.backgroundColor = playerColor;
    }
    if (this.elements.playerHex) {
      this.elements.playerHex.textContent = playerColor;
    }
  }

  /**
   * Check if player color matches target
   */
  checkColorMatch(playerColor: string, targetColor: string, tolerance: number): ColorMatchResult {
    const targetRgb = ColorUtils.hexToRgb(targetColor);
    const playerRgb = ColorUtils.hexToRgb(playerColor);

    if (!targetRgb || !playerRgb) {
      return { similarity: 0, isMatch: false };
    }

    const colorDistance = ColorUtils.calculateColorDistance(targetRgb, playerRgb);
    const maxDistance = Math.sqrt(3 * 255 * 255); // Maximum possible distance
    const similarity = Math.max(0, 100 - (colorDistance / maxDistance) * 100);

    if (this.elements.matchProgress) {
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
    }

    // Enable submit button if close enough
    const isCloseEnough = colorDistance <= tolerance;
    if (this.elements.submitBtn) {
      this.elements.submitBtn.disabled = !isCloseEnough;
    }

    return { similarity, isMatch: isCloseEnough };
  }
}
