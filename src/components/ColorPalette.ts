import { GameElements } from '../types/DOM.js';

export class ColorPalette {
  constructor(private elements: GameElements) {}

  /**
   * Setup available colors palette
   */
  setupAvailableColors(colors: string[]): void {
    if (!this.elements.availableColorsContainer) return;

    this.elements.availableColorsContainer.innerHTML = '';

    colors.forEach((color) => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'col-md-2 mb-3';
      colorDiv.innerHTML = `
        <div class="available-color" style="background-color: ${color}" 
             data-color="${color}" 
             onclick="selectAvailableColor('${color}')">
          <div class="color-label">${color}</div>
        </div>
      `;
      this.elements.availableColorsContainer!.appendChild(colorDiv);
    });
  }
}
