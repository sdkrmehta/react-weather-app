import { useEffect, useRef, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAirQuality } from './hooks/useAirQuality';
import TopNavbar from './components/layout/TopNavbar';
import HeroBanner from './components/weather/HeroBanner';
import ForecastCards from './components/weather/ForecastCards';
import ForecastDetailDialog from './components/weather/ForecastDetailDialog';
import WeatherAlertBanner from './components/common/WeatherAlertBanner';
import InsightsRow from './components/insights/InsightsRow';
import DashboardCharts from './components/charts/DashboardCharts';
import NavigationDialog from './components/common/NavigationDialog';
import { reverseGeocode } from './api/geocodingService';
import { DEFAULT_LOCATION, STORAGE_KEYS } from './utils/constants';

/**
 * Main application dashboard matching the WeatherWise UI design.
 */
export default function WeatherApp({
  unit = 'C',
  onUnitToggle,
  isDark,
  onThemeToggle,
  onConditionChange,
  favourites = [],
  onToggleFavourite,
  selectedLocation,
  onSelectLocation,
  sidebarTab = 'home',
  onSidebarTabChange,
}) {
  const {
    weatherData,
    location,
    loading,
    error,
    fetchForCoords,
    searchByCity,
    refresh,
  } = useWeather();

  const { loading: geoLoading, getCurrentPosition } = useGeolocation();

  // ── Air quality — fetched whenever location changes ────────────────────────
  const { aqData } = useAirQuality(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  // ── Dialog state for Sidebar / Navbar popups ───────────────────────────────
  const [dialogTab, setDialogTab] = useState(null);

  // ── Forecast Details Inspector Dialog state ────────────────────────────────
  const [forecastDetailOpen, setForecastDetailOpen] = useState(false);
  const [forecastDetailTab, setForecastDetailTab] = useState('24h');

  // Sync sidebar tab selection with dialog
  useEffect(() => {
    if (sidebarTab && sidebarTab !== 'home') {
      setDialogTab(sidebarTab);
    }
  }, [sidebarTab]);

  const handleCloseDialog = () => {
    setDialogTab(null);
    onSidebarTabChange?.('home');
  };

  // ── Recent searches ────────────────────────────────────────────────────────
  const [recentSearches, setRecentSearches] = useLocalStorage(
    STORAGE_KEYS.RECENT_SEARCHES,
    []
  );

  const addToRecentSearches = useCallback(
    (loc) => {
      if (!loc?.name || !loc.latitude || !loc.longitude) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((r) => r.name !== loc.name);
        return [
          { name: loc.name, latitude: loc.latitude, longitude: loc.longitude },
          ...filtered,
        ].slice(0, 5);
      });
    },
    [setRecentSearches]
  );

  const hasUserSearchedRef = useRef(false);

  // Watch for successful location changes → update recent searches
  useEffect(() => {
    if (location && weatherData && !loading && !error && hasUserSearchedRef.current) {
      addToRecentSearches(location);
    }
  }, [location, weatherData, loading, error, addToRecentSearches]);

  // Notify parent of current weather code + is_day for dynamic gradients
  useEffect(() => {
    if (weatherData?.current) {
      onConditionChange?.({
        weatherCode: weatherData.current.weather_code ?? null,
        isDay: weatherData.current.is_day ?? 1,
      });
    }
  }, [weatherData, onConditionChange]);

  // When a favourite city is selected externally
  useEffect(() => {
    if (selectedLocation?.latitude != null && selectedLocation?.longitude != null) {
      hasUserSearchedRef.current = true;
      fetchForCoords(
        selectedLocation.latitude,
        selectedLocation.longitude,
        selectedLocation.name
      );
    }
  }, [selectedLocation, fetchForCoords]);

  // Load default city (Vancouver) on initial mount
  useEffect(() => {
    fetchForCoords(
      DEFAULT_LOCATION.latitude,
      DEFAULT_LOCATION.longitude,
      `${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}`
    );
  }, [fetchForCoords]);

  // ── Search Handlers ────────────────────────────────────────────────────────
  const handleSearchCity = (cityName) => {
    hasUserSearchedRef.current = true;
    searchByCity(cityName);
  };

  const handleSelectLocation = (loc) => {
    hasUserSearchedRef.current = true;
    fetchForCoords(loc.latitude, loc.longitude, loc.name);
  };

  const handleGeolocate = async () => {
    hasUserSearchedRef.current = true;
    try {
      const coords = await getCurrentPosition();
      let locationName;
      try {
        const place = await reverseGeocode(coords.latitude, coords.longitude);
        locationName = place.name;
      } catch {
        locationName = `${Math.abs(coords.latitude).toFixed(2)}°${coords.latitude >= 0 ? 'N' : 'S'}, ${Math.abs(coords.longitude).toFixed(2)}°${coords.longitude >= 0 ? 'E' : 'W'}`;
      }
      fetchForCoords(coords.latitude, coords.longitude, locationName);
    } catch {
      // Error handled by useGeolocation
    }
  };

  // ── Favourite helpers ──────────────────────────────────────────────────────
  const isFavourite = location
    ? favourites.some((f) => f.name === location.name)
    : false;

  const handleToggleFavCurrent = () => {
    if (!location) return;
    onToggleFavourite?.({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── Top Navbar: Search, Location, Unit, Theme, My Cities ────── */}
      <TopNavbar
        onSearchCity={handleSearchCity}
        onSelectLocation={handleSelectLocation}
        onGeolocate={handleGeolocate}
        geoLoading={geoLoading}
        unit={unit}
        onUnitToggle={onUnitToggle}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
        onOpenFavorites={() => setDialogTab('favorites')}
        recentSearches={recentSearches}
      />

      {/* ── Error Banner ────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* ── Severe Weather Advisory Alert Banner ─────────────────────── */}
      <WeatherAlertBanner weatherData={weatherData} aqData={aqData} />

      {/* ── Hero Weather Section (Mountain Lake + Insights Mini) ─────── */}
      <HeroBanner
        weatherData={weatherData}
        location={location}
        aqData={aqData}
        loading={loading}
        unit={unit}
        isFavourite={isFavourite}
        onToggleFavourite={handleToggleFavCurrent}
        onRefresh={refresh}
      />

      {/* ── Forecast Section: 24-Hour & 7-Day Side-by-Side ─────────── */}
      <ForecastCards
        weatherData={weatherData}
        loading={loading}
        unit={unit}
        onViewDetails24h={() => {
          setForecastDetailTab('24h');
          setForecastDetailOpen(true);
        }}
        onViewDetails7d={() => {
          setForecastDetailTab('7d');
          setForecastDetailOpen(true);
        }}
        onViewDetails={() => {
          setForecastDetailTab('24h');
          setForecastDetailOpen(true);
        }}
      />

      {/* ── 7 Weather Insight Cards Row ─────────────────────────────── */}
      <InsightsRow
        weatherData={weatherData}
        aqData={aqData}
        loading={loading}
      />

      {/* ── Interactive Charts Row: Temperature Trend & Precip/Humid ── */}
      <DashboardCharts
        weatherData={weatherData}
        loading={loading}
        unit={unit}
      />

      {/* ── Forecast Detail Inspector Dialog ─────────────────────────── */}
      <ForecastDetailDialog
        open={forecastDetailOpen}
        initialTab={forecastDetailTab}
        onClose={() => setForecastDetailOpen(false)}
        weatherData={weatherData}
        unit={unit}
      />

      {/* ── Sidebar Actions Dialog (Favorites, History, Settings, About) ─ */}
      <NavigationDialog
        open={Boolean(dialogTab)}
        tab={dialogTab}
        onClose={handleCloseDialog}
        favorites={favourites}
        onSelectFavorite={(loc) => {
          onSelectLocation?.(loc);
          handleSelectLocation(loc);
        }}
        onRemoveFavorite={onToggleFavourite}
        recentSearches={recentSearches}
        onSelectRecent={(loc) => {
          onSelectLocation?.(loc);
          handleSelectLocation(loc);
        }}
        onClearRecent={() => setRecentSearches([])}
        unit={unit}
        onUnitToggle={onUnitToggle}
      />
    </Box>
  );
}
