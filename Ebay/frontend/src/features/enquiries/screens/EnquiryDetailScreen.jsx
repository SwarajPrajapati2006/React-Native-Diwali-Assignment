import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { enquiriesApi } from '../api/enquiriesApi';
import { useAuthStore } from '../../../store/authStore';
import { useClipboard } from '../../4.Clipboard/useClipboard';
import { Header } from '../../../components/Header';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

export const EnquiryDetailScreen = ({ route, navigation }) => {
  const { enquiryId } = route?.params || {};
  const { user: currentUser } = useAuthStore();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerNote, setSellerNote] = useState('');
  const [reserveListing, setReserveListing] = useState(true);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { copyText } = useClipboard();

  useEffect(() => {
    fetchEnquiry();
  }, [enquiryId]);

  const fetchEnquiry = async () => {
    setLoading(true);
    try {
      const data = await enquiriesApi.getEnquiryById(enquiryId);
      setEnquiry(data);
    } catch (e) {
      console.error('Fetch enquiry detail error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (status) => {
    setIsSubmitting(true);
    try {
      await enquiriesApi.respondEnquiry(enquiryId, {
        status,
        sellerNote: sellerNote.trim(),
        reserveListing: status === 'Accepted' ? reserveListing : false,
      });
      setIsSubmitting(false);
      Alert.alert(
        `Offer ${status}`,
        `You have ${status.toLowerCase()} this enquiry.${status === 'Accepted' && reserveListing ? ' Listing status updated to Reserved.' : ''}`
      );
      fetchEnquiry();
    } catch (e) {
      setIsSubmitting(false);
      Alert.alert('Error', e.response?.data?.error || 'Could not update status');
    }
  };

  const handleWithdraw = () => setWithdrawVisible(true);

  const confirmWithdraw = async () => {
    setWithdrawVisible(false);
    await enquiriesApi.withdrawEnquiry(enquiryId);
    fetchEnquiry();
  };

  if (loading || !enquiry) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.sage} />
      </View>
    );
  }

  const currentUserId = String(currentUser?._id || currentUser?.id || '');
  const sellerId = String(enquiry.seller?._id || enquiry.seller || '');
  const buyerId = String(enquiry.buyer?._id || enquiry.buyer || '');
  const isSeller = Boolean(currentUserId && sellerId === currentUserId);
  const isBuyer = Boolean(currentUserId && buyerId === currentUserId);

  return (
    <View style={styles.container}>
      <Header title="Offer Details" showSearch={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Linked Listing Card */}
        {enquiry.listing && (
          <TouchableOpacity
            style={styles.listingCard}
            onPress={() => navigation.navigate('ListingDetail', { id: enquiry.listing._id })}
          >
            <Image
              source={{ uri: enquiry.listing.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' }}
              style={styles.listingThumb}
            />
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle} numberOfLines={1}>
                {enquiry.listing.title}
              </Text>
              <Text style={styles.listingPrice}>Listed: ₹{enquiry.listing.price}</Text>
              <Text style={styles.tapToView}>Tap to view listing →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Enquiry Status Overview */}
        <View style={styles.statusBox}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>Offer Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{enquiry.status}</Text>
            </View>
          </View>

          {enquiry.offerPrice && (
            <View style={styles.offerRow}>
              <Text style={styles.offerLabel}>Buyer Proposed Price:</Text>
              <Text style={styles.offerValue}>₹{enquiry.offerPrice}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.copyRefBtn}
            onPress={() => copyText(enquiry._id, 'Enquiry Reference ID copied!')}
          >
            <Ionicons name="copy-outline" size={14} color={colors.sage} />
            <Text style={styles.copyRefText}>Copy Ref: #{enquiry._id.slice(-6)}</Text>
          </TouchableOpacity>
        </View>

        {/* Message Thread */}
        <View style={styles.messageBox}>
          <Text style={styles.senderTitle}>
            From: {enquiry.buyer?.name} ({enquiry.buyer?.college})
          </Text>
          <Text style={styles.messageBody}>{enquiry.message}</Text>
          <Text style={styles.timestamp}>
            Sent on {new Date(enquiry.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Seller Response Note if present */}
        {enquiry.sellerNote && (
          <View style={styles.sellerNoteBox}>
            <Text style={styles.sellerNoteTitle}>Seller's Reply Note:</Text>
            <Text style={styles.sellerNoteText}>{enquiry.sellerNote}</Text>
          </View>
        )}

        {/* Seller Response Controls */}
        {isSeller && enquiry.status === 'Pending' && (
          <View style={styles.responseContainer}>
            <Text style={styles.respondHeading}>Respond to Buyer Offer</Text>

            <TextInput
              style={styles.noteInput}
              placeholder="Add optional note (e.g. Yes! Can meet tomorrow at 4 PM library)"
              placeholderTextColor={colors.textMuted}
              value={sellerNote}
              onChangeText={setSellerNote}
            />

            <View style={styles.reserveToggleRow}>
              <View style={styles.reserveTextCol}>
                <Text style={styles.reserveTitle}>Reserve Listing on Accept</Text>
                <Text style={styles.reserveSubtitle}>
                  Sets item status to 'Reserved' so other buyers see it is held.
                </Text>
              </View>
              <Switch
                value={reserveListing}
                onValueChange={setReserveListing}
                thumbColor={reserveListing ? colors.sage : colors.textMuted}
                trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
              />
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.btnAction, styles.btnReject]}
                onPress={() => handleRespond('Rejected')}
                disabled={isSubmitting}
              >
                <Text style={styles.btnRejectText}>Decline Offer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnAction, styles.btnAccept]}
                onPress={() => handleRespond('Accepted')}
                disabled={isSubmitting}
              >
                <Text style={styles.btnAcceptText}>Accept Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Buyer Withdraw Control */}
        {isBuyer && enquiry.status === 'Pending' && (
          <TouchableOpacity style={styles.btnWithdraw} onPress={handleWithdraw}>
            <Ionicons name="close-circle-outline" size={18} color={colors.coral} />
            <Text style={styles.btnWithdrawText}>Withdraw My Offer</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={withdrawVisible}
        title="Withdraw Enquiry"
        message="Do you want to cancel this offer?"
        confirmLabel="Withdraw"
        cancelLabel="No"
        isDestructive
        onCancel={() => setWithdrawVisible(false)}
        onConfirm={confirmWithdraw}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
    alignItems: 'center',
  },
  listingThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    marginBottom: 4,
  },
  listingPrice: {
    color: colors.sage,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
  tapToView: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  statusBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
  },
  statusBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
    fontSize: 12,
  },
  offerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  offerLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  offerValue: {
    color: colors.ebayYellow,
    fontSize: 18,
    fontFamily: fonts.headingBold,
  },
  copyRefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  copyRefText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.heading,
  },
  messageBox: {
    backgroundColor: colors.surfaceRaised,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  senderTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    marginBottom: 8,
  },
  messageBody: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
  },
  sellerNoteBox: {
    backgroundColor: colors.primarySoft,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.sage,
    marginBottom: 16,
  },
  sellerNoteTitle: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
    fontSize: 13,
    marginBottom: 4,
  },
  sellerNoteText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 20,
  },
  responseContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginTop: 8,
  },
  respondHeading: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  reserveToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reserveTextCol: {
    flex: 1,
    marginRight: 10,
  },
  reserveTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  reserveSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnAction: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnReject: {
    backgroundColor: 'rgba(217, 58, 63, 0.12)',
    borderWidth: 1,
    borderColor: colors.ebayRed,
  },
  btnRejectText: {
    color: colors.ebayRed,
    fontFamily: fonts.headingBold,
  },
  btnAccept: {
    backgroundColor: colors.sage,
  },
  btnAcceptText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
  },
  btnWithdraw: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.coral,
    backgroundColor: 'rgba(217, 58, 63, 0.1)',
    gap: 8,
    marginTop: 8,
  },
  btnWithdrawText: {
    color: colors.coral,
    fontFamily: fonts.headingBold,
  },
});