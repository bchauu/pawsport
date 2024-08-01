// declarations.d.ts

declare module '@react-navigation/native' {
    import { NavigationContainerProps } from '@react-navigation/core';
    import * as React from 'react';
  
    export function useNavigation(): any;
    export function useRoute(): any;
    export function useIsFocused(): boolean;
    export function useLinkTo(): any;
  
    export const NavigationContainer: React.ComponentType<NavigationContainerProps>;
    // Add any other exports or types as needed
  }