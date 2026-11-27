import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const BLUE = '#2B5797';
const RED = '#D0433A';
const TAG_GRAY = '#5A6068';

export const BSLogo = ({ size = 'medium', showTagline = true, variant = 'dark' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  const isLight = variant === 'light';

  const letterColor = isLight ? '#FFFFFF' : BLUE;
  const ampColor = isLight ? '#FF8A8E' : RED;

  const letterSize = isLarge ? 52 : isSmall ? 28 : 38;
  const iconSize = isLarge ? 26 : isSmall ? 14 : 20;
  const tagSize = isLarge ? 16 : isSmall ? 11 : 14;
  const gap = isLarge ? -10 : isSmall ? -5 : -8;
  const bagHandleW = isLarge ? 20 : isSmall ? 11 : 15;
  const bagHandleH = isLarge ? 10 : isSmall ? 5.5 : 8;

  return (
    <View style={styles.container}>
      <View style={[styles.row, { gap }]}>
        <View style={styles.letterBlock}>
          <View
            style={[
              styles.bagHandle,
              {
                width: bagHandleW,
                height: bagHandleH,
                borderColor: letterColor,
                borderWidth: isLarge ? 3 : isSmall ? 1.5 : 2.5,
              },
            ]}
          />
          <Text style={[styles.letter, { color: letterColor, fontSize: letterSize }]}>B</Text>
        </View>

        <View style={styles.ampBlock}>
          <Ionicons
            name="sync"
            size={iconSize}
            color={ampColor}
            style={styles.ampArrow}
          />
          <Text style={[styles.letter, { color: ampColor, fontSize: letterSize }]}>&</Text>
        </View>

        <Text style={[styles.letter, { color: letterColor, fontSize: letterSize }]}>S</Text>
      </View>

      {showTagline && (
        <Text
          style={[
            styles.tagline,
            { fontSize: tagSize, color: isLight ? 'rgba(255, 255, 255, 0.85)' : TAG_GRAY },
          ]}
        >
          Buy and Sell
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  letterBlock: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bagHandle: {
    borderBottomWidth: 0,
    borderColor: BLUE,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginBottom: -4,
  },
  ampBlock: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ampArrow: {
    position: 'absolute',
    top: 2,
    zIndex: 2,
  },
  letter: {
    fontFamily: fonts.headingBold,
    lineHeight: undefined,
    includeFontPadding: false,
    textAlignVertical: 'bottom',
  },
  tagline: {
    color: TAG_GRAY,
    fontFamily: fonts.headingBold,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
