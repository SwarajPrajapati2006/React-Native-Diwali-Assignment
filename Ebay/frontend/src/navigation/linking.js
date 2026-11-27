export const linking = {
  prefixes: ['campusmarket://', 'https://campusmarket.app'],
  config: {
    screens: {
      // Auth screens are nested under the "Auth" stack in RootNavigator.
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      MainApp: {
        screens: {
          Home: 'home',
          ListingDetail: 'listing/:id',
          SellerProfile: 'seller/:sellerId',
          Favorites: 'favorites',
          Enquiries: 'enquiries',
          EnquiryDetail: 'enquiry/:enquiryId',
          Dashboard: 'dashboard',
          MyStorefront: 'storefront',
          NearbyItems: 'nearby',
          InviteFriends: 'invite',
          DownloadsStorage: 'downloads',
          NetworkStatus: 'network',
          Notifications: 'notifications',
          Camera: 'camera',
          Profile: 'profile',
          Settings: 'settings',
        },
      },
    },
  },
};
