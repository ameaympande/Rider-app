export const colors = {
  background: '#05070A',
  surface: '#0F1218',
  surfaceHigh: '#171B24',
  border: '#1F252F',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  neonGreen: '#A8FF00', // Keeping the Lime Green for high contrast
  electricOrange: '#FF5C00',
  deepBlue: '#3182CE',
  danger: '#F56565',
  warning: '#ED8936',
  success: '#48BB78',
  mapDark: '#0A111F',
  
  // Design tokens for Premium Dark HITCH cards
  cardBg: '#0F1218',
  cardShadow: 'rgba(0, 0, 0, 0.5)',
  
  // Glassmorphism tokens (adjusted for dark theme)
  glassBg: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBgDark: 'rgba(0, 0, 0, 0.4)',
  
  // Gradient definitions
  gradients: {
    primary: ['#A8FF00', '#76CC00'] as string[], // Lime Green
    secondary: ['#1F252F', '#05070A'] as string[], // Dark
    accent: ['#FF5C00', '#DD6B20'] as string[],
    surface: ['#171B24', '#0F1218'] as string[],
  },
} as const;

export type AppColor = keyof typeof colors;
