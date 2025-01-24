import React, {createContext, useState, useContext} from 'react';
import {TripLocation, TripContextType} from '../types/types';

const SelectedTripContext = createContext<TripContextType | undefined>(
  undefined,
);

// Create a provider component
export const TripProvider = ({children}) => {
  const [locations, setLocation] = useState<TripLocation[]>([]);

  return (
    <SelectedTripContext.Provider value={{locations, setLocation}}>
      {children}
    </SelectedTripContext.Provider>
  );
};

// Custom hook to use the TripContext
export const useTrip = () => {
  const context = useContext(SelectedTripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

//should have a list for each trip

//that list should be able to be edited by whoever its shared to --> permission granted to user

// user should be owner of list

//user will have list as array
//each list will have guest property. those guest will be able to edit and add to list

//then each user should have unique id?

// relational database.
// list separate

//how will guest access list on their end?
//do they need unique id of original owner?
//primary user have to enter email or user id of those they want to share with
// then other user after logging in or refreshing can be able to view the list
//

//list tab,
//will show list of all from logged in users
