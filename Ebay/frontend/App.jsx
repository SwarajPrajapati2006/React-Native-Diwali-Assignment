import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import Toast from 'react-native-toast-message';

import { queryClient } from './src/services/queryClient';
import { ThemeProvider } from './src/theme/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useSplashScreen } from './src/features/10.SplashScreen/useSplashScreen';
import { SplashScreenView } from './src/features/10.SplashScreen/SplashScreenView';
import { colors } from './src/theme/colors';

export default function App() {
  const { appIsReady } = useSplashScreen();

  // Load the two app fonts (Montserrat for headings/prices/buttons, Inter for body).
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  // Hide browser scrollbars on web (keeps the native scroll indicator hidden too).
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const style = document.createElement('style');
    style.textContent =
      '*::-webkit-scrollbar{width:0!important;height:0!important;display:none!important;}' +
      'html,body,#root{scrollbar-width:none!important;-ms-overflow-style:none!important;}';
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  if ((!appIsReady || (!fontsLoaded && !fontError))) {
    return <SplashScreenView />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <StatusBar style="dark" backgroundColor={colors.background} />
            <RootNavigator />
            <Toast />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
