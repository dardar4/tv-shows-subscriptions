import React, { useContext } from 'react';
import { firestoreDB } from '../../firebaseConfig'
import CinemaApi from '../../Api Utils/CinemaApi';
import HeaderComp from '../General/Header';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { Box, Button, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/styles';
import { ToastContext } from '../../Context/ToastContext';


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems : 'center'
  },
  gridItem: {
    alignSelf: "stretch"
  },
}));

const CreateAccountComp = (props) => {
  const notificationTimeOut = 3000;
  const { setToastProps } = useContext(ToastContext)
  const classes = useStyles();

  const wrongUserNameNotification = () =>
    toast.error(`Wrong user name 😞. please contact site admin`);

  const updatePasswordSuccessNotification = () =>
    toast.success(`Password was updated and account is ready to use 😎`);

  const createAccount = async (userName, newPassword) => {
      const response = CinemaApi.invoke('createAccount', userName, newPassword);

      if (response) {
        // Show success notification
        setToastProps({
          autoClose : notificationTimeOut
        })
        updatePasswordSuccessNotification();

        // redirect back to login page
        setTimeout(() => {
          props.history.push('/');
        }, notificationTimeOut + 300);
      } else {
        console.warn(`Username=${userName} not found in the DB`);
        setToastProps({
          autoClose : notificationTimeOut
        })
        wrongUserNameNotification();
      }
  };

  const backToLoginPage = () => {
    props.history.push('/');
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.gridContainer} >
        <Grid item style={{ width: "100%"}}>
          <HeaderComp/>
        </Grid>
        <Grid item> 
          <h2>Create An Account</h2>
        </Grid>
        <Grid item>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={Yup.object({
              //username: Yup.string().matches(/^admin/, 'cant use admin as a user name').required('Required'),
              username: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
              /* .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{4,})/,
              'Must contain at least 4 characters, one Uppercase, one lowercase and one number'
            ),*/
            })}
            onSubmit={async (values, { setSubmitting }) => {
              await createAccount(values.username, values.password);
              setSubmitting(false)
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
                    helperText="enter the user name given by admin"
                  />
                </Box>

                <Box margin={1}>
                  <Field
                    component={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    helperText="enter a valid password"
                  />
                </Box>

                <Box margin={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Create Account
                  </Button>
                </Box>

                <Box margin={1}>
                  <Button variant="contained" onClick={backToLoginPage}>
                    Back
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateAccountComp;
