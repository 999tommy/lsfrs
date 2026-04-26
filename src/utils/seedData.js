import { v4 as uuidv4 } from 'uuid';
import { STATIONS } from '../constants/stations';
import { LS_KEYS, getStorage, setStorage } from './localStorage';
import { hashPassword } from './auth';

export const seedInitialData = () => {
  // Seed Stations
  let currentStations = getStorage(LS_KEYS.STATIONS, []);
  if (currentStations.length === 0) {
    const freshStations = STATIONS.map(s => ({
      ...s,
      officerCount: 0,
      createdAt: new Date().toISOString()
    }));
    setStorage(LS_KEYS.STATIONS, freshStations);
  }

  // Seed Admin and Technical Users
  let users = getStorage(LS_KEYS.USERS, []);
  
  const hasAdmin = users.some(u => u.username === 'director');
  if (!hasAdmin) {
    users.push({
      id: uuidv4(),
      name: 'Director (Admin)',
      username: 'director',
      role: 'admin',
      stationId: null,
      password: hashPassword('Director@LSFRS24'),
      isFirstLogin: false, // Admins don't need to change password
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    });
  }

  const hasTechnical = users.some(u => u.username === 'technical');
  if (!hasTechnical) {
    users.push({
      id: uuidv4(),
      name: 'Technical Support',
      username: 'technical',
      role: 'technical',
      stationId: null,
      password: hashPassword('Technical@LSFRS24'),
      isFirstLogin: false, // Per user request, keep default permanent for tech
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    });
  }

  setStorage(LS_KEYS.USERS, users);
};
