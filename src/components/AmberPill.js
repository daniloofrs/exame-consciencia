import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CandlelightPalette } from '../theme/colors';

export default function AmberPill({ text, icon, isSelected = false, style }) {
  if (isSelected) {
    return (
      <LinearGradient
        colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.pill, styles.selectedPill, style]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={13}
            color={CandlelightPalette.obsidian}
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, styles.selectedText]}>{text}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.pill, styles.unselectedPill, style]}>
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
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
  },
  selectedPill: {
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  unselectedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.28)',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedText: {
    color: CandlelightPalette.obsidian,
  },
  unselectedText: {
    color: CandlelightPalette.parchment,
  },
});
