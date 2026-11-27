# Feature 2: Location (`features/2.Location`)

## Product Purpose
Enables location-aware campus commerce. Sellers can automatically attach their hostel block, library quad, or cafeteria pickup point via GPS and reverse geocoding. Buyers can browse the "Nearby Items" screen where listings are sorted by distance with distance chips (e.g., "0.8 km away") and an interactive campus map/list toggle.

## Key Files
- `useLocation.js`: Hook managing foreground GPS permissions, reverse geocoding to human-readable addresses, and Haversine distance computations.
- `NearbyItemsScreen.jsx`: Dedicated discovery screen displaying campus items sorted by proximity with map/list view switcher.
