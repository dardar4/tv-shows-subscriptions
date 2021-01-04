import React from 'react';
import HeaderComp from './Header';
import NavigationBarWithTabsComp from './NavigationBarWithTabs';
import { Grid } from '@material-ui/core';

const MainPageComp = (props) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <HeaderComp />
      </Grid>
      <Grid item>
        <NavigationBarWithTabsComp />
      </Grid>
    </Grid>
  );
};

export default MainPageComp;
