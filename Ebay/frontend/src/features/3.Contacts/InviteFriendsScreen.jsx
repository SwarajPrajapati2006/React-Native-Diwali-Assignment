import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContacts } from './useContacts';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const InviteFriendsScreen = () => {
  const { contacts, isLoading, requestAndLoadContacts, inviteContact } = useContacts();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({});

  useEffect(() => {
    requestAndLoadContacts();
  }, []);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInviteSelected = () => {
    const selectedList = contacts.filter((c) => selected[c.id]);
    if (selectedList.length === 0) return;
    inviteContact({ name: `${selectedList.length} classmates` });
  };

  const renderItem = ({ item }) => {
    const isChosen = !!selected[item.id];
    const phone = item.phoneNumbers?.[0]?.number || 'No phone listed';

    return (
      <TouchableOpacity
        style={[styles.contactCard, isChosen && styles.contactCardSelected]}
        onPress={() => toggleSelect(item.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>

        <TouchableOpacity
          style={[styles.inviteBtn, isChosen && styles.inviteBtnSelected]}
          onPress={() => inviteContact(item)}
        >
          <Text style={[styles.inviteBtnText, isChosen && styles.inviteBtnTextSelected]}>
            {isChosen ? 'Selected' : 'Invite'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Invite Classmates" showSearch={false} />

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search phone contacts..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.sage} />
          <Text style={styles.loadingText}>Reading campus contacts...</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
                Share Buy & Sell
              </Text>
              <Text style={styles.headerSubtitle}>
                Invite your hostel roommates and batchmates to buy and sell college books, calculators, and gadgets easily!
              </Text>
            </View>
          }
        />
      )}

      {/* Multi-invite bottom bar */}
      {Object.values(selected).filter(Boolean).length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.selectedCount}>
            {Object.values(selected).filter(Boolean).length} classmates selected
          </Text>
          <TouchableOpacity style={styles.multiBtn} onPress={handleInviteSelected}>
            <Text style={styles.multiBtnText}>Send Invites</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    margin: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  headerInfo: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 6,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 14,
    paddingBottom: 80,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  contactCardSelected: {
    borderColor: colors.sage,
    backgroundColor: 'rgba(31, 78, 137, 0.08)',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  avatarText: {
    color: colors.sage,
    fontSize: 16,
    fontFamily: fonts.headingBold,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
    marginBottom: 2,
  },
  phone: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
  },
  inviteBtn: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(31, 78, 137, 0.3)',
  },
  inviteBtnSelected: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  inviteBtnText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  inviteBtnTextSelected: {
    color: colors.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    marginTop: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceRaised,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  selectedCount: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
  multiBtn: {
    backgroundColor: colors.sage,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  multiBtnText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
});
