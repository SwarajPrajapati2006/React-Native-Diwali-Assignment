# Feature 6: Notifications (`features/6.Notifications`)

## Product Purpose
Keeps students notified of critical marketplace activities.
- Android Channels: Creates categorized channels for `enquiries`, `offers`, and `general`.
- Push Token Registration: Automatically captures the device's Expo push token and transmits it to `POST /api/auth/push-token`.
- Foreground Polling & Local Triggers: Polls every 60 seconds and fires rich local notifications on offer acceptance, new counter-offers, or status updates.
- In-App Notification Center: Full screen to view, deep link, mark individual items as read, or mark all items as read.

## Key Files
- `useNotifications.js`: Channel setup, push token registration, and background polling hook.
- `NotificationCenterScreen.jsx`: In-app notification center with direct deep links.
