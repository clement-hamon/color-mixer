import { GameElements } from '../types/DOM.js';

export class GameStats {
  constructor(private elements: GameElements) {}

  /**
   * Update game statistics display
   */
  updateGameStats(currentRound: number, currentScore: number, attemptsLeft: number): void {
    if (this.elements.currentLevel) {
      this.elements.currentLevel.textContent = currentRound.toString();
    }
    if (this.elements.currentScore) {
      this.elements.currentScore.textContent = currentScore.toString();
    }
    if (this.elements.attemptsLeft) {
      this.elements.attemptsLeft.textContent = attemptsLeft.toString();
    }
  }

  /**
   * Update time display
   */
  updateTimeDisplay(timeLeft: number): void {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (this.elements.timeLeft) {
      this.elements.timeLeft.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}
