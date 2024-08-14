export type AuthStackParamList = {
    Login: undefined;
    Create: undefined;
  };

  export type SearchField = {
    enteredQuery: {
      location: string, 
      type: string
    },
    updateQuery: (searchName: string, query: string ) => void
  }