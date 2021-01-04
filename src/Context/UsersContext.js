import React, { createContext, useEffect, useState } from 'react';
import FirebaseApi from '../Api Utils/FireBaseApi';

export const UsersContext = createContext();

const UsersContextProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [updateUsersList, setUpdateUsersList] = useState(false);
  const [userToEdit, setUserToEdit] = useState({})
  const [displayMode, setDisplayMode] = useState('users');

  useEffect(() => {
    const getAllUsersData = async () => {
      const usersDataArr = await FirebaseApi.getAllUsersData();
      setUsers(usersDataArr);
      setUpdateUsersList(false);
    };

    getAllUsersData();
  }, [updateUsersList]);

  return (
    <UsersContext.Provider 
        value={{users, setUpdateUsersList, userToEdit, setUserToEdit, displayMode, setDisplayMode}}>
      {props.children}
    </UsersContext.Provider>
  );
};

export default UsersContextProvider;
