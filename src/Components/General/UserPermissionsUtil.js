/*
  'View Subscriptions'
  'Create Subscriptions'
  'Delete Subscriptions
  'Update Subscriptions'
  'View Shows'
  'Create Shows'
  'Delete Shows'
  'Update Shows'
*/

const isAdmin = (user) => {
  return user?.isAdmin;
};

const canViewUsersManagement = (user) => {
  return user ? isAdmin(user) : false;
};

const validatePermission = (user, permissionType) => {
  if (user) {
    if (isAdmin(user)) {
      // Admin can do everything!
      return true;
    } else {
      // Check user permission array
      return user.permissions?.filter((p) => p === permissionType).length > 0;
    }
  } else {
    return false;
  }
};

export default {
  validatePermission,
  canViewUsersManagement,
};
