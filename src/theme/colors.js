import { Platform } from 'react-native';

/**
 * Paleta Litúrgica Apple Breviário (Dark OLED & Translucent Glass)
 * Síntese da sobriedade sacra com o artesanato de interface da Apple (WWDC):
 * Materiais translúcidos com iluminação de borda especular, preto OLED puro,
 * feedback mecânico com zero latência e tipografia óptica refinada.
 */
export const CandlelightPalette = {
  // Fundo e Superfícies (OLED Pure Black & Apple Glass)
  obsidian: '#000000',
  pureBlack: '#000000',
  deepSurface: '#0A0A0C',
  cardBg: 'rgba(20, 20, 24, 0.72)',
  cardBgActive: 'rgba(32, 32, 38, 0.85)',
  cardBorderTop: 'rgba(255, 255, 255, 0.16)', // Filete superior de luz especular
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  elevatedSurface: '#141418',
  appleNavBg: 'rgba(0, 0, 0, 0.75)',
  appleSheetBg: '#141418',
  appleSheetGrabber: 'rgba(255, 255, 255, 0.35)',

  // Acentos Nobres & Ações (Marfim Apple & Ouro Velho)
  warmAmber: '#F5F5F4', // Marfim principal para destaque e botões nobres
  sacredBronze: '#E7E5E4', // Gradiente marfim puro
  antiqueGold: '#D4AF37', // Acento de ouro velho para selos e cruzes
  rubricRed: '#B91C1C', // Rúbrica litúrgica carmim

  // Bordas Hairline (Filetes de Encadernação e Vidro Apple)
  borderDefault: 'rgba(255, 255, 255, 0.08)',
  bronzeBorder: 'rgba(255, 255, 255, 0.12)',
  borderActive: '#F5F5F4',

  // Tipografia (Marfim, Pedra e Rúbrica)
  ivory: '#FFFFFF',
  parchment: '#F5F5F4',
  mutedText: '#A8A29E',
  dimmedText: '#57534E',

  // Estados & Alertas
  dangerBg: 'rgba(185, 28, 28, 0.16)',
  dangerBorder: 'rgba(185, 28, 28, 0.45)',
  dangerText: '#FCA5A5',
  successGlow: 'rgba(245, 245, 244, 0.15)',
};

export const BreviarioPalette = CandlelightPalette;

export const Typography = {
  title: 'Cinzel_700Bold',
  subheading: 'Cinzel_600SemiBold',
  regular: 'Cinzel_400Regular',
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
  sans: Platform.select({ ios: 'System', default: 'sans-serif' }),

  // Tracking óptico refinado (WWDC 2020: The Details of UI Typography)
  trackingDisplay: -0.5,
  trackingRubric: 1.2,
  trackingBody: 0.1,
};
