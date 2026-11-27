import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEY_USER = '@campus_market_user';
const STORAGE_KEY_TOKEN = '@campus_market_token';
const STORAGE_KEY_BIOMETRICS = '@campus_market_biometrics';

const secureSave = async (key, val) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, val);
    } else {
      await SecureStore.setItemAsync(key, val);
    }
  } catch (e) {
    await AsyncStorage.setItem(key, val);
  }
};

const secureGet = async (key) => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    }
    const val = await SecureStore.getItemAsync(key);
    return val || (await AsyncStorage.getItem(key));
  } catch (e) {
    return await AsyncStorage.getItem(key);
  }
};

const secureDelete = async (key) => {
  try {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (e) {}
  await AsyncStorage.removeItem(key);
};

export const useAuthStore = create((set, get) => ({
  user: null,
  userId: null,
  token: null,
  isAuthenticated: false,
  isBiometricsEnabled: false,
  isLoading: true,

  initializeAuth: async () => {
    try {
      const storedUser = await secureGet(STORAGE_KEY_USER);
      const storedToken = await secureGet(STORAGE_KEY_TOKEN);
      const bioPref = await AsyncStorage.getItem(STORAGE_KEY_BIOMETRICS);

      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({
          user,
          userId: user._id || user.id,
          token: storedToken,
          isAuthenticated: true,
          isBiometricsEnabled: bioPref === 'true',
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.error('Failed to restore auth:', e);
    }
    set({ isLoading: false, isAuthenticated: false, user: null, userId: null });
  },

  setAuth: async (user, token) => {
    const userId = user._id || user.id;
    await secureSave(STORAGE_KEY_USER, JSON.stringify(user));
    if (token) await secureSave(STORAGE_KEY_TOKEN, token);

    set({
      user,
      userId,
      token,
      isAuthenticated: true,
    });
  },

  updateUser: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    await secureSave(STORAGE_KEY_USER, JSON.stringify(updated));
    set({ user: updated });
  },

  setBiometricsEnabled: async (enabled) => {
    await AsyncStorage.setItem(STORAGE_KEY_BIOMETRICS, String(enabled));
    set({ isBiometricsEnabled: enabled });
  },

  logout: async () => {
    await secureDelete(STORAGE_KEY_USER);
    await secureDelete(STORAGE_KEY_TOKEN);
    set({
      user: null,
      userId: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
