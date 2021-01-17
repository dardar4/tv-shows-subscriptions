import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MembersContext } from '../../Context/MembersContext';
import CinemaApi from '../../Api Utils/CinemaApi';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { ShowsContext } from '../../Context/ShowsContext';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { formatDate, getYesterdayMidnight } from '../../Common/date'

const MemberCardComp = ({ data, canDeleteMemberCBF, canEditMemberCBF, canViewShowsCBF }) => {
  const { setMemberToEdit, setUpdateMembersList } = useContext(MembersContext);
  const { shows, setUpdateShowsList } = useContext(ShowsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState('');
  let history = useHistory();

  const deleteMember = async () => {
    await CinemaApi.invoke('deleteMember', data._id); 
    setUpdateMembersList(true);
  };

  const editMember = () => {
    setMemberToEdit(data);
    history.push('/main/members/edit');
  };

  const openSubscribeNewShowDialog = () => {
    if (shows?.length == 0) {
      // "load" the shows to the context in case it wasn't done before
      setUpdateShowsList(true);
    }

    setOpenDialog(true);
  };

  const subscribeNewShow = async() => {
    /* find show id from show name*/
    let show = shows.filter( (show) => {
      return show.name.toLowerCase() === selectedShow.toLowerCase() 
    })[0];

    if(!show){
      console.error('no show was selected');
      handleClose();
      return;
    }

    let selectedDateVal = selectedDate ?? new Date();

    // Add the selected show to the existing member shows array
    let newShowsArr = [...data.showsSubscriptions, {
      name : show.name,
      showID : show.showID,
      date : selectedDateVal.toISOString()
    }]

    const subscribeShowData = {
      memberID : data._id,
      shows : newShowsArr
  }

    if(data.showsSubscriptions.length === 0) {
      // member has no active shows subscriptions.
      // need to CREATE the member shows subscription list
      await CinemaApi.invoke('createShowSubscription', subscribeShowData);
    }
    else{
      // member has active shows subscriptions.
      // need to UPDATE the member shows subscription list
      await CinemaApi.invoke('updateShowSubscription', data._id, subscribeShowData);
    }

    setUpdateMembersList(true);
    handleClose();
  };

  const handleClose = () => {
    setSelectedShow('');
    setSelectedDate(null);
    setOpenDialog(false);
  };

  const getUnseenShows = () => {
    //no shows - nothing to return
    if (shows?.length === 0) return [];

    let allShowsName = shows.map((show) => show.name);
    if (!data.showsSubscriptions ||  data.showsSubscriptions.length == 0) {
      /* Return all shows */
      return allShowsName;
    }

    /* Return only shows that the member didn't watch yet */
    let seenShowsName = data.showsSubscriptions.map((showSub) => showSub.name);
    let unseenShows = allShowsName.filter((showName) => {
      return !seenShowsName.includes(showName);
    });

    return unseenShows;
  };

  const buildShowUrl = (showName) => {
    if(canViewShowsCBF()){
      return `/main/shows/${showName}`;
    }
    else{
      // user is not allowed to view shows - make a broken link
      return "#";
    }
  };

  const getFutureShows = () => {
    if(!data.showsSubscriptions){
      return [];
    }
    
    var yesterday = getYesterdayMidnight();
    let futureSubscriptions = data.showsSubscriptions?.filter((showSub) => {
      return new Date(showSub.date) >= yesterday;
    });

    return futureSubscriptions.map((showSub) => {
      return (
        <li key={showSub._id}>
          <Link to={buildShowUrl(showSub.name)}>{showSub.name}</Link>,{' '}
          {formatDate(showSub.date)}
        </li>
      );
    });
  };

  const getPastShows = () => {
    if(!data.showsSubscriptions){
      return [];
    }

    var yesterday = getYesterdayMidnight();
    let pastSubscriptions = data.showsSubscriptions.filter((showSub) => {
      return new Date(showSub.date) < yesterday;
    });

    return pastSubscriptions.map((showSub) => {
      return (
        <li key={showSub._id}>
          <Link to={buildShowUrl(showSub.name)}>{showSub.name}</Link>,{' '}
          {showSub.date}
        </li>
      );
    });
  };

  return (
    <div
      style={{
        margin: '3px',
        width: '100%',
        border: '2px solid blue',
        borderLeftColor: 'red',
      }}
    >
      <label>ID: </label>
      {data._id} <br />
      <label>Name: </label>
      {data.name} <br />
      <label>Email: </label>
      {data.email} <br />
      <label>City: </label>
      {data.city} <br />
      <br />
      <div
        style={{
          margin: '3px',
          width: '100%',
          border: '2px solid green',
        }}
      >
        <h5>Shows Watched</h5>
        <button onClick={openSubscribeNewShowDialog}>
          Subscribe to a new show
        </button>
        <br /> <br />
        <h6>Seen shows:</h6>
        <ul>{getPastShows()}</ul>
        <h6>Future shows:</h6>
        <ul>{getFutureShows()}</ul>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Subscribe to a new show</DialogTitle>
        <DialogContent>
          <Autocomplete
            value={selectedShow}
            onChange={(event, newValue) => {
              setSelectedShow(newValue);
            }}
            options={getUnseenShows()}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Shows"}
                inputProps={{
                  ...params.inputProps,
                  required: true
                }}
                required={true}
              />
            )}
          />
          <br />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              onChange={(value) => setSelectedDate(value)}
              format="MM/dd/yyyy"
              helperText="select a date to watch to show"
              variant="outlined"
              inputVariant="outlined"
              disablePast
            ></KeyboardDatePicker>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={subscribeNewShow} color="primary">
            Subscribe
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={editMember}
        variant="contained"
        color="primary"
        disabled={!canEditMemberCBF()}
      >
        Edit
      </Button>
      <Button
        onClick={deleteMember}
        variant="contained"
        color="secondary"
        disabled={!canDeleteMemberCBF()}
      >
        Delete
      </Button>
    </div>
  );
};

export default MemberCardComp;
