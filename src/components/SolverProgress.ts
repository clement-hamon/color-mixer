import { GameElements } from '../types/DOM.js';
import { MixingStep } from '../utils/ColorMixingSolver.js';

export interface SolverProgressProps {
  isRunning: boolean;
  currentIteration?: number;
  maxIterations?: number;
  currentStep?: number;
  totalSteps?: number;
  message?: string;
}

export class SolverProgress {
  private progressElement: HTMLElement | null = null;

  constructor(private elements: GameElements) {
    this.createProgressElement();
  }

  /**
   * Create the solver progress UI element
   */
  private createProgressElement(): void {
    const container = document.getElementById('solver-progress-container');
    if (!container) return;

    this.progressElement = document.createElement('div');
    this.progressElement.className = 'solver-progress';
    this.progressElement.style.display = 'none';
    this.progressElement.innerHTML = `
      <div class="solving-indicator">
        <span class="solver-message">🧮 Initializing solver...</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
      <div class="solver-stats">
        <small class="text-muted">Iteration: <span class="current-iteration">0</span>/<span class="max-iterations">1000</span></small>
      </div>
    `;

    container.appendChild(this.progressElement);
  }

  /**
   * Update solver progress
   */
  updateProgress(props: SolverProgressProps): void {
    if (!this.progressElement) return;

    if (props.isRunning) {
      this.progressElement.style.display = 'block';

      // Update message
      const messageElement = this.progressElement.querySelector('.solver-message');
      if (messageElement) {
        messageElement.textContent = props.message || '🧮 Solving color combination...';
      }

      // Update progress bar
      const progressFill = this.progressElement.querySelector('.progress-fill') as HTMLElement;
      if (progressFill && props.currentIteration && props.maxIterations) {
        const percentage = (props.currentIteration / props.maxIterations) * 100;
        progressFill.style.width = `${percentage}%`;
      }

      // Update iteration stats
      const currentIterationElement = this.progressElement.querySelector('.current-iteration');
      const maxIterationsElement = this.progressElement.querySelector('.max-iterations');

      if (currentIterationElement && props.currentIteration) {
        currentIterationElement.textContent = props.currentIteration.toString();
      }
      if (maxIterationsElement && props.maxIterations) {
        maxIterationsElement.textContent = props.maxIterations.toString();
      }
    } else {
      // Fade out with delay
      this.progressElement.style.opacity = '0';
      setTimeout(() => {
        if (this.progressElement) {
          this.progressElement.style.display = 'none';
          this.progressElement.style.opacity = '1';
        }
      }, 300);
    }
  }

  /**
   * Show solver steps with animation
   */
  showSteps(steps: MixingStep[], currentStepIndex: number = -1): void {
    const container = document.getElementById('solver-steps-container');
    if (!container || steps.length === 0) return;

    container.innerHTML = `
      <h6 class="mb-3">🔧 Solver Steps:</h6>
      <div class="solver-steps"></div>
    `;

    const stepsContainer = container.querySelector('.solver-steps') as HTMLElement;

    steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'solver-step';
      stepElement.style.animationDelay = `${index * 0.1}s`;

      if (index < currentStepIndex) {
        stepElement.classList.add('completed');
      } else if (index === currentStepIndex) {
        stepElement.classList.add('current');
      }

      stepElement.innerHTML = `
        <div class="step-number">${index + 1}</div>
        <div class="step-description">${step.description}</div>
      `;

      stepsContainer.appendChild(stepElement);
    });
  }

  /**
   * Update current step with animation
   */
  updateCurrentStep(stepIndex: number): void {
    const steps = document.querySelectorAll('.solver-step');
    steps.forEach((step, index) => {
      step.classList.remove('current', 'completed');
      if (index < stepIndex) {
        step.classList.add('completed');
      } else if (index === stepIndex) {
        step.classList.add('current');
      }
    });
  }

  /**
   * Hide all solver UI elements
   */
  hide(): void {
    this.updateProgress({ isRunning: false });

    const stepsContainer = document.getElementById('solver-steps-container');
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
    }
  }

  /**
   * Show completion message with animation
   */
  showCompletion(success: boolean, accuracy: number, steps: MixingStep[]): void {
    const container = document.getElementById('solver-progress-container');
    if (!container) return;

    const completionElement = document.createElement('div');
    completionElement.className = `solver-completion ${success ? 'success' : 'warning'}`;
    completionElement.innerHTML = `
      <div class="completion-icon">
        ${success ? '✅' : '⚠️'}
      </div>
      <div class="completion-message">
        <strong>${success ? 'Solution Found!' : 'Best Attempt'}</strong>
        <div class="completion-details">
          Accuracy: ${accuracy.toFixed(1)}% | Steps: ${steps.length}
        </div>
      </div>
    `;

    // Add completion styles
    const style = document.createElement('style');
    style.textContent = `
      .solver-completion {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        animation: completion-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .solver-completion.success {
        background: #d4edda;
        border-left: 4px solid #28a745;
        color: #155724;
      }
      .solver-completion.warning {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        color: #856404;
      }
      .completion-icon {
        font-size: 24px;
      }
      .completion-message strong {
        display: block;
        margin-bottom: 5px;
      }
      .completion-details {
        font-size: 0.9rem;
        opacity: 0.8;
      }
      @keyframes completion-appear {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    container.appendChild(completionElement);

    // Remove after delay
    setTimeout(() => {
      completionElement.style.opacity = '0';
      setTimeout(() => {
        if (completionElement.parentNode) {
          completionElement.parentNode.removeChild(completionElement);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, 4000);
  }
}
