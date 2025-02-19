import React, {createContext, useContext, useState} from 'react';

// 🔹 Main Color Palette (slightly muted secondary if desired)
const colors = {
  primary: '#2C7D53', // Forest green (main CTA color)
  lighterPrimary: '#4B906C', // A lighter, opaque version of the primary color
  primaryOverlay: 'rgba(44,125,83,0.2)', // A transparent overlay version
  secondary: '#7F5B34', // Saddle Brown (secondary actions/highlights)
  lighterSecondary: '#A28564', // A lighter, opaque version of secondary (approximation)
  secondaryOverlay: 'rgba(127,91,52,0.2)', // Transparent overlay of secondary
  accent: '#FAF4EC', // Golden mustard (small highlights/alerts)
  success: '#38A169', // Cactus green (success messages)
  danger: '#C53030', // Canyon red (errors/destructive actions)
  background: '#EDF0F2', // Soft off-white backdrop
  text: '#1A202C', // Dark gray-navy for strong readability
  muted: '#E2E8F0', // Light gray for subtle backgrounds
  white: '#FFFFFF', // Pure white
  gray: '#A0AEC0', // Mid-tone gray for borders, disabled states
};

// 🔹 Shadows: Lowered opacity for subtler effect
const shadow = {
  light: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3, // 🔥 Slightly smaller radius
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2}, // Lower height
    shadowOpacity: 0.15, // 🔥 Reduced for a smoother look
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1}, // Lower height
    shadowOpacity: 0.3, // 🔥 Reduced for a smoother look
    shadowRadius: 4,
    elevation: 2,
  },
};

// 🔹 Typography: Could unify headers with consistent spacing, lineHeights
const typography = {
  fontFamily: {
    heading: 'RobotoSlab-Bold',
    body: 'OpenSans-Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28, // 🔥 If you want bigger headings
  },
  lineHeight: {
    sm: 18,
    md: 22,
    lg: 28,
  },
  letterSpacing: {
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// 🔹 Spacing & Padding
const spacing = {
  xs: 2,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  padding: {
    small: {padding: 8}, // 🔥 Bumped up from 4 → 8
    medium: {padding: 12},
    large: {padding: 16},
    default: {
      paddingTop: 2,
      paddingLeft: 3,
      paddingRight: 3,
      paddingBottom: 6,
    },
    screen: {
      paddingTop: 54,
    },
  },
};

// 🔹 Button Styles
const buttons = {
  base: {
    paddingVertical: 10, // 🔥 Reduced from 14
    paddingHorizontal: 20, // 🔥 Reduced from 28
    borderRadius: 6, // 🔥 More unified corner radius
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8, // Slightly smaller margin
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5, // 🔥 Slightly subtler spacing
  },
  primary: {backgroundColor: colors.primary},
  secondary: {backgroundColor: colors.secondary},
  danger: {backgroundColor: colors.danger},
  success: {backgroundColor: colors.success},

  // 🔹 CTA Button
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    ...shadow.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  ctaReverse: {
    backgroundColor: colors.muted,
    borderRadius: 6,
    paddingVertical: 8.5,
    paddingHorizontal: 0,
    ...shadow.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaReverseText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },

  // 🔹 Smaller Auth/Action Buttons
  auth: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: colors.primary,
    ...shadow.light,
  },
  authText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  action: {
    backgroundColor: colors.secondary, // Use secondary color
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...shadow.button,
    alignSelf: 'center',
  },
  actionText: {
    color: colors.white, // Text color for action buttons
    fontSize: 12,
    fontWeight: 'bold',
  },

  // 🔹 Filter Button
  filter: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    ...shadow.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.primary,
  },
  filterSelected: {
    backgroundColor: colors.lighterPrimary,
    borderColor: colors.lighterPrimary,
    shadowOpacity: 0.15,
    elevation: 2,
  },
  filterSelectedText: {
    color: colors.white,
    fontWeight: '600',
  },

  // 🔹 Toggle Button
  toggle: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSelected: {
    backgroundColor: colors.primary,
  },

  // 🔹 Chip Button
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

  // 🔹 Flat Button
  flat: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // 🔹 Pressed & Disabled
  pressed: {backgroundColor: '#004494'},
  disabled: {backgroundColor: colors.gray},
};

// 🔹 Input Styles
const inputs = {
  default: {
    height: 40, // 🔥 Slightly smaller
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
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
    borderColor: colors.primary,
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

// 🔹 Lists & Cards
const lists = {
  listContainer: {
    // paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  list: {
    padding: 5,
    paddingTop: 15,
    backgroundColor: colors.background,
  },
  authContainer: {
    borderRadius: 12,
    ...shadow.light,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  buttonsContainer: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainHeaderContainer: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
    paddingVertical: spacing.xl,
    ...shadow.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  mainHeader: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.muted,
    borderBottomWidth: 1,
    marginBottom: spacing.sm,
    color: colors.white,
  },
  mainHeaderDetails: {
    paddingTop: 10,
  },
  mainHeaderButtons: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: 0,
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.muted,
    padding: 8,
    paddingTop: 14,
    paddingBottom: 10,
    margin: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 0, //shadow causing double border padding when title gets pushed down
    // elevation: 3,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // ensures top alignment
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
    maxWidth: 300,
  },
  cardImage: {
    width: '100%',
    maxWidth: 300,
    height: 120, // Fixed height for consistent card size
    borderRadius: 8, // Rounded corners for the image
    marginBottom: 8, // Space below the image
  },
  cardDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12, // Space before the buttons
  },
  cardActions: {
    flexDirection: 'row',
  },
  sectionCard: {
    backgroundColor: colors.background,
    borderRadius: 6,
    marginBottom: spacing.md,
    paddingBottom: 50,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  titleText: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary, // 🔥 Make white text stand out on orange
  },
  reviewCard: {
    backgroundColor: colors.muted,
    alignSelf: 'flex-start',
    maxWidth: 300,
  },
  reviewHeaderContainer: {
    marginBottom: 10, // Space below header
    paddingBottom: 5, // Extra padding inside header
    borderBottomWidth: 1, // A subtle divider line
    borderBottomColor: '#E2E8F0', // Use a muted tone from your theme
  },
  authorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  ratingText: {
    fontSize: 14,
    color: '#1A202C',
  },
  relativeTimeText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1A202C',
    marginTop: 10, // additional separation from header
  },
};

// 🔹 Personal List
const personalList = {
  mainContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  list: {
    // padding: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: 6,
    marginBottom: spacing.md,
    // React Native doesn’t support `boxShadow` syntax – use shadow props:
    ...shadow.light,
    borderColor: colors.muted,
    borderWidth: 1,
  },
  subList: {
    padding: spacing.sm,
    backgroundColor: colors.accent,
    borderLeftWidth: 5,
    left: 5,
    borderLeftColor: colors.secondary,
    borderRadius: 4,
    marginBottom: spacing.sm,
    borderColor: colors.muted,
    borderBottomWidth: 1,
    borderWidth: 0,
  },
  subListHeaderContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: spacing.sm,
    borderColor: colors.gray,
    borderBottomWidth: 0.5,
    // borderWidth: 0.3,
    shadowOpacity: 0.1,
    ...shadow.light,
  },
  subListHeaderText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'left',
    letterSpacing: 0.5,
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

// 🔹 Combine into One Theme Object
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

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [currentTheme] = useState(theme);
  return (
    <ThemeContext.Provider value={{theme: currentTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
