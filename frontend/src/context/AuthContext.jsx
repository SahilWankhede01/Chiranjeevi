import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios Base URL for production deployments (e.g. Netlify)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('clinic_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Sync axios auth headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('clinic_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('clinic_token');
    }
  }, [token]);

  // Load user profile on startup
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/profile');
          if (res.data.success) {
            setUser(res.data.data);
            // Fetch notifications
            fetchNotifications();
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to load user profile', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setNotifications([]);
    localStorage.removeItem('clinic_token');
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.data.token);
      setUser({
        _id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        phone: res.data.data.phone,
        role: res.data.data.role,
        age: res.data.data.age,
        gender: res.data.data.gender,
        avatar: res.data.data.avatar,
      });
      return res.data.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.data.token);
      setUser({
        _id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        phone: res.data.data.phone,
        role: res.data.data.role,
        age: res.data.data.age,
        gender: res.data.data.gender,
        avatar: res.data.data.avatar,
      });
      return res.data.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const updateProfile = async (profileData) => {
    const res = await axios.put('/api/auth/profile', profileData);
    if (res.data.success) {
      setUser(res.data.data);
      if (res.data.data.token) {
        setToken(res.data.data.token);
      }
      return res.data.data;
    }
    throw new Error(res.data.message || 'Profile update failed');
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/auth/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const res = await axios.put(`/api/auth/notifications/${id}`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification read', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notifications,
        login,
        register,
        logout: handleLogout,
        updateProfile,
        fetchNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
