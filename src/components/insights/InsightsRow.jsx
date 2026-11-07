import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import {
  Sprout,
  Sun,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  formatTime,
  formatWindDirection,
  formatDuration,
} from '../../utils/formatters';

/**
 * Animated Circular Compass Widget for Wind.
 */
function WindCompass({ degrees = 315 }) {
  const dir = formatWindDirection(degrees);
  return (
    <Box
      sx={{
        position: 'relative',
        width: 52,
        height: 52,
        borderRadius: '50%',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Compass Needle */}
      <Box
        sx={{
          position: 'absolute',
          width: 2,
          height: 38,
          borderRadius: 1,
          background: 'linear-gradient(180deg, #38BDF8 50%, rgba(255, 255, 255, 0.2) 50%)',
          transform: `rotate(${degrees}deg)`,
          transition: 'transform 0.6s ease',
        }}
      />
      <Typography
        variant="caption"
        fontWeight={800}
        sx={{
          fontSize: '0.66rem',
          color: '#38BDF8',
          zIndex: 1,
          backgroundColor: 'rgba(16, 27, 51, 0.85)',
          px: 0.4,
          borderRadius: 0.5,
        }}
      >
        {dir}
      </Typography>
    </Box>
  );
}

/**
 * Sun trajectory arc graphic with sun dot.
 */
function SunArcProgress({ sunriseStr, sunsetStr, currentStr }) {
  let pct = 0.5; // fallback noon
  if (sunriseStr && sunsetStr && currentStr) {
    const parseMins = (str) => {
      const timePart = str.includes('T') ? str.split('T')[1] : str;
      const [h, m] = timePart.split(':').map(Number);
      return h * 60 + m;
    };
    const r = parseMins(sunriseStr);
    const s = parseMins(sunsetStr);
    const c = parseMins(currentStr);
    if (s > r) {
      pct = Math.min(1, Math.max(0, (c - r) / (s - r)));
    }
  }

  // Calculate position along semi-circle (from angle 180 to 0 deg)
  const angle = Math.PI - pct * Math.PI; // 180 deg to 0 deg
  const radius = 34;
  const cx = 40;
  const cy = 38;
  const sunX = cx + radius * Math.cos(angle);
  const sunY = cy - radius * Math.sin(angle);

  return (
    <Box sx={{ position: 'relative', width: 80, height: 44, mx: 'auto', mt: 0.5 }}>
      <svg width="80" height="44" viewBox="0 0 80 44">
        {/* Arc Path */}
        <path
          d="M 6 38 A 34 34 0 0 1 74 38"
          fill="none"
          stroke="rgba(245, 158, 11, 0.35)"
          strokeWidth="2.5"
          strokeDasharray="3 3"
        />
        {/* Sun Dot */}
        <circle
          cx={sunX}
          cy={sunY}
          r="4.5"
          fill="#FBBF24"
          filter="drop-shadow(0 0 6px #F59E0B)"
        />
      </svg>
    </Box>
  );
}

/**
 * 7 Insight Cards Row matching the reference image.
 */
export default function InsightsRow({ weatherData, aqData, loading }) {
  if (loading || !weatherData) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={135} sx={{ borderRadius: 4 }} />
        ))}
      </Box>
    );
  }

  const { current, daily } = weatherData;

  // 1. AQI
  const aqiVal = aqData?.current?.us_aqi ?? 32;
  const aqiStatus = aqiVal <= 50 ? 'Good' : aqiVal <= 100 ? 'Moderate' : 'Unhealthy';
  const aqiColor = aqiVal <= 50 ? '#10B981' : aqiVal <= 100 ? '#F59E0B' : '#EF4444';

  // 2. UV
  const uvVal = current?.uv_index != null ? Math.round(current.uv_index) : 3;
  const uvStatus = uvVal <= 2 ? 'Low' : uvVal <= 5 ? 'Moderate' : 'High';
  const uvColor = uvVal <= 2 ? '#10B981' : uvVal <= 5 ? '#F59E0B' : '#EF4444';

  // 3. Humidity & Dew Point
  const humidity = current?.relative_humidity_2m ?? 72;
  const temp = current?.temperature_2m ?? 14;
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
  const dewPoint = Math.round((b * alpha) / (a - alpha));

  // 4. Wind
  const windSpeed = Math.round(current?.wind_speed_10m ?? 12);
  const windDeg = current?.wind_direction_10m ?? 315;
  const windDir = formatWindDirection(windDeg);
  const gusts = Math.round(current?.wind_gusts_10m ?? 22);

  // 5. Visibility
  const visM = current?.visibility ?? 16000;
  const visKm = Math.round(visM / 1000);

  // 6. Pressure
  const pressure = Math.round(current?.pressure_msl ?? current?.surface_pressure ?? 1018);

  // 7. Sunrise & Sunset
  const sunrise = daily?.sunrise?.[0];
  const sunset  = daily?.sunset?.[0];
  const daylightSec = daily?.daylight_duration?.[0] ?? 51120;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(7, 1fr)',
        },
        gap: 1.5,
        mb: 2.5,
      }}
    >
      {/* 1. Air Quality Index */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Sprout size={15} color="#10B981" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            Air Quality Index
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, my: 0.5 }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {aqiVal}
          </Typography>
          <Typography variant="caption" fontWeight={700} sx={{ color: aqiColor, fontSize: '0.75rem' }}>
            {aqiStatus}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.66rem', lineHeight: 1.2 }}>
          Air quality is satisfactory.
        </Typography>
      </Card>

      {/* 2. UV Index */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Sun size={15} color="#FBBF24" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            UV Index
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, my: 0.5 }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {uvVal}
          </Typography>
          <Typography variant="caption" fontWeight={700} sx={{ color: uvColor, fontSize: '0.75rem' }}>
            {uvStatus}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.66rem', lineHeight: 1.2 }}>
          Use sunscreen.
        </Typography>
      </Card>

      {/* 3. Humidity */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Droplets size={15} color="#38BDF8" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            Humidity
          </Typography>
        </Box>
        <Box sx={{ my: 0.5 }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {humidity}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', mt: 0.2, display: 'block' }}>
            Dew Point: {dewPoint}°C
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.66rem', lineHeight: 1.2 }}>
          Comfortable levels.
        </Typography>
      </Card>

      {/* 4. Wind with Compass */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Wind size={15} color="#38BDF8" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            Wind
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 0.5 }}>
          <Box>
            <Typography variant="body1" fontWeight={800} sx={{ lineHeight: 1.1, fontSize: '0.95rem' }}>
              {windSpeed} km/h
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.72rem' }}>
              {windDir}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: 'block' }}>
              Gusts: {gusts} km/h
            </Typography>
          </Box>
          <WindCompass degrees={windDeg} />
        </Box>
      </Card>

      {/* 5. Visibility */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Eye size={15} color="#38BDF8" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            Visibility
          </Typography>
        </Box>
        <Box sx={{ my: 0.5 }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {visKm} km
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.66rem', lineHeight: 1.2 }}>
          Excellent visibility.
        </Typography>
      </Card>

      {/* 6. Pressure */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Gauge size={15} color="#818CF8" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            Pressure
          </Typography>
        </Box>
        <Box sx={{ my: 0.5 }}>
          <Typography variant="body1" fontWeight={800} sx={{ lineHeight: 1.1, fontSize: '1.05rem' }}>
            {pressure} hPa
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.66rem', lineHeight: 1.2 }}>
          Stable conditions.
        </Typography>
      </Card>

      {/* 7. Sunrise & Sunset Arc */}
      <Card sx={{ p: 1.75, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6 }}>
          <Sunrise size={14} color="#FBBF24" />
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            Sunrise & Sunset
          </Typography>
        </Box>

        <SunArcProgress sunriseStr={sunrise} sunsetStr={sunset} currentStr={current?.time} />

        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 0.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <ArrowUp size={10} color="#FBBF24" />
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.64rem', color: '#FBBF24' }}>
              {formatTime(sunrise)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <ArrowDown size={10} color="#F97316" />
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.64rem', color: '#F97316' }}>
              {formatTime(sunset)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: 'block' }}>
          {formatDuration(daylightSec)} daylight
        </Typography>
      </Card>
    </Box>
  );
}
