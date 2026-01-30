const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: true,
  credentials: true
}));

// MongoDB Connection (cached for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Error:', err);
    throw err;
  }
};

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo'], default: 'ngo' },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' }
}, { timestamps: true });

const bcrypt = require('bcryptjs');
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.models.User || mongoose.model('User', userSchema);

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  email: String,
  phone: String,
  website: String,
  image: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String,
    city: String,
    state: String
  },
  inventory: [{ item: String, quantity: Number, minRequired: { type: Number, default: 10 } }],
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 },
  beneficiariesServed: { type: Number, default: 0 },
  categories: [String]
}, { timestamps: true });
ngoSchema.index({ location: '2dsphere' });
const NGO = mongoose.models.NGO || mongoose.model('NGO', ngoSchema);

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  targetItems: [{ item: String, targetQuantity: Number, currentQuantity: { type: Number, default: 0 } }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  image: String,
  donors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' }
}, { timestamps: true });
const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

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
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  items: [{ item: String, quantity: Number }],
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['products', 'money', 'both'], default: 'products' },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'completed'], default: 'pending' },
  message: String,
  anonymous: { type: Boolean, default: false },
  trackingId: String
}, { timestamps: true });
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  skills: [String],
  availability: { type: String, enum: ['weekdays', 'weekends', 'both', 'flexible'], default: 'flexible' },
  hours: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'active'], default: 'pending' }
}, { timestamps: true });
const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

// JWT Helper
const jwt = require('jsonwebtoken');
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

// Auth Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Helper Functions
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// ==================== ROUTES ====================

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'DonatePeriod API is running' });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  await connectDB();
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NGO Routes
app.get('/api/ngos', async (req, res) => {
  await connectDB();
  try {
    const { lat, lng, radius = 50000, source = 'all' } = req.query;
    
    const allDbNgos = await NGO.find();
    let results = allDbNgos.map(ngo => ({
      ...ngo.toObject(),
      source: 'database',
      distance: (lat && lng && ngo.location?.coordinates) ? calculateDistance(
        parseFloat(lat), parseFloat(lng),
        ngo.location.coordinates[1], ngo.location.coordinates[0]
      ) : null
    }));
    
    if (lat && lng) results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/ngos/search', async (req, res) => {
  await connectDB();
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Search query required' });
    
    const ngos = await NGO.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'location.city': { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });
    res.json({ success: true, count: ngos.length, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

app.get('/api/ngos/geocode/forward', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) return res.status(400).json({ success: false, error: 'Address required' });
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
      { headers: { 'User-Agent': 'DonatePeriod/1.0' } }
    );
    const data = await response.json();
    
    if (data.length === 0) return res.status(404).json({ success: false, error: 'Location not found' });
    
    const results = data.map(item => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name
    }));
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Geocoding failed' });
  }
});

app.get('/api/ngos/geocode/reverse', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, error: 'Coordinates required' });
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { 'User-Agent': 'DonatePeriod/1.0' } }
    );
    const data = await response.json();
    
    res.json({
      success: true,
      data: {
        address: data.display_name,
        city: data.address?.city || data.address?.town || '',
        state: data.address?.state || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Geocoding failed' });
  }
});

app.get('/api/ngos/:id', async (req, res) => {
  await connectDB();
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, error: 'NGO not found' });
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

app.put('/api/ngos/:id', async (req, res) => {
  await connectDB();
  try {
    const { inventory } = req.body;
    const updatedNGO = await NGO.findByIdAndUpdate(req.params.id, { inventory }, { new: true });
    res.json({ success: true, data: updatedNGO });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Update Failed' });
  }
});

