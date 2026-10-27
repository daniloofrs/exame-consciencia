import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CandlelightPalette, Typography } from '../theme/colors';

/**
 * BreviarioPill: Pílula de categoria com acabamento gráfico de alta precisão
 * e contraste solene (Preto no Marfim quando ativo; Ardósia no Pedra quando inativo).
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
    paddingVertical: 9,
    backgroundColor: '#F5F5F4',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  unselectedPillContainer: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#26262B',
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
    letterSpacing: 0.5,
  },
  selectedText: {
    color: '#000000',
    fontWeight: '700',
  },
  unselectedText: {
    color: CandlelightPalette.mutedText,
  },
});
