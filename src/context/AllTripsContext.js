import React, {createContext, useState, useContext} from 'react';

// Create the context
const AllTripsContext = createContext();

// Create the provider component
export const AllTripsProvider = ({children}) => {
  // State for managing the travel list
  const [allTrip, setAllTrip] = useState([]);

  return (
    <AllTripsContext.Provider value={{allTrip, setAllTrip}}>
      {children}
    </AllTripsContext.Provider>
  );
};

// Custom hook to use the TravelListContext
export const useAllTrips = () => {
  const context = useContext(AllTripsContext);
  if (!context) {
    throw new Error(
      'useTravelList must be used within a AllTripsContext.Provider',
    );
  }
  return context;
};

export default AllTripsContext;
