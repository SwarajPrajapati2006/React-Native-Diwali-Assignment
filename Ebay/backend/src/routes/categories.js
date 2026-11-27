const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = [
      { id: 'All', name: 'All Items', icon: 'grid-outline', count: 0 },
      { id: 'Books', name: 'Books & Notes', icon: 'book-outline', count: 0 },
      { id: 'Electronics', name: 'Electronics & Gadgets', icon: 'laptop-outline', count: 0 },
      { id: 'Furniture', name: 'Hostel Furniture', icon: 'bed-outline', count: 0 },
      { id: 'Stationery', name: 'Stationery & Drafters', icon: 'pencil-outline', count: 0 },
      { id: 'Other', name: 'Other & Essentials', icon: 'cube-outline', count: 0 },
    ];

    // Compute live counts
    for (const cat of categories) {
      if (cat.id === 'All') {
        cat.count = await Listing.countDocuments({ isActive: true });
      } else {
        cat.count = await Listing.countDocuments({ category: cat.id, isActive: true });
      }
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
