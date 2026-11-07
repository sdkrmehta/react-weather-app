# WeatherWise - Commercial Weather Forecast and Climate Insights Platform

WeatherWise is a commercial-grade, responsive weather forecasting and atmospheric analytics platform built with React 19, Vite, Material UI (MUI v7), and Recharts. The application leverages meteorological data from Open-Meteo and OpenStreetMap (Nominatim), delivering real-time forecasts, historical trends, and climate insights without requiring third-party API keys or subscriptions.

The default location is configured to Ranchi, Jharkhand, India (23.3441 N, 85.3096 E).

---

## Key Features

### Location Discovery and Geolocation
- Instant Autocomplete: Asynchronous debounced lookup (400ms) with full geographic hierarchy (city, state, country).
- GPS Positioning: Single-click geolocation resolving coordinates and reverse-geocoding local municipality names.
- Offline Detection: Real-time network status monitoring displaying an offline badge with automated fallback to cached data.
- Search History: Quick access to the five most recently searched locations, persisted in browser localStorage.
- Keyboard Navigation: Full accessibility support (ArrowUp, ArrowDown, Enter, Escape) across search dropdown menus.

### Dynamic Hero Section
- Context-Aware Scenic Backdrops: High-resolution photographic lake landscapes that adapt dynamically to weather conditions (clear day, starry night, rain, thunderstorm, snow, mist).
- Floating 3D Vector Artwork: CSS-animated weather artwork reflecting real-time conditions (glowing sun, crescent moon, storm clouds with lightning, snowflake clusters).
- Real-Time Primary Metrics: Prominent temperature display, "Feels Like" index, diurnal high and low ranges, and sunrise/sunset checkpoints.
- Integrated Air Quality Gauge: Radial SVG progress ring displaying the United States Air Quality Index (US AQI), UV risk tier, and humidity level.

### Severe Weather Advisories
- Active Warning Banner: Evaluates live meteorological parameters to display actionable safety alerts:
  - Severe Thunderstorm Warning (WMO code >= 95)
  - High Wind Advisory (wind speed >= 50 km/h)
  - Unhealthy Air Quality Alert (US AQI > 150)
  - Very High UV Radiation Warning (UV index >= 8)
  - Heavy Rainfall and Flood Risk (WMO code 65 or 82)
- Dismissible severity chips with recommended safety precautions.

### Side-by-Side Forecasts
- 24-Hour Forecast Card: 8-hour horizontal quick-view columns featuring time stamps, weather icons, temperatures, and precipitation probability tags.
- 7-Day Forecast Card: 7-day weekly overview displaying day labels, short dates, weather icons, high/low ranges, and rain chances.
- Detailed Inspector Dialog: Clicking "View Details" on either card opens a deep modal inspector:
  - 24-Hour View: Full 24-hour hour-by-hour breakdown of temperature, feels-like, rain probability, wind speed, humidity, and condition icons.
  - 7-Day View: Comprehensive 7-day breakdown of daily high and low temperatures, rain probabilities, peak wind speeds, max UV index, sunrise, and sunset times.

### Seven Specialized Climate Insights
1. Air Quality Index (AQI): US AQI scale with color-coded health risk classifications (Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Hazardous) and guidance.
2. UV Index: World Health Organization (WHO) exposure scale with risk categorizations and sun-protection advisories.
3. Humidity and Dew Point: Relative humidity percentage, comfort tier assessments, and Magnus-formula calculated dew points.
4. Wind and Radar Compass: Wind speed in km/h, wind gusts, compass point directions, and an animated circular radar compass with rotating pointer.
5. Atmospheric Visibility: Visibility distance in kilometers or meters with haze and fog classifications.
6. Barometric Pressure: Mean sea-level pressure (hPa) with barometric stability analysis (stable, rising, falling).
7. Sun Trajectory Arc: Semi-circular celestial arc with a live sun position indicator, sunrise and sunset timestamps, and total daylight duration.

