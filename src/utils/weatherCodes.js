/**
 * WMO Weather Interpretation Codes → human-readable labels.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
export const WMO_CODES = {
  0:  { description: 'Clear Sky',                    icon: 'Sun' },
  1:  { description: 'Mainly Clear',                 icon: 'Sun' },
  2:  { description: 'Partly Cloudy',                icon: 'CloudSun' },
  3:  { description: 'Overcast',                     icon: 'Cloud' },
  45: { description: 'Foggy',                        icon: 'CloudFog' },
  48: { description: 'Icy Fog',                      icon: 'CloudFog' },
  51: { description: 'Light Drizzle',                icon: 'CloudDrizzle' },
  53: { description: 'Moderate Drizzle',             icon: 'CloudDrizzle' },
  55: { description: 'Dense Drizzle',                icon: 'CloudDrizzle' },
  56: { description: 'Freezing Light Drizzle',       icon: 'CloudSnow' },
  57: { description: 'Freezing Dense Drizzle',       icon: 'CloudSnow' },
  61: { description: 'Light Rain',                   icon: 'CloudRain' },
  63: { description: 'Moderate Rain',                icon: 'CloudRain' },
  65: { description: 'Heavy Rain',                   icon: 'CloudRain' },
  66: { description: 'Freezing Light Rain',          icon: 'CloudSnow' },
  67: { description: 'Freezing Heavy Rain',          icon: 'CloudSnow' },
  71: { description: 'Light Snow',                   icon: 'CloudSnow' },
  73: { description: 'Moderate Snow',                icon: 'CloudSnow' },
  75: { description: 'Heavy Snow',                   icon: 'CloudSnow' },
  77: { description: 'Snow Grains',                  icon: 'CloudSnow' },
  80: { description: 'Light Rain Showers',           icon: 'CloudRain' },
  81: { description: 'Moderate Rain Showers',        icon: 'CloudRain' },
  82: { description: 'Violent Rain Showers',         icon: 'CloudRain' },
  85: { description: 'Light Snow Showers',           icon: 'CloudSnow' },
  86: { description: 'Heavy Snow Showers',           icon: 'CloudSnow' },
  95: { description: 'Thunderstorm',                 icon: 'CloudLightning' },
  96: { description: 'Thunderstorm with Hail',       icon: 'CloudLightning' },
  99: { description: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning' },
};

/**
 * Returns the human-readable description for a WMO weather code.
 * Falls back gracefully when the code is unrecognised.
 */
export function getWeatherDescription(code) {
  return WMO_CODES[code]?.description ?? 'Unknown Condition';
}

/**
 * Returns the Lucide icon name for a WMO weather code.
 * Falls back to 'Cloud' when the code is unrecognised.
 */
export function getWeatherIconName(code) {
  return WMO_CODES[code]?.icon ?? 'Cloud';
}

/**
 * Determines whether a WMO code represents a precipitation event.
 */
export function isPrecipitation(code) {
  return code >= 51;
}
