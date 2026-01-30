import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Loader2, Navigation, Phone, Mail, Globe, Star,
  AlertCircle, RefreshCw, Filter, ChevronDown, ExternalLink, X,
  Building, Verified, Heart, Clock, Users, Package
} from 'lucide-react';
import useGeolocation from '../hooks/useGeolocation';

const API_URL = import.meta.env.VITE_API_URL || '';

// Distance formatter
const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

// NGO List Item Component
const NGOListItem = ({ ngo, onSelect, isSelected }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ scale: 1.02 }}
    onClick={() => onSelect(ngo)}
    className={`bg-white rounded-2xl p-5 cursor-pointer transition-all border-2 ${
      isSelected ? 'border-rose-500 shadow-lg' : 'border-transparent shadow-md hover:shadow-lg'
    }`}
  >
    <div className="flex gap-4">
      {/* Image/Icon */}
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center flex-shrink-0">
        {ngo.image ? (
          <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <Building className="text-rose-500" size={28} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 truncate flex items-center gap-2">
            {ngo.name}
            {ngo.verified && (
              <span className="text-green-500"><Verified size={16} /></span>
            )}
          </h3>
          {ngo.distance !== undefined && (
            <span className="text-sm text-gray-500 flex items-center gap-1 flex-shrink-0">
              <MapPin size={14} />
              {formatDistance(ngo.distance)}
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-sm text-gray-500 mt-1 truncate">
          {ngo.location?.address || ngo.location?.city || 'Address not available'}
          {ngo.location?.city && ngo.location?.state && `, ${ngo.location.city}, ${ngo.location.state}`}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-3 mt-2 text-xs">
          {ngo.source === 'database' && (
            <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-medium">
              Partner NGO
            </span>
          )}
          {ngo.source === 'openstreetmap' && (
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              Community
            </span>
          )}
          {ngo.rating > 0 && (
            <span className="flex items-center gap-1 text-amber-500">
              <Star size={12} fill="currentColor" /> {ngo.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// NGO Detail Panel
const NGODetailPanel = ({ ngo, onClose, onDonate }) => {
  if (!ngo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-br from-rose-500 to-pink-600">
        {ngo.image && (
          <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            {ngo.verified && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Verified size={12} /> Verified
              </span>
            )}
            {ngo.source === 'openstreetmap' && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                OpenStreetMap
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">{ngo.name}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {ngo.description && (
          <p className="text-gray-600 mb-6">{ngo.description}</p>
        )}

        {/* Stats */}
        {(ngo.totalDonations > 0 || ngo.beneficiariesServed > 0) && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-rose-50 rounded-xl">
              <div className="text-rose-600 font-bold text-lg">{ngo.totalDonations?.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-500">Donations</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-blue-600 font-bold text-lg">{ngo.beneficiariesServed?.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-500">Helped</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="text-amber-600 font-bold text-lg flex items-center justify-center gap-1">
                <Star size={14} fill="currentColor" /> {ngo.rating || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900">Contact Information</h3>
          
          {ngo.location?.address && (
            <div className="flex items-start gap-3 text-gray-600">
              <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {ngo.location.address}
                {ngo.location.city && `, ${ngo.location.city}`}
                {ngo.location.state && `, ${ngo.location.state}`}
              </span>
            </div>
          )}
          
          {ngo.phone && (
            <a href={`tel:${ngo.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-rose-500 transition">
              <Phone size={18} className="text-gray-400" />
              <span className="text-sm">{ngo.phone}</span>
            </a>
          )}
          
          {ngo.email && (
            <a href={`mailto:${ngo.email}`} className="flex items-center gap-3 text-gray-600 hover:text-rose-500 transition">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm">{ngo.email}</span>
            </a>
          )}
          
          {ngo.website && (
            <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-rose-500 transition">
              <Globe size={18} className="text-gray-400" />
              <span className="text-sm flex items-center gap-1">
                Visit Website <ExternalLink size={12} />
              </span>
            </a>
          )}
        </div>

        {/* Inventory */}
        {ngo.inventory && ngo.inventory.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package size={18} /> Current Inventory
            </h3>
            <div className="space-y-3">
              {ngo.inventory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">{item.item}</span>
                  <span className="text-rose-600 font-bold">{item.quantity} units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {ngo.source === 'database' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDonate(ngo)}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Heart size={18} /> Donate Now
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${ngo.location?.coordinates?.[1]},${ngo.location?.coordinates?.[0]}`;
              window.open(url, '_blank');
            }}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Navigation size={18} /> Get Directions
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main NGO Finder Component
const NGOFinder = ({ onDonate, user }) => {
  const { location, address, error: geoError, loading: geoLoading, getLocation } = useGeolocation();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [radius, setRadius] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [manualLocation, setManualLocation] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use either manual location or GPS location
  const activeLocation = manualLocation || location;

  // Fetch NGOs when location changes
  useEffect(() => {
    if (activeLocation) {
      fetchNearbyNGOs(activeLocation);
    } else {
      // Fetch all NGOs if no location
      fetchAllNGOs();
    }
  }, [activeLocation, radius, sourceFilter]);

  const fetchAllNGOs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ngos`);
      const data = await res.json();
      if (data.success) {
        setNgos(data.data);
      }
    } catch (err) {
      setError('Failed to fetch NGOs');
    }
    setLoading(false);
  };

  const fetchNearbyNGOs = async (loc) => {
    if (!loc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        `${API_URL}/api/ngos?lat=${loc.lat}&lng=${loc.lng}&radius=${radius}&source=${sourceFilter}`
      );
      const data = await res.json();
      
      if (data.success) {
        setNgos(data.data);
      } else {
        setError(data.error || 'Failed to fetch NGOs');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  // Search for location suggestions as user types
  const handleLocationSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/ngos/geocode/forward?address=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.success && data.data.length > 0) {
        setLocationSuggestions(data.data);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  };

  // Select a location from suggestions
  const selectLocation = (loc) => {
    setManualLocation({ lat: loc.lat, lng: loc.lng });
    setSearchQuery(loc.displayName.split(',')[0]);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  // Text-based search for NGO names
  const handleTextSearch = async () => {
    if (!searchQuery.trim()) {
      if (activeLocation) fetchNearbyNGOs(activeLocation);
      else fetchAllNGOs();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/ngos/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.success) {
        setNgos(data.data);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    }
    
    setLoading(false);
  };

  const clearLocation = () => {
    setManualLocation(null);
    setSearchQuery('');
    fetchAllNGOs();
  };

  const filteredNGOs = ngos;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Find NGOs Near You</h1>
          <p className="text-gray-600">Discover organizations making a difference in your community</p>
        </motion.div>

        {/* Location Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Location Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={getLocation}
              disabled={geoLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-3 rounded-xl font-medium shadow-lg disabled:opacity-50"
            >
              {geoLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Navigation size={20} />
              )}
              {geoLoading ? 'Getting Location...' : 'Use My Location'}
            </motion.button>

            {/* Current Location Display */}
            {address && (
              <div className="flex items-center gap-2 text-gray-600 flex-1">
                <MapPin size={18} className="text-rose-500" />
                <span className="text-sm truncate">
                  {address.city || address.address?.split(',')[0]}
                  {address.state && `, ${address.state}`}
                </span>
              </div>
            )}

            {/* Search Bar with Location Suggestions */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter city, address, or NGO name..."
                value={searchQuery}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()}
                onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={clearLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
              
              {/* Location Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && locationSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {locationSuggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectLocation(loc)}
                        className="w-full px-4 py-3 text-left hover:bg-rose-50 flex items-start gap-3 border-b border-gray-50 last:border-0"
                      >
                        <MapPin size={18} className="text-rose-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 line-clamp-2">{loc.displayName}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition ${
                showFilters ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
              }`}
            >
              <Filter size={18} />
              Filters
              <ChevronDown className={`transition ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap gap-4">
                  {/* Radius Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Search Radius</label>
                    <div className="flex gap-2">
                      {[5000, 10000, 25000, 50000].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadius(r)}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            radius === r ? 'bg-rose-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {r / 1000}km
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Source Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Source</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'all', label: 'All' },
                        { value: 'database', label: 'Partner NGOs' },
                        { value: 'openstreetmap', label: 'Community' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSourceFilter(opt.value)}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            sourceFilter === opt.value ? 'bg-rose-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error States */}
        <AnimatePresence>
          {(geoError || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <span className="text-red-700">{geoError || error}</span>
              <button
                onClick={() => { setError(null); getLocation(); }}
                className="ml-auto text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <RefreshCw size={16} /> Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* NGO List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-gray-700">
                {loading ? 'Searching...' : `${filteredNGOs.length} NGOs Found`}
                {activeLocation && (
                  <span className="text-gray-400 font-normal text-sm ml-2">
                    (sorted by distance)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3">
                {manualLocation && (
                  <span className="text-sm text-rose-600 flex items-center gap-1">
                    <MapPin size={14} /> {searchQuery || 'Custom Location'}
                  </span>
                )}
                <button
                  onClick={() => activeLocation ? fetchNearbyNGOs(activeLocation) : fetchAllNGOs()}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-sm"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-rose-500 mb-4" size={48} />
                <p className="text-gray-500">Finding NGOs near you...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredNGOs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No NGOs Found</h3>
                <p className="text-gray-500 mb-4">
                  {!location ? 'Enable location access to find nearby NGOs' : 'Try adjusting your filters or search radius'}
                </p>
                {!location && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={getLocation}
                    className="bg-rose-500 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Enable Location
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* NGO List */}
            {!loading && filteredNGOs.length > 0 && (
              <motion.div layout className="space-y-4">
                <AnimatePresence>
                  {filteredNGOs.map((ngo) => (
                    <NGOListItem
                      key={ngo._id}
                      ngo={ngo}
                      onSelect={setSelectedNGO}
                      isSelected={selectedNGO?._id === ngo._id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                {selectedNGO ? (
                  <NGODetailPanel
                    key={selectedNGO._id}
                    ngo={selectedNGO}
                    onClose={() => setSelectedNGO(null)}
                    onDonate={onDonate}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-3xl shadow-lg p-8 text-center"
                  >
                    <Building size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-semibold text-gray-700 mb-2">Select an NGO</h3>
                    <p className="text-gray-500 text-sm">
                      Click on any NGO from the list to view details
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOFinder;
