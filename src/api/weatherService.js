import { API_URLS } from '../utils/constants.js';

// ─── Current weather variables requested from Open-Meteo ─────────────────────
const CURRENT_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'pressure_msl',
  'surface_pressure',
  'visibility',
  'uv_index',
].join(',');

// ─── Hourly variables (next 48 h) ────────────────────────────────────────────
const HOURLY_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
].join(',');

// ─── Daily variables (next 7 days) ───────────────────────────────────────────
const DAILY_VARS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'daylight_duration',
  'uv_index_max',
  'precipitation_probability_max',
  'precipitation_sum',
  'wind_speed_10m_max',
].join(',');

// ─── In-memory cache with TTL ────────────────────────────────────────────────
const weatherCache = new Map();
const airQualityCache = new Map();

const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;       // 5 minutes
const AQ_CACHE_TTL_MS      = 15 * 60 * 1000;      // 15 minutes

function getCacheKey(lat, lon) {
  return `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;
}

/**
 * Fetches a complete weather payload for a given latitude/longitude.
 * Uses an in-memory TTL cache to prevent redundant network requests.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {boolean} bypassCache - Pass true on explicit user refresh
 * @returns {Promise<object>}
 */
export async function fetchWeather(latitude, longitude, bypassCache = false) {
  const cacheKey = getCacheKey(latitude, longitude);
  const now = Date.now();

  if (!bypassCache && weatherCache.has(cacheKey)) {
    const entry = weatherCache.get(cacheKey);
    if (now - entry.timestamp < WEATHER_CACHE_TTL_MS) {
      return entry.data;
    }
  }

  const url = new URL(`${API_URLS.WEATHER}/forecast`);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', CURRENT_VARS);
  url.searchParams.set('hourly', HOURLY_VARS);
  url.searchParams.set('daily', DAILY_VARS);
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '16');
  url.searchParams.set('past_days', '14');
  url.searchParams.set('wind_speed_unit', 'kmh');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status})`);
  }

  const data = await response.json();

  // Normalize daily so data.daily starts from today (index 0) for all standard views,
  // while preserving the full 30-day timeline (14 days past + 16 days forward) in daily30.
  if (data.daily && Array.isArray(data.daily.time)) {
    data.daily30 = { ...data.daily };
    const todayStr = (data.current?.time ?? '').slice(0, 10);
    const todayDailyIdx = Math.max(0, data.daily.time.findIndex((t) => t >= todayStr));

    const upcomingDaily = {};
    for (const [key, val] of Object.entries(data.daily)) {
      upcomingDaily[key] = Array.isArray(val) ? val.slice(todayDailyIdx) : val;
    }
    data.daily = upcomingDaily;
  }

  weatherCache.set(cacheKey, { timestamp: now, data });
  return data;
}

/**
 * Fetches air quality data (AQI, PM2.5, PM10, etc.) for a given location.
 * Cached for 15 minutes.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {boolean} bypassCache
 * @returns {Promise<object>}
 */
export async function fetchAirQuality(latitude, longitude, bypassCache = false) {
  const cacheKey = getCacheKey(latitude, longitude);
  const now = Date.now();

  if (!bypassCache && airQualityCache.has(cacheKey)) {
    const entry = airQualityCache.get(cacheKey);
    if (now - entry.timestamp < AQ_CACHE_TTL_MS) {
      return entry.data;
    }
  }

  const url = new URL(`${API_URLS.AIR_QUALITY}/air-quality`);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', [
    'european_aqi',
    'us_aqi',
    'pm10',
    'pm2_5',
    'carbon_monoxide',
    'nitrogen_dioxide',
    'ozone',
  ].join(','));
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url.toString());

  if (!response.ok) {
    console.warn(`Air quality request failed (${response.status})`);
    return null;
  }

  const data = await response.json();
  airQualityCache.set(cacheKey, { timestamp: now, data });
  return data;
}

/**
 * Clears in-memory weather and air quality caches.
 * Useful for unit testing or full cache invalidation.
 */
export function clearWeatherCache() {
  weatherCache.clear();
  airQualityCache.clear();
}

/**
 * Returns the internal weather cache Map (useful for unit tests).
 */
export function getWeatherCache() {
  return weatherCache;
}

export { WEATHER_CACHE_TTL_MS, AQ_CACHE_TTL_MS, getCacheKey };

