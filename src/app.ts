import './css/styles.css';
import { ColorMixerGame } from './game/ColorMixerGame.js';

// Global functions for HTML onclick handlers
declare global {
  interface Window {
    colorMixerGame: ColorMixerGame;
    scrollToGame(): void;
    selectAvailableColor(color: string): void;
    clearMixingSlot(slotIndex: number): void;
    mixColors(): void;
    clearMixingCanvas(): void;
    submitColor(): void;
    showHint(): void;
    skipLevel(): void;
    resetGame(): void;
    handleColorDragStart(event: DragEvent, color: string): void;
    handleSlotDrop(event: DragEvent, slotIndex: number): void;
  }
}

// Global functions for HTML onclick handlers
window.scrollToGame = () => window.colorMixerGame.scrollToGame();
window.selectAvailableColor = (color: string) => window.colorMixerGame.selectAvailableColor(color);
window.clearMixingSlot = (slotIndex: number) => window.colorMixerGame.clearMixingSlot(slotIndex);
window.mixColors = () => window.colorMixerGame.mixColors();
window.clearMixingCanvas = () => window.colorMixerGame.clearMixingCanvas();
window.submitColor = () => window.colorMixerGame.submitColor();
window.showHint = () => window.colorMixerGame.showHint();
window.skipLevel = () => window.colorMixerGame.skipLevel();
window.resetGame = () => window.colorMixerGame.resetGame();
window.handleColorDragStart = (event: DragEvent, color: string) => window.colorMixerGame.handleColorDragStart(event, color);
window.handleSlotDrop = (event: DragEvent, slotIndex: number) => window.colorMixerGame.handleSlotDrop(event, slotIndex);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.colorMixerGame = new ColorMixerGame();
  console.log('Color Mixer Game initialized successfully!!!!!!!!!!');
});
