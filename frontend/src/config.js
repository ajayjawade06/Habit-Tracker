import axios from 'axios';

const API_URL = "https://habit-tracker-backend-urc7.onrender.com";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);
export { axiosInstance };
export default { API_URL };