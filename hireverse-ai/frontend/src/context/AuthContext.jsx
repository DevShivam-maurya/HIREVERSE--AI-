import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('hv_token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hv_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('hv_token', token);
    else localStorage.removeItem('hv_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('hv_user', JSON.stringify(user));
    else localStorage.removeItem('hv_user');
  }, [user]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
