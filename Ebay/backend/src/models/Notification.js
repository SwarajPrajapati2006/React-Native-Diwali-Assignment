const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['enquiry', 'offer', 'listing_status', 'price_drop', 'system'],
      default: 'system',
    },
    read: { type: Boolean, default: false },
    data: {
      listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
      enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
