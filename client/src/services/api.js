import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage if present (for cross-domain hosting)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically store token or clean up on 401
API.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes, remove stale token
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/signup')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const signupApi = (data) => API.post('/auth/signup', data);
export const loginApi = (data) => API.post('/auth/login', data);
export const logoutApi = () => API.post('/auth/logout');
export const getMeApi = () => API.get('/auth/me');

// Subject Services
export const getSubjects = () => API.get('/subjects');
export const getSubjectById = (id) => API.get(`/subjects/${id}`);
export const createSubject = (data) => API.post('/subjects', data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);

// Topic Services
export const getTopicsBySubject = (subjectId) => API.get(`/subjects/${subjectId}/topics`);
export const createTopic = (subjectId, data) => API.post(`/subjects/${subjectId}/topics`, data);
export const updateTopic = (id, data) => API.put(`/topics/${id}`, data);
export const deleteTopic = (id) => API.delete(`/topics/${id}`);

// Planner Services
export const generatePlan = (data) => API.post('/planner/generate', data);
export const getPlans = (params) => API.get('/planner', { params });
export const getPlanByDate = (date) => API.get(`/planner/date/${date}`);
export const updateTaskStatus = (id, data) => API.put(`/planner/${id}/status`, data);
export const rescheduleTask = (data) => API.post('/planner/reschedule', data);
export const getProgress = () => API.get('/planner/progress');

export default API;
