import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateAccountComp from './Components/Login Flow/CreateAccount';
import LoginPageComp from './Components/Login Flow/LoginPage';
import MainPageComp from './Components/General/MainPage';
import CssBaseline from '@material-ui/core/CssBaseline';
import LoggedInUserContextProvider from './Context/LoggedInUserContext';
import UsersContextProvider from './Context/UsersContext';
import TabsContextProvider from './Context/TabsContext';
import ShowsContextProvider from './Context/ShowsContext';
import MembersContextProvider from './Context/MembersContext';
import IdleTimerContainer from './IdleTimerUtil/idleTimerContainer';
import ToastWrapperComp from './Components/General/ToastWrapper';
import ToastContextProvider from './Context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <TabsContextProvider>
        <LoggedInUserContextProvider>
          <UsersContextProvider>
            <ShowsContextProvider>
              <MembersContextProvider>
                <CssBaseline />
                <ToastContextProvider>
                  <IdleTimerContainer />
                  <ToastWrapperComp />
                  <div>
                    <Switch>
                      <Route path="/" exact component={LoginPageComp} />
                      <Route
                        path="/createAccount"
                        component={CreateAccountComp}
                      />
                      <Route path="/main" component={MainPageComp} />
                    </Switch>
                  </div>
                </ToastContextProvider>
              </MembersContextProvider>
            </ShowsContextProvider>
          </UsersContextProvider>
        </LoggedInUserContextProvider>
      </TabsContextProvider>
    </BrowserRouter>
  );
}

export default App;