### Multi-Period Interactive Charts
- Temperature Trend Chart:
  - 24-Hour Mode: Dual-curve temperature corridor plotting hourly High and Low projections.
  - 7-Day Mode: Weekly High (amber #F59E0B) and Low (cyan #38BDF8) dual spline curves with decimal precision and floating dots.
  - 30-Day Mode: Full 30-day timeline incorporating 14 days of recent past data and 16 days of forward forecast data.
  - Interactive Tooltip: Displays exact High and Low temperatures formatted to the active unit.
- Precipitation and Humidity Chart:
  - Composed visualization combining cyan bar charts for precipitation probability (0-100%) and smooth purple spline curves (#8B5CF6) for relative humidity.

### Personalization and User Experience
- Theme Toggle: Accessibility-tested dark navy palette (#080E1E) and clean daylight palette (#F8FAFC).
- Unit Switcher: Instant segmented switch between Celsius (C) and Fahrenheit (F) with automatic conversion across all views.
- Favorite Cities: Save and manage favorite locations with one-click selection and deletion.
- Modal Navigation: Desktop sidebar and mobile bottom navigation links for Favorites, History, Settings, and About views.
- Progressive Web App (PWA): Standalone web app manifest (manifest.json) with mobile status bar optimization and installability.
- Resilient Error Boundary: Top-level error boundary preventing full application crashes and offering one-click recovery.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Core Framework | React 19 | Component hierarchy, hooks, state orchestration |
| Build Tool | Vite 6 | Fast HMR, Rollup chunk splitting, production builds |
| UI Component Library | Material UI (MUI v7) | Layout primitives, cards, dialogs, form controls |
| Styling Engine | Emotion | Dynamic themes and component styling |
| Icons | Lucide React | Vector meteorological and navigation iconography |
| Data Visualization | Recharts 3 | Responsive area, bar, and composed spline charts |
| Meteorological API | Open-Meteo | Real-time weather, 16-day forecast, 14-day history, AQI |
| Geocoding Services | Open-Meteo Geocoding and OSM Nominatim | City autocomplete and GPS reverse geocoding |
| Testing | Node.js Test Runner (node:test) | Unit testing for formatters, codes, and caching |
| Code Quality | ESLint 9 | Static code analysis and linting |
| Hosting Configuration | Vercel | Single-page application rewrites and asset headers |

---

## Project Structure

```
react-weather-app/
├── public/
│   ├── manifest.json                   # Web App Manifest for PWA installation
│   └── vite.svg                        # Application vector icon
├── src/
│   ├── api/
│   │   ├── geocodingService.js         # Geocoding and reverse geocoding with TTL cache
│   │   └── weatherService.js           # Open-Meteo client with 30-day timeline and TTL cache
│   ├── components/
│   │   ├── charts/
│   │   │   └── DashboardCharts.jsx     # Dual-curve temperature and precipitation charts
│   │   ├── common/
│   │   │   ├── ErrorBoundary.jsx       # Top-level React error boundary
│   │   │   ├── NavigationDialog.jsx    # Favorites, History, Settings, and About modal
│   │   │   └── WeatherAlertBanner.jsx  # Live severe weather advisory banner
│   │   ├── insights/
│   │   │   └── InsightsRow.jsx         # 7 atmospheric insight cards with compass and sun arc
│   │   ├── layout/
│   │   │   ├── AppShell.jsx            # Shell coordinating sidebar, navbar, and mobile nav
│   │   │   ├── MobileBottomNav.jsx     # Floating glassmorphic bottom navigation for mobile
│   │   │   ├── Sidebar.jsx             # Left desktop navigation sidebar
│   │   │   └── TopNavbar.jsx           # Search bar, GPS button, unit and theme toggles
│   │   └── weather/
│   │       ├── ForecastCards.jsx       # 24-hour and 7-day side-by-side cards
│   │       ├── ForecastDetailDialog.jsx# Hour-by-hour and day-by-day table inspector
│   │       ├── HeroBanner.jsx          # Scenic photographic lake hero with 3D art and AQI
│   │       └── WeatherIcon.jsx         # WMO code to Lucide vector icon mapper
│   ├── hooks/
│   │   ├── useAirQuality.js            # Independent non-blocking air quality hook
│   │   ├── useDebounce.js              # 400ms debounce hook for search inputs
│   │   ├── useGeolocation.js           # Browser navigator.geolocation hook
│   │   ├── useLocalStorage.js          # Synchronized localStorage persistence hook
│   │   └── useWeather.js               # Central weather data and coordination hook
│   ├── styles/
│   │   ├── globals.css                 # Keyframe animations, floating artwork, scrollbars
│   │   └── theme.js                    # Material UI v7 dark and light themes
│   ├── utils/
│   │   ├── constants.js                # API endpoints, default city (Ranchi), storage keys
│   │   ├── formatters.js               # Timezone-safe date, time, and unit formatters
│   │   └── weatherCodes.js             # WMO weather code descriptions and icon mapping
│   ├── App.jsx                         # Top-level state orchestrator and error boundary wrap
│   ├── main.jsx                        # React 19 application entrypoint
│   └── WeatherApp.jsx                  # Main dashboard composition and handler routing
├── test/
│   ├── cache.test.js                   # Unit tests for in-memory TTL caching and cache bypass
│   └── formatters.test.js              # Unit tests for formatters and weather code translation
├── .env.example                        # Environment variable documentation template
├── index.html                          # HTML5 shell with Inter web font and PWA meta tags
├── package.json                        # Project metadata, dependencies, and test scripts
├── vercel.json                         # Vercel deployment configuration
└── vite.config.js                      # Vite build configuration with manual Rollup chunking
```

---

## Getting Started

### Prerequisites
- Node.js: Version 18.0.0 or higher
- npm: Version 9.0.0 or higher (or pnpm / yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/react-weather-app.git
   cd react-weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

---

## Environment Variables

WeatherWise connects directly to Open-Meteo and OpenStreetMap Nominatim public endpoints, requiring no API keys.

Optional configuration settings can be defined in a `.env` file:
```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_APP_NAME` | No | `WeatherWise` | Display name shown in navigation headers |
| `VITE_DEFAULT_CITY` | No | `Ranchi` | Fallback city loaded before user interactions |

---

## Testing and Verification

Run the automated test suite (16 tests across caching, formatters, and weather code mapping):
```bash
npm test
```

Execute static code analysis:
```bash
npm run lint
```

Produce an optimized production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## Performance and Chunk Splitting

The production build uses Vite and Rollup code-splitting to isolate vendor dependencies into individual, cached browser chunks:
- `vendor-react`: Core React 19 runtime (~183 kB)
- `vendor-mui`: Material UI v7 component system (~252 kB)
- `vendor-recharts`: Chart rendering engine (~346 kB)
- `vendor-icons`: Lucide vector icon library (~23 kB)
- `index`: Application logic and styles (~75 kB)

---

## Deployment

### Deploying to Vercel

The project includes a pre-configured `vercel.json` file providing single-page application routing and asset caching headers.

#### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option 2: Vercel Web Dashboard
1. Push your repository to GitHub.
2. Connect your repository on Vercel.
3. The framework preset is automatically detected as Vite.
4. Click Deploy.

---

## API Credits and Attribution

- Meteorological and Air Quality Data: Open-Meteo (Licensed under CC-BY 4.0).
- Reverse Geocoding: OpenStreetMap Nominatim (Data copyright OpenStreetMap contributors under ODbL).
- Iconography: Lucide React (Licensed under ISC).

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
