import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AppState,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import {
  useFonts,
  Cinzel_400Regular,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import CandlelightBackground from './src/components/CandlelightBackground';
import HomeScreen from './src/screens/HomeScreen';
import ExaminationScreen from './src/screens/ExaminationScreen';
import ConfessionalScreen from './src/screens/ConfessionalScreen';
import catalogData from './src/data/examination_catalog.json';
import {
  loadDraftSession,
  saveDraftSession,
  clearDraftSession,
  getLastConfessionDate,
  setLastConfessionDate as saveLastConfessionDate,
} from './src/services/storage';
import { CandlelightPalette, Typography } from './src/theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    Cinzel_700Bold,
  });

  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'exam' | 'confessional'
  const [selectedQuestionIDs, setSelectedQuestionIDs] = useState(new Set());
  const [questionNotes, setQuestionNotes] = useState({});
  const [customEntries, setCustomEntries] = useState([]);
  const [confessedItemIDs, setConfessedItemIDs] = useState(new Set());
  const [lastConfessionDate, setLastConfessionDateState] = useState(null);
  const [isAppActive, setIsAppActive] = useState(true);

  // AppState privacy shield (simple blur screen in multitasking / app switcher)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsAppActive(nextAppState === 'active');
    });
    return () => subscription.remove();
  }, []);

  // Initial load: restore last confession date and draft if valid (< 24h)
  useEffect(() => {
    async function init() {
      const savedDate = await getLastConfessionDate();
      setLastConfessionDateState(savedDate);

      const draft = await loadDraftSession();
      if (draft) {
        if (draft.selectedQuestionIDs) {
          setSelectedQuestionIDs(new Set(draft.selectedQuestionIDs));
        }
        if (draft.questionNotes) {
          setQuestionNotes(draft.questionNotes);
        }
        if (draft.customEntries) {
          setCustomEntries(draft.customEntries);
        }
        if (draft.confessedItemIDs) {
          setConfessedItemIDs(new Set(draft.confessedItemIDs));
        }
      }
    }
    init();
  }, []);

  // Auto-persist draft whenever relevant state changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (
      selectedQuestionIDs.size === 0 &&
      Object.keys(questionNotes).length === 0 &&
      customEntries.length === 0
    ) {
      clearDraftSession();
      return;
    }

    saveDraftSession({
      selectedQuestionIDs: Array.from(selectedQuestionIDs),
      questionNotes,
      customEntries,
      confessedItemIDs: Array.from(confessedItemIDs),
    });
  }, [selectedQuestionIDs, questionNotes, customEntries, confessedItemIDs]);

  // Store methods
  const toggleQuestion = (questionId) => {
    setSelectedQuestionIDs((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
        setQuestionNotes((notes) => {
          const updated = { ...notes };
          delete updated[questionId];
          return updated;
        });
        setConfessedItemIDs((conf) => {
          const updated = new Set(conf);
          updated.delete(questionId);
          return updated;
        });
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const updateNote = (questionId, text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setQuestionNotes((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    } else {
      setSelectedQuestionIDs((prev) => new Set(prev).add(questionId));
      setQuestionNotes((prev) => ({ ...prev, [questionId]: text }));
    }
  };

  const addCustomEntry = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newEntry = {
      id: Date.now().toString(),
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setCustomEntries((prev) => [...prev, newEntry]);
  };

  const removeCustomEntry = (id) => {
    setCustomEntries((prev) => prev.filter((item) => item.id !== id));
    setConfessedItemIDs((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleConfessedItem = (key) => {
    setConfessedItemIDs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const completeAbsolution = async () => {
    const now = new Date();
    setSelectedQuestionIDs(new Set());
    setQuestionNotes({});
    setCustomEntries([]);
    setConfessedItemIDs(new Set());
    setLastConfessionDateState(now);
    await clearDraftSession();
    await saveLastConfessionDate(now);
  };

  const setLastConfessionDate = async (date) => {
    setLastConfessionDateState(date);
    await saveLastConfessionDate(date);
  };

  // Flatten marked questions from catalog
  const markedQuestions = (catalogData.categories || [])
    .flatMap((c) => c.questions || [])
    .filter((q) => selectedQuestionIDs.has(q.id));

  const store = {
    catalog: catalogData,
    selectedQuestionIDs,
    questionNotes,
    customEntries,
    confessedItemIDs,
    lastConfessionDate,
    markedQuestions,
    totalSelectedCount: selectedQuestionIDs.size + customEntries.length,
    isQuestionSelected: (id) => selectedQuestionIDs.has(id),
    note: (id) => questionNotes[id] || '',
    isItemConfessed: (id) => confessedItemIDs.has(id),
    toggleQuestion,
    updateNote,
    addCustomEntry,
    removeCustomEntry,
    toggleConfessedItem,
    completeAbsolution,
    setLastConfessionDate,
  };

  if (!fontsLoaded) {
    return (
      <CandlelightBackground>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CandlelightPalette.warmAmber} />
        </View>
      </CandlelightBackground>
    );
  }

  return (
    <CandlelightBackground>
      <StatusBar style="light" />

      {currentScreen === 'home' && (
        <HomeScreen
          store={store}
          onNavigateToExam={() => setCurrentScreen('exam')}
          onNavigateToConfessional={() => setCurrentScreen('confessional')}
        />
      )}

      {currentScreen === 'exam' && (
        <ExaminationScreen
          store={store}
          onBack={() => setCurrentScreen('home')}
          onNavigateToConfessional={() => setCurrentScreen('confessional')}
        />
      )}

      {currentScreen === 'confessional' && (
        <ConfessionalScreen
          store={store}
          onBack={() => setCurrentScreen('exam')}
          onAbsolutionComplete={() => setCurrentScreen('home')}
        />
      )}

      {/* Privacy Blur Shield when app is in multitasking or background */}
      {!isAppActive && (
        <View style={[StyleSheet.absoluteFill, styles.privacyShield]}>
          <BlurView intensity={85} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.privacyCenter}>
              <Ionicons
                name="lock-closed"
                size={48}
                color={CandlelightPalette.warmAmber}
              />
              <Text style={styles.privacyTitle}>Exame de Consciência</Text>
              <Text style={styles.privacySubtitle}>
                Conteúdo protegido em segundo plano
              </Text>
            </View>
          </BlurView>
        </View>
      )}
    </CandlelightBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyShield: {
    zIndex: 9999,
  },
  privacyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  privacyTitle: {
    fontFamily: Typography.title,
    fontSize: 22,
    letterSpacing: 1,
    color: CandlelightPalette.ivory,
    marginTop: 16,
  },
  privacySubtitle: {
    fontSize: 13,
    color: CandlelightPalette.mutedText,
    marginTop: 6,
  },
});
