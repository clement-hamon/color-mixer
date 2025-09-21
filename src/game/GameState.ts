import { GameState, GameConfig, Level, MixingSlot } from '../types/Game.js';

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
    this.state.mixingSlots = Array.from({ length: slotCount }, (_, i) => ({
      id: i,
      color: null,
      isEmpty: true
    }));
  }

  addColorToSlot(color: string, slotIndex: number): void {
    if (this.state.mixingSlots[slotIndex]) {
      // If slot already has a color, mix them
      const existingColor = this.state.mixingSlots[slotIndex].color;
      if (existingColor) {
        const mixedColor = this.mixColors(existingColor, color);
        this.state.mixingSlots[slotIndex] = {
          id: slotIndex,
          color: mixedColor,
          isEmpty: false
        };
      } else {
        this.state.mixingSlots[slotIndex] = {
          id: slotIndex,
          color: color,
          isEmpty: false
        };
      }
    }
  }

  clearSlot(slotIndex: number): void {
    if (this.state.mixingSlots[slotIndex]) {
      this.state.mixingSlots[slotIndex] = {
        id: slotIndex,
        color: null,
        isEmpty: true
      };
    }
  }

  clearAllSlots(): void {
    this.state.mixingSlots = this.state.mixingSlots.map((slot, i) => ({
      id: i,
      color: null,
      isEmpty: true
    }));
  }

  getActiveColors(): string[] {
    return this.state.mixingSlots
      .filter(slot => !slot.isEmpty && slot.color !== null)
      .map(slot => slot.color!);
  }

  private mixColors(color1: string, color2: string): string {
    // Convert hex to RGB
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    // Mix the colors by averaging RGB values
    const mixedR = Math.round((rgb1.r + rgb2.r) / 2);
    const mixedG = Math.round((rgb1.g + rgb2.g) / 2);
    const mixedB = Math.round((rgb1.b + rgb2.b) / 2);
    
    return this.rgbToHex(mixedR, mixedG, mixedB);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  resetGame(): void {
    this.state = this.createInitialState();
  }
}
