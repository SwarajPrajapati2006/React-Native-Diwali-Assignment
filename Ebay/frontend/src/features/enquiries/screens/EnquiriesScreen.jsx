import React, { useState } from 'react';
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
import { useEnquiries } from '../hooks/useEnquiries';
import { Header } from '../../../components/Header';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

export const EnquiriesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const { enquiries, isLoading, isRefetching, refetch } = useEnquiries(activeTab);

  const renderItem = ({ item }) => {
    const otherUser = activeTab === 'received' ? item.buyer : item.seller;
    const isOffer = item.offerPrice !== undefined && item.offerPrice !== null;

    let statusBg = colors.primarySoft;
    let statusColor = colors.sage;

    if (item.status === 'Accepted') {
      statusBg = 'rgba(22, 163, 74, 0.12)';
      statusColor = colors.available;
    } else if (item.status === 'Rejected') {
      statusBg = 'rgba(217, 58, 63, 0.12)';
      statusColor = colors.sold;
    } else if (item.status === 'Pending') {
      statusBg = 'rgba(245, 158, 11, 0.15)';
      statusColor = colors.reserved;
    }

    const listingImage =
      item.listing?.images?.[0] ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: item._id })}
      >
        <Image source={{ uri: listingImage }} style={styles.thumb} />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.listingTitle} numberOfLines={1}>
              {item.listing?.title || 'Campus Item'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={styles.personText}>
            {activeTab === 'received' ? 'From: ' : 'To: '}
            <Text style={styles.personName}>{otherUser?.name || 'Classmate'}</Text>
          </Text>

          <Text style={styles.message} numberOfLines={2}>
            "{item.message}"
          </Text>

          <View style={styles.bottomRow}>
            {isOffer && (
              <View style={styles.offerPill}>
                <Text style={styles.offerPillText}>Offered: ₹{item.offerPrice}</Text>
              </View>
            )}
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Messages & Offers" showSearch={false} />

      {/* Received | Sent Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.tabActive]}
          onPress={() => setActiveTab('received')}
        >
          <Ionicons
            name="arrow-down-circle-outline"
            size={18}
            color={activeTab === 'received' ? colors.sage : colors.textSecondary}
          />
          <Text
            style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}
          >
            Received Enquiries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.tabActive]}
          onPress={() => setActiveTab('sent')}
        >
          <Ionicons
            name="arrow-up-circle-outline"
            size={18}
            color={activeTab === 'sent' ? colors.sage : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'sent' && styles.tabTextActive]}>
            Sent Offers
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && enquiries.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.sage} />
        </View>
      ) : (
        <FlatList
          data={enquiries}
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
              icon="chatbubbles-outline"
              title={activeTab === 'received' ? 'No Enquiries Received' : 'No Sent Offers'}
              subtitle={
                activeTab === 'received'
                  ? 'When students express interest or make offers on your items, they will appear here.'
                  : 'You have not enquired about any campus items yet.'
              }
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
  tabsContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceRaised,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
  tabTextActive: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
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
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listingTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    flex: 1,
    marginRight: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
  },
  personText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
    marginBottom: 4,
  },
  personName: {
    color: colors.textSecondary,
    fontFamily: fonts.headingBold,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 17,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  offerPillText: {
    color: colors.ebayYellow,
    fontSize: 11,
    fontFamily: fonts.headingBold,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.body,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
