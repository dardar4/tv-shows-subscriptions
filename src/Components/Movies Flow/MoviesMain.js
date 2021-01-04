import React from 'react';

import { Route, Switch } from 'react-router-dom';
import MoviesComp from './Movies';
import AddNewMovieComp from './AddNewMovie'
import EditMovieComp from './EditMovie';

const MoviesMainComp = () => {
    return (
        <Switch>
            <Route path="/main/movies" exact component={MoviesComp}></Route>
            <Route path="/main/movies/:movieName" component={MoviesComp}></Route>
            <Route path="/main/movies/add" component={AddNewMovieComp}></Route>
            <Route path="/main/movies/edit" component={EditMovieComp}></Route>
        </Switch>
    );
};

export default MoviesMainComp;