import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CandlelightPalette, Typography } from '../theme/colors';

/**
 * AppleSegmentPill: Pílula de categoria com estética de controle segmentado da Apple (WWDC).
 * Translucidez refinada no estado inativo e contraste sólido puro com micro-sombra no ativo.
 */
export default function AmberPill({ text, icon, isSelected = false, style }) {
  if (isSelected) {
    return (
      <View style={[styles.selectedPillContainer, style]}>
        <View style={styles.pillContent}>
          {icon && (
            <Ionicons
              name={icon}
              size={13}
              color="#000000"
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles.selectedText]}>{text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.unselectedPillContainer, style]}>
      <View style={styles.pillContent}>
        {icon && (
          <Ionicons
            name={icon}
            size={13}
            color={CandlelightPalette.mutedText}
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, styles.unselectedText]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedPillContainer: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  unselectedPillContainer: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12.5,
    fontFamily: Typography.subheading,
    letterSpacing: 0.4,
  },
  selectedText: {
    color: '#000000',
    fontWeight: '700',
  },
  unselectedText: {
    color: CandlelightPalette.mutedText,
  },
});
