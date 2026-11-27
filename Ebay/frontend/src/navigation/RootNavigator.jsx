import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { queryClient } from '../services/queryClient';
import { AuthStack } from './AuthStack';
import { AppDrawer } from './AppDrawer';
import { DrawerOverlay } from './DrawerOverlay';
import { DrawerContext } from './DrawerContext';
import { CreateEditListingScreen } from '../features/listings/screens/CreateEditListingScreen';
import { CameraScreen } from '../features/1.Camera/CameraScreen';
import { linking } from './linking';
import { colors } from '../theme/colors';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, userId } = useAuthStore();
  const navigationRef = useNavigationContainerRef();

  // Drop cached queries whenever the signed-in account changes so a listing
  // posted by one user always reflects fresh data in another account.
  useEffect(() => {
    queryClient.clear();
  }, [userId]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Home');

  const open = useCallback(() => setDrawerOpen(true), []);
  const close = useCallback(() => setDrawerOpen(false), []);
  const toggle = useCallback(() => setDrawerOpen((prev) => !prev), []);

  const handleStateChange = useCallback(() => {
    const route = navigationRef.getCurrentRoute();
    if (route?.name) setCurrentRoute(route.name);
  }, [navigationRef]);

  const navigateFromDrawer = useCallback(
    (screen, params) => {
      navigationRef.navigate('MainApp', { screen, params });
    },
    [navigationRef]
  );

  const drawerNav = React.useMemo(
    () => ({
      isOpen: isDrawerOpen && isAuthenticated,
      open,
      close,
      toggle,
      currentRoute,
      navigate: navigateFromDrawer,
    }),
    [isDrawerOpen, isAuthenticated, open, close, toggle, currentRoute, navigateFromDrawer]
  );

  const navTheme = {
    dark: false,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.surfaceBorder,
      notification: colors.accent,
    },
  };

  return (
    <DrawerContext.Provider value={drawerNav}>
      <NavigationContainer
        ref={navigationRef}
        theme={navTheme}
        linking={linking}
        onStateChange={handleStateChange}
      >
        <View style={styles.root}>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <RootStack.Screen name="Auth" component={AuthStack} />
            ) : (
              <>
                <RootStack.Screen name="MainApp" component={AppDrawer} />
                <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                  <RootStack.Screen name="CreateListing" component={CreateEditListingScreen} />
                  <RootStack.Screen name="CameraModal" component={CameraScreen} />
                </RootStack.Group>
              </>
            )}
          </RootStack.Navigator>

          {isAuthenticated && <DrawerOverlay />}
        </View>
      </NavigationContainer>
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});