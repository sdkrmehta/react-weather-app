import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Sunrise, Sunset, Thermometer, Droplets, MapPin, RefreshCw, Heart } from 'lucide-react';
import WeatherCard from '../common/WeatherCard';
import WeatherIcon from './WeatherIcon';
import { formatTemperature, formatTime, formatDate } from '../../utils/formatters';
import { getWeatherDescription } from '../../utils/weatherCodes';

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function CurrentWeatherSkeleton() {
  return (
    <WeatherCard noPadding sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header area */}
      <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
        <Skeleton variant="text" width="55%" height={28} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="38%" height={22} sx={{ mb: 2.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2 }}>
          <Skeleton variant="circular" width={72} height={72} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={80} />
            <Skeleton variant="text" width="80%" height={28} />
          </Box>
        </Box>
        <Skeleton variant="text" width="45%" height={22} />
      </Box>

      {/* Stats area */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ textAlign: 'center' }}>
              <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 0.5 }} />
              <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} height={28} />
            </Box>
          ))}
        </Box>
        <Skeleton variant="rectangular" height={1} sx={{ my: 2, borderRadius: 1 }} />
        <Skeleton variant="text" width="65%" height={22} />
      </Box>
    </WeatherCard>
  );
}

// ─── Empty / placeholder state ────────────────────────────────────────────────

function EmptyState() {
  return (
    <WeatherCard
      sx={{
        width: '100%',
        textAlign: 'center',
        py: 6,
        px: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <WeatherIcon code={2} isDay={1} size={72} strokeWidth={1.25} />
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Search for a city
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter a city name or use your current location to see real-time weather.
      </Typography>
    </WeatherCard>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Hero current-conditions card.
 *
 * Props:
 *  weatherData       object   – raw Open-Meteo response (current + daily)
 *  location          object   – { name, latitude, longitude }
 *  loading           boolean
 *  error             string|null
 *  unit              'C'|'F'  – temperature unit
 *  onRefresh         fn       – called when user clicks the refresh button
 *  isFavourite       boolean  – whether the current city is in favourites
 *  onToggleFavourite fn       – called to add/remove from favourites
 */
export default function CurrentWeather({
  weatherData,
  location,
  loading,
  error,
  unit = 'C',
  onRefresh,
  isFavourite = false,
  onToggleFavourite,
}) {
  if (loading) return <CurrentWeatherSkeleton />;

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ width: '100%', borderRadius: 3, fontSize: '0.9rem' }}
      >
        {error}
      </Alert>
    );
  }

  if (!weatherData || !location) return <EmptyState />;

  const { current, daily } = weatherData;
  const weatherCode = current.weather_code ?? 0;
  const isDay = current.is_day ?? 1;

  // Daily values for today (index 0)
  const tempMin = daily?.temperature_2m_min?.[0];
  const tempMax = daily?.temperature_2m_max?.[0];
  const sunrise = daily?.sunrise?.[0];
  const sunset  = daily?.sunset?.[0];
  const precipChance = daily?.precipitation_probability_max?.[0];

  return (
    <WeatherCard noPadding sx={{ width: '100%', overflow: 'hidden' }}>

      {/* ── Top gradient header ─────────────────────────────────────── */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2.5,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(56,189,248,0.1) 0%, rgba(14,165,233,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(56,189,248,0.14) 0%, rgba(2,132,199,0.05) 100%)',
        }}
      >
        {/* Location + date + action buttons */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <MapPin size={15} style={{ opacity: 0.55, flexShrink: 0 }} />
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {location.name}
            </Typography>

            {/* Favourite toggle */}
            <Tooltip title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
              <IconButton
                size="small"
                onClick={onToggleFavourite}
                aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                sx={{
                  color: isFavourite ? '#F87171' : 'text.secondary',
                  '&:hover': { color: '#F87171' },
                  p: 0.5,
                }}
              >
                <Heart
                  size={17}
                  strokeWidth={1.75}
                  fill={isFavourite ? '#F87171' : 'none'}
                />
              </IconButton>
            </Tooltip>

            {/* Refresh */}
            <Tooltip title="Refresh weather data">
              <IconButton
                size="small"
                onClick={onRefresh}
                aria-label="Refresh weather data"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, p: 0.5 }}
              >
                <RefreshCw size={15} strokeWidth={2} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: '23px' }}>
            {formatDate(current.time)}
          </Typography>
        </Box>

        {/* Icon + big temperature */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 }, mb: 2 }}>
          <Box sx={{ flexShrink: 0 }}>
            <WeatherIcon
              code={weatherCode}
              isDay={isDay}
              size={76}
              strokeWidth={1.4}
            />
          </Box>
          <Box>
            <Typography
              fontWeight={800}
              color="primary.main"
              sx={{
                fontSize: { xs: '3.8rem', sm: '5rem' },
                lineHeight: 1,
                letterSpacing: { xs: '-2px', sm: '-3px' },
              }}
            >
              {formatTemperature(current.temperature_2m, unit)}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={500}
              sx={{ mt: 0.25, fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
            >
              {getWeatherDescription(weatherCode)}
            </Typography>
          </Box>
        </Box>

        {/* Feels like */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Thermometer size={15} style={{ opacity: 0.55 }} />
          <Typography variant="body2" color="text.secondary">
            Feels like{' '}
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {formatTemperature(current.apparent_temperature, unit)}
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* ── Stats grid ─────────────────────────────────────────────── */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, sm: 2 },
            textAlign: 'center',
            mb: 2.5,
          }}
        >
          {/* Min temp */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Min
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatTemperature(tempMin, unit)}
            </Typography>
          </Box>

          {/* Max temp */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Max
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatTemperature(tempMax, unit)}
            </Typography>
          </Box>

          {/* Sunrise */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Sunrise
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <Sunrise size={14} color="#FBBF24" strokeWidth={1.75} />
              <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                {formatTime(sunrise)}
              </Typography>
            </Box>
          </Box>

          {/* Sunset */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Sunset
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <Sunset size={14} color="#F97316" strokeWidth={1.75} />
              <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                {formatTime(sunset)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Humidity + precipitation row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Droplets size={16} color="#38BDF8" strokeWidth={1.75} />
            <Typography variant="body2" color="text.secondary">
              Humidity:{' '}
              <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {current.relative_humidity_2m ?? '--'}%
              </Box>
            </Typography>
          </Box>

          {precipChance !== undefined && precipChance !== null && (
            <Typography variant="body2" color="text.secondary">
              Rain chance:{' '}
              <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {precipChance}%
              </Box>
            </Typography>
          )}
        </Box>
      </Box>
    </WeatherCard>
  );
}
