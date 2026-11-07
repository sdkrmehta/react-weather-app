import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { formatDayName, formatTemperature } from '../../utils/formatters';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function WeeklyTooltip({ active, payload, label, unit, theme }) {
  if (!active || !payload?.length) return null;
  const minVal = payload.find((p) => p.dataKey === 'min')?.value;
  const maxVal = payload.find((p) => p.dataKey === 'max')?.value;
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
      {maxVal != null && (
        <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.3 }}>
          High: {formatTemperature(maxVal, unit)}
        </Typography>
      )}
      {minVal != null && (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
          Low: {formatTemperature(minVal, unit)}
        </Typography>
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * 7-day min/max temperature grouped bar chart.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (daily)
 *  unit         'C'|'F'
 */
export default function WeeklyTempChart({ weatherData, unit = 'C' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!weatherData?.daily) return null;

  const { daily, current } = weatherData;
  const todayPrefix = (current?.time ?? '').slice(0, 10);

  const toUnit = (c) =>
    c != null ? (unit === 'F' ? Math.round((c * 9) / 5 + 32) : Math.round(c)) : null;

  const data = (daily.time ?? []).map((dateStr, i) => ({
    day: dateStr.startsWith(todayPrefix) ? 'Today' : formatDayName(dateStr),
    min: toUnit(daily.temperature_2m_min?.[i]),
    max: toUnit(daily.temperature_2m_max?.[i]),
    isToday: dateStr.startsWith(todayPrefix),
  }));

  const primaryColor = isDark ? '#38BDF8' : '#0284C7';
  const secondaryColor = isDark ? '#7DD3FC' : '#BAE6FD';
  const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(15,23,42,0.07)';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip
            content={<WeeklyTooltip unit={unit} theme={theme} />}
            cursor={{ fill: isDark ? 'rgba(56,189,248,0.06)' : 'rgba(2,132,199,0.05)' }}
          />
          <Legend
            formatter={(value) => (
              <Typography component="span" variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                {value === 'max' ? 'High' : 'Low'}
              </Typography>
            )}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="max" name="max" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isToday ? primaryColor : secondaryColor}
                opacity={entry.isToday ? 1 : 0.75}
              />
            ))}
          </Bar>
          <Bar dataKey="min" name="min" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isToday ? '#818CF8' : '#C4B5FD'}
                opacity={entry.isToday ? 1 : 0.65}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
