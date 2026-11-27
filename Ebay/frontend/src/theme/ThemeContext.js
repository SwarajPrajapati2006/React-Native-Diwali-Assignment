import React, { createContext, useContext } from 'react';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

const ThemeContext = createContext({
  colors,
  typography,
  spacing,
  isDark: false,
});

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ colors, typography, spacing, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
