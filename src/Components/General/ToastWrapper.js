import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContext } from '../../Context/ToastContext';

const ToastWrapperComp = ({autoClose}) => {

  const {toastProps} = useContext(ToastContext)

  // const autoCloseValue = () => {
  //   console.log(props.name);
  //   console.log(props.notificationTimeOut);
  //   if(props.notificationTimeOut === 0 ){
  //     return false;
  //   }
  //   else{
  //     //return true;
  //     return props.notificationTimeOut;
  //   }
  // }

  return <ToastContainer
    position="top-center"
    autoClose={toastProps.autoClose}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />;
};

export default ToastWrapperComp;
