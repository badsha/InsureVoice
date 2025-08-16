import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = '';
axios.defaults.timeout = 10000;

// Add request interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (email: string, password: string) =>
    axios.post('/api/auth/login', { email, password }),
  
  // Users
  getUsers: () => axios.get('/api/users'),
  getUser: (id: string) => axios.get(`/api/users/${id}`),
  
  // Companies
  getCompanies: () => axios.get('/api/companies'),
  
  // Grievances
  getGrievances: (params?: any) => axios.get('/api/grievances', { params }),
  createGrievance: (data: any) => axios.post('/api/grievances', data),
  
  // Analytics
  getDashboardAnalytics: () => axios.get('/api/analytics/dashboard'),
  
  // Test
  testAPI: () => axios.get('/api/test'),
};

export default api;