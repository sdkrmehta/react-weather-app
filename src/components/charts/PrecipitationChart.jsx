import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { formatHour } from '../../utils/formatters';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function PrecipTooltip({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(30, 41, 59, 0.97)'
          : 'rgba(255, 255, 255, 0.97)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        px: 1.5,
        py: 1,
        boxShadow: theme.shadows[4],
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ color: '#38BDF8' }}>
        {val != null ? `${val}%` : '--'} chance of rain
      </Typography>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * 24-hour precipitation probability bar chart.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (hourly + current)
 */
export default function PrecipitationChart({ weatherData }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!weatherData?.hourly) return null;

  const { hourly, current } = weatherData;
  const currentHourPrefix = (current?.time ?? '').slice(0, 13);

  let startIdx = hourly.time.findIndex((t) => t.slice(0, 13) >= currentHourPrefix);
  if (startIdx === -1) startIdx = 0;

  const data = hourly.time.slice(startIdx, startIdx + 24).map((time, i) => {
    const di = startIdx + i;
    return {
      time,
      label: i === 0 ? 'Now' : formatHour(time),
      prob: hourly.precipitation_probability?.[di] ?? 0,
    };
  });

  const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(15,23,42,0.07)';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  // Color scale: 0–30% low blue, 30–60% medium, 60–100% high
  const barColor = (prob) => {
    if (prob >= 70) return '#0EA5E9';
    if (prob >= 40) return '#38BDF8';
    return isDark ? '#7DD3FC' : '#BAE6FD';
  };

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            content={<PrecipTooltip theme={theme} />}
            cursor={{ fill: isDark ? 'rgba(56,189,248,0.06)' : 'rgba(2,132,199,0.05)' }}
          />
          {/* 50% reference line — moderate chance threshold */}
          <ReferenceLine
            y={50}
            stroke={isDark ? 'rgba(56,189,248,0.3)' : 'rgba(2,132,199,0.25)'}
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Bar dataKey="prob" radius={[3, 3, 0, 0]} maxBarSize={22}>
            {data.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.prob)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
