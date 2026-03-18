import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 global
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) =>
  API.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  API.post('/auth/register', { name, email, password });

export const getMe = () => API.get('/auth/me');
export const getUsers = () => API.get('/auth/users');

// Subjects
export const getSubjects = () => API.get('/subjects');
export const getSubjectById = (id) => API.get(`/subjects/${id}`);

// Tasks
export const getTasksBySubject = (subjectId) => API.get(`/tasks/${subjectId}`);
export const createTask = (title, subjectId) =>
  API.post('/tasks', { title, subjectId });
export const toggleTask = (taskId) => API.put(`/tasks/${taskId}/toggle`);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);

export default API;
