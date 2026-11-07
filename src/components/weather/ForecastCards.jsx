import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';
import { Clock, Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  formatHour,
  formatTemperature,
  formatDayName,
  formatShortDate,
} from '../../utils/formatters';

/**
 * 24-Hour Forecast & 7-Day Forecast cards side-by-side matching the reference image.
 */
export default function ForecastCards({
  weatherData,
  loading,
  unit = 'C',
  onViewDetails,
  onViewDetails24h,
  onViewDetails7d,
}) {
  if (loading || !weatherData) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
        <Skeleton variant="rounded" height={190} sx={{ borderRadius: 5 }} />
        <Skeleton variant="rounded" height={190} sx={{ borderRadius: 5 }} />
      </Box>
    );
  }

  const { hourly, daily, current } = weatherData;
  const currentHourPrefix = (current?.time ?? '').slice(0, 13);

  // ── Compute 8 hours for 24-Hour Forecast ────────────────────────────────────
  let startIdx = (hourly?.time ?? []).findIndex(
    (t) => t.slice(0, 13) >= currentHourPrefix
  );
  if (startIdx === -1) startIdx = 0;

  const hoursList = (hourly?.time ?? []).slice(startIdx, startIdx + 8).map((time, idx) => {
    const dataIdx = startIdx + idx;
    const hourNum = parseInt(time.split('T')[1]?.split(':')[0] ?? '12', 10);
    const isDay = idx === 0 ? current?.is_day ?? 1 : (hourNum >= 6 && hourNum < 20 ? 1 : 0);
    return {
      time,
      hourLabel: idx === 0 ? 'Now' : formatHour(time),
      temp: hourly.temperature_2m?.[dataIdx],
      weatherCode: hourly.weather_code?.[dataIdx] ?? 0,
      isDay,
      precipProb: hourly.precipitation_probability?.[dataIdx] ?? 5,
    };
  });

  // ── Compute 7 days for 7-Day Forecast ───────────────────────────────────────
  const daysList = (daily?.time ?? []).slice(0, 7).map((dateStr, i) => {
    const isToday = i === 0;
    return {
      dateStr,
      dayLabel: isToday ? 'Today' : formatDayName(dateStr),
      dateLabel: formatShortDate(dateStr),
      weatherCode: daily.weather_code?.[i] ?? 0,
      tempMin: daily.temperature_2m_min?.[i],
      tempMax: daily.temperature_2m_max?.[i],
      precipProb: daily.precipitation_probability_max?.[i] ?? 5,
    };
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 2,
        mb: 2.5,
      }}
    >
      {/* ── 24-Hour Forecast Card ───────────────────────────────────── */}
      <Card sx={{ borderRadius: 5, p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={16} color="#38BDF8" />
            <Typography variant="subtitle2" fontWeight={700}>
              24-Hour Forecast
            </Typography>
          </Box>
          <ButtonBase
            onClick={onViewDetails24h || onViewDetails}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#38BDF8',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View Details →
          </ButtonBase>
        </Box>

        {/* 8 Columns Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 0.5,
            textAlign: 'center',
            overflowX: 'auto',
            pb: 0.5,
          }}
        >
          {hoursList.map((h, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.6,
                minWidth: 44,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.72rem', fontWeight: 600 }}
              >
                {h.hourLabel}
              </Typography>

              <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={24} strokeWidth={1.8} />

              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
                {formatTemperature(h.temp, unit)}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                <Droplets size={10} color="#38BDF8" />
                <Typography variant="caption" sx={{ fontSize: '0.66rem', color: '#38BDF8', fontWeight: 600 }}>
                  {h.precipProb}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      {/* ── 7-Day Forecast Card ─────────────────────────────────────── */}
      <Card sx={{ borderRadius: 5, p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} color="#60A5FA" />
            <Typography variant="subtitle2" fontWeight={700}>
              7-Day Forecast
            </Typography>
          </Box>
          <ButtonBase
            onClick={onViewDetails7d || onViewDetails}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#38BDF8',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View Details →
          </ButtonBase>
        </Box>

        {/* 7 Columns Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            textAlign: 'center',
            overflowX: 'auto',
            pb: 0.5,
          }}
        >
          {daysList.map((d, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.6,
                minWidth: 50,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ fontSize: '0.72rem', fontWeight: 700, lineHeight: 1.1 }}
                >
                  {d.dayLabel}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '0.62rem', lineHeight: 1 }}
                >
                  {d.dateLabel}
                </Typography>
              </Box>

              <WeatherIcon code={d.weatherCode} isDay={1} size={24} strokeWidth={1.8} />

              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.78rem' }}>
                {Math.round(d.tempMin ?? 0)}° / {Math.round(d.tempMax ?? 0)}°
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                <Droplets size={10} color="#38BDF8" />
                <Typography variant="caption" sx={{ fontSize: '0.66rem', color: '#38BDF8', fontWeight: 600 }}>
                  {d.precipProb}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
