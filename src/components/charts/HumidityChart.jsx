import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { formatHour } from '../../utils/formatters';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function HumidityTooltip({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const comfort =
    val < 30 ? 'Dry' : val < 40 ? 'Comfortable' : val < 60 ? 'Ideal' : val < 70 ? 'Humid' : 'Very Humid';
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
      <Typography variant="body2" fontWeight={700} sx={{ color: '#818CF8' }}>
        {val != null ? `${val}%` : '--'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {comfort}
      </Typography>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * 24-hour relative humidity area chart.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (hourly + current)
 */
export default function HumidityChart({ weatherData }) {
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
      humidity: hourly.relative_humidity_2m?.[di] ?? null,
    };
  });

  const areaColor = isDark ? '#818CF8' : '#6366F1';
  const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(15,23,42,0.07)';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={areaColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            content={<HumidityTooltip theme={theme} />}
            cursor={{ stroke: areaColor, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          {/* Comfort zone band markers */}
          <ReferenceLine
            y={40}
            stroke={isDark ? 'rgba(129,140,248,0.25)' : 'rgba(99,102,241,0.2)'}
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: 'Ideal', position: 'right', fontSize: 10, fill: textColor }}
          />
          <ReferenceLine
            y={70}
            stroke={isDark ? 'rgba(129,140,248,0.25)' : 'rgba(99,102,241,0.2)'}
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="humidity"
            stroke={areaColor}
            strokeWidth={2.5}
            fill="url(#humidGrad)"
            dot={false}
            activeDot={{ r: 5, fill: areaColor, stroke: theme.palette.background.paper, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
