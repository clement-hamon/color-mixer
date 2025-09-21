export interface GameConfig {
  gameSettings: GameSettings;
}

export interface GameSettings {
  maxAttempts: number;
  timeLimit: number;
  mixingSlots: number;
  tolerance: number;
  scoreMultiplier: {
    perfect: number;
    close: number;
    far: number;
  };
}

export interface GameState {
  currentScore: number;
  attemptsLeft: number;
  timeLeft: number;
  isGameActive: boolean;
  playerColor: string;
  targetColor: string;
  mixingSlots: MixingSlot[];
  roundsCompleted: number;
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
