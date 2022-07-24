import React, { useReducer } from "react";

export const createContext = (reducer, actions, initialState) => {
  const Context = React.createContext();
  const Provider = ({ children }) => {
    const [state, dispatchActions] = useReducer(reducer, initialState);

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatchActions);
    }

    return (
      <Context.Provider value={{ state, dispatch: boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};