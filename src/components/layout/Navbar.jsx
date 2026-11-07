import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { CloudSun, Sun, Moon, Heart, MapPin, Thermometer } from 'lucide-react';

/**
 * Top navigation bar.
 *
 * Props:
 *  isDark          boolean   – current theme
 *  onThemeToggle   fn        – toggle dark/light
 *  unit            'C'|'F'  – temperature unit
 *  onUnitToggle    fn        – toggle °C/°F
 *  favourites      array     – [{ name, latitude, longitude }]
 *  onSelectFav     fn(loc)   – called when user picks a favourite
 */
export default function Navbar({
  isDark,
  onThemeToggle,
  unit = 'C',
  onUnitToggle,
  favourites = [],
  onSelectFav,
}) {
  const [favAnchor, setFavAnchor] = useState(null);
  const favOpen = Boolean(favAnchor);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 60, sm: 68 },
        }}
      >
        {/* ── Logo ───────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: isDark
                ? 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(14,165,233,0.1))'
                : 'linear-gradient(135deg, rgba(56,189,248,0.3), rgba(2,132,199,0.15))',
              border: '1px solid',
              borderColor: isDark ? 'rgba(56,189,248,0.3)' : 'rgba(2,132,199,0.2)',
            }}
          >
            <CloudSun size={22} color={isDark ? '#38BDF8' : '#0284C7'} strokeWidth={1.75} />
          </Box>

          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.5px',
              fontSize: { xs: '1rem', sm: '1.15rem' },
              color: isDark ? '#F1F5F9' : '#0F172A',
            }}
          >
            WeatherApp
          </Typography>
        </Box>

        {/* ── Right-side controls ────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

          {/* °C / °F toggle */}
          <Tooltip title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}>
            <Chip
              icon={<Thermometer size={13} strokeWidth={2} />}
              label={`°${unit}`}
              onClick={onUnitToggle}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.78rem',
                height: 30,
                cursor: 'pointer',
                backgroundColor: isDark
                  ? 'rgba(56, 189, 248, 0.12)'
                  : 'rgba(2, 132, 199, 0.08)',
                color: isDark ? '#38BDF8' : '#0284C7',
                border: '1px solid',
                borderColor: isDark ? 'rgba(56,189,248,0.25)' : 'rgba(2,132,199,0.2)',
                '& .MuiChip-icon': {
                  color: isDark ? '#38BDF8' : '#0284C7',
                  marginLeft: '8px',
                },
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.22)'
                    : 'rgba(2, 132, 199, 0.15)',
                },
                transition: 'background-color 0.2s ease',
              }}
            />
          </Tooltip>

          {/* Favourites button */}
          <Tooltip title="Favourite cities">
            <IconButton
              onClick={(e) => setFavAnchor(e.currentTarget)}
              aria-label="Favourite cities"
              size="medium"
              sx={{
                color: favourites.length > 0
                  ? '#F87171'
                  : (isDark ? '#94A3B8' : '#475569'),
                '&:hover': { color: '#F87171' },
              }}
            >
              <Heart
                size={20}
                strokeWidth={1.75}
                fill={favourites.length > 0 ? '#F87171' : 'none'}
              />
            </IconButton>
          </Tooltip>

          {/* Favourites popover */}
          <Popover
            open={favOpen}
            anchorEl={favAnchor}
            onClose={() => setFavAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: 3,
                  minWidth: 220,
                  maxWidth: 280,
                  backgroundColor: isDark
                    ? 'rgba(30, 41, 59, 0.98)'
                    : 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid',
                  borderColor: isDark
                    ? 'rgba(148,163,184,0.12)'
                    : 'rgba(15,23,42,0.08)',
                  boxShadow: isDark
                    ? '0 16px 48px rgba(0,0,0,0.5)'
                    : '0 16px 48px rgba(15,23,42,0.12)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}
              >
                Favourite Cities
              </Typography>
            </Box>
            <Divider />

            {favourites.length === 0 ? (
              <Box sx={{ px: 2, py: 2.5, textAlign: 'center' }}>
                <Heart size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                  No favourites yet. Use the{' '}
                  <Box component="span" sx={{ fontWeight: 600 }}>♥</Box> button on the weather
                  card to save a city.
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding sx={{ py: 0.5 }}>
                {favourites.map((fav) => (
                  <ListItemButton
                    key={fav.name}
                    onClick={() => {
                      onSelectFav?.(fav);
                      setFavAnchor(null);
                    }}
                    sx={{
                      px: 2,
                      py: 0.75,
                      '&:hover': {
                        backgroundColor: isDark
                          ? 'rgba(56,189,248,0.07)'
                          : 'rgba(2,132,199,0.05)',
                      },
                    }}
                  >
                    <MapPin size={13} style={{ marginRight: 8, opacity: 0.5, flexShrink: 0 }} />
                    <ListItemText
                      primary={fav.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                        noWrap: true,
                        fontSize: '0.85rem',
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Popover>

          {/* Theme toggle */}
          <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              onClick={onThemeToggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              size="medium"
              sx={{
                color: isDark ? '#94A3B8' : '#475569',
                '&:hover': { color: isDark ? '#38BDF8' : '#0284C7' },
              }}
            >
              {isDark ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
