import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandlelightPalette } from '../theme/colors';

export default function CandlelightBackground({ children }) {
  // Candle breathing animation
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const secondaryPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Primary sanctuary candle flame
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Secondary subtle caustics pulse
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(secondaryPulse, {
          toValue: 1,
          duration: 4800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(secondaryPulse, {
          toValue: 0,
          duration: 4400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop1.start();
    loop2.start();

    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [breatheAnim, secondaryPulse]);

  const candleScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.0, 1.09],
  });

  const candleOpacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.70, 0.98],
  });

  const secondaryOpacity = secondaryPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.65],
  });

  return (
    <View style={styles.container}>
      {/* Base deep obsidian floor */}
      <LinearGradient
        colors={[
          '#06070B',
          '#090B12',
          '#06070B',
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Primary Candlelight Organic Halo (Top-Left Sacrarium Glow) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: candleOpacity,
            transform: [{ scale: candleScale }],
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'rgba(245, 158, 11, 0.20)',
            'rgba(217, 119, 6, 0.08)',
            'rgba(120, 53, 15, 0.02)',
            'transparent',
          ]}
          start={{ x: 0.15, y: 0.0 }}
          end={{ x: 0.9, y: 0.7 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Secondary Sacred Bronze Caustics (Bottom-Right Ember Flow) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: secondaryOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(217, 119, 6, 0.07)',
            'rgba(245, 158, 11, 0.04)',
            'transparent',
          ]}
          start={{ x: 0.05, y: 0.55 }}
          end={{ x: 1.0, y: 1.0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06070B',
  },
});
