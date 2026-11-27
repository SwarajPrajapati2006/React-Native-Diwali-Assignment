import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const CardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.lineLong} />
        <View style={styles.lineShort} />
        <View style={styles.footerRow}>
          <View style={styles.tagPlaceholder} />
          <View style={styles.pricePlaceholder} />
        </View>
      </View>
    </View>
  );
};

export const GridSkeleton = () => {
  return (
    <View style={styles.grid}>
      <View style={styles.col}>
        <CardSkeleton />
        <CardSkeleton />
      </View>
      <View style={styles.col}>
        <CardSkeleton />
        <CardSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  col: {
    flex: 1,
    paddingHorizontal: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceRaised,
  },
  content: {
    padding: 12,
  },
  lineLong: {
    height: 14,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 4,
    marginBottom: 8,
    width: '90%',
  },
  lineShort: {
    height: 14,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 4,
    marginBottom: 14,
    width: '60%',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagPlaceholder: {
    width: 50,
    height: 12,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 4,
  },
  pricePlaceholder: {
    width: 60,
    height: 16,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 4,
  },
});
