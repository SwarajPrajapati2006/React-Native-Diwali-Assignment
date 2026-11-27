# Feature 5: Share (`features/5.Share`)

## Product Purpose
Enables native peer-to-peer sharing across student WhatsApp groups, Telegram, and social feeds.
- Shares listings with rich title, formatted price, and deep link URL (`campusmarket://listing/:id`).
- Shares student seller storefronts and profiles.
- Shares exported files (such as sales reports in CSV format) via `expo-sharing`.

## Key Files
- `useShare.js`: Unified service hook exposing text and file sharing via React Native `Share` and `expo-sharing`.
