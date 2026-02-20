import axios from 'axios';

const API_URL = '/api';

// Create axios instance with defaults
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Token is handled via cookies, but we can also use localStorage as fallback
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
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

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        const response = await api.get('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }
};

// Bus API
export const busAPI = {
    getAll: async () => {
        const response = await api.get('/buses');
        return response.data;
    },

    search: async (searchParams) => {
        const response = await api.get('/buses/search', { params: searchParams });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/buses/${id}`);
        return response.data;
    },

    getSeats: async (id) => {
        const response = await api.get(`/buses/${id}/seats`);
        return response.data;
    },

    seed: async () => {
        const response = await api.get('/buses/seed');
        return response.data;
    }
};

// Booking API
export const bookingAPI = {
    create: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await api.get('/bookings/mybookings');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    cancel: async (id) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    }
};

export default api;
