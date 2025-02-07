import React, {createContext, useState, useContext} from 'react';

// Create the context
const AddedItemContext = createContext();

// Create the provider component
export const AddedItemProvider = ({children}) => {
  // State for managing the travel list
  const [isAddedItem, setIsAddedItem] = useState(false);

  return (
    <AddedItemContext.Provider value={{isAddedItem, setIsAddedItem}}>
      {children}
    </AddedItemContext.Provider>
  );
};

// Custom hook to use the AddedItemContext
export const useAddedItem = () => {
  const context = useContext(AddedItemContext);
  if (!context) {
    throw new Error('useTravelList must be used within a TravelListProvider');
  }
  return context;
};

export default AddedItemContext;
