import { Share, Alert, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

export const useShare = () => {
  const shareListing = async (listing) => {
    try {
      const priceStr =
        listing.type === 'Free' ? 'FREE' : `₹${listing.price?.toLocaleString?.() || listing.price}`;
      const deepLink = `campusmarket://listing/${listing._id}`;
      const message = `Check out this ${listing.title} on Buy &amp; Sell for ${priceStr}!\n\nOpen item: ${deepLink}`;

      const result = await Share.share({
        title: listing.title,
        message,
        url: deepLink,
      });

      return result.action === Share.sharedAction;
    } catch (e) {
      console.warn('Share listing error:', e);
      return false;
    }
  };

  const shareStorefront = async (seller) => {
    try {
      const deepLink = `campusmarket://seller/${seller._id || seller.id}`;
      const message = `Explore student storefront of ${seller.name} (${seller.college}) on Buy & Sell:\n${deepLink}`;

      await Share.share({
        title: `${seller.name}'s Campus Storefront`,
        message,
      });
      return true;
    } catch (e) {
      console.warn('Share storefront error:', e);
      return false;
    }
  };

  const shareFile = async (fileUri, mimeType = 'text/csv', dialogTitle = 'Share Document') => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing Unavailable', 'Native sharing is not supported on this platform/device.');
        return false;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle,
        UTI: 'public.comma-separated-values-text',
      });
      return true;
    } catch (e) {
      console.error('File sharing error:', e);
      return false;
    }
  };

  return {
    shareListing,
    shareStorefront,
    shareFile,
  };
};
