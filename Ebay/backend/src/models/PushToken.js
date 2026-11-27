const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: { type: String, required: true },
    deviceType: { type: String, default: 'unknown' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PushToken', pushTokenSchema);
