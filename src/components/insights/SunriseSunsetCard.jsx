import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WeatherCard from '../common/WeatherCard';
import { Sunrise, Sunset } from 'lucide-react';
import { formatTime, formatDuration } from '../../utils/formatters';
import Skeleton from '@mui/material/Skeleton';

// ─── Helper: parse HH:MM from an ISO string ───────────────────────────────────

function parseMinutes(isoString) {
  if (!isoString) return null;
  const timePart = isoString.includes('T') ? isoString.split('T')[1] : isoString;
  const [h, m] = timePart.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

// ─── Sun arc progress bar ─────────────────────────────────────────────────────

/**
 * Horizontal arc bar showing current position of the sun between sunrise and sunset.
 * Uses string-parsed minutes to stay timezone-safe.
 */
function SunProgressBar({ sunriseStr, sunsetStr, currentStr }) {
  const riseMin    = parseMinutes(sunriseStr);
  const setMin     = parseMinutes(sunsetStr);
  const currentMin = parseMinutes(currentStr);

  if (riseMin == null || setMin == null || currentMin == null) return null;

  const dayLength = setMin - riseMin;
  if (dayLength <= 0) return null;

  // Clamp progress between 0–100%
  const rawPct = ((currentMin - riseMin) / dayLength) * 100;
  const pct    = Math.min(100, Math.max(0, rawPct));
  const isDay  = currentMin >= riseMin && currentMin <= setMin;

  return (
    <Box sx={{ position: 'relative', mt: 1.75 }}>
      {/* Track */}
      <Box
        sx={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, rgba(251,191,36,0.3) 0%, rgba(249,115,22,0.3) 100%)'
              : 'linear-gradient(90deg, rgba(251,191,36,0.4) 0%, rgba(249,115,22,0.4) 100%)',
          position: 'relative',
        }}
      >
        {/* Filled portion */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #FBBF24 0%, #F97316 100%)',
            transition: 'width 0.6s ease',
          }}
        />

        {/* Sun dot */}
        {isDay && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#FBBF24',
              boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)',
              border: '2px solid #FFF',
              transition: 'left 0.6s ease',
            }}
          />
        )}
      </Box>

      {/* Labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <Sunrise size={12} color="#FBBF24" strokeWidth={2} />
          <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#FBBF24' }}>
            {formatTime(sunriseStr)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <Sunset size={12} color="#F97316" strokeWidth={2} />
          <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#F97316' }}>
            {formatTime(sunsetStr)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Sunrise & Sunset insight card with animated sun progress bar.
 *
 * Props:
 *  daily    object   – Open-Meteo daily weather object
 *  current  object   – Open-Meteo current weather object (for current time)
 *  loading  boolean
 */
export default function SunriseSunsetCard({ daily, current, loading }) {
  if (loading) {
    return (
      <WeatherCard sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, opacity: 0.4 }}>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" width={100} height={16} />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
          <Skeleton variant="text" width={70} height={36} />
          <Skeleton variant="text" width={70} height={36} />
        </Box>
        <Skeleton variant="rectangular" height={6} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant="text" width={80} height={18} />
      </WeatherCard>
    );
  }

  const sunrise      = daily?.sunrise?.[0];
  const sunset       = daily?.sunset?.[0];
  const currentTime  = current?.time ?? null;
  const daylightSecs = daily?.daylight_duration?.[0] ?? null;

  return (
    <WeatherCard sx={{ height: '100%' }}>
      {/* Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Box sx={{ opacity: 0.55, display: 'flex', alignItems: 'center' }}>
          <Sunrise size={16} strokeWidth={2} />
        </Box>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}
        >
          Sunrise & Sunset
        </Typography>
      </Box>

      {/* Sunrise / Sunset times side by side */}
      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, mb: 0.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
            <Sunrise size={14} color="#FBBF24" strokeWidth={2} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.70rem' }}>
              Sunrise
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {formatTime(sunrise)}
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
            <Sunset size={14} color="#F97316" strokeWidth={2} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.70rem' }}>
              Sunset
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {formatTime(sunset)}
          </Typography>
        </Box>
      </Box>

      {/* Sun progress arc */}
      {sunrise && sunset && currentTime && (
        <SunProgressBar
          sunriseStr={sunrise}
          sunsetStr={sunset}
          currentStr={currentTime}
        />
      )}

      {/* Daylight duration */}
      {daylightSecs != null && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontSize: '0.80rem' }}
        >
          Daylight:{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {formatDuration(daylightSecs)}
          </Box>
        </Typography>
      )}
    </WeatherCard>
  );
}
