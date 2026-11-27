import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_STORAGE = '@campus_offline_queue';

export const useNetworkStore = create((set, get) => ({
  isConnected: true,
  isInternetReachable: true,
  connectionType: 'unknown',
  latencyMs: null,
  offlineQueue: [],

  setNetworkState: (state) => {
    set({
      isConnected: Boolean(state.isConnected),
      isInternetReachable: state.isInternetReachable !== false,
      connectionType: state.type || 'unknown',
    });
  },

  setLatency: (ms) => set({ latencyMs: ms }),

  loadQueue: async () => {
    try {
      const data = await AsyncStorage.getItem(QUEUE_STORAGE);
      if (data) set({ offlineQueue: JSON.parse(data) });
    } catch (e) {}
  },

  enqueueAction: async (action) => {
    const queue = [...get().offlineQueue, { ...action, id: Date.now() }];
    set({ offlineQueue: queue });
    await AsyncStorage.setItem(QUEUE_STORAGE, JSON.stringify(queue));
  },

  clearQueue: async () => {
    set({ offlineQueue: [] });
    await AsyncStorage.removeItem(QUEUE_STORAGE);
  },
}));
