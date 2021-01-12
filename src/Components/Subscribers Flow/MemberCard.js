import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MembersContext } from '../../Context/MembersContext';
import FirebaseApi from '../../Api Utils/FireBaseApi';
import CinemaApi from '../../Api Utils/CinemaApi';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { MoviesContext } from '../../Context/MoviesContext';
import Autocomplete from '@material-ui/lab/Autocomplete';

const MemberCardComp = ({ data, canDeleteMemberCBF, canEditMemberCBF, canViewMoviesCBF }) => {
  const { setMemberToEdit, setUpdateMembersList } = useContext(MembersContext);
  const { movies, setUpdateMoviesList } = useContext(MoviesContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState('');
  let history = useHistory();

  const deleteMember = async () => {
    await CinemaApi.invoke('deleteMember', data._id); 
    setUpdateMembersList(true);
  };

  const editMember = () => {
    setMemberToEdit(data);
    history.push('/main/members/edit');
  };

  const openSubscribeNewMovieDialog = () => {
    if (movies?.length == 0) {
      // "load" the movies to the context in case it wasn't done before
      setUpdateMoviesList(true);
    }

    setOpenDialog(true);
  };

  const subscribeNewMovie = async() => {
    /* find movie id from movie name*/
    let movieId = movies.filter(
      (movie) => movie.name.toLowerCase() === selectedMovie.toLowerCase()
    )[0].id;


    if (selectedDate === null) {
      await setSelectedDate(new Date());
    }

    /* update new movie subscriptions in the DB */
    FirebaseApi.subscribeNewMovie(
      data.id,
      selectedMovie,
      movieId,
      (selectedDate === null) ? new Date() : selectedDate
    );

    setUpdateMembersList(true);
    handleClose();
  };

  const handleClose = () => {
    setSelectedMovie('');
    setSelectedDate(null);
    setOpenDialog(false);
  };

  const getUnseenMovies = () => {
    //no movies - nothing to return
    if (movies?.length === 0) return [];

    //
    let allMoviesName = movies.map((movie) => movie.name);
    if (!data.moviesSubscriptions ||  data.moviesSubscriptions.length == 0) {
      /* Return all movies */
      return allMoviesName;
    }

    /* Return only movies that the member didn't watch yet */
    let seenMoviesName = data.moviesSubscriptions.map((movie) => movie.name);
    let unseenMovies = allMoviesName.filter((movieName) => {
      return !seenMoviesName.includes(movieName);
    });

    return unseenMovies;
  };

  const buildMovieUrl = (movieName) => {
    if(canViewMoviesCBF()){
      return `/main/movies/${movieName}`;
    }
    else{
      // user is not allowed to view movies - make a broken link
      return "#";
    }
  };

  const getFutureMovies = () => {
    if(!data.moviesSubscriptions){
      return [];
    }

    let futureSubscriptions = data.moviesSubscriptions?.filter((ms) => {
      return ms.date >= new Date();
    });

    return futureSubscriptions.map((ms) => {
      return (
        <li key={ms.id}>
          <Link to={buildMovieUrl(ms.name)}>{ms.name}</Link>,{' '}
          {ms.date.toLocaleDateString()}
        </li>
      );
    });
  };

  const getPastMovies = () => {
    if(!data.moviesSubscriptions){
      return [];
    }

    let pastSubscriptions = data.moviesSubscriptions?.filter((ms) => {
      return ms.date < new Date();
    });

    return pastSubscriptions.map((ms) => {
      return (
        <li key={ms.id}>
          <Link to={buildMovieUrl(ms.name)}>{ms.name}</Link>,{' '}
          {ms.date.toLocaleDateString()}
        </li>
      );
    });
  };

  return (
    <div
      style={{
        margin: '3px',
        width: '100%',
        border: '2px solid blue',
        borderLeftColor: 'red',
      }}
    >
      <label>ID: </label>
      {data._id} <br />
      <label>Name: </label>
      {data.name} <br />
      <label>Email: </label>
      {data.email} <br />
      <label>City: </label>
      {data.city} <br />
      <br />
      <div
        style={{
          margin: '3px',
          width: '100%',
          border: '2px solid green',
        }}
      >
        <h5>Movies Watched</h5>
        <button onClick={openSubscribeNewMovieDialog}>
          Subscribe to a new movie
        </button>
        <br /> <br />
        <h6>Seen movies:</h6>
        <ul>{getPastMovies()}</ul>
        <h6>Future movies:</h6>
        <ul>{getFutureMovies()}</ul>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Subscribe to a new movie</DialogTitle>
        <DialogContent>
          <Autocomplete
            value={selectedMovie}
            onChange={(event, newValue) => {
              setSelectedMovie(newValue);
            }}
            options={getUnseenMovies()}
            renderInput={(params) => <TextField {...params} />}
          />
          <br />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              onChange={(value) => setSelectedDate(value)}
              format="MM/dd/yyyy"
              helperText="some helper text"
              variant="outlined"
              inputVariant="outlined"
              disablePast
            ></KeyboardDatePicker>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={subscribeNewMovie} color="primary">
            Subscribe
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={editMember}
        variant="contained"
        color="primary"
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: 3,
          margin: 1,
        }}
        disabled={!canEditMemberCBF()}
      >
        Edit
      </Button>
      <Button
        onClick={deleteMember}
        variant="contained"
        color="primary"
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: 3,
          margin: 1,
        }}
        disabled={!canDeleteMemberCBF()}
      >
        Delete
      </Button>
    </div>
  );
};

export default MemberCardComp;
