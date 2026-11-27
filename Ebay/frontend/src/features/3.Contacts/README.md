# Feature 3: Contacts (`features/3.Contacts`)

## Product Purpose
Enables viral campus onboarding and trusted transactions.
1. Classmate Invites: Students can search and multi-select phone contacts to share personalized deep links to the marketplace.
2. Save Verified Sellers: Direct integration from a listing's seller card to save trusted student sellers into phone contacts (with telephone/email populated according to the seller's public contact privacy preferences).

## Key Files
- `useContacts.js`: Hook wrapping `expo-contacts` permissions, contact fetching, batch invitations, and `addContactAsync`.
- `InviteFriendsScreen.jsx`: Searchable list of campus contacts with selection and batch sharing.
