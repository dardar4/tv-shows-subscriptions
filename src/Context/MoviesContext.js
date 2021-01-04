import React, { createContext, useEffect, useState } from 'react';
import FirebaseApi from '../Api Utils/FireBaseApi';

export const MoviesContext = createContext();

const MoviesContextProvider = (props) => {
  const [movies, setMovies] = useState([]);
  const [updateMoviesList, setUpdateMoviesList] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState({})
  const [displayMode, setDisplayMode] = useState('movies');

  useEffect(() => {
    const getAllMoviesData = async () => {
      const moviesDataArr = await FirebaseApi.getAllMoviesData();
      //const moviesDataArr = await FirebaseApi.getDummyAllMoviesData();
      setMovies(moviesDataArr);
      setUpdateMoviesList(false);
    };

    if(updateMoviesList){
      getAllMoviesData();
    }
    
  }, [updateMoviesList]);

  return (
    <MoviesContext.Provider 
        value={{
          movies, 
          setUpdateMoviesList, 
          movieToEdit, 
          setMovieToEdit, 
          displayMode, 
          setDisplayMode}}>
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
