import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandlelightPalette } from '../theme/colors';

export default function CandlelightBackground({ children }) {
  // Candle breathing animation
  const breatheAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
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
    loop.start();
    return () => loop.stop();
  }, [breatheAnim]);

  const candleScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.0, 1.07],
  });

  const candleOpacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 0.98],
  });

  return (
    <View style={styles.container}>
      {/* Base deep obsidian floor */}
      <LinearGradient
        colors={[
          CandlelightPalette.obsidian,
          '#0A0C13',
          CandlelightPalette.obsidian,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Organic Candlelight Glow (Top-Center/Left) */}
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
            'rgba(245, 158, 11, 0.16)',
            'rgba(217, 119, 6, 0.05)',
            'transparent',
          ]}
          start={{ x: 0.1, y: 0.0 }}
          end={{ x: 0.85, y: 0.65 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Sacred Bronze Counter-Reflection (Bottom-Right) */}
      <LinearGradient
        colors={['transparent', 'rgba(217, 119, 6, 0.06)', 'transparent']}
        start={{ x: 0.1, y: 0.6 }}
        end={{ x: 0.95, y: 1.0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CandlelightPalette.obsidian,
  },
});
