import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiquidGlassCard from '../components/LiquidGlassCard';
import AmberPill from '../components/AmberPill';
import { CandlelightPalette, Typography } from '../theme/colors';

// Enable LayoutAnimation on Android if needed
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QUICK_FREQUENCIES = ['1x', '2x', '3x', 'Várias vezes'];

export default function ExaminationScreen({
  store,
  onNavigateToConfessional,
  onBack,
}) {
  const insets = useSafeAreaInsets();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [editingNotes, setEditingNotes] = useState({});
  const categoryScrollRef = useRef(null);
  const mainScrollRef = useRef(null);

  const categories = store.catalog.categories || [];
  const currentCategory = categories[selectedCategoryIndex] || categories[0];
  const totalSelected = store.totalSelectedCount;

  const handleSelectCategory = (index) => {
    Haptics.selectionAsync();
    setSelectedCategoryIndex(index);
    // Smoothly scroll tab into view
    categoryScrollRef.current?.scrollTo({
      x: Math.max(0, index * 105 - 60),
      animated: true,
    });
    // Scroll to top of questions
    mainScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleToggleQuestion = (questionId) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    store.toggleQuestion(questionId);
  };

  const handleUpdateNote = (questionId, text) => {
    setEditingNotes((prev) => ({ ...prev, [questionId]: text }));
    store.updateNote(questionId, text);
  };

  const handleSetQuickFrequency = (questionId, freq) => {
    Haptics.selectionAsync();
    const current = store.note(questionId);
    const newNote = current ? `${freq} — ${current}` : freq;
    handleUpdateNote(questionId, newNote);
  };

  const handleAddCustomEntry = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    store.addCustomEntry(trimmed);
    setCustomText('');
  };

  const handleRemoveCustomEntry = (id) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    store.removeCustomEntry(id);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Navigation Bar with Dynamic Safe Area */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            onBack();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={CandlelightPalette.warmAmber} />
          <Text style={styles.backBtnText}>Início</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EXAME DE CONSCIÊNCIA</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            onNavigateToConfessional();
          }}
          style={styles.confessionalBadgeBtn}
        >
          <Ionicons
            name="shield-checkmark"
            size={18}
            color={totalSelected > 0 ? CandlelightPalette.warmAmber : CandlelightPalette.mutedText}
          />
          {totalSelected > 0 && (
            <View style={styles.badgeCountCircle}>
              <Text style={styles.badgeCountText}>{totalSelected}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Selector */}
      <View style={styles.categoryBarContainer}>
        <ScrollView
          ref={categoryScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((cat, idx) => {
            const isSelected = idx === selectedCategoryIndex;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleSelectCategory(idx)}
                activeOpacity={0.7}
              >
                <AmberPill
                  text={cat.title}
                  isSelected={isSelected}
                  style={styles.categoryPill}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scrollable Questions Content */}
      <ScrollView
        ref={mainScrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{currentCategory?.title}</Text>
          <Text style={styles.categorySubtitle}>{currentCategory?.subtitle}</Text>
        </View>

        {/* Questions List */}
        {currentCategory?.questions?.map((q) => {
          const isSelected = store.isQuestionSelected(q.id);
          const currentNote =
            editingNotes[q.id] !== undefined ? editingNotes[q.id] : store.note(q.id);

          return (
            <LiquidGlassCard
              key={q.id}
              isHighlighted={isSelected}
              style={styles.questionCard}
            >
              <TouchableOpacity
                onPress={() => handleToggleQuestion(q.id)}
                activeOpacity={0.8}
                style={styles.questionTouchable}
              >
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={CandlelightPalette.obsidian}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.questionText,
                    isSelected && styles.questionTextSelected,
                  ]}
                >
                  {q.text}
                </Text>
              </TouchableOpacity>

              {/* Expandable Contextual Note Field with Quick Frequency Pills */}
              {isSelected && (
                <View style={styles.noteFieldContainer}>
                  <View style={styles.noteInputRow}>
                    <View style={styles.noteIndicatorBar} />
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Frequência aproximada ou nota (opcional)..."
                      placeholderTextColor={CandlelightPalette.mutedText}
                      value={currentNote}
                      onChangeText={(text) => handleUpdateNote(q.id, text)}
                    />
                  </View>

                  {/* Atalhos Rápidos de Frequência */}
                  <View style={styles.quickFreqRow}>
                    <Text style={styles.quickFreqLabel}>Frequência:</Text>
                    {QUICK_FREQUENCIES.map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        onPress={() => handleSetQuickFrequency(q.id, freq)}
                        style={styles.quickFreqPill}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.quickFreqPillText}>{freq}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </LiquidGlassCard>
          );
        })}

        {/* Next / Previous Category Navigation */}
        <View style={styles.stepNavRow}>
          {selectedCategoryIndex > 0 && (
            <TouchableOpacity
              onPress={() => handleSelectCategory(selectedCategoryIndex - 1)}
              style={styles.stepNavBtnSecondary}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={CandlelightPalette.parchment}
              />
              <Text style={styles.stepNavTextSecondary}>Anterior</Text>
            </TouchableOpacity>
          )}

          {selectedCategoryIndex < categories.length - 1 && (
            <TouchableOpacity
              onPress={() => handleSelectCategory(selectedCategoryIndex + 1)}
              style={styles.stepNavBtnPrimary}
              activeOpacity={0.7}
            >
              <Text style={styles.stepNavTextPrimary} numberOfLines={1}>
                {categories[selectedCategoryIndex + 1]?.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={CandlelightPalette.warmAmber}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Faltas ou Anotações Avulsas */}
        <LiquidGlassCard isHighlighted={store.customEntries.length > 0} style={styles.customSectionCard}>
          <View style={styles.customHeaderRow}>
            <Ionicons
              name="create-outline"
              size={20}
              color={CandlelightPalette.warmAmber}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.customHeaderTitle}>Outro Pecado ou Falta</Text>
              <Text style={styles.customHeaderSubtitle}>
                Acrescente faltas específicas não listadas nas perguntas acima
              </Text>
            </View>
          </View>

          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customInput}
              placeholder="Descreva o pecado ou falta com sobriedade..."
              placeholderTextColor={CandlelightPalette.mutedText}
              value={customText}
              onChangeText={setCustomText}
              onSubmitEditing={handleAddCustomEntry}
            />
            <TouchableOpacity
              onPress={handleAddCustomEntry}
              style={styles.customAddBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color={CandlelightPalette.obsidian} />
            </TouchableOpacity>
          </View>

          {store.customEntries.length > 0 && (
            <View style={styles.customEntriesList}>
              {store.customEntries.map((item) => (
                <View key={item.id} style={styles.customEntryItem}>
                  <Text style={styles.customEntryBullet}>•</Text>
                  <Text style={styles.customEntryText}>{item.text}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCustomEntry(item.id)}
                    style={styles.customRemoveBtn}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={CandlelightPalette.dangerText}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </LiquidGlassCard>
      </ScrollView>

      {/* Floating Bottom Bar: Ir ao Confessionário */}
      {totalSelected > 0 && (
        <View style={[styles.floatingBar, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 20 }]}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onNavigateToConfessional();
            }}
            activeOpacity={0.9}
            style={styles.floatingButtonOuter}
          >
            <LinearGradient
              colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.floatingButton}
            >
              {/* Top specular highlight */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.20)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.95, y: 0 }}
                style={styles.btnSpecularBar}
              />

              <Ionicons
                name="shield-checkmark"
                size={22}
                color={CandlelightPalette.obsidian}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.floatingButtonText}>
                No Confessionário ({totalSelected} {totalSelected === 1 ? 'item' : 'itens'})
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={CandlelightPalette.obsidian}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
  confessionalBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  badgeCountCircle: {
    backgroundColor: CandlelightPalette.warmAmber,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  badgeCountText: {
    fontSize: 11,
    fontFamily: Typography.title,
    color: CandlelightPalette.obsidian,
  },
  categoryBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: CandlelightPalette.borderDefault,
    paddingBottom: 10,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    marginRight: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  categoryHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryTitle: {
    fontFamily: Typography.title,
    fontSize: 20,
    color: CandlelightPalette.warmAmber,
    letterSpacing: 1,
    marginBottom: 4,
  },
  categorySubtitle: {
    fontFamily: Typography.serif,
    fontSize: 14,
    color: CandlelightPalette.parchment,
    opacity: 0.85,
    fontStyle: 'italic',
  },
  questionCard: {
    marginBottom: 12,
  },
  questionTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: CandlelightPalette.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  checkboxSelected: {
    backgroundColor: CandlelightPalette.warmAmber,
    borderColor: CandlelightPalette.warmAmber,
  },
  questionText: {
    flex: 1,
    fontFamily: Typography.serif,
    fontSize: 15,
    color: CandlelightPalette.ivory,
    lineHeight: 22,
  },
  questionTextSelected: {
    color: CandlelightPalette.parchment,
  },
  noteFieldContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.15)',
  },
  noteInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteIndicatorBar: {
    width: 3,
    height: 28,
    borderRadius: 2,
    backgroundColor: CandlelightPalette.warmAmber,
    marginRight: 10,
  },
  noteInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: Typography.serif,
    color: CandlelightPalette.parchment,
    paddingVertical: 4,
  },
  quickFreqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 13,
    gap: 6,
  },
  quickFreqLabel: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    marginRight: 2,
  },
  quickFreqPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
  },
  quickFreqPillText: {
    fontSize: 11,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.parchment,
  },
  stepNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  stepNavBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
  },
  stepNavTextSecondary: {
    fontSize: 13,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.parchment,
    marginLeft: 4,
  },
  stepNavBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
    borderWidth: 1,
    borderColor: CandlelightPalette.bronzeBorder,
  },
  stepNavTextPrimary: {
    fontSize: 13,
    fontFamily: Typography.subheading,
    color: CandlelightPalette.warmAmber,
    marginRight: 4,
  },
  customSectionCard: {
    marginTop: 8,
    marginBottom: 24,
  },
  customHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customHeaderTitle: {
    fontFamily: Typography.subheading,
    fontSize: 15,
    color: CandlelightPalette.ivory,
  },
  customHeaderSubtitle: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CandlelightPalette.borderDefault,
    paddingHorizontal: 14,
    fontSize: 13,
    fontFamily: Typography.serif,
    color: CandlelightPalette.ivory,
  },
  customAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: CandlelightPalette.warmAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customEntriesList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: CandlelightPalette.borderDefault,
    paddingTop: 8,
  },
  customEntryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  customEntryBullet: {
    color: CandlelightPalette.warmAmber,
    fontSize: 16,
    marginRight: 8,
  },
  customEntryText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Typography.serif,
    color: CandlelightPalette.parchment,
    lineHeight: 18,
  },
  customRemoveBtn: {
    padding: 6,
  },
  floatingBar: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  floatingButtonOuter: {
    width: '100%',
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
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  btnSpecularBar: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1.5,
  },
  floatingButtonText: {
    fontFamily: Typography.title,
    fontSize: 15,
    letterSpacing: 0.8,
    color: CandlelightPalette.obsidian,
  },
});
