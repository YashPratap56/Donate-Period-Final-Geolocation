import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(coords);

        // Reverse geocode to get address
        try {
          const res = await fetch(
            `${API_URL}/api/ngos/geocode/reverse?lat=${coords.lat}&lng=${coords.lng}`
          );
          const data = await res.json();
          if (data.success) {
            setAddress(data.data);
          }
        } catch (err) {
          console.error('Geocoding error:', err);
        }

        setLoading(false);
      },
      (err) => {
        setError(getErrorMessage(err));
        setLoading(false);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0
      }
    );
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Please enable location access.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred.';
    }
  };

  return { location, address, error, loading, getLocation };
};

export default useGeolocation;
