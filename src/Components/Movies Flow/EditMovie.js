import React, { useContext } from 'react';
import { MoviesContext } from '../../Context/MoviesContext';
import CinemaApi from '../../Api Utils/CinemaApi';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Box, Button, Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import SectionTitleComp from '../General/SectionTitle';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';

function arraysEqual(arr1, arr2) {
  /* WARNING: arrays must not contain {objects} or behavior may be undefined */
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const parseGenres = (genresStr) => {
  return genresStr.split(',').filter((g) => g !== '');
};

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const EditMovieComp = (props) => {
  const { movieToEdit, setUpdateMoviesList } = useContext(MoviesContext);

  const editMovieData = async (values) => {
    let genresArr = parseGenres(values.genres);

    /* Update the movie document */
    if (
      movieToEdit.name !== values.name ||
      movieToEdit.image !== values.imageUrl ||
      movieToEdit.premiered !== values.premiered ||
      !arraysEqual(movieToEdit.genres, genresArr)
    ) {
      let updatedMovieDoc = {
        showID: movieToEdit.showID,
        name: values.name,
        imageURL: values.imageURL,
        premiered: values.premiered,
        genres: genresArr,
      };
      await CinemaApi.invoke('updateShow', updatedMovieDoc);
    }

    /* Navigate back to all movies display */
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
      <SectionTitleComp titleText={`Edit Movie: ${movieToEdit.name}`} />

      <Formik
        initialValues={{
          name: movieToEdit.name,
          imageURL: movieToEdit.imageURL,
          premiered: movieToEdit.premiered,
          genres: movieToEdit.genres?.join(),
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          imageUrl: Yup.string()
            .trim()
            .matches(urlRegex, 'Is not in correct format'),
        })}
        onSubmit={(values) => {
          editMovieData(values);
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
                  name="imageURL"
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

export default EditMovieComp;
