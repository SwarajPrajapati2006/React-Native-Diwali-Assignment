const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PushToken = require('../models/PushToken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, college, password, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    let existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      college: college || 'XYZ College',
      role: 'XYZ College Student',
      password: password || '',
      phone: phone || '+91 98765 43210',
      avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(name)}`,
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      user,
      token: `mock_jwt_${user._id}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Auto create for smooth demo experience
      const name = email.split('@')[0];
      user = await User.create({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email.toLowerCase(),
        password: password || '',
        college: 'XYZ College',
        role: 'XYZ College Student',
        avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(name)}`,
      });
    }

    res.json({
      message: 'Login successful',
      userId: user._id,
      user,
      token: `mock_jwt_${user._id}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Current User
router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'x-user-id header missing' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register Push Token
router.post('/push-token', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { token, deviceType } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    if (userId) {
      await PushToken.findOneAndUpdate(
        { user: userId, token },
        { user: userId, token, deviceType: deviceType || 'unknown' },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, message: 'Push token saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
