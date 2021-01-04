import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MembersComp from './Members';
import AddNewMemberComp from './AddNewMember'
import EditMemberComp from './EditMember';

const SubscribersMainComp = () => {
    return (
        <Switch>
            <Route path="/main/members" exact component={MembersComp}></Route>
            <Route path="/main/members/add" component={AddNewMemberComp}></Route>
            <Route path="/main/members/edit" component={EditMemberComp}></Route>
        </Switch>
    );
};

export default SubscribersMainComp;