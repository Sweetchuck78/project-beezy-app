/**
 * App color system with support for light and dark mode.
 * Earthy muted green design tokens.
 */

export const Colors = {
  light: {
    // Core brand colors
    primary: '#556B2F',      // dark olive green
    secondary: '#6B8E23',    // muted olive
    accent: '#B5A642',       // warm golden accent

    // Gradients
    primaryGradient: ['#556B2F', '#6B8E23'],    // olive blend
    secondaryGradient: ['#6B8E23', '#A2B86C'],  // olive → sage

    // Backgrounds & surfaces
    appBackground: '#F8F8F5',
    surface: '#FFFFFF',
    elevated: '#E5E7E0',
    accentTileBackground: '#556B2F',
    buttonTint: '#FFFFFF',

    // Text colors
    text: '#232323',
    subtext: '#4B5563',
    muted: '#7D7D6B',
    buttonText: '#FFFFFF',
    invertedText: '#FFFFFF',
    accentTileText: '#FFFFFF',

    // State colors
    success: '#6B8E23',  // olive
    warning: '#D4A017',  // muted mustard
    error: '#B94E48',    // earthy red
    info: '#3A6F81',     // desaturated teal

    // Icons & navigation
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#556B2F',
    buttonIconTint: '#FFFFFF',
  },

  dark: {
    // Core brand colors
    primary: '#A2B86C',     // lighter sage green for dark mode
    secondary: '#C2C98D',   // muted pale olive
    accent: '#DCC48E',      // warm beige accent

    // Gradients
    primaryGradient: ['#A2B86C', '#6B8E23'],   // sage → olive
    secondaryGradient: ['#C2C98D', '#DCC48E'], // pale olive → beige

    // Backgrounds & surfaces
    appBackground: '#1A1A17',
    surface: '#232320',
    elevated: '#2F2F2C',
    accentTileBackground: '#A2B86C',
    buttonTint: '#1A1A17',

    // Text colors
    text: '#FFFFFF',
    subtext: '#D1D5DB',
    muted: '#9CA3AF',
    buttonText: '#232323',
    invertedText: '#232323',
    accentTileText: '#232323',

    // State colors
    success: '#A2B86C',
    warning: '#E5B567',
    error: '#D17878',
    info: '#6CA0A3',

    // Icons & navigation
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#A2B86C',
    buttonIconTint: '#A2B86C',
  },
};