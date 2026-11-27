const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: '' },
    college: { type: String, default: 'XYZ College' },
    role: { type: String, default: 'XYZ College Student' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    phone: { type: String, default: '+91 98765 43210' },
    bio: { type: String, default: 'Student & eco-friendly thrifter.' },
    contactPreferences: {
      whatsapp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      phone: { type: Boolean, default: false },
      showPublic: { type: Boolean, default: true },
    },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 12 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
