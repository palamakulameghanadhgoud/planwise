import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
};

// User API
export const users = {
  getMe: () => client.get('/users/me'),
  updateMe: (data) => client.put('/users/me', data),
};

// Tasks API
export const tasks = {
  create: (data) => client.post('/tasks/', data),
  getAll: (params) => client.get('/tasks/', { params }),
  getById: (id) => client.get(`/tasks/${id}`),
  update: (id, data) => client.put(`/tasks/${id}`, data),
  delete: (id) => client.delete(`/tasks/${id}`),
  reorder: (data) => client.post('/tasks/reorder', data),
};

// Mood API
export const mood = {
  log: (data) => client.post('/mood/', data),
  getAll: (params) => client.get('/mood/', { params }),
  getLatest: () => client.get('/mood/latest'),
  getSupport: () => client.get('/mood/support'),
  getAnalytics: (params) => client.get('/mood/analytics', { params }),
};

// Sleep API
export const sleep = {
  log: (data) => client.post('/sleep/', data),
  getAll: (params) => client.get('/sleep/', { params }),
  getDebt: () => client.get('/sleep/debt'),
  getAnalytics: (params) => client.get('/sleep/analytics', { params }),
};

// Skills API
export const skills = {
  getAll: () => client.get('/skills/'),
  getAnalytics: () => client.get('/skills/analytics'),
  getSuggestions: () => client.get('/skills/suggestions'),
  update: () => client.post('/skills/update'),
};

// Analytics API
export const analytics = {
  getDashboard: () => client.get('/analytics/dashboard'),
  getInsights: () => client.get('/analytics/insights'),
  getProductivityScore: () => client.get('/analytics/productivity-score'),
};

// Campus API
export const campus = {
  createEvent: (data) => client.post('/campus/events', data),
  getEvents: (params) => client.get('/campus/events', { params }),
  deleteEvent: (id) => client.delete(`/campus/events/${id}`),
  getTodaySchedule: () => client.get('/campus/schedule/today'),
  getFreeSlots: (params) => client.get('/campus/free-slots', { params }),
};

export default client;

