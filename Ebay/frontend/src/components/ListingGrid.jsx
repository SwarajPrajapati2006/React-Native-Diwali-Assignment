import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { ListingCard } from './ListingCard';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export const ListingGrid = ({
  listings = [],
  favorites = [],
  onToggleFavorite,
  onPressListing,
  refreshing = false,
  onRefresh,
  loading = false,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 3 : 2;

  const renderItem = ({ item }) => {
    const isFav = favorites.includes(item._id);
    return (
      <View style={[styles.columnWrapper, { flex: 1 / numColumns }]}>
        <ListingCard
          listing={item}
          isFavorite={isFav}
          onToggleFavorite={onToggleFavorite}
          onPress={onPressListing}
        />
      </View>
    );
  };

  if (loading && listings.length === 0) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={colors.sage} />
        <Text style={styles.loadingText}>Finding best campus deals...</Text>
      </View>
    );
  }

  return (
    <FlatList
      key={`grid-${numColumns}`}
      data={listings}
      keyExtractor={(item) => item._id || String(item.id)}
      numColumns={numColumns}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.sage}
            colors={[colors.sage]}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 40,
  },
  columnWrapper: {
    paddingHorizontal: 6,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    marginTop: 12,
  },
});
