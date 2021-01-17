import React, { useContext } from 'react';
import { ShowsContext } from '../../Context/ShowsContext';
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

const EditShowComp = (props) => {
  const { showToEdit, setUpdateShowsList } = useContext(ShowsContext);

  const editShowData = async (values) => {
    let genresArr = parseGenres(values.genres);

    /* Update the show document */
    if (
      showToEdit.name !== values.name ||
      showToEdit.image !== values.imageUrl ||
      showToEdit.premiered !== values.premiered ||
      !arraysEqual(showToEdit.genres, genresArr)
    ) {
      let updatedShowDoc = {
        showID: showToEdit.showID,
        name: values.name,
        imageURL: values.imageURL,
        premiered: values.premiered,
        genres: genresArr,
      };
      await CinemaApi.invoke('updateShow', updatedShowDoc);
    }

    /* Navigate back to all shows display */
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
      <SectionTitleComp titleText={`Edit Show: ${showToEdit.name}`} />

      <Formik
        initialValues={{
          name: showToEdit.name,
          imageURL: showToEdit.imageURL,
          premiered: showToEdit.premiered,
          genres: showToEdit.genres?.join(),
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          imageUrl: Yup.string()
            .trim()
            .matches(urlRegex, 'Is not in correct format'),
        })}
        onSubmit={(values) => {
          editShowData(values);
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

export default EditShowComp;
