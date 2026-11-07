import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import WeatherCard from '../common/WeatherCard';
import TemperatureChart from './TemperatureChart';
import WeeklyTempChart from './WeeklyTempChart';
import PrecipitationChart from './PrecipitationChart';
import HumidityChart from './HumidityChart';
import { Thermometer, CalendarDays, Droplets, CloudRain } from 'lucide-react';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  {
    id: 'temp24',
    label: '24h Temp',
    icon: <Thermometer size={14} strokeWidth={2} />,
    description: 'Temperature & feels-like over the next 24 hours',
  },
  {
    id: 'weekly',
    label: '7-Day',
    icon: <CalendarDays size={14} strokeWidth={2} />,
    description: 'Daily high & low temperatures for the week',
  },
  {
    id: 'precip',
    label: 'Rain',
    icon: <CloudRain size={14} strokeWidth={2} />,
    description: 'Precipitation probability over the next 24 hours',
  },
  {
    id: 'humidity',
    label: 'Humidity',
    icon: <Droplets size={14} strokeWidth={2} />,
    description: 'Relative humidity trend over the next 24 hours',
  },
];

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <WeatherCard sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {TABS.map((t) => (
          <Skeleton key={t.id} variant="rounded" width={80} height={32} />
        ))}
      </Box>
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
    </WeatherCard>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Tabbed weather chart section.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response
 *  loading      boolean
 *  unit         'C'|'F'
 */
export default function WeatherCharts({ weatherData, loading, unit = 'C' }) {
  const [activeTab, setActiveTab] = useState(0);

  if (loading) return <ChartSkeleton />;
  if (!weatherData) return null;

  const tab = TABS[activeTab];

  return (
    <WeatherCard sx={{ width: '100%' }}>
      {/* Section header */}
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="text.secondary"
        sx={{
          mb: 1.5,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.72rem',
        }}
      >
        Charts
      </Typography>

      {/* Tab switcher */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          mb: 2,
          minHeight: 36,
          '& .MuiTabs-indicator': {
            height: 2,
            borderRadius: 1,
            backgroundColor: 'primary.main',
          },
          '& .MuiTabs-flexContainer': { gap: 0.5 },
        }}
      >
        {TABS.map((t) => (
          <Tab
            key={t.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {t.icon}
                <span>{t.label}</span>
              </Box>
            }
            sx={{
              minHeight: 36,
              py: 0.75,
              px: 1.5,
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              minWidth: 'auto',
              color: 'text.secondary',
              transition: 'color 0.2s ease, background-color 0.2s ease',
              '&.Mui-selected': { color: 'primary.main' },
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(56, 189, 248, 0.08)'
                    : 'rgba(2, 132, 199, 0.06)',
              },
            }}
          />
        ))}
      </Tabs>

      {/* Chart description */}
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 1.5, fontSize: '0.72rem' }}
      >
        {tab.description}
      </Typography>

      {/* Active chart */}
      <Box
        sx={{
          minHeight: 220,
          // Soft fade animation when switching tabs
          animation: 'fadeIn 0.25s ease',
          '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
        key={activeTab}
      >
        {activeTab === 0 && <TemperatureChart weatherData={weatherData} unit={unit} />}
        {activeTab === 1 && <WeeklyTempChart weatherData={weatherData} unit={unit} />}
        {activeTab === 2 && <PrecipitationChart weatherData={weatherData} />}
        {activeTab === 3 && <HumidityChart weatherData={weatherData} />}
      </Box>
    </WeatherCard>
  );
}
