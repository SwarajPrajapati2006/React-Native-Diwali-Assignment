import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../../store/settingsStore';
import { useAuthStore } from '../../../store/authStore';
import { useFileSystem } from '../../9.FileSystem/useFileSystem';
import { Header } from '../../../components/Header';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

export const SettingsScreen = () => {
  const {
    isDark,
    toggleTheme,
    pushNotificationsEnabled,
    setNotificationSetting,
  } = useSettingsStore();

  const { isBiometricsEnabled, setBiometricsEnabled, logout } = useAuthStore();
  const { clearAppCache, cacheSizeMb } = useFileSystem();
  const [logoutVisible, setLogoutVisible] = useState(false);

  // Alert.alert is a no-op on web, so use an in-app dialog that works everywhere.
  const handleLogout = () => setLogoutVisible(true);

  const confirmLogout = async () => {
    setLogoutVisible(false);
    await logout();
  };

  const handleClearCache = async () => {
    await clearAppCache();
    Alert.alert('Cache Cleared', 'Device image cache was emptied.');
  };

  return (
    <View style={styles.container}>
      <Header title="Marketplace Settings" showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance & Theme</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <Ionicons name="moon-outline" size={20} color={colors.sage} />
              <View style={styles.textCol}>
                <Text style={styles.itemTitle}>Dark Mode (Default)</Text>
                <Text style={styles.itemDesc}>Premium high-contrast dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? colors.sage : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>
        </View>

        {/* Security & Biometrics */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <Ionicons name="finger-print-outline" size={20} color={colors.sage} />
              <View style={styles.textCol}>
                <Text style={styles.itemTitle}>Biometric Unlock</Text>
                <Text style={styles.itemDesc}>Require Face ID / Fingerprint on launch</Text>
              </View>
            </View>
            <Switch
              value={isBiometricsEnabled}
              onValueChange={setBiometricsEnabled}
              thumbColor={isBiometricsEnabled ? colors.sage : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <Ionicons name="notifications-outline" size={20} color={colors.sage} />
              <View style={styles.textCol}>
                <Text style={styles.itemTitle}>Push Notifications</Text>
                <Text style={styles.itemDesc}>Alerts for enquiry messages & price offers</Text>
              </View>
            </View>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setNotificationSetting}
              thumbColor={pushNotificationsEnabled ? colors.sage : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>
        </View>

        {/* Storage */}
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleClearCache}>
            <View style={styles.leftCol}>
              <Ionicons name="trash-outline" size={20} color={colors.coral} />
              <View style={styles.textCol}>
                <Text style={styles.itemTitle}>Empty Offline Image Cache</Text>
                <Text style={styles.itemDesc}>Current cache: {cacheSizeMb} MB</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.coral} />
          <Text style={styles.btnLogoutText}>Sign Out of Campus Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmDialog
        visible={logoutVisible}
        title="Sign Out"
        message="Are you sure you want to log out of Buy & Sell?"
        confirmLabel="Log Out"
        isDestructive
        onConfirm={confirmLogout}
        onCancel={() => setLogoutVisible(false)}
      />
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
    paddingBottom: 40,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textCol: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
  itemDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  btnLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 58, 63, 0.1)',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.coral,
    gap: 8,
    marginTop: 20,
  },
  btnLogoutText: {
    color: colors.coral,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
});
