import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Preferences } from '@capacitor/preferences';
import { config } from '@/config';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const { value: token } = await Preferences.get({ key: 'user_token' });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from preferences:', error);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const HTTP = axiosInstance;
export default HTTP;
