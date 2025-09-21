export interface GameConfig {
  gameSettings: GameSettings;
  levels: Level[];
}

export interface GameSettings {
  maxAttempts: number;
  timeLimit: number;
  mixingSlots: number;
  scoreMultiplier: {
    perfect: number;
    close: number;
    far: number;
  };
}

export interface Level {
  id: number;
  name: string;
  description: string;
  targetColor: string;
  availableColors: string[];
  mixingSlots: number;
  tolerance: number;
  hints: string[];
}

export interface GameState {
  currentLevel: number;
  currentScore: number;
  attemptsLeft: number;
  timeLeft: number;
  isGameActive: boolean;
  playerColor: string;
  mixingSlots: MixingSlot[];
}

export interface MixingSlot {
  id: number;
  color: string | null;
  isEmpty: boolean;
}

export interface DragDropData {
  sourceType: 'palette' | 'slot';
  sourceId: string | number;
  color: string;
}

export interface ColorMatchResult {
  similarity: number;
  isMatch: boolean;
}
