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
import { formatHour, formatTemperature } from '../../utils/formatters';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function TempTooltip({ active, payload, label, unit, theme }) {
  if (!active || !payload?.length) return null;
  const temp = payload[0]?.value;
  const feel = payload[1]?.value;
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
      {temp != null && (
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {formatTemperature(temp, unit)}
        </Typography>
      )}
      {feel != null && (
        <Typography variant="caption" color="text.secondary">
          Feels like {formatTemperature(feel, unit)}
        </Typography>
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * 24-hour temperature area chart.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (hourly + current)
 *  unit         'C'|'F'
 */
export default function TemperatureChart({ weatherData, unit = 'C' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!weatherData?.hourly) return null;

  const { hourly, current } = weatherData;
  const currentHourPrefix = (current?.time ?? '').slice(0, 13);

  let startIdx = hourly.time.findIndex((t) => t.slice(0, 13) >= currentHourPrefix);
  if (startIdx === -1) startIdx = 0;

  const data = hourly.time.slice(startIdx, startIdx + 24).map((time, i) => {
    const di = startIdx + i;
    const rawTemp = hourly.temperature_2m?.[di];
    const rawFeel = hourly.apparent_temperature?.[di];
    const temp = rawTemp != null
      ? (unit === 'F' ? Math.round((rawTemp * 9) / 5 + 32) : Math.round(rawTemp))
      : null;
    const feel = rawFeel != null
      ? (unit === 'F' ? Math.round((rawFeel * 9) / 5 + 32) : Math.round(rawFeel))
      : null;
    return { time, label: i === 0 ? 'Now' : formatHour(time), temp, feel };
  });

  const temps = data.map((d) => d.temp).filter((v) => v != null);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const currentTemp = data[0]?.temp;

  const primaryColor = isDark ? '#38BDF8' : '#0284C7';
  const secondaryColor = isDark ? '#818CF8' : '#6366F1';
  const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(15,23,42,0.07)';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="feelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
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
            domain={[minTemp, maxTemp]}
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip
            content={<TempTooltip unit={unit} theme={theme} />}
            cursor={{ stroke: primaryColor, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          {currentTemp != null && (
            <ReferenceLine
              x="Now"
              stroke={primaryColor}
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          )}
          {/* Feels-like area behind */}
          <Area
            type="monotone"
            dataKey="feel"
            stroke={secondaryColor}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#feelGrad)"
            dot={false}
            activeDot={false}
          />
          {/* Temperature area in front */}
          <Area
            type="monotone"
            dataKey="temp"
            stroke={primaryColor}
            strokeWidth={2.5}
            fill="url(#tempGrad)"
            dot={false}
            activeDot={{ r: 5, fill: primaryColor, stroke: theme.palette.background.paper, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
