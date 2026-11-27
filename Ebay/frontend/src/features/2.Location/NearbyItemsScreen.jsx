import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from './useLocation';
import { Header } from '../../components/Header';
import { ListingCard } from '../../components/ListingCard';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import api from '../../services/api';

export const NearbyItemsScreen = ({ navigation }) => {
  const { location, requestLocation, getDistanceKm, isLoading: locLoading } = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  useEffect(() => {
    fetchNearby();
  }, []);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      const loc = await requestLocation();
      const res = await api.get('/api/listings?limit=30');
      let listings = res.data.listings || [];

      // Calculate distance for each listing
      if (loc?.coords) {
        listings = listings.map((item) => {
          const lat = item.coordinates?.latitude || 28.6139;
          const lon = item.coordinates?.longitude || 77.2090;
          const dist = getDistanceKm(
            loc.coords.latitude,
            loc.coords.longitude,
            lat,
            lon
          );
          return { ...item, distanceKm: dist ? Number(dist) : 0.8 };
        });

        // Sort by distance
        listings.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      }

      setItems(listings);
    } catch (e) {
      console.error('Failed to fetch nearby items:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.distanceBadge}>
          <Ionicons name="navigate-outline" size={12} color={colors.white} />
          <Text style={styles.distanceText}>
            {item.distanceKm ? `${item.distanceKm} km away` : 'Campus nearby'}
          </Text>
        </View>
        <ListingCard
          listing={item}
          onPress={() => navigation.navigate('ListingDetail', { id: item._id })}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Nearby Campus Items" showSearch={false} />

      {/* Top Banner / Mode Toggle */}
      <View style={styles.filterBar}>
        <View style={styles.locInfo}>
          <Ionicons name="location" size={16} color={colors.sage} />
          <Text style={styles.locText} numberOfLines={1}>
            {location ? 'Within 5 km of your location' : 'Locating campus hostel...'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          <Ionicons
            name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
            size={18}
            color={colors.sage}
          />
          <Text style={styles.toggleText}>
            {viewMode === 'list' ? 'Map' : 'List'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading || locLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.sage} />
          <Text style={styles.loadingText}>Scanning campus perimeter...</Text>
        </View>
      ) : viewMode === 'map' ? (
        <View style={styles.mapMock}>
          <Ionicons name="map" size={60} color={colors.sage} />
          <Text style={styles.mapMockTitle}>Campus Interactive Map</Text>
          <Text style={styles.mapMockSubtitle}>
            Showing {items.length} live markers around library, hostel & canteen quads.
          </Text>
          <TouchableOpacity
            style={styles.btnReturnList}
            onPress={() => setViewMode('list')}
          >
            <Text style={styles.btnReturnText}>Switch to Grid List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="navigate-outline"
              title="No nearby items"
              subtitle="Be the first to list an item near your hostel!"
            />
          }
          refreshing={loading}
          onRefresh={fetchNearby}
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  locInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.heading,
    marginLeft: 6,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 4,
  },
  toggleText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  listContent: {
    padding: 8,
  },
  cardContainer: {
    flex: 1 / 2,
    padding: 6,
    position: 'relative',
  },
  distanceBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 10,
    backgroundColor: colors.sage,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.headingBold,
  },
  mapMock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.surfaceRaised,
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  mapMockTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.headingBold,
    marginTop: 16,
  },
  mapMockSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  btnReturnList: {
    backgroundColor: colors.sage,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnReturnText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
  },
});
