import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AirQualityCard from './AirQualityCard';
import UVIndexCard from './UVIndexCard';
import HumidityCard from './HumidityCard';
import WindCard from './WindCard';
import VisibilityCard from './VisibilityCard';
import PressureCard from './PressureCard';
import SunriseSunsetCard from './SunriseSunsetCard';

// Stagger delays for the 6 two-column cards (pairs enter together)
const DELAYS = ['0s', '0s', '0.07s', '0.07s', '0.14s', '0.14s', '0.21s'];

/**
 * Responsive insights grid — renders all 7 insight cards in a 2-column layout.
 *
 * Props:
 *  weatherData  object   – raw Open-Meteo response (current + daily)
 *  aqData       object   – raw Open-Meteo air quality response (may be null)
 *  loading      boolean  – main weather loading state
 *  aqLoading    boolean  – air quality loading state
 */
export default function WeatherInsights({ weatherData, aqData, loading, aqLoading }) {
  if (!weatherData && !loading) return null;

  const current = weatherData?.current ?? null;
  const daily   = weatherData?.daily ?? null;

  const cards = [
    <AirQualityCard   key="aqi"        aqData={aqData}   loading={aqLoading}  />,
    <UVIndexCard      key="uv"         current={current} loading={loading}     />,
    <HumidityCard     key="humidity"   current={current} loading={loading}     />,
    <WindCard         key="wind"       current={current} loading={loading}     />,
    <VisibilityCard   key="visibility" current={current} loading={loading}     />,
    <PressureCard     key="pressure"   current={current} loading={loading}     />,
  ];

  return (
    <Box sx={{ width: '100%' }}>
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
        Weather Details
      </Typography>

      {/* 2-column responsive grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
        }}
      >
        {cards.map((card, i) => (
          <Box
            key={card.key}
            sx={{
              animation: 'slideUp 0.4s ease both',
              animationDelay: DELAYS[i],
            }}
          >
            {card}
          </Box>
        ))}

        {/* Sunrise & Sunset — spans full width */}
        <Box
          sx={{
            gridColumn: '1 / -1',
            animation: 'slideUp 0.4s ease both',
            animationDelay: DELAYS[6],
          }}
        >
          <SunriseSunsetCard daily={daily} current={current} loading={loading} />
        </Box>
      </Box>
    </Box>
  );
}
