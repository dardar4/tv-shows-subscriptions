import React from 'react';

import AddNewUserComp from './AddNewUser';
import UsersComp from './Users';
import EditUserComp from './EditUser';

import { Route, Switch } from 'react-router-dom';
import { Grid } from '@material-ui/core';

const UsersManagementMainComp = () => {
  return (
    <Switch>
      <Route path="/main/users" exact component={UsersComp} />
      <Route path="/main/users/add" component={AddNewUserComp} />
      <Route path="/main/users/edit" component={EditUserComp} />
    </Switch>
  );
};

export default UsersManagementMainComp;
