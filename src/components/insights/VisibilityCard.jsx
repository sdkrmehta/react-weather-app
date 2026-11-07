import InsightCard from './InsightCard';
import { Eye } from 'lucide-react';

/**
 * Returns a human-readable visibility condition label.
 * Input is in metres (Open-Meteo visibility unit).
 */
function visibilityLabel(metres) {
  if (metres == null)       return null;
  if (metres >= 10000)      return 'Excellent — perfectly clear conditions.';
  if (metres >= 4000)       return 'Good — clear with minor haze.';
  if (metres >= 1000)       return 'Moderate — some fog or haze present.';
  if (metres >= 200)        return 'Poor — thick fog. Drive with caution.';
  return                     'Very poor — dense fog. Avoid driving if possible.';
}

/**
 * Formats metres as a display string with correct unit.
 */
function formatVis(metres) {
  if (metres == null) return '--';
  if (metres >= 1000) return `${(metres / 1000).toFixed(1)} km`;
  return `${metres} m`;
}

/**
 * Visibility insight card.
 *
 * Props:
 *  current  object   – Open-Meteo current weather object
 *  loading  boolean
 */
export default function VisibilityCard({ current, loading }) {
  const metres = current?.visibility ?? null;
  const label  = visibilityLabel(metres);

  return (
    <InsightCard
      icon={<Eye size={16} strokeWidth={2} />}
      label="Visibility"
      value={formatVis(metres)}
      subLabel={label ?? undefined}
      loading={loading}
    />
  );
}
