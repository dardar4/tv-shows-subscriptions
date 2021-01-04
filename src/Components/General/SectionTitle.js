import { Paper, Typography } from '@material-ui/core';
import React from 'react';


const paperStyle = {
    width: 200,
    textAlign: 'center',
    backgroundColor: '#76D8E3',
    opacity: 0.8
  };

  
const SectionTitleComp = ({titleText}) => {
  return (
    <>
      <br />
      <Paper style={paperStyle} elevation={7} variant="elevation">
        <Typography>{titleText}</Typography>
      </Paper>
      <br />
    </>
  );
};

export default SectionTitleComp;
