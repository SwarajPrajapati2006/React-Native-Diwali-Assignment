import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_DRAFTS = '@campus_market_drafts';

export const useDraftStore = create((set, get) => ({
  drafts: [],

  loadDrafts: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_DRAFTS);
      if (data) {
        set({ drafts: JSON.parse(data) });
      }
    } catch (e) {
      console.error('Error loading drafts:', e);
    }
  },

  saveDraft: async (draftData) => {
    const current = get().drafts;
    const existingIndex = current.findIndex((d) => d.id === draftData.id);
    let updated;

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...draftData, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...draftData,
          id: draftData.id || `draft_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...current,
      ];
    }

    set({ drafts: updated });
    await AsyncStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
    return updated[0];
  },

  deleteDraft: async (id) => {
    const filtered = get().drafts.filter((d) => d.id !== id);
    set({ drafts: filtered });
    await AsyncStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(filtered));
  },
}));
