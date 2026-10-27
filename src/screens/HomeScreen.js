import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { CandlelightPalette, Typography } from '../theme/colors';
import { formatConfessionDate, calculateDaysSince } from '../services/storage';

export default function HomeScreen({
  store,
  onNavigateToExam,
  onNavigateToConfessional,
}) {
  const insets = useSafeAreaInsets();
  const [isPrayerExpanded, setIsPrayerExpanded] = useState(false);
  const [isStepsModalVisible, setIsStepsModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [manualDaysInput, setManualDaysInput] = useState('');

  const lastDate = store.lastConfessionDate;
  const daysSince = calculateDaysSince(lastDate);
  const prayer = store.catalog.prayers?.find((p) => p.id === 'espirito-santo');
  const confessionSteps = store.catalog.confessionGuide || [];
  const totalSelected = store.totalSelectedCount;

  const handleOpenDatePicker = () => {
    Haptics.selectionAsync();
    setManualDaysInput(daysSince !== null ? String(daysSince) : '0');
    setIsDatePickerVisible(true);
  };

  const handleSaveDate = (daysAgo) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const parsedDays = parseInt(daysAgo, 10);
    if (!isNaN(parsedDays) && parsedDays >= 0) {
      const targetDate = new Date(Date.now() - parsedDays * 86400000);
      store.setLastConfessionDate(targetDate);
    }
    setIsDatePickerVisible(false);
  };

  const handleClearDate = () => {
    Haptics.selectionAsync();
    store.setLastConfessionDate(null);
    setIsDatePickerVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 32,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com Tipografia Solene de Missal */}
      <View style={styles.header}>
        <View style={styles.crossIconContainer}>
          <Text style={styles.crossSymbol}>†</Text>
        </View>
        <Text style={styles.title}>EXAME DE CONSCIÊNCIA</Text>
        <Text style={styles.latinMotto}>«Cor contritum et humiliatum, Deus, non despicies»</Text>
        <Text style={styles.subtitle}>
          Recolha-se na presença de Deus e examine o coração com sinceridade para o Sacramento da Penitência.
        </Text>
      </View>

      {/* Card da Última Confissão */}
      <LiquidGlassCard isHighlighted={true} style={styles.sectionSpacing}>
        <View style={styles.confessionCardRow}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="calendar-clear-outline"
              size={22}
              color={CandlelightPalette.warmAmber}
            />
          </View>
          <View style={styles.confessionCardText}>
            <Text style={styles.confessionCardLabel}>ÚLTIMA CONFISSÃO</Text>
            <Text style={styles.confessionDateText}>
              {formatConfessionDate(lastDate)}
            </Text>
            {lastDate ? (
              <Text style={styles.confessionDaysText}>
                {daysSince === 0
                  ? 'Realizada hoje'
                  : daysSince === 1
                  ? 'Há 1 dia'
                  : `Há ${daysSince} dias`}
              </Text>
            ) : (
              <Text style={styles.confessionHintText}>
                Toque em ajustar para informar a data aproximada
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleOpenDatePicker}
            style={styles.adjustButton}
            activeOpacity={0.7}
          >
            <Text style={styles.adjustButtonText}>Ajustar</Text>
          </TouchableOpacity>
        </View>
      </LiquidGlassCard>

      {/* Os 5 Passos para uma Boa Confissão (Guia Catequético) */}
      <TouchableOpacity
        onPress={() => {
          Haptics.selectionAsync();
          setIsStepsModalVisible(true);
        }}
        activeOpacity={0.8}
        style={styles.sectionSpacing}
      >
        <LiquidGlassCard isHighlighted={false}>
          <View style={styles.guideCardRow}>
            <View style={styles.guideBadge}>
              <Text style={styles.guideBadgeText}>V</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>Os 5 Passos da Boa Confissão</Text>
              <Text style={styles.guideSubtitle}>
                Exame, Contrição, Firme Propósito, Confissão e Penitência
              </Text>
            </View>
            <Ionicons
              name="book-outline"
              size={20}
              color={CandlelightPalette.warmAmber}
            />
          </View>
        </LiquidGlassCard>
      </TouchableOpacity>

      {/* Oração ao Espírito Santo antes do Exame */}
      {prayer && (
        <LiquidGlassCard isHighlighted={false} style={styles.sectionSpacing}>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setIsPrayerExpanded(!isPrayerExpanded);
            }}
            style={styles.prayerHeaderRow}
            activeOpacity={0.8}
          >
            <Ionicons
              name="flame"
              size={20}
              color={CandlelightPalette.warmAmber}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.prayerTitle}>{prayer.title}</Text>
              <Text style={styles.prayerSubtitle}>{prayer.subtitle}</Text>
            </View>
            <Ionicons
              name={isPrayerExpanded ? 'chevron-up-circle' : 'chevron-down-circle'}
              size={22}
              color={CandlelightPalette.warmAmber}
            />
          </TouchableOpacity>

          {isPrayerExpanded && (
            <View style={styles.prayerBodyContainer}>
              <View style={styles.divider} />
              <Text style={styles.prayerBodyText}>{prayer.body}</Text>
            </View>
          )}
        </LiquidGlassCard>
      )}

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNavigateToExam();
          }}
          activeOpacity={0.85}
          style={styles.primaryButtonOuter}
        >
          <LinearGradient
            colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            {/* Top liquid specular highlight */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.20)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.95, y: 0 }}
              style={styles.btnSpecularBar}
            />

            <Ionicons
              name="reader-outline"
              size={24}
              color={CandlelightPalette.obsidian}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryButtonText}>
                {totalSelected > 0
                  ? 'Continuar Exame de Consciência'
                  : 'Iniciar Exame de Consciência'}
              </Text>
              <Text style={styles.primaryButtonSubtext}>
                Mandamentos, Preceitos e Pecados Capitais
              </Text>
            </View>
            <Ionicons
              name="arrow-forward-circle"
              size={26}
              color={CandlelightPalette.obsidian}
            />
          </LinearGradient>
        </TouchableOpacity>

        {totalSelected > 0 && (
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              onNavigateToConfessional();
            }}
            activeOpacity={0.8}
            style={styles.sectionSpacing}
          >
            <LiquidGlassCard isHighlighted={true}>
              <View style={styles.confessionalShortcutRow}>
                <Ionicons
                  name="shield-checkmark"
                  size={24}
                  color={CandlelightPalette.warmAmber}
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.shortcutTitle}>
                    Abrir Modo Confessionário
                  </Text>
                  <Text style={styles.shortcutSubtext}>
                    {totalSelected}{' '}
                    {totalSelected === 1 ? 'item apontado' : 'itens apontados'}{' '}
                    para confessar
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={CandlelightPalette.warmAmber}
                />
              </View>
            </LiquidGlassCard>
          </TouchableOpacity>
        )}
      </View>

      {/* Rodapé de Privacidade */}
      <View style={styles.footer}>
        <Ionicons
          name="lock-closed"
          size={14}
          color={CandlelightPalette.warmAmber}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.footerText}>
          100% offline e sigiloso. Seus apontamentos são destruídos assim que
          você recebe a absolvição.
        </Text>
      </View>

      {/* Modal: Os 5 Passos da Boa Confissão */}
      <Modal
        visible={isStepsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsStepsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.stepsModalContainer, { marginTop: insets.top + 20, marginBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.stepsModalTitle}>5 PASSOS PARA UMA BOA CONFISSÃO</Text>
              <TouchableOpacity
                onPress={() => setIsStepsModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={24} color={CandlelightPalette.ivory} />
              </TouchableOpacity>
            </View>
            <Text style={styles.stepsModalSubtitle}>
              Segundo o ensinamento tradicional da Santa Igreja Católica:
            </Text>

            <ScrollView style={styles.stepsScroll} showsVerticalScrollIndicator={false}>
              {confessionSteps.map((step) => (
                <View key={step.number} style={styles.stepItemRow}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{step.number}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepItemTitle}>{step.title}</Text>
                    <Text style={styles.stepItemDesc}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setIsStepsModalVisible(false)}
              style={styles.stepsUnderstoodBtn}
            >
              <Text style={styles.stepsUnderstoodBtnText}>Compreendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para Ajustar Data da Última Confissão */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDatePickerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>ÚLTIMA CONFISSÃO</Text>
            <Text style={styles.modalSubtitle}>
              Há quantos dias (aproximadamente) foi a sua última confissão?
            </Text>

            <TextInput
              style={styles.daysInput}
              keyboardType="number-pad"
              value={manualDaysInput}
              onChangeText={setManualDaysInput}
              placeholder="Ex: 15"
              placeholderTextColor={CandlelightPalette.mutedText}
              autoFocus
            />

            <View style={styles.quickDaysRow}>
              {[0, 7, 15, 30, 60, 90].map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setManualDaysInput(String(d))}
                  style={[
                    styles.quickDayPill,
                    manualDaysInput === String(d) && styles.quickDayPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.quickDayText,
                      manualDaysInput === String(d) && styles.quickDayTextActive,
                    ]}
                  >
                    {d === 0 ? 'Hoje' : `${d}d`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                onPress={() => setIsDatePickerVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSaveDate(manualDaysInput)}
                style={styles.modalConfirmBtn}
              >
                <Text style={styles.modalConfirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            {lastDate && (
              <TouchableOpacity
                onPress={handleClearDate}
                style={styles.clearDateBtn}
              >
                <Text style={styles.clearDateText}>Limpar registro</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  crossIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  crossSymbol: {
    fontSize: 26,
    color: CandlelightPalette.warmAmber,
    fontFamily: Typography.serif,
    lineHeight: 28,
  },
  title: {
    fontFamily: Typography.title,
    fontSize: 22,
    color: CandlelightPalette.ivory,
    letterSpacing: 2.2,
    textAlign: 'center',
    marginBottom: 6,
  },
  latinMotto: {
    fontFamily: Typography.serif,
    fontStyle: 'italic',
    fontSize: 13,
    color: CandlelightPalette.warmAmber,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Typography.serif,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  sectionSpacing: {
    marginBottom: 16,
  },
  confessionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  confessionCardText: {
    flex: 1,
  },
  confessionCardLabel: {
    fontSize: 10,
    fontFamily: Typography.title,
    letterSpacing: 1.2,
    color: CandlelightPalette.warmAmber,
    marginBottom: 2,
  },
  confessionDateText: {
    fontSize: 17,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.ivory,
  },
  confessionDaysText: {
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  confessionHintText: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
    fontStyle: 'italic',
  },
  adjustButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
  },
  adjustButtonText: {
    fontSize: 12,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.parchment,
  },
  guideCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(217, 119, 6, 0.20)',
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  guideBadgeText: {
    fontFamily: Typography.title,
    fontSize: 13,
    color: CandlelightPalette.warmAmber,
  },
  guideTitle: {
    fontFamily: Typography.subheading,
    fontSize: 15,
    color: CandlelightPalette.ivory,
    letterSpacing: 0.5,
  },
  guideSubtitle: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  prayerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerTitle: {
    fontSize: 15,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.ivory,
    letterSpacing: 0.5,
  },
  prayerSubtitle: {
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: CandlelightPalette.borderDefault,
    marginVertical: 12,
  },
  prayerBodyContainer: {
    marginTop: 4,
  },
  prayerBodyText: {
    fontSize: 14,
    fontFamily: Typography.serif,
    color: CandlelightPalette.parchment,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButtonOuter: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.75,
    shadowRadius: 28,
    elevation: 12,
    borderWidth: 1.3,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderTopColor: '#FFFFFF',
    borderBottomColor: 'rgba(217, 119, 6, 0.70)',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    position: 'relative',
  },
  btnSpecularBar: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: Typography.title,
    letterSpacing: 0.8,
    color: CandlelightPalette.obsidian,
  },
  primaryButtonSubtext: {
    fontSize: 11,
    color: 'rgba(7, 8, 13, 0.80)',
    marginTop: 2,
  },
  confessionalShortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortcutTitle: {
    fontSize: 15,
    fontFamily: Typography.subheading,
    letterSpacing: 0.5,
    color: CandlelightPalette.ivory,
  },
  shortcutSubtext: {
    fontSize: 12,
    color: CandlelightPalette.warmAmber,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stepsModalContainer: {
    width: '100%',
    maxHeight: '82%',
    backgroundColor: '#0E1118',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    padding: 22,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepsModalTitle: {
    fontFamily: Typography.title,
    fontSize: 14,
    letterSpacing: 1.2,
    color: CandlelightPalette.warmAmber,
  },
  modalCloseBtn: {
    padding: 4,
  },
  stepsModalSubtitle: {
    fontSize: 12,
    fontFamily: Typography.serif,
    fontStyle: 'italic',
    color: CandlelightPalette.mutedText,
    marginTop: 4,
    marginBottom: 16,
  },
  stepsScroll: {
    marginBottom: 16,
  },
  stepItemRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: Typography.title,
    fontSize: 12,
    color: CandlelightPalette.warmAmber,
  },
  stepItemTitle: {
    fontFamily: Typography.subheading,
    fontSize: 14,
    color: CandlelightPalette.ivory,
    marginBottom: 3,
  },
  stepItemDesc: {
    fontSize: 12,
    fontFamily: Typography.serif,
    color: CandlelightPalette.parchment,
    lineHeight: 17,
    opacity: 0.85,
  },
  stepsUnderstoodBtn: {
    backgroundColor: CandlelightPalette.warmAmber,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  stepsUnderstoodBtnText: {
    fontFamily: Typography.title,
    fontSize: 13,
    letterSpacing: 0.8,
    color: CandlelightPalette.obsidian,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#0E1118',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Typography.title,
    fontSize: 16,
    letterSpacing: 1.5,
    color: CandlelightPalette.warmAmber,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  daysInput: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
    color: CandlelightPalette.ivory,
    fontSize: 22,
    fontFamily: Typography.subheading,
    textAlign: 'center',
    marginBottom: 16,
  },
  quickDaysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  quickDayPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
  },
  quickDayPillActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.20)',
    borderColor: CandlelightPalette.warmAmber,
  },
  quickDayText: {
    fontSize: 13,
    color: CandlelightPalette.parchment,
  },
  quickDayTextActive: {
    color: CandlelightPalette.warmAmber,
    fontFamily: Typography.subheading,
  },
  modalActionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: CandlelightPalette.parchment,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: CandlelightPalette.warmAmber,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.obsidian,
  },
  clearDateBtn: {
    marginTop: 14,
    paddingVertical: 4,
  },
  clearDateText: {
    fontSize: 12,
    color: CandlelightPalette.dangerText,
  },
});
