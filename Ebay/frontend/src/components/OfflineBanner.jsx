import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStore } from '../store/networkStore';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const OfflineBanner = () => {
  const { isConnected, isInternetReachable, offlineQueue } = useNetworkStore();
  const isOffline = !isConnected || !isInternetReachable;

  if (!isOffline && offlineQueue.length === 0) return null;

  return (
    <View
      style={[
        styles.banner,
        isOffline ? styles.bannerOffline : styles.bannerSyncing,
      ]}
    >
      <Ionicons
        name={isOffline ? 'cloud-offline-outline' : 'sync-outline'}
        size={16}
        color={isOffline ? colors.white : colors.black}
      />
      <Text
        style={[
          styles.text,
          isOffline ? styles.textOffline : styles.textSyncing,
        ]}
      >
        {isOffline
          ? 'You are offline. Showing cached items.'
          : `Syncing ${offlineQueue.length} offline action(s)...`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  bannerOffline: {
    backgroundColor: colors.coral,
  },
  bannerSyncing: {
    backgroundColor: colors.ebayYellow,
  },
  text: {
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  textOffline: {
    color: colors.white,
  },
  textSyncing: {
    color: colors.black,
  },
});
