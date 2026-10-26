import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CandlelightPalette, Typography } from '../theme/colors';

export default function AmberPill({ text, icon, isSelected = false, style }) {
  if (isSelected) {
    return (
      <View style={[styles.selectedPillContainer, style]}>
        <LinearGradient
          colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedPillGradient}
        >
          {/* Top liquid specular highlight */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.70)', 'rgba(255, 255, 255, 0.15)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0 }}
            style={styles.pillSpecularBar}
          />
          <View style={styles.pillContent}>
            {icon && (
              <Ionicons
                name={icon}
                size={13}
                color={CandlelightPalette.obsidian}
                style={styles.icon}
              />
            )}
            <Text style={[styles.text, styles.selectedText]}>{text}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.unselectedPillContainer, style]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 25}
        tint="dark"
        style={styles.unselectedBlur}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.09)', 'rgba(255, 255, 255, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.unselectedGradient}
        >
          {/* Micro-specular top rim */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.40)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            style={styles.pillSpecularBar}
          />
          <View style={styles.pillContent}>
            {icon && (
              <Ionicons
                name={icon}
                size={13}
                color={CandlelightPalette.warmAmber}
                style={styles.icon}
              />
            )}
            <Text style={[styles.text, styles.unselectedText]}>{text}</Text>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedPillContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomColor: 'rgba(217, 119, 6, 0.4)',
  },
  selectedPillGradient: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    position: 'relative',
  },
  unselectedPillContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(12, 14, 20, 0.55)',
  },
  unselectedBlur: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  unselectedGradient: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    position: 'relative',
  },
  pillSpecularBar: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 1.2,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontFamily: Typography.subheading,
  },
  selectedText: {
    color: CandlelightPalette.obsidian,
  },
  unselectedText: {
    color: CandlelightPalette.parchment,
    opacity: 0.9,
  },
});
