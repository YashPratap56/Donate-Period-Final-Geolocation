const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  targetItems: [{
    item: String,
    targetQuantity: Number,
    currentQuantity: { type: Number, default: 0 }
  }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  image: String,
  donors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
