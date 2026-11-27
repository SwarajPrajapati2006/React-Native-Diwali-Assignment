export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',
  PUSH_TOKEN: '/api/auth/push-token',

  // Listings
  LISTINGS: '/api/listings',
  LISTING_DETAIL: (id) => `/api/listings/${id}`,
  LISTING_SIMILAR: (id) => `/api/listings/${id}/similar`,
  LISTING_STATUS: (id) => `/api/listings/${id}/status`,
  LISTING_ACTIVE: (id) => `/api/listings/${id}/active`,

  // Enquiries
  ENQUIRIES: '/api/enquiries',
  ENQUIRY_DETAIL: (id) => `/api/enquiries/${id}`,
  ENQUIRY_RESPOND: (id) => `/api/enquiries/${id}/respond`,
  ENQUIRY_WITHDRAW: (id) => `/api/enquiries/${id}/withdraw`,

  // Favorites
  FAVORITES: '/api/favorites',
  FAVORITE_ITEM: (id) => `/api/favorites/${id}`,
  FAVORITE_IDS: '/api/favorites/ids',

  // Users & Dashboard
  USER_DETAIL: (id) => `/api/users/${id}`,
  USER_LISTINGS: (id) => `/api/users/${id}/listings`,
  USER_HISTORY: (id) => `/api/users/${id}/history`,
  USER_UPDATE_ME: '/api/users/me',
  DASHBOARD: '/api/users/dashboard',

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_READ: (id) => `/api/notifications/${id}/read`,
  NOTIFICATION_READ_ALL: '/api/notifications/read-all',

  // Upload & Categories
  UPLOAD: '/api/upload',
  CATEGORIES: '/api/categories',
};
