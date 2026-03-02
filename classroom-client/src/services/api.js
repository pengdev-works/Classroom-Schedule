import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Optional: response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data || error.message);
    return Promise.reject(error);
  }
);