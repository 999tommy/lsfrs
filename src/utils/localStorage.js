// localStorage wrapper specifically for our prototype
export const LS_KEYS = {
  USERS: 'lsfrs_users',
  STATIONS: 'lsfrs_stations',
  INSPECTIONS: 'lsfrs_inspections',
  CERTIFICATES: 'lsfrs_certificates',
  LOGS: 'lsfrs_logs',
  CURRENT_USER: 'lsfrs_curr_user',
};

// Generic read
export const getStorage = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// Generic write
export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearStorage = () => {
  localStorage.clear();
};
