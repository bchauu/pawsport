export type AuthStackParamList = {
    Login: undefined;
    Create: undefined;
  };

export type HomeStackParamList = {
    Home: undefined;
    Suggest: never
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