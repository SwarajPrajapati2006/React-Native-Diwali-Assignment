const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Books', 'Electronics', 'Furniture', 'Stationery', 'Other'],
      default: 'Other',
    },
    type: {
      type: String,
      required: true,
      enum: ['For Sale', 'Free', 'Exchange'],
      default: 'For Sale',
    },
    exchangeFor: { type: String, default: '' },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Reserved', 'Sold'],
      default: 'Available',
    },
    images: [{ type: String }],
    isDonation: { type: Boolean, default: false },
    donationCause: { type: String, default: '' },
    pickupLocation: { type: String, default: 'Campus Main Gate / Student Center' },
    coordinates: {
      latitude: { type: Number, default: 28.6139 },
      longitude: { type: Number, default: 77.2090 },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for search query
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
