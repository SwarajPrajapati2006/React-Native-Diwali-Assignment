import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuth, logout: storeLogout, user, isAuthenticated, setBiometricsEnabled, isBiometricsEnabled } = useAuthStore();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });

      const userData = res.data.user || res.data;
      const token = res.data.token || `token_${userData._id}`;
      await setAuth(userData, token);
      setIsLoading(false);
      return userData;
    } catch (e) {
      console.error('Login error:', e);
      setError(e.response?.data?.error || e.message || 'Login failed');
      setIsLoading(false);
      return null;
    }
  };

  const register = async (name, email, college, password, phone) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/register', {
        name,
        email,
        college,
        password,
        phone,
      });

      const userData = res.data.user || res.data;
      const token = res.data.token || `token_${userData._id}`;
      await setAuth(userData, token);
      setIsLoading(false);
      return userData;
    } catch (e) {
      console.error('Register error:', e);
      setError(e.response?.data?.error || e.message || 'Registration failed');
      setIsLoading(false);
      return null;
    }
  };

  const authenticateWithBiometrics = async () => {
    if (Platform.OS === 'web') return true;
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return true; // Pass through if device doesn't support
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Buy & Sell',
        fallbackLabel: 'Use Device PIN / Password',
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (e) {
      console.warn('Biometric error:', e);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: storeLogout,
    authenticateWithBiometrics,
    isBiometricsEnabled,
    setBiometricsEnabled,
  };
};
