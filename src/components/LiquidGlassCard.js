import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { CandlelightPalette } from '../theme/colors';

/**
 * AppleBreviarioCard: Cartão translúcido no padrão de materiais Apple (WWDC),
 * com blur de profundidade, cantos em squircle de 20px e fino filete de luz
 * especular no topo (borderTopColor) para dar sensação de material físico nobre.
 */
export default function LiquidGlassCard({
  children,
  isHighlighted = false,
  style,
  contentStyle,
  cornerRadius = 20,
}) {
  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderRadius: cornerRadius,
          borderColor: isHighlighted
            ? CandlelightPalette.borderActive
            : CandlelightPalette.cardBorder,
          borderTopColor: isHighlighted
            ? '#FFFFFF'
            : CandlelightPalette.cardBorderTop,
          backgroundColor: isHighlighted
            ? CandlelightPalette.cardBgActive
            : CandlelightPalette.cardBg,
        },
        isHighlighted && styles.highlightedCard,
        style,
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 45 : 30}
        tint="dark"
        style={[styles.blurView, { borderRadius: cornerRadius }]}
      >
        <View style={[styles.contentContainer, contentStyle]}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 24, 0.72)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 4,
  },
  highlightedCard: {
    borderColor: '#FFFFFF',
    borderTopColor: '#FFFFFF',
    backgroundColor: 'rgba(32, 32, 38, 0.88)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 6,
  },
  blurView: {
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 16,
  },
});
