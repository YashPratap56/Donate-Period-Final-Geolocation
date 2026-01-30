const express = require('express');
const router = express.Router();
const { 
  getNearbyNGOs, 
  updateInventory, 
  forwardGeocode,
  reverseGeocode, 
  searchNGOs,
  getNGOById 
} = require('../controllers/ngoController');

// Get nearby NGOs (supports lat, lng, radius, source query params)
router.get('/', getNearbyNGOs);

// Search NGOs by text
router.get('/search', searchNGOs);

// Forward geocode address to coordinates
router.get('/geocode/forward', forwardGeocode);

// Reverse geocode coordinates to address
router.get('/geocode/reverse', reverseGeocode);

// Get single NGO by ID
router.get('/:id', getNGOById);

// Update NGO Inventory
router.put('/:id', updateInventory);

module.exports = router;
