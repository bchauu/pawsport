import React, { createContext, useState, useContext } from 'react';

// Create the context
const TravelListContext = createContext();

// Create the provider component
export const TravelListProvider = ({ children }) => {
  // State for managing the travel list
  const [allTravelList, setAllTravelList] = useState([]);

  return (
    <TravelListContext.Provider value={{ allTravelList, setAllTravelList }}>
      {children}
    </TravelListContext.Provider>
  );
};

// Custom hook to use the TravelListContext
export const useTravelList = () => {
  const context = useContext(TravelListContext);
  if (!context) {
    throw new Error('useTravelList must be used within a TravelListProvider');
  }
  return context;
};

export default TravelListContext;