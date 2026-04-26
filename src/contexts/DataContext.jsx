import React, { createContext, useContext, useState, useEffect } from 'react';
import { LS_KEYS, getStorage, setStorage } from '../utils/localStorage';
import { seedInitialData } from '../utils/seedData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    stations: [],
    inspections: [],
    certificates: [],
    logs: []
  });

  const refreshData = () => {
    setData({
      users: getStorage(LS_KEYS.USERS, []),
      stations: getStorage(LS_KEYS.STATIONS, []),
      inspections: getStorage(LS_KEYS.INSPECTIONS, []),
      certificates: getStorage(LS_KEYS.CERTIFICATES, []),
      logs: getStorage(LS_KEYS.LOGS, [])
    });
  };

  useEffect(() => {
    seedInitialData();
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ data, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
