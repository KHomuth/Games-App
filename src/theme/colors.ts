/**
 * Light and dark palettes — same keys so components can swap the active set.
 */
const palette = {
  light: {
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceMuted: '#e8eaf0',
    primary: '#1a237e',
    primaryMuted: '#3949ab',
    danger: '#c62828',
    textPrimary: '#1a1a1a',
    textSecondary: '#5c5c5c',
    textOnPrimary: '#ffffff',
    border: '#c5c9d4',
    cardShadow: '#9e9e9e',
    overlay: 'rgba(0,0,0,0.45)',
  },
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceMuted: '#2a2a2a',
    primary: '#7986cb',
    primaryMuted: '#9fa8da',
    danger: '#ef5350',
    textPrimary: '#f5f5f5',
    textSecondary: '#b0b0b0',
    textOnPrimary: '#ffffff',
    border: '#3a3a3a',
    cardShadow: '#000000',
    overlay: 'rgba(0,0,0,0.6)',
  },
} as const;

export const lightColors = palette.light;
export const darkColors = palette.dark;

export type ThemeColors = { readonly [K in keyof typeof lightColors]: string };
export type ColorMode = 'light' | 'dark';

/** @deprecated Use `useTheme().colors` instead. */
export const colors = lightColors;
