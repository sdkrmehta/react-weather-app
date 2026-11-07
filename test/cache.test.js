import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchWeather,
  clearWeatherCache,
  getWeatherCache,
  getCacheKey,
  WEATHER_CACHE_TTL_MS,
} from '../src/api/weatherService.js';

describe('Weather API In-Memory Cache', () => {
  let originalFetch;
  let fetchCallCount = 0;

  beforeEach(() => {
    clearWeatherCache();
    fetchCallCount = 0;
    originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      fetchCallCount++;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          mock: true,
          callCount: fetchCallCount,
          url: url.toString(),
        }),
      };
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    clearWeatherCache();
  });

  test('getCacheKey formats latitude and longitude to 3 decimal points', () => {
    assert.equal(getCacheKey(23.3441, 85.3096), '23.344,85.310');
    assert.equal(getCacheKey(49.2827, -123.1207), '49.283,-123.121');
  });

  test('fetchWeather caches responses and prevents duplicate HTTP calls', async () => {
    const lat = 23.3441;
    const lon = 85.3096;

    // First call: should hit network
    const res1 = await fetchWeather(lat, lon);
    assert.equal(fetchCallCount, 1);
    assert.equal(res1.callCount, 1);

    // Second call: should read from cache
    const res2 = await fetchWeather(lat, lon);
    assert.equal(fetchCallCount, 1);
    assert.equal(res2.callCount, 1);
  });

  test('fetchWeather with bypassCache=true forces network request', async () => {
    const lat = 23.3441;
    const lon = 85.3096;

    await fetchWeather(lat, lon);
    assert.equal(fetchCallCount, 1);

    // Force bypass
    const resBypass = await fetchWeather(lat, lon, true);
    assert.equal(fetchCallCount, 2);
    assert.equal(resBypass.callCount, 2);
  });

  test('cache entry expires when timestamp exceeds TTL', async () => {
    const lat = 23.3441;
    const lon = 85.3096;

    await fetchWeather(lat, lon);
    assert.equal(fetchCallCount, 1);

    // Artificially age the cache entry
    const cache = getWeatherCache();
    const key = getCacheKey(lat, lon);
    const entry = cache.get(key);
    assert.ok(entry);
    entry.timestamp = Date.now() - (WEATHER_CACHE_TTL_MS + 1000);

    // Next call should detect expired entry and refetch
    await fetchWeather(lat, lon);
    assert.equal(fetchCallCount, 2);
  });

  test('clearWeatherCache clears all entries', async () => {
    const lat = 23.3441;
    const lon = 85.3096;

    await fetchWeather(lat, lon);
    assert.equal(getWeatherCache().size, 1);

    clearWeatherCache();
    assert.equal(getWeatherCache().size, 0);
  });
});
