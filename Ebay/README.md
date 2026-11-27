# eBay Campus Second Chance Market

> A student second-hand marketplace (eBay/OLX style for campus) built with **React Native (Expo)** on the frontend and **Node.js (Express) + MongoDB** on the backend.
>
> **100% Pure JavaScript & JSX** (`.js` & `.jsx`). Default **Dark Mode** with authentic colorful **eBay branding** and sage-green sidebar drawer layout.

---

## 🏗️ Architecture & Structure

```
Ebay/
├── backend/                             # Express.js + Mongoose Backend
│   ├── .env                             # Environment configuration (MongoDB URI, Port)
│   ├── package.json
│   ├── uploads/                         # Multipart uploaded images
│   └── src/
│       ├── server.js                    # Express application entry
│       ├── seed.js                      # Realistic campus seed dataset
│       ├── config/
│       │   └── db.js                    # MongoDB Atlas connector
│       ├── models/                      # Mongoose models
│       │   ├── User.js
│       │   ├── Listing.js
│       │   ├── Enquiry.js
│       │   ├── Favorite.js
│       │   ├── Notification.js
│       │   └── PushToken.js
│       └── routes/                      # API Endpoints
│           ├── auth.js                  # Login, Register, Me, Push Tokens
│           ├── listings.js              # CRUD, status, active, similar
│           ├── enquiries.js             # Enquiries & price offers, accept, reject
│           ├── favorites.js             # Saved items
│           ├── users.js                 # Dashboard stats, profile, seller storefront
│           ├── notifications.js         # Alerts, mark as read
│           ├── upload.js                # Multipart image upload handler
│           └── categories.js            # Live categories with listing counts
│
└── frontend/                            # React Native (Expo) Client App
    ├── package.json                     # Dependencies
    ├── app.json                         # Permissions, icons, scheme: campusmarket
    ├── babel.config.js                  # Reanimated Babel plugin
    ├── .env                             # EXPO_PUBLIC_API_URL
    ├── index.js                         # Application registration
    ├── App.jsx                          # Main provider wrapper & splash coordinator
    └── src/
        ├── navigation/
        │   ├── RootNavigator.jsx        # Auth guard & modal stack
        │   ├── AppDrawer.jsx            # Custom Drawer Navigator
        │   ├── CustomDrawerContent.jsx  # Sage-green sidebar with eBay logo & groups
        │   ├── AuthStack.jsx            # Login, Register, Biometric unlock
        │   └── linking.js               # Deep links (campusmarket://listing/:id)
        │
        ├── theme/
        │   ├── colors.js                # Dark mode (#0B0B0B), Sage (#85B38A), eBay branding
        │   ├── typography.js            # Font weights & scales
        │   ├── spacing.js               # Borders, padding, layout metrics
        │   └── ThemeContext.js          # Theme provider hook
        │
        ├── store/
        │   ├── authStore.js             # Session (SecureStore), user, biometrics
        │   ├── settingsStore.js         # Dark mode, notifications, cache
        │   ├── networkStore.js          # Connection state & offline queue
        │   └── draftStore.js            # Auto-saved drafts
        │
        ├── services/
        │   ├── api.js                   # Axios instance with x-user-id interceptor
        │   ├── endpoints.js             # API route constants
        │   ├── queryClient.js           # TanStack React Query client
        │   └── offlineQueue.js          # Background offline synchronization
        │
        ├── components/
        │   ├── EbayLogo.jsx             # Authentic colorful eBay brand letters
        │   ├── Header.jsx               # Drawer hamburger, search, notification bell
        │   ├── ListingCard.jsx          # Mint tile, status ribbon, donation star, favorite
        │   ├── ListingGrid.jsx          # Responsive 2-column grid with pull-to-refresh
        │   ├── FilterChips.jsx          # Categories & type filter pills
        │   ├── SearchBar.jsx            # Input with paste button & clear
        │   ├── SortSheet.jsx            # Bottom sheet for sorting options
        │   ├── StatusBadge.jsx          # Available / Reserved / Sold badges
        │   ├── DonationStar.jsx         # Coral star icon for pledged proceeds
        │   ├── DonationInfoSheet.jsx    # Explanation modal for pledged causes
        │   ├── EmptyState.jsx           # Clean zero-data illustrations
        │   ├── Skeletons.jsx            # Content loading skeletons
        │   ├── ConfirmDialog.jsx        # Destructive action modal
        │   └── OfflineBanner.jsx        # Animated offline/sync indicator
        │
        └── features/
            ├── 1.Camera/                # expo-camera viewfinder & gallery picker
            ├── 2.Location/              # GPS reverse geocoding & nearby distance sorting
            ├── 3.Contacts/              # Invite classmates & save sellers to contacts
            ├── 4.Clipboard/             # One-tap copying & resume link detection
            ├── 5.Share/                 # Native sharing for listings, store & files
            ├── 6.Notifications/         # Push tokens, channels, polling & notification center
            ├── 7.Authentication/        # Dark login/signup & Face ID / Fingerprint unlock
            ├── 8.Network/               # NetInfo diagnostic & latency tester
            ├── 9.FileSystem/            # Cache manager, draft files & CSV sales export
            ├── 10.SplashScreen/         # Hydration wait & brand fade/scale animation
            ├── listings/                # Home, Detail, Create/Edit, Seller Profile
            ├── enquiries/               # Received / Sent offers & negotiation
            ├── favorites/               # Saved listings with unavailable status
            ├── dashboard/               # Seller metrics, inline status, sales report
            └── profile/                 # Profile editor, contact privacy preferences
```

