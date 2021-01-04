import React, { useState, useRef, useContext } from 'react';
import IdleTimer from 'react-idle-timer';
import { useHistory } from 'react-router-dom';
import { LoggedInUserContext } from '../Context/LoggedInUserContext';
import { toast } from 'react-toastify';
import { ToastContext } from '../Context/ToastContext';


const idleTimeOutNotification = () =>
toast.error(
  `Logged out from site due to session timeout. Please login again`
);

const IdleTimerContainer = () => {
  const { loggedInUser, dispatch } = useContext(LoggedInUserContext);
  const { setToastProps } = useContext(ToastContext)
  const history = useHistory();
  const idleTimerRef = useRef(null);

  const onIdle = () => {
    // Logout the user
    dispatch({ type: 'LOGOUT' });

    // Show error notification
    setToastProps({
      autoClose : false
    })
    idleTimeOutNotification();

    // redirect back to login page
    history.push('/');
  };

  return (
    <div>
      {loggedInUser?.sessionTO > 0 ? (
        <IdleTimer
          ref={idleTimerRef}
          timeout={loggedInUser?.sessionTO * 60 * 1000}
          onIdle={onIdle}
          key="idleTimer"
          startOnMount={true}
        >
        </IdleTimer>
      ) : null}
    </div>
  );
};

export default IdleTimerContainer;
