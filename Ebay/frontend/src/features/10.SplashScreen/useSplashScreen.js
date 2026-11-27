import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNetworkStore } from '../../store/networkStore';

// Keep splash visible while resources load
SplashScreen.preventAutoHideAsync().catch(() => {});

export const useSplashScreen = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const { initializeAuth } = useAuthStore();
  const { initializeSettings } = useSettingsStore();
  const { loadQueue } = useNetworkStore();

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          initializeAuth(),
          initializeSettings(),
          loadQueue(),
        ]);
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    prepare();
  }, []);

  return { appIsReady };
};