---

## ⚡ How to Run

### Step 1: Start the Backend Server
```bash
cd "Ebay/backend"
npm install
npm run seed     # Populates sample college listings, demo users, enquiries & notifications
npm run dev      # Starts server on http://localhost:5000
```

### Step 2: Start the Expo Mobile App
```bash
cd "Ebay/frontend"
npm install
npx expo start --web      # Or scan QR code in Expo Go (Android / iOS)
```

---

## 🚀 Ten Native Features Mapping

| # | Native Feature | Folder | Implementation & Product Role |
|---|----------------|--------|--------------------------------|
| 1 | **Camera** | `features/1.Camera` | Custom camera viewfinder (`expo-camera`), flash/flip/capture controls, image compression, multipart upload to `/api/upload`, and book barcode scanning. |
| 2 | **Location** | `features/2.Location` | Foreground GPS (`expo-location`), reverse geocoding for campus pickup points, Haversine proximity calculations, and "Nearby Items" screen sorted by distance. |
| 3 | **Contacts** | `features/3.Contacts` | Classmate invitations with multi-select search and native "Save seller to device contacts" (`expo-contacts`) respecting seller privacy preferences. |
| 4 | **Clipboard** | `features/4.Clipboard` | Instant copying of deep links, seller numbers, and enquiry references (`expo-clipboard`), with smart link detection on app resume. |
| 5 | **Share** | `features/5.Share` | Native sharing sheet for listings (`campusmarket://listing/:id`), student storefronts, and exported CSV reports via `expo-sharing`. |
| 6 | **Notifications** | `features/6.Notifications` | Android channels (`enquiries`, `offers`, `general`), push token registration (`POST /api/auth/push-token`), polling every 60s, and in-app Notification Center. |
| 7 | **Authentication** | `features/7.Authentication` | Dark mode login and signup with eBay logo, session persistence via `expo-secure-store`, `x-user-id` Axios interceptors, and Face ID / Fingerprint unlock. |
| 8 | **Network** | `features/8.Network` | Global NetInfo slide-down offline banner, network diagnostic screen with API latency testing, and offline action synchronization queue. |
| 9 | **FileSystem** | `features/9.FileSystem` | Image cache measuring and clearing via `expo-file-system`, auto-saving listing drafts to JSON files in `documentDirectory/drafts/`, and CSV sales export. |
| 10| **SplashScreen** | `features/10.SplashScreen` | `preventAutoHideAsync()` waiting for session hydration, settings restoration, and cache priming, followed by an animated brand spring transition. |

---

## 🎨 Design System
- **Dark Mode**: Premium background `#0B0B0B`, surface `#141414`, surface raised `#1F1F1F`, border `#282828`.
- **Sage Brand**: Primary accent `#85B38A`, dark sage `#5E8F64`, soft mint `#1A291E`.
- **Coral Star**: Pledged donation items `#F26B6B`.
- **eBay Identity**: Official colorful logo letters (e: `#E53238`, b: `#0064D2`, a: `#F5AF02`, y: `#86B817`).
- **Drawer**: Sage-green `#85B38A` sidebar, 28px rounded right corners, soft white pill active states.
