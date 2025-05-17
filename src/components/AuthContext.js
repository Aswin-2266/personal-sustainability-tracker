import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './AuthContext.css'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          const response = await axios.get('http://localhost:5000/api/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    console.log(response.data.user);
  };

  const register = async (username, email, password) => {
  const response = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  const data = await response.json();
  // Optionally save token, login user, etc.
  return data;
};


  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);