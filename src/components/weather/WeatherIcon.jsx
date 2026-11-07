import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog,
  CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Cloudy,
} from 'lucide-react';

/**
 * Maps WMO weather codes to Lucide icon components for day and night.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
const CODE_MAP = {
  0:  { day: Sun,            night: Moon },
  1:  { day: Sun,            night: Moon },
  2:  { day: CloudSun,       night: CloudMoon },
  3:  { day: Cloudy,         night: Cloudy },
  45: { day: CloudFog,       night: CloudFog },
  48: { day: CloudFog,       night: CloudFog },
  51: { day: CloudDrizzle,   night: CloudDrizzle },
  53: { day: CloudDrizzle,   night: CloudDrizzle },
  55: { day: CloudDrizzle,   night: CloudDrizzle },
  56: { day: CloudSnow,      night: CloudSnow },
  57: { day: CloudSnow,      night: CloudSnow },
  61: { day: CloudRain,      night: CloudRain },
  63: { day: CloudRain,      night: CloudRain },
  65: { day: CloudRain,      night: CloudRain },
  66: { day: CloudSnow,      night: CloudSnow },
  67: { day: CloudSnow,      night: CloudSnow },
  71: { day: CloudSnow,      night: CloudSnow },
  73: { day: CloudSnow,      night: CloudSnow },
  75: { day: CloudSnow,      night: CloudSnow },
  77: { day: CloudSnow,      night: CloudSnow },
  80: { day: CloudRain,      night: CloudRain },
  81: { day: CloudRain,      night: CloudRain },
  82: { day: CloudRain,      night: CloudRain },
  85: { day: CloudSnow,      night: CloudSnow },
  86: { day: CloudSnow,      night: CloudSnow },
  95: { day: CloudLightning, night: CloudLightning },
  96: { day: CloudLightning, night: CloudLightning },
  99: { day: CloudLightning, night: CloudLightning },
};

/**
 * Returns a contextual icon color for a weather condition.
 */
function getIconColor(code, isDay) {
  if (code === 0 || code === 1) return isDay ? '#FBBF24' : '#94A3B8'; // sunny gold / moon silver
  if (code === 2)               return isDay ? '#94A3B8' : '#64748B'; // partly cloudy
  if (code === 3)               return '#64748B';                     // overcast gray
  if (code <= 48)               return '#94A3B8';                     // fog
  if (code <= 57)               return '#93C5FD';                     // drizzle blue
  if (code <= 67)               return '#38BDF8';                     // rain blue
  if (code <= 77)               return '#BAE6FD';                     // snow light blue
  if (code <= 82)               return '#38BDF8';                     // showers
  if (code <= 86)               return '#BAE6FD';                     // snow showers
  return '#FBBF24';                                                   // thunderstorm gold
}

/**
 * Renders the appropriate Lucide weather icon for a WMO code.
 *
 * Props:
 *  code        {number}  WMO weather interpretation code (default 0 = clear)
 *  isDay       {number}  1 = daytime, 0 = night-time (from Open-Meteo)
 *  size        {number}  Icon size in px (default 64)
 *  color       {string}  Override icon color (uses automatic color when omitted)
 *  strokeWidth {number}  Lucide stroke width (default 1.5)
 */
export default function WeatherIcon({
  code = 0,
  isDay = 1,
  size = 64,
  color,
  strokeWidth = 1.5,
}) {
  const mapping = CODE_MAP[code] ?? CODE_MAP[0];
  const Icon = isDay ? mapping.day : mapping.night;
  const iconColor = color ?? getIconColor(code, isDay);

  return <Icon size={size} color={iconColor} strokeWidth={strokeWidth} />;
}
