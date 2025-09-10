/**
 * App color system with support for light and dark mode.
 * Aqua Citrus Pop design tokens.
 */

export const Colors = {
  light: {
    // Core brand colors
    primary: '#00B89F',      // Aqua-Teal
    secondary: '#F5C518',    // Citrus Yellow
    accent: '#FF6B6B',       // Coral
    white: '#FFFFFF',
    black: '#000000',

    // Gradients
    primaryGradient: ['#00B89F', '#34D1BF'],   // aqua teal → lighter teal
    secondaryGradient: ['#F5C518', '#FFD95E'], // citrus → golden yellow

    // Backgrounds & surfaces
    appBackground: '#F8F8F8',
    surface: '#FFFFFF',
    elevated: '#F3F4F6',
    buttonTint: '#FFFFFF',

    // Text colors
    text: '#232323',
    subtext: '#4B5563',
    muted: '#9CA3AF',
    buttonText: '#FFFFFF',
    invertedText: '#FFFFFF',

    // State colors
    success: '#34D399',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#3B82F6',

    // Icons & navigation
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#00B89F',
    buttonIconTint: '#FFFFFF',
  },

  dark: {
    // Core brand colors
    primary: '#00B89F',      // Aqua-Teal
    secondary: '#F5C518',    // Citrus Yellow
    accent: '#FF6B6B',       // Coral
    white: '#FFFFFF',
    black: '#000000',

    // Gradients
    primaryGradient: ['#00B89F', '#17877B'],   // aqua teal → darker teal
    secondaryGradient: ['#F5C518', '#B78C00'], // citrus → darker amber

    // Backgrounds & surfaces
    appBackground: '#121212',
    surface: '#232323',
    elevated: '#374151',
    buttonTint: '#121212',

    // Text colors
    text: '#FFFFFF',
    subtext: '#D1D5DB',
    muted: '#9CA3AF',
    buttonText: '#232323',
    invertedText: '#232323',

    // State colors
    success: '#10B981',
    warning: '#FACC15',
    error: '#F87171',
    info: '#60A5FA',

    // Icons & navigation
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#F5C518',
    buttonIconTint: '#00B89F',
  },
};