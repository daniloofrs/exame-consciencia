import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated, Dimensions, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CandlelightPalette } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LiquidGlassCard({
  children,
  isHighlighted = false,
  style,
  contentStyle,
  cornerRadius = 22,
}) {
  // Fluid Specular Shimmer animation for highlighted glass cards
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    let loop;
    if (isHighlighted) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 3800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.delay(1200),
          Animated.timing(shimmerAnim, {
            toValue: -1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      shimmerAnim.setValue(-1);
    }

    return () => {
      if (loop) loop.stop();
    };
  }, [isHighlighted, shimmerAnim]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.8],
  });

  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderRadius: cornerRadius,
          borderColor: isHighlighted
            ? 'rgba(245, 158, 11, 0.80)'
            : 'rgba(255, 255, 255, 0.16)',
          borderTopColor: isHighlighted
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.42)',
          borderBottomColor: isHighlighted
            ? 'rgba(217, 119, 6, 0.65)'
            : 'rgba(245, 158, 11, 0.18)',
        },
        isHighlighted && styles.neonSacroCaustics,
        style,
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 65 : 40}
        tint="dark"
        style={[styles.blurView, { borderRadius: cornerRadius }]}
      >
        {/* Volumetric Liquid Glass Tint */}
        <LinearGradient
          colors={
            isHighlighted
              ? [
                  'rgba(245, 158, 11, 0.26)',
                  'rgba(217, 119, 6, 0.12)',
                  'rgba(245, 158, 11, 0.05)',
                ]
              : [
                  'rgba(255, 255, 255, 0.09)',
                  'rgba(255, 255, 255, 0.03)',
                  'rgba(245, 158, 11, 0.035)',
                ]
          }
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.innerOverlay}
        >
          {/* Top Specular Bevel Rim (Curved Prismatic Glass Lens) */}
          <LinearGradient
            colors={[
              isHighlighted
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(255, 255, 255, 0.65)',
              isHighlighted
                ? 'rgba(245, 158, 11, 0.75)'
                : 'rgba(245, 158, 11, 0.28)',
              'rgba(255, 255, 255, 0.12)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.95, y: 0 }}
            style={styles.specularBar}
          />

          {/* Animated Fluid Specular Shimmer Beam */}
          {isHighlighted && (
            <Animated.View
              style={[
                styles.shimmerBeamContainer,
                {
                  transform: [{ translateX: shimmerTranslateX }, { rotate: '25deg' }],
                },
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255, 255, 255, 0.18)',
                  'rgba(245, 158, 11, 0.25)',
                  'rgba(255, 255, 255, 0.18)',
                  'transparent',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
          )}

          {/* Card Content Container */}
          <View style={[styles.contentContainer, contentStyle]}>{children}</View>

          {/* Bottom Ambient Caustics Reflection (Molten Glass Floor) */}
          <LinearGradient
            colors={[
              'transparent',
              isHighlighted
                ? 'rgba(245, 158, 11, 0.35)'
                : 'rgba(245, 158, 11, 0.16)',
              'transparent',
            ]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 0 }}
            style={styles.bottomCausticsBar}
          />
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderWidth: 1.3,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 12, 18, 0.65)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 8,
  },
  neonSacroCaustics: {
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.72,
    shadowRadius: 28,
    elevation: 12,
    backgroundColor: 'rgba(22, 18, 12, 0.80)',
  },
  blurView: {
    overflow: 'hidden',
  },
  innerOverlay: {
    position: 'relative',
    overflow: 'hidden',
  },
  specularBar: {
    height: 1.6,
    width: '100%',
  },
  bottomCausticsBar: {
    height: 1.2,
    width: '100%',
  },
  shimmerBeamContainer: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    width: 80,
    zIndex: 1,
  },
  shimmerGradient: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    zIndex: 2,
  },
});
