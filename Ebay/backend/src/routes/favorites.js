const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');

// GET /api/favorites
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: 'listing',
        populate: { path: 'seller', select: 'name avatar college rating' },
      })
      .sort({ createdAt: -1 });

    // filter out null listings
    const validFavorites = favorites.filter((f) => f.listing != null);
    res.json(validFavorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/favorites/ids
router.get('/ids', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.json([]);

    const favorites = await Favorite.find({ user: userId }).select('listing');
    const ids = favorites.map((f) => f.listing.toString());
    res.json(ids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/favorites
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: 'listingId required' });

    const fav = await Favorite.findOneAndUpdate(
      { user: userId, listing: listingId },
      { user: userId, listing: listingId },
      { upsert: true, new: true }
    ).populate('listing');

    res.status(201).json(fav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/favorites/:listingId
router.delete('/:listingId', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    await Favorite.findOneAndDelete({
      user: userId,
      listing: req.params.listingId,
    });

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
