import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './useAuth';
import { BSLogo } from '../../components/BSLogo';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const DEMO_ACCOUNTS = [
  { label: 'Swaraj', email: 'swaraj@campus.edu' },
  { label: 'Aanya', email: 'aanya@campus.edu' },
  { label: 'Rohan', email: 'rohan@campus.edu' },
];

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const { login, isLoading, error, authenticateWithBiometrics } = useAuth();

  const handleLogin = async () => {
    if (isLoading) return;
    if (!email.trim() || !password) {
      setFormError('Enter your email and password to continue.');
      return;
    }
    setFormError(null);
    await login(email.trim(), password);
  };

  const handleBiometricLogin = async () => {
    const ok = await authenticateWithBiometrics();
    if (ok) await login('swaraj@campus.edu', 'password123');
  };

  // Demo accounts: fill the form and sign in immediately (single tap).
  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    login(demoEmail, 'password123');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Brand */}
          <View style={styles.brand}>
            <BSLogo size="medium" showTagline={false} />
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to buy, sell and exchange with your campus.
          </Text>

          {(formError || error) && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.accent} />
              <Text style={styles.errorText}>{formError || error}</Text>
            </View>
          )}

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="you@campus.edu"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (formError) setFormError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (formError) setFormError(null);
                }}
                secureTextEntry={!showPassword}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary action */}
          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Sign in</Text>
            )}
          </TouchableOpacity>

          {/* Secondary action */}
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={handleBiometricLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="finger-print-outline" size={18} color={colors.primary} />
            <Text style={styles.ghostBtnText}>Sign in with biometrics</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or use a demo account</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Demo chips */}
          <View style={styles.demoRow}>
            {DEMO_ACCOUNTS.map((demo) => (
              <TouchableOpacity
                key={demo.email}
                style={styles.demoChip}
                onPress={() => handleDemoLogin(demo.email)}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>{demo.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New here?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.headingBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    color: colors.accent,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.textPrimary,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.headingBold,
    letterSpacing: 0.2,
  },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  ghostBtnText: {
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceBorder,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  demoChipText: {
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: fonts.headingBold,
    color: colors.primary,
  },
});
