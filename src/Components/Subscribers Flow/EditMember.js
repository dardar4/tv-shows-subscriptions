import React, { useContext } from 'react';
import { MembersContext } from '../../Context/MembersContext';
import CinemaApi from '../../Api Utils/CinemaApi';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Box, Button, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import SectionTitleComp from '../General/SectionTitle';


const EditMemberComp = (props) => {
  const { memberToEdit, setUpdateMembersList } = useContext(MembersContext);

  const editMemberData = async (values) => {
    /* Update the member item */
    if (
        memberToEdit.name !== values.name ||
        memberToEdit.image !== values.email ||
        memberToEdit.premiered !== values.city) {

      let updatedMemberData = {
        name: values.name,
        email: values.email,
        city: values.city,
      };
      await CinemaApi.invoke('updateMember',  memberToEdit._id, updatedMemberData);
    }

    /* Navigate back to all movies display */
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
      <SectionTitleComp titleText={`Edit Member: ${memberToEdit.name}`} />

      <Formik
        initialValues={{
          name: memberToEdit.name,
          email: memberToEdit.email,
          city: memberToEdit.city,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          email: Yup.string().email('email is not valid').required('Required'),
        })}
        onSubmit={(values) => {
            editMemberData(values);
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

export default EditMemberComp;
