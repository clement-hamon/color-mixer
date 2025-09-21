export interface GameElements {
  // Game stats
  currentLevel: HTMLElement | null;
  currentScore: HTMLElement | null;
  attemptsLeft: HTMLElement | null;
  timeLeft: HTMLElement | null;

  // Target color
  targetColorPreview: HTMLElement | null;
  levelName: HTMLElement | null;
  levelDescription: HTMLElement | null;
  hintText: HTMLElement | null;

  // Game areas
  availableColorsContainer: HTMLElement | null;
  mixingCanvas: HTMLElement | null;
  playerColorPreview: HTMLElement | null;

  // Color comparison
  matchProgress: HTMLElement | null;
  playerHex: HTMLElement | null;
  targetHex: HTMLElement | null;
  submitBtn: HTMLButtonElement | null;

  // Other
  heroColorPreview: HTMLElement | null;
  brandLink: HTMLElement | null;
}
