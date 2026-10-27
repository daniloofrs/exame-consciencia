import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandlelightPalette } from '../theme/colors';

/**
 * BreviarioBackground: Fundo preto puro OLED (#000000) com halo contemplativo
 * extremamente sutil e suave, proporcionando máxima legibilidade e zero distração
 * em ambientes de oração e penumbra sacramental.
 */
export default function CandlelightBackground({ children }) {
  const breatheAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsação sutilíssima de contemplação (sem estresse visual)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [breatheAnim]);

  const haloOpacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.60],
  });

  return (
    <View style={styles.container}>
      {/* Fundo Preto OLED Absoluto */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />

      {/* Sutilíssimo halo de presença sacra no topo */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: haloOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'rgba(245, 245, 244, 0.035)',
            'rgba(212, 175, 55, 0.015)',
            'transparent',
          ]}
          start={{ x: 0.5, y: 0.0 }}
          end={{ x: 0.5, y: 0.45 }}
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
    backgroundColor: '#000000',
  },
});
