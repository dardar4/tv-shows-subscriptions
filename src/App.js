import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateAccountComp from './Components/Login Flow/CreateAccount';
import LoginPageComp from './Components/Login Flow/LoginPage';
import MainPageComp from './Components/General/MainPage';
import UsersApi from './Api Utils/UsersApi';
import MoviesApi from './Api Utils/MoviesApi';
import FirebaseApi from './Api Utils/FireBaseApi';
import { firebase } from './firebaseConfig';
import CssBaseline from '@material-ui/core/CssBaseline';
import LoggedInUserContextProvider from './Context/LoggedInUserContext';
import UsersContextProvider from './Context/UsersContext';
import TabsContextProvider from './Context/TabsContext';
import MoviesContextProvider from './Context/MoviesContext';
import MembersContextProvider from './Context/MembersContext';
import IdleTimerContainer from './IdleTimerUtil/idleTimerContainer';
import ToastWrapperComp from './Components/General/ToastWrapper';
import ToastContextProvider from './Context/ToastContext';

function App() {
  useEffect(() => {
    const writeMembersToDB = async () => {
      let users_p = await UsersApi.getAllUsers();
      if (users_p.data) {
        users_p.data.forEach((user) => {
          FirebaseApi.addDocument(
            'members',
            {
              id: user.id,
              name: user.name,
              email: user.email,
              city: user.address.city,
            },
            true
          );
        });
      } else {
        console.log('failed to retrieve members from external api');
      }
    };

    const writeMoviesToDB = async () => {
      let movies_p = await MoviesApi.getAllMovies();
      if (movies_p.data) {
        /* todo: delete this code*/
        let moviesArr = movies_p.data.filter((m) => m.id < 20);
        /* end todo: delete this code*/

        moviesArr.forEach((movie) => {
          FirebaseApi.addDocument(
            'movies',
            {
              id: movie.id,
              name: movie.name,
              image: movie.image.medium,
              premiered: firebase.firestore.Timestamp.fromDate(
                new Date(movie.premiered)
              ),
              genres: movie.genres,
            },
            true
          );
        });
      } else {
        console.log('failed to retrieve members from external api');
      }
    };

    const UpdateMovies = async () => {
      let shouldUpdate = await FirebaseApi.shouldUpdateCollection('movies');
      if (shouldUpdate) {
        writeMoviesToDB();
      }
    };

    const UpdateMembers = async () => {
      let shouldUpdate = await FirebaseApi.shouldUpdateCollection('members');
      if (shouldUpdate) {
        writeMembersToDB();
      }
    };

    UpdateMovies();
    UpdateMembers();
  }, []);

  return (
    <BrowserRouter>
      <TabsContextProvider>
        <LoggedInUserContextProvider>
          <UsersContextProvider>
            <MoviesContextProvider>
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
            </MoviesContextProvider>
          </UsersContextProvider>
        </LoggedInUserContextProvider>
      </TabsContextProvider>
    </BrowserRouter>
  );
}

export default App;
