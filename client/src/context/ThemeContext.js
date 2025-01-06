import React, { createContext, useContext, useState } from 'react';

const colors = {
  main: {
    background: '#f7f7f7',  // Soft off-white for a clean background
    text: '#1a1a1a',        // Very dark gray for sharp readability
    primary: '#0056b3',     // Bold, deep blue for CTAs (trust and action-oriented)
    secondary: '#ff9800',   // Warm orange for secondary actions (inviting but less dominant)
    accent: '#00bfa6',      // Bright teal for special highlights and occasional CTAs
    muted: '#f4f4f4', // A soft, light gray
    white: '#ffffff',       // Include white as a theme color
    gray: '#a3a3a3',        // Subdued gray for disabled states
  },
}

const shadow = {
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  }
    //use this instead of typing all over again
      // make sure they all match 
        //if not create subset one. button, text, etc
}

// 1.	For Category Buttons:
// •	FilterButton: Indicates that the button is used to filter content.
// •	ToggleButton: Represents a button that toggles between selected and unselected states.
// •	PillButton: Sometimes used for buttons styled as rounded pills for categories.
// •	ChipButton: Inspired by Material Design’s chips, often used for selectable categories.
// •	SegmentedControlButton: Represents a segmented control, where one option is selected at a time.
// 2.	For Action Buttons:
// •	PrimaryButton: A general action button styled with the primary color.
// •	SecondaryButton: A less prominent action button for secondary tasks.
// •	CTAButton (Call-to-Action): Indicates a critical task like “Search” or “Submit.”
// •	FlatButton: Refers to a button with no elevation, often used in secondary actions.

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
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};


