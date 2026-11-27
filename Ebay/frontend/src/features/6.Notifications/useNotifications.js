import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// Configure notification behavior. SDK 58 requires shouldShowBanner /
// shouldShowList (shouldShowAlert is deprecated and ignored).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Module-scope cache of notification ids already surfaced to the user.
const seenNotificationIds = new Set();
let seenInitialized = false;
let lastUserId = null;

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, userId } = useAuthStore();

  useEffect(() => {
    if (lastUserId !== userId) {
      lastUserId = userId;
      seenNotificationIds.clear();
      seenInitialized = false;
    }
  }, [userId]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setupChannels().finally(registerForPushNotifications);
    } else {
      registerForPushNotifications();
    }
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const setupChannels = async () => {
    if (Platform.OS !== 'android') return;
    // Best-effort: Expo Go on Android can't create channels and throws a native
    // NullPointerException; swallow it so the app never crashes.
    const channels = [
      { id: 'enquiries', options: { name: 'Campus Enquiries', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 250, 250, 250], lightColor: '#1F4E89' } },
      { id: 'offers', options: { name: 'Price Offers & Counter-offers', importance: Notifications.AndroidImportance.HIGH, sound: 'default' } },
      { id: 'general', options: { name: 'General Updates', importance: Notifications.AndroidImportance.DEFAULT } },
    ];
    for (const { id, options } of channels) {
      try {
        await Notifications.setNotificationChannelAsync(id, options);
      } catch (e) {
        console.warn(`Notification channel "${id}" unavailable (expected in Expo Go):`, e?.message);
      }
    }
  };

  const registerForPushNotifications = async () => {
    if (Platform.OS === 'web') return;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId ||
        Constants?.expoConfig?.slug;

      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      ).catch(() => null);

      if (tokenData?.data) {
        setExpoPushToken(tokenData.data);
        await api.post('/api/auth/push-token', {
          token: tokenData.data,
          deviceType: Platform.OS,
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Push registration error:', e);
    }
  };

  const triggerLocalNotification = async (title, body, data = {}) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, data, sound: 'default' },
        trigger: null,
      });
    } catch (e) {
      console.warn('Local notification error:', e);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/notifications');
      const items = res.data.notifications || [];
      setNotifications(items);
      setUnreadCount(res.data.unreadCount || 0);

      if (!seenInitialized) {
        items.forEach((n) => seenNotificationIds.add(n._id));
        seenInitialized = true;
      } else {
        items.forEach((n) => {
          if (!seenNotificationIds.has(n._id)) {
            seenNotificationIds.add(n._id);
            if (!n.read) {
              triggerLocalNotification(n.title, n.message, n.data || {});
            }
          }
        });
      }
    } catch (e) {
      console.warn('Fetch notifications error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  return {
    expoPushToken,
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    triggerLocalNotification,
  };
};