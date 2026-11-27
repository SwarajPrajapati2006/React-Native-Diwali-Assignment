import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShare } from '../../5.Share/useShare';
import { useContacts } from '../../3.Contacts/useContacts';
import { Header } from '../../../components/Header';
import { ListingCard } from '../../../components/ListingCard';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';
import api from '../../../services/api';

export const SellerProfileScreen = ({ route, navigation }) => {
  const { sellerId } = route?.params || {};
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { shareStorefront } = useShare();
  const { saveSellerToContacts } = useContacts();

  useEffect(() => {
    fetchSellerProfile();
  }, [sellerId]);

  const fetchSellerProfile = async () => {
    setLoading(true);
    try {
      const [uRes, lRes, hRes] = await Promise.all([
        api.get(`/api/users/${sellerId}`),
        api.get(`/api/users/${sellerId}/listings`),
        api.get(`/api/users/${sellerId}/history`),
      ]);
      setSeller(uRes.data);
      setListings(lRes.data || []);
      setHistory(hRes.data || []);
    } catch (e) {
      console.error('Fetch seller profile error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !seller) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.sage} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Student Storefront" showSearch={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <Image source={{ uri: seller.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{seller.name}</Text>
          <Text style={styles.college}>{seller.college}</Text>
          <Text style={styles.bio}>{seller.bio || 'Campus second-hand seller.'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{listings.length}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{seller.rating || '5.0'} ★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => shareStorefront(seller)}
            >
              <Ionicons name="share-outline" size={18} color={colors.sage} />
              <Text style={styles.btnActionText}>Share Store</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => saveSellerToContacts(seller)}
            >
              <Ionicons name="person-add-outline" size={18} color={colors.sage} />
              <Text style={styles.btnActionText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Storefront Items */}
        <Text style={styles.sectionTitle}>
          Items for Sale ({listings.length})
        </Text>

        <View style={styles.grid}>
          {listings.map((item) => (
            <View key={item._id} style={styles.cardCol}>
              <ListingCard
                listing={item}
                onPress={() => navigation.navigate('ListingDetail', { id: item._id })}
              />
            </View>
          ))}
        </View>
      </ScrollView>
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
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
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
    marginVertical: 10,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.surfaceBorder,
    marginVertical: 12,
  },
  statCol: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.sage,
    gap: 6,
  },
  btnActionText: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
    fontSize: 13,
  },
  sectionTitle: {
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
