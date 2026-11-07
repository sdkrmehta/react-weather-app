import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import {
  Home,
  Heart,
  Clock,
  Settings,
  Info,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

/**
 * Sidebar Navigation matching the reference UI design.
 */
export default function Sidebar({
  activeTab = 'home',
  onTabChange,
  isDark,
  onThemeToggle,
}) {
  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 3,
        px: 2,
        borderRight: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(15, 23, 42, 0.08)',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(10, 17, 34, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Brand Logo Header ────────────────────────────────────────── */}
      <Box sx={{ px: 1, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
            }}
          >
            <CloudSun size={22} color="#FFFFFF" strokeWidth={2} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.3px', lineHeight: 1.1 }}>
            WeatherWise
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', pl: '50px', fontSize: '0.68rem', lineHeight: 1.3 }}
        >
          Know the Weather.<br />Plan Better.
        </Typography>
      </Box>

      {/* ── Menu List ────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1, px: 0.5 }}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <ButtonBase
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.2,
                borderRadius: 3,
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive
                  ? '#FFFFFF'
                  : isDark ? 'rgba(248, 250, 252, 0.7)' : '#475569',
                backgroundColor: isActive ? '#2563EB' : 'transparent',
                boxShadow: isActive ? '0 4px 16px rgba(37, 99, 235, 0.4)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isActive
                    ? '#1D4ED8'
                    : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                  color: isActive ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A',
                },
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </ButtonBase>
          );
        })}
      </Box>

      {/* ── Bottom Promo / Motivation Box ────────────────────────────── */}
      <Box sx={{ mt: 'auto', px: 0.5 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3.5,
            textAlign: 'center',
            background: isDark
              ? 'linear-gradient(180deg, rgba(30, 48, 80, 0.45) 0%, rgba(18, 28, 50, 0.6) 100%)'
              : 'linear-gradient(180deg, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0.9) 100%)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(2, 132, 199, 0.15)',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Box
              className="floating-weather-art"
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              }}
            >
              <CloudSun size={26} color="#B45309" strokeWidth={2} />
            </Box>
          </Box>
          <Typography variant="caption" fontWeight={600} display="block" sx={{ lineHeight: 1.3 }}>
            Good vibes<br />for great weather!
          </Typography>
        </Box>

        {/* ── Sun / Moon Toggle Switch ───────────────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            p: 0.5,
            borderRadius: 9999,
            backgroundColor: isDark ? 'rgba(16, 27, 51, 0.9)' : 'rgba(226, 232, 240, 0.8)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <IconButton
            size="small"
            onClick={onThemeToggle}
            sx={{
              p: 0.75,
              borderRadius: 9999,
              backgroundColor: !isDark ? '#FFFFFF' : 'transparent',
              color: !isDark ? '#F59E0B' : '#64748B',
              boxShadow: !isDark ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Sun size={16} strokeWidth={2} />
          </IconButton>
          <IconButton
            size="small"
            onClick={onThemeToggle}
            sx={{
              p: 0.75,
              borderRadius: 9999,
              backgroundColor: isDark ? '#2563EB' : 'transparent',
              color: isDark ? '#FFFFFF' : '#64748B',
              boxShadow: isDark ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Moon size={16} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
