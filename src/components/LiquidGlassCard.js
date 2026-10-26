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
  cornerRadius = 22,
}) {
  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderRadius: cornerRadius,
          borderColor: isHighlighted
            ? 'rgba(245, 158, 11, 0.65)'
            : 'rgba(255, 255, 255, 0.14)',
          borderTopColor: isHighlighted
            ? 'rgba(255, 255, 255, 0.75)'
            : 'rgba(255, 255, 255, 0.32)',
          borderBottomColor: isHighlighted
            ? 'rgba(217, 119, 6, 0.45)'
            : 'rgba(255, 255, 255, 0.06)',
        },
        isHighlighted && styles.highlightedGlow,
        style,
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 60 : 35}
        tint="dark"
        style={[styles.blurView, { borderRadius: cornerRadius }]}
      >
        {/* Liquid Glass Volumetric Gradient Fill */}
        <LinearGradient
          colors={
            isHighlighted
              ? [
                  'rgba(245, 158, 11, 0.22)',
                  'rgba(217, 119, 6, 0.09)',
                  'rgba(245, 158, 11, 0.04)',
                ]
              : [
                  'rgba(255, 255, 255, 0.08)',
                  'rgba(255, 255, 255, 0.025)',
                  'rgba(245, 158, 11, 0.03)',
                ]
          }
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.innerOverlay}
        >
          {/* Top Specular Curved Bevel Highlight (Prismatic Glass Rim) */}
          <LinearGradient
            colors={[
              isHighlighted
                ? 'rgba(255, 255, 255, 0.85)'
                : 'rgba(255, 255, 255, 0.45)',
              isHighlighted
                ? 'rgba(245, 158, 11, 0.55)'
                : 'rgba(245, 158, 11, 0.20)',
              'rgba(255, 255, 255, 0.08)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.95, y: 0 }}
            style={styles.specularBar}
          />

          {/* Card Content Container */}
          <View style={[styles.contentContainer, contentStyle]}>{children}</View>

          {/* Bottom Ambient Caustics Rim (Liquid Glass Floor Refraction) */}
          <LinearGradient
            colors={['transparent', 'rgba(245, 158, 11, 0.14)', 'transparent']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            style={styles.bottomCausticsBar}
          />
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderWidth: 1.2,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 12, 18, 0.65)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 8,
  },
  highlightedGlow: {
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    backgroundColor: 'rgba(18, 15, 12, 0.75)',
  },
  blurView: {
    overflow: 'hidden',
  },
  innerOverlay: {
    position: 'relative',
  },
  specularBar: {
    height: 1.5,
    width: '100%',
  },
  bottomCausticsBar: {
    height: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 16,
  },
});
