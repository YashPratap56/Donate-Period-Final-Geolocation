const Donation = require('../models/donationModel');
const NGO = require('../models/ngoModel');
const crypto = require('crypto');

const createDonation = async (req, res) => {
  try {
    const { ngoId, items, amount, type, message, anonymous } = req.body;
    const trackingId = 'DON-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    const donation = await Donation.create({
      donor: req.user._id,
      ngo: ngoId,
      items,
      amount,
      type,
      message,
      anonymous,
      trackingId
    });

    if (items && items.length > 0) {
      const ngo = await NGO.findById(ngoId);
      items.forEach(donatedItem => {
        const invItem = ngo.inventory.find(i => i.item === donatedItem.item);
        if (invItem) invItem.quantity += donatedItem.quantity;
      });
      ngo.totalDonations += 1;
      await ngo.save();
    }

    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('ngo', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalProducts: { $sum: { $sum: '$items.quantity' } }
      }}
    ]);
    res.json({ success: true, data: stats[0] || { totalDonations: 0, totalAmount: 0, totalProducts: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const trackDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({ trackingId: req.params.trackingId })
      .populate('ngo', 'name');
    if (!donation) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createDonation, getDonations, getDonationStats, trackDonation, updateDonationStatus };
