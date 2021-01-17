import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import { ShowsContext } from '../../Context/ShowsContext';
import SectionTitleComp from '../General/SectionTitle';
import ShowCardComp from './ShowCard';
import UserPermissionUtil from '../General/UserPermissionsUtil';
import { LoggedInUserContext } from '../../Context/LoggedInUserContext';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { MembersContext } from '../../Context/MembersContext';
import CinemaApi from '../../Api Utils/CinemaApi';

const useStyles = makeStyles((theme) => ({
  disabledButton: {
    pointerEvents: 'none',
  },
}));

const ShowsComp = () => {
  let classes = useStyles();
  const { shows, setUpdateShowsList } = useContext(ShowsContext);
  const { members } = useContext(MembersContext);
  const { loggedInUser } = useContext(LoggedInUserContext);
  const [ searchText, setSearchText ] = useState('');
  const [ showSubsMap, setShowSubsMap ] = useState(new Map()); 
  let { showName } = useParams();

  useEffect(() => {
    const initShowsComponent = async () => {
      await setUpdateShowsList(true);
      initShowsSubsMap();
  
      if(showName){
        setSearchText(showName);
      }
    }

    initShowsComponent();
  }, []);

  const initShowsSubsMap = async() => {
    let map = new Map();
    let subsArr = await CinemaApi.invoke('getSubscriptions');

    if(!subsArr || subsArr.length === 0){
      setShowSubsMap(map);
      return;
    }

    shows.forEach(show => {
      let showSubsArr = [];
      subsArr.forEach(subscriberItem => {
          var subShowItem = subscriberItem.shows?.find(subShow => subShow.showID ===  show.showID);
          if (subShowItem)
          {
            showSubsArr.push({
              subscriberId : subscriberItem.memberID,
              subscriberName : members.filter(member => member._id === subscriberItem.memberID)[0].name,
              subscriptionDate : subShowItem.date
            })
          }
      })
      map[show.showID] = showSubsArr;
    });
    await setShowSubsMap(map);
  }

  const canEditShow = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Update Shows');
  };

  const canDeleteShow = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Delete Shows');
  };

  const canAddShow = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Create Shows');
  };

  const getShows = () => {
    if (searchText.length === 0) {
      return shows;
    } else {
      return shows.filter((show) => {
        let showNameLC = show.name.toLowerCase();
        let searchTextLC = searchText.toLowerCase();
        return showNameLC.includes(searchTextLC);
      });
    }
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <SectionTitleComp titleText={'Shows'} />{' '}
      </Grid>

      <Grid item>
        <div>
          <Link
            to="/main/shows/add"
            className={canAddShow() ? '' : classes.disabledButton}
          >
            <Button
              variant="contained"
              color="primary"
              style={{ padding: 3, margin: 1 }}
              disabled={!canAddShow()}
            >
              Add Show
            </Button>
          </Link>
        </div>
      </Grid>

      {/* <br />

      <Grid item>
        <SearchBar
          value={searchText}
          onChange={(newValue) => setSearchText(newValue)}
          onRequestSearch={searchShows}
        />
      </Grid> */}

      <br/>

      <Grid item>
        <TextField
          value={searchText}
          label="Search"
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <br />

      <Grid item>
        <Grid container spacing={5}>
          {getShows().map((showData) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={showData.showID}>
                  <ShowCardComp
                    data={showData}
                    subscribers={showSubsMap[showData.showID]}
                    canEditShowCBF={canEditShow}
                    canDeleteShowCBF={canDeleteShow}
                  />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShowsComp;
