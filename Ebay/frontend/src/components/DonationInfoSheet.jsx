import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const DonationInfoSheet = ({ visible, onClose, cause }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Ionicons name="star" size={20} color={colors.coral} />
              <Text style={styles.badgeTitle}>Campus Pledged Item</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.headline}>
            100% Student Impact & Organization Pledge
          </Text>

          <Text style={styles.bodyText}>
            All proceeds of flagged items are pledged to student organizations, campus library drives, and underprivileged book scholarships.
          </Text>

          {cause ? (
            <View style={styles.causeBox}>
              <Text style={styles.causeLabel}>Designated Cause:</Text>
              <Text style={styles.causeText}>{cause}</Text>
            </View>
          ) : (
            <View style={styles.causeBox}>
              <Text style={styles.causeLabel}>Designated Cause:</Text>
              <Text style={styles.causeText}>
                Campus Green Drive & Underprivileged Student Book Grants
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionButtonText}>Got it, thank you!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 58, 63, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeTitle: {
    color: colors.coral,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    marginLeft: 6,
  },
  closeBtn: {
    padding: 4,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.headingBold,
    marginBottom: 10,
  },
  bodyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 20,
    marginBottom: 16,
  },
  causeBox: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.coral,
    marginBottom: 20,
  },
  causeLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.heading,
    marginBottom: 4,
  },
  causeText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.heading,
  },
  actionButton: {
    backgroundColor: colors.sage,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.headingBold,
  },
});
