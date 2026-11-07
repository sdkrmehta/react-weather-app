import { useState, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './styles/theme';
import AppShell from './components/layout/AppShell';
import WeatherApp from './WeatherApp';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './utils/constants';

function App() {
  // Persisted preferences
  const [isDark, setIsDark]         = useLocalStorage(STORAGE_KEYS.THEME, true);
  const [unit, setUnit]             = useLocalStorage(STORAGE_KEYS.UNIT, 'C');
  const [favourites, setFavourites] = useLocalStorage(STORAGE_KEYS.FAVOURITES, []);

  // Selected favourite city to navigate to
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Active sidebar tab
  const [sidebarTab, setSidebarTab] = useState('home');

  // Current weather condition — drives dynamic background gradient (not persisted)
  const [condition, setCondition]   = useState({ weatherCode: null, isDay: 1 });

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleUnit  = () => setUnit((prev) => (prev === 'C' ? 'F' : 'C'));

  /** Add or remove a city from favourites (dedup by name, limit 10). */
  const handleToggleFavourite = useCallback((loc) => {
    setFavourites((prev) => {
      const exists = prev.some((f) => f.name === loc.name);
      if (exists) {
        return prev.filter((f) => f.name !== loc.name);
      }
      return [
        { name: loc.name, latitude: loc.latitude, longitude: loc.longitude },
        ...prev,
      ].slice(0, 10);
    });
  }, [setFavourites]);

  /**
   * Called by WeatherApp whenever a new city's data loads.
   */
  const handleConditionChange = useCallback(({ weatherCode, isDay }) => {
    setCondition({ weatherCode, isDay });
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <AppShell
          isDark={isDark}
          onThemeToggle={toggleTheme}
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          weatherCode={condition.weatherCode}
          isDay={condition.isDay}
        >
          <WeatherApp
            unit={unit}
            onUnitToggle={toggleUnit}
            isDark={isDark}
            onThemeToggle={toggleTheme}
            onConditionChange={handleConditionChange}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            sidebarTab={sidebarTab}
            onSidebarTabChange={setSidebarTab}
          />
        </AppShell>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
