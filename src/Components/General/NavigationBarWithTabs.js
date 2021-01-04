import React, { useContext, useEffect } from 'react';
import { AppBar, Grid, makeStyles, Tab, Tabs } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MoviesMainComp from '../Movies Flow/MoviesMain';
import UsersManagementMainComp from '../Users Management Flow/UsersManagementMain';
import SubscribersMainComp from '../Subscribers Flow/SubscribersMain';
import { LoggedInUserContext } from '../../Context/LoggedInUserContext';
import { TabsContext } from '../../Context/TabsContext';
import UserPermissionUtil from '../General/UserPermissionsUtil';
import { Route, Switch, useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  gridItem : {
    [theme.breakpoints.down('xs')] : {
      justifyContent : 'center',
    }
  },
}));

const indexToTabName = {
  0: 'movies',
  1: 'members',
  2: 'users',
};

const NavigationBarWithTabsComp = () => {
  const classes = useStyles();
  const { loggedInUser } = useContext(LoggedInUserContext);
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    history.push(`/main/${indexToTabName[newValue]}`);
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if(UserPermissionUtil.canViewUsersManagement(loggedInUser)){
      history.push(`/main/users`);
      setSelectedTab(2);
    } else if(UserPermissionUtil.validatePermission(loggedInUser, 'View Movies')){
      history.push(`/main/movies`);
      setSelectedTab(0);
    } else if(UserPermissionUtil.validatePermission(loggedInUser, 'View Subscriptions')){
      history.push(`/main/members`);
      setSelectedTab(1);
    }
  }, [])

  return (
    <>
      <AppBar position="static">
        <Tabs
          orientation= {isMobile ? 'vertical' : 'horizontal'}
          centered
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="secondary"
        >
          <Tab
            disabled={
              !UserPermissionUtil.validatePermission(
                loggedInUser,
                'View Movies'
              )
            }
            label="Movies"
          ></Tab>
          <Tab
            disabled={
              !UserPermissionUtil.validatePermission(
                loggedInUser,
                'View Subscriptions'
              )
            }
            label="Subscribers"
          ></Tab>
          <Tab
            disabled={!UserPermissionUtil.canViewUsersManagement(loggedInUser)}
            label="Users Management"
          ></Tab>
        </Tabs>
      </AppBar>

      <Grid container direction="row" justify="center" alignItems="center">
        <Grid
          item
          xs="auto"
          sm={2}
          style={{ border: '1px solid black', height: 'auto' }}
        ></Grid>
        <Grid item xs={12} sm={8} container direction="column" className={classes.gridItem}>
            <Switch>
              <Route path="/main/movies" component={MoviesMainComp} />
              <Route path="/main/members" component={SubscribersMainComp} />
              <Route path="/main/users" component={UsersManagementMainComp} />
            </Switch>
        </Grid>
        <Grid
          item
          xs="auto"
          sm={2}
          style={{ border: '1px solid black' }}
        ></Grid>
      </Grid>
    </>
  );
};

export default NavigationBarWithTabsComp;
