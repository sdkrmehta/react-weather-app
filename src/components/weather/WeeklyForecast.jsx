import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import WeatherCard from '../common/WeatherCard';
import WeatherIcon from './WeatherIcon';
import { formatTemperature, formatDayName, formatShortDate } from '../../utils/formatters';
import { getWeatherDescription } from '../../utils/weatherCodes';
import { Droplets } from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WeeklyForecastSkeleton() {
  return (
    <WeatherCard sx={{ width: '100%' }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, opacity: 0.5 }}>
        7-Day Forecast
      </Typography>
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={i}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.25,
              gap: 1.5,
            }}
          >
            <Skeleton variant="text" width={38} height={18} />
            <Skeleton variant="circular" width={30} height={30} sx={{ ml: 'auto' }} />
            <Skeleton variant="text" width={80} height={18} />
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width={34} height={22} />
              <Skeleton variant="text" width={34} height={22} />
            </Box>
          </Box>
          {i < 6 && <Divider />}
        </Box>
      ))}
    </WeatherCard>
  );
}

// ─── Single day row ───────────────────────────────────────────────────────────

function DayRow({ dateStr, weatherCode, tempMin, tempMax, precipProb, isToday, unit, isLast }) {
  const dayLabel = isToday ? 'Today' : formatDayName(dateStr);
  const dateLabel = formatShortDate(dateStr);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1.25,
          gap: { xs: 1, sm: 1.5 },
          borderRadius: 2,
          px: 0.5,
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(56, 189, 248, 0.05)'
                : 'rgba(2, 132, 199, 0.04)',
          },
        }}
      >
        {/* Day + date */}
        <Box sx={{ minWidth: { xs: 52, sm: 68 }, flexShrink: 0 }}>
          <Typography
            variant="body2"
            fontWeight={isToday ? 700 : 600}
            color={isToday ? 'primary.main' : 'text.primary'}
            sx={{ lineHeight: 1.3 }}
          >
            {dayLabel}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.70rem', lineHeight: 1 }}
          >
            {dateLabel}
          </Typography>
        </Box>

        {/* Weather icon */}
        <WeatherIcon
          code={weatherCode}
          isDay={1}
          size={26}
          strokeWidth={1.6}
        />

        {/* Condition description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            fontSize: { xs: '0.78rem', sm: '0.85rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {getWeatherDescription(weatherCode)}
        </Typography>

        {/* Precipitation probability */}
        {precipProb != null && precipProb > 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              minWidth: 36,
              justifyContent: 'flex-end',
            }}
          >
            <Droplets size={12} color="#38BDF8" strokeWidth={2} />
            <Typography
              variant="caption"
              sx={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 600 }}
            >
              {precipProb}%
            </Typography>
          </Box>
        ) : (
          <Box sx={{ minWidth: 36 }} />
        )}

        {/* Temp range */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1 },
            minWidth: { xs: 70, sm: 90 },
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          {/* Min */}
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            sx={{ fontSize: { xs: '0.82rem', sm: '0.9rem' } }}
          >
            {formatTemperature(tempMin, unit)}
          </Typography>

          {/* Visual range bar */}
          <Box
            sx={{
              width: { xs: 24, sm: 32 },
              height: 4,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(90deg, ${
                  theme.palette.mode === 'dark' ? '#38BDF8' : '#0284C7'
                } 0%, #FBBF24 100%)`,
              opacity: 0.6,
              display: { xs: 'none', sm: 'block' },
            }}
          />

          {/* Max */}
          <Typography
            variant="body2"
            fontWeight={isToday ? 700 : 600}
            color={isToday ? 'primary.main' : 'text.primary'}
            sx={{ fontSize: { xs: '0.82rem', sm: '0.9rem' } }}
          >
            {formatTemperature(tempMax, unit)}
          </Typography>
        </Box>
      </Box>

      {!isLast && <Divider />}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * 7-day daily forecast list.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (daily + current)
 *  loading      boolean
 *  unit         'C'|'F'  – temperature unit
 */
export default function WeeklyForecast({ weatherData, loading, unit = 'C' }) {
  if (loading) return <WeeklyForecastSkeleton />;
  if (!weatherData?.daily) return null;

  const { daily, current } = weatherData;

  // Current date prefix for "Today" detection
  const todayPrefix = (current?.time ?? '').slice(0, 10); // "2024-11-07"

  const days = (daily.time ?? []).map((dateStr, i) => ({
    dateStr,
    weatherCode: daily.weather_code?.[i] ?? 0,
    tempMin: daily.temperature_2m_min?.[i] ?? null,
    tempMax: daily.temperature_2m_max?.[i] ?? null,
    precipProb: daily.precipitation_probability_max?.[i] ?? null,
    isToday: dateStr.startsWith(todayPrefix),
  }));

  if (days.length === 0) return null;

  return (
    <WeatherCard sx={{ width: '100%' }}>
      {/* Section header */}
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="text.secondary"
        sx={{
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.72rem',
        }}
      >
        7-Day Forecast
      </Typography>

      {/* Day rows */}
      <Box>
        {days.map((day, i) => (
          <DayRow
            key={day.dateStr}
            {...day}
            unit={unit}
            isLast={i === days.length - 1}
          />
        ))}
      </Box>
    </WeatherCard>
  );
}
