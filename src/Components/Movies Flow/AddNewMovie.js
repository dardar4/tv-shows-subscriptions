import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MoviesContext } from '../../Context/MoviesContext';
import FirebaseApi from '../../Api Utils/FireBaseApi';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Box, Button, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import SectionTitleComp from '../General/SectionTitle';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker, KeyboardDatePicker } from 'formik-material-ui-pickers';

const parseGenres = (genresStr) => {
  return genresStr.split(',').filter((g) => g != '');
};

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const AddNewMovieComp = (props) => {
  const { setUpdateMoviesList } = useContext(MoviesContext);

  const addNewMovie = async (values) => {
    /* Add new movie record */
    let movieDoc = {
      id: uuidv4(),
      name: values.name,
      image: values.imageUrl,
      premiered: new Date(values.premiered.toDateString()),
      genres: parseGenres(values.genres),
    };
    await FirebaseApi.addDocument('movies', movieDoc, true);

    /* Navigate back to all users display */
    setTimeout(() => {
      setUpdateMoviesList(true);
      backToMoviesList();
    }, 500);
  };

  const backToMoviesList = () => {
    props.history.push('/main/movies');
  };

  return (
    <Grid container direction="column" alignItems="center">
      <SectionTitleComp titleText={`Add Movie Form`} />

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
          addNewMovie(values);
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
                  helperText="select the movie premier date"
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
                  onClick={backToMoviesList}
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

export default AddNewMovieComp;
