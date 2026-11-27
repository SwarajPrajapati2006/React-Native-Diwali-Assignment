import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/typography';
import { StatusBadge } from './StatusBadge';
import { DonationInfoSheet } from './DonationInfoSheet';

export const ListingCard = ({
  listing,
  isFavorite = false,
  onToggleFavorite,
  onPress,
}) => {
  const [showDonationInfo, setShowDonationInfo] = useState(false);

  const handleFavoritePress = async (e) => {
    e?.stopPropagation?.();
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (err) {}
    }
    if (onToggleFavorite) onToggleFavorite(listing);
  };

  const handleStarPress = (e) => {
    e?.stopPropagation?.();
    setShowDonationInfo(true);
  };

  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const formatPrice = () => {
    if (listing.type === 'Free') return 'FREE';
    if (listing.type === 'Exchange') return 'EXCHANGE';
    return `₹${listing.price?.toLocaleString?.() || listing.price}`;
  };

  const isUnavailable = listing.status === 'Sold';

  return (
    <>
      <TouchableOpacity
        style={[styles.card, isUnavailable && styles.cardUnavailable]}
        onPress={() => onPress && onPress(listing)}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={`Listing: ${listing.title}`}
      >
        {/* Image Container with Top Badges */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Condition Chip */}
          <View style={styles.conditionChip}>
            <Text style={styles.conditionText}>{listing.condition}</Text>
          </View>

          {/* Donation Coral Star (if flagged) */}
          {listing.isDonation && (
            <TouchableOpacity
              style={styles.donationStarContainer}
              onPress={handleStarPress}
              accessibilityLabel="View pledge organization"
            >
              <Ionicons name="star" size={18} color={colors.coral} />
            </TouchableOpacity>
          )}

          {/* Heart Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleFavoritePress}
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.coral : colors.white}
            />
          </TouchableOpacity>

          {/* Status Ribbon (if not Available) */}
          {listing.status !== 'Available' && (
            <View
              style={[
                styles.statusRibbon,
                {
                  backgroundColor:
                    listing.status === 'Sold' ? colors.ebayRed : colors.ebayYellow,
                },
              ]}
            >
              <Text style={styles.statusRibbonText}>{listing.status}</Text>
            </View>
          )}
        </View>

        {/* Card Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.metaCol}>
              <Text style={styles.categoryText}>{listing.category}</Text>
              {listing.pickupLocation && (
                <Text style={styles.locationText} numberOfLines={1}>
                  📍 {listing.pickupLocation}
                </Text>
              )}
            </View>

            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.priceText,
                  listing.type === 'Free' && { color: colors.ebayGreen },
                  listing.type === 'Exchange' && { color: colors.ebayBlue, fontSize: 13 },
                ]}
              >
                {formatPrice()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <DonationInfoSheet
        visible={showDonationInfo}
        onClose={() => setShowDonationInfo(false)}
        cause={listing.donationCause}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardUnavailable: {
    opacity: 0.65,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: colors.surfaceRaised,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  conditionChip: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  conditionText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.headingBold,
  },
  donationStarContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.coral,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRibbon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusRibbonText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  content: {
    padding: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.listingTitle,
    fontFamily: fonts.headingMedium,
    lineHeight: 20,
    minHeight: 36,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
    marginRight: 6,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: colors.sage,
    fontSize: fontSizes.price,
    fontFamily: fonts.headingBold,
  },
});
