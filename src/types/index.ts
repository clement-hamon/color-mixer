export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface GameConfig {
  difficulty: 'easy' | 'medium' | 'hard';
  maxAttempts: number;
  tolerance: number;
  timeLimit?: number;
}

export interface GameState {
  level: number;
  score: number;
  attempts: number;
  targetColor: Color;
  currentMix: Color[];
  startTime: number;
  isComplete: boolean;
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  averageAttempts: number;
  bestScore: number;
  totalPlayTime: number;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  description?: string;
}

export interface MixingResult {
  color: Color;
  accuracy: number;
  isMatch: boolean;
}

export type GameEvents = {
  'game:start': { level: number; difficulty: string };
  'game:complete': { level: number; score: number; attempts: number };
  'game:fail': { level: number; attempts: number };
  'color:mixed': { result: Color; accuracy: number };
  'level:up': { newLevel: number };
};
