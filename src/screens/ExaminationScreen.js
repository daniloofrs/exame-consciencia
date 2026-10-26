import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import LiquidGlassCard from '../components/LiquidGlassCard';
import AmberPill from '../components/AmberPill';
import { CandlelightPalette } from '../theme/colors';

export default function ExaminationScreen({
  store,
  onNavigateToConfessional,
  onBack,
}) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [editingNotes, setEditingNotes] = useState({});
  const categoryScrollRef = useRef(null);

  const categories = store.catalog.categories || [];
  const currentCategory = categories[selectedCategoryIndex] || categories[0];
  const totalSelected = store.totalSelectedCount;

  const handleSelectCategory = (index) => {
    Haptics.selectionAsync();
    setSelectedCategoryIndex(index);
  };

  const handleToggleQuestion = (questionId) => {
    Haptics.selectionAsync();
    store.toggleQuestion(questionId);
  };

  const handleUpdateNote = (questionId, text) => {
    setEditingNotes((prev) => ({ ...prev, [questionId]: text }));
    store.updateNote(questionId, text);
  };

  const handleAddCustomEntry = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    store.addCustomEntry(trimmed);
    setCustomText('');
  };

  const handleRemoveCustomEntry = (id) => {
    Haptics.selectionAsync();
    store.removeCustomEntry(id);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
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
        <Text style={styles.topBarTitle}>Exame de Consciência</Text>
        <View style={{ width: 60 }} />
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

      {/* Main Content Area */}
      <ScrollView
        style={styles.questionsScrollView}
        contentContainerStyle={styles.questionsContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Header */}
        {currentCategory && (
          <View style={styles.categoryHeader}>
            <Text style={styles.stepCounterText}>
              ETAPA {selectedCategoryIndex + 1} DE {categories.length}
            </Text>
            <Text style={styles.categoryTitle}>{currentCategory.title}</Text>
            <Text style={styles.categorySubtitle}>{currentCategory.subtitle}</Text>
          </View>
        )}

        {/* Questions List */}
        {currentCategory?.questions?.map((q) => {
          const isSelected = store.isQuestionSelected(q.id);
          const currentNote = editingNotes[q.id] !== undefined ? editingNotes[q.id] : store.note(q.id);

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

              {/* Expandable contextual note field */}
              {isSelected && (
                <View style={styles.noteFieldContainer}>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="Adicionar nota (frequência ou circunstância)..."
                    placeholderTextColor={CandlelightPalette.mutedText}
                    value={currentNote}
                    onChangeText={(text) => handleUpdateNote(q.id, text)}
                  />
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
                Próximo: {categories[selectedCategoryIndex + 1]?.title}
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
            <Text style={styles.customSectionTitle}>
              Faltas ou Anotações Avulsas
            </Text>
          </View>
          <Text style={styles.customSectionSubtitle}>
            Adicione qualquer falta específica ou circunstância que não esteja
            nas perguntas acima:
          </Text>

          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customTextInput}
              placeholder="Ex: Impaciência com colega de trabalho..."
              placeholderTextColor={CandlelightPalette.mutedText}
              value={customText}
              onChangeText={setCustomText}
              onSubmitEditing={handleAddCustomEntry}
            />
            <TouchableOpacity
              onPress={handleAddCustomEntry}
              style={[
                styles.addCustomBtn,
                !customText.trim() && { opacity: 0.4 },
              ]}
              disabled={!customText.trim()}
            >
              <Ionicons
                name="add-circle"
                size={34}
                color={CandlelightPalette.warmAmber}
              />
            </TouchableOpacity>
          </View>

          {store.customEntries.length > 0 && (
            <View style={styles.customListContainer}>
              <View style={styles.divider} />
              {store.customEntries.map((item) => (
                <View key={item.id} style={styles.customItemRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.customItemText}>{item.text}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCustomEntry(item.id)}
                    style={styles.removeCustomBtn}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={CandlelightPalette.mutedText}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </LiquidGlassCard>
      </ScrollView>

      {/* Floating Bottom Summary Bar */}
      <View style={styles.bottomBarContainer}>
        <LiquidGlassCard isHighlighted={totalSelected > 0} contentStyle={styles.bottomBarCardContent}>
          <View style={styles.bottomBarInfo}>
            <Text style={styles.bottomBarLabel}>Lista para Confissão</Text>
            <Text style={styles.bottomBarCounter}>
              {totalSelected}{' '}
              {totalSelected === 1 ? 'item marcado' : 'itens marcados'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onNavigateToConfessional();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[CandlelightPalette.warmAmber, CandlelightPalette.sacredBronze]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bottomBarButton}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={CandlelightPalette.obsidian}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.bottomBarButtonText}>Ir ao Confessionário</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LiquidGlassCard>
      </View>
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
  categoryBarContainer: {
    backgroundColor: 'rgba(11, 13, 20, 0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryPill: {
    marginRight: 8,
  },
  questionsScrollView: {
    flex: 1,
  },
  questionsContentContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 120,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  stepCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: CandlelightPalette.warmAmber,
    letterSpacing: 0.8,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
    marginTop: 2,
  },
  categorySubtitle: {
    fontSize: 13,
    color: CandlelightPalette.mutedText,
    marginTop: 2,
  },
  questionCard: {
    marginBottom: 12,
  },
  questionTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: CandlelightPalette.warmAmber,
    borderColor: CandlelightPalette.warmAmber,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(248, 250, 252, 0.85)',
    lineHeight: 20,
  },
  questionTextSelected: {
    color: CandlelightPalette.ivory,
    fontWeight: '500',
  },
  noteFieldContainer: {
    marginTop: 10,
    paddingLeft: 36,
  },
  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: CandlelightPalette.parchment,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stepNavRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  stepNavBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  stepNavTextSecondary: {
    fontSize: 13,
    color: CandlelightPalette.parchment,
    fontWeight: '600',
  },
  stepNavBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    gap: 6,
  },
  stepNavTextPrimary: {
    fontSize: 13,
    color: CandlelightPalette.warmAmber,
    fontWeight: '600',
  },
  customSectionCard: {
    marginTop: 4,
  },
  customHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
  },
  customSectionSubtitle: {
    fontSize: 12,
    color: CandlelightPalette.mutedText,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 16,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTextInput: {
    flex: 1,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    color: CandlelightPalette.ivory,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  addCustomBtn: {
    padding: 2,
  },
  customListContainer: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 10,
  },
  customItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CandlelightPalette.warmAmber,
    marginRight: 10,
  },
  customItemText: {
    flex: 1,
    fontSize: 13,
    color: CandlelightPalette.parchment,
    lineHeight: 18,
  },
  removeCustomBtn: {
    padding: 4,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 14,
    left: 16,
    right: 16,
  },
  bottomBarCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 11,
    color: CandlelightPalette.mutedText,
  },
  bottomBarCounter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CandlelightPalette.ivory,
  },
  bottomBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  bottomBarButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: CandlelightPalette.obsidian,
  },
});
