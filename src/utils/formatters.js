/**
 * Shared formatting utilities — date/time, temperature, wind, visibility.
 *
 * IMPORTANT – Open-Meteo returns times as local-time ISO strings WITHOUT a
 * timezone offset (e.g. "2024-11-07T14:00"). Using `new Date(str)` on these
 * treats them as the *browser's* local time, which is wrong for distant cities.
 * All time/date helpers here extract values directly from the string to avoid
 * any UTC ↔ local conversion.
 */

// ─── Temperature ─────────────────────────────────────────────────────────────

export function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Formats a Celsius value with the correct unit symbol.
 * @param {number|null} value – Temperature in °C
 * @param {'C'|'F'}    unit  – Display unit
 * @returns {string}           e.g. "23°C" or "73°F"
 */
export function formatTemperature(value, unit = 'C') {
  if (value === null || value === undefined) return '--';
  const temp = unit === 'F' ? celsiusToFahrenheit(value) : Math.round(value);
  return `${temp}°${unit}`;
}

// ─── Time (from Open-Meteo local ISO strings) ─────────────────────────────────

/**
 * Extracts the time from an ISO local string and formats it as "3:45 PM".
 * Works correctly for all cities regardless of the browser's timezone.
 *
 * @param {string} isoString – e.g. "2024-11-07T15:30" or "2024-11-07T06:30"
 * @returns {string}
 */
export function formatTime(isoString) {
  if (!isoString) return '--';
  const timePart = isoString.includes('T') ? isoString.split('T')[1] : isoString;
  if (!timePart) return '--';
  const [hoursStr, minutesStr] = timePart.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return '--';
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Formats the date portion of an ISO string as "Friday, November 7, 2024".
 *
 * @param {string} isoString – e.g. "2024-11-07T14:00"
 * @returns {string}
 */
export function formatDate(isoString) {
  if (!isoString) return '--';
  const datePart = isoString.includes('T') ? isoString.split('T')[0] : isoString;
  const [year, month, day] = datePart.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return '--';
  // `new Date(y, m-1, d)` uses local constructor — no UTC shift
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns the abbreviated weekday for a date ISO string — e.g. "Mon".
 */
export function formatDayName(isoString) {
  if (!isoString) return '--';
  const datePart = isoString.includes('T') ? isoString.split('T')[0] : isoString;
  const [year, month, day] = datePart.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return '--';
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Returns "Nov 7" style short date from an ISO string.
 */
export function formatShortDate(isoString) {
  if (!isoString) return '--';
  const datePart = isoString.includes('T') ? isoString.split('T')[0] : isoString;
  const [year, month, day] = datePart.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return '--';
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Extracts just the hour from an ISO datetime string — e.g. "3 PM".
 */
export function formatHour(isoString) {
  if (!isoString) return '--';
  const timePart = isoString.includes('T') ? isoString.split('T')[1] : isoString;
  const hours = parseInt(timePart?.split(':')[0], 10);
  if (isNaN(hours)) return '--';
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12} ${period}`;
}

// ─── Wind ─────────────────────────────────────────────────────────────────────

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/**
 * Converts wind direction degrees to a compass label (e.g. 180 → "S").
 */
export function formatWindDirection(degrees) {
  if (degrees === null || degrees === undefined) return '--';
  return COMPASS[Math.round(degrees / 45) % 8];
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/**
 * Formats metres as "1.2 km" or "800 m".
 */
export function formatVisibility(metres) {
  if (metres === null || metres === undefined) return '--';
  return metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${metres} m`;
}

/**
 * Formats a duration in seconds as "7h 42m".
 */
export function formatDuration(seconds) {
  if (!seconds) return '--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
