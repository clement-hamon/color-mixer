import { test, expect, describe, beforeEach } from 'bun:test';

// Mock color mixing functions for testing
function mixColors(colors, ratios) {
  if (colors.length !== ratios.length) {
    throw new Error('Colors and ratios arrays must have the same length');
  }
  
  if (Math.abs(ratios.reduce((sum, ratio) => sum + ratio, 0) - 1) > 0.001) {
    throw new Error('Ratios must sum to 1');
  }
  
  return {
    r: Math.round(colors.reduce((sum, color, i) => sum + color.r * ratios[i], 0)),
    g: Math.round(colors.reduce((sum, color, i) => sum + color.g * ratios[i], 0)),
    b: Math.round(colors.reduce((sum, color, i) => sum + color.b * ratios[i], 0))
  };
}

function calculateColorDistance(color1, color2) {
  // Simple Euclidean distance in RGB space
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function rgbToHex(color) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

describe('Color Engine', () => {
  describe('Color mixing', () => {
    test('should mix two primary colors correctly', () => {
      const red = { r: 255, g: 0, b: 0 };
      const blue = { r: 0, g: 0, b: 255 };
      
      const result = mixColors([red, blue], [0.5, 0.5]);
      
      expect(result.r).toBe(128);
      expect(result.g).toBe(0);
      expect(result.b).toBe(128);
    });
    
    test('should handle unequal mixing ratios', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      
      const result = mixColors([white, black], [0.75, 0.25]);
      
      expect(result.r).toBe(191);
      expect(result.g).toBe(191);
      expect(result.b).toBe(191);
    });
    
    test('should throw error for mismatched array lengths', () => {
      const colors = [{ r: 255, g: 0, b: 0 }];
      const ratios = [0.5, 0.5];
      
      expect(() => mixColors(colors, ratios)).toThrow('Colors and ratios arrays must have the same length');
    });
    
    test('should throw error for invalid ratios', () => {
      const colors = [{ r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }];
      const ratios = [0.3, 0.3]; // Sum is 0.6, not 1.0
      
      expect(() => mixColors(colors, ratios)).toThrow('Ratios must sum to 1');
    });
  });
  
  describe('Color distance calculation', () => {
    test('should calculate distance between identical colors as 0', () => {
      const color = { r: 128, g: 128, b: 128 };
      
      const distance = calculateColorDistance(color, color);
      
      expect(distance).toBe(0);
    });
    
    test('should calculate distance between opposite colors', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      
      const distance = calculateColorDistance(white, black);
      
      expect(distance).toBeCloseTo(441.67, 1); // sqrt(255^2 * 3)
    });
    
    test('should calculate distance between primary colors', () => {
      const red = { r: 255, g: 0, b: 0 };
      const green = { r: 0, g: 255, b: 0 };
      
      const distance = calculateColorDistance(red, green);
      
      expect(distance).toBeCloseTo(360.62, 1); // sqrt(255^2 + 255^2)
    });
  });
  
  describe('Color format conversion', () => {
    test('should convert RGB to hex correctly', () => {
      const red = { r: 255, g: 0, b: 0 };
      expect(rgbToHex(red)).toBe('#ff0000');
      
      const white = { r: 255, g: 255, b: 255 };
      expect(rgbToHex(white)).toBe('#ffffff');
      
      const gray = { r: 128, g: 128, b: 128 };
      expect(rgbToHex(gray)).toBe('#808080');
    });
    
    test('should handle edge cases in hex conversion', () => {
      const black = { r: 0, g: 0, b: 0 };
      expect(rgbToHex(black)).toBe('#000000');
      
      const singleDigit = { r: 1, g: 2, b: 3 };
      expect(rgbToHex(singleDigit)).toBe('#010203');
    });
  });
});

describe('Game Logic', () => {
  let gameState;
  
  beforeEach(() => {
    gameState = {
      level: 1,
      score: 0,
      attempts: 0,
      targetColor: { r: 128, g: 64, b: 192 },
      currentMix: [],
      startTime: Date.now(),
      isComplete: false
    };
  });
  
  test('should initialize game state correctly', () => {
    expect(gameState.level).toBe(1);
    expect(gameState.score).toBe(0);
    expect(gameState.attempts).toBe(0);
    expect(gameState.isComplete).toBe(false);
  });
  
  test('should calculate accuracy correctly', () => {
    const target = { r: 100, g: 100, b: 100 };
    const guess = { r: 110, g: 90, b: 105 };
    
    const distance = calculateColorDistance(target, guess);
    const maxDistance = Math.sqrt(255 * 255 * 3); // Maximum possible distance
    const accuracy = Math.max(0, 100 - (distance / maxDistance) * 100);
    
    expect(accuracy).toBeGreaterThan(90); // Should be quite accurate
    expect(accuracy).toBeLessThanOrEqual(100);
  });
});

describe('Performance Tests', () => {
  test('should handle large number of color mixing operations efficiently', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      const color1 = { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };
      const color2 = { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };
      mixColors([color1, color2], [0.5, 0.5]);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100); // Should complete in under 100ms
  });
});
