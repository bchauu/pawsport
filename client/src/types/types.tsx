export type AuthStackParamList = {
    Login: undefined;
    Create: undefined;
  };

export type HomeStackParamList = {
    Home: undefined;
    Suggest: never;
}

export type TripStackParamList = {
  Trip: undefined;
  CoopTrip: never;
}

  export type SearchField = {
    enteredQuery: {
      location: string, 
      type: string
    },
    updateQuery: (searchName: string, query: string ) => void
  }

 export interface SearchValue {
    name: string;
    location: {
      lat: string;
      lng: string;
    },
    type: string
  }
  
  export interface SearchContextType {
    searchValue: SearchValue;
    setSearchValue: (value: SearchValue) => void;
  }

  export interface TripLocation {
    name: string
    lat: number | null
    lng: number | null
    place_id: string
  }

  export interface TripContextType {
    locations: TripLocation[];
    // setLocation: (value: TripLocation) => void;
    setLocation: React.Dispatch<React.SetStateAction<TripLocation[]>>;
  }