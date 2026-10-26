import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DRAFT: '@exame_consciencia_draft_v1',
  LAST_CONFESSION: '@exame_consciencia_last_confession_v1',
};

const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function saveDraftSession(session) {
  try {
    const payload = {
      ...session,
      updatedAt: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(payload));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

export async function loadDraftSession() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const age = Date.now() - (session.updatedAt || 0);
    if (age > DRAFT_MAX_AGE_MS) {
      await clearDraftSession();
      return null;
    }
    return session;
  } catch (error) {
    await clearDraftSession();
    return null;
  }
}

export async function clearDraftSession() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch (error) {
    console.error('Error clearing draft:', error);
  }
}

export async function getLastConfessionDate() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CONFESSION);
    return raw ? new Date(parseInt(raw, 10)) : null;
  } catch (error) {
    return null;
  }
}

export async function setLastConfessionDate(date) {
  try {
    if (!date) {
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_CONFESSION);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CONFESSION, date.getTime().toString());
    }
  } catch (error) {
    console.error('Error setting confession date:', error);
  }
}

export function calculateDaysSince(date) {
  if (!date) return null;
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function formatConfessionDate(date) {
  if (!date) return 'Nenhuma data registrada';
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatNaturalDaysSince(date) {
  const days = calculateDaysSince(date);
  if (days === null) return null;
  if (days === 0) return 'hoje mesmo';
  if (days === 1) return 'ontem (há 1 dia)';
  if (days < 7) return `há ${days} dias`;
  if (days < 14) return 'há cerca de 1 semana';
  if (days < 21) return 'há cerca de 2 semanas';
  if (days < 28) return 'há cerca de 3 semanas';
  if (days < 45) return 'há cerca de 1 mês';
  if (days < 75) return 'há cerca de 2 meses';
  if (days < 105) return 'há cerca de 3 meses';
  if (days < 150) return 'há cerca de 4 meses';
  if (days < 210) return 'há cerca de 6 meses';
  if (days < 365) return 'há menos de 1 ano';
  if (days < 730) return 'há cerca de 1 ano';
  return 'há mais de um ano';
}
