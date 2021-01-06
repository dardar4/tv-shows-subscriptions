import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UsersContext } from '../../Context/UsersContext';
import CinemaApi from '../../Api Utils/CinemaApi'
import { Button } from '@material-ui/core';

const UserCardComp = ({ data }) => {
  const { setUserToEdit, setUpdateUsersList } = useContext(UsersContext);

  let history = useHistory();

  const deleteUser = async () => {
    await CinemaApi.invoke('deleteUser', data.id);

    setUpdateUsersList(true);
  };

  const editUser = () => {
    setUserToEdit(data);
    history.push('/main/users/edit');
  };

  return (
    <div
      style={{
        margin: '3px',
        width: '50%',
        border: '2px solid blue',
        borderLeftColor: 'red',
      }}
    >
      ID : {data.id} <br />
      Name: {data.firstName + ' ' + data.lastName} <br />
      User Name: {data.userName} <br />
      Session Time Out (in minutes): {data.sessionTimeOut} <br />
      Created Date: {data.createdDate} <br />
      Permissions:
      <ul>
        {data.permissions.map((p, index) => {
          return <li key={index}>{p}</li>
        })}
      </ul>
      <br />
      <br />
      <Button
        onClick={editUser}
        variant="contained"
        color="primary"
        style={{ backgroundColor: 'green', color: 'white', padding: 3, margin : 1 }}
      >
        Edit
      </Button>
      <Button
        onClick={deleteUser}
        variant="contained"
        color="primary"
        style={{ backgroundColor: 'red', color: 'white', padding: 3, margin : 1 }}
      >
        Delete
      </Button>
    </div>
  );
};

export default UserCardComp;
