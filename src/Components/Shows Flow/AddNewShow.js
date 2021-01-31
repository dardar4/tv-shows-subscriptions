import React, { useContext } from 'react';
import { ShowsContext } from '../../Context/ShowsContext';
import CinemaApi from '../../Api Utils/CinemaApi';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Box, Button, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import SectionTitleComp from '../General/SectionTitle';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';

const parseGenres = (genresStr) => {
  return genresStr.split(',').filter((g) => g !== '');
};

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const AddNewShowComp = (props) => {
  const { setUpdateShowsList } = useContext(ShowsContext);

  const addNewShow = async (values) => {
    /* Add new show record */
    let showDoc = {
      name: values.name,
      imageURL: values.imageUrl,
      premiered: new Date(values.premiered.toDateString()),
      genres: parseGenres(values.genres),
    };
    await CinemaApi.invoke('addShow', showDoc, true);

    /* Navigate back to all users display */
    setTimeout(() => {
      setUpdateShowsList(true);
      backToShowsList();
    }, 500);
  };

  const backToShowsList = () => {
    props.history.push('/main/shows');
  };

  return (
    <Grid container direction="column" alignItems="center">
      <SectionTitleComp titleText={`Add Show Form`} />

      <Formik
        initialValues={{
          name: '',
          genres: '',
          imageUrl: '',
          premiered: new Date(),
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          imageUrl: Yup.string()
            .trim()
            .matches(urlRegex, 'Is not in correct format'),
        })}
        onSubmit={(values) => {
          addNewShow(values);
        }}
      >
        {({ submitForm, isSubmitting, touched, errors }) => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                  name="genres"
                  type="text"
                  label="Genres"
                  style={{ width: 200 }}
                  helperText="enter genres separated by ',' "
                />
              </Box>

              <Box margin={1}>
                <Field
                  component={TextField}
                  name="imageUrl"
                  type="text"
                  label="Image Url"
                  style={{ width: 200 }}
                />
              </Box>
                
              <Box margin={1}>
                <Field
                  style={{ width: 200, marginTop: 30 }}
                  component={KeyboardDatePicker}
                  name="premiered"
                  label="Premiered"
                  autoOk
                  variant="outlined"
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  helperText="select the show premier date"
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
                  onClick={backToShowsList}
                  color="secondary"
                  style={{marginLeft : '10px'}}
                >
                  Back
                </Button>
              </Box>

              <Box margin={1}>

              </Box>
            </Form>
          </MuiPickersUtilsProvider>
        )}
      </Formik>
    </Grid>
  );
};

export default AddNewShowComp;
