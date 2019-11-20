import React, { useReducer, createContext } from 'react';
import assert from 'assert';

function reducer(state, action) {
  if (action.type === 'assign') {
    assert(action.payload, 'received assign action with no payload');
    return { ...state, ...action.payload };
  }

  return state;
}

export const StoreContext = createContext();

const StoreProvider = ({ children, initialState = {} }) => (
  <StoreContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StoreContext.Provider>
);

export default StoreProvider;
