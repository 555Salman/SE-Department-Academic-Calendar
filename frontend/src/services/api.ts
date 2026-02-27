import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (data: any) =>
    api.post('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),

  getProfile: () =>
    api.post('/auth/me'),
};

export const calendarsAPI = {
  getAll: () =>
    api.get('/calendars'),

  getOne: (id: string) =>
    api.get(`/calendars/${id}`),

  create: (data: any) =>
    api.post('/calendars', data),

  update: (id: string, data: any) =>
    api.patch(`/calendars/${id}`, data),

  delete: (id: string) =>
    api.delete(`/calendars/${id}`),

  subscribe: (id: string) =>
    api.post(`/calendars/${id}/subscribe`),

  unsubscribe: (id: string) =>
    api.post(`/calendars/${id}/unsubscribe`),

  getSubscriptions: () =>
    api.get('/calendars/subscriptions'),
};

export const eventsAPI = {
  getAll: (params?: any) =>
    api.get('/events', { params }),

  getOne: (id: string) =>
    api.get(`/events/${id}`),

  create: (data: any) =>
    api.post('/events', data),

  update: (id: string, data: any) =>
    api.patch(`/events/${id}`, data),

  delete: (id: string) =>
    api.delete(`/events/${id}`),
};

export const resourcesAPI = {
  getAll: () =>
    api.get('/resources'),

  getOne: (id: string) =>
    api.get(`/resources/${id}`),

  checkAvailability: (id: string, start: string, end: string, excludeEventId?: string) =>
    api.get(`/resources/${id}/availability`, {
      params: { start, end, excludeEventId },
    }),
};

export const usersAPI = {
  getAll: (role?: string) =>
    api.get('/users', { params: { role } }),

  getOne: (id: string) =>
    api.get(`/users/${id}`),

  update: (id: string, data: any) =>
    api.patch(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

export default api;