import React, { createContext, useEffect, useState } from 'react';
import CinemaApi from '../Api Utils/CinemaApi';

export const UsersContext = createContext();

const UsersContextProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [updateUsersList, setUpdateUsersList] = useState(false);
  const [userToEdit, setUserToEdit] = useState({})

  useEffect(() => {
    const getAllUsersData = async () => {
      const usersDataArr = await CinemaApi.invoke('getUsers');
      setUsers(usersDataArr ?? []);
      setUpdateUsersList(false);
    };

    getAllUsersData();
  }, [updateUsersList]);

  return (
    <UsersContext.Provider 
        value={{ users, setUpdateUsersList, userToEdit, setUserToEdit }}>
      {props.children}
    </UsersContext.Provider>
  );
};

export default UsersContextProvider;
