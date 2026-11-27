# Feature 10: SplashScreen (`features/10.SplashScreen`)

## Product Purpose
Guarantees a clean, flicker-free cold start experience. Holds `expo-splash-screen` active with `preventAutoHideAsync()` until SecureStore session recovery, user settings hydration, and offline queues are ready, followed by an animated eBay brand fade-in and scale spring transition.

## Key Files
- `useSplashScreen.js`: Orchestrates asynchronous startup hydration before dismissing native splash screen.
- `SplashScreenView.jsx`: Animated splash presentation view with eBay brand typography.
