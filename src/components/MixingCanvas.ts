import { GameElements } from '../types/DOM.js';

export class MixingCanvas {
  constructor(private elements: GameElements) {}

  /**
   * Setup mixing canvas slots
   */
  setupMixingCanvas(slotCount: number): void {
    if (!this.elements.mixingCanvas) return;

    this.elements.mixingCanvas.innerHTML = '';

    for (let i = 0; i < slotCount; i++) {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'col-md-2 mb-3';
      slotDiv.innerHTML = `
        <div class="mixing-slot empty" data-slot="${i}" onclick="clearMixingSlot(${i})">
          <div class="slot-label">Slot ${i + 1}</div>
          <div class="remove-btn" style="display: none;">×</div>
        </div>
      `;
      this.elements.mixingCanvas!.appendChild(slotDiv);
    }
  }

  /**
   * Update slot display
   */
  updateSlot(slotIndex: number, color: string | null): void {
    const slotElement = document.querySelector(`[data-slot="${slotIndex}"]`) as HTMLElement;
    if (!slotElement) return;

    if (color) {
      slotElement.style.backgroundColor = color;
      slotElement.classList.remove('empty');
      slotElement.querySelector('.slot-label')!.textContent = color;
      (slotElement.querySelector('.remove-btn') as HTMLElement).style.display = 'block';
    } else {
      slotElement.style.backgroundColor = '';
      slotElement.classList.add('empty');
      slotElement.querySelector('.slot-label')!.textContent = `Slot ${slotIndex + 1}`;
      (slotElement.querySelector('.remove-btn') as HTMLElement).style.display = 'none';
    }
  }
}
