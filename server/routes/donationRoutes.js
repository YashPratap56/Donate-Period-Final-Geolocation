const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createDonation, getDonations, getDonationStats, trackDonation, updateDonationStatus } = require('../controllers/donationController');

router.get('/stats', getDonationStats);
router.get('/track/:trackingId', trackDonation);
router.get('/', protect, getDonations);
router.post('/', protect, createDonation);
router.put('/:id/status', protect, updateDonationStatus);

module.exports = router;
