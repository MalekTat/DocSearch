import React, { createContext, useState, useContext } from "react";

// Create context
const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    city: "",
    specialty: "",
  });

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  );
};


export const useSearchContext = () => {
  return useContext(SearchContext);
};
