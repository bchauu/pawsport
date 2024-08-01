export type AuthStackParamList = {
    Login: undefined;
    Create: undefined;
  };

  export type SearchField = {
    enteredQuery: {
      description: string,
      districtCity: string[],
      country: string
    },
    updateQuery: (searchName: string, query: string ) => void
  }