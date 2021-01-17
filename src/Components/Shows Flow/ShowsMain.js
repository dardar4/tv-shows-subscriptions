import React from 'react';

import { Route, Switch } from 'react-router-dom';
import ShowsComp from './Shows';
import AddNewShowComp from './AddNewShow'
import EditShowComp from './EditShow';

const ShowsMainComp = () => {
    return (
        <Switch>
            <Route path="/main/shows" exact component={ShowsComp}></Route>
            <Route path="/main/shows/add" component={AddNewShowComp}></Route>
            <Route path="/main/shows/edit" component={EditShowComp}></Route>
            <Route path="/main/shows/:showName" component={ShowsComp}></Route>
        </Switch>
    );
};

export default ShowsMainComp;