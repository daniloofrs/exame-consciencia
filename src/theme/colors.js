import { Platform } from 'react-native';

export const CandlelightPalette = {
  obsidian: '#07080D',
  deepSurface: '#0E1017',
  cardBg: 'rgba(255, 255, 255, 0.04)',
  cardBgActive: 'rgba(245, 158, 11, 0.08)',
  warmAmber: '#F59E0B',
  sacredBronze: '#D97706',
  bronzeBorder: 'rgba(217, 119, 6, 0.26)',
  parchment: '#FEF3C7',
  ivory: '#F8FAFC',
  mutedText: '#94A3B8',
  dimmedText: 'rgba(248, 250, 252, 0.25)',
  borderDefault: 'rgba(255, 255, 255, 0.10)',
  borderActive: 'rgba(245, 158, 11, 0.60)',
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  dangerBorder: 'rgba(239, 68, 68, 0.35)',
  dangerText: '#FCA5A5',
  successGlow: 'rgba(245, 158, 11, 0.35)',
};

export const Typography = {
  title: 'Cinzel_700Bold',
  subheading: 'Cinzel_600SemiBold',
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
  sans: Platform.select({ ios: 'System', default: 'sans-serif' }),
};
