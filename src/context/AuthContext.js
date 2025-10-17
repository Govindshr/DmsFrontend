// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (username, password) => {
    if (username === "Shekhar@gmail.com" && password === "Shekhar@123") {
      const nextUser = { username };
      setUser(nextUser);  // Set the user to simulate a login
      try { localStorage.setItem('auth_user', JSON.stringify(nextUser)); } catch (e) {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);  // Clear the user to simulate a logout
    try { localStorage.removeItem('auth_user'); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
