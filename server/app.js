const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
const app = express();

app.use(express.json());
app.use(cors({ 
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
    /\.vercel\.app$/
  ].filter(Boolean),
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/donate_period')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Routes
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatroutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

module.exports = app;
