/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
        const payload = JSON.parse(atob(paddedBase64));
        setUserId(payload.sub);
        setUserEmail(payload.email || null);
      } catch (e) {
        console.error("JWT Decode error:", e);
        setUserId(null);
        setUserEmail(null);
      }
    } else {
      setUserId(null);
      setUserEmail(null);
    }
  }, [token]);
  
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  
  return (
    <AuthContext.Provider value={{ token, userId, userEmail, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
