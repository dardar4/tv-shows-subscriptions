import React, { useContext } from 'react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';

import FirebaseApi from '../../Api Utils/FireBaseApi';

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Typography,
} from '@material-ui/core';
import { Select, TextField } from 'formik-material-ui';
import { UsersContext } from '../../Context/UsersContext';
import SectionTitleComp from '../General/SectionTitle';

const useStyles = makeStyles(() => ({
  root: {
    width: '300px',
  },
  selected: {
    backgroundColor: 'turquoise !important',
    color: 'white',
    fontWeight: 600,
  },
}));


function arraysEqual(arr1, arr2) {
  /* WARNING: arrays must not contain {objects} or behavior may be undefined */
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const EditUserComp = (props) => {
  const classes = useStyles();

  const { userToEdit, setUpdateUsersList } = useContext(UsersContext);

  const editUserData = async (values) => {
    /* Update the user document */
    if (
      userToEdit.firstName !== values.firstName ||
      userToEdit.lastName !== values.lastName ||
      userToEdit.sessionTO !== values.sessionTO
    ) {
      let updatedUserDoc = {
        id: userToEdit.id,
        firstName: values.firstName,
        lastName: values.lastName,
        sessionTimeOut: values.sessionTO,
      };
      await FirebaseApi.updateDocument('users', updatedUserDoc);
    }

    /* Update the userName */
    if (userToEdit.userName !== values.userName) {
      let updatedUserLoginDoc = {
        id: userToEdit.id,
        userName: values.userName,
      };
      await FirebaseApi.updateDocument('usersLogin', updatedUserLoginDoc);
    }

    /* Add new permission record */
    if (!values.permissions.includes('View Subscriptions')) {
      if (
        values.permissions.includes('Create Subscriptions') ||
        values.permissions.includes('Delete Subscriptions') ||
        values.permissions.includes('Update Subscriptions')
      ) {
        values.permissions.push('View Subscriptions');
      }
    }

    if (!values.permissions.includes('View Movies')) {
      if (
        values.permissions.includes('Create Movies') ||
        values.permissions.includes('Delete Movies') ||
        values.permissions.includes('Update Movies')
      ) {
        values.permissions.push('View Movies');
      }
    }

    if (!arraysEqual(values.permissions, userToEdit.permissions)) {
      let userPermissionDoc = {
        id: userToEdit.id,
        permissions: values.permissions,
      };
      await FirebaseApi.updateDocument('permissions', userPermissionDoc);
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

      <SectionTitleComp titleText={`Edit User: ${userToEdit.userName}`}/>

      <Formik
        initialValues={{
          firstName: userToEdit.firstName,
          lastName: userToEdit.lastName,
          userName: userToEdit.userName,
          sessionTO: userToEdit.sessionTO,
          createdAt: userToEdit.createdAt,
          permissions: userToEdit.permissions ? userToEdit.permissions : [],
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required'),
          sessionTO: Yup.number().min(5, 'Time out must be over or equal 5 minutes').required('Required'),
          permissions : Yup.array().required('Please select one or more permission(s)')
        })}
        onSubmit={(values) => {
          editUserData(values);
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
                style={{width: 200}}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="lastName"
                type="text"
                label="Last Name"
                style={{width: 200}}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="userName"
                type="text"
                label="User Name"
                style={{width: 200}}
                disabled
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="sessionTO"
                type="number"
                label="Session Time Out"
                style={{width: 200}}
                required
              />
            </Box>

            <Box margin={1} width={1}>
              <Field
                component={TextField}
                disabled
                name="createdAt"
                type="text"
                label="Created Date"
                style={{width: 200}}
              />
            </Box>

            <Box margin={1}>
              <FormControl>
                <InputLabel shrink={true} htmlFor="permissions">
                  Permissions
                </InputLabel>
                <Field
                  component={Select}
                  type="text"
                  name="permissions"
                  multiple
                  style={{maxWidth: 400, minWidth:200}}
                  inputProps={{ id: 'permissions', name: 'permissions' }}
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
                    value="Delete Subscriptions"
                    classes={{ selected: classes.selected }}
                  >
                    Delete Subscriptions
                  </MenuItem>
                  <MenuItem
                    value="Update Subscriptions"
                    classes={{ selected: classes.selected }}
                  >
                    Update Subscriptions
                  </MenuItem>
                  <MenuItem
                    value="View Movies"
                    classes={{ selected: classes.selected }}
                  >
                    View Movies
                  </MenuItem>
                  <MenuItem
                    value="Create Movies"
                    classes={{ selected: classes.selected }}
                  >
                    Create Movies
                  </MenuItem>
                  <MenuItem
                    value="Delete Movies"
                    classes={{ selected: classes.selected }}
                  >
                    Delete Movies
                  </MenuItem>
                  <MenuItem
                    value="Update Movies"
                    classes={{ selected: classes.selected }}
                  >
                    Update Movies
                  </MenuItem>
                </Field>
              </FormControl>
            </Box>
            { touched.permissions &&  <FormHelperText error={errors.permissions}>{errors.permissions}</FormHelperText> }

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
                style={{marginLeft : '10px'}}
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

export default EditUserComp;
