import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import { X, Clock, Calendar, Droplets, Wind, Sun } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  formatHour,
  formatTemperature,
  formatDayName,
  formatShortDate,
  formatTime,
} from '../../utils/formatters';
import { getWeatherDescription } from '../../utils/weatherCodes';

/**
 * Detailed Forecast Inspector Modal.
 */
export default function ForecastDetailDialog({
  open,
  initialTab = '24h',
  onClose,
  weatherData,
  unit = 'C',
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  if (!weatherData) return null;

  const { hourly, daily, current } = weatherData;
  const currentHourPrefix = (current?.time ?? '').slice(0, 13);

  let startIdx = (hourly?.time ?? []).findIndex(
    (t) => t.slice(0, 13) >= currentHourPrefix
  );
  if (startIdx === -1) startIdx = 0;

  // 24 Hours list
  const hours = (hourly?.time ?? []).slice(startIdx, startIdx + 24).map((time, idx) => {
    const di = startIdx + idx;
    const hourNum = parseInt(time.split('T')[1]?.split(':')[0] ?? '12', 10);
    const isDay = idx === 0 ? current?.is_day ?? 1 : (hourNum >= 6 && hourNum < 20 ? 1 : 0);
    return {
      time,
      hourLabel: idx === 0 ? 'Now' : formatHour(time),
      temp: hourly.temperature_2m?.[di],
      feel: hourly.apparent_temperature?.[di],
      precip: hourly.precipitation_probability?.[di] ?? 0,
      wind: Math.round(hourly.wind_speed_10m?.[di] ?? 0),
      code: hourly.weather_code?.[di] ?? 0,
      humidity: hourly.relative_humidity_2m?.[di] ?? 70,
      isDay,
    };
  });

  // 7 Days list
  const days = (daily?.time ?? []).slice(0, 7).map((dateStr, i) => {
    return {
      dateStr,
      dayName: i === 0 ? 'Today' : formatDayName(dateStr),
      shortDate: formatShortDate(dateStr),
      code: daily.weather_code?.[i] ?? 0,
      tempMin: daily.temperature_2m_min?.[i],
      tempMax: daily.temperature_2m_max?.[i],
      precip: daily.precipitation_probability_max?.[i] ?? 0,
      windMax: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
      uvMax: Math.round(daily.uv_index_max?.[i] ?? 0),
      sunrise: daily.sunrise?.[i],
      sunset: daily.sunset?.[i],
    };
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#101B33' : '#FFFFFF',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          p: 1,
        },
      }}
    >
      {/* ── Dialog Header with Tab Switcher ────────────────────────── */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 0.35,
              borderRadius: 9999,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(16, 27, 51, 0.9)' : 'rgba(241, 245, 249, 0.9)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ButtonBase
              onClick={() => setActiveTab('24h')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 0.5,
                borderRadius: 9999,
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: activeTab === '24h' ? '#2563EB' : 'transparent',
                color: activeTab === '24h' ? '#FFFFFF' : 'text.secondary',
                transition: 'all 0.2s ease',
              }}
            >
              <Clock size={14} />
              <span>24-Hour Details</span>
            </ButtonBase>
            <ButtonBase
              onClick={() => setActiveTab('7d')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 0.5,
                borderRadius: 9999,
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: activeTab === '7d' ? '#2563EB' : 'transparent',
                color: activeTab === '7d' ? '#FFFFFF' : 'text.secondary',
                transition: 'all 0.2s ease',
              }}
            >
              <Calendar size={14} />
              <span>7-Day Breakdown</span>
            </ButtonBase>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, maxHeight: '65vh', overflowY: 'auto' }}>
        {/* ── 24-Hour Detailed List ──────────────────────────────────── */}
        {activeTab === '24h' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {hours.map((h, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                  gap: 1.5,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                {/* Time + Icon + Description */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 160 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ width: 60 }}>
                    {h.hourLabel}
                  </Typography>
                  <WeatherIcon code={h.code} isDay={h.isDay} size={24} />
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 110 }}>
                    {getWeatherDescription(h.code)}
                  </Typography>
                </Box>

                {/* Temperatures */}
                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="body2" fontWeight={800}>
                    {formatTemperature(h.temp, unit)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Feels {formatTemperature(h.feel, unit)}
                  </Typography>
                </Box>

                {/* Rain */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 60 }}>
                  <Droplets size={14} color="#38BDF8" />
                  <Typography variant="caption" fontWeight={600} color="#38BDF8">
                    {h.precip}%
                  </Typography>
                </Box>

                {/* Wind */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 70 }}>
                  <Wind size={14} color="#818CF8" />
                  <Typography variant="caption" color="text.secondary">
                    {h.wind} km/h
                  </Typography>
                </Box>

                {/* Humidity */}
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 50, textAlign: 'right' }}>
                  {h.humidity}% hum
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* ── 7-Day Extended Breakdown ───────────────────────────────── */}
        {activeTab === '7d' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {days.map((d, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  borderRadius: 3.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={800}>
                        {d.dayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {d.shortDate}
                      </Typography>
                    </Box>
                    <WeatherIcon code={d.code} isDay={1} size={26} />
                    <Typography variant="body2" color="text.secondary">
                      {getWeatherDescription(d.code)}
                    </Typography>
                  </Box>

                  <Typography variant="body1" fontWeight={800} color="primary.main">
                    {formatTemperature(d.tempMax, unit)} / {formatTemperature(d.tempMin, unit)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1, opacity: 0.6 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Droplets size={14} color="#38BDF8" />
                    <Typography variant="caption" color="text.secondary">
                      Rain Chance: <strong style={{ color: '#38BDF8' }}>{d.precip}%</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Wind size={14} color="#818CF8" />
                    <Typography variant="caption" color="text.secondary">
                      Max Wind: <strong>{d.windMax} km/h</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Sun size={14} color="#FBBF24" />
                    <Typography variant="caption" color="text.secondary">
                      UV Index: <strong>{d.uvMax}</strong>
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Sunrise {formatTime(d.sunrise)} • Sunset {formatTime(d.sunset)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
