import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Home, Heart, Clock, Settings, Info } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

/**
 * Modern floating bottom navigation bar for mobile viewports (< lg).
 */
export default function MobileBottomNav({ activeTab, onTabChange }) {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        px: 2,
        py: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(10, 17, 34, 0.92)'
            : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(15, 23, 42, 0.08)',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <ButtonBase
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.3,
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              color: isActive ? '#2563EB' : 'text.secondary',
              transition: 'all 0.2s ease',
            }}
          >
            <Box
              sx={{
                p: 0.5,
                borderRadius: 9999,
                backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
            </Box>
            <Typography
              variant="caption"
              fontWeight={isActive ? 700 : 500}
              sx={{ fontSize: '0.68rem' }}
            >
              {item.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
