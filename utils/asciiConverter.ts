import { DENSITY_MAPS, AsciiOptions } from '../types';

export const getAsciiChar = (brightness: number, densityType: keyof typeof DENSITY_MAPS): string => {
  const map = DENSITY_MAPS[densityType];
  const index = Math.floor((brightness / 255) * (map.length - 1));
  return map[index];
};

export const processFrame = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: AsciiOptions
): string[] => {
  const { contrast, brightness, density } = options;
  const frameData = ctx.getImageData(0, 0, width, height);
  const data = frameData.data;
  const rows: string[] = [];
  
  // Pre-calculate contrast factor
  const contrastFactor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      // const a = data[offset + 3];

      // Standard luminosity conversion
      let originalBrightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Apply contrast
      let cBrightness = contrastFactor * (originalBrightness - 128) + 128;
      
      // Apply brightness multiplier
      cBrightness = cBrightness * brightness;

      // Clamp
      cBrightness = Math.max(0, Math.min(255, cBrightness));

      row += getAsciiChar(cBrightness, density);
    }
    rows.push(row);
  }
  return rows;
};

// Helper to determine text color based on mode
export const getFillStyle = (ctx: CanvasRenderingContext2D, width: number, height: number, mode: AsciiOptions['colorMode']) => {
  if (mode === 'matrix') {
    return '#00ff00';
  } else if (mode === 'bw') {
    return '#ffffff';
  } else if (mode === 'retro') {
    return '#ffb000'; // Amber
  } else if (mode === 'color') {
    // Note: 'color' mode handled differently in rendering loop (per character) 
    // but for simple text rendering we usually default to white if we can't do per-char
    // The main renderer will handle per-char color if we implement it, 
    // but for performance we might stick to monochrome text rendering 
    // unless we iterate char by char in the main loop.
    return '#ffffff';
  }
  return '#00ff00';
};
