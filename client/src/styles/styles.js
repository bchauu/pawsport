import { Animated, Easing } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';

// Custom Flip Transition
const flipAnimation = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 1300, // Experiment with different durations for smoothness
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),  // Use a custom easing for smoother animation
          useNativeDriver: true,  // Enable native driver for better performance
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 1300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),  // Same easing for closing animation
          useNativeDriver: true,
        },
      },
    },
    cardStyleInterpolator: ({ current }) => {
      const rotateY = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg'],  // Rotate from 180 degrees (flipped) to 0 degrees
      });
  
      return {
        cardStyle: {
          transform: [{ rotateY }],
          backfaceVisibility: 'hidden',  // Hide the back face
        },
      };
    },
  };

export default flipAnimation;