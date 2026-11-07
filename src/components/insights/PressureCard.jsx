import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsightCard from './InsightCard';
import { Gauge } from 'lucide-react';

/**
 * Returns a pressure condition label.
 * Standard atmospheric pressure ≈ 1013.25 hPa.
 */
function pressureLabel(hpa) {
  if (hpa == null) return null;
  if (hpa >= 1030) return 'High pressure — settled, dry weather likely.';
  if (hpa >= 1013) return 'Normal pressure — stable conditions.';
  if (hpa >= 995)  return 'Low pressure — unsettled weather possible.';
  return            'Very low pressure — stormy conditions likely.';
}

/**
 * Pressure trend bar: maps 970–1050 hPa range to 0–100%.
 */
function PressureBar({ hpa }) {
  const MIN = 970;
  const MAX = 1050;
  const pct = Math.min(100, Math.max(0, ((hpa - MIN) / (MAX - MIN)) * 100));
  // Color: low pressure = warm, high pressure = cool blue
  const color = hpa >= 1013 ? '#38BDF8' : hpa >= 995 ? '#FBBF24' : '#F87171';
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
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Low</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>High</Typography>
      </Box>
    </Box>
  );
}

/**
 * Atmospheric Pressure insight card.
 *
 * Props:
 *  current  object   – Open-Meteo current weather object
 *  loading  boolean
 */
export default function PressureCard({ current, loading }) {
  // Prefer mean sea-level pressure; fall back to surface pressure
  const hpa   = current?.pressure_msl ?? current?.surface_pressure ?? null;
  const label = pressureLabel(hpa);

  return (
    <InsightCard
      icon={<Gauge size={16} strokeWidth={2} />}
      label="Pressure"
      value={hpa != null ? `${Math.round(hpa)} hPa` : '--'}
      subLabel={label ?? undefined}
      indicator={hpa != null ? <PressureBar hpa={hpa} /> : null}
      loading={loading}
    />
  );
}
