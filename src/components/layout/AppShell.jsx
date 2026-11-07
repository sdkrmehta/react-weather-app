import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

/**
 * Main application shell featuring:
 * - Left fixed navigation sidebar on desktop (lg+)
 * - Floating bottom navigation on mobile/tablet (< lg)
 * - Right scrollable dashboard area with dynamic ambient glow
 */
export default function AppShell({
  children,
  isDark,
  onThemeToggle,
  activeTab = 'home',
  onTabChange,
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#080E1E' : '#F1F5F9',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 15% 15%, rgba(37, 99, 235, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.08) 0%, transparent 45%)'
            : 'radial-gradient(circle at 15% 15%, rgba(219, 234, 254, 0.6) 0%, transparent 45%)',
        color: 'text.primary',
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* ── Left Sidebar (Desktop) ─────────────────────────────────── */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
      />

      {/* ── Right Main Content Area ─────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, sm: 2.5, md: 3.5 },
          pb: { xs: 10, lg: 3.5 }, // Extra padding on mobile for floating bottom nav
          maxWidth: 1600,
          mx: 'auto',
          width: '100%',
        }}
      >
        {children}
      </Box>

      {/* ── Mobile Bottom Navigation Bar (< lg) ─────────────────────── */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </Box>
  );
}
