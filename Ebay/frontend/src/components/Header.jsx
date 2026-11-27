import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../navigation/DrawerContext';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/typography';
import { BSLogo } from './BSLogo';

export const Header = ({
  title,
  showLogo = false,
  showSearch = true,
  unreadCount = 0,
  onSearchPress,
}) => {
  const navigation = useNavigation();
  const { open: openDrawer } = useDrawer();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      {/* Hamburger / Drawer Toggle */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={openDrawer}
        accessibilityLabel="Open drawer menu"
      >
        <Ionicons name="menu-outline" size={26} color={colors.white} />
      </TouchableOpacity>

      {/* Title or Logo */}
      <View style={styles.centerContainer}>
        {showLogo ? (
          <BSLogo size="small" showTagline={false} variant="light" />
        ) : (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right Actions: Search + Bell */}
      <View style={styles.rightActions}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress || (() => navigation.navigate('Home'))}
            accessibilityLabel="Search marketplace"
          >
            <Ionicons name="search-outline" size={22} color={colors.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
          accessibilityLabel="View notifications"
        >
          <Ionicons name="notifications-outline" size={22} color={colors.white} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryPressed,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: fontSizes.appBar,
    fontFamily: fonts.heading,
    color: colors.white,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.coral,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.headingBold,
  },
});
