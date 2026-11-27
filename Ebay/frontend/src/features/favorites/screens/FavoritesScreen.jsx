import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../hooks/useFavorites';
import { Header } from '../../../components/Header';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

export const FavoritesScreen = ({ navigation }) => {
  const { favorites, isLoading, isRefetching, refetch, toggleFavorite } = useFavorites();

  const renderItem = ({ item }) => {
    const listing = item.listing;
    if (!listing) return null;

    const isSold = listing.status === 'Sold';
    const imageUrl =
      listing.images?.[0] ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

    return (
      <View style={[styles.card, isSold && styles.cardSold]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {listing.title}
            </Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(listing)}
              style={styles.heartBtn}
            >
              <Ionicons name="heart" size={20} color={colors.coral} />
            </TouchableOpacity>
          </View>

          <Text style={styles.category}>{listing.category} • {listing.condition}</Text>

          {isSold ? (
            <View style={styles.soldBanner}>
              <Text style={styles.soldBannerText}>No longer available (Sold)</Text>
            </View>
          ) : (
            <Text style={styles.price}>
              {listing.type === 'Free' ? 'FREE' : `₹${listing.price}`}
            </Text>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.btnView}
              onPress={() => navigation.navigate('ListingDetail', { id: listing._id })}
            >
              <Text style={styles.btnViewText}>View Item</Text>
            </TouchableOpacity>

            {isSold && (
              <TouchableOpacity
                style={styles.btnSimilar}
                onPress={() =>
                  navigation.navigate('Home', {
                    initialCategory: listing.category,
                  })
                }
              >
                <Text style={styles.btnSimilarText}>Find Similar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Saved Favorites" showSearch={false} />

      {isLoading && favorites.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.sage} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.sage}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="heart-outline"
              title="No Favorites Yet"
              subtitle="Tap the heart icon on any campus listing to bookmark items you're interested in."
              actionLabel="Explore Marketplace"
              onAction={() => navigation.navigate('Home')}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardSold: {
    opacity: 0.7,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    flex: 1,
    marginRight: 8,
  },
  heartBtn: {
    padding: 4,
  },
  category: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.body,
    marginVertical: 2,
  },
  price: {
    color: colors.sage,
    fontSize: 16,
    fontFamily: fonts.headingBold,
  },
  soldBanner: {
    backgroundColor: 'rgba(217, 58, 63, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  soldBannerText: {
    color: colors.ebayRed,
    fontSize: 11,
    fontFamily: fonts.headingBold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  btnView: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  btnViewText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  btnSimilar: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnSimilarText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
