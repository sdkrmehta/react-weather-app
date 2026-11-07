import { API_URLS } from '../utils/constants.js';

// ─── In-memory cache for search & reverse geocoding ──────────────────────────
const searchCache = new Map();
const reverseGeoCache = new Map();

const SEARCH_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const REVERSE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Search for cities by name using the Open-Meteo Geocoding API.
 * Uses an in-memory cache to prevent redundant queries.
 *
 * @param {string} query  - City name typed by the user
 * @param {number} count  - Maximum number of results to return (default 6)
 * @returns {Promise<Array>}
 */
export async function searchCities(query, count = 6) {
  const trimmed = query?.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = `${trimmed}:${count}`;
  const now = Date.now();
  if (searchCache.has(cacheKey)) {
    const entry = searchCache.get(cacheKey);
    if (now - entry.timestamp < SEARCH_CACHE_TTL_MS) {
      return entry.data;
    }
  }

  const url = new URL(`${API_URLS.GEOCODING}/search`);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', count);
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Geocoding request failed (${response.status})`);

  const data = await response.json();
  const results = data.results ?? [];
  searchCache.set(cacheKey, { timestamp: now, data: results });
  return results;
}

/**
 * Builds a display label for a geocoded result.
 * e.g. "London, England, United Kingdom"
 *
 * @param {object} result - A single geocoding result object
 * @returns {string}
 */
export function formatLocationLabel(result) {
  const parts = [result.name];
  if (result.admin1) parts.push(result.admin1);
  if (result.country) parts.push(result.country);
  return parts.join(', ');
}

/**
 * Reverse geocodes a lat/lon pair into a human-readable city name.
 * Uses the Nominatim API (OpenStreetMap) — free, no API key required.
 * Caches coordinates for 24 hours.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ name: string, latitude: number, longitude: number }>}
 */
export async function reverseGeocode(latitude, longitude) {
  const cacheKey = `${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`;
  const now = Date.now();
  if (reverseGeoCache.has(cacheKey)) {
    const entry = reverseGeoCache.get(cacheKey);
    if (now - entry.timestamp < REVERSE_CACHE_TTL_MS) {
      return entry.data;
    }
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'json');
  url.searchParams.set('lat', latitude);
  url.searchParams.set('lon', longitude);
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('zoom', '10'); // city-level zoom

  const response = await fetch(url.toString(), {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'WeatherApp/1.0 (open-source weather demo)',
    },
  });

  if (!response.ok) throw new Error(`Reverse geocoding failed (${response.status})`);

  const data = await response.json();
  const addr = data.address ?? {};

  // Prefer city → town → village → suburb → county as the primary name
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.county ||
    data.name ||
    'Unknown Location';

  const parts = [city];
  if (addr.state && addr.state !== city) parts.push(addr.state);
  if (addr.country) parts.push(addr.country);

  const result = {
    name: parts.join(', '),
    latitude,
    longitude,
  };

  reverseGeoCache.set(cacheKey, { timestamp: now, data: result });
  return result;
}
