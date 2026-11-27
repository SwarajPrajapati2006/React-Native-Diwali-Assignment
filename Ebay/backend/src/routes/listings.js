const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// GET /api/listings
// Query params: q, category, type, condition, minPrice, maxPrice, status, seller, sort (newest|price_asc|price_desc|relevance), page, limit
router.get('/', async (req, res) => {
  try {
    const {
      q,
      category,
      type,
      condition,
      minPrice,
      maxPrice,
      status,
      seller,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (type) {
      filter.type = type;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (status) {
      filter.status = status;
    }

    if (seller) {
      filter.seller = seller;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') filter.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(filter);
    const listings = await Listing.find(filter)
      .populate('seller', 'name avatar college rating phone contactPreferences')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      listings,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/listings/:id/similar
router.get('/:id/similar', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const similar = await Listing.find({
      _id: { $ne: listing._id },
      category: listing.category,
      isActive: true,
    })
      .populate('seller', 'name avatar college rating')
      .limit(6);

    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'seller',
      'name email avatar college rating phone contactPreferences bio'
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // increment views
    listing.views = (listing.views || 0) + 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/listings
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id header required' });

    const {
      title,
      description,
      price,
      category,
      type,
      exchangeFor,
      condition,
      images,
      isDonation,
      donationCause,
      pickupLocation,
      coordinates,
    } = req.body;

    const listing = await Listing.create({
      title,
      description,
      price: type === 'Free' ? 0 : Number(price || 0),
      category: category || 'Other',
      type: type || 'For Sale',
      exchangeFor: exchangeFor || '',
      condition: condition || 'Good',
      status: 'Available',
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'],
      isDonation: Boolean(isDonation),
      donationCause: donationCause || '',
      pickupLocation: pickupLocation || 'Student Center / Library Steps',
      coordinates: coordinates || { latitude: 28.6139, longitude: 77.2090 },
      seller: userId,
      isActive: true,
    });

    const populated = await Listing.findById(listing._id).populate('seller', 'name avatar college rating');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/listings/:id
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // allow seller or update
    Object.assign(listing, req.body);
    await listing.save();

    const updated = await Listing.findById(listing._id).populate('seller', 'name avatar college rating');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/listings/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Reserved', 'Sold'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('seller', 'name avatar college rating');

    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/listings/:id/active
router.patch('/:id/active', async (req, res) => {
  try {
    const { isActive } = req.body;
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(isActive) },
      { new: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
