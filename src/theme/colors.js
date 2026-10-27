import { Platform } from 'react-native';

/**
 * Paleta Litúrgica Breviário (Preto OLED & Marfim Puro)
 * Inspirada na encadernação em couro negro de breviários e missais antigos,
 * com contraste absoluto, tipografia marfim legível na penumbra e ausência de ruídos visuais.
 */
export const CandlelightPalette = {
  // Fundo e Superfícies (OLED Pure Black & Ardósia)
  obsidian: '#000000',
  pureBlack: '#000000',
  deepSurface: '#0A0A0C',
  cardBg: '#0A0A0C',
  cardBgActive: '#141418',
  elevatedSurface: '#121214',

  // Acentos Nobres & Ações (Marfim Litúrgico & Ouro Velho)
  warmAmber: '#F5F5F4', // Marfim principal para destaque e botões nobres
  sacredBronze: '#E7E5E4', // Gradiente marfim puro
  antiqueGold: '#D4AF37', // Acento de ouro velho para selos e cruzes
  rubricRed: '#B91C1C', // Rúbrica litúrgica carmim

  // Bordas Hairline (Filetes de Encadernação)
  borderDefault: '#222226',
  bronzeBorder: '#28282E',
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
};
