import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Product Screens
import { HomeScreen } from '../features/listings/screens/HomeScreen';
import { ListingDetailScreen } from '../features/listings/screens/ListingDetailScreen';
import { SellerProfileScreen } from '../features/listings/screens/SellerProfileScreen';
import { EnquiriesScreen } from '../features/enquiries/screens/EnquiriesScreen';
import { EnquiryDetailScreen } from '../features/enquiries/screens/EnquiryDetailScreen';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { MyStorefrontScreen } from '../features/dashboard/screens/MyStorefrontScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { SettingsScreen } from '../features/profile/screens/SettingsScreen';

// Native Feature Screens
import { NearbyItemsScreen } from '../features/2.Location/NearbyItemsScreen';
import { InviteFriendsScreen } from '../features/3.Contacts/InviteFriendsScreen';
import { DownloadsStorageScreen } from '../features/9.FileSystem/DownloadsStorageScreen';
import { NetworkStatusScreen } from '../features/8.Network/NetworkStatusScreen';
import { NotificationCenterScreen } from '../features/6.Notifications/NotificationCenterScreen';
import { CameraScreen } from '../features/1.Camera/CameraScreen';

// The previous drawer navigator (@react-navigation/drawer v6) relied on
// Reanimated v1 APIs removed in v4, which crashed the whole authenticated UI.
// The drawer UI is now rendered as a custom overlay (see DrawerOverlay) and the
// screens live on a native stack so programmatic navigation keeps working.
const Stack = createNativeStackNavigator();

export const AppDrawer = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Enquiries" component={EnquiriesScreen} />
      <Stack.Screen name="EnquiryDetail" component={EnquiryDetailScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="MyStorefront" component={MyStorefrontScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      {/* Native Feature Screens */}
      <Stack.Screen name="NearbyItems" component={NearbyItemsScreen} />
      <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
      <Stack.Screen name="DownloadsStorage" component={DownloadsStorageScreen} />
      <Stack.Screen name="NetworkStatus" component={NetworkStatusScreen} />
      <Stack.Screen name="Notifications" component={NotificationCenterScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
};