// Campaign Routes
app.get('/api/campaigns', async (req, res) => {
  await connectDB();
  try {
    const campaigns = await Campaign.find().populate('ngo', 'name').sort('-createdAt');
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  await connectDB();
  try {
    const campaign = await Campaign.findById(req.params.id).populate('ngo', 'name location');
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blog Routes
app.get('/api/blogs', async (req, res) => {
  await connectDB();
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    
    const blogs = await Blog.find(filter).sort('-createdAt');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Donation Routes
app.get('/api/donations/stats', async (req, res) => {
  await connectDB();
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
});

app.post('/api/donations', protect, async (req, res) => {
  await connectDB();
  try {
    const { ngoId, items, amount, type, message, anonymous } = req.body;
    const crypto = require('crypto');
    const trackingId = 'DON-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    const donation = await Donation.create({
      donor: req.user._id, ngo: ngoId, items, amount, type, message, anonymous, trackingId
    });
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Volunteer Routes
app.post('/api/volunteers', protect, async (req, res) => {
  await connectDB();
  try {
    const volunteer = await Volunteer.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/volunteers/leaderboard', async (req, res) => {
  await connectDB();
  try {
    const volunteers = await Volunteer.find({ status: 'active' })
      .populate('user', 'name')
      .sort('-hours')
      .limit(10);
    res.json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed endpoint (for initial data)
app.post('/api/seed', async (req, res) => {
  await connectDB();
  try {
    const ngos = [
      {
        name: "Period Care Foundation",
        description: "Dedicated to ensuring menstrual hygiene for all women in rural areas.",
        email: "contact@periodcare.org",
        phone: "+91 9876543210",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
        location: { coordinates: [82.9739, 25.3176], address: "123 Main Street", city: "Varanasi", state: "Uttar Pradesh" },
        inventory: [
          { item: "Sanitary Pads", quantity: 500, minRequired: 100 },
          { item: "Menstrual Cups", quantity: 50, minRequired: 20 }
        ],
        verified: true, rating: 4.8, totalDonations: 15000, beneficiariesServed: 2500
      },
      {
        name: "Women Wellness Initiative",
        description: "Empowering women through health education and product distribution.",
        email: "info@womenwellness.org",
        phone: "+91 9876543211",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400",
        location: { coordinates: [82.9839, 25.3276], address: "456 Park Avenue", city: "Varanasi", state: "Uttar Pradesh" },
        inventory: [
          { item: "Sanitary Pads", quantity: 300, minRequired: 100 },
          { item: "Hygiene Kits", quantity: 100, minRequired: 30 }
        ],
        verified: true, rating: 4.5, totalDonations: 12000, beneficiariesServed: 1800
      },
      {
        name: "Red Dot Movement",
        description: "Breaking the stigma around menstruation one conversation at a time.",
        email: "hello@reddot.org",
        phone: "+91 9876543212",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400",
        location: { coordinates: [82.9639, 25.3076], address: "789 Community Center", city: "Varanasi", state: "Uttar Pradesh" },
        inventory: [
          { item: "Sanitary Pads", quantity: 800, minRequired: 200 },
          { item: "Menstrual Cups", quantity: 150, minRequired: 50 }
        ],
        verified: true, rating: 4.9, totalDonations: 25000, beneficiariesServed: 4000
      }
    ];

    await NGO.deleteMany({});
    await NGO.insertMany(ngos);

    const campaigns = [
      {
        title: "Pad the Difference",
        description: "Help us distribute 10,000 sanitary pads to rural schools.",
        ngo: (await NGO.findOne({ name: "Period Care Foundation" }))._id,
        targetAmount: 50000, raisedAmount: 32000,
        targetItems: [{ item: "Sanitary Pads", targetQuantity: 10000, currentQuantity: 6400 }],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        urgency: "high",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800"
      }
    ];
    
    await Campaign.deleteMany({});
    await Campaign.insertMany(campaigns);

    const blogs = [
      {
        title: "Breaking the Silence: Why Period Talk Matters",
        content: "Menstruation is natural, yet millions face stigma...",
        excerpt: "Understanding open conversations about menstrual health.",
        category: "education", featured: true,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
      }
    ];
    
    await Blog.deleteMany({});
    await Blog.insertMany(blogs);

    res.json({ success: true, message: 'Database seeded!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
