import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const FilterChips = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  selectedType = null,
  onSelectType,
}) => {
  const types = ['All', 'For Sale', 'Free', 'Exchange'];

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextActive]}
                numberOfLines={1}
              >
                {cat.name || cat.id}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Type Filter Quick Bar */}
      <View style={styles.typesRow}>
        {types.map((t) => {
          const isSelected = (selectedType || 'All') === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, isSelected && styles.typeButtonActive]}
              onPress={() => onSelectType(t === 'All' ? null : t)}
            >
              <Text style={[styles.typeText, isSelected && styles.typeTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    flexShrink: 0,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  chipActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
  chipTextActive: {
    color: colors.white,
    fontFamily: fonts.headingBold,
  },
  typesRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  typeButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.sage,
  },
  typeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.heading,
  },
  typeTextActive: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
  },
});
