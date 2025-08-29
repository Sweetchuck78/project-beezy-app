/**
 * App color system with support for light and dark mode.
 * Use semantic names (primary, background, error, etc.)
 * instead of hardcoding hex values throughout the app.
 */

export const Colors = {
  light: {
    // Core brand colors
    primary: '#005C53',   // Your brand primary (light)
    secondary: '#14B8A6',
    accent: '#F59E0B',

    // Backgrounds & surfaces
    appBackground: '#F8F8F8', // global app background
    background: '#F9FAFB',
    surface: '#FFFFFF',
    elevated: '#F3F4F6',
    tileBackground: '#FFFFFF', // NEW

    // Text colors
    text: '#232323',
    subtext: '#4B5563',
    muted: '#9CA3AF',

    // State colors
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#3B82F6',

    // Icons & navigation
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#005C53',
  },

  dark: {
    // Core brand colors
    primary: '#DBF227',   // Your brand primary (dark)
    secondary: '#2DD4BF',
    accent: '#FBBF24',

    // Backgrounds & surfaces
    appBackground: '#232323', // global app background
    background: '#111827',
    surface: '#121212',
    elevated: '#374151',
    tileBackground: '#DBF227', // NEW

    // Text colors
    text: '#FFFFFF',
    subtext: '#D1D5DB',
    muted: '#9CA3AF',

    // State colors
    success: '#4ADE80',
    warning: '#FACC15',
    error: '#F87171',
    info: '#60A5FA',

    // Icons & navigation
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#DBF227',
  },
};