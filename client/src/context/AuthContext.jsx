import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';

const AuthContext = createContext();
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io(SOCKET_URL);
      newSocket.emit('join', user._id);
      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [user?._id]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (socket) socket.disconnect();
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
