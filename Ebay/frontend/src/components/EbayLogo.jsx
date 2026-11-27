import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const EbayLogo = ({ size = 'medium', showTagline = true }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const fontSize = isLarge ? 38 : isSmall ? 22 : 28;
  const badgeFont = isLarge ? 11 : isSmall ? 8 : 9;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={[styles.letter, { color: colors.ebayRed, fontSize }]}>e</Text>
        <Text style={[styles.letter, { color: colors.ebayBlue, fontSize }]}>b</Text>
        <Text style={[styles.letter, { color: colors.ebayYellow, fontSize }]}>a</Text>
        <Text style={[styles.letter, { color: colors.ebayGreen, fontSize }]}>y</Text>
      </View>
      {showTagline && (
        <View style={styles.taglineBadge}>
          <Text style={[styles.taglineText, { fontSize: badgeFont }]}>CAMPUS MARKET</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    letterSpacing: -1,
  },
  letter: {
    fontWeight: '800',
    fontStyle: 'italic',
  },
  taglineBadge: {
    backgroundColor: 'rgba(133, 179, 138, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: -2,
    borderWidth: 1,
    borderColor: 'rgba(133, 179, 138, 0.4)',
  },
  taglineText: {
    color: colors.sage,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
