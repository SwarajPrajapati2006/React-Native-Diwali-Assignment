import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useListings } from '../hooks/useListings';
import { useFavorites } from '../../favorites/hooks/useFavorites';
import { useClipboard } from '../../4.Clipboard/useClipboard';
import { useNotifications } from '../../6.Notifications/useNotifications';

import { Header } from '../../../components/Header';
import { SearchBar } from '../../../components/SearchBar';
import { FilterChips } from '../../../components/FilterChips';
import { ListingGrid } from '../../../components/ListingGrid';
import { SortSheet } from '../../../components/SortSheet';
import { DonationInfoSheet } from '../../../components/DonationInfoSheet';
import { ClipboardBanner } from '../../4.Clipboard/ClipboardBanner';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

export const HomeScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.initialCategory || 'All'
  );
  const [selectedType, setSelectedType] = useState(
    route.params?.initialType || null
  );
  const [sort, setSort] = useState('newest');
  const [sortVisible, setSortVisible] = useState(false);
  const [donationInfoVisible, setDonationInfoVisible] = useState(false);

  // Apply category/type shortcuts coming from the drawer even if Home is already mounted
  useEffect(() => {
    if (route.params?.initialCategory != null) {
      setSelectedCategory(route.params.initialCategory);
    }
  }, [route.params?.initialCategory]);

  useEffect(() => {
    if (route.params?.initialType != null) {
      setSelectedType(route.params.initialType);
    }
  }, [route.params?.initialType]);

  const { copiedLink, clearCopiedLink } = useClipboard();

  // Debounce search input — waits 400ms after the user stops typing before
  // firing the API query, preventing a network request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    listings,
    isLoading,
    isRefetching,
    refetch,
    categories,
  } = useListings({
    q: debouncedSearch || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    type: selectedType || undefined,
    sort,
  });

  const { favoriteIds, toggleFavorite } = useFavorites();
  const { unreadCount } = useNotifications();


  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <OfflineBanner />

      {/* App Header with Logo & Drawer Menu */}
      <Header showLogo={true} unreadCount={unreadCount}/>

      {/* Floating Clipboard Auto-Detect Banner */}
      {copiedLink && (
        <ClipboardBanner
          copiedLink={copiedLink}
          onDismiss={clearCopiedLink}
        />
      )}

      {/* Main Grid with Header Components */}
      <ListingGrid
        listings={listings}
        favorites={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onPressListing={(item) =>
          navigation.navigate('ListingDetail', { id: item._id })
        }
        loading={isLoading}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            {/* Search Input Bar with Paste feature */}
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onClear={() => setSearch('')}
              placeholder="Search textbooks, calculators, furniture..."
            />

            {/* Filter Pills */}
            <FilterChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />

            {/* Heading + Coral Star Donation Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.sectionHeading}>Recent Posts</Text>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => setSortVisible(true)}
                >
                  <Ionicons name="swap-vertical" size={16} color={colors.sage} />
                  <Text style={styles.sortButtonText}>Sort</Text>
                </TouchableOpacity>
              </View>

              {/* Coral Star Banner */}
              <TouchableOpacity
                style={styles.donationLegend}
                onPress={() => setDonationInfoVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.starCircle}>
                  <Ionicons name="star" size={14} color={colors.coral} />
                </View>
                <Text style={styles.legendText}>
                  All proceeds of flagged items are pledged to student organizations.{' '}
                  <Text style={styles.legendLink}>Tap to read more.</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Listings Found"
            subtitle="Try clearing search filters or be the first to post an item!"
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setDebouncedSearch('');
              setSelectedCategory('All');
              setSelectedType(null);
            }}
          />
        }
      />

      {/* Sort Options Bottom Sheet */}
      <SortSheet
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        selectedSort={sort}
        onSelectSort={setSort}
      />

      {/* Donation Cause Info Modal */}
      <DonationInfoSheet
        visible={donationInfoVisible}
        onClose={() => setDonationInfoVisible(false)}
      />

      {/* Floating Action Button (FAB) to Post/Sell an Item */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateListing')}
        activeOpacity={0.85}
        accessibilityLabel="Post a new item"
      >
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>Sell</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBlock: {
    marginBottom: 8,
  },
  legendContainer: {
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 22,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.5,
  },
  sortButton: {
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
  sortButtonText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  donationLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 58, 63, 0.1)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 58, 63, 0.25)',
  },
  starCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(217, 58, 63, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.body,
    lineHeight: 16,
    flex: 1,
  },
  legendLink: {
    color: colors.coral,
    fontFamily: fonts.bodyMedium,
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    gap: 6,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 99,
  },
  fabText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 15,
  },
});
