export enum MixingAlgorithm {
  ADDITIVE_RGB = 'additive_rgb',
  SUBTRACTIVE_CMY = 'subtractive_cmy',
  LAB_PERCEPTUAL = 'lab_perceptual',
  HSV_VIBRANT = 'hsv_vibrant',
  WEIGHTED_ALPHA = 'weighted_alpha'
}

export interface ColorMixingResult {
  color: string;
  algorithm: MixingAlgorithm;
}

export class ColorMixingAlgorithms {
  /**
   * Simple RGB averaging (current implementation)
   * Good for: Digital color mixing, quick calculations
   * Issues: Can produce muddy results
   */
  static additiveRgb(color1: string, color2: string): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const mixedR = Math.round((rgb1.r + rgb2.r) / 2);
    const mixedG = Math.round((rgb1.g + rgb2.g) / 2);
    const mixedB = Math.round((rgb1.b + rgb2.b) / 2);

    return this.rgbToHex(mixedR, mixedG, mixedB);
  }

  /**
   * Subtractive color mixing (paint-like)
   * Good for: Realistic paint mixing simulation
   * Simulates how pigments absorb light
   */
  static subtractiveCmy(color1: string, color2: string): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    // Convert RGB to CMY (subtractive color space)
    const c1 = 1 - rgb1.r / 255;
    const m1 = 1 - rgb1.g / 255;
    const y1 = 1 - rgb1.b / 255;

    const c2 = 1 - rgb2.r / 255;
    const m2 = 1 - rgb2.g / 255;
    const y2 = 1 - rgb2.b / 255;

    // Mix in CMY space (average the pigment amounts)
    const mixedC = (c1 + c2) / 2;
    const mixedM = (m1 + m2) / 2;
    const mixedY = (y1 + y2) / 2;

    // Convert back to RGB
    const mixedR = Math.round((1 - mixedC) * 255);
    const mixedG = Math.round((1 - mixedM) * 255);
    const mixedB = Math.round((1 - mixedY) * 255);

    return this.rgbToHex(mixedR, mixedG, mixedB);
  }

  /**
   * LAB color space mixing
   * Good for: Perceptually uniform color mixing
   * Matches human color perception better
   */
  static labPerceptual(color1: string, color2: string): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const lab1 = this.rgbToLab(rgb1.r, rgb1.g, rgb1.b);
    const lab2 = this.rgbToLab(rgb2.r, rgb2.g, rgb2.b);

    // Mix in LAB space
    const mixedL = (lab1.l + lab2.l) / 2;
    const mixedA = (lab1.a + lab2.a) / 2;
    const mixedB = (lab1.b + lab2.b) / 2;

    const mixedRgb = this.labToRgb(mixedL, mixedA, mixedB);
    return this.rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
  }

  /**
   * HSV color space mixing
   * Good for: Maintaining color vibrancy and saturation
   * Handles hue transitions more naturally
   */
  static hsvVibrant(color1: string, color2: string): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const hsv1 = this.rgbToHsv(rgb1.r, rgb1.g, rgb1.b);
    const hsv2 = this.rgbToHsv(rgb2.r, rgb2.g, rgb2.b);

    // Handle hue averaging (circular color wheel)
    let hueDiff = Math.abs(hsv1.h - hsv2.h);
    let mixedH;
    if (hueDiff > 180) {
      // Take the shorter path around the color wheel
      mixedH = ((hsv1.h + hsv2.h + 360) / 2) % 360;
    } else {
      mixedH = (hsv1.h + hsv2.h) / 2;
    }

    const mixedS = (hsv1.s + hsv2.s) / 2;
    const mixedV = (hsv1.v + hsv2.v) / 2;

    const mixedRgb = this.hsvToRgb(mixedH, mixedS, mixedV);
    return this.rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
  }

  /**
   * Weighted alpha blending
   * Good for: Simulating different paint amounts or transparency
   * Allows for more control over mixing ratios
   */
  static weightedAlpha(color1: string, color2: string, weight1: number = 0.5): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const weight2 = 1 - weight1;

    const mixedR = Math.round(rgb1.r * weight1 + rgb2.r * weight2);
    const mixedG = Math.round(rgb1.g * weight1 + rgb2.g * weight2);
    const mixedB = Math.round(rgb1.b * weight1 + rgb2.b * weight2);

    return this.rgbToHex(mixedR, mixedG, mixedB);
  }

  /**
   * Mix colors using the specified algorithm
   */
  static mixColors(color1: string, color2: string, algorithm: MixingAlgorithm = MixingAlgorithm.SUBTRACTIVE_CMY): ColorMixingResult {
    let result: string;

    switch (algorithm) {
      case MixingAlgorithm.ADDITIVE_RGB:
        result = this.additiveRgb(color1, color2);
        break;
      case MixingAlgorithm.SUBTRACTIVE_CMY:
        result = this.subtractiveCmy(color1, color2);
        break;
      case MixingAlgorithm.LAB_PERCEPTUAL:
        result = this.labPerceptual(color1, color2);
        break;
      case MixingAlgorithm.HSV_VIBRANT:
        result = this.hsvVibrant(color1, color2);
        break;
      case MixingAlgorithm.WEIGHTED_ALPHA:
        result = this.weightedAlpha(color1, color2);
        break;
      default:
        result = this.subtractiveCmy(color1, color2);
    }

    return {
      color: result,
      algorithm
    };
  }

  /**
   * Get available algorithms with descriptions
   */
  static getAlgorithmDescriptions(): Record<MixingAlgorithm, { name: string; description: string }> {
    return {
      [MixingAlgorithm.ADDITIVE_RGB]: {
        name: 'Additive RGB',
        description: 'Simple RGB averaging - quick but can be muddy'
      },
      [MixingAlgorithm.SUBTRACTIVE_CMY]: {
        name: 'Subtractive CMY',
        description: 'Paint-like mixing - realistic pigment behavior'
      },
      [MixingAlgorithm.LAB_PERCEPTUAL]: {
        name: 'LAB Perceptual',
        description: 'Perceptually uniform - matches human vision'
      },
      [MixingAlgorithm.HSV_VIBRANT]: {
        name: 'HSV Vibrant',
        description: 'Maintains color vibrancy and saturation'
      },
      [MixingAlgorithm.WEIGHTED_ALPHA]: {
        name: 'Weighted Alpha',
        description: 'Variable mixing ratios with transparency'
      }
    };
  }

  // Utility methods for color space conversions

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    const clamp = (val: number) => Math.max(0, Math.min(255, val));
    return '#' + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
  }

  private static rgbToLab(r: number, g: number, b: number) {
    // Convert RGB to XYZ then to LAB
    let rNorm = r / 255;
    let gNorm = g / 255;
    let bNorm = b / 255;

    // Gamma correction
    rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
    gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
    bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

    // Observer = 2°, Illuminant = D65
    const x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
    const y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.0721750;
    const z = rNorm * 0.0193339 + gNorm * 0.1191920 + bNorm * 0.9503041;

    // Normalize for D65 illuminant
    const xn = x / 0.95047;
    const yn = y / 1.00000;
    const zn = z / 1.08883;

    // Convert to LAB
    const fx = xn > 0.008856 ? Math.pow(xn, 1/3) : (7.787 * xn + 16/116);
    const fy = yn > 0.008856 ? Math.pow(yn, 1/3) : (7.787 * yn + 16/116);
    const fz = zn > 0.008856 ? Math.pow(zn, 1/3) : (7.787 * zn + 16/116);

    return {
      l: 116 * fy - 16,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz)
    };
  }

  private static labToRgb(l: number, a: number, b: number) {
    // Convert LAB back to RGB (reverse of above)
    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const xn = fx > 0.206897 ? Math.pow(fx, 3) : (fx - 16/116) / 7.787;
    const yn = fy > 0.206897 ? Math.pow(fy, 3) : (fy - 16/116) / 7.787;
    const zn = fz > 0.206897 ? Math.pow(fz, 3) : (fz - 16/116) / 7.787;

    const x = xn * 0.95047;
    const y = yn * 1.00000;
    const z = zn * 1.08883;

    let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
    let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
    let bVal = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
    bVal = bVal > 0.0031308 ? 1.055 * Math.pow(bVal, 1/2.4) - 0.055 : 12.92 * bVal;

    return {
      r: Math.max(0, Math.min(255, Math.round(r * 255))),
      g: Math.max(0, Math.min(255, Math.round(g * 255))),
      b: Math.max(0, Math.min(255, Math.round(bVal * 255)))
    };
  }

  private static rgbToHsv(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : diff / max;
    const v = max;

    return { h, s, v };
  }

  private static hsvToRgb(h: number, s: number, v: number) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }
}
