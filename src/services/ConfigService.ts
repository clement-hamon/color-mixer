import { GameConfig } from '../types/Game.js';

export class ConfigService {
  /**
   * Load game configuration from JSON file
   */
  static async loadGameConfig(): Promise<GameConfig> {
    try {
      const response = await fetch('data/game-config.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load game configuration:', error);
      throw new Error('Failed to load game configuration');
    }
  }
}
