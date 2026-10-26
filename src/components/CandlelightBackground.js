import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandlelightPalette } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function CandlelightBackground({ children }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          CandlelightPalette.obsidian,
          '#0B0D14',
          CandlelightPalette.obsidian,
        ]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Ambient warm amber glow top-left */}
      <LinearGradient
        colors={['rgba(245, 158, 11, 0.12)', 'rgba(217, 119, 6, 0.03)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.6 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.9 }]}
        pointerEvents="none"
      />

      {/* Ambient subtle sacred bronze glow bottom-right */}
      <LinearGradient
        colors={['transparent', 'rgba(217, 119, 6, 0.08)', 'transparent']}
        start={{ x: 0.2, y: 0.5 }}
        end={{ x: 1, y: 1 }}
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
