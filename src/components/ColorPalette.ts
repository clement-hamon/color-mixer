import { GameElements } from '../types/DOM.js';

export class ColorPalette {
  constructor(private elements: GameElements) {}

  /**
   * Setup available colors palette
   */
  setupAvailableColors(): void {
    if (!this.elements.availableColorsContainer) return;
    console.log('Setting up available colors palette');
    this.elements.availableColorsContainer.innerHTML = '';

    const primaryColors = ['#ff0000', '#00ff00', '#0000ff'];

    primaryColors.forEach((color) => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'col-md-2 mb-3';
      colorDiv.innerHTML = `
        <div class="available-color" 
             style="background-color: ${color}" 
             data-color="${color}" 
             draggable="true"
             ondragstart="window.colorMixerGame.handleColorDragStart(event, '${color}')"
             onclick="selectAvailableColor('${color}')">
          <div class="color-label">${color}</div>
        </div>
      `;
      this.elements.availableColorsContainer!.appendChild(colorDiv);
    });
  }
}
