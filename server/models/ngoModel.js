const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  email: { type: String },
  phone: { type: String },
  website: { type: String },
  image: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String,
    city: String,
    state: String
  },
  inventory: [{ 
    item: String, 
    quantity: Number,
    minRequired: { type: Number, default: 10 }
  }],
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 },
  beneficiariesServed: { type: Number, default: 0 },
  operatingHours: { type: String },
  categories: [String]
}, { timestamps: true });

ngoSchema.index({ location: '2dsphere' }); 

module.exports = mongoose.model('NGO', ngoSchema);
