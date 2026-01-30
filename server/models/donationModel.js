const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  items: [{
    item: String,
    quantity: Number
  }],
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['products', 'money', 'both'], default: 'products' },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'completed'], default: 'pending' },
  message: String,
  anonymous: { type: Boolean, default: false },
  trackingId: String
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
