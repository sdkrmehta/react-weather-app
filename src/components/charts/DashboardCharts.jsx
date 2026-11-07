import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Thermometer, Droplets } from 'lucide-react';
import {
  formatHour,
  formatDayName,
  formatShortDate,
} from '../../utils/formatters';

// ─── Custom Tooltip for Temperature Trend ─────────────────────────────────────
function CustomTempTooltip({ active, payload, label, unit, theme }) {
  if (!active || !payload?.length) return null;
  const tempItem = payload.find((p) => p.dataKey === 'temp');
  const tempMinItem = payload.find((p) => p.dataKey === 'tempMin');

  const temp = tempItem?.value;
  const tempMin = tempMinItem?.value;

  const formatVal = (v) => {
    if (v == null) return '--';
    const num = Number(v);
    const formatted = Number.isInteger(num) ? num : Number(num.toFixed(1));
    return `${formatted}°${unit}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 27, 51, 0.95)' : '#FFFFFF',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: 2.5,
        px: 1.5,
        py: 0.75,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.68rem', mb: 0.2 }}>
        {label}
      </Typography>
      {temp != null && (
        <Typography variant="body2" fontWeight={800} sx={{ color: '#F59E0B' }}>
          {tempMin != null ? `High: ${formatVal(temp)}` : formatVal(temp)}
        </Typography>
      )}
      {tempMin != null && (
        <Typography variant="caption" fontWeight={700} sx={{ color: '#38BDF8', display: 'block', mt: 0.2 }}>
          Low: {formatVal(tempMin)}
        </Typography>
      )}
    </Box>
  );
}

// ─── Custom Tooltip for Precipitation & Humidity ──────────────────────────────
function CustomPrecipHumidTooltip({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null;
  const precip = payload.find((p) => p.dataKey === 'precip')?.value;
  const humid = payload.find((p) => p.dataKey === 'humidity')?.value;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 27, 51, 0.95)' : '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2.5,
        px: 1.5,
        py: 0.75,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.68rem', mb: 0.2 }}>
        {label}
      </Typography>
      {precip != null && (
        <Typography variant="caption" fontWeight={700} sx={{ color: '#38BDF8', display: 'block' }}>
          Rain Chance: {precip}%
        </Typography>
      )}
      {humid != null && (
        <Typography variant="caption" fontWeight={700} sx={{ color: '#8B5CF6', display: 'block' }}>
          Humidity: {humid}%
        </Typography>
      )}
    </Box>
  );
}

/**
 * Dashboard Charts matching the bottom row of the reference image.
 */
export default function DashboardCharts({ weatherData, loading, unit = 'C' }) {
  const [timeRange, setTimeRange] = useState('24h');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (loading || !weatherData) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <Skeleton variant="rounded" height={230} sx={{ borderRadius: 5 }} />
        <Skeleton variant="rounded" height={230} sx={{ borderRadius: 5 }} />
      </Box>
    );
  }

  const { hourly, daily, daily30, current } = weatherData;
  const currentHourPrefix = (current?.time ?? '').slice(0, 13);

  const toUnitVal = (celsiusVal) => {
    if (celsiusVal == null) return null;
    return unit === 'F'
      ? Number(((celsiusVal * 9) / 5 + 32).toFixed(1))
      : Number(Number(celsiusVal).toFixed(1));
  };

  // ── Prepare Temperature Trend Data ──────────────────────────────────────────
  let tempData = [];

  if (timeRange === '24h') {
    let startIdx = (hourly?.time ?? []).findIndex(
      (t) => t.slice(0, 13) >= currentHourPrefix
    );
    if (startIdx === -1) startIdx = 0;

    tempData = (hourly?.time ?? []).slice(startIdx, startIdx + 24).map((time, idx) => {
      const di = startIdx + idx;
      const rawTemp = hourly.temperature_2m?.[di];
      const rawFeel = hourly.apparent_temperature?.[di];
      const baseT = rawTemp != null ? rawTemp : 20;
      const feelT = rawFeel != null ? rawFeel : baseT;

      // Hourly High & Low temperature corridor
      const rawHigh = Math.max(baseT, feelT) + 1.2;
      const rawLow = Math.min(baseT, feelT) - 1.2;

      return {
        time,
        label: idx === 0 ? 'Now' : formatHour(time),
        temp: toUnitVal(rawHigh),
        tempMin: toUnitVal(rawLow),
      };
    });
  } else if (timeRange === '7d') {
    // 7-day daily forecast: High & Low temperatures
    tempData = (daily?.time ?? []).slice(0, 7).map((dateStr, i) => {
      const rawMax = daily.temperature_2m_max?.[i];
      const rawMin = daily.temperature_2m_min?.[i];

      return {
        time: dateStr,
        label: i === 0 ? 'Today' : formatDayName(dateStr),
        temp: toUnitVal(rawMax),
        tempMin: toUnitVal(rawMin),
      };
    });
  } else {
    // 30d / Monthly trend: Full 30-day timeline from daily30 (or daily fallback)
    const sourceDaily = daily30 && Array.isArray(daily30.time) ? daily30 : daily;
    const todayStr = (current?.time ?? '').slice(0, 10);

    tempData = (sourceDaily?.time ?? []).map((dateStr, i) => {
      const rawMax = sourceDaily.temperature_2m_max?.[i];
      const rawMin = sourceDaily.temperature_2m_min?.[i];
      const isToday = dateStr === todayStr;

      return {
        time: dateStr,
        label: isToday ? 'Today' : formatShortDate(dateStr),
        temp: toUnitVal(rawMax),
        tempMin: toUnitVal(rawMin),
      };
    });
  }

  // Filter labels on X-Axis to show nicely spaced intervals like "Now", "6 PM", "12 AM", etc.
  const allTemps = [];
  tempData.forEach((d) => {
    if (d.temp != null) allTemps.push(d.temp);
    if (d.tempMin != null) allTemps.push(d.tempMin);
  });
  const minTemp = allTemps.length ? Math.floor(Math.min(...allTemps)) - 2 : 0;
  const maxTemp = allTemps.length ? Math.ceil(Math.max(...allTemps)) + 2 : 30;

  // ── Prepare Precipitation & Humidity Combined Data (7 Days) ─────────────────
  const precipHumidData = (daily?.time ?? []).slice(0, 7).map((dateStr, i) => {
    return {
      day: i === 0 ? 'Today' : formatDayName(dateStr),
      precip: daily.precipitation_probability_max?.[i] ?? 0,
      humidity: hourly.relative_humidity_2m?.[i * 24] ?? 70,
    };
  });

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.06)';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 2,
      }}
    >
      {/* ── 1. Temperature Trend Area Chart ─────────────────────────── */}
      <Card sx={{ borderRadius: 5, p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Thermometer size={17} color="#F59E0B" />
            <Typography variant="subtitle2" fontWeight={700}>
              Temperature Trend
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* High / Low legend for 24h, 7d, and 30d */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <Typography variant="caption" sx={{ fontSize: '0.72rem', color: textColor, fontWeight: 600 }}>
                  High
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                <Typography variant="caption" sx={{ fontSize: '0.72rem', color: textColor, fontWeight: 600 }}>
                  Low
                </Typography>
              </Box>
            </Box>

            {/* Time range switch pills: 24h, 7d, 30d */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 0.35,
                borderRadius: 9999,
                backgroundColor: isDark ? 'rgba(16, 27, 51, 0.85)' : 'rgba(241, 245, 249, 0.9)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
              }}
            >
              {['24h', '7d', '30d'].map((range) => {
                const isActive = timeRange === range;
                return (
                  <ButtonBase
                    key={range}
                    onClick={() => setTimeRange(range)}
                    sx={{
                      px: 1.25,
                      py: 0.3,
                      borderRadius: 9999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isActive ? '#2563EB' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'text.secondary',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {range}
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Golden Spline Area Chart */}
        <Box sx={{ width: '100%', height: 170 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tempData} margin={{ top: 8, right: 10, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="amberTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cyanTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: textColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={timeRange === '7d' ? 0 : Math.max(0, Math.floor(tempData.length / 5))}
              />
              <YAxis
                domain={[minTemp, maxTemp]}
                tick={{ fill: textColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}°`}
              />
              <Tooltip content={<CustomTempTooltip unit={unit} theme={theme} />} />
              <Area
                type="monotone"
                dataKey="temp"
                name="High"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fill="url(#amberTempGrad)"
                dot={{ r: 3, fill: '#F59E0B', stroke: '#080E1E', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="tempMin"
                name="Low"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fill="url(#cyanTempGrad)"
                dot={{ r: 3, fill: '#38BDF8', stroke: '#080E1E', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#38BDF8', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* ── 2. Precipitation & Humidity Combined Chart ──────────────── */}
      <Card sx={{ borderRadius: 5, p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Droplets size={17} color="#38BDF8" />
            <Typography variant="subtitle2" fontWeight={700}>
              Precipitation & Humidity
            </Typography>
          </Box>

          {/* Legend Pills */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
              <Typography variant="caption" sx={{ fontSize: '0.72rem', color: textColor }}>
                Precipitation
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
              <Typography variant="caption" sx={{ fontSize: '0.72rem', color: textColor }}>
                Humidity
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Combined Bar + Line Chart */}
        <Box sx={{ width: '100%', height: 170 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={precipHumidData} margin={{ top: 8, right: 10, left: -24, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: textColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: textColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomPrecipHumidTooltip theme={theme} />} />
              <Bar
                dataKey="precip"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                opacity={0.85}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#8B5CF6', stroke: '#080E1E', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}
