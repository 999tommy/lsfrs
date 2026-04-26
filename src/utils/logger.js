import { v4 as uuidv4 } from 'uuid';
import { LS_KEYS, getStorage, setStorage } from './localStorage';

export const logActivity = (type, user, description, metadata = {}) => {
  const logs = getStorage(LS_KEYS.LOGS, []);
  
  const newLog = {
    id: uuidv4(),
    type,
    userId: user?.id || 'system',
    userName: user?.name || 'System',
    userRole: user?.role || 'system',
    stationId: user?.stationId || null,
    description,
    metadata,
    timestamp: new Date().toISOString()
  };

  logs.unshift(newLog); // Add to beginning
  setStorage(LS_KEYS.LOGS, logs);
};
