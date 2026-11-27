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
  Modal,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listingsApi } from '../api/listingsApi';
import { useShare } from '../../5.Share/useShare';
import { useClipboard } from '../../4.Clipboard/useClipboard';
import { useContacts } from '../../3.Contacts/useContacts';
import { useFavorites } from '../../favorites/hooks/useFavorites';
import { useAuthStore } from '../../../store/authStore';
import { StatusBadge } from '../../../components/StatusBadge';
import { DonationStar } from '../../../components/DonationStar';
import { DonationInfoSheet } from '../../../components/DonationInfoSheet';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import api from '../../../services/api';

export const ListingDetailScreen = ({ route, navigation }) => {
  const { id } = route?.params || {};
  const { width } = useWindowDimensions();
  const { user: currentUser } = useAuthStore();

  const [listing, setListing] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [donationInfoVisible, setDonationInfoVisible] = useState(false);

  // Enquiry modal state
  const [enquiryModalVisible, setEnquiryModalVisible] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  const { shareListing } = useShare();
  const { copyText } = useClipboard();
  const { saveSellerToContacts } = useContacts();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await listingsApi.getListingById(id);
      setListing(data);
      const sim = await listingsApi.getSimilarListings(id);
      setSimilar(sim || []);
    } catch (e) {
      console.error('Error fetching detail:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    copyText(`campusmarket://listing/${id}`, 'Listing link copied to clipboard!');
  };

  const handleSaveContact = () => {
    if (listing?.seller) {
      saveSellerToContacts(listing.seller);
    }
  };

  const handleSendEnquiry = async () => {
    if (!enquiryMessage.trim()) {
      Alert.alert('Required', 'Please write a message to the seller.');
      return;
    }

    setSubmittingEnquiry(true);
    try {
      await api.post('/api/enquiries', {
        listingId: id,
        message: enquiryMessage.trim(),
        offerPrice: offerPrice ? Number(offerPrice) : undefined,
      });

      setSubmittingEnquiry(false);
      setEnquiryModalVisible(false);
      setEnquiryMessage('');
      setOfferPrice('');
      Alert.alert('Enquiry Sent!', 'The seller has been notified of your message.');
    } catch (e) {
      setSubmittingEnquiry(false);
      Alert.alert('Error', e.response?.data?.error || 'Could not send enquiry');
    }
  };

  if (loading || !listing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.sage} />
      </View>
    );
  }

  const isOwnListing = currentUser && listing.seller?._id === currentUser._id;
  const isFav = isFavorite(listing._id);

  const images = listing.images?.length > 0 ? listing.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'];

  return (
    <View style={styles.container}>
      {/* Top Floating Navigation */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.rightHeaderActions}>
          <TouchableOpacity style={styles.circleBtn} onPress={handleCopyLink}>
            <Ionicons name="link-outline" size={20} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn} onPress={() => shareListing(listing)}>
            <Ionicons name="share-social-outline" size={20} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => toggleFavorite(listing)}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isFav ? colors.coral : colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
          >
            {images.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={[styles.carouselImage, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeImageIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}

          {/* Coral Star if Donation */}
          {listing.isDonation && (
            <View style={styles.starFloating}>
              <DonationStar onPress={() => setDonationInfoVisible(true)} size={22} />
            </View>
          )}
        </View>

        {/* Details Section */}
        <View style={styles.bodySection}>
          <View style={styles.statusPriceRow}>
            <StatusBadge status={listing.status} />
            <Text style={styles.priceTag}>
              {listing.type === 'Free'
                ? 'FREE'
                : listing.type === 'Exchange'
                ? 'FOR EXCHANGE'
                : `₹${listing.price?.toLocaleString?.() || listing.price}`}
            </Text>
          </View>

          <Text style={styles.title}>{listing.title}</Text>

          <View style={styles.chipsRow}>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Condition: {listing.condition}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Category: {listing.category}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Type: {listing.type}</Text>
            </View>
          </View>

          {listing.type === 'Exchange' && listing.exchangeFor && (
            <View style={styles.exchangeBox}>
              <Text style={styles.exchangeLabel}>Wants in Exchange:</Text>
              <Text style={styles.exchangeText}>{listing.exchangeFor}</Text>
            </View>
          )}

          {/* Pickup Location */}
          <View style={styles.pickupCard}>
            <Ionicons name="location" size={20} color={colors.sage} />
            <View style={styles.pickupTextCol}>
              <Text style={styles.pickupTitle}>Campus Pickup Location</Text>
              <Text style={styles.pickupAddress}>
                {listing.pickupLocation || 'Main Campus Center'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.subHeading}>Item Description</Text>
          <Text style={styles.descriptionText}>{listing.description}</Text>

          {/* Seller Card */}
          {listing.seller && (
            <View style={styles.sellerCard}>
              <TouchableOpacity
                style={styles.sellerTop}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('SellerProfile', { sellerId: listing.seller._id })}
              >
                <Image
                  source={{ uri: listing.seller.avatar }}
                  style={styles.sellerAvatar}
                />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{listing.seller.name}</Text>
                  <Text style={styles.sellerCollege}>{listing.seller.college}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={colors.ebayYellow} />
                    <Text style={styles.ratingText}>
                      {listing.seller.rating || '4.9'} Student Trust Rating
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSaveContact}
                onPress={handleSaveContact}
              >
                <Ionicons name="person-add-outline" size={16} color={colors.sage} />
                <Text style={styles.btnSaveContactText}>Save Seller to Contacts</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Similar Items Carousel */}
          {similar.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={styles.subHeading}>Similar Campus Deals</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similar.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.similarCard}
                    onPress={() => navigation.push('ListingDetail', { id: item._id })}
                  >
                    <Image
                      source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' }}
                      style={styles.similarImage}
                    />
                    <Text style={styles.similarTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.similarPrice}>₹{item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {isOwnListing ? (
          <TouchableOpacity
            style={styles.btnAction}
            onPress={() => navigation.navigate('CreateListing', { editListing: listing })}
          >
            <Text style={styles.btnActionText}>Edit Your Listing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btnAction,
              listing.status !== 'Available' && styles.btnActionDisabled,
            ]}
            onPress={() => setEnquiryModalVisible(true)}
            disabled={listing.status !== 'Available'}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.white} />
            <Text style={styles.btnActionText}>
              {listing.status === 'Available' ? 'Make Offer / Enquire' : 'Item Reserved or Sold'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Enquiry & Offer Modal */}
      <Modal
        visible={enquiryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEnquiryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Seller</Text>
              <TouchableOpacity onPress={() => setEnquiryModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalPrompt}>
              Item: {listing.title} (Listed at ₹{listing.price})
            </Text>

            <Text style={styles.inputLabel}>Offer Price (Optional):</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`₹ e.g. ${Math.round(listing.price * 0.9)}`}
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={offerPrice}
              onChangeText={setOfferPrice}
            />

            <Text style={styles.inputLabel}>Message to Seller:</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Hi! Is this still available? Can we meet at the library quad?"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={enquiryMessage}
              onChangeText={setEnquiryMessage}
            />

            <TouchableOpacity
              style={styles.btnSendEnquiry}
              onPress={handleSendEnquiry}
              disabled={submittingEnquiry}
            >
              {submittingEnquiry ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.btnSendEnquiryText}>Send Offer to Seller</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DonationInfoSheet
        visible={donationInfoVisible}
        onClose={() => setDonationInfoVisible(false)}
        cause={listing.donationCause}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHeader: {
    position: 'absolute',
    top: 44,
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    position: 'relative',
    height: 340,
    backgroundColor: colors.surfaceRaised,
  },
  carouselImage: {
    height: 340,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.sage,
  },
  starFloating: {
    position: 'absolute',
    bottom: 12,
    left: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bodySection: {
    padding: 16,
  },
  statusPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceTag: {
    color: colors.sage,
    fontSize: 24,
    fontFamily: fonts.headingBold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: fonts.headingBold,
    lineHeight: 26,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaChip: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  metaChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
  exchangeBox: {
    backgroundColor: 'rgba(0, 100, 210, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.ebayBlue,
    marginBottom: 16,
  },
  exchangeLabel: {
    color: colors.ebayBlue,
    fontSize: 12,
    fontFamily: fonts.headingBold,
    marginBottom: 4,
  },
  exchangeText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  pickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  pickupTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  pickupTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
  },
  pickupAddress: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
    marginTop: 2,
  },
  subHeading: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 8,
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 22,
    marginBottom: 24,
  },
  sellerCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  sellerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: fonts.headingBold,
  },
  sellerCollege: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    color: colors.ebayYellow,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  btnSaveContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.sage,
    gap: 6,
  },
  btnSaveContactText: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
    fontSize: 13,
  },
  similarSection: {
    marginTop: 10,
  },
  similarCard: {
    width: 130,
    marginRight: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  similarImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 6,
  },
  similarTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: fonts.headingMedium,
  },
  similarPrice: {
    color: colors.sage,
    fontSize: 13,
    fontFamily: fonts.headingBold,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  btnAction: {
    backgroundColor: colors.sage,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnActionDisabled: {
    opacity: 0.5,
  },
  btnActionText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.headingBold,
  },
  modalPrompt: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.headingBold,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  modalTextarea: {
    height: 90,
    textAlignVertical: 'top',
  },
  btnSendEnquiry: {
    backgroundColor: colors.sage,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnSendEnquiryText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 15,
  },
});
