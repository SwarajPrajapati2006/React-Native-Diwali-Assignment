import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_SETTINGS = '@campus_market_settings';

export const useSettingsStore = create((set, get) => ({
  isDark: true, // Master Requirement: Dark mode default!
  pushNotificationsEnabled: true,
  offlineCacheEnabled: true,

  initializeSettings: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          isDark: parsed.isDark !== undefined ? parsed.isDark : true,
          pushNotificationsEnabled: parsed.pushNotificationsEnabled ?? true,
          offlineCacheEnabled: parsed.offlineCacheEnabled ?? true,
        });
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  },

  toggleTheme: async () => {
    const next = !get().isDark;
    set({ isDark: next });
    await AsyncStorage.setItem(
      STORAGE_SETTINGS,
      JSON.stringify({ ...get(), isDark: next })
    );
  },

  setNotificationSetting: async (enabled) => {
    set({ pushNotificationsEnabled: enabled });
    await AsyncStorage.setItem(
      STORAGE_SETTINGS,
      JSON.stringify({ ...get(), pushNotificationsEnabled: enabled })
    );
  },
}));
