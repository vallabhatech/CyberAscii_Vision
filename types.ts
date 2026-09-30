export interface AsciiOptions {
  fontSize: number;
  brightness: number;
  contrast: number;
  colorMode: 'matrix' | 'bw' | 'color' | 'retro';
  density: 'simple' | 'complex' | 'binary' | 'blocks';
  resolution: number; // Sampling scale from 0.1 to 1.0.
}

export const DENSITY_MAPS = {
  simple: " .:-=+*#%@",
  complex: " .^!*<&%$#@",
  binary: " 01",
  blocks: " ░▒▓█",
};
