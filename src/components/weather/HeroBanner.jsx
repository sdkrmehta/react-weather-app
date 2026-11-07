import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  MapPin,
  Sunrise,
  Sunset,
  Sun,
  Droplets,
  Sprout,
  Heart,
  RefreshCw,
  Moon,
  Zap,
  Snowflake,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  formatTemperature,
  formatTime,
  formatDate,
} from '../../utils/formatters';
import { getWeatherDescription } from '../../utils/weatherCodes';

/**
 * Returns a high-res scenic photography backdrop matching the current weather and daylight.
 */
function getHeroBackdrop(weatherCode, isDay) {
  if (!isDay) {
    // Starry night over alpine lake
    return 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80';
  }
  if (weatherCode >= 95) {
    // Dramatic thunderstorm
    return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80';
  }
  if (weatherCode >= 71 && weatherCode <= 86) {
    // Snow-dusted mountain valley
    return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1200&q=80';
  }
  if (weatherCode >= 51 && weatherCode <= 67) {
    // Rainy mountain forest
    return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=80';
  }
  if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    // Misty mountain valley
    return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1200&q=80';
  }
  // Clear / partly cloudy sunny lake
  return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Dynamic Floating 3D Artwork based on live weather condition.
 */
function FloatingHeroArtwork({ weatherCode, isDay }) {
  // ── Night ──────────────────────────────────────────────────────────
  if (!isDay) {
    return (
      <Box
        className="floating-weather-art"
        sx={{
          position: 'absolute',
          right: { xs: 15, sm: 40 },
          top: { xs: 55, sm: 40 },
          pointerEvents: 'none',
          display: { xs: 'none', sm: 'block' },
          filter: 'drop-shadow(0 12px 28px rgba(99, 102, 241, 0.4))',
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #C7D2FE 0%, #6366F1 70%, #4338CA 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(129, 140, 248, 0.5)',
          }}
        >
          <Moon size={48} color="#FFFFFF" strokeWidth={1.8} fill="#E0E7FF" />
          {/* Fluffy night cloud */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -10,
              left: -20,
              width: 110,
              height: 48,
              borderRadius: 9999,
              background: 'linear-gradient(180deg, #E2E8F0 0%, #94A3B8 100%)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: 20,
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#E2E8F0',
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  // ── Thunderstorm ───────────────────────────────────────────────────
  if (weatherCode >= 95) {
    return (
      <Box
        className="floating-weather-art"
        sx={{
          position: 'absolute',
          right: { xs: 15, sm: 40 },
          top: { xs: 55, sm: 40 },
          pointerEvents: 'none',
          display: { xs: 'none', sm: 'block' },
          filter: 'drop-shadow(0 12px 28px rgba(245, 158, 11, 0.5))',
        }}
      >
        <Box
          sx={{
            width: 110,
            height: 100,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 110,
              height: 52,
              borderRadius: 9999,
              background: 'linear-gradient(180deg, #475569 0%, #1E293B 100%)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -24,
                left: 22,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#475569',
              },
            }}
          />
          <Box sx={{ position: 'absolute', bottom: -12, left: '42%' }}>
            <Zap size={32} color="#FBBF24" fill="#FBBF24" filter="drop-shadow(0 0 10px #F59E0B)" />
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Snow ───────────────────────────────────────────────────────────
  if (weatherCode >= 71 && weatherCode <= 86) {
    return (
      <Box
        className="floating-weather-art"
        sx={{
          position: 'absolute',
          right: { xs: 15, sm: 40 },
          top: { xs: 55, sm: 40 },
          pointerEvents: 'none',
          display: { xs: 'none', sm: 'block' },
          filter: 'drop-shadow(0 12px 28px rgba(56, 189, 248, 0.4))',
        }}
      >
        <Box sx={{ position: 'relative', width: 110, height: 100 }}>
          <Box
            sx={{
              width: 110,
              height: 52,
              borderRadius: 9999,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -24,
                left: 22,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#FFFFFF',
              },
            }}
          />
          <Box sx={{ position: 'absolute', bottom: -8, left: '38%' }}>
            <Snowflake size={28} color="#38BDF8" />
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Default Sun & Fluffy Cloud ─────────────────────────────────────
  return (
    <Box
      className="floating-weather-art"
      sx={{
        position: 'absolute',
        right: { xs: 15, sm: 40 },
        top: { xs: 55, sm: 40 },
        pointerEvents: 'none',
        display: { xs: 'none', sm: 'block' },
        filter: 'drop-shadow(0 12px 24px rgba(245, 158, 11, 0.35))',
      }}
    >
      <Box
        sx={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FDE047 0%, #F59E0B 60%, #D97706 100%)',
          position: 'relative',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.5)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: -10,
            left: -20,
            width: 120,
            height: 52,
            borderRadius: 9999,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -24,
              left: 24,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#FFFFFF',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -14,
              right: 20,
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#FFFFFF',
            },
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * Circular AQI Progress Ring.
 */
function CircularAQIGauge({ aqi }) {
  const score = aqi ?? 32;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, score / 300));
  const strokeDashoffset = circumference - pct * circumference;

  const color =
    score <= 50 ? '#10B981' : score <= 100 ? '#F59E0B' : '#EF4444';

  return (
    <Box sx={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle
          cx="38"
          cy="38"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="38"
          cy="38"
          r={radius}
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 38 38)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1, fontSize: '1.05rem' }}>
          {score}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', fontWeight: 600 }}>
          AQI
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Hero Banner matching the top section of the user reference image.
 */
export default function HeroBanner({
  weatherData,
  location,
  aqData,
  loading,
  unit = 'C',
  isFavourite,
  onToggleFavourite,
  onRefresh,
}) {
  if (loading || !weatherData || !location) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.1fr 1fr' }, gap: 2, mb: 2.5 }}>
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: 5 }} />
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: 5 }} />
      </Box>
    );
  }

  const { current, daily } = weatherData;
  const weatherCode = current?.weather_code ?? 0;
  const isDay = current?.is_day ?? 1;

  const tempMin = daily?.temperature_2m_min?.[0];
  const tempMax = daily?.temperature_2m_max?.[0];
  const sunrise = daily?.sunrise?.[0];
  const sunset  = daily?.sunset?.[0];

  const aqiScore = aqData?.current?.us_aqi ?? 32;
  const aqiLabel = aqiScore <= 50 ? 'Good' : aqiScore <= 100 ? 'Moderate' : 'Unhealthy';
  const aqiColor = aqiScore <= 50 ? '#10B981' : aqiScore <= 100 ? '#F59E0B' : '#EF4444';

  const uv = current?.uv_index != null ? Math.round(current.uv_index) : 3;
  const uvLabel = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Very High';

  const humidity = current?.relative_humidity_2m ?? 72;
  const humidityLabel = humidity < 40 ? 'Dry' : humidity <= 75 ? 'Comfortable' : 'Humid';

  const bgImage = getHeroBackdrop(weatherCode, isDay);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2.1fr 1fr' },
        gap: 2,
        mb: 2.5,
      }}
    >
      {/* ── Left Hero Card: Context-Aware Mountain Landscape ───────── */}
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: 2.5, sm: 3 },
          backgroundImage: `linear-gradient(135deg, rgba(8, 14, 30, 0.92) 0%, rgba(8, 14, 30, 0.55) 55%, rgba(8, 14, 30, 0.78) 100%), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          transition: 'background-image 0.6s ease',
        }}
      >
        {/* Top Header: Location + Actions */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <MapPin size={17} color="#38BDF8" />
              <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                {location.name}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', pl: '24px', fontSize: '0.78rem' }}>
              {formatDate(current.time)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={isFavourite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={onToggleFavourite}
                sx={{
                  color: isFavourite ? '#F87171' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { color: '#F87171', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                }}
              >
                <Heart size={16} fill={isFavourite ? '#F87171' : 'none'} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh weather">
              <IconButton
                size="small"
                onClick={onRefresh}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { color: '#38BDF8', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                }}
              >
                <RefreshCw size={15} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Dynamic 3D Floating Mascot Art */}
        <FloatingHeroArtwork weatherCode={weatherCode} isDay={isDay} />

        {/* Main Temperature & Conditions */}
        <Box sx={{ my: 'auto', py: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '3.6rem', sm: '4.8rem' },
              fontWeight: 800,
              lineHeight: 1,
              color: '#FFFFFF',
              letterSpacing: '-2px',
            }}
          >
            {formatTemperature(current.temperature_2m, unit)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <WeatherIcon code={weatherCode} isDay={isDay} size={24} strokeWidth={2} />
            <Typography variant="h6" fontWeight={600} sx={{ color: '#FFFFFF' }}>
              {getWeatherDescription(weatherCode)}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', mt: 0.5 }}>
            Feels like: {formatTemperature(current.apparent_temperature, unit)} | H:{' '}
            {formatTemperature(tempMax, unit)} L: {formatTemperature(tempMin, unit)}
          </Typography>
        </Box>

        {/* Sunrise / Sunset Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Sunrise size={15} color="#FBBF24" strokeWidth={2} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              Sunrise {formatTime(sunrise)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Sunset size={15} color="#F97316" strokeWidth={2} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              Sunset {formatTime(sunset)}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* ── Right Card: Weather Insights Mini Summary ──────────────── */}
      <Card
        sx={{
          borderRadius: 5,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Sprout size={18} color="#34D399" />
          <Typography variant="subtitle2" fontWeight={700}>
            Weather Insights
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.5 }}>
          <CircularAQIGauge aqi={aqiScore} />
          <Box>
            <Typography variant="body1" fontWeight={700} sx={{ color: aqiColor, lineHeight: 1.2 }}>
              {aqiLabel}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              Air Quality
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4, fontSize: '0.72rem' }}>
              Enjoy outdoor activities!
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sun size={16} color="#FBBF24" />
            <Typography variant="body2" fontWeight={600}>
              {uv} UV Index
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#FBBF24', fontSize: '0.82rem' }}>
              {uvLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', display: 'block' }}>
              Use sunscreen
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Droplets size={16} color="#38BDF8" />
            <Typography variant="body2" fontWeight={600}>
              Humidity {humidity}%
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#34D399', fontSize: '0.82rem' }}>
            {humidityLabel}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
