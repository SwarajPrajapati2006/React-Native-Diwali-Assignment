import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/authStore';
import { useShare } from '../../5.Share/useShare';
import { Header } from '../../../components/Header';
import { ListingCard } from '../../../components/ListingCard';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import api from '../../../services/api';

export const MyStorefrontScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { shareStorefront } = useShare();

  useEffect(() => {
    const uid = user?._id || user?.id;
    if (uid) {
      fetchStore(uid);
    }
  }, [user]);

  const fetchStore = async (uid) => {
    setLoading(true);
    try {
      const id = uid || user?._id || user?.id;
      const res = await api.get(`/api/users/${id}/listings`);
      setMyListings(res.data || []);
    } catch (e) {
      console.warn('Storefront error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="My Campus Storefront" showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Banner Card */}
        <View style={styles.banner}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.college}>{user?.college}</Text>
          <Text style={styles.bio}>{user?.bio || 'Student seller'}</Text>

          <TouchableOpacity
            style={styles.btnShare}
            onPress={() => user && shareStorefront(user)}
          >
            <Ionicons name="share-social-outline" size={18} color={colors.white} />
            <Text style={styles.btnShareText}>Share My Storefront</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Items Currently For Sale ({myListings.length})</Text>

        {loading ? (
          <ActivityIndicator color={colors.sage} style={{ marginVertical: 30 }} />
        ) : myListings.length === 0 ? (
          <EmptyState
            icon="storefront-outline"
            title="Your Store is Empty"
            subtitle="Start listing your textbooks, stationery, or electronics to build your campus store."
            actionLabel="Post New Listing"
            onAction={() => navigation.navigate('CreateListing')}
          />
        ) : (
          <View style={styles.grid}>
            {myListings.map((item) => (
              <View key={item._id} style={styles.cardCol}>
                <ListingCard
                  listing={item}
                  onPress={() => navigation.navigate('ListingDetail', { id: item._id })}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  banner: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 10,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.headingBold,
  },
  college: {
    color: colors.sage,
    fontSize: 13,
    fontFamily: fonts.heading,
    marginTop: 2,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sage,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  btnShareText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: fonts.headingBold,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  cardCol: {
    width: '50%',
    paddingHorizontal: 6,
  },
});
