import React, { useContext, useEffect } from 'react';
import { MembersContext } from '../../Context/MembersContext';
import MemberCardComp from './MemberCard';
import { Link } from 'react-router-dom';
import { Button, Grid, makeStyles } from '@material-ui/core';
import SectionTitleComp from '../General/SectionTitle';
import UserPermissionUtil from '../General/UserPermissionsUtil';
import { LoggedInUserContext } from '../../Context/LoggedInUserContext';


const useStyles = makeStyles(() => ({
  disabledButton: {
    pointerEvents: 'none',
  },
})); 

const MembersComp = (props) => {
  let classes = useStyles();
  const { members, setUpdateMembersList } = useContext(MembersContext);
  const { loggedInUser } = useContext(LoggedInUserContext);

  useEffect(() => {
    setUpdateMembersList(true);
  }, []);

  const canEditMember = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Update Subscriptions');
  }

  const canDeleteMember = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Delete Subscriptions');
  }

  const canAddMember = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'Create Subscriptions');
  }

  const canViewShows = () => {
    return UserPermissionUtil.validatePermission(loggedInUser, 'View Shows');
  }

  return (
    <Grid container direction="column" alignItems="center">
      <SectionTitleComp titleText={`Members`} />

      <div>
        <Link 
        to="/main/members/add"
        className={canAddMember() ? '' : classes.disabledButton}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ padding: 3, margin: 1 }}
            disabled={!canAddMember()}
          >
            Add Member
          </Button>
        </Link>
      </div>

      {members.map((memberData) => {
          return <MemberCardComp 
          key={memberData._id} 
          data={memberData}                 
          canEditMemberCBF={canEditMember}
          canDeleteMemberCBF={canDeleteMember}
          canViewShowsCBF={canViewShows}
          />;
      })}
    </Grid>
  );
};

export default MembersComp;
