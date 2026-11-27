import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './useAuth';
import { BSLogo } from '../../components/BSLogo';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const BiometricUnlockScreen = ({ onUnlocked }) => {
  const { authenticateWithBiometrics } = useAuth();
  const [attempting, setAttempting] = useState(false);

  useEffect(() => {
    handleBiometrics();
  }, []);

  const handleBiometrics = async () => {
    setAttempting(true);
    const success = await authenticateWithBiometrics();
    setAttempting(false);
    if (success && onUnlocked) {
      onUnlocked();
    }
  };

  return (
    <View style={styles.container}>
      <BSLogo size="large" showTagline={true} />

      <View style={styles.centerIcon}>
        <Ionicons name="finger-print" size={80} color={colors.sage} />
        <Text style={styles.title}>Touch or Glance to Unlock</Text>
        <Text style={styles.subtitle}>
          Secure biometric access to your Buy & Sell account.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btnRetry}
        onPress={handleBiometrics}
        disabled={attempting}
      >
        {attempting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.btnRetryText}>Authenticate Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  centerIcon: {
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: fonts.headingBold,
    marginTop: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 20,
  },
  btnRetry: {
    backgroundColor: colors.sage,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  btnRetryText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.headingBold,
  },
});
