import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const DonationStar = ({ onPress, size = 18 }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Donation pledged item"
    >
      <Ionicons name="star" size={size} color={colors.coral} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(217, 58, 63, 0.15)',
    padding: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.coral,
  },
});
