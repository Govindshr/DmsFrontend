// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    if (username === "Shekhar@gmail.com" && password === "Shekhar@123") {
      setUser({ username });  // Set the user to simulate a login
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);  // Clear the user to simulate a logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
