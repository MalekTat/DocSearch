import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Provide the context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info: role and account details

  const login = (role, username) => {
    setUser({ role, username });
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isDoctor }}>
      {children}
    </AuthContext.Provider>
  );
};

// Use the context
export const useAuthContext = () => useContext(AuthContext);