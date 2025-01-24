import React, {createContext, useState, useContext} from 'react';
import {SearchContextType, SearchValue} from '../types/types';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a provider component
export const SearchProvider = ({children}) => {
  const [searchValue, setSearchValue] = useState<SearchValue>({
    name: '',
    location: {
      lat: '',
      lng: '',
    },
    type: '',
  });

  return (
    <SearchContext.Provider value={{searchValue, setSearchValue}}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the SearchContext
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
