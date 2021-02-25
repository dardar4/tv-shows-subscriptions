import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import TheatersSharpIcon from '@material-ui/icons/TheatersSharp';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import { useHistory } from 'react-router-dom';
import { LoggedInUserContext } from '../../Context/LoggedInUserContext';
import { TabsContext } from '../../Context/TabsContext';
import { FaUserCircle } from 'react-icons/fa';
import { FaUserNinja } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  dividerColor: {
    backgroundColor: 'white',
  },

  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  gridItemUserDetails: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },

  gridItemLogoutBtn: {
    justifyContent: 'flex-end',
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },

  gridItemMainTitle: {
    justifyContent: 'center',
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
}));

const UserDetailsToolTip = () => {
  const { loggedInUser } = useContext(LoggedInUserContext);
  const classes = useStyles();

  return (
    <div>
      User Name:  <span style={{ color: 'yellow' }}>{loggedInUser?.userName}</span> <br />
      <Divider className={classes.dividerColor}></Divider>
      Session Time out:  <span style={{ color: 'yellow' }}>{loggedInUser?.sessionTimeOut}</span> <br />
      <Divider className={classes.dividerColor}></Divider>
      Permissions:
      <ul>
        {loggedInUser?.permissions?.map((p, index) => {
          return (
            <li key={index}>
              <span style={{ color: 'yellow' }}>{p}</span>
            </li>
          );
        })}
      </ul>
      <Divider className={classes.dividerColor}></Divider>
    </div>
  );
};

const HeaderComp = () => {
  const { loggedInUser, dispatch } = useContext(LoggedInUserContext);
  const { setSelectedTab } = useContext(TabsContext);
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    history.push('/');
    setSelectedTab(0);
  };

  const getUserIcon = () => {
    if (loggedInUser?.firstName) {
      if (loggedInUser.isAdmin) {
        return <FaUserNinja color="yellow" size="1.5rem" />;
      } else {
        return <FaUserCircle color="yellow" size="1.5rem" />;
      }
    } else {
      return null;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center" /*className={classes.gridContainer}*/
        >
          <Grid
            item
            xs={12}
            sm={3}
            container
            spacing={2}
            alignItems="center"
            className={classes.gridItemUserDetails}
          >
            <Grid>
              <Tippy
                content={<UserDetailsToolTip></UserDetailsToolTip>}
                placement="bottom"
              >
                <div>{getUserIcon()}</div>
              </Tippy>
            </Grid>
            <Grid item>
              {loggedInUser?.firstName ? (
                <Typography>Hello, {loggedInUser.firstName} {loggedInUser.lastName}</Typography>
              ) : null}
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            direction="row"
            className={classes.gridItemMainTitle}
            container
          >
            <TheatersSharpIcon />
            <Typography>TV Shows - Subscriptions Web Site</Typography>
            <TheatersSharpIcon />
          </Grid>

          <Grid
            item
            xs={12}
            sm={3}
            className={classes.gridItemLogoutBtn}
            container
          >
            <Grid item>
              {loggedInUser?.userName ? (
                <Button
                  onClick={logout}
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={<ExitToAppSharpIcon />}
                  style={{ margin: 0 }}
                >
                  Logout
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComp;
