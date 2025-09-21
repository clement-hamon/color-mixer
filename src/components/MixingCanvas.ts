import { GameElements } from '../types/DOM.js';
import { DragDropData, MixingSlot } from '../types/Game.js';

export class MixingCanvas {
  private onSlotDrop?: (slotIndex: number, dragData: DragDropData) => void;

  constructor(private elements: GameElements) {}

  /**
   * Set the callback for when a color is dropped on a slot
   */
  setOnSlotDrop(callback: (slotIndex: number, dragData: DragDropData) => void): void {
    this.onSlotDrop = callback;
  }

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
        <div class="mixing-slot empty" 
             data-slot="${i}" 
             onclick="clearMixingSlot(${i})"
             ondrop="event.preventDefault(); window.colorMixerGame.handleSlotDrop(event, ${i})"
             ondragover="event.preventDefault()"
             ondragenter="event.preventDefault()">
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
  updateSlot(slotIndex: number, mixingSlot: MixingSlot): void {
    const slotElement = document.querySelector(`[data-slot="${slotIndex}"]`) as HTMLElement;
    if (!slotElement) return;

    if (!mixingSlot.isEmpty && mixingSlot.color) {
      slotElement.style.backgroundColor = mixingSlot.color;
      slotElement.classList.remove('empty');
      slotElement.classList.add('filled');
      slotElement.querySelector('.slot-label')!.textContent = mixingSlot.color;
      (slotElement.querySelector('.remove-btn') as HTMLElement).style.display = 'block';
    } else {
      slotElement.style.backgroundColor = '';
      slotElement.classList.add('empty');
      slotElement.classList.remove('filled');
      slotElement.querySelector('.slot-label')!.textContent = `Slot ${slotIndex + 1}`;
      (slotElement.querySelector('.remove-btn') as HTMLElement).style.display = 'none';
    }
  }
}
