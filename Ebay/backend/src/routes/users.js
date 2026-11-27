const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const Enquiry = require('../models/Enquiry');

// GET /api/dashboard (stats + summary for logged in user)
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    const [activeCount, reservedCount, soldCount] = await Promise.all([
      Listing.countDocuments({ seller: userId, status: 'Available', isActive: true }),
      Listing.countDocuments({ seller: userId, status: 'Reserved' }),
      Listing.countDocuments({ seller: userId, status: 'Sold' }),
    ]);

    const soldListings = await Listing.find({ seller: userId, status: 'Sold' });
    const totalSales = soldListings.reduce((sum, item) => sum + (item.price || 0), 0);

    const pendingOffers = await Enquiry.countDocuments({ seller: userId, status: 'Pending' });
    const receivedEnquiries = await Enquiry.countDocuments({ seller: userId });

    const recentListings = await Listing.find({ seller: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentEnquiries = await Enquiry.find({ seller: userId })
      .populate('listing', 'title price images status')
      .populate('buyer', 'name avatar college')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        active: activeCount,
        reserved: reservedCount,
        sold: soldCount,
        totalListings: activeCount + reservedCount + soldCount,
        activeListings: activeCount,
        pendingOffers,
        receivedEnquiries,
        totalEnquiries: receivedEnquiries,
        totalSales,
        totalEarnings: totalSales,
      },
      recentListings,
      recentEnquiries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/users/me (update profile & contact preferences)
router.patch('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    const { name, college, role, avatar, phone, bio, contactPreferences } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (role !== undefined) user.role = role;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (contactPreferences) {
      user.contactPreferences = { ...user.contactPreferences, ...contactPreferences };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id/listings
router.get('/:id/listings', async (req, res) => {
  try {
    const listings = await Listing.find({
      seller: req.params.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id/history
router.get('/:id/history', async (req, res) => {
  try {
    const listings = await Listing.find({
      seller: req.params.id,
      status: 'Sold',
    }).sort({ updatedAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
