import React, {createContext, useContext, useState} from 'react';

// Create the context
const TripContext = createContext();

// Create the provider
export const SelectedTripListProvider = ({children}) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <TripContext.Provider value={{selectedTrip, setSelectedTrip}}>
      {children}
    </TripContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSelectedTripListContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
