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
import LiquidGlassCard from '../components/LiquidGlassCard';
import AmberPill from '../components/AmberPill';
import { CandlelightPalette } from '../theme/colors';
import { formatConfessionDate, calculateDaysSince } from '../services/storage';

export default function HomeScreen({
  store,
  onNavigateToExam,
  onNavigateToConfessional,
}) {
  const [isPrayerExpanded, setIsPrayerExpanded] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [manualDaysInput, setManualDaysInput] = useState('');

  const lastDate = store.lastConfessionDate;
  const daysSince = calculateDaysSince(lastDate);
  const prayer = store.catalog.prayers?.find((p) => p.id === 'espirito-santo');
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
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Badge & Title */}
      <View style={styles.header}>
        <AmberPill
          text="Sacramento da Penitência"
          icon="flame"
          isSelected={false}
          style={styles.badge}
        />
        <Text style={styles.title}>Exame de Consciência</Text>
        <Text style={styles.subtitle}>
          Recolha-se na presença de Deus e examine o coração com sinceridade.
        </Text>
      </View>

      {/* Card da Última Confissão (Opção B) */}
      <LiquidGlassCard isHighlighted={true} style={styles.sectionSpacing}>
        <View style={styles.confessionCardRow}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="calendar-outline"
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

      {/* Oração ao Espírito Santo */}
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
              name="sparkles"
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
              size={24}
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
        >
          <LinearGradient
            colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Ionicons
              name="checkbox-outline"
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
                Os Dez Mandamentos, Preceitos e Pecados Capitais
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
                    {totalSelected === 1 ? 'item anotado' : 'itens anotados'}{' '}
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
          100% offline e privado. Seus apontamentos são destruídos assim que
          você recebe a absolvição.
        </Text>
      </View>

      {/* Modal para Ajustar Data */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDatePickerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Última Confissão</Text>
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
                <Text style={styles.clearDateText}>Limpar registro de data</Text>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 36,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: CandlelightPalette.mutedText,
    marginTop: 6,
    lineHeight: 20,
  },
  sectionSpacing: {
    marginTop: 14,
  },
  confessionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  confessionCardText: {
    flex: 1,
  },
  confessionCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: CandlelightPalette.warmAmber,
    letterSpacing: 0.8,
  },
  confessionDateText: {
    fontSize: 15,
    fontWeight: '600',
    color: CandlelightPalette.ivory,
    marginTop: 2,
  },
  confessionDaysText: {
    fontSize: 12,
    color: 'rgba(254, 243, 199, 0.85)',
    marginTop: 1,
  },
  confessionHintText: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  adjustButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  adjustButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: CandlelightPalette.parchment,
  },
  prayerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CandlelightPalette.ivory,
  },
  prayerSubtitle: {
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  prayerBodyContainer: {
    marginTop: 4,
  },
  prayerBodyText: {
    fontSize: 14,
    color: CandlelightPalette.parchment,
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    shadowColor: CandlelightPalette.warmAmber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CandlelightPalette.obsidian,
  },
  primaryButtonSubtext: {
    fontSize: 11,
    color: 'rgba(7, 8, 13, 0.85)',
    marginTop: 2,
  },
  confessionalShortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: CandlelightPalette.ivory,
  },
  shortcutSubtext: {
    fontSize: 12,
    color: CandlelightPalette.parchment,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    flex: 1,
    lineHeight: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#12141D',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 22,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: CandlelightPalette.mutedText,
    textAlign: 'center',
    marginBottom: 16,
  },
  daysInput: {
    width: 140,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
    marginBottom: 16,
  },
  quickDaysRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  quickDayPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickDayPillActive: {
    backgroundColor: CandlelightPalette.warmAmber,
    borderColor: CandlelightPalette.warmAmber,
  },
  quickDayText: {
    fontSize: 12,
    color: CandlelightPalette.parchment,
    fontWeight: '600',
  },
  quickDayTextActive: {
    color: CandlelightPalette.obsidian,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  modalCancelText: {
    color: CandlelightPalette.parchment,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: CandlelightPalette.warmAmber,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: CandlelightPalette.obsidian,
    fontWeight: 'bold',
  },
  clearDateBtn: {
    marginTop: 14,
  },
  clearDateText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
