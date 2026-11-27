import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from './useNotifications';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const NotificationCenterScreen = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handlePress = async (item) => {
    if (!item.read) {
      await markAsRead(item._id);
    }

    if (item.data?.listingId) {
      navigation.navigate('ListingDetail', {
        id: item.data.listingId._id || item.data.listingId,
      });
    } else if (item.data?.enquiryId) {
      navigation.navigate('Enquiries');
    }
  };

  const renderItem = ({ item }) => {
    let iconName = 'notifications-outline';
    let iconColor = colors.sage;

    if (item.type === 'offer') {
      iconName = 'cash-outline';
      iconColor = colors.ebayYellow;
    } else if (item.type === 'enquiry') {
      iconName = 'chatbubble-ellipses-outline';
      iconColor = colors.ebayBlue;
    }

    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread]}
        onPress={() => handlePress(item)}
      >
        <View style={[styles.iconBox, { borderColor: iconColor }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, !item.read && styles.titleUnread]}>
            {item.title}
          </Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleDateString()} at{' '}
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Notification Center" showSearch={false} />

      <View style={styles.actionBar}>
        <Text style={styles.unreadNotice}>
          {unreadCount > 0 ? `${unreadCount} unread message(s)` : 'All caught up!'}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && notifications.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.sage} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchNotifications}
              tintColor={colors.sage}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="notifications-off-outline"
              title="No Notifications"
              subtitle="You'll be alerted here whenever buyers enquire or make price offers on your listings."
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
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  unreadNotice: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
  markAllText: {
    color: colors.sage,
    fontFamily: fonts.headingBold,
    fontSize: 13,
  },
  list: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardUnread: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.sage,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.heading,
    marginBottom: 4,
  },
  titleUnread: {
    fontFamily: fonts.headingBold,
    color: colors.textPrimary,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    marginLeft: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
