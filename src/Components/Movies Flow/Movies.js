import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import { MoviesContext } from '../../Context/MoviesContext';
import SectionTitleComp from '../General/SectionTitle';
import MovieCardComp from './MovieCard';
import UserPermissionUtil from '../General/UserPermissionsUtil';
import { LoggedInUserContext } from '../../Context/LoggedInUserContext';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import FirebaseApi from '../../Api Utils/FireBaseApi';
import { MembersContext } from '../../Context/MembersContext';

const useStyles = makeStyles((theme) => ({
  disabledButton: {
    pointerEvents: 'none',
  },
}));

const MoviesComp = () => {
  let classes = useStyles();
  const { movies, setUpdateMoviesList } = useContext(MoviesContext);
  const { members } = useContext(MembersContext);
  const { loggedInUser } = useContext(LoggedInUserContext);
  const [ searchText, setSearchText ] = useState('');
  const [ movieSubsMap, setMovieSubsMap ] = useState(new Map()); 
  let { movieName } = useParams();

  useEffect(() => {
    setUpdateMoviesList(true);
    initMoviesSubsMap();

    if(movieName){
      setSearchText(movieName)
    }
    
  }, []);

  const initMoviesSubsMap = async() => {
    let map = new Map();
    let subsArr = await FirebaseApi.getAllSubscriptions();

    if(!subsArr || subsArr.length === 0){
      setMovieSubsMap(map);
      return;
    }

    movies.forEach(movie => {
      let movieSubsArr = [];
      subsArr.forEach(subscriberItem => {
          //let arr = subscriberItem.movies.filter(subMovie => subMovie.id ===  movie.id);
          var subMovieItem = subscriberItem.movies?.find(subMovie => subMovie.id ===  movie.id);
          if (subMovieItem)
          {
            movieSubsArr.push({
              subscriberId : subscriberItem.memberId,
              subscriberName : members.filter(member => member.id === subscriberItem.memberId)[0].name,
              subscriptionDate : subMovieItem.date
            })
          }
      })
      map[movie.showID] = movieSubsArr;
      setMovieSubsMap(map);
    });
  }

  const canEditMovie = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Update Movies');
  };

  const canDeleteMovie = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Delete Movies');
  };

  const canAddMovie = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Create Movies');
  };

  const getMovies = () => {
    if (searchText.length === 0) {
      return movies;
    } else {
      return movies.filter((movie) => {
        let movieNameLC = movie.name.toLowerCase();
        let searchTextLC = searchText.toLowerCase();
        return movieNameLC.includes(searchTextLC);
      });
    }
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <SectionTitleComp titleText={'Movies'} />{' '}
      </Grid>

      <Grid item>
        <div>
          <Link
            to="/main/movies/add"
            className={canAddMovie() ? '' : classes.disabledButton}
          >
            <Button
              variant="contained"
              color="primary"
              style={{ padding: 3, margin: 1 }}
              disabled={!canAddMovie()}
            >
              Add Movie
            </Button>
          </Link>
        </div>
      </Grid>

      {/* <br />

      <Grid item>
        <SearchBar
          value={searchText}
          onChange={(newValue) => setSearchText(newValue)}
          onRequestSearch={searchMovies}
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
          {getMovies().map((movieData) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={movieData.showID}>
                  <MovieCardComp
                    data={movieData}
                    subscribers={movieSubsMap[movieData.id]}
                    canEditMovieCBF={canEditMovie}
                    canDeleteMovieCBF={canDeleteMovie}
                  />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MoviesComp;
