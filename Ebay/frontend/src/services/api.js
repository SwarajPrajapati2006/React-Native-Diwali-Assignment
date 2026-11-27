import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

const API_PORT = 5050;

// Auto-detect the dev machine's host so the API URL follows the current
// Wi-Fi IP (DHCP changes it). Falls back to EXPO_PUBLIC_API_URL.
const detectDevHost = () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : null;
  }
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost || '';
  return hostUri ? hostUri.split(':')[0] : null;
};

const BASE_URL = (() => {
  const host = __DEV__ ? detectDevHost() : null;
  if (host) return `http://${host}:${API_PORT}`;
  return process.env.EXPO_PUBLIC_API_URL || `http://localhost:${API_PORT}`;
})();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach x-user-id
api.interceptors.request.use(
  (config) => {
    const userId = useAuthStore.getState().userId;
    if (userId) {
      config.headers['x-user-id'] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.code === 'ECONNABORTED' || (!error.response && !originalRequest._retry)) {
      originalRequest._retry = true;
      try {
        return await api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