const theme = {
  padding: {
    default: {
      paddingTop: 3,
      paddingLeft: 1,
      paddingRight: 1,
      paddingBottom: 3,
    }
  },
  list: {
    listContainer: {
      // padding: 16,
      paddingTop: 10,
      // backgroundColor: 'red'
    },
    list: {
      padding: 5,
      paddingTop: 0,
    },
    mainHeaderContainer: {
      width: '100%', // Ensure it spans the full width of the screen
      padding: 6, // Add padding inside the container
      paddingTop: 16, 
      backgroundColor: '#f8f8f8', // Light background color for the header area
      marginBottom: 16, // Add spacing below the container
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    mainHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
      color: '#333',
    },
    mainHeaederButtons: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,           // Rounded edges for the container
    paddingVertical: 15,       // Space above and below the buttons
    paddingHorizontal: 20,     // Space around the buttons
    marginTop: 10,             // Spacing from other content
    flexDirection: 'row',
    justifyContent: 'space-around', // Even spacing for buttons
    alignItems: 'center',
    },
    mainHeaederDetails: {
      paddingTop: 10,
    },
    sectionCard: {
      backgroundColor: '#fff', // White card background
      borderRadius: 13.5, // Rounded corners
      borderWidth: 1.5, // Thin border for structure
      borderColor: '#ddd', // Subtle gray border
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 16, // Space below the card
      shadowColor: '#000',
      elevation: 2, // For Android shadow
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
      backgroundColor: '#f7f7f7',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    titleText: {
      fontSize: 20,
      fontWeight: '600',
      color: '#555',
    },
    saveButton: {
      backgroundColor: '#007bff', // Primary color for the button
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, // Keep the shadow close to the button
      shadowOpacity: 0.15, // Slightly reduce opacity
      shadowRadius: 3, // Reduce spread for better performance
      elevation: 3, // Use elevation on Android
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff', // White text for contrast
      textAlign: 'center',
    },
    removeButton: {
      backgroundColor: '#6c757d', // Muted gray for subtle appearance
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, // Minimal shadow
      shadowOpacity: 0.1, // Lighter shadow opacity for less emphasis
      shadowRadius: 2, // Slightly less spread
      elevation: 2, // Reduced elevation for less prominence
    },
    removeButtonText: {
      fontSize: 7,
      fontWeight: 'bold',
      color: '#f8f9fa', // Off-white for contrast
      textAlign: 'center',
    },
  },
  personalList: {
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
      shadowOffset: { width: 0, height: 2 },
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
      paddingVertical: 6, // Reduce vertical padding
      paddingHorizontal: 8, // Slightly reduce horizontal padding
    },
    notesItem: {
      padding: 8,
      fontSize: 14,
      color: '#555', // Slightly lighter text
    },
  },
  topHeaderContainer: {
    padding: 10, 
  },
  textInput: {
    default: {
      // width: '90%',
      marginBottom: 16,
      height: 44,
      borderColor: 'rgba(214, 204, 204, 2)',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      color: '#333',
      backgroundColor: '#fff',
    },
    focused: {
      borderColor: '#4caf50', // Accent color for focused state
      borderWidth: 2,
    },
    error: {
      borderColor: '#f44336', // Red for error
    },
    disabled: {
      backgroundColor: '#f5f5f5',
      color: '#9e9e9e',
    },
  },
  filterButton: {
    default: {
      borderRadius: 20, // Rounded corners, but avoid extreme rounding
      borderWidth: 1,
      borderColor: '#ddd',
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginHorizontal: 3,
      backgroundColor: '#fff', // Use a solid or slightly opaque color
      alignItems: 'center',
      justifyContent: 'center',
      // Optimized shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, // Keep the shadow close to the button
      shadowOpacity: 0.15, // Slightly reduce opacity
      shadowRadius: 3, // Reduce spread for better performance
      elevation: 3, // Use elevation on Android
    },
    selected: {
      backgroundColor: colors.main.primary, 
      borderColor: colors.main.primary,
      shadowOpacity: 0.3,
      elevation: 4, // Slightly higher e
    },
    text: {
      color: colors.main.primary, // Default text color
      fontSize: 10,
      fontWeight: '500', // Slightly bold for readability
    },
    selectedText: {
      color: colors.main.white, // White or high-contrast color for selected state
      fontWeight: '600', // More bold for emphasis
    },
    pressed: {
      transform: [{ scale: 0.95 }], // Slight "pressed" effect
    },
  },
  actionButton: {
    default: {
      backgroundColor: colors.main.secondary, // Use secondary color
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    text: {
      color: colors.main.text, // Text color for action buttons
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
  ctaButton: {
    default: {
      flex: 1,
      backgroundColor: colors.main.primary, // Rich blue
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 }, // Keep the shadow close to the button
      shadowOpacity: 0.15, // Slightly reduce opacity
      shadowRadius: 3, // Reduce spread for better performance
      elevation: 3, // Use elevation on Android
    },
    text: {
      flex: 1,
      color: colors.main.white, // White text for contrast
      fontSize: 12,
      fontWeight: 'bold',
    },
    pressed: {
      backgroundColor: '#004494', // Darker blue for pressed state
    },
    disabled: {
      backgroundColor: colors.main.muted, // Light gray for disabled state
      color: colors.main.gray, // Subdued gray for disabled text
    },
  },
  card: {
    cardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8, 
      backgroundColor: '#fff',
      borderRadius: 12, // Rounded corners
      shadowColor: '#000', // Subtle shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Shadow for Android
      padding: 12, // Space inside the card
      marginBottom: 16, // Space between cards
      // width: '48%', // Responsive width for two cards per row
    },
    cardImage: {
      width: '100%',
      height: 120, // Fixed height for consistent card size
      borderRadius: 8, // Rounded corners for the image
      marginBottom: 8, // Space below the image
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4, // Space below the title
    },
    cardDetails: {
      fontSize: 14,
      color: '#555',
      marginBottom: 12, // Space before the buttons
    },
    buttonContainer: {
      flexDirection: 'column', // Stack buttons vertically
      alignItems: 'stretch', // Make buttons take full width
      marginBottom: 12,
    },
    button: {
      backgroundColor: '#ff9800',
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 8, // Space between buttons
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
  },
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  },
  colors: {
      background: '#ffffff',
      text: '#000000',
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#f4a261',
  },
  inputStyle: {
    borderColor: colors.main.primary,
    backgroundColor: colors.main.background,
    color: colors.main.text
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme] = useState(theme); // Default theme

  return (
    <ThemeContext.Provider value={{ theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};