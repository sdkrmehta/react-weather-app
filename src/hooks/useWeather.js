import { useState, useCallback, useRef } from 'react';
import { fetchWeather } from '../api/weatherService';
import { searchCities } from '../api/geocodingService';

/**
 * Manages all weather state: data, location, loading, and error.
 *
 * Exposes two fetch strategies:
 *   fetchForCoords(lat, lon, name) — used by geolocation and default city
 *   searchByCity(cityName)         — geocodes then fetches
 *   refresh()                      — re-fetches the current location's weather
 */
export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // Track the last fetched coords so refresh() can replay the same call
  const lastCoordsRef = useRef(null);

  const fetchForCoords = useCallback(async (latitude, longitude, locationName, bypassCache = false) => {
    setLoading(true);
    setError(null);
    lastCoordsRef.current = { latitude, longitude, locationName };
    try {
      const data = await fetchWeather(latitude, longitude, bypassCache);
      setWeatherData(data);
      setLocation({
        latitude,
        longitude,
        name: locationName ?? `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      });
    } catch (err) {
      setError(err.message ?? 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Re-fetches weather for the currently displayed location. No-op if no location is loaded. */
  const refresh = useCallback(() => {
    const last = lastCoordsRef.current;
    if (!last) return;
    fetchForCoords(last.latitude, last.longitude, last.locationName, true);
  }, [fetchForCoords]);

  const searchByCity = useCallback(async (cityName) => {
    if (!cityName?.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await searchCities(cityName.trim(), 1);
      if (!results.length) {
        throw new Error(
          `No city found for "${cityName}". Try checking the spelling or using a nearby city.`
        );
      }
      const { latitude, longitude, name, country, admin1 } = results[0];
      const locationName = [name, admin1, country].filter(Boolean).join(', ');
      const data = await fetchWeather(latitude, longitude);
      setWeatherData(data);
      setLocation({ latitude, longitude, name: locationName });
    } catch (err) {
      setError(err.message ?? 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { weatherData, location, loading, error, fetchForCoords, searchByCity, clearError, refresh };
}
