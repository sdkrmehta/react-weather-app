import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Search, MapPin, Clock } from 'lucide-react';
import { searchCities, formatLocationLabel } from '../../api/geocodingService';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * City search bar with async autocomplete and geolocation support.
 *
 * Props:
 *  onSearchCity(cityName)         → caller geocodes + fetches (text entry fallback)
 *  onSelectLocation(locationObj)  → caller fetches directly (lat/lon already known)
 *  onGeolocate()                  → caller handles browser geolocation
 *  loading      {boolean}         → weather fetch in progress
 *  geoLoading   {boolean}         → geolocation in progress
 *  recentSearches {Array}         → previously searched locations to show on focus
 */
export default function SearchBar({
  onSearchCity,
  onSelectLocation,
  onGeolocate,
  loading,
  geoLoading,
  recentSearches = [],
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const debouncedInput = useDebounce(inputValue, 400);

  // ── Fetch city suggestions whenever the debounced input changes ──────────────
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
      cancelled = true; // prevent race conditions on rapid typing
    };
  }, [debouncedInput]);

  // ── Options: recents when empty, API suggestions when typing ─────────────────
  const options =
    inputValue.length < 2
      ? recentSearches.map((r) => ({ ...r, id: `recent-${r.name}`, isRecent: true }))
      : suggestions;

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const getNoOptionsText = () => {
    if (inputValue.length === 0) return 'No recent searches yet';
    if (inputValue.length === 1) return 'Type at least 2 characters…';
    if (suggestionsLoading) return 'Searching…';
    return `No results for "${inputValue}"`;
  };

  const isDisabled = loading || geoLoading;

  // ── Event handlers ────────────────────────────────────────────────────────────

  // Called when user SELECTS an option from the dropdown
  const handleAutocompleteChange = (event, value) => {
    if (!value || typeof value === 'string') return;
    onSelectLocation(value);
    setInputValue('');
  };

  // Called on every keystroke — only update when user is actually typing
  const handleInputChange = (event, value, reason) => {
    if (reason === 'input') setInputValue(value);
    if (reason === 'clear') setInputValue('');
    // 'reset' fires after selection — we handle that in handleAutocompleteChange
  };

  // Form submit: use first suggestion if available, else fall back to text search
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

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1, width: '100%', alignItems: 'flex-start' }}
    >
      {/* ── Autocomplete input ─────────────────────────────────────────────── */}
      <Autocomplete
        fullWidth
        freeSolo
        openOnFocus
        options={options}
        loading={suggestionsLoading}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleAutocompleteChange}
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
        isOptionEqualToValue={(opt, val) =>
          opt.latitude === val.latitude && opt.longitude === val.longitude
        }
        // Server-side filtering — disable MUI's built-in filter
        filterOptions={(x) => x}
        disabled={isDisabled}
        noOptionsText={getNoOptionsText()}
        // ── Render each option row ─────────────────────────────────────────
        renderOption={(props, option) => {
          // MUI v7: extract `key` from props to avoid React warning
          const { key, ...otherProps } = props;
          const [primaryName, ...rest] = option.name.split(',');
          return (
            <Box
              component="li"
              key={key}
              {...otherProps}
              sx={{ display: 'flex !important', alignItems: 'flex-start', gap: 1.25, py: '10px !important' }}
            >
              {/* Icon: clock for recent, pin for suggestion */}
              <Box sx={{ pt: 0.25, flexShrink: 0, opacity: 0.5 }}>
                {option.isRecent ? (
                  <Clock size={15} strokeWidth={1.75} />
                ) : (
                  <MapPin size={15} strokeWidth={1.75} />
                )}
              </Box>

              {/* City name + state/country subtitle */}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {primaryName.trim()}
                </Typography>
                {rest.length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {rest.join(',').trim()}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
        // ── TextField inside the Autocomplete ──────────────────────────────
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for a city…"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 0.5 }}>
                  <Search size={17} style={{ opacity: 0.45 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {suggestionsLoading && (
                    <CircularProgress size={16} sx={{ mr: 1, flexShrink: 0 }} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* ── Search submit button ───────────────────────────────────────────── */}
      <Tooltip title="Search">
        <span>
          <IconButton
            type="submit"
            disabled={isDisabled}
            aria-label="Search"
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              transition: 'background-color 0.2s ease',
              '&:hover': { bgcolor: 'primary.dark', transform: 'none' },
              '&:disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} />
            ) : (
              <Search size={18} strokeWidth={2} />
            )}
          </IconButton>
        </span>
      </Tooltip>

      {/* ── Geolocation button ─────────────────────────────────────────────── */}
      <Tooltip title="Use my current location">
        <span>
          <IconButton
            onClick={onGeolocate}
            disabled={isDisabled}
            aria-label="Use my current location"
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                transform: 'none',
              },
              '&:disabled': { opacity: 0.45 },
            }}
          >
            {geoLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <MapPin size={18} strokeWidth={1.75} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
