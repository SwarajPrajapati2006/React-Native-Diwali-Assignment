import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDashboard } from '../hooks/useDashboard';
import { useFileSystem } from '../../9.FileSystem/useFileSystem';
import { Header } from '../../../components/Header';
import { StatusBadge } from '../../../components/StatusBadge';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

export const DashboardScreen = ({ navigation }) => {
  const {
    stats,
    recentListings,
    recentEnquiries,
    isLoading,
    isRefetching,
    refetch,
    updateStatus,
    deleteListing,
  } = useDashboard();

  const { exportSalesReport, isExporting } = useFileSystem();

  const [dialog, setDialog] = useState(null);

  const handleStatusChange = (id, currentStatus) => {
    const nextStatus =
      currentStatus === 'Available'
        ? 'Reserved'
        : currentStatus === 'Reserved'
        ? 'Sold'
        : 'Available';

    setDialog({
      title: 'Change Item Status',
      message: `Change status from ${currentStatus} to ${nextStatus}?`,
      confirmLabel: `Mark as ${nextStatus}`,
      onConfirm: async () => {
        await updateStatus({ id, status: nextStatus });
      },
    });
  };

  const handleDelete = (id, title) => {
    setDialog({
      title: 'Delete Listing',
      message: `Are you sure you want to remove "${title}"?`,
      confirmLabel: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        await deleteListing(id);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Seller Dashboard" showSearch={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.salesCard}>
          <View>
            <Text style={styles.salesLabel}>Total Earnings</Text>
            <Text style={styles.salesAmount}>
              ₹{stats?.totalEarnings ?? stats?.totalSales ?? 0}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnCsvExport}
            onPress={exportSalesReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="share-social-outline" size={16} color={colors.white} />
                <Text style={styles.btnCsvExportText}>Export CSV</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.totalListings || 0}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.activeListings || 0}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.totalEnquiries || 0}</Text>
            <Text style={styles.statLabel}>Enquiries</Text>
          </View>
        </View>

        <Text style={[styles.sectionHeading, { marginTop: 24, marginBottom: 12 }]}>
          My Listings
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : recentListings.length === 0 ? (
          <Text style={styles.emptyNotice}>No listings yet. Post your first item!</Text>
        ) : (
          recentListings.map((item) => (
            <View key={item._id} style={styles.listingCard}>
              <Image
                source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80' }}
                style={styles.listingThumb}
              />
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.listingPrice}>₹{item.price}</Text>
                <StatusBadge status={item.status} />
              </View>
              <View style={styles.listingActions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleStatusChange(item._id, item.status)}
                >
                  <Ionicons name="sync-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleDelete(item._id, item.title)}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.coral} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={[styles.sectionHeading, { marginTop: 24, marginBottom: 12 }]}>
          Recent Incoming Enquiries
        </Text>

        {recentEnquiries.length === 0 ? (
          <Text style={styles.emptyNotice}>No pending buyer enquiries.</Text>
        ) : (
          recentEnquiries.map((enq) => (
            <TouchableOpacity
              key={enq._id}
              style={styles.enquiryCard}
              onPress={() =>
                navigation.navigate('EnquiryDetail', { enquiryId: enq._id })
              }
            >
              <View style={styles.enquiryTop}>
                <Text style={styles.buyerName}>{enq.buyer?.name || 'Classmate'}</Text>
                <Text style={styles.enquiryStatus}>{enq.status}</Text>
              </View>
              <Text style={styles.enquiryMessage} numberOfLines={2}>
                "{enq.message}"
              </Text>
              {enq.offerPrice && (
                <Text style={styles.offerBadge}>Offer: ₹{enq.offerPrice}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ConfirmDialog
        visible={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        isDestructive={dialog?.isDestructive}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          const run = dialog?.onConfirm;
          setDialog(null);
          if (run) run();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  salesCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  salesLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  salesAmount: {
    color: colors.primary,
    fontSize: 26,
    fontFamily: fonts.headingBold,
    marginTop: 2,
  },
  btnCsvExport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnCsvExportText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: fonts.headingBold,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.heading,
  },
  emptyNotice: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    paddingVertical: 12,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  listingThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.mintSoft,
  },
  listingInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  listingTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: fonts.headingMedium,
  },
  listingPrice: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
  },
  listingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  enquiryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  enquiryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  buyerName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: fonts.headingMedium,
  },
  enquiryStatus: {
    color: colors.pending,
    fontSize: 12,
    fontFamily: fonts.heading,
    textTransform: 'capitalize',
  },
  enquiryMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 20,
  },
  offerBadge: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    marginTop: 8,
  },
});