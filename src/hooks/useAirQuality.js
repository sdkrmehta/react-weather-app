import { useState, useEffect, useCallback } from 'react';
import { fetchAirQuality } from '../api/weatherService';

/**
 * Fetches air quality data for a given lat/lon whenever the coordinates change.
 *
 * AQI is fetched separately from main weather because it's non-critical —
 * a failure here must never break the rest of the dashboard.
 *
 * Returns:
 *   { aqData, aqLoading, aqError, refetch }
 */
export function useAirQuality(latitude, longitude) {
  const [aqData, setAqData]       = useState(null);
  const [aqLoading, setAqLoading] = useState(false);
  const [aqError, setAqError]     = useState(null);

  const refetch = useCallback(async (lat, lon) => {
    if (lat == null || lon == null) return;
    setAqLoading(true);
    setAqError(null);
    try {
      const data = await fetchAirQuality(lat, lon);
      setAqData(data);
    } catch (err) {
      // Non-fatal — log quietly
      console.warn('Air quality fetch failed:', err.message);
      setAqError(err.message ?? 'Air quality data unavailable.');
      setAqData(null);
    } finally {
      setAqLoading(false);
    }
  }, []);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      refetch(latitude, longitude);
    }
  }, [latitude, longitude, refetch]);

  return { aqData, aqLoading, aqError, refetch };
}
