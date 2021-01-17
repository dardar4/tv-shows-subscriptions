import React, { createContext, useEffect, useState } from 'react';
import CinemaApi from '../Api Utils/CinemaApi';

export const ShowsContext = createContext();

const ShowsContextProvider = (props) => {
  const [shows, setShows] = useState([]);
  const [updateShowsList, setUpdateShowsList] = useState(false);
  const [showToEdit, setShowToEdit] = useState({})
  const [displayMode, setDisplayMode] = useState('shows');

  useEffect(() => {
    const getAllShowsData = async () => {
      const showsDataArr = await CinemaApi.invoke('getShows');

      setShows(showsDataArr ?? []);
      setUpdateShowsList(false);
    };

    if(updateShowsList){
      getAllShowsData();
    }
    
  }, [updateShowsList]);

  return (
    <ShowsContext.Provider 
        value={{
          shows, 
          setUpdateShowsList, 
          showToEdit, 
          setShowToEdit, 
          displayMode, 
          setDisplayMode}}>
      {props.children}
    </ShowsContext.Provider>
  );
};

export default ShowsContextProvider;
