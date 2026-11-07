import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import WeatherCard from '../common/WeatherCard';

/**
 * Base insight card — icon + label row at top, big value, optional sub-label,
 * optional bottom slot for a custom indicator (progress bar, arc, etc.).
 *
 * Props:
 *  icon        ReactNode   – Lucide icon element
 *  label       string      – Section label (e.g. "UV Index")
 *  value       string      – Primary display value (e.g. "7")
 *  valueColor  string      – Optional MUI color string for the value
 *  subLabel    string      – Secondary text below the value
 *  badge       ReactNode   – Optional coloured badge / chip next to the value
 *  indicator   ReactNode   – Optional custom element at the bottom of the card
 *  loading     boolean
 *  sx          object      – Extra sx overrides
 */
export default function InsightCard({
  icon,
  label,
  value,
  valueColor,
  subLabel,
  badge,
  indicator,
  loading = false,
  sx = {},
}) {
  if (loading) {
    return (
      <WeatherCard sx={{ height: '100%', ...sx }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, opacity: 0.4 }}>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" width={80} height={16} />
        </Box>
        <Skeleton variant="text" width="55%" height={40} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="80%" height={16} />
        {indicator && <Skeleton variant="rectangular" height={8} sx={{ mt: 2, borderRadius: 2 }} />}
      </WeatherCard>
    );
  }

  return (
    <WeatherCard sx={{ height: '100%', ...sx }}>
      {/* Label row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Box sx={{ opacity: 0.55, display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}
        >
          {label}
        </Typography>
      </Box>

      {/* Value + badge */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            lineHeight: 1.1,
            color: valueColor ?? 'text.primary',
          }}
        >
          {value ?? '--'}
        </Typography>
        {badge}
      </Box>

      {/* Sub-label */}
      {subLabel && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
          {subLabel}
        </Typography>
      )}

      {/* Optional custom indicator */}
      {indicator && <Box sx={{ mt: 1.75 }}>{indicator}</Box>}
    </WeatherCard>
  );
}
