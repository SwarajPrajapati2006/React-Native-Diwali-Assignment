import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const SearchBar = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search items here...',
}) => {
  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text && onChangeText) {
        onChangeText(text);
      }
    } catch (e) {
      console.warn('Clipboard paste failed:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePaste} style={styles.pasteBtn}>
          <Text style={styles.pasteText}>PASTE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  pasteBtn: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(31, 78, 137, 0.3)',
  },
  pasteText: {
    color: colors.sage,
    fontSize: 10,
    fontFamily: fonts.headingBold,
    letterSpacing: 0.5,
  },
});
