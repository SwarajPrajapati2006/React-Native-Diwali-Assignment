import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../features/6.Notifications/useNotifications';
import { BSLogo } from '../components/BSLogo';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const CustomDrawerContent = ({ navigation, state }) => {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotifications();
  const insets = useSafeAreaInsets();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const currentRoute = state.routes[state.index]?.name;
  const badgeText = unreadCount > 9 ? '9+' : String(unreadCount);

  const handleLogout = () => setLogoutVisible(true);

  const confirmLogout = async () => {
    setLogoutVisible(false);
    await logout();
  };

  const navigateTo = (screen, params) => {
    navigation.navigate(screen, params);
  };

  const renderItem = (label, icon, targetScreen, params = {}, badge = null) => {
    const isActive =
      currentRoute === targetScreen &&
      !params?.initialCategory &&
      !params?.initialType;

    return (
      <TouchableOpacity
        key={label}
        style={[styles.drawerItem, isActive && styles.drawerItemActive]}
        onPress={() => navigateTo(targetScreen, params)}
        activeOpacity={0.7}
      >
        <View style={styles.itemLeft}>
          <Ionicons
            name={icon}
            size={19}
            color={isActive ? colors.primary : colors.white}
          />
          <Text
            style={[styles.itemLabel, isActive && styles.itemLabelActive]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        </View>

        {badge && (
          <View style={styles.itemBadge}>
            <Text style={styles.itemBadgeText}>{badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Pinned Header — Stays fixed at top, never scrolls into the phone clock/status bar */}
      <View
        style={[
          styles.pinnedHeader,
          { paddingTop: Math.max(insets.top, 16) + 8 },
        ]}
      >
        <View style={styles.logoRow}>
          <BSLogo size="small" showTagline={false} variant="light" />
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Buy & Sell</Text>
            <Text style={styles.headerSubtitle}>Campus Marketplace</Text>
          </View>
        </View>

        {user && (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigateTo('Profile')}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  user.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.userCollege} numberOfLines={1}>
                {user.college || user.role || 'XYZ College'}
              </Text>
            </View>
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{badgeText}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Scrollable Navigation Menu List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 20) + 30 },
        ]}
      >
        <Text style={styles.groupHeading}>Main Menu</Text>
        <View style={styles.group}>
          {renderItem('Home', 'home-outline', 'Home')}
          {renderItem('Post New Item', 'add-circle-outline', 'CreateListing')}
          {renderItem('Profile', 'person-outline', 'Profile')}
          {renderItem('My Storefront', 'storefront-outline', 'MyStorefront')}
          {renderItem('Dashboard', 'stats-chart-outline', 'Dashboard')}
          {renderItem('Favorites', 'heart-outline', 'Favorites')}
          {renderItem('Enquiries', 'chatbubbles-outline', 'Enquiries')}
          {renderItem(
            'Notifications',
            'notifications-outline',
            'Notifications',
            {},
            unreadCount > 0 ? badgeText : null
          )}
        </View>

        <View style={styles.divider} />

        <Text style={styles.groupHeading}>Categories</Text>
        <View style={styles.group}>
          {renderItem('All Items', 'grid-outline', 'Home', {
            initialCategory: 'All',
          })}
          {renderItem('Books & Notes', 'book-outline', 'Home', {
            initialCategory: 'Books',
          })}
          {renderItem('Electronics & Gadgets', 'laptop-outline', 'Home', {
            initialCategory: 'Electronics',
          })}
          {renderItem('Hostel Furniture', 'bed-outline', 'Home', {
            initialCategory: 'Furniture',
          })}
          {renderItem('Stationery & Supplies', 'pencil-outline', 'Home', {
            initialCategory: 'Stationery',
          })}
          {renderItem('Other Essentials', 'cube-outline', 'Home', {
            initialCategory: 'Other',
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.groupHeading}>Listing Types</Text>
        <View style={styles.group}>
          {renderItem('For Sale', 'pricetag-outline', 'Home', {
            initialType: 'For Sale',
          })}
          {renderItem('Giveaways', 'gift-outline', 'Home', {
            initialType: 'Free',
          })}
          {renderItem('Exchange', 'repeat-outline', 'Home', {
            initialType: 'Exchange',
          })}
          {renderItem('Donations', 'star', 'Home', {
            initialType: 'Donations',
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.groupHeading}>Tools & Features</Text>
        <View style={styles.group}>
          {renderItem('Custom Camera', 'camera-outline', 'Camera')}
          {renderItem('Nearby Items', 'location-outline', 'NearbyItems')}
          {renderItem('Invite Friends', 'people-outline', 'InviteFriends')}
          {renderItem(
            'Downloads & Storage',
            'folder-outline',
            'DownloadsStorage'
          )}
          {renderItem('Network Status', 'wifi-outline', 'NetworkStatus')}
          {renderItem('Settings', 'settings-outline', 'Settings')}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmDialog
        visible={logoutVisible}
        title="Sign Out"
        message="Do you want to log out of Buy & Sell?"
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
    backgroundColor: colors.primary,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  pinnedHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 19,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
    letterSpacing: 0.2,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.white,
    fontSize: 14.5,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.2,
  },
  userCollege: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 11.5,
    fontFamily: fonts.body,
    marginTop: 1,
  },
  notifBadge: {
    backgroundColor: colors.accent,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: colors.white,
    fontSize: 10.5,
    fontFamily: fonts.headingBold,
  },
  groupHeading: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginTop: 12,
    marginBottom: 6,
    marginLeft: 8,
  },
  group: {
    marginBottom: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9.5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 2,
  },
  drawerItemActive: {
    backgroundColor: colors.white,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  itemLabel: {
    color: colors.white,
    fontSize: 13.5,
    fontFamily: fonts.bodyMedium,
    letterSpacing: 0.1,
  },
  itemLabelActive: {
    color: colors.primary,
    fontFamily: fonts.headingBold,
    letterSpacing: 0.1,
  },
  itemBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.headingBold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 8,
    marginHorizontal: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 8,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    letterSpacing: 0.2,
  },
});

export default CustomDrawerContent;
