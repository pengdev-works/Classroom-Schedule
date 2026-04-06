import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      if (response.status === 401 || response.status === 403) {
        // Handle unauthorized or forbidden access
        const isLoginPage = window.location.pathname === '/login';
        
        if (!isLoginPage) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          Swal.fire({
            title: 'Session Expired',
            text: 'Please log in again to continue.',
            icon: 'warning',
            confirmButtonColor: '#4f46e5',
            background: '#1e293b',
            color: '#f1f5f9'
          }).then(() => {
            window.location.href = '/login';
          });
        }
      } else if (response.status >= 500) {
        Swal.fire({
          title: 'Server Error',
          text: 'The system encountered an unexpected problem. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#4f46e5',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      }
    } else {
      // Network error (no response)
      Swal.fire({
        title: 'Connection Lost',
        text: 'Unable to reach the server. Please check your internet connection.',
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#1e293b',
        color: '#f1f5f9'
      });
    }

    return Promise.reject(error);
  }
);

export default api;
