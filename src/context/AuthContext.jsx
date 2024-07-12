import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      const decoded = jwtDecode(token); // Use jwt_decode correctly
      setUser(decoded);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/signup', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      const decoded = jwtDecode(token); // Use jwt_decode correctly
      setUser(decoded);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
