import React, { createContext, useState, useContext } from 'react';

// Create the context
const EmittedItemsContext = createContext();

// Create the provider component
export const EmittedItemsProvider = ({ children }) => {
  // State for managing the travel list
  const [emittedItems, setEmittedItems] = useState([]);

  return (
    <EmittedItemsContext.Provider value={{ emittedItems, setEmittedItems }}>
      {children}
    </EmittedItemsContext.Provider>
  );
};

// Custom hook to use the TravelListContext
export const useEmittedItems = () => {
  const context = useContext(EmittedItemsContext);
  if (!context) {
    throw new Error('EmittedItems must be used within a EmittedItemsContext.Provider');
  }
  return context;
};

export default EmittedItemsContext;