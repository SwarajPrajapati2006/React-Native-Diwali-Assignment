import { createContext, useContext } from 'react';

// Lightweight replacement for @react-navigation/drawer (which is incompatible
// with react-native-reanimated v4). Provides open/close state + a navigate()
// that targets the nested stack screens under the "MainApp" route.
export const DrawerContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  currentRoute: 'Home',
  navigate: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

export default DrawerContext;
