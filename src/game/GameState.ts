import { GameState, GameConfig, Level } from '../types/Game.js';

export class GameStateManager {
  private state: GameState;

  constructor(private gameConfig: GameConfig) {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      currentLevel: 1,
      currentScore: 0,
      attemptsLeft: this.gameConfig.gameSettings.maxAttempts,
      timeLeft: this.gameConfig.gameSettings.timeLimit,
      isGameActive: true,
      playerColor: '#000000',
      mixingSlots: []
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  updateState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
  }

  getCurrentLevel(): Level | undefined {
    return this.gameConfig.levels.find((l) => l.id === this.state.currentLevel);
  }

  initializeMixingSlots(slotCount: number): void {
    this.state.mixingSlots = new Array(slotCount).fill(null);
  }

  addColorToSlot(color: string, slotIndex: number): void {
    this.state.mixingSlots[slotIndex] = color;
  }

  clearSlot(slotIndex: number): void {
    this.state.mixingSlots[slotIndex] = null;
  }

  clearAllSlots(): void {
    this.state.mixingSlots = this.state.mixingSlots.map(() => null);
  }

  getActiveColors(): string[] {
    return this.state.mixingSlots.filter((color): color is string => color !== null);
  }

  resetGame(): void {
    this.state = this.createInitialState();
  }
}
