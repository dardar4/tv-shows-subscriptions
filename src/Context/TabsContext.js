import React, { createContext, useEffect, useState } from 'react';
import SessionStorageUtil from '../Api Utils/SessionStorageUtil';

export const TabsContext = createContext();

const TabsContextProvider = (props) => {
  const [selectedTab, setSelectedTab] = useState(() => {
    let st = SessionStorageUtil.get('selectedTab');
    if (st == null) st = 0;
    return st;
  });

  useEffect(() => {
    SessionStorageUtil.set('selectedTab', selectedTab);
  }, [selectedTab]);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      {props.children}
    </TabsContext.Provider>
  );
};

export default TabsContextProvider;
