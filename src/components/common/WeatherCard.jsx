import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * Reusable glassmorphic card for weather data sections.
 *
 * Uses the MUI theme for all colours — works in both dark and light modes
 * without any hardcoded colour values.
 *
 * Props:
 *  - children     {ReactNode}  Card body content
 *  - noPadding    {boolean}    When true, skips the default CardContent padding
 *  - animate      {boolean}    When true, plays the slide-up entrance animation (default: true)
 *  - animDelay    {string}     CSS animation-delay (e.g. '0.1s') for staggering cards
 *  - sx           {object}     Additional MUI sx overrides
 *  - ...props                  Passed through to the MUI Card component
 */
export default function WeatherCard({
  children,
  noPadding = false,
  animate = false,
  animDelay = '0s',
  sx = {},
  ...props
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        // Entrance animation
        ...(animate && {
          animation: 'slideUp 0.4s ease both',
          animationDelay: animDelay,
        }),
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 56px rgba(0, 0, 0, 0.55)'
              : '0 20px 56px rgba(15, 23, 42, 0.16)',
        },
        ...sx,
      }}
      {...props}
    >
      {noPadding
        ? children
        : <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>{children}</CardContent>
      }
    </Card>
  );
}
