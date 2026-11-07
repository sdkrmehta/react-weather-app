import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import {
  Search,
  Navigation,
  Sun,
  Moon,
  Star,
  Clock,
  MapPin,
  WifiOff,
} from 'lucide-react';
import { searchCities, formatLocationLabel } from '../../api/geocodingService';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Top Navigation bar matching the reference image.
 */
export default function TopNavbar({
  onSearchCity,
  onSelectLocation,
  onGeolocate,
  geoLoading,
  unit = 'C',
  onUnitToggle,
  isDark,
  onThemeToggle,
  onOpenFavorites,
  recentSearches = [],
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' && 'onLine' in navigator ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const debouncedInput = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedInput.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    let cancelled = false;
    setSuggestionsLoading(true);

    searchCities(debouncedInput, 6)
      .then((results) => {
        if (cancelled) return;
        setSuggestions(
          results.map((r) => ({
            id: `${r.latitude}-${r.longitude}`,
            name: formatLocationLabel(r),
            latitude: r.latitude,
            longitude: r.longitude,
            isRecent: false,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedInput]);

  const options =
    inputValue.length < 2
      ? recentSearches.map((r) => ({ ...r, id: `recent-${r.name}`, isRecent: true }))
      : suggestions;

  const handleAutocompleteChange = (_, value) => {
    if (!value || typeof value === 'string') return;
    onSelectLocation(value);
    setInputValue('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (suggestions.length > 0) {
      onSelectLocation(suggestions[0]);
    } else {
      onSearchCity(trimmed);
    }
    setInputValue('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        width: '100%',
        mb: 2.5,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}
    >
      {/* ── Search Input (Pill Shaped) ─────────────────────────────────── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flex: 1,
          minWidth: { xs: '100%', md: 280 },
          maxWidth: { xs: '100%', md: 440 },
        }}
      >
        <Autocomplete
          freeSolo
          openOnFocus
          options={options}
          loading={suggestionsLoading}
          inputValue={inputValue}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') setInputValue(value);
            if (reason === 'clear') setInputValue('');
          }}
          onChange={handleAutocompleteChange}
          getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
          isOptionEqualToValue={(opt, val) =>
            opt.latitude === val.latitude && opt.longitude === val.longitude
          }
          filterOptions={(x) => x}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            const [primaryName, ...rest] = option.name.split(',');
            return (
              <Box
                component="li"
                key={key}
                {...otherProps}
                sx={{
                  display: 'flex !important',
                  alignItems: 'center',
                  gap: 1.25,
                  py: '8px !important',
                }}
              >
                {option.isRecent ? (
                  <Clock size={14} style={{ opacity: 0.5 }} />
                ) : (
                  <MapPin size={14} style={{ opacity: 0.5 }} />
                )}
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {primaryName.trim()}
                  </Typography>
                  {rest.length > 0 && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {rest.join(',').trim()}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search for a city..."
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 9999,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(16, 27, 51, 0.75)'
                      : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(15, 23, 42, 0.12)',
                  px: 1.5,
                  py: 0.25,
                  fontSize: '0.88rem',
                  '& fieldset': { border: 'none' },
                  '&:hover': {
                    borderColor: '#2563EB',
                  },
                },
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} style={{ opacity: 0.5, marginLeft: 4 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {suggestionsLoading && (
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* ── Right Action Controls ──────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flexWrap: 'wrap',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          width: { xs: '100%', md: 'auto' },
        }}
      >
        {/* Offline Status Badge */}
        {!isOnline && (
          <Tooltip title="You are currently offline. Showing cached weather data.">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.6,
                borderRadius: 9999,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#EF4444',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <WifiOff size={13} strokeWidth={2.5} />
              <span>Offline</span>
            </Box>
          </Tooltip>
        )}

        {/* Use My Location Pill */}
        <ButtonBase
          onClick={onGeolocate}
          disabled={geoLoading}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 2,
            py: 0.9,
            borderRadius: 9999,
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: isDark ? 'rgba(30, 48, 80, 0.7)' : 'rgba(2, 132, 199, 0.1)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(2, 132, 199, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#2563EB',
              borderColor: '#2563EB',
            },
          }}
        >
          {geoLoading ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <Navigation size={14} strokeWidth={2.2} />
          )}
          <span>Use My Location</span>
        </ButtonBase>

        {/* °C / °F Segmented Switch */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.35,
            borderRadius: 9999,
            backgroundColor: isDark ? 'rgba(16, 27, 51, 0.85)' : 'rgba(226, 232, 240, 0.8)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
          }}
        >
          <ButtonBase
            onClick={unit === 'F' ? onUnitToggle : undefined}
            sx={{
              px: 1.5,
              py: 0.45,
              borderRadius: 9999,
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: unit === 'C' ? '#2563EB' : 'transparent',
              color: unit === 'C' ? '#FFFFFF' : 'text.secondary',
              boxShadow: unit === 'C' ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            °C
          </ButtonBase>
          <ButtonBase
            onClick={unit === 'C' ? onUnitToggle : undefined}
            sx={{
              px: 1.5,
              py: 0.45,
              borderRadius: 9999,
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: unit === 'F' ? '#2563EB' : 'transparent',
              color: unit === 'F' ? '#FFFFFF' : 'text.secondary',
              boxShadow: unit === 'F' ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            °F
          </ButtonBase>
        </Box>

        {/* Theme Toggle Pill */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <ButtonBase
            onClick={onThemeToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              px: 1.5,
              py: 0.8,
              borderRadius: 9999,
              backgroundColor: isDark ? 'rgba(16, 27, 51, 0.85)' : 'rgba(241, 245, 249, 0.9)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
              color: isDark ? '#94A3B8' : '#475569',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: isDark ? '#F59E0B' : '#2563EB',
                borderColor: isDark ? '#F59E0B' : '#2563EB',
              },
            }}
          >
            {isDark ? <Moon size={15} strokeWidth={2} /> : <Sun size={15} strokeWidth={2} />}
          </ButtonBase>
        </Tooltip>

        {/* My Cities (Favorites) Pill Button */}
        <ButtonBase
          onClick={onOpenFavorites}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 2,
            py: 0.9,
            borderRadius: 9999,
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: isDark ? 'rgba(30, 48, 80, 0.7)' : 'rgba(15, 23, 42, 0.06)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(40, 65, 110, 0.85)' : 'rgba(15, 23, 42, 0.1)',
            },
          }}
        >
          <Star size={15} color="#FBBF24" fill="#FBBF24" />
          <span>My Cities</span>
        </ButtonBase>
      </Box>
    </Box>
  );
}
