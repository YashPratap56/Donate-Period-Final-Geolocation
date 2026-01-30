const NGO = require('../models/ngoModel');

// Helper: Fetch NGOs from OpenStreetMap (free, no API key)
const fetchFromOpenStreetMap = async (lat, lng, radius = 10000) => {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="social_facility"](around:${radius},${lat},${lng});
        node["office"="ngo"](around:${radius},${lat},${lng});
        node["office"="association"](around:${radius},${lat},${lng});
        node["healthcare"](around:${radius},${lat},${lng});
        way["amenity"="social_facility"](around:${radius},${lat},${lng});
        way["office"="ngo"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const data = await response.json();
    
    return data.elements
      .filter(el => el.tags && el.tags.name)
      .map(el => ({
        _id: `osm_${el.id}`,
        name: el.tags.name,
        description: el.tags.description || el.tags['amenity'] || 'Community Organization',
        email: el.tags.email || el.tags['contact:email'] || null,
        phone: el.tags.phone || el.tags['contact:phone'] || null,
        website: el.tags.website || el.tags['contact:website'] || null,
        location: {
          type: 'Point',
          coordinates: [el.lon, el.lat],
          address: el.tags['addr:full'] || el.tags['addr:street'] || '',
          city: el.tags['addr:city'] || '',
          state: el.tags['addr:state'] || ''
        },
        source: 'openstreetmap',
        verified: false,
        rating: 0,
        inventory: []
      }));
  } catch (error) {
    console.error('OpenStreetMap API error:', error);
    return [];
  }
};

// Helper: Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 1. Get Nearby NGOs (combines MongoDB + OpenStreetMap)
const getNearbyNGOs = async (req, res) => {
  try {
    const { lat, lng, radius = 50000, source = 'all' } = req.query;
    
    // If no coordinates, return all from database
    if (!lat || !lng) {
      const allNgos = await NGO.find();
      return res.status(200).json({ success: true, data: allNgos });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseInt(radius);

    let results = [];

    // Fetch from MongoDB (our verified NGOs) - ALWAYS include all database NGOs
    if (source === 'all' || source === 'database') {
      const allDbNgos = await NGO.find();
      results = allDbNgos.map(ngo => ({
        ...ngo.toObject(),
        source: 'database',
        distance: ngo.location?.coordinates ? calculateDistance(
          latitude, longitude,
          ngo.location.coordinates[1], ngo.location.coordinates[0]
        ) : 999
      }));
    }

    // Fetch from OpenStreetMap (free external API) - for nearby community orgs
    if (source === 'all' || source === 'openstreetmap') {
      try {
        const osmNgos = await fetchFromOpenStreetMap(latitude, longitude, searchRadius);
        const osmWithDistance = osmNgos.map(ngo => ({
          ...ngo,
          distance: calculateDistance(
            latitude, longitude,
            ngo.location.coordinates[1], ngo.location.coordinates[0]
          )
        }));
        results = [...results, ...osmWithDistance];
      } catch (osmError) {
        console.error('OpenStreetMap fetch error:', osmError);
      }
    }

    // Sort by distance
    results.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ 
      success: true, 
      count: results.length, 
      userLocation: { lat: latitude, lng: longitude },
      data: results 
    });
  } catch (error) {
    console.error('getNearbyNGOs error:', error);
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// 2. Update Inventory (NEW FEATURE)
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params; // The NGO's ID
    const { inventory } = req.body; // The new list of items

    const updatedNGO = await NGO.findByIdAndUpdate(
      id, 
      { inventory }, 
      { new: true } // Return the updated document
    );

    res.status(200).json({ success: true, data: updatedNGO });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Update Failed' });
  }
};

// 3. Forward Geocode - Get coordinates from address (free via Nominatim)
const forwardGeocode = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ success: false, error: 'Address required' });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
      { headers: { 'User-Agent': 'DonatePeriod/1.0' } }
    );
    
    const data = await response.json();
    
    if (data.length === 0) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    const results = data.map(item => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      type: item.type
    }));

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Geocoding failed' });
  }
};

// 4. Reverse Geocode - Get address from coordinates (free via Nominatim)
const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Coordinates required' });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { 'User-Agent': 'DonatePeriod/1.0' } }
    );
    
    const data = await response.json();
    
    res.status(200).json({
      success: true,
      data: {
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        country: data.address?.country || '',
        postcode: data.address?.postcode || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Geocoding failed' });
  }
};

// 4. Search NGOs by text (name, city)
const searchNGOs = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query required' });
    }

    const ngos = await NGO.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'location.city': { $regex: q, $options: 'i' } },
        { 'location.state': { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};

// 5. Get single NGO by ID
const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ success: false, error: 'NGO not found' });
    }
    res.status(200).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { getNearbyNGOs, updateInventory, forwardGeocode, reverseGeocode, searchNGOs, getNGOById };