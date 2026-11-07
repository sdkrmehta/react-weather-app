import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsightCard from './InsightCard';
import { Wind, Navigation } from 'lucide-react';
import { formatWindDirection } from '../../utils/formatters';

/**
 * Returns a Beaufort-scale label for a given wind speed in km/h.
 */
function beaufortLabel(kmh) {
  if (kmh == null) return null;
  if (kmh < 1)   return 'Calm';
  if (kmh < 6)   return 'Light air';
  if (kmh < 12)  return 'Light breeze';
  if (kmh < 20)  return 'Gentle breeze';
  if (kmh < 29)  return 'Moderate breeze';
  if (kmh < 39)  return 'Fresh breeze';
  if (kmh < 50)  return 'Strong breeze';
  if (kmh < 62)  return 'Near gale';
  if (kmh < 75)  return 'Gale';
  if (kmh < 89)  return 'Strong gale';
  if (kmh < 103) return 'Storm';
  return          'Violent storm / Hurricane';
}

/**
 * Compass rose arrow — rotates to show wind direction.
 * Wind direction is *from* (meteorological convention), so we rotate the
 * "incoming" arrow to point in the direction the wind is blowing toward.
 */
function CompassArrow({ degrees }) {
  if (degrees == null) return null;
  // The arrow icon points "up" (north) at 0°. Wind direction is "from", so
  // the arrow should point in the *opposite* direction (where wind goes).
  const towardDeg = (degrees + 180) % 360;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(56, 189, 248, 0.3)'
              : 'rgba(2, 132, 199, 0.2)'
          }`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(56, 189, 248, 0.08)'
            : 'rgba(2, 132, 199, 0.05)',
        transform: `rotate(${towardDeg}deg)`,
        transition: 'transform 0.4s ease',
        flexShrink: 0,
      }}
    >
      <Navigation size={16} color="#38BDF8" strokeWidth={2} />
    </Box>
  );
}

/**
 * Wind insight card.
 *
 * Props:
 *  current  object   – Open-Meteo current weather object
 *  loading  boolean
 */
export default function WindCard({ current, loading }) {
  const speed     = current?.wind_speed_10m ?? null;
  const direction = current?.wind_direction_10m ?? null;
  const gusts     = current?.wind_gusts_10m ?? null;

  const compassLabel = formatWindDirection(direction);
  const bLabel       = beaufortLabel(speed);

  const subLabel = [
    bLabel,
    compassLabel !== '--' && direction != null
      ? `From ${compassLabel} (${Math.round(direction)}°)`
      : null,
    gusts != null ? `Gusts up to ${Math.round(gusts)} km/h` : null,
  ].filter(Boolean).join('  ·  ');

  return (
    <InsightCard
      icon={<Wind size={16} strokeWidth={2} />}
      label="Wind"
      value={speed != null ? `${Math.round(speed)} km/h` : '--'}
      subLabel={subLabel || undefined}
      indicator={
        direction != null ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CompassArrow degrees={direction} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
              {compassLabel !== '--' ? `Wind toward ${compassLabel}` : ''}
            </Typography>
          </Box>
        ) : null
      }
      loading={loading}
    />
  );
}
