import { useState, useCallback } from 'react';

/**
 * Wraps the browser Geolocation API in a promise-based hook.
 *
 * Usage:
 *   const { loading, error, getCurrentPosition } = useGeolocation();
 *   const coords = await getCurrentPosition(); // { latitude, longitude }
 */
export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by your browser.';
        setError(msg);
        reject(new Error(msg));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setLoading(false);
          let message = 'Unable to retrieve your location.';
          if (err.code === 1) message = 'Location access denied. Please allow location access in your browser and try again.';
          if (err.code === 2) message = 'Location unavailable. Please check your device settings.';
          if (err.code === 3) message = 'Location request timed out. Please try again.';
          setError(message);
          reject(new Error(message));
        },
        { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
      );
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, getCurrentPosition, clearError };
}
