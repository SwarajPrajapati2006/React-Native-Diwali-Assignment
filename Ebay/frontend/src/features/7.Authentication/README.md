# Feature 7: Authentication (`features/7.Authentication`)

## Product Purpose
Handles student sign in, account registration, session restoration, and biometric authentication.
- Premium Dark UI: Designed with rich dark surfaces, authentic colorful eBay brand mark, campus credentials, and demo account shortcuts.
- Session Security: Stores active `userId` and tokens in hardware-backed `expo-secure-store` (falling back cleanly to `AsyncStorage` on web).
- Axios Interceptor Integration: Transparently sends the `x-user-id` header on every outbound marketplace API call.
- Biometrics: Supports Face ID, Fingerprint, and device PIN via `expo-local-authentication`.

## Key Files
- `useAuth.js`: Hook managing auth states, biometric prompt, and local session caches.
- `LoginScreen.jsx`: Dark mode login form with one-tap demo logins and biometric trigger.
- `RegisterScreen.jsx`: Campus student account registration screen.
- `BiometricUnlockScreen.jsx`: Standalone biometric verification screen.
