import React, { useContext } from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import CinemaApi from '../../Api Utils/CinemaApi';
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

    // setup permission array
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

    // Check if any field was changes (avoid updating id not needed)
    const needToUpdateUser = 
      userToEdit.firstName !== values.firstName ||
      userToEdit.lastName !== values.lastName ||
      userToEdit.sessionTimeOut !== values.sessionTimeOut ||
      !arraysEqual(values.permissions, userToEdit.permissions) ;

    if (needToUpdateUser) {
      let updatedUserData = {
        id: userToEdit.id,
        firstName: values.firstName,
        lastName: values.lastName,
        sessionTimeOut: values.sessionTO,
        permissions : values.permissions

      };
      await CinemaApi.invoke('updateUser', updatedUserData);
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
          sessionTO: userToEdit.sessionTimeOut,
          createdDate: userToEdit.createdDate,
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
                name="createdDate"
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
                    value="Delete Shows"
                    classes={{ selected: classes.selected }}
                  >
                    Delete Shows
                  </MenuItem>
                  <MenuItem
                    value="Update Shows"
                    classes={{ selected: classes.selected }}
                  >
                    Update Shows
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
