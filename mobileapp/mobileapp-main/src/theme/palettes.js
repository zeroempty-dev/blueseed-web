export const darkPalette = {
  bg: '#000000',
  surface: '#141414',
  surfaceElevated: '#1c1c1c',
  border: '#2a2a2a',
  text: '#ffffff',
  textMuted: '#9ca3af',
  accent: '#ff6b00',
  accentDim: 'rgba(255, 107, 0, 0.15)',
  accentOn: '#000000',
  success: '#22c55e',
  statusBar: 'light',
};

export const lightPalette = {
  bg: '#ffffff',
  surface: '#f8fafc',
  surfaceElevated: '#f1f5f9',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  accent: '#2563eb',
  accentDim: 'rgba(37, 99, 235, 0.12)',
  accentOn: '#ffffff',
  success: '#16a34a',
  statusBar: 'dark',
};

export function resolvePalette(mode, systemScheme) {
  const effective = mode === 'system' ? systemScheme || 'dark' : mode;
  return effective === 'light' ? lightPalette : darkPalette;
}
