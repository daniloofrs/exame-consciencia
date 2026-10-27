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
            colors={['rgba(255, 255, 255, 0.90)', 'rgba(255, 255, 255, 0.25)', 'transparent']}
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
        intensity={Platform.OS === 'ios' ? 45 : 30}
        tint="dark"
        style={styles.unselectedBlur}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.025)', 'rgba(245, 158, 11, 0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.unselectedGradient}
        >
          {/* Micro-specular top rim */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.50)', 'rgba(255, 255, 255, 0.10)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.85, y: 0 }}
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderTopColor: '#FFFFFF',
    borderBottomColor: 'rgba(217, 119, 6, 0.65)',
  },
  selectedPillGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    position: 'relative',
  },
  unselectedPillContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderTopColor: 'rgba(255, 255, 255, 0.38)',
    borderBottomColor: 'rgba(245, 158, 11, 0.16)',
    backgroundColor: 'rgba(12, 14, 20, 0.60)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  unselectedBlur: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  unselectedGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    position: 'relative',
  },
  pillSpecularBar: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 1.4,
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
    letterSpacing: 0.3,
  },
  selectedText: {
    color: CandlelightPalette.obsidian,
  },
  unselectedText: {
    color: CandlelightPalette.parchment,
    opacity: 0.95,
  },
});
