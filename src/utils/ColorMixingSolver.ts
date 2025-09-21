import { RGB } from '../types/Color.js';

/**
 * Color Mixing Solver Algorithm
 *
 * This algorithm solves the color mixing problem by finding optimal combinations
 * of available colors to achieve a target color within a given tolerance.
 *
 * The solver uses multiple strategies:
 * 1. Brute force search for simple combinations
 * 2. Genetic algorithm for complex combinations
 * 3. Color theory-based heuristics
 */

export interface MixingStep {
  action: 'add' | 'clear';
  color?: string;
  slotIndex: number;
  description: string;
}

export interface SolverResult {
  success: boolean;
  steps: MixingStep[];
  finalColor: string;
  accuracy: number;
  explanation: string;
}

export interface SolverOptions {
  maxSteps?: number;
  maxIterations?: number;
  tolerance?: number;
  availableColors?: string[];
  maxSlots?: number;
}

export class ColorMixingSolver {
  private readonly DEFAULT_AVAILABLE_COLORS = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffffff', // White
    '#000000', // Black
    '#ffff00', // Yellow (Red + Green)
    '#ff00ff', // Magenta (Red + Blue)
    '#00ffff' // Cyan (Green + Blue)
  ];
  private readonly DEFAULT_MAX_STEPS = 10;
  private readonly DEFAULT_MAX_ITERATIONS = 1000;
  private readonly DEFAULT_TOLERANCE = 25;
  private readonly DEFAULT_MAX_SLOTS = 6;

  /**
   * Solve the color mixing problem to achieve a target color
   */
  solve(targetColor: string, options: SolverOptions = {}): SolverResult {
    const opts = this.normalizeOptions(options);
    const targetRgb = this.hexToRgb(targetColor);

    if (!targetRgb) {
      return {
        success: false,
        steps: [],
        finalColor: '#000000',
        accuracy: 0,
        explanation: 'Invalid target color format'
      };
    }

    console.log(`🎯 Solving for target color: ${targetColor}`);
    console.log(`📋 Available colors: ${opts.availableColors!.join(', ')}`);
    console.log(`🎚️ Tolerance: ${opts.tolerance}`);

    // Try different solving strategies in order of complexity
    let result = this.solveBruteForce(targetRgb, opts);

    if (!result.success) {
      result = this.solveWithLightnessControl(targetRgb, opts);
    }

    if (!result.success) {
      result = this.solveWithGeneticAlgorithm(targetRgb, opts);
    }

    if (!result.success) {
      result = this.solveWithColorTheory(targetRgb, opts);
    }

    if (!result.success) {
      result = this.generateBestAttempt(targetRgb, opts);
    }

    return result;
  }

  /**
   * Brute force solver for simple color combinations (1-3 colors)
   */
  private solveBruteForce(targetRgb: RGB, options: Required<SolverOptions>): SolverResult {
    const { availableColors, tolerance, maxSlots } = options;

    // Try single colors first
    for (const color of availableColors) {
      const colorRgb = this.hexToRgb(color);
      if (colorRgb && this.calculateDistance(targetRgb, colorRgb) <= tolerance) {
        return {
          success: true,
          steps: [
            {
              action: 'add',
              color,
              slotIndex: 0,
              description: `Add ${color} to slot 1 (perfect match!)`
            }
          ],
          finalColor: color,
          accuracy: this.calculateAccuracy(targetRgb, colorRgb),
          explanation: `Single color solution: ${color} matches the target perfectly.`
        };
      }
    }

    // Try two-color combinations
    for (let i = 0; i < availableColors.length; i++) {
      for (let j = i; j < availableColors.length; j++) {
        const colors = [availableColors[i], availableColors[j]];
        const mixedColor = this.blendColors(colors);
        const mixedRgb = this.hexToRgb(mixedColor);

        if (mixedRgb && this.calculateDistance(targetRgb, mixedRgb) <= tolerance) {
          return {
            success: true,
            steps: [
              {
                action: 'add',
                color: colors[0],
                slotIndex: 0,
                description: `Add ${colors[0]} to slot 1`
              },
              {
                action: 'add',
                color: colors[1],
                slotIndex: 1,
                description: `Add ${colors[1]} to slot 2`
              }
            ],
            finalColor: mixedColor,
            accuracy: this.calculateAccuracy(targetRgb, mixedRgb),
            explanation: `Two-color solution: Mix ${colors[0]} and ${colors[1]} to get ${mixedColor}.`
          };
        }
      }
    }

    // Try three-color combinations
    for (let i = 0; i < availableColors.length; i++) {
      for (let j = i; j < availableColors.length; j++) {
        for (let k = j; k < availableColors.length; k++) {
          if (k >= maxSlots) break;

          const colors = [availableColors[i], availableColors[j], availableColors[k]];
          const mixedColor = this.blendColors(colors);
          const mixedRgb = this.hexToRgb(mixedColor);

          if (mixedRgb && this.calculateDistance(targetRgb, mixedRgb) <= tolerance) {
            return {
              success: true,
              steps: colors.map((color, index) => ({
                action: 'add' as const,
                color,
                slotIndex: index,
                description: `Add ${color} to slot ${index + 1}`
              })),
              finalColor: mixedColor,
              accuracy: this.calculateAccuracy(targetRgb, mixedRgb),
              explanation: `Three-color solution: Mix ${colors.join(', ')} to get ${mixedColor}.`
            };
          }
        }
      }
    }

    return {
      success: false,
      steps: [],
      finalColor: '#000000',
      accuracy: 0,
      explanation: 'No brute force solution found'
    };
  }

  /**
   * Genetic algorithm solver for complex combinations
   */
  private solveWithGeneticAlgorithm(
    targetRgb: RGB,
    options: Required<SolverOptions>
  ): SolverResult {
    const { availableColors, tolerance, maxSlots, maxIterations } = options;
    const populationSize = 50;
    const mutationRate = 0.1;
    const eliteSize = 10;

    // Initialize population
    let population = this.initializePopulation(populationSize, availableColors, maxSlots);
    let bestSolution: string[] = [];
    let bestFitness = Infinity;

    for (let generation = 0; generation < maxIterations / 10; generation++) {
      // Evaluate fitness for each individual
      const fitnessScores: number[] = [];

      for (const individual of population) {
        const mixedColor = this.blendColors(individual);
        const mixedRgb = this.hexToRgb(mixedColor);
        const fitness = mixedRgb ? this.calculateDistance(targetRgb, mixedRgb) : Infinity;
        fitnessScores.push(fitness);

        if (fitness < bestFitness) {
          bestFitness = fitness;
          bestSolution = [...individual];
        }

        // Early termination if solution found
        if (fitness <= tolerance) {
          return this.formatGeneticSolution(bestSolution, targetRgb, bestFitness);
        }
      }

      // Create new generation
      const newPopulation: string[][] = [];

      // Keep elite individuals
      const sortedIndices = fitnessScores
        .map((fitness, index) => ({ fitness, index }))
        .sort((a, b) => a.fitness - b.fitness)
        .slice(0, eliteSize)
        .map((item) => item.index);

      for (const index of sortedIndices) {
        newPopulation.push([...population[index]]);
      }

      // Generate offspring
      while (newPopulation.length < populationSize) {
        const parent1 = this.selectParent(population, fitnessScores);
        const parent2 = this.selectParent(population, fitnessScores);
        const child = this.crossover(parent1, parent2);
        const mutatedChild = this.mutate(child, availableColors, mutationRate);
        newPopulation.push(mutatedChild);
      }

      population = newPopulation;
    }

    if (bestFitness <= tolerance) {
      return this.formatGeneticSolution(bestSolution, targetRgb, bestFitness);
    }

    return {
      success: false,
      steps: [],
      finalColor: '#000000',
      accuracy: 0,
      explanation: 'Genetic algorithm failed to find solution'
    };
  }

  /**
   * Color theory-based solver using heuristics
   */
  private solveWithColorTheory(targetRgb: RGB, options: Required<SolverOptions>): SolverResult {
    const { availableColors, tolerance } = options;

    // Analyze target color properties
    const targetHsl = this.rgbToHsl(targetRgb);

    // Strategy 1: Find dominant primary color and adjust
    const primaryContributions = this.analyzePrimaryContributions(targetRgb);
    const solution = this.buildColorTheorySolution(
      primaryContributions,
      availableColors,
      targetRgb,
      tolerance
    );

    if (solution.success) {
      return solution;
    }

    // Strategy 2: Use complementary color theory
    const complementarySolution = this.solveWithComplementaryColors(
      targetRgb,
      availableColors,
      tolerance
    );

    return complementarySolution;
  }

  /**
   * Enhanced solver that considers lightness and saturation using white and black
   */
  private solveWithLightnessControl(
    targetRgb: RGB,
    options: Required<SolverOptions>
  ): SolverResult {
    const { availableColors, tolerance } = options;
    const targetHsl = this.rgbToHsl(targetRgb);

    // Strategy: Find base hue, then adjust lightness with white/black
    const baseHue = this.findClosestHue(targetHsl, availableColors);

    if (baseHue) {
      // Calculate how much white or black to add
      const lightnessAdjustment = this.calculateLightnessAdjustment(targetHsl.l);

      const solution: string[] = [baseHue.color];

      // Add white to increase lightness
      if (lightnessAdjustment.needsWhite && availableColors.includes('#ffffff')) {
        for (let i = 0; i < lightnessAdjustment.whiteAmount; i++) {
          solution.push('#ffffff');
        }
      }

      // Add black to decrease lightness
      if (lightnessAdjustment.needsBlack && availableColors.includes('#000000')) {
        for (let i = 0; i < lightnessAdjustment.blackAmount; i++) {
          solution.push('#000000');
        }
      }

      const mixedColor = this.blendColors(solution);
      const mixedRgb = this.hexToRgb(mixedColor);

      if (mixedRgb && this.calculateDistance(targetRgb, mixedRgb) <= tolerance) {
        return {
          success: true,
          steps: solution.map((color, index) => ({
            action: 'add' as const,
            color,
            slotIndex: index,
            description: this.getStepDescription(color, index, solution.length)
          })),
          finalColor: mixedColor,
          accuracy: this.calculateAccuracy(targetRgb, mixedRgb),
          explanation: `Lightness-controlled solution: ${this.explainLightnessSolution(solution)}`
        };
      }
    }

    return {
      success: false,
      steps: [],
      finalColor: '#000000',
      accuracy: 0,
      explanation: 'Lightness control failed'
    };
  }

  /**
   * Generate the best possible attempt when exact solution isn't found
   */
  private generateBestAttempt(targetRgb: RGB, options: Required<SolverOptions>): SolverResult {
    const { availableColors, maxSlots } = options;
    let bestColors: string[] = [];
    let bestDistance = Infinity;

    // Try all combinations up to maxSlots
    this.generateAllCombinations(availableColors, maxSlots, (combination) => {
      const mixedColor = this.blendColors(combination);
      const mixedRgb = this.hexToRgb(mixedColor);

      if (mixedRgb) {
        const distance = this.calculateDistance(targetRgb, mixedRgb);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestColors = [...combination];
        }
      }
    });

    const finalColor = this.blendColors(bestColors);
    const finalRgb = this.hexToRgb(finalColor)!;

    return {
      success: false,
      steps: bestColors.map((color, index) => ({
        action: 'add' as const,
        color,
        slotIndex: index,
        description: `Add ${color} to slot ${index + 1} (best attempt)`
      })),
      finalColor,
      accuracy: this.calculateAccuracy(targetRgb, finalRgb),
      explanation: `Best attempt: Mix ${bestColors.join(', ')} to get ${finalColor}. This is the closest possible match with available colors.`
    };
  }

  // Helper methods

  private normalizeOptions(options: SolverOptions): Required<SolverOptions> {
    return {
      maxSteps: options.maxSteps ?? this.DEFAULT_MAX_STEPS,
      maxIterations: options.maxIterations ?? this.DEFAULT_MAX_ITERATIONS,
      tolerance: options.tolerance ?? this.DEFAULT_TOLERANCE,
      availableColors: options.availableColors ?? this.DEFAULT_AVAILABLE_COLORS,
      maxSlots: options.maxSlots ?? this.DEFAULT_MAX_SLOTS
    };
  }

  private hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  private rgbToHsl(rgb: RGB): { h: number; s: number; l: number } {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private blendColors(colors: string[]): string {
    if (colors.length === 0) return '#000000';
    if (colors.length === 1) return colors[0];

    let totalR = 0,
      totalG = 0,
      totalB = 0;

    colors.forEach((color) => {
      const rgb = this.hexToRgb(color);
      if (rgb) {
        totalR += rgb.r;
        totalG += rgb.g;
        totalB += rgb.b;
      }
    });

    const avgR = Math.round(totalR / colors.length);
    const avgG = Math.round(totalG / colors.length);
    const avgB = Math.round(totalB / colors.length);

    return this.rgbToHex(avgR, avgG, avgB);
  }

  private calculateDistance(rgb1: RGB, rgb2: RGB): number {
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  private calculateAccuracy(target: RGB, actual: RGB): number {
    const maxDistance = Math.sqrt(3 * 255 * 255); // Maximum possible distance
    const distance = this.calculateDistance(target, actual);
    return Math.max(0, 100 - (distance / maxDistance) * 100);
  }

  private initializePopulation(
    size: number,
    availableColors: string[],
    maxSlots: number
  ): string[][] {
    const population: string[][] = [];

    for (let i = 0; i < size; i++) {
      const individual: string[] = [];
      const numColors = Math.floor(Math.random() * maxSlots) + 1;

      for (let j = 0; j < numColors; j++) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        individual.push(randomColor);
      }

      population.push(individual);
    }

    return population;
  }

  private selectParent(population: string[][], fitnessScores: number[]): string[] {
    // Tournament selection
    const tournamentSize = 3;
    let bestIndex = 0;
    let bestFitness = Infinity;

    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      if (fitnessScores[randomIndex] < bestFitness) {
        bestFitness = fitnessScores[randomIndex];
        bestIndex = randomIndex;
      }
    }

    return [...population[bestIndex]];
  }

  private crossover(parent1: string[], parent2: string[]): string[] {
    const child: string[] = [];
    const maxLength = Math.max(parent1.length, parent2.length);

    for (let i = 0; i < maxLength; i++) {
      if (Math.random() < 0.5 && i < parent1.length) {
        child.push(parent1[i]);
      } else if (i < parent2.length) {
        child.push(parent2[i]);
      }
    }

    return child.length > 0 ? child : [parent1[0] || parent2[0]];
  }

  private mutate(individual: string[], availableColors: string[], mutationRate: number): string[] {
    const mutated = [...individual];

    for (let i = 0; i < mutated.length; i++) {
      if (Math.random() < mutationRate) {
        mutated[i] = availableColors[Math.floor(Math.random() * availableColors.length)];
      }
    }

    // Occasionally add or remove a color
    if (Math.random() < mutationRate) {
      if (Math.random() < 0.5 && mutated.length > 1) {
        mutated.pop(); // Remove a color
      } else if (mutated.length < 6) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        mutated.push(randomColor); // Add a color
      }
    }

    return mutated;
  }

  private formatGeneticSolution(colors: string[], targetRgb: RGB, distance: number): SolverResult {
    const finalColor = this.blendColors(colors);
    const finalRgb = this.hexToRgb(finalColor)!;

    return {
      success: true,
      steps: colors.map((color, index) => ({
        action: 'add' as const,
        color,
        slotIndex: index,
        description: `Add ${color} to slot ${index + 1}`
      })),
      finalColor,
      accuracy: this.calculateAccuracy(targetRgb, finalRgb),
      explanation: `Genetic algorithm solution: Mix ${colors.join(', ')} to achieve ${finalColor}.`
    };
  }

  private analyzePrimaryContributions(rgb: RGB): { red: number; green: number; blue: number } {
    const total = rgb.r + rgb.g + rgb.b;
    if (total === 0) return { red: 0, green: 0, blue: 0 };

    return {
      red: rgb.r / total,
      green: rgb.g / total,
      blue: rgb.b / total
    };
  }

  private buildColorTheorySolution(
    contributions: { red: number; green: number; blue: number },
    availableColors: string[],
    targetRgb: RGB,
    tolerance: number
  ): SolverResult {
    // Build solution based on primary color contributions
    const solution: string[] = [];

    // Add colors based on their contribution ratio
    const totalContribution = contributions.red + contributions.green + contributions.blue;
    const redSlots = Math.round((contributions.red / totalContribution) * 3);
    const greenSlots = Math.round((contributions.green / totalContribution) * 3);
    const blueSlots = Math.round((contributions.blue / totalContribution) * 3);

    for (let i = 0; i < redSlots && availableColors.includes('#ff0000'); i++) {
      solution.push('#ff0000');
    }
    for (let i = 0; i < greenSlots && availableColors.includes('#00ff00'); i++) {
      solution.push('#00ff00');
    }
    for (let i = 0; i < blueSlots && availableColors.includes('#0000ff'); i++) {
      solution.push('#0000ff');
    }

    if (solution.length > 0) {
      const mixedColor = this.blendColors(solution);
      const mixedRgb = this.hexToRgb(mixedColor);

      if (mixedRgb && this.calculateDistance(targetRgb, mixedRgb) <= tolerance) {
        return {
          success: true,
          steps: solution.map((color, index) => ({
            action: 'add' as const,
            color,
            slotIndex: index,
            description: `Add ${color} to slot ${index + 1} (color theory)`
          })),
          finalColor: mixedColor,
          accuracy: this.calculateAccuracy(targetRgb, mixedRgb),
          explanation: `Color theory solution: Mix based on primary color contributions.`
        };
      }
    }

    return {
      success: false,
      steps: [],
      finalColor: '#000000',
      accuracy: 0,
      explanation: 'Color theory approach failed'
    };
  }

  private solveWithComplementaryColors(
    targetRgb: RGB,
    availableColors: string[],
    tolerance: number
  ): SolverResult {
    // This is a placeholder for complementary color strategy
    // In a real implementation, this would use color wheel relationships
    return {
      success: false,
      steps: [],
      finalColor: '#000000',
      accuracy: 0,
      explanation: 'Complementary color approach not implemented'
    };
  }

  private generateAllCombinations(
    colors: string[],
    maxLength: number,
    callback: (combination: string[]) => void
  ): void {
    const generate = (current: string[], remaining: string[], depth: number) => {
      if (depth > 0 && current.length > 0) {
        callback([...current]);
      }

      if (depth >= maxLength) return;

      for (let i = 0; i < remaining.length; i++) {
        current.push(remaining[i]);
        generate(current, remaining, depth + 1);
        current.pop();
      }
    };

    generate([], colors, 0);
  }

  /**
   * Get a text-based solution for a given target color
   */
  getSolutionText(targetColor: string, options: SolverOptions = {}): string {
    const result = this.solve(targetColor, options);

    if (!result.success) {
      return (
        `❌ No exact solution found for ${targetColor}\n` +
        `📝 ${result.explanation}\n` +
        (result.steps.length > 0
          ? `🎯 Best attempt:\n${this.formatStepsAsText(result.steps)}\n`
          : '') +
        `🎨 Final color: ${result.finalColor} (${result.accuracy.toFixed(1)}% accurate)`
      );
    }

    return (
      `✅ Solution found for ${targetColor}!\n` +
      `📝 ${result.explanation}\n` +
      `🎯 Steps:\n${this.formatStepsAsText(result.steps)}\n` +
      `🎨 Final color: ${result.finalColor} (${result.accuracy.toFixed(1)}% accurate)`
    );
  }

  private formatStepsAsText(steps: MixingStep[]): string {
    return steps.map((step, index) => `${index + 1}. ${step.description}`).join('\n');
  }

  // Additional helper methods for lightness control

  private findClosestHue(
    targetHsl: { h: number; s: number; l: number },
    availableColors: string[]
  ): { color: string; distance: number } | null {
    let closestColor: string | null = null;
    let minDistance = Infinity;

    // Check primary and secondary colors for hue matching
    const hueColors = [
      { color: '#ff0000', hue: 0 }, // Red
      { color: '#ffff00', hue: 60 }, // Yellow
      { color: '#00ff00', hue: 120 }, // Green
      { color: '#00ffff', hue: 180 }, // Cyan
      { color: '#0000ff', hue: 240 }, // Blue
      { color: '#ff00ff', hue: 300 } // Magenta
    ];

    for (const hueColor of hueColors) {
      if (availableColors.includes(hueColor.color)) {
        const hueDiff = Math.min(
          Math.abs(targetHsl.h - hueColor.hue),
          360 - Math.abs(targetHsl.h - hueColor.hue)
        );

        if (hueDiff < minDistance) {
          minDistance = hueDiff;
          closestColor = hueColor.color;
        }
      }
    }

    return closestColor ? { color: closestColor, distance: minDistance } : null;
  }

  private calculateLightnessAdjustment(targetLightness: number): {
    needsWhite: boolean;
    needsBlack: boolean;
    whiteAmount: number;
    blackAmount: number;
  } {
    const baseLightness = 50; // Assume base colors are ~50% lightness

    if (targetLightness > baseLightness + 15) {
      // Need to add white
      const whiteRatio = (targetLightness - baseLightness) / (100 - baseLightness);
      return {
        needsWhite: true,
        needsBlack: false,
        whiteAmount: Math.min(3, Math.ceil(whiteRatio * 3)),
        blackAmount: 0
      };
    } else if (targetLightness < baseLightness - 15) {
      // Need to add black
      const blackRatio = (baseLightness - targetLightness) / baseLightness;
      return {
        needsWhite: false,
        needsBlack: true,
        whiteAmount: 0,
        blackAmount: Math.min(3, Math.ceil(blackRatio * 3))
      };
    }

    return { needsWhite: false, needsBlack: false, whiteAmount: 0, blackAmount: 0 };
  }

  private getStepDescription(color: string, index: number, totalSteps: number): string {
    const colorNames: { [key: string]: string } = {
      '#ff0000': 'red',
      '#00ff00': 'green',
      '#0000ff': 'blue',
      '#ffffff': 'white',
      '#000000': 'black',
      '#ffff00': 'yellow',
      '#ff00ff': 'magenta',
      '#00ffff': 'cyan'
    };

    const colorName = colorNames[color] || color;

    if (index === 0) {
      return `Add ${colorName} (${color}) as base color to slot ${index + 1}`;
    } else if (color === '#ffffff') {
      return `Add white (${color}) to slot ${index + 1} to lighten the mixture`;
    } else if (color === '#000000') {
      return `Add black (${color}) to slot ${index + 1} to darken the mixture`;
    } else {
      return `Add ${colorName} (${color}) to slot ${index + 1}`;
    }
  }

  private explainLightnessSolution(solution: string[]): string {
    const baseColor = solution[0];
    const whiteCount = solution.filter((c) => c === '#ffffff').length;
    const blackCount = solution.filter((c) => c === '#000000').length;

    const colorNames: { [key: string]: string } = {
      '#ff0000': 'red',
      '#00ff00': 'green',
      '#0000ff': 'blue',
      '#ffff00': 'yellow',
      '#ff00ff': 'magenta',
      '#00ffff': 'cyan'
    };

    const baseName = colorNames[baseColor] || baseColor;
    let explanation = `Start with ${baseName}`;

    if (whiteCount > 0) {
      explanation += `, then add ${whiteCount} part${whiteCount > 1 ? 's' : ''} white to lighten`;
    }

    if (blackCount > 0) {
      explanation += `, then add ${blackCount} part${blackCount > 1 ? 's' : ''} black to darken`;
    }

    return explanation + '.';
  }
}
