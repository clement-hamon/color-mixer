import { RGB, HSL } from '../types/Color.js';

export class ColorUtils {
  /**
   * Convert hex to RGB
   */
  static hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(r: number, g: number, b: number): string {
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

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number = 0,
      s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Validate hex color
   */
  static isValidHex(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  /**
   * Calculate color distance using Euclidean distance
   */
  static calculateColorDistance(rgb1: RGB, rgb2: RGB): number {
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  /**
   * Blend multiple colors together
   */
  static blendMultipleColors(colors: string[]): string {
    if (colors.length === 0) {
      return '#000000';
    }
    if (colors.length === 1) {
      return colors[0];
    }

    let totalR = 0,
      totalG = 0,
      totalB = 0;

    colors.forEach((color) => {
      const rgb = ColorUtils.hexToRgb(color);
      if (rgb) {
        totalR += rgb.r;
        totalG += rgb.g;
        totalB += rgb.b;
      }
    });

    const avgR = Math.round(totalR / colors.length);
    const avgG = Math.round(totalG / colors.length);
    const avgB = Math.round(totalB / colors.length);

    return ColorUtils.rgbToHex(avgR, avgG, avgB);
  }

  /**
   * Generate animated color for hero section
   */
  static generateAnimatedColor(time: number, offset: number): string {
    const r = Math.floor(127 + 127 * Math.sin(time * 0.5 + offset));
    const g = Math.floor(127 + 127 * Math.sin(time * 0.3 + offset + Math.PI / 3));
    const b = Math.floor(127 + 127 * Math.sin(time * 0.7 + offset + (Math.PI * 2) / 3));

    return ColorUtils.rgbToHex(r, g, b);
  }
}
