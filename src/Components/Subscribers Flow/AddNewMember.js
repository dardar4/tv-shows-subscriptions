import React, { useContext } from 'react';
import { MembersContext } from '../../Context/MembersContext';
import CinemaApi from '../../Api Utils/CinemaApi';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Box, Button, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import SectionTitleComp from '../General/SectionTitle';

const AddNewMemberComp = (props) => {
  const { setUpdateMembersList } = useContext(MembersContext);

  const addNewMember = async (values) => {
    /* add a member document */
    const memberData = {
      name: values.name,
      email: values.email,
      city: values.city,
    };
    await CinemaApi.invoke('addMember', memberData);

    /* Navigate back to all members display */
    setTimeout(() => {
      setUpdateMembersList(true);
      backToMembersList();
    }, 500);
  };

  const backToMembersList = () => {
    props.history.push('/main/members');
  };

  return (
    <Grid container direction="column" alignItems="center">
      <SectionTitleComp titleText={'Add New Member Form'} />

      <Formik
        initialValues={{
          name: '',
          email: '',
          city: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          email: Yup.string().email('email is not valid').required('Required'),
        })}
        onSubmit={(values) => {
          addNewMember(values);
        }}
      >
        {({ submitForm, isSubmitting, touched, errors }) => (
          <Form>
            <Box margin={1}>
              <Field
                component={TextField}
                name="name"
                type="text"
                label="Name"
                style={{ width: 200 }}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                style={{ width: 200 }}
                required
              />
            </Box>

            <Box margin={1}>
              <Field
                component={TextField}
                name="city"
                type="text"
                label="City"
                style={{ width: 200 }}
              />
            </Box>

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
                onClick={backToMembersList}
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

export default AddNewMemberComp;
