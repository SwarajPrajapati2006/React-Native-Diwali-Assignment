import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCamera } from '../../1.Camera/useCamera';
import { useLocation } from '../../2.Location/useLocation';
import { useFileSystem } from '../../9.FileSystem/useFileSystem';
import { listingsApi } from '../api/listingsApi';
// import { Header } from '../../../components/Header';
// import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import { Header } from '../../../components/Header';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { colors } from '../../../theme/colors';

export const CreateEditListingScreen = ({ navigation, route }) => {
  const editListing = route.params?.editListing;
  const draftData = route.params?.draft;

  const [title, setTitle] = useState(editListing?.title || draftData?.title || '');
  const [description, setDescription] = useState(
    editListing?.description || draftData?.description || ''
  );
  const [price, setPrice] = useState(
    editListing?.price !== undefined ? String(editListing.price) : draftData?.price || ''
  );
  const [category, setCategory] = useState(
    editListing?.category || draftData?.category || 'Books'
  );
  const [type, setType] = useState(
    editListing?.type || draftData?.type || 'For Sale'
  );
  const [exchangeFor, setExchangeFor] = useState(
    editListing?.exchangeFor || draftData?.exchangeFor || ''
  );
  const [condition, setCondition] = useState(
    editListing?.condition || draftData?.condition || 'Good'
  );
  const [images, setImages] = useState(
    editListing?.images || draftData?.images || []
  );
  const [pickupLocation, setPickupLocation] = useState(
    editListing?.pickupLocation || draftData?.pickupLocation || 'Student Center / Library'
  );
  const [isDonation, setIsDonation] = useState(
    editListing?.isDonation ?? draftData?.isDonation ?? false
  );
  const [donationCause, setDonationCause] = useState(
    editListing?.donationCause || draftData?.donationCause || ''
  );

   const [isSubmitting, setIsSubmitting] = useState(false);
  const [barcodeVisible, setBarcodeVisible] = useState(false);

  const { pickImagesFromGallery, uploadImage, isUploading, uploadProgress } = useCamera();
  const { requestLocation, isLoading: locLoading } = useLocation();
  const { saveDraftToFile } = useFileSystem();

  const categories = ['Books', 'Electronics', 'Furniture', 'Stationery', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const types = ['For Sale', 'Free', 'Exchange'];

  // Auto-save draft every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (title.trim().length > 2) {
        saveDraftToFile({
          title,
          description,
          price,
          category,
          type,
          exchangeFor,
          condition,
          images,
          pickupLocation,
          isDonation,
          donationCause,
        });
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [title, description, price, category, type, exchangeFor, condition, images, pickupLocation, isDonation, donationCause]);

  const handlePickPhotos = async () => {
    const uris = await pickImagesFromGallery(5 - images.length);
    if (uris && uris.length > 0) {
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const handleCameraCapture = () => {
    navigation.navigate('CameraModal', {
      onPhotoTaken: (photoUri) => {
        setImages((prev) => [...prev, photoUri]);
      },
    });
  };

  const handleUseCurrentLocation = async () => {
    const loc = await requestLocation();
    if (loc?.address) {
      setPickupLocation(loc.address);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Barcode / ISBN scan demo prefill
   // Barcode / ISBN scan demo prefill
  const handleBarcodeScan = () => setBarcodeVisible(true);

  const confirmBarcodePrefill = () => {
    setBarcodeVisible(false);
    setTitle('Introduction to Algorithms (CLRS 4th Edition)');
    setCategory('Books');
    setDescription('Standard computer science textbook for data structures & algorithms.');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title for your item.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter an item description.');
      return;
    }
    if (type === 'For Sale' && (!price || Number(price) <= 0)) {
      Alert.alert('Price Required', 'Please set a price greater than 0 for items for sale.');
      return;
    }
    if (type === 'Exchange' && !exchangeFor.trim()) {
      Alert.alert('Exchange Details', 'Please specify what item you want in exchange.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload any local images
      const uploadedUrls = [];
      for (const img of images) {
        if (img.startsWith('http')) {
          uploadedUrls.push(img);
        } else {
          const remote = await uploadImage(img);
          uploadedUrls.push(remote);
        }
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: type === 'Free' ? 0 : Number(price || 0),
        category,
        type,
        exchangeFor: type === 'Exchange' ? exchangeFor.trim() : '',
        condition,
        images: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        pickupLocation: pickupLocation.trim(),
        isDonation,
        donationCause: isDonation ? donationCause.trim() : '',
      };

      if (editListing) {
        await listingsApi.updateListing(editListing._id, payload);
        Alert.alert('Updated', 'Your listing was updated successfully.');
      } else {
        await listingsApi.createListing(payload);
        Alert.alert('Listing Live!', 'Your item is now visible to all campus buyers.');
      }

      setIsSubmitting(false);
      navigation.goBack();
    } catch (e) {
      console.error('Submit listing error:', e);
      setIsSubmitting(false);
      Alert.alert('Error', e.response?.data?.error || 'Failed to submit listing');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title={editListing ? 'Edit Listing' : 'List Item for Sale'}
        showSearch={false}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Photo Upload Section */}
        <Text style={styles.sectionTitle}>Item Photos (Max 5)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.photosRow}>
          {images.map((img, index) => (
            <View key={index} style={styles.thumbWrapper}>
              <Image source={{ uri: img }} style={styles.thumbImage} />
              <TouchableOpacity
                style={styles.removeThumbBtn}
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="close" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 5 && (
            <View style={styles.addButtonsCol}>
              <TouchableOpacity style={styles.addPhotoCard} onPress={handleCameraCapture}>
                <Ionicons name="camera-outline" size={24} color={colors.sage} />
                <Text style={styles.addPhotoText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addPhotoCard} onPress={handlePickPhotos}>
                <Ionicons name="images-outline" size={24} color={colors.ebayBlue} />
                <Text style={styles.addPhotoText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {isUploading && (
          <View style={styles.progressContainer}>
            <ActivityIndicator color={colors.sage} />
            <Text style={styles.progressText}>
              Compressing & Uploading: {uploadProgress}%
            </Text>
          </View>
        )}

        {/* Barcode Prefill Button */}
        <TouchableOpacity style={styles.barcodeBtn} onPress={handleBarcodeScan}>
          <Ionicons name="barcode-outline" size={20} color={colors.ebayYellow} />
          <Text style={styles.barcodeText}>Scan Book Barcode / ISBN to Prefill</Text>
        </TouchableOpacity>

        {/* Listing Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Drafter, MacBook Air, CASIO Calc"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        {/* Category Pills */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pillRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.pill, category === c && styles.pillActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.pillText, category === c && styles.pillTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Listing Type: For Sale / Free / Exchange */}
        <Text style={styles.label}>Listing Type</Text>
        <View style={styles.pillRow}>
          {types.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.pill, type === t && styles.pillActive]}
              onPress={() => {
                setType(t);
                if (t === 'Free') setPrice('0');
              }}
            >
              <Text style={[styles.pillText, type === t && styles.pillTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Input (if not Free) */}
        {type !== 'Free' && (
          <View>
            <Text style={styles.label}>
              {type === 'Exchange' ? 'Estimated Value (₹)' : 'Price (₹)'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 850"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        )}

        {/* Exchange description */}
        {type === 'Exchange' && (
          <View>
            <Text style={styles.label}>What do you want in exchange?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. iPad Pencil, Hostel cycle, or Mechanical books"
              placeholderTextColor={colors.textMuted}
              value={exchangeFor}
              onChangeText={setExchangeFor}
            />
          </View>
        )}

        {/* Condition Pills */}
        <Text style={styles.label}>Item Condition</Text>
        <View style={styles.pillRow}>
          {conditions.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.pill, condition === cond && styles.pillActive]}
              onPress={() => setCondition(cond)}
            >
              <Text style={[styles.pillText, condition === cond && styles.pillTextActive]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Mention how long you used it, reason for selling, any scratches, etc."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Pickup Location & GPS Button */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>Campus Pickup Spot</Text>
          <TouchableOpacity
            style={styles.gpsBtn}
            onPress={handleUseCurrentLocation}
            disabled={locLoading}
          >
            <Ionicons name="navigate" size={14} color={colors.sage} />
            <Text style={styles.gpsBtnText}>
              {locLoading ? 'Locating...' : 'Use Current GPS'}
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="e.g. Hostel 4 Common Room or Central Library"
          placeholderTextColor={colors.textMuted}
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />

        {/* Coral Star Donation Pledge Toggle */}
        <View style={styles.donationCard}>
          <View style={styles.donationHeader}>
            <View style={styles.starCircle}>
              <Ionicons name="star" size={18} color={colors.coral} />
            </View>
            <View style={styles.donationTextCol}>
              <Text style={styles.donationTitle}>Pledge Proceeds to Student Cause</Text>
              <Text style={styles.donationSubtitle}>
                Flag item with a coral star to pledge sales towards campus funds or book scholarships.
              </Text>
            </View>
            <Switch
              value={isDonation}
              onValueChange={setIsDonation}
              thumbColor={isDonation ? colors.coral : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(217, 58, 63, 0.4)' }}
            />
          </View>

          {isDonation && (
            <TextInput
              style={[styles.input, styles.causeInput]}
              placeholder="Designate cause (e.g. Campus Library Fund & Book Drives)"
              placeholderTextColor={colors.textMuted}
              value={donationCause}
              onChangeText={setDonationCause}
            />
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.btnSubmitText}>
              {editListing ? 'Save Changes' : 'Publish Campus Listing'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
        <ConfirmDialog
        visible={barcodeVisible}
        title="Scan Book Barcode"
        message="Prefill book title & edition from ISBN scanner?"
        confirmLabel="Prefill CLRS Algorithms"
        onCancel={() => setBarcodeVisible(false)}
        onConfirm={confirmBarcodePrefill}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 12,
  },
  photosRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumbWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  thumbImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  removeThumbBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.coral,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonsCol: {
    flexDirection: 'row',
    gap: 8,
  },
  addPhotoCard: {
    width: 80,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.headingBold,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressText: {
    color: colors.sage,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
  barcodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 16,
    gap: 8,
  },
  barcodeText: {
    color: colors.ebayYellow,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gpsBtnText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  pillActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.heading,
  },
  pillTextActive: {
    color: colors.white,
    fontFamily: fonts.headingBold,
  },
  donationCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  donationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(217, 58, 63, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  donationTextCol: {
    flex: 1,
    marginRight: 10,
  },
  donationTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  donationSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.body,
    lineHeight: 15,
    marginTop: 2,
  },
  causeInput: {
    marginTop: 12,
    marginBottom: 0,
  },
  btnSubmit: {
    backgroundColor: colors.accent,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  btnSubmitText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 16,
  },
});
