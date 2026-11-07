import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InsightCard from './InsightCard';
import { Sun } from 'lucide-react';

/**
 * UV Index risk levels and recommendations.
 * WHO standard scale.
 */
function getUVInfo(uv) {
  if (uv == null)  return { label: 'Unavailable', color: '#94A3B8', advice: 'UV data not available.' };
  if (uv <= 2)     return { label: 'Low',          color: '#34D399', advice: 'No protection needed. Safe to be outside.' };
  if (uv <= 5)     return { label: 'Moderate',     color: '#FBBF24', advice: 'Seek shade during midday. Wear a hat and sunglasses.' };
  if (uv <= 7)     return { label: 'High',         color: '#FB923C', advice: 'Reduce time in the sun between 10 AM–4 PM. Use SPF 30+ sunscreen.' };
  if (uv <= 10)    return { label: 'Very High',    color: '#F87171', advice: 'Take extra precautions. Unprotected skin can burn quickly. Use SPF 50+.' };
  return            { label: 'Extreme',            color: '#C084FC', advice: 'Avoid sun exposure between 10 AM–4 PM. Full protective clothing required.' };
}

/**
 * UV intensity bar (0–12 scale).
 */
function UVBar({ uv }) {
  const pct = Math.min(100, ((uv ?? 0) / 12) * 100);
  const { color } = getUVInfo(uv);
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
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>12+</Typography>
      </Box>
    </Box>
  );
}

/**
 * UV Index insight card.
 *
 * Props:
 *  current  object   – Open-Meteo current weather object
 *  loading  boolean
 */
export default function UVIndexCard({ current, loading }) {
  const uv = current?.uv_index != null ? Math.round(current.uv_index * 10) / 10 : null;
  const { label, color, advice } = getUVInfo(uv);

  const badge = uv != null ? (
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
      icon={<Sun size={16} strokeWidth={2} />}
      label="UV Index"
      value={uv != null ? String(uv) : '--'}
      valueColor={uv != null ? color : undefined}
      subLabel={advice}
      badge={badge}
      indicator={uv != null ? <UVBar uv={uv} /> : null}
      loading={loading}
    />
  );
}
