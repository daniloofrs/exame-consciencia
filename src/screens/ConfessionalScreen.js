import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { CandlelightPalette, Typography } from '../theme/colors';
import { formatNaturalDaysSince } from '../services/storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ConfessionalScreen({
  store,
  onBack,
  onAbsolutionComplete,
}) {
  const insets = useSafeAreaInsets();
  const [isActOfContritionVisible, setIsActOfContritionVisible] = useState(false);
  const [isConfirmAbsolutionVisible, setIsConfirmAbsolutionVisible] = useState(false);
  const [isAbsolutionCelebrated, setIsAbsolutionCelebrated] = useState(false);
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1.0); // 0.9, 1.0, 1.15

  // Dissolution & Golden Flash animation
  const flashAnim = useRef(new Animated.Value(0)).current;

  const naturalTimeStr = formatNaturalDaysSince(store.lastConfessionDate);
  const actOfContrition = store.catalog.prayers?.find(
    (p) => p.id === 'ato-contricao'
  );
  const thanksgivingPrayer = store.catalog.prayers?.find(
    (p) => p.id === 'acao-gracas'
  );
  const dialogue = store.catalog.confessionalDialogue || {};

  const greetingSentence = naturalTimeStr
    ? `“Abençoai-me, Padre, porque pequei. Minha última confissão foi ${naturalTimeStr}. Estes são os meus pecados:”`
    : '“Abençoai-me, Padre, porque pequei. Esta é a minha confissão e estes são os meus pecados:”';

  const handleToggleConfessed = (key) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    store.toggleConfessedItem(key);
  };

  const handleToggleTextSize = () => {
    Haptics.selectionAsync();
    if (textSizeMultiplier === 1.0) {
      setTextSizeMultiplier(1.18);
    } else if (textSizeMultiplier === 1.18) {
      setTextSizeMultiplier(0.92);
    } else {
      setTextSizeMultiplier(1.0);
    }
  };

  const handleOpenConfirmModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsConfirmAbsolutionVisible(true);
  };

  const handleConfirmAbsolution = async () => {
    setIsConfirmAbsolutionVisible(false);
    setIsAbsolutionCelebrated(true);

    // Solemn deep haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate reverent golden flash
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0.22,
        duration: 1300,
        useNativeDriver: true,
      }),
    ]).start();

    // Permanently wipe all sins and notes from storage, retaining only the timestamp
    await store.completeAbsolution();
  };

  const handleFinishAndReturn = () => {
    Haptics.selectionAsync();
    onAbsolutionComplete();
  };

  // If absolution is celebrated, show the Holy Peace & Thanksgiving Screen
  if (isAbsolutionCelebrated) {
    return (
      <View style={styles.peaceContainer}>
        {/* Soft Golden Light Overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: CandlelightPalette.warmAmber,
              opacity: flashAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.30],
              }),
            },
          ]}
          pointerEvents="none"
        />

        <ScrollView
          contentContainerStyle={[
            styles.peaceScrollContent,
            {
              paddingTop: insets.top + 28,
              paddingBottom: insets.bottom + 36,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.peaceCrossCircle}>
            <Ionicons name="sparkles" size={32} color={CandlelightPalette.warmAmber} />
          </View>

          <Text style={styles.peaceTitle}>ABSOLVIÇÃO CONCEDIDA</Text>
          <Text style={styles.peaceVerse}>
            «Vai em paz, e que o Senhor perdoe todos os teus pecados.»
          </Text>

          <View style={styles.peaceCardWrapper}>
            <LiquidGlassCard isHighlighted={true}>
              <View style={styles.thanksgivingHeader}>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={CandlelightPalette.warmAmber}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.thanksgivingTitle}>
                  {thanksgivingPrayer?.title || 'Ação de Graças pós-Confissão'}
                </Text>
              </View>
              <Text style={styles.thanksgivingBody}>
                {thanksgivingPrayer?.body ||
                  'Senhor Jesus Cristo, agradeço-Vos com toda a minha alma por terdes lavado os meus pecados com o Vosso preciosíssimo Sangue. Amém.'}
              </Text>
            </LiquidGlassCard>
          </View>

          <View style={styles.peacePrivacyNotice}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={CandlelightPalette.warmAmber}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.peacePrivacyText}>
              Todos os pecados e anotações foram permanentemente purificados e apagados do seu aparelho.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleFinishAndReturn}
            style={styles.peaceReturnBtn}
            activeOpacity={0.85}
          >
            <View style={styles.peaceReturnGradient}>
              <Text style={styles.peaceReturnBtnText}>Voltar à Paz de Cristo</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar with Safe Area */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
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
        <Text style={styles.topBarTitle}>NO CONFESSIONÁRIO</Text>
        <TouchableOpacity
          onPress={handleToggleTextSize}
          style={styles.textSizeBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.textSizeBtnText}>
            {textSizeMultiplier === 1.18 ? 'A+' : textSizeMultiplier === 0.92 ? 'A-' : 'A'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 52 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Saudação Litúrgica de Entrada com o Sacerdote */}
        <LiquidGlassCard isHighlighted={false} style={styles.greetingCard}>
          <View style={styles.greetingHeaderRow}>
            <Ionicons
              name="sparkles"
              size={16}
              color={CandlelightPalette.warmAmber}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.greetingLabel}>ROTEIRO DE ENTRADA</Text>
          </View>
          <Text
            style={[
              styles.greetingText,
              { fontSize: 14 * textSizeMultiplier, lineHeight: 21 * textSizeMultiplier },
            ]}
          >
            {greetingSentence}
          </Text>
        </LiquidGlassCard>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Pecados a Declarar</Text>
          <Text style={styles.sectionHeaderHint}>
            Toque no item após declará-lo
          </Text>
        </View>

        {/* Empty State */}
        {store.markedQuestions.length === 0 && store.customEntries.length === 0 && (
          <LiquidGlassCard isHighlighted={false} style={styles.emptyCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={44}
              color={CandlelightPalette.warmAmber}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>Nenhum pecado apontado</Text>
            <Text style={styles.emptySubtitle}>
              Retorne ao exame para percorrer os Mandamentos e marcar os pontos necessários antes de entrar no confessionário.
            </Text>
          </LiquidGlassCard>
        )}

        {/* Marked Questions (Toque para Véu & Dim) */}
        {store.markedQuestions.map((q) => {
          const isConfessed = store.isItemConfessed(q.id);
          const noteText = store.note(q.id);

          return (
            <TouchableOpacity
              key={q.id}
              onPress={() => handleToggleConfessed(q.id)}
              activeOpacity={0.8}
              style={styles.itemSpacing}
            >
              <LiquidGlassCard
                isHighlighted={false}
                style={[
                  styles.confessItemCard,
                  isConfessed && styles.confessItemCardDimmed,
                ]}
              >
                <View style={styles.confessItemRow}>
                  <View
                    style={[
                      styles.veilCircle,
                      isConfessed && styles.veilCircleDimmed,
                    ]}
                  >
                    {isConfessed ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#000000"
                      />
                    ) : (
                      <View style={styles.veilCircleDot} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.commandmentBadge,
                        isConfessed && styles.textDimmed,
                      ]}
                    >
                      {q.commandmentLabel}
                    </Text>
                    <Text
                      style={[
                        styles.confessItemText,
                        {
                          fontSize: 15 * textSizeMultiplier,
                          lineHeight: 22 * textSizeMultiplier,
                        },
                        isConfessed && styles.confessItemTextDimmed,
                      ]}
                    >
                      {q.text}
                    </Text>

                    {/* Nota de frequência ou circunstância */}
                    {noteText ? (
                      <View style={styles.confessNoteRow}>
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={12}
                          color={isConfessed ? CandlelightPalette.dimmedText : CandlelightPalette.warmAmber}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.confessNoteText,
                            { fontSize: 12 * textSizeMultiplier },
                            isConfessed && styles.textDimmed,
                          ]}
                        >
                          {noteText}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Custom Entries (Pecados Avulsos) */}
        {store.customEntries.map((item) => {
          const isConfessed = store.isItemConfessed(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleToggleConfessed(item.id)}
              activeOpacity={0.8}
              style={styles.itemSpacing}
            >
              <LiquidGlassCard
                isHighlighted={false}
                style={[
                  styles.confessItemCard,
                  isConfessed && styles.confessItemCardDimmed,
                ]}
              >
                <View style={styles.confessItemRow}>
                  <View
                    style={[
                      styles.veilCircle,
                      isConfessed && styles.veilCircleDimmed,
                    ]}
                  >
                    {isConfessed ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#000000"
                      />
                    ) : (
                      <View style={styles.veilCircleDot} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.commandmentBadge,
                        isConfessed && styles.textDimmed,
                      ]}
                    >
                      Falta Adicional
                    </Text>
                    <Text
                      style={[
                        styles.confessItemText,
                        {
                          fontSize: 15 * textSizeMultiplier,
                          lineHeight: 22 * textSizeMultiplier,
                        },
                        isConfessed && styles.confessItemTextDimmed,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Fórmula de Conclusão da Acusação */}
        {(store.markedQuestions.length > 0 || store.customEntries.length > 0) && (
          <LiquidGlassCard isHighlighted={false} style={styles.closingCard}>
            <View style={styles.greetingHeaderRow}>
              <Ionicons
                name="checkmark-done"
                size={16}
                color={CandlelightPalette.warmAmber}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.greetingLabel}>AO CONCLUIR A ACUSAÇÃO</Text>
            </View>
            <Text
              style={[
                styles.closingText,
                { fontSize: 13 * textSizeMultiplier, lineHeight: 20 * textSizeMultiplier },
              ]}
            >
              “{dialogue.closing || 'Destes pecados e de todos os que por fraqueza não me lembro, peço a Deus perdão e a vós, Padre, a penitência e a absolvição.'}”
            </Text>
          </LiquidGlassCard>
        )}

        {/* Ato de Contrição (Acessível durante a confissão) */}
        {actOfContrition && (
          <LiquidGlassCard isHighlighted={false} style={styles.contritionCard}>
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                setIsActOfContritionVisible(!isActOfContritionVisible);
              }}
              style={styles.contritionHeader}
              activeOpacity={0.8}
            >
              <Ionicons
                name="heart"
                size={18}
                color={CandlelightPalette.warmAmber}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.contritionTitle}>
                  {actOfContrition.title}
                </Text>
                <Text style={styles.contritionSubtitle}>
                  Para rezar quando o sacerdote solicitar
                </Text>
              </View>
              <Ionicons
                name={
                  isActOfContritionVisible
                    ? 'chevron-up-circle'
                    : 'chevron-down-circle'
                }
                size={22}
                color={CandlelightPalette.warmAmber}
              />
            </TouchableOpacity>

            {isActOfContritionVisible && (
              <View style={styles.contritionBodyContainer}>
                <View style={styles.divider} />
                <Text
                  style={[
                    styles.contritionBodyText,
                    { fontSize: 14 * textSizeMultiplier, lineHeight: 22 * textSizeMultiplier },
                  ]}
                >
                  {actOfContrition.body}
                </Text>
              </View>
            )}
          </LiquidGlassCard>
        )}

        {/* Botão Solene: Recebi a Absolvição */}
        <View style={styles.absolutionActionWrapper}>
          <TouchableOpacity
            onPress={handleOpenConfirmModal}
            activeOpacity={0.85}
            style={styles.absolutionButtonOuter}
          >
            <View style={styles.absolutionButton}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#000000"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.absolutionButtonText}>
                Recebi a Absolvição
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.absolutionNotice}>
            Ao receber a absolvição sacramental, todos os pecados anotados são permanentemente destruídos do aparelho.
          </Text>
        </View>
      </ScrollView>

      {/* Modal de Confirmação da Absolvição */}
      <Modal
        visible={isConfirmAbsolutionVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsConfirmAbsolutionVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModalContainer}>
            <View style={styles.modalIconCircle}>
              <Ionicons
                name="flame"
                size={28}
                color={CandlelightPalette.warmAmber}
              />
            </View>
            <Text style={styles.confirmModalTitle}>CONCLUIR CONFISSÃO</Text>
            <Text style={styles.confirmModalSubtitle}>
              O sacerdote concedeu a absolvição sacramental em nome do Pai, do Filho e do Espírito Santo?
            </Text>
            <Text style={styles.confirmModalDestructionNotice}>
              Seus pecados e anotações serão destruídos da memória, preservando apenas a data de hoje.
            </Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                onPress={() => setIsConfirmAbsolutionVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Ainda não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmAbsolution}
                style={styles.modalConfirmBtn}
              >
                <Text style={styles.modalConfirmText}>Sim, Fui Absolvido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    color: CandlelightPalette.warmAmber,
    fontSize: 16,
    fontFamily: Typography.subheading,
    marginLeft: 2,
  },
  topBarTitle: {
    fontFamily: Typography.title,
    fontSize: 13,
    color: CandlelightPalette.parchment,
    letterSpacing: 1.5,
  },
  textSizeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSizeBtnText: {
    fontSize: 12,
    fontFamily: Typography.subheading,
    color: '#F5F5F4',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  greetingCard: {
    marginBottom: 16,
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  greetingLabel: {
    fontSize: 10,
    fontFamily: Typography.title,
    letterSpacing: 1.2,
    color: '#A8A29E',
  },
  greetingText: {
    fontFamily: Typography.serif,
    fontSize: 14,
    color: '#E7E5E4',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontFamily: Typography.title,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  sectionHeaderHint: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    fontStyle: 'italic',
  },
  emptyCard: {
    paddingVertical: 32,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    fontFamily: Typography.subheading,
    fontSize: 16,
    color: CandlelightPalette.ivory,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.serif,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  itemSpacing: {
    marginBottom: 10,
  },
  confessItemCard: {
    borderRadius: 14,
  },
  confessItemCardDimmed: {
    opacity: 0.25,
  },
  confessItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  veilCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#141418',
  },
  veilCircleDimmed: {
    backgroundColor: '#F5F5F4',
    borderColor: '#FFFFFF',
  },
  veilCircleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#57534E',
  },
  commandmentBadge: {
    fontSize: 10,
    fontFamily: Typography.title,
    color: '#A8A29E',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  confessItemText: {
    fontFamily: Typography.serif,
    fontSize: 15,
    color: '#E7E5E4',
    lineHeight: 22,
  },
  confessItemTextDimmed: {
    textDecorationLine: 'line-through',
    color: '#57534E',
  },
  textDimmed: {
    color: '#57534E',
  },
  confessNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 4,
  },
  confessNoteText: {
    fontFamily: Typography.serif,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#A8A29E',
  },
  closingCard: {
    marginTop: 12,
    marginBottom: 16,
  },
  closingText: {
    fontFamily: Typography.serif,
    fontSize: 13,
    color: '#E7E5E4',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  contritionCard: {
    marginBottom: 24,
  },
  contritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contritionTitle: {
    fontFamily: Typography.subheading,
    fontSize: 15,
    color: CandlelightPalette.ivory,
    letterSpacing: 0.5,
  },
  contritionSubtitle: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#222226',
    marginVertical: 12,
  },
  contritionBodyContainer: {
    marginTop: 4,
  },
  contritionBodyText: {
    fontFamily: Typography.serif,
    fontSize: 14,
    color: '#E7E5E4',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  absolutionActionWrapper: {
    marginTop: 8,
    marginBottom: 32,
  },
  absolutionButtonOuter: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5F5F4',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  absolutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F5F5F4',
  },
  absolutionButtonText: {
    fontFamily: Typography.title,
    fontSize: 15.5,
    letterSpacing: 1,
    color: '#000000',
  },
  absolutionNotice: {
    fontSize: 11,
    fontFamily: Typography.serif,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmModalContainer: {
    width: '100%',
    backgroundColor: '#0C0C0E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#222226',
    padding: 24,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmModalTitle: {
    fontFamily: Typography.title,
    fontSize: 15,
    letterSpacing: 1.5,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  confirmModalSubtitle: {
    fontSize: 14,
    fontFamily: Typography.serif,
    color: '#E7E5E4',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  confirmModalDestructionNotice: {
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 17,
  },
  modalActionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#26262B',
    backgroundColor: '#141418',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: CandlelightPalette.mutedText,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontFamily: Typography.subheading,
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },
  peaceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  peaceScrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  peaceCrossCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  peaceTitle: {
    fontFamily: Typography.title,
    fontSize: 20,
    letterSpacing: 2,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  peaceVerse: {
    fontFamily: Typography.serif,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#E7E5E4',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  peaceCardWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  thanksgivingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thanksgivingTitle: {
    fontFamily: Typography.subheading,
    fontSize: 15,
    color: '#FFFFFF',
  },
  thanksgivingBody: {
    fontFamily: Typography.serif,
    fontSize: 14,
    color: '#E7E5E4',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  peacePrivacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  peacePrivacyText: {
    flex: 1,
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    lineHeight: 17,
  },
  peaceReturnBtn: {
    width: '100%',
  },
  peaceReturnGradient: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#F5F5F4',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  peaceReturnBtnText: {
    fontFamily: Typography.title,
    fontSize: 15,
    letterSpacing: 1,
    color: '#000000',
  },
});
