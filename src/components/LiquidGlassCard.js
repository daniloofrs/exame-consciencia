import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CandlelightPalette } from '../theme/colors';

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
            : CandlelightPalette.borderDefault,
        },
        isHighlighted && styles.highlightedShadow,
        style,
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 45 : 30}
        tint="dark"
        style={[styles.blurView, { borderRadius: cornerRadius }]}
      >
        <View
          style={[
            styles.innerOverlay,
            {
              backgroundColor: isHighlighted
                ? CandlelightPalette.cardBgActive
                : CandlelightPalette.cardBg,
            },
          ]}
        >
          {/* Top specular highlight representing Liquid Glass refraction */}
          <LinearGradient
            colors={[
              isHighlighted ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)',
              isHighlighted ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.15)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.specularBar}
          />
          <View style={[styles.contentContainer, contentStyle]}>{children}</View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(14, 16, 23, 0.65)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  highlightedShadow: {
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
  blurView: {
    overflow: 'hidden',
  },
  innerOverlay: {
    position: 'relative',
  },
  specularBar: {
    height: 1.2,
    width: '100%',
  },
  contentContainer: {
    padding: 16,
  },
});
