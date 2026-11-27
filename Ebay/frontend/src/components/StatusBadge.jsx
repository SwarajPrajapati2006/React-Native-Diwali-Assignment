import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const StatusBadge = ({ status = 'Available' }) => {
  let badgeColor = colors.available;
  let bg = 'rgba(22, 163, 74, 0.12)';

  if (status === 'Reserved') {
    badgeColor = colors.reserved;
    bg = 'rgba(245, 158, 11, 0.15)';
  } else if (status === 'Sold') {
    badgeColor = colors.sold;
    bg = 'rgba(217, 58, 63, 0.12)';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: badgeColor }]}>
      <View style={[styles.dot, { backgroundColor: badgeColor }]} />
      <Text style={[styles.text, { color: badgeColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 11,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
  },
});
