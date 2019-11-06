import React, { useReducer, createContext } from 'react';

function reducer(state, action) {
  if (action.type === 'assign') {
    return { ...state, ...action.payload };
  }

  return state;
}

export const StoreContext = createContext();

const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={useReducer(reducer, {})}>
    {children}
  </StoreContext.Provider>
);

export default StoreProvider;
