import React, { useContext } from 'react';
import { UsersContext } from '../../Context/UsersContext';
import CinemaApi from '../../Api Utils/CinemaApi'
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
} from '@material-ui/core';
import { Select, TextField } from 'formik-material-ui';
import SectionTitleComp from '../General/SectionTitle';

const useStyles = makeStyles(() => ({
  selected: {
    backgroundColor: 'turquoise !important',
    color: 'white',
    fontWeight: 600,
  },
}));

Yup.addMethod(Yup.array, 'notEmpty', function (message) {
  return this.test('notEmpty', message, function (arr) {
    return Boolean(arr.length > 0);
  });
});

const AddNewUserComp = (props) => {
  const classes = useStyles();

  const { setUpdateUsersList } = useContext(UsersContext);

  const addNewUser = async (values) => {
    // Handle permission input
    if (!values.permissions.includes('View Subscriptions')) {
      if (
        values.permissions.includes('Create Subscriptions') ||
        values.permissions.includes('Delete Subscriptions') ||
        values.permissions.includes('Update Subscriptions')
      ) {
        values.permissions.push('View Subscriptions');
      }
    }

    if (!values.permissions.includes('View Shows')) {
      if (
        values.permissions.includes('Create Shows') ||
        values.permissions.includes('Delete Shows') ||
        values.permissions.includes('Update Shows')
      ) {
        values.permissions.push('View Shows');
      }
    }

    /* Add new user record */
    const newUserData = {
      firstName: values.firstName,
      lastName: values.lastName,
      sessionTimeOut: values.sessionTO,
      permissions: values.permissions,
      userName: values.userName
    }

    const addedUserData = await CinemaApi.invoke('addUser', newUserData);
    if(!addedUserData){
      console.error('error adding a new user')
    }
    
    /* Navigate back to all users display */
    setTimeout(() => {
      setUpdateUsersList(true);
      backToUsersList();
    }, 500);
  };

  const backToUsersList = () => {
    props.history.push('/main/users');
  };

  return (
    <Grid container direction="column" alignItems="center">
      <SectionTitleComp titleText={`New User Form`} />

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          userName: '',
          sessionTO: 60,
          permissions: [],
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required'),
          userName: Yup.string()
          .matches(/^(?!(admin|Admin)\b)/, `can't use admin as a user name`)
          .required('Required'),
          sessionTO: Yup.number()
            .min(1, 'Time out must be over or equal 5 minutes')
            .required('Required'),
          permissions: Yup.array().required(
            'Please select one or more permission(s)'
          ),
        })}
        onSubmit={(values) => {
          addNewUser(values);
        }}
      >
        {({ submitForm, isSubmitting, touched, errors }) => (
          <Form>
            <Box margin={1}>
              <Field
                component={TextField}
                name="firstName"
                type="text"
                label="First Name"
                style={{ width: 200 }}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="lastName"
                type="text"
                label="Last Name"
                style={{ width: 200 }}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="userName"
                type="text"
                label="User Name"
                style={{ width: 200 }}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="sessionTO"
                type="number"
                label="Session Time Out"
                style={{ width: 200 }}
                required
              />
            </Box>

            <Box margin={1}>
              <FormControl>
                <InputLabel shrink={true}>Permissions</InputLabel>
                <Field
                  component={Select}
                  type="text"
                  name="permissions"
                  multiple={true}
                  style={{ maxWidth: 400, minWidth: 200 }}
                >
                  <MenuItem
                    value="View Subscriptions"
                    classes={{ selected: classes.selected }}
                  >
                    View Subscriptions
                  </MenuItem>
                  <MenuItem
                    value="Create Subscriptions"
                    classes={{ selected: classes.selected }}
                  >
                    Create Subscriptions
                  </MenuItem>
                  <MenuItem
                    value="Update Subscriptions"
                    classes={{ selected: classes.selected }}
                  >
                    Update Subscriptions
                  </MenuItem>
                  <MenuItem
                    value="Delete Subscriptions"
                    classes={{ selected: classes.selected }}
                  >
                    Delete Subscriptions
                  </MenuItem>
                  <MenuItem
                    value="View Shows"
                    classes={{ selected: classes.selected }}
                  >
                    View Shows
                  </MenuItem>
                  <MenuItem
                    value="Create Shows"
                    classes={{ selected: classes.selected }}
                  >
                    Create Shows
                  </MenuItem>
                  <MenuItem
                    value="Update Shows"
                    classes={{ selected: classes.selected }}
                  >
                    Update Shows
                  </MenuItem>
                  <MenuItem
                    value="Delete Shows"
                    classes={{ selected: classes.selected }}
                  >
                    Delete Shows
                  </MenuItem>
                </Field>
              </FormControl>
            </Box>
            {touched.permissions && (
              <FormHelperText error={errors.permissions}>
                {errors.permissions}
              </FormHelperText>
            )}

            <Box margin={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Save
              </Button>

              <Button
                variant="contained"
                onClick={backToUsersList}
                color="secondary"
                style={{ marginLeft: '10px' }}
              >
                Back
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default AddNewUserComp;
