const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    const notifications = await Notification.find({ user: userId })
      .populate('data.listingId', 'title images price')
      .populate('data.enquiryId')
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    await Notification.updateMany({ user: userId }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
