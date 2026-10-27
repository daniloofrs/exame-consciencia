import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { CandlelightPalette } from '../theme/colors';

/**
 * BreviarioCard: Cartão litúrgico com acabamento de couro/ardósia polida,
 * bordas hairline milimétricas e sobriedade total, ideal para foco e devoção.
 */
export default function LiquidGlassCard({
  children,
  isHighlighted = false,
  style,
  contentStyle,
  cornerRadius = 16,
}) {
  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderRadius: cornerRadius,
          borderColor: isHighlighted
            ? CandlelightPalette.borderActive
            : CandlelightPalette.borderDefault,
          backgroundColor: isHighlighted
            ? CandlelightPalette.cardBgActive
            : CandlelightPalette.cardBg,
        },
        isHighlighted && styles.highlightedCard,
        style,
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 25 : 15}
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
    backgroundColor: '#0A0A0C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
  },
  highlightedCard: {
    borderColor: '#F5F5F4',
    backgroundColor: '#141418',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 16,
    elevation: 6,
  },
  blurView: {
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 16,
  },
});
