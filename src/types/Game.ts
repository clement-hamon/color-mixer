export interface GameConfig {
  gameSettings: GameSettings;
  levels: Level[];
}

export interface GameSettings {
  maxAttempts: number;
  timeLimit: number;
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
  mixingSlots: (string | null)[];
}

export interface ColorMatchResult {
  similarity: number;
  isMatch: boolean;
}
