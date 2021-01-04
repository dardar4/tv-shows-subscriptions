import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { firestoreDB } from '../../firebaseConfig';
import FireBaseApi from '../../Api Utils/FireBaseApi';
import { toast } from 'react-toastify';
import HeaderComp from '../General/Header';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { LoggedInUserContext } from '../../Context/LoggedInUserContext';
import { ToastContext } from '../../Context/ToastContext';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    alignSelf: 'stretch',
  },
}));

const wrongUserNameOrPasswordNotification = () =>
toast.error(
  `Wrong user name or password 😞. please try again or contact site admin`
);

const LoginPageComp = (props) => {
  const { dispatch } = useContext(LoggedInUserContext);
  const { setToastProps } = useContext(ToastContext)
  const classes = useStyles();

  const Login = async (userName, password) => {
    // Check if userName and password are valid in the DB
    let loginUserData = await FireBaseApi.getLoginUser(userName, password);

    if (loginUserData) {
      dispatch({
        type: 'LOGIN',
        user : {
          ...loginUserData,
          loginAt : new Date()
        }
      });
      props.history.push('/main');
    } else {
      dispatch({ type: 'LOGOUT' });
      wrongUserNameOrPasswordNotification();
    }
  };

  return (
    <div>
      <Grid container className={classes.gridContainer}>
        <Grid item style={{ width: '100%' }}>
          <HeaderComp />
        </Grid>
        <Grid item>
          <h2>Log in page</h2>
        </Grid>
        <Grid item>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              await Login(values.username, values.password);
              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting, touched, errors }) => (
              <Form>
                <Box margin={1}>
                  <Field
                    component={TextField}
                    name="username"
                    type="text"
                    label="User Name"
                  />
                </Box>

                <Box margin={1}>
                  <Field
                    component={TextField}
                    name="password"
                    type="password"
                    label="Password"
                  />
                </Box>

                <Box margin={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Login
                  </Button>
                </Box>
                <span className="label label-danger">New User ?</span>
                <Link to="/createAccount">
                  <button type="button" className="btn btn-link">
                    Click Me
                  </button>
                </Link>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>

      
    </div>
  );
};

export default LoginPageComp;
