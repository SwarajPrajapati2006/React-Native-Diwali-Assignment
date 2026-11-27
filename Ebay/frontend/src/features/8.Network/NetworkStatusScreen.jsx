import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from './useNetwork';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const NetworkStatusScreen = () => {
  const {
    isConnected,
    isInternetReachable,
    connectionType,
    latencyMs,
    offlineQueue,
    testingLatency,
    pingServerLatency,
  } = useNetwork();

  useEffect(() => {
    pingServerLatency();
  }, []);

  const isOnline = isConnected && isInternetReachable;

  return (
    <View style={styles.container}>
      <Header title="Network & Connectivity" showSearch={false} />

      <View style={styles.content}>
        {/* Status Card */}
        <View style={[styles.card, isOnline ? styles.cardOnline : styles.cardOffline]}>
          <View style={styles.statusRow}>
            <Ionicons
              name={isOnline ? 'wifi' : 'cloud-offline'}
              size={36}
              color={isOnline ? colors.sage : colors.coral}
            />
            <View style={styles.statusCol}>
              <Text style={styles.statusTitle}>
                {isOnline ? 'Campus Cloud Connected' : 'Device is Offline'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? 'All marketplace listings, chats & offers sync in real-time.'
                  : 'Cached marketplace data is active. Changes queue locally.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Network Metrics */}
        <View style={styles.metricsBox}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Connection Type</Text>
            <Text style={styles.metricValue}>{connectionType.toUpperCase()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Internet Reachability</Text>
            <Text
              style={[
                styles.metricValue,
                { color: isInternetReachable ? colors.sage : colors.coral },
              ]}
            >
              {isInternetReachable ? 'Reachable' : 'Unreachable'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>API Server Latency</Text>
            <Text style={styles.metricValue}>
              {latencyMs !== null ? `${latencyMs} ms` : 'Not Measured'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Offline Pending Actions</Text>
            <Text
              style={[
                styles.metricValue,
                { color: offlineQueue.length > 0 ? colors.ebayYellow : colors.textSecondary },
              ]}
            >
              {offlineQueue.length} queued
            </Text>
          </View>
        </View>

        {/* Test Latency Button */}
        <TouchableOpacity
          style={styles.btnPing}
          onPress={pingServerLatency}
          disabled={testingLatency}
        >
          {testingLatency ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.btnPingText}>Test API Latency (/api/categories)</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  cardOnline: {
    borderColor: colors.sage,
  },
  cardOffline: {
    borderColor: colors.coral,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCol: {
    marginLeft: 14,
    flex: 1,
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 4,
  },
  statusSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 18,
  },
  metricsBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
  },
  btnPing: {
    backgroundColor: colors.sage,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnPingText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
});
