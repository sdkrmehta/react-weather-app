import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { AlertTriangle, X, ShieldAlert, Wind, Sun, CloudRain } from 'lucide-react';

/**
 * Computes active weather warnings based on real Open-Meteo metrics.
 */
function getActiveAlert(weatherData, aqData) {
  if (!weatherData?.current) return null;

  const current = weatherData.current;
  const weatherCode = current.weather_code ?? 0;
  const windSpeed = current.wind_speed_10m ?? 0;
  const uv = current.uv_index ?? 0;
  const aqi = aqData?.current?.us_aqi ?? 0;

  // 1. Severe Thunderstorm
  if (weatherCode >= 95) {
    return {
      severity: 'Severe',
      title: 'Severe Thunderstorm Warning',
      description: 'Thunderstorms with possible hail and violent wind gusts in this area. Seek shelter indoors.',
      icon: AlertTriangle,
      color: '#EF4444',
    };
  }

  // 2. High Wind Advisory
  if (windSpeed >= 50) {
    return {
      severity: 'Advisory',
      title: 'High Wind Advisory',
      description: `Sustained winds of ${Math.round(windSpeed)} km/h. Secure loose outdoor objects and drive with caution.`,
      icon: Wind,
      color: '#F59E0B',
    };
  }

  // 3. Hazardous Air Quality
  if (aqi > 150) {
    return {
      severity: 'Health Alert',
      title: 'Unhealthy Air Quality Warning',
      description: `Air Quality Index is ${aqi}. Sensitive groups should avoid outdoor exertion and wear protective masks.`,
      icon: ShieldAlert,
      color: '#DC2626',
    };
  }

  // 4. Extreme UV Index
  if (uv >= 8) {
    return {
      severity: 'UV Warning',
      title: 'Very High UV Radiation Alert',
      description: `Current UV Index is ${Math.round(uv)}. Minimize direct sun exposure between 10 AM and 4 PM; apply SPF 50+.`,
      icon: Sun,
      color: '#F59E0B',
    };
  }

  // 5. Heavy Rain / Flash Flood Risk
  if (weatherCode === 65 || weatherCode === 82) {
    return {
      severity: 'Advisory',
      title: 'Heavy Rainfall Warning',
      description: 'Intense rain showers detected. Watch for localized water pooling and reduced roadway visibility.',
      icon: CloudRain,
      color: '#0284C7',
    };
  }

  return null;
}

/**
 * Severe Weather & Climate Advisory Banner.
 */
export default function WeatherAlertBanner({ weatherData, aqData }) {
  const [dismissed, setDismissed] = useState(false);
  const alert = getActiveAlert(weatherData, aqData);

  if (!alert || dismissed) return null;

  const Icon = alert.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: { xs: 2, sm: 2.5 },
        py: 1.25,
        mb: 2.5,
        borderRadius: 4,
        backgroundColor: `${alert.color}18`,
        border: `1px solid ${alert.color}45`,
        backdropFilter: 'blur(12px)',
        animation: 'slideUp 0.3s ease both',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: `${alert.color}30`,
            color: alert.color,
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={2.2} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" fontWeight={700} sx={{ color: alert.color }}>
              {alert.title}
            </Typography>
            <Chip
              label={alert.severity}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 700,
                backgroundColor: `${alert.color}30`,
                color: alert.color,
                border: `1px solid ${alert.color}60`,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              fontSize: '0.74rem',
              lineHeight: 1.3,
            }}
          >
            {alert.description}
          </Typography>
        </Box>
      </Box>

      <IconButton
        size="small"
        onClick={() => setDismissed(true)}
        sx={{
          color: 'text.secondary',
          opacity: 0.7,
          '&:hover': { opacity: 1 },
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </IconButton>
    </Box>
  );
}
