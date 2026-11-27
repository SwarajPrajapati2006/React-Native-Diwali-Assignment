import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const ClipboardBanner = ({ copiedLink, onDismiss }) => {
  const navigation = useNavigation();

  if (!copiedLink) return null;

  const handleOpen = () => {
    navigation.navigate('ListingDetail', { id: copiedLink.id });
    onDismiss();
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="link-outline" size={20} color={colors.sage} />
        <View style={styles.textCol}>
          <Text style={styles.title}>Copied Listing Detected</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Open item #{copiedLink.id}?
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnOpen} onPress={handleOpen}>
          <Text style={styles.btnOpenText}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDismiss} onPress={onDismiss}>
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surfaceRaised,
    marginHorizontal: 14,
    marginVertical: 8,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.sage,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textCol: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.body,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnOpen: {
    backgroundColor: colors.sage,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnOpenText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  btnDismiss: {
    padding: 4,
  },
});
