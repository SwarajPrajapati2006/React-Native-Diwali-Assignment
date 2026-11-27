# Feature 8: Network (`features/8.Network`)

## Product Purpose
Enables offline-first campus reliability when students walk through basement labs or low-reception hostel zones.
- NetInfo Global Banner: Displays offline indicators and background sync status.
- Offline Action Queue: Queues favorites toggles, status updates, and enquiries while offline, automatically replaying them against the backend when network reachability restores.
- Network Diagnostic Screen: Displays connection type, internet reachability, queue length, and round-trip API latency.

## Key Files
- `useNetwork.js`: Hook listening to NetInfo transitions and triggering offline queue replays.
- `NetworkStatusScreen.jsx`: Diagnostic screen with ping benchmarks to `/api/categories`.
