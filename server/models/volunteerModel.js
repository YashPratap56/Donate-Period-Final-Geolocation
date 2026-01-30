const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  skills: [String],
  availability: { type: String, enum: ['weekdays', 'weekends', 'both', 'flexible'], default: 'flexible' },
  hours: { type: Number, default: 0 },
  tasks: [{
    title: String,
    description: String,
    date: Date,
    hoursSpent: Number,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
  }],
  badges: [String],
  status: { type: String, enum: ['pending', 'approved', 'active'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
