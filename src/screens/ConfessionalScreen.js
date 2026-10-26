import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import LiquidGlassCard from '../components/LiquidGlassCard';
import AmberPill from '../components/AmberPill';
import { CandlelightPalette } from '../theme/colors';
import { calculateDaysSince } from '../services/storage';

export default function ConfessionalScreen({
  store,
  onBack,
  onAbsolutionComplete,
}) {
  const [isActOfContritionVisible, setIsActOfContritionVisible] = useState(false);

  const daysSince = calculateDaysSince(store.lastConfessionDate);
  const actOfContrition = store.catalog.prayers?.find(
    (p) => p.id === 'ato-contricao'
  );

  const greetingSentence =
    daysSince !== null
      ? `“Abençoai-me, Padre, porque pequei. Minha última confissão foi ${
          daysSince === 0
            ? 'hoje mesmo'
            : daysSince === 1
            ? 'ontem (há 1 dia)'
            : `há cerca de ${daysSince} dias`
        }. Estes são os meus pecados:”`
      : '“Abençoai-me, Padre, porque pequei. Esta é a minha confissão e estes são os meus pecados:”';

  const handleToggleConfessed = (key) => {
    Haptics.selectionAsync();
    store.toggleConfessedItem(key);
  };

  const handlePromptAbsolution = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Concluir Confissão e Apagar Pecados?',
      'Todos os pecados e anotações serão permanentemente apagados do aparelho, mantendo apenas a data de hoje como sua última confissão.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Recebi a Absolvição',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            await store.completeAbsolution();
            onAbsolutionComplete();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            onBack();
          }}
          style={styles.backBtn}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={CandlelightPalette.warmAmber}
          />
          <Text style={styles.backBtnText}>Exame</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>No Confessionário</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Card */}
        <LiquidGlassCard isHighlighted={false} style={styles.greetingCard}>
          <View style={styles.greetingHeaderRow}>
            <Ionicons
              name="sparkles"
              size={18}
              color={CandlelightPalette.warmAmber}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.greetingLabel}>COMO INICIAR COM O PADRE</Text>
          </View>
          <Text style={styles.greetingText}>{greetingSentence}</Text>
        </LiquidGlassCard>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Pecados a Declarar</Text>
          <Text style={styles.sectionHeaderHint}>
            Toque no item após confessá-lo
          </Text>
        </View>

        {/* Empty State */}
        {store.markedQuestions.length === 0 && store.customEntries.length === 0 && (
          <LiquidGlassCard style={styles.emptyCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={44}
              color={CandlelightPalette.warmAmber}
            />
            <Text style={styles.emptyTitle}>Nenhum item marcado ainda</Text>
            <Text style={styles.emptySubtitle}>
              Volte ao Exame de Consciência para marcar as perguntas ou adicionar
              anotações.
            </Text>
          </LiquidGlassCard>
        )}

        {/* Marked Catalog Questions */}
        {store.markedQuestions.map((q) => {
          const isConfessed = store.isItemConfessed(q.id);
          const note = store.note(q.id);

          return (
            <TouchableOpacity
              key={q.id}
              onPress={() => handleToggleConfessed(q.id)}
              activeOpacity={0.7}
              style={styles.sinItemTouchable}
            >
              <LiquidGlassCard isHighlighted={!isConfessed}>
                <View style={styles.sinItemRow}>
                  <Ionicons
                    name={isConfessed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={
                      isConfessed
                        ? CandlelightPalette.mutedText
                        : CandlelightPalette.warmAmber
                    }
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.sinItemCategory,
                        isConfessed && styles.sinItemDimmed,
                      ]}
                    >
                      {q.commandmentLabel.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.sinItemText,
                        isConfessed && styles.sinItemStrikethrough,
                      ]}
                    >
                      {q.text}
                    </Text>

                    {note ? (
                      <View
                        style={[
                          styles.noteBadge,
                          isConfessed && { opacity: 0.4 },
                        ]}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={12}
                          color={CandlelightPalette.parchment}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.noteBadgeText}>{note}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Custom Sins */}
        {store.customEntries.map((entry) => {
          const isConfessed = store.isItemConfessed(entry.id);

          return (
            <TouchableOpacity
              key={entry.id}
              onPress={() => handleToggleConfessed(entry.id)}
              activeOpacity={0.7}
              style={styles.sinItemTouchable}
            >
              <LiquidGlassCard isHighlighted={!isConfessed}>
                <View style={styles.sinItemRow}>
                  <Ionicons
                    name={isConfessed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={
                      isConfessed
                        ? CandlelightPalette.mutedText
                        : CandlelightPalette.warmAmber
                    }
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.sinItemCategory,
                        isConfessed && styles.sinItemDimmed,
                      ]}
                    >
                      ANOTAÇÃO PESSOAL
                    </Text>
                    <Text
                      style={[
                        styles.sinItemText,
                        isConfessed && styles.sinItemStrikethrough,
                      ]}
                    >
                      {entry.text}
                    </Text>
                  </View>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Bottom Actions */}
        <View style={styles.bottomActionsArea}>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setIsActOfContritionVisible(true);
            }}
            activeOpacity={0.8}
            style={styles.actBtnTouchable}
          >
            <LiquidGlassCard isHighlighted={true}>
              <View style={styles.actOfContritionBtnRow}>
                <Ionicons
                  name="book"
                  size={20}
                  color={CandlelightPalette.warmAmber}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.actOfContritionBtnText}>
                  Ler Ato de Contrição
                </Text>
                <Ionicons
                  name="chevron-up"
                  size={18}
                  color={CandlelightPalette.warmAmber}
                />
              </View>
            </LiquidGlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePromptAbsolution}
            activeOpacity={0.85}
            style={styles.absolutionBtnTouchable}
          >
            <LinearGradient
              colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.absolutionBtnGradient}
            >
              <Ionicons
                name="sparkles"
                size={20}
                color={CandlelightPalette.obsidian}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.absolutionBtnText}>
                Recebi a Absolvição (Apagar Tudo)
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal: Ato de Contrição */}
      <Modal
        visible={isActOfContritionVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsActOfContritionVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.contritionModalContainer}>
            <View style={styles.modalGrabBar} />
            <AmberPill
              text="Oração do Penitente"
              icon="flame"
              isSelected={false}
              style={{ alignSelf: 'flex-start', marginBottom: 12 }}
            />
            <Text style={styles.contritionModalTitle}>Ato de Contrição</Text>
            <ScrollView style={{ maxHeight: 300, marginVertical: 14 }}>
              <Text style={styles.contritionBodyText}>
                {actOfContrition?.body}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setIsActOfContritionVisible(false)}
              style={styles.closeModalBtn}
            >
              <Text style={styles.closeModalBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 30,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    color: CandlelightPalette.warmAmber,
    fontSize: 15,
    fontWeight: '600',
  },
  topBarTitle: {
    color: CandlelightPalette.ivory,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 50,
  },
  greetingCard: {
    marginBottom: 20,
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  greetingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: CandlelightPalette.warmAmber,
    letterSpacing: 0.8,
  },
  greetingText: {
    fontSize: 14,
    color: CandlelightPalette.parchment,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
  },
  sectionHeaderHint: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  sinItemTouchable: {
    marginBottom: 10,
  },
  sinItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sinItemCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: CandlelightPalette.warmAmber,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  sinItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: CandlelightPalette.ivory,
    lineHeight: 20,
  },
  sinItemDimmed: {
    opacity: 0.45,
  },
  sinItemStrikethrough: {
    color: CandlelightPalette.mutedText,
    textDecorationLine: 'line-through',
  },
  noteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
  },
  noteBadgeText: {
    fontSize: 11,
    color: CandlelightPalette.parchment,
  },
  bottomActionsArea: {
    marginTop: 24,
    gap: 12,
  },
  actBtnTouchable: {
    width: '100%',
  },
  actOfContritionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actOfContritionBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: CandlelightPalette.parchment,
  },
  absolutionBtnTouchable: {
    marginTop: 6,
  },
  absolutionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  absolutionBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CandlelightPalette.obsidian,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  contritionModalContainer: {
    backgroundColor: '#12141D',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 24,
  },
  modalGrabBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  contritionModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
  },
  contritionBodyText: {
    fontSize: 15,
    color: CandlelightPalette.parchment,
    lineHeight: 24,
  },
  closeModalBtn: {
    backgroundColor: CandlelightPalette.warmAmber,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalBtnText: {
    color: CandlelightPalette.obsidian,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
