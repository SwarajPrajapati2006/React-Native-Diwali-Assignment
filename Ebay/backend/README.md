# eBay Campus Market - Express & MongoDB Backend

## Features
- **Database**: Connected to MongoDB Atlas (`mongodb+srv://Swaraj69:kundan2006@backend.rwe3tsb.mongodb.net/campusmarket`).
- **Authentication**: `x-user-id` header handling + `/api/auth/login`, `/api/auth/register`, `/api/auth/me`.
- **Listings**: Query by search (`q`), `category`, `type` (For Sale, Free, Exchange), `condition`, `minPrice`, `maxPrice`, `status` (Available, Reserved, Sold), sorting, and pagination.
- **Enquiries**: Negotiations with optional `offerPrice`, accept/reject with seller notes, auto-reservation on accept.
- **Favorites**: User favorites management.
- **Notifications**: In-app notifications with unread counts and read-all actions.
- **Uploads**: Multipart disk upload via Multer storing to `/uploads/` with public static serving.
- **Seed Script**: Realistic dataset including college textbooks, scientific calculators, study chairs, drafters, and headphones.

## Commands
```bash
npm install
npm run seed     # Seed demo data
npm run dev      # Start with nodemon on port 5000
npm start        # Production start
```
