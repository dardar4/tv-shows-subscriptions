import React, { createContext, useState } from 'react';

export const ToastContext = createContext();

const ToastContextProvider = (props) => {
  const [toastProps, setToastProps] = useState({});

  return (
    <ToastContext.Provider value={{ toastProps, setToastProps }}>
      {props.children}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;
