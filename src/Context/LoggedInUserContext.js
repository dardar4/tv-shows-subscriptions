import React, { createContext, useEffect, useReducer } from 'react';
import { loggedInUserReducer } from '../Reducers/LoggedInUserReducer';
import SessionStorageUtil from '../Api Utils/SessionStorageUtil'

export const LoggedInUserContext = createContext();

const LoggedInUserContextProvider = (props) => {
  const [loggedInUser, dispatch] = useReducer(loggedInUserReducer, {}, () => {
    return SessionStorageUtil.get('loggedInUser');
  })

  useEffect(() => {
    SessionStorageUtil.set("loggedInUser", loggedInUser);
  }, [loggedInUser])

  return (
    <LoggedInUserContext.Provider value={{loggedInUser, dispatch}}>
      {props.children}
    </LoggedInUserContext.Provider>
  );
};

export default LoggedInUserContextProvider;
