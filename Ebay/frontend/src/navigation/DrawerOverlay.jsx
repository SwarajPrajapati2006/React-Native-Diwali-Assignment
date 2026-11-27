import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useDrawer } from './DrawerContext';
import { CustomDrawerContent } from './CustomDrawerContent';

const ANIMATION_MS = 250;

export const DrawerOverlay = () => {
  const { isOpen, close, currentRoute, navigate } = useDrawer();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.8, 320);

  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(isOpen);

  // Animate open / close
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: ANIMATION_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [isOpen, progress]);

  // Android hardware back button closes the drawer
  useEffect(() => {
    if (!isOpen) return;
    const onBackPress = () => {
      close();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isOpen, close]);

  const panelStyle = {
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-panelWidth, 0],
        }),
      },
    ],
  };

  const backdropStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    }),
  };

  const navigation = useMemo(
    () => ({
      navigate: (screen, params) => {
        close();
        navigate(screen, params);
      },
    }),
    [close, navigate]
  );

  const state = useMemo(
    () => ({ index: 0, routes: [{ name: currentRoute }] }),
    [currentRoute]
  );

  // Nothing to render when fully closed
  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      {/* flex:1 is the critical fix — absoluteFillObject collapses to 0px on Android Modals */}
      <View style={styles.overlay}>
        {/* Semi-transparent backdrop — tap anywhere to close */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityLabel="Close drawer menu"
          />
        </Animated.View>

        {/* Sliding drawer panel */}
        <Animated.View style={[styles.panel, { width: panelWidth }, panelStyle]}>
          <CustomDrawerContent navigation={navigation} state={state} />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // flex:1 fills the Modal's native Dialog window on Android.
  // The old code used StyleSheet.absoluteFillObject (position:'absolute')
  // which has zero height inside an Android Dialog because there is no
  // parent with explicit dimensions to resolve against.
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    elevation: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
});

export default DrawerOverlay;
