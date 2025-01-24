const Theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    muted: '#6c757d',
    error: '#dc3545',
    success: '#28a745',
    darkModeBackground: '#121212', // Optional for dark mode
  },

  typography: {
    fontFamily: {
      regular: 'Roboto-Regular',
      bold: 'Roboto-Bold',
      italic: 'Roboto-Italic',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    },
    lineHeight: {
      sm: 18,
      md: 24,
      lg: 28,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borders: {
    radiusSmall: 4,
    radiusMedium: 8,
    radiusLarge: 16,
    borderWidthThin: 1,
    borderWidthThick: 2,
  },

  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

export default Theme;
