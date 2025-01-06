import React, { createContext, useContext } from 'react';
import useApiConfig from '../utils/apiConfig';

const ApiConfigContext = createContext(null);

export const ApiConfigProvider = ({ children }) => {
  const apiConfig = useApiConfig();

  return (
    <ApiConfigContext.Provider value={apiConfig}>
      {children}
    </ApiConfigContext.Provider>
  );
};

export const useApiConfigContext = () => {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error('useApiConfigContext must be used within an ApiConfigProvider');
  }
  return context;
};

export default ApiConfigContext;