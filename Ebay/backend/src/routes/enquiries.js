const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');

// GET /api/enquiries (Received & Sent)
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id required' });

    const { type = 'all' } = req.query; // 'received', 'sent', or 'all'

    let filter = {};
    if (type === 'received') {
      filter.seller = userId;
    } else if (type === 'sent') {
      filter.buyer = userId;
    } else {
      filter.$or = [{ seller: userId }, { buyer: userId }];
    }

    const enquiries = await Enquiry.find(filter)
      .populate('listing', 'title price images status category')
      .populate('buyer', 'name avatar college email phone')
      .populate('seller', 'name avatar college email phone')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/enquiries/:id
router.get('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('listing')
      .populate('buyer', 'name avatar college email phone')
      .populate('seller', 'name avatar college email phone');

    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/enquiries
router.post('/', async (req, res) => {
  try {
    const buyerId = req.headers['x-user-id'];
    if (!buyerId) return res.status(401).json({ error: 'x-user-id required' });

    const { listingId, message, offerPrice } = req.body;
    if (!listingId || !message) {
      return res.status(400).json({ error: 'listingId and message are required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    if (listing.seller.toString() === buyerId) {
      return res.status(400).json({ error: 'You cannot enquire on your own listing' });
    }

    // Check duplicate pending enquiry
    const existing = await Enquiry.findOne({
      listing: listingId,
      buyer: buyerId,
      status: 'Pending',
    });
    if (existing) {
      return res.status(400).json({ error: 'You already have a pending enquiry for this item' });
    }

    const enquiry = await Enquiry.create({
      listing: listingId,
      buyer: buyerId,
      seller: listing.seller,
      message,
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      status: 'Pending',
    });

    // Send notification to seller
    await Notification.create({
      user: listing.seller,
      title: 'New Enquiry Received!',
      message: `Someone is interested in "${listing.title}". Offer: ${offerPrice ? '₹' + offerPrice : 'Standard'}.`,
      type: 'enquiry',
      data: { listingId: listing._id, enquiryId: enquiry._id },
    });

    const populated = await Enquiry.findById(enquiry._id)
      .populate('listing')
      .populate('buyer', 'name avatar college')
      .populate('seller', 'name avatar college');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/enquiries/:id/respond (Accept or Reject)
router.patch('/:id/respond', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { status, sellerNote, reserveListing } = req.body;

    if (!['Accepted', 'Rejected', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid response status' });
    }

    const enquiry = await Enquiry.findById(req.params.id).populate('listing');
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

    enquiry.status = status;
    if (sellerNote) enquiry.sellerNote = sellerNote;
    await enquiry.save();

    // Optionally reserve listing if accepted
    if (status === 'Accepted' && reserveListing && enquiry.listing) {
      await Listing.findByIdAndUpdate(enquiry.listing._id, { status: 'Reserved' });
    }

    // Notify buyer
    await Notification.create({
      user: enquiry.buyer,
      title: `Offer ${status}!`,
      message: `Your enquiry for "${enquiry.listing?.title}" was ${status.toLowerCase()}.${sellerNote ? ' Note: ' + sellerNote : ''}`,
      type: 'offer',
      data: { listingId: enquiry.listing?._id, enquiryId: enquiry._id },
    });

    const updated = await Enquiry.findById(enquiry._id)
      .populate('listing')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/enquiries/:id/withdraw
router.patch('/:id/withdraw', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'Withdrawn' },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
