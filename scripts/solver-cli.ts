#!/usr/bin/env bun

/**
 * Color Mixing Solver CLI
 * 
 * A command-line interface for testing the color mixing solver.
 * 
 * Usage:
 *   bun run solver-cli.ts <target-color> [tolerance]
 *   bun run solver-cli.ts --demo
 *   bun run solver-cli.ts --all-levels
 */

import { ColorMixingSolver, type MixingStep } from '../src/utils/ColorMixingSolver.js';

const solver = new ColorMixingSolver();

function printUsage(): void {
  console.log(`
🎨 Color Mixing Solver CLI

Usage:
  bun run solver-cli.ts <target-color> [tolerance]    Solve for a specific color
  bun run solver-cli.ts --demo                        Run demonstration
  bun run solver-cli.ts --all-levels                  Solve all game levels
  bun run solver-cli.ts --help                        Show this help

Examples:
  bun run solver-cli.ts "#ff8000" 25                  Solve for orange with tolerance 25
  bun run solver-cli.ts "#800080"                     Solve for purple with default tolerance
  bun run solver-cli.ts --demo                        Run demo with multiple examples
`);
}

function solveColor(targetColor: string, tolerance: number = 25): void {
  console.log(`\n🎯 Solving for color: ${targetColor}`);
  console.log(`📏 Tolerance: ${tolerance}`);
  console.log(`🎨 Available colors: Red, Green, Blue, White, Black, Yellow, Magenta, Cyan`);
  console.log('-'.repeat(60));
  
  const options = {
    tolerance,
    availableColors: [
      '#ff0000', // Red
      '#00ff00', // Green  
      '#0000ff', // Blue
      '#ffffff', // White
      '#000000', // Black
      '#ffff00', // Yellow
      '#ff00ff', // Magenta
      '#00ffff'  // Cyan
    ],
    maxSlots: 6,
    maxIterations: 1000
  };
  
  const startTime = Date.now();
  const result = solver.solve(targetColor, options);
  const endTime = Date.now();
  
  console.log(`⏱️  Solved in ${endTime - startTime}ms\n`);
  
  if (result.success) {
    console.log('✅ SUCCESS! Exact solution found:');
    console.log(`🎯 Target: ${targetColor}`);
    console.log(`🎨 Result: ${result.finalColor}`);
    console.log(`📊 Accuracy: ${result.accuracy.toFixed(1)}%`);
    console.log(`\n📝 Steps to achieve the color:`);
    result.steps.forEach((step: MixingStep, index: number) => {
      console.log(`   ${index + 1}. ${step.description}`);
    });
    console.log(`\n💡 ${result.explanation}`);
  } else {
    console.log('⚠️  No exact solution found within tolerance');
    console.log(`🎯 Target: ${targetColor}`);
    console.log(`🎨 Best result: ${result.finalColor}`);
    console.log(`📊 Accuracy: ${result.accuracy.toFixed(1)}%`);
    
    if (result.steps.length > 0) {
      console.log(`\n📝 Best attempt steps:`);
      result.steps.forEach((step: MixingStep, index: number) => {
        console.log(`   ${index + 1}. ${step.description}`);
      });
    }
    console.log(`\n💡 ${result.explanation}`);
  }
}

function runDemo(): void {
  console.log('🧪 Color Mixing Solver Demo\n');
  console.log('='.repeat(60));
  
  const demoColors = [
    { color: '#ff8000', name: 'Orange', description: 'Should mix red and green' },
    { color: '#800080', name: 'Purple', description: 'Should mix red and blue' },
    { color: '#008000', name: 'Dark Green', description: 'Mainly green component' },
    { color: '#ffff00', name: 'Yellow', description: 'Should mix red and green equally' },
    { color: '#808080', name: 'Gray', description: 'Equal mix of all colors' },
    { color: '#ff6b47', name: 'Coral', description: 'Complex reddish-orange' }
  ];
  
  demoColors.forEach((demo, index) => {
    console.log(`\n${index + 1}. ${demo.name} - ${demo.description}`);
    console.log('─'.repeat(40));
    solveColor(demo.color, 25);
    
    if (index < demoColors.length - 1) {
      console.log('\n' + '═'.repeat(60));
    }
  });
}

function solveAllGameLevels(): void {
  console.log('🎮 Solving All Game Levels\n');
  console.log('='.repeat(60));
  
  const gameLevels = [
    { name: "Primary Colors", targetColor: "#ff8000", tolerance: 25 },
    { name: "Green Challenge", targetColor: "#00ff00", tolerance: 20 },
    { name: "Purple Power", targetColor: "#8000ff", tolerance: 25 },
    { name: "Coral Creation", targetColor: "#ff6b47", tolerance: 30 },
    { name: "Ocean Blue", targetColor: "#0080c7", tolerance: 25 },
    { name: "Sunset Orange", targetColor: "#ff4500", tolerance: 20 },
    { name: "Forest Green", targetColor: "#228b22", tolerance: 30 },
    { name: "Lavender Fields", targetColor: "#e6e6fa", tolerance: 25 },
    { name: "Golden Hour", targetColor: "#ffd700", tolerance: 20 },
    { name: "Master Mixer", targetColor: "#008b8b", tolerance: 15 }
  ];
  
  let successCount = 0;
  
  gameLevels.forEach((level, index) => {
    console.log(`\n🎯 Level ${index + 1}: ${level.name}`);
    console.log(`Target: ${level.targetColor} | Tolerance: ${level.tolerance}`);
    console.log('─'.repeat(50));
    
    const result = solver.solve(level.targetColor, {
      tolerance: level.tolerance,
      availableColors: [
        '#ff0000', // Red
        '#00ff00', // Green  
        '#0000ff', // Blue
        '#ffffff', // White
        '#000000', // Black
        '#ffff00', // Yellow
        '#ff00ff', // Magenta
        '#00ffff'  // Cyan
      ],
      maxSlots: 6
    });
    
    if (result.success) {
      successCount++;
      console.log(`✅ SOLVED! Accuracy: ${result.accuracy.toFixed(1)}%`);
      console.log(`Steps: ${result.steps.length} | Final: ${result.finalColor}`);
    } else {
      console.log(`❌ No exact solution. Best: ${result.accuracy.toFixed(1)}%`);
      console.log(`Best attempt: ${result.finalColor}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Summary: ${successCount}/${gameLevels.length} levels solved exactly`);
  console.log(`🎯 Success rate: ${((successCount / gameLevels.length) * 100).toFixed(1)}%`);
}

// Main CLI logic
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    printUsage();
    return;
  }
  
  if (args.includes('--demo')) {
    runDemo();
    return;
  }
  
  if (args.includes('--all-levels')) {
    solveAllGameLevels();
    return;
  }
  
  const targetColor = args[0];
  const tolerance = args[1] ? parseInt(args[1]) : 25;
  
  if (!targetColor.match(/^#[0-9a-fA-F]{6}$/)) {
    console.error('❌ Error: Target color must be in hex format (e.g., #ff8000)');
    printUsage();
    process.exit(1);
  }
  
  if (isNaN(tolerance) || tolerance < 0 || tolerance > 255) {
    console.error('❌ Error: Tolerance must be a number between 0 and 255');
    printUsage();
    process.exit(1);
  }
  
  solveColor(targetColor, tolerance);
}

// Run the CLI
main();
