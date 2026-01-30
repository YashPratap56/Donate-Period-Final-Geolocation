const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['news', 'stories', 'education', 'events'], default: 'news' },
  image: String,
  tags: [String],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
