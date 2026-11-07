import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsightCard from './InsightCard';
import { Droplets } from 'lucide-react';

/**
 * Approximate dew point using Magnus formula.
 * Returns °C rounded to 1 decimal.
 *
 * @param {number} tempC        – Air temperature in °C
 * @param {number} humidity     – Relative humidity 0–100
 */
function dewPoint(tempC, humidity) {
  if (tempC == null || humidity == null) return null;
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha) * 10) / 10;
}

/**
 * Returns a human-readable comfort label based on humidity.
 */
function humidityComfort(h) {
  if (h == null)  return null;
  if (h < 25)     return 'Very dry — consider using a humidifier.';
  if (h < 40)     return 'Comfortable and dry.';
  if (h < 60)     return 'Comfortable humidity levels.';
  if (h < 70)     return 'Slightly humid — may feel muggy.';
  if (h < 85)     return 'High humidity — expect some discomfort.';
  return           'Very high humidity — oppressive conditions possible.';
}

/**
 * Humidity progress bar (0–100).
 */
function HumidityBar({ value }) {
  // Color transitions: low=orange, optimal=green, high=blue
  const color = value < 30 ? '#FB923C' : value <= 65 ? '#34D399' : '#38BDF8';
  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(148, 163, 184, 0.12)'
              : 'rgba(15, 23, 42, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${value}%`,
            borderRadius: 3,
            backgroundColor: color,
            transition: 'width 0.6s ease',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>0%</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>100%</Typography>
      </Box>
    </Box>
  );
}

/**
 * Humidity insight card.
 *
 * Props:
 *  current  object   – Open-Meteo current weather object
 *  loading  boolean
 */
export default function HumidityCard({ current, loading }) {
  const humidity = current?.relative_humidity_2m ?? null;
  const temp     = current?.temperature_2m ?? null;
  const dp       = dewPoint(temp, humidity);
  const comfort  = humidityComfort(humidity);

  const subLabel = [
    comfort,
    dp != null ? `Dew point: ${dp}°C` : null,
  ].filter(Boolean).join('  ·  ');

  return (
    <InsightCard
      icon={<Droplets size={16} strokeWidth={2} />}
      label="Humidity"
      value={humidity != null ? `${humidity}%` : '--'}
      subLabel={subLabel || undefined}
      indicator={humidity != null ? <HumidityBar value={humidity} /> : null}
      loading={loading}
    />
  );
}
