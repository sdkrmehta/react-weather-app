import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InsightCard from './InsightCard';
import { Wind } from 'lucide-react';

/**
 * AQI category metadata.
 * Uses the US AQI scale (0–500).
 */
function getAQIInfo(aqi) {
  if (aqi == null) return { label: 'Unavailable', color: '#94A3B8', advice: 'No data available.' };
  if (aqi <= 50)  return { label: 'Good',          color: '#34D399', advice: 'Air quality is satisfactory. Enjoy outdoor activities.' };
  if (aqi <= 100) return { label: 'Moderate',      color: '#FBBF24', advice: 'Acceptable air quality. Unusually sensitive people should limit prolonged exertion outdoors.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#FB923C', advice: 'Sensitive groups may experience health effects. The general public is less likely to be affected.' };
  if (aqi <= 200) return { label: 'Unhealthy',     color: '#F87171', advice: 'Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor exertion.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#C084FC', advice: 'Health alert. Everyone should avoid prolonged outdoor exertion.' };
  return           { label: 'Hazardous',           color: '#BE123C', advice: 'Health warning. Avoid all outdoor activities.' };
}

/**
 * Coloured AQI progress bar (0–300 range displayed).
 */
function AQIBar({ aqi }) {
  const pct = Math.min(100, ((aqi ?? 0) / 300) * 100);
  const { color } = getAQIInfo(aqi);
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
            width: `${pct}%`,
            borderRadius: 3,
            backgroundColor: color,
            transition: 'width 0.6s ease',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>0</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>300+</Typography>
      </Box>
    </Box>
  );
}

/**
 * Air Quality Index insight card.
 *
 * Props:
 *  aqData   object   – raw Open-Meteo air quality response
 *  loading  boolean
 */
export default function AirQualityCard({ aqData, loading }) {
  const usAqi = aqData?.current?.us_aqi;
  const { label, color, advice } = getAQIInfo(usAqi);

  const badge = usAqi != null ? (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: `${color}22`,
        color,
        fontWeight: 700,
        fontSize: '0.7rem',
        height: 22,
        border: `1px solid ${color}44`,
      }}
    />
  ) : null;

  return (
    <InsightCard
      icon={<Wind size={16} strokeWidth={2} />}
      label="Air Quality"
      value={usAqi != null ? String(usAqi) : '--'}
      valueColor={usAqi != null ? color : undefined}
      subLabel={advice}
      badge={badge}
      indicator={usAqi != null ? <AQIBar aqi={usAqi} /> : null}
      loading={loading}
    />
  );
}
