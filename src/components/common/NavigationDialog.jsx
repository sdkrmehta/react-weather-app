import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { X, MapPin, Trash2, Heart, Clock, Settings, Info } from 'lucide-react';

/**
 * Clean modal view for Sidebar actions: Favorites, History, Settings, About.
 */
export default function NavigationDialog({
  open,
  tab,
  onClose,
  favorites = [],
  onSelectFavorite,
  onRemoveFavorite,
  recentSearches = [],
  onSelectRecent,
  onClearRecent,
  unit,
  onUnitToggle,
}) {
  const titles = {
    favorites: { title: 'Favorite Cities', icon: Heart },
    history: { title: 'Search History', icon: Clock },
    settings: { title: 'Settings', icon: Settings },
    about: { title: 'About WeatherWise', icon: Info },
  };

  const current = titles[tab] ?? titles.favorites;
  const Icon = current.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#101B33' : '#FFFFFF',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon size={18} color="#2563EB" />
          <Typography variant="h6" fontWeight={700}>
            {current.title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* ── 1. Favorites ─────────────────────────────────────────── */}
        {tab === 'favorites' && (
          <Box>
            {favorites.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Heart size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <Typography variant="body2" color="text.secondary">
                  No favorite cities saved yet. Click the heart icon on any city card to add it!
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {favorites.map((fav) => (
                  <ListItemButton
                    key={fav.name}
                    onClick={() => {
                      onSelectFavorite?.(fav);
                      onClose();
                    }}
                    sx={{
                      borderRadius: 2.5,
                      mb: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                      <MapPin size={16} color="#38BDF8" />
                      <ListItemText
                        primary={fav.name}
                        primaryTypographyProps={{ fontWeight: 600, noWrap: true, fontSize: '0.9rem' }}
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite?.(fav);
                      }}
                      sx={{ opacity: 0.6, '&:hover': { opacity: 1, color: '#EF4444' } }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* ── 2. History ───────────────────────────────────────────── */}
        {tab === 'history' && (
          <Box>
            {recentSearches.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Clock size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <Typography variant="body2" color="text.secondary">
                  No recent searches yet. Search for a city to see your history here!
                </Typography>
              </Box>
            ) : (
              <>
                <List disablePadding>
                  {recentSearches.map((loc) => (
                    <ListItemButton
                      key={loc.name}
                      onClick={() => {
                        onSelectRecent?.(loc);
                        onClose();
                      }}
                      sx={{ borderRadius: 2.5, mb: 0.5 }}
                    >
                      <Clock size={15} style={{ opacity: 0.5, marginRight: 10 }} />
                      <ListItemText
                        primary={loc.name}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.88rem' }}
                      />
                    </ListItemButton>
                  ))}
                </List>
                {onClearRecent && (
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={onClearRecent}
                    sx={{ mt: 1.5, borderRadius: 2.5, opacity: 0.7 }}
                  >
                    Clear History
                  </Button>
                )}
              </>
            )}
          </Box>
        )}

        {/* ── 3. Settings ──────────────────────────────────────────── */}
        {tab === 'settings' && (
          <Box sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Temperature Unit
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Choose between Celsius and Fahrenheit
                </Typography>
              </Box>
              <Button size="small" variant="contained" onClick={onUnitToggle} sx={{ borderRadius: 9999 }}>
                °{unit}
              </Button>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Data Providers
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • Weather & Air Quality: Open-Meteo (High Resolution Forecast)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • Reverse Geolocation: Nominatim OpenStreetMap
              </Typography>
            </Box>
          </Box>
        )}

        {/* ── 4. About ─────────────────────────────────────────────── */}
        {tab === 'about' && (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={700} gutterBottom>
              WeatherWise v2.0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.84rem' }}>
              A commercial-grade weather dashboard offering real-time conditions, 24-hour and 7-day forecasts, deep atmospheric insights, and interactive climate charts.
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" color="text.secondary" display="block">
              Built with React 19, Material UI (MUI v7), Recharts, and Open-Meteo.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
