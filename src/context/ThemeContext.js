import React, {createContext, useContext, useState} from 'react';

// 🔹 Main Color Palette
const colors = {
  background: '#f7f7f7', // Soft off-white for a clean background
  text: '#1a1a1a', // Very dark gray for sharp readability
  primary: '#007bff', // Blue for CTAs (trust and action-oriented)
  secondary: '#ff9800', // Warm orange for secondary actions
  accent: '#00bfa6', // Bright teal for special highlights
  muted: '#f4f4f4', // Soft, light gray
  white: '#ffffff',
  gray: '#a3a3a3', // Subdued gray for disabled states
  danger: '#dc3545', // Red for errors/logouts
  success: '#28a745', // Green for confirmations
};

// 🔹 Shadows (Reused for buttons, containers, cards)
const shadow = {
  light: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
};

// 🔹 Typography Styles
const typography = {
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
    md: 22,
    lg: 28,
  },
  letterSpacing: {
    normal: 0,
    wide: 1,
    wider: 2,
  },
};

// 🔹 Spacing & Padding
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  padding: {
    small: {padding: 4},
    medium: {padding: 8},
    large: {padding: 16},
    default: {paddingTop: 3, paddingLeft: 1, paddingRight: 1, paddingBottom: 3}, // 🔥 Still here!
  },
};

// 🔹 Button Styles
const buttons = {
  // 🔹 Base button styling (applies to all buttons)
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  auth: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // 🔹 Primary Action Buttons
  primary: {backgroundColor: colors.primary}, // Main action button
  secondary: {backgroundColor: colors.secondary}, // Less dominant action
  danger: {backgroundColor: colors.danger}, // For logout & destructive actions
  success: {backgroundColor: colors.success}, // For "Create Account" button

  // 🔹 Call-to-Action (CTA) Button
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.medium,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  ctaText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  action: {
    backgroundColor: colors.secondary, // Use secondary color
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  actionText: {
    color: colors.text, // Text color for action buttons
    fontSize: 12,
    fontWeight: 'bold',
  },

  // 🔹 Filter Button (Used for selecting categories)
  filter: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.whiter,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  filterSelected: {
    backgroundColor: colors.primary, // Highlighted background
    borderColor: colors.primary,
    shadowOpacity: 0.3, // Slightly stronger shadow
    elevation: 3, // Slightly higher elevation for selected state
  },
  filterSelectedText: {
    color: colors.white, // White text for contrast
    fontWeight: '600', // More bold for emphasis
  },

  // 🔹 Toggle Button (Switches between states)
  toggle: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSelected: {
    backgroundColor: colors.primary,
  },

  // 🔹 Chip Button (Small rounded buttons like Material Design chips)
  chip: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    color: colors.text,
  },

  // 🔹 Flat Button (Button with no elevation)
  flat: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  listContainer: {
    flexDirection: 'column', // Stack buttons vertically
    alignItems: 'stretch', // Make buttons take full width
    marginBottom: 12,
  },
  list: {
    backgroundColor: '#ff9800',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8, // Space between buttons
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  listText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // 🔹 Pressed & Disabled States
  pressed: {backgroundColor: '#004494'}, // Darker color on press
  disabled: {backgroundColor: colors.gray},
};

// 🔹 Input Styles
const inputs = {
  default: {
    height: 44,
    borderColor: 'rgba(214, 204, 204, 2)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  auth: {
    height: 22,
    borderColor: colors.muted,
    borderWidth: 1,
    // borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    ...shadow.light,
    color: colors.text,
    backgroundColor: colors.white,
  },
  focused: {
    borderColor: colors.primary, // Accent color for focus
    borderWidth: 2,
  },
  error: {
    borderColor: colors.danger,
  },
  disabled: {
    backgroundColor: colors.muted,
    color: colors.gray,
  },
};

// 🔹 List & Card Styles (Grouped Together)
const lists = {
  listContainer: {
    paddingTop: 10,
  },
  list: {
    padding: 5,
    paddingTop: 0,
  },
  authContainer: {
    // backgroundColor: colors.white,
    // width: '80%',
    borderRadius: 12,
    ...shadow.light,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  mainHeaderContainer: {
    width: '100%', // Full width
    padding: 10,
    paddingTop: 16,
    backgroundColor: colors.muted, // Light background for contrast
    marginBottom: 16, // Spacing below
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
    borderBottomWidth: 1,
    borderBottomColor: colors.muted, // Light border for separation
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadow.medium,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardImage: {
    width: '100%',
    height: 120, // Fixed height for consistent card size
    borderRadius: 8, // Rounded corners for the image
    marginBottom: 8, // Space below the image
  },
  cardDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12, // Space before the buttons
  },
  sectionCard: {
    backgroundColor: colors.white, // White background for contrast
    borderRadius: 13.5, // Rounded corners
    borderWidth: 1.5, // Thin border for structure
    borderColor: colors.gray, // Subtle gray border
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16, // Space below the card
    elevation: 2, // Android shadow
    padding: 12, // Inner padding
  },
  mainHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text,
  },
  mainHeaderButtons: {
    backgroundColor: colors.muted,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mainHeaderDetails: {
    paddingTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8, // Vertical padding for spacing
    paddingHorizontal: 16, // Horizontal padding for alignment
    borderTopLeftRadius: 12, // Rounded top-left corner
    borderTopRightRadius: 12, // Rounded top-right corner
    marginBottom: 8, // Space between the header and the list items
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
  },
};

const personalList = {
  mainContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5', // Light gray background for the main container
  },
  list: {
    padding: 1.5,
    backgroundColor: '#ffffff', // White background for the list
    borderRadius: 8, // Rounded corners
    marginBottom: 15, // Space between each list
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  },
  subList: {
    padding: 5,
    backgroundColor: '#ffefd5', // Light orange background for sublist
    borderLeftWidth: 5, // Left border for visual separation
    left: 5,
    borderLeftColor: '#ffa500', // Orange color for left border
    borderRadius: 4, // Slight rounded corners
    marginBottom: 10, // Spacing between sublist items
  },
  subListHeaderContainer: {
    paddingVertical: 10, // Vertical spacing
    paddingHorizontal: 15, // Horizontal spacing
    backgroundColor: '#4A90E2', // Modern blue background
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6, // Rounded edges
    marginBottom: 10, // Space between header and next section
    shadowColor: '#000', // Soft shadow for depth
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  subListHeaderText: {
    fontSize: 18, // Larger font for header
    color: '#ffffff', // White text for contrast
    fontWeight: '600', // Semi-bold for emphasis
    textAlign: 'left', // Align text to the left
    letterSpacing: 0.5, // Slight spacing for a polished look
  },
  listItem: {
    // width: '60%',
    width: 160,
    paddingVertical: 6, // Reduce vertical padding
  },
  itemTitle: {
    flexDirection: 'row',
    marginRight: '0',
  },
  itemButtons: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginLeft: 30,
  },
  notesItem: {
    padding: 8,
    fontSize: 14,
    color: '#555', // Slightly lighter text
  },
};

// 🔹 Theme Object (Consolidated All Sections)
const theme = {
  colors,
  typography,
  spacing,
  shadow,
  buttons,
  inputs,
  lists,
  personalList,
};

// 🔹 Create Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [currentTheme] = useState(theme);

  return (
    <ThemeContext.Provider value={{theme: currentTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🔹 Custom Hook for Theme Usage
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
