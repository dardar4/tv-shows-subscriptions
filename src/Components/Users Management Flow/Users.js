import React, { useContext, useEffect } from 'react';
import { UsersContext } from '../../Context/UsersContext';
import UserCardComp from './UserCard';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@material-ui/core';
import SectionTitleComp from '../General/SectionTitle';

const UsersComp = (props) => {
  const { users, setUpdateUsersList } = useContext(UsersContext);

  useEffect(() => {
    setUpdateUsersList(true);
  }, []);

  return (
    <Grid container direction="column" alignItems="center">
      <SectionTitleComp titleText={`Users`} />

      <div>
        <Link to="/main/users/add">
          <Button
            variant="contained"
            color="primary"
            style={{ padding: 3, margin: 1 }}
          >
            Add User
          </Button>
        </Link>
      </div>

      {users.map((userData) => {
        if (!userData.isAdmin) {
          return <UserCardComp key={userData.id} data={userData} />;
        }
      })}
    </Grid>
  );
};

export default UsersComp;
