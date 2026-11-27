import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const SortSheet = ({
  visible,
  onClose,
  selectedSort = 'newest',
  onSelectSort,
}) => {
  const options = [
    { id: 'newest', label: 'Newest Arrivals', icon: 'sparkles-outline' },
    { id: 'price_asc', label: 'Price: Low to High', icon: 'trending-up-outline' },
    { id: 'price_desc', label: 'Price: High to Low', icon: 'trending-down-outline' },
    { id: 'oldest', label: 'Oldest First', icon: 'time-outline' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.title}>Sort Marketplace By</Text>

          {options.map((opt) => {
            const isSelected = selectedSort === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                onPress={() => {
                  onSelectSort(opt.id);
                  onClose();
                }}
              >
                <View style={styles.leftCol}>
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isSelected ? colors.sage : colors.textSecondary}
                  />
                  <Text style={[styles.optLabel, isSelected && styles.optLabelSelected]}>
                    {opt.label}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.sage} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  optionRowSelected: {
    backgroundColor: colors.primarySoft,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: fonts.heading,
    marginLeft: 12,
  },
  optLabelSelected: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
  },
});
