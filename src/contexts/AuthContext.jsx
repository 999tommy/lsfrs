import React, { createContext, useContext, useState, useEffect } from 'react';
import { LS_KEYS, getStorage, setStorage } from '../utils/localStorage';
import { verifyPassword } from '../utils/auth';
import { logActivity } from '../utils/logger';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = getStorage(LS_KEYS.CURRENT_USER, null);
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const users = getStorage(LS_KEYS.USERS, []);
    const user = users.find(u => u.username === username);

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }
    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' };
    }
    if (!verifyPassword(password, user.password)) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Update lastLogin
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    setStorage(LS_KEYS.USERS, updatedUsers);

    // Set current user
    const loggedInUser = updatedUsers.find(u => u.id === user.id);
    setCurrentUser(loggedInUser);
    setStorage(LS_KEYS.CURRENT_USER, loggedInUser);
    
    logActivity('login', loggedInUser, 'User logged in');
    return { success: true, user: loggedInUser };
  };

  const logout = () => {
    if (currentUser) {
      logActivity('logout', currentUser, 'User logged out');
    }
    setCurrentUser(null);
    localStorage.removeItem(LS_KEYS.CURRENT_USER);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
