import { ColorMixingSolver } from '../utils/ColorMixingSolver.js';

/**
 * Color Mixing Solver Demo
 *
 * This file demonstrates how to use the ColorMixingSolver to solve
 * color mixing problems. It can be run independently or integrated
 * into the main game.
 */

// Create a solver instance
const solver = new ColorMixingSolver();

// Define the game levels from the config
const gameLevels = [
  { name: 'Primary Colors', targetColor: '#ff8000', tolerance: 25 }, // Orange
  { name: 'Green Challenge', targetColor: '#00ff00', tolerance: 20 }, // Pure Green
  { name: 'Purple Power', targetColor: '#8000ff', tolerance: 25 }, // Purple
  { name: 'Coral Creation', targetColor: '#ff6b47', tolerance: 30 }, // Coral
  { name: 'Ocean Blue', targetColor: '#0080c7', tolerance: 25 }, // Ocean Blue
  { name: 'Sunset Orange', targetColor: '#ff4500', tolerance: 20 }, // Orange Red
  { name: 'Forest Green', targetColor: '#228b22', tolerance: 30 }, // Forest Green
  { name: 'Lavender Fields', targetColor: '#e6e6fa', tolerance: 25 }, // Lavender
  { name: 'Golden Hour', targetColor: '#ffd700', tolerance: 20 }, // Gold
  { name: 'Master Mixer', targetColor: '#008b8b', tolerance: 15 } // Dark Cyan
];

/**
 * Solve all game levels and display results
 */
export function solveAllLevels(): void {
  console.log('🎨 Color Mixing Solver - Game Level Solutions\n');
  console.log('='.repeat(60));

  gameLevels.forEach((level, index) => {
    console.log(`\n🎯 Level ${index + 1}: ${level.name}`);
    console.log(`Target: ${level.targetColor} | Tolerance: ${level.tolerance}`);
    console.log('-'.repeat(40));

    const options = {
      tolerance: level.tolerance,
      availableColors: ['#ff0000', '#00ff00', '#0000ff'], // Red, Green, Blue
      maxSlots: 6
    };

    const solutionText = solver.getSolutionText(level.targetColor, options);
    console.log(solutionText);
    console.log('-'.repeat(40));
  });
}

/**
 * Solve a specific color interactively
 */
export function solveSpecificColor(targetColor: string, tolerance: number = 25): void {
  console.log(`\n🎯 Solving for color: ${targetColor}`);
  console.log(`Tolerance: ${tolerance}`);
  console.log('-'.repeat(40));

  const options = {
    tolerance,
    availableColors: ['#ff0000', '#00ff00', '#0000ff'], // Red, Green, Blue
    maxSlots: 6
  };

  const result = solver.solve(targetColor, options);

  if (result.success) {
    console.log('✅ Solution found!');
    console.log(`Steps to achieve ${targetColor}:`);
    result.steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.description}`);
    });
    console.log(`Final color: ${result.finalColor}`);
    console.log(`Accuracy: ${result.accuracy.toFixed(1)}%`);
  } else {
    console.log('❌ No exact solution found');
    console.log('Best attempt:');
    result.steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.description}`);
    });
    console.log(`Closest color: ${result.finalColor}`);
    console.log(`Accuracy: ${result.accuracy.toFixed(1)}%`);
  }
}

/**
 * Demonstrate different solver strategies
 */
export function demonstrateSolverStrategies(): void {
  console.log('\n🧪 Solver Strategy Demonstration\n');
  console.log('='.repeat(60));

  const testCases = [
    { color: '#ff8000', description: 'Orange (Red + Yellow equivalent)' },
    { color: '#800080', description: 'Purple (Red + Blue)' },
    { color: '#40c040', description: 'Light Green' },
    { color: '#808080', description: 'Gray (complex mixture)' }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n🧪 Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Target: ${testCase.color}`);
    console.log('-'.repeat(30));

    // Test with different tolerances
    [15, 25, 35].forEach((tolerance) => {
      console.log(`\n📊 Tolerance: ${tolerance}`);
      const result = solver.solve(testCase.color, { tolerance });
      console.log(`Success: ${result.success ? '✅' : '❌'}`);
      console.log(`Steps: ${result.steps.length}`);
      console.log(`Accuracy: ${result.accuracy.toFixed(1)}%`);
    });
  });
}

/**
 * Export the solver for use in other modules
 */
export { ColorMixingSolver };

/**
 * Main execution when run as a script
 */
if (import.meta.main) {
  console.log('🎨 Color Mixing Solver Initialized\n');

  // Solve all game levels
  solveAllLevels();

  // Demonstrate strategies
  demonstrateSolverStrategies();

  // Interactive example
  console.log('\n🎮 Interactive Examples:\n');
  solveSpecificColor('#ff4500', 20); // Sunset Orange
  solveSpecificColor('#e6e6fa', 25); // Lavender
}
