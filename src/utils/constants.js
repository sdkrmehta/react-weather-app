// API base URLs — Open-Meteo is free and requires no API key
export const API_URLS = {
  WEATHER: 'https://api.open-meteo.com/v1',
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1',
  AIR_QUALITY: 'https://air-quality-api.open-meteo.com/v1',
};

// Default city shown before the user searches (Ranchi, Jharkhand, India)
export const DEFAULT_LOCATION = {
  name: 'Ranchi',
  country: 'India',
  country_code: 'IN',
  latitude: 23.3441,
  longitude: 85.3096,
};

// Temperature unit identifiers
export const UNITS = {
  CELSIUS: 'C',
  FAHRENHEIT: 'F',
};

// localStorage keys — centralised so they never drift out of sync
export const STORAGE_KEYS = {
  UNIT: 'weather_unit',
  THEME: 'weather_theme',
  FAVOURITES: 'weather_favourites',
  RECENT_SEARCHES: 'weather_recent',
};
