import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  celsiusToFahrenheit,
  formatTemperature,
  formatTime,
  formatDayName,
  formatHour,
  formatWindDirection,
  formatVisibility,
  formatDuration,
} from '../src/utils/formatters.js';
import {
  getWeatherDescription,
  getWeatherIconName,
  isPrecipitation,
} from '../src/utils/weatherCodes.js';

describe('Formatters Utility', () => {
  test('celsiusToFahrenheit converts temperatures correctly', () => {
    assert.equal(celsiusToFahrenheit(0), 32);
    assert.equal(celsiusToFahrenheit(100), 212);
    assert.equal(celsiusToFahrenheit(20), 68);
    assert.equal(celsiusToFahrenheit(-10), 14);
  });

  test('formatTemperature outputs formatted strings for C and F', () => {
    assert.equal(formatTemperature(null), '--');
    assert.equal(formatTemperature(undefined), '--');
    assert.equal(formatTemperature(22.4, 'C'), '22°C');
    assert.equal(formatTemperature(20, 'F'), '68°F');
  });

  test('formatTime extracts and formats local ISO timestamps', () => {
    assert.equal(formatTime(''), '--');
    assert.equal(formatTime('2024-11-07T15:30'), '3:30 PM');
    assert.equal(formatTime('2024-11-07T06:05'), '6:05 AM');
    assert.equal(formatTime('2024-11-07T00:00'), '12:00 AM');
    assert.equal(formatTime('2024-11-07T12:00'), '12:00 PM');
  });

  test('formatHour extracts formatted hour strings', () => {
    assert.equal(formatHour('2024-11-07T15:30'), '3 PM');
    assert.equal(formatHour('2024-11-07T09:00'), '9 AM');
    assert.equal(formatHour(''), '--');
  });

  test('formatDayName produces day string', () => {
    assert.equal(typeof formatDayName('2024-11-07'), 'string');
    assert.notEqual(formatDayName('2024-11-07'), '--');
    assert.equal(formatDayName(''), '--');
  });

  test('formatWindDirection maps degrees to compass points', () => {
    assert.equal(formatWindDirection(0), 'N');
    assert.equal(formatWindDirection(90), 'E');
    assert.equal(formatWindDirection(180), 'S');
    assert.equal(formatWindDirection(270), 'W');
    assert.equal(formatWindDirection(null), '--');
  });

  test('formatVisibility converts meters to km or m', () => {
    assert.equal(formatVisibility(10000), '10.0 km');
    assert.equal(formatVisibility(800), '800 m');
    assert.equal(formatVisibility(null), '--');
  });

  test('formatDuration formats seconds to human readable hours and minutes', () => {
    assert.equal(formatDuration(3660), '1h 1m');
    assert.equal(formatDuration(7200), '2h 0m');
    assert.equal(formatDuration(0), '--');
  });
});

describe('Weather Codes Utility', () => {
  test('getWeatherDescription returns accurate condition names', () => {
    assert.equal(getWeatherDescription(0), 'Clear Sky');
    assert.equal(getWeatherDescription(61), 'Light Rain');
    assert.equal(getWeatherDescription(95), 'Thunderstorm');
    assert.equal(getWeatherDescription(9999), 'Unknown Condition');
  });

  test('getWeatherIconName returns valid icon names', () => {
    assert.equal(getWeatherIconName(0), 'Sun');
    assert.equal(getWeatherIconName(61), 'CloudRain');
    assert.equal(getWeatherIconName(95), 'CloudLightning');
    assert.equal(getWeatherIconName(9999), 'Cloud');
  });

  test('isPrecipitation correctly identifies precipitation events', () => {
    assert.equal(isPrecipitation(0), false);
    assert.equal(isPrecipitation(3), false);
    assert.equal(isPrecipitation(51), true);
    assert.equal(isPrecipitation(65), true);
    assert.equal(isPrecipitation(75), true);
  });
});
