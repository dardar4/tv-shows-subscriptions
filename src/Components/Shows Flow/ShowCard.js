import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import CinemaApi from '../../Api Utils/CinemaApi';
import { ShowsContext } from '../../Context/ShowsContext';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { formatDate } from '../../Common/date'

const useStyles = makeStyles({
  root: {
    width: 345,
    //maxWidth: 345,
    //minWidth: 345,
    height:'auto',
    marginBottom: 20,
    backgroundColor: '#b5ebd9',
  },
  media: {
    height: 10,
    paddingTop: '56.25%', // 16:9,
    marginTop: '30',
    objectFit: 'fill',
  },
});

const ShowCardComp = ({ data, subscribers, canDeleteShowCBF, canEditShowCBF }) => {
  const classes = useStyles();
  let history = useHistory();
  const { setUpdateShowsList, setShowToEdit } = useContext(ShowsContext);

  const deleteShow = async () => {
    await CinemaApi.invoke('deleteShow', data.showID);
    setTimeout(() => {
      setUpdateShowsList(true);
    }, 200);
  };

  const editShow = () => {
    setShowToEdit(data);
    history.push('/main/shows/edit');
  };

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={data.imageURL}
          title="Show Image"
        />
      </CardActionArea>
      <CardContent>
        <Paper>
          <Typography gutterBottom variant="h5" component="h2" align="center">
            #{data.showID} {data.name}
          </Typography>
        </Paper>
        <Typography variant="subtitle2" color="textPrimary" component="p" />
        Genres:
        <ul>
          {data.genres.map((g, index) => {
            return <li key={index}>{g}</li>;
          })}
        </ul>

        <Typography variant="subtitle2" color="textPrimary" component="p">
          Premiered: {formatDate(data.premiered)}
        </Typography>

        <br/>
        Subscribers:
        <ul>
          {subscribers && subscribers.length > 0 && subscribers.map((s, index) => {
            return <li key={index}>{s.subscriberName} , {formatDate(s.subscriptionDate)}</li>;
          })}
        </ul>

      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={editShow}
          disabled={!canEditShowCBF()}
        >
          Edit
        </Button>
        <Button
          size="small"
          onClick={deleteShow}
          color="secondary"
          disabled={!canDeleteShowCBF()}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ShowCardComp;
