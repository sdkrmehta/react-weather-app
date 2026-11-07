import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import WeatherCard from '../common/WeatherCard';
import WeatherIcon from './WeatherIcon';
import { formatTemperature, formatHour } from '../../utils/formatters';
import { Droplets } from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HourlyForecastSkeleton() {
  return (
    <WeatherCard sx={{ width: '100%' }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, opacity: 0.5 }}>
        Hourly Forecast
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.75,
              minWidth: 68,
            }}
          >
            <Skeleton variant="text" width={42} height={18} />
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="text" width={38} height={22} />
            <Skeleton variant="text" width={30} height={16} />
          </Box>
        ))}
      </Box>
    </WeatherCard>
  );
}

// ─── Single hour column ───────────────────────────────────────────────────────

function HourItem({ time, temp, precipProb, weatherCode, isDay, unit, isNow }) {
  const label = isNow ? 'Now' : formatHour(time);

  return (
    <Tooltip
      title={`${temp !== null ? Math.round(temp) : '--'}°C${precipProb != null ? ` · ${precipProb}% rain` : ''}`}
      arrow
      placement="top"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          minWidth: { xs: 60, sm: 68 },
          px: 0.75,
          py: 1.25,
          borderRadius: 3,
          cursor: 'default',
          transition: 'background-color 0.2s ease',
          backgroundColor: isNow
            ? (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(56, 189, 248, 0.14)'
                  : 'rgba(2, 132, 199, 0.08)'
            : 'transparent',
          border: isNow
            ? (theme) =>
                `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(56, 189, 248, 0.3)'
                    : 'rgba(2, 132, 199, 0.2)'
                }`
            : '1px solid transparent',
          '&:hover': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(56, 189, 248, 0.08)'
                : 'rgba(2, 132, 199, 0.05)',
          },
        }}
      >
        {/* Hour label */}
        <Typography
          variant="caption"
          fontWeight={isNow ? 700 : 500}
          color={isNow ? 'primary.main' : 'text.secondary'}
          sx={{ lineHeight: 1.2, fontSize: '0.72rem' }}
        >
          {label}
        </Typography>

        {/* Weather icon */}
        <WeatherIcon code={weatherCode} isDay={isDay} size={28} strokeWidth={1.6} />

        {/* Temperature */}
        <Typography
          variant="body2"
          fontWeight={isNow ? 700 : 600}
          color={isNow ? 'primary.main' : 'text.primary'}
          sx={{ fontSize: '0.9rem', lineHeight: 1 }}
        >
          {formatTemperature(temp, unit)}
        </Typography>

        {/* Precipitation probability */}
        {precipProb != null && precipProb > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <Droplets size={10} color="#38BDF8" strokeWidth={2} />
            <Typography
              variant="caption"
              sx={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 600 }}
            >
              {precipProb}%
            </Typography>
          </Box>
        ) : (
          /* Keep height consistent when no rain */
          <Box sx={{ height: 14 }} />
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Horizontal-scrolling 24-hour forecast strip.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (hourly + current)
 *  loading      boolean
 *  unit         'C'|'F'  – temperature unit
 */
export default function HourlyForecast({ weatherData, loading, unit = 'C' }) {
  if (loading) return <HourlyForecastSkeleton />;
  if (!weatherData?.hourly) return null;

  const { hourly, current } = weatherData;
  const currentTime = current?.time ?? '';

  // ── Find the index of the current (or nearest future) hour ─────────────────
  // Open-Meteo returns times as "YYYY-MM-DDTHH:00" in local city time.
  // We compare string prefixes to avoid any timezone conversions.
  const currentHourPrefix = currentTime.slice(0, 13); // "2024-11-07T14"

  let startIdx = hourly.time.findIndex(
    (t) => t.slice(0, 13) >= currentHourPrefix
  );
  if (startIdx === -1) startIdx = 0;

  // Show next 24 hours (or however many remain)
  const hours = hourly.time.slice(startIdx, startIdx + 24);

  // ── Build display items ─────────────────────────────────────────────────────
  const items = hours.map((time, idx) => {
    const dataIdx = startIdx + idx;
    return {
      time,
      temp: hourly.temperature_2m?.[dataIdx] ?? null,
      precipProb: hourly.precipitation_probability?.[dataIdx] ?? null,
      weatherCode: hourly.weather_code?.[dataIdx] ?? 0,
      // Use is_day from current for the first slot; approximate for the rest
      // by checking if the hour is between 6 and 20 local time
      isDay: (() => {
        if (idx === 0) return current?.is_day ?? 1;
        const hourNum = parseInt(time.split('T')[1]?.split(':')[0] ?? '12', 10);
        return hourNum >= 6 && hourNum < 20 ? 1 : 0;
      })(),
      isNow: idx === 0,
    };
  });

  if (items.length === 0) return null;

  return (
    <WeatherCard sx={{ width: '100%' }}>
      {/* Section header */}
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="text.secondary"
        sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}
      >
        Hourly Forecast · 24 h
      </Typography>

      {/* Scrollable row */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          overflowX: 'auto',
          pb: 0.5,
          // Custom thin scrollbar
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(148, 163, 184, 0.2)'
                : 'rgba(15, 23, 42, 0.12)',
            borderRadius: 2,
          },
        }}
      >
        {items.map((item) => (
          <HourItem key={item.time} {...item} unit={unit} />
        ))}
      </Box>
    </WeatherCard>
  );
}
