import axios from 'axios';
import { toast } from 'react-toastify';

// Get the appropriate API URL based on environment
const getApiUrl = () => {
  const env = process.env.REACT_APP_ENV || 'development';
  return env === 'production'
    ? process.env.REACT_APP_PRODUCTION_API_URL
    : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get the token from secure storage
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle retry logic
    if (error.response && !originalRequest._retry && originalRequest.retryCount < MAX_RETRIES) {
      originalRequest._retry = true;
      originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return api(originalRequest);
    }

    // Handle different error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth state and redirect to login
          sessionStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 422:
          toast.error('Invalid data provided');
          break;
        case 429:
          toast.error('Too many requests. Please try again later');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error('An unexpected error occurred');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection');
    } else {
      toast.error('An unexpected error occurred');
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }

    return Promise.reject(error);
  }
);

// API wrapper functions with type checking
const apiWrapper = {
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper method for file uploads
  upload: async (url, file, onProgress = () => {}) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiWrapper;

// Hotel Services API
export const hotelServicesAPI = {
  // Rooms
  getRooms: () => api.get('/hotel/rooms'),
  addRoom: (room) => api.post('/hotel/rooms', room),
  updateRoom: (id, room) => api.put(`/hotel/rooms/${id}`, room),
  deleteRoom: (id) => api.delete(`/hotel/rooms/${id}`),
  updateRoomStatus: (id, status) => api.patch(`/hotel/rooms/${id}/status`, { status }),

  // Facilities
  getFacilities: () => api.get('/hotel/facilities'),
  addFacility: (facility) => api.post('/hotel/facilities', facility),
  updateFacility: (id, facility) => api.put(`/hotel/facilities/${id}`, facility),
  deleteFacility: (id) => api.delete(`/hotel/facilities/${id}`),
  updateFacilityStatus: (id, status) => api.patch(`/hotel/facilities/${id}/status`, { status })
};

// Transport Services API
export const transportServicesAPI = {
  // Vehicles
  getVehicles: () => api.get('/transport/vehicles'),
  addVehicle: (vehicle) => api.post('/transport/vehicles', vehicle),
  updateVehicle: (id, vehicle) => api.put(`/transport/vehicles/${id}`, vehicle),
  deleteVehicle: (id) => api.delete(`/transport/vehicles/${id}`),
  updateVehicleStatus: (id, status) => api.patch(`/transport/vehicles/${id}/status`, { status }),

  // Routes
  getRoutes: () => api.get('/transport/routes'),
  addRoute: (route) => api.post('/transport/routes', route),
  updateRoute: (id, route) => api.put(`/transport/routes/${id}`, route),
  deleteRoute: (id) => api.delete(`/transport/routes/${id}`),
  updateRouteStatus: (id, status) => api.patch(`/transport/routes/${id}/status`, { status })
};

// Guide Services API
export const guideServicesAPI = {
  // Tours
  getTours: () => api.get('/guide/tours'),
  addTour: (tour) => api.post('/guide/tours', tour),
  updateTour: (id, tour) => api.put(`/guide/tours/${id}`, tour),
  deleteTour: (id) => api.delete(`/guide/tours/${id}`),
  updateTourStatus: (id, status) => api.patch(`/guide/tours/${id}/status`, { status })
};

// Booking API endpoints
export const fetchUserBookings = (userId) => {
  return apiWrapper.get(`/bookings/user/${userId}`);
};

export const getBookingById = (bookingId) => {
  return apiWrapper.get(`/bookings/${bookingId}`);
};

export const updateBookingDate = (bookingId, newDate) => {
  return apiWrapper.put(`/bookings/${bookingId}/date`, { travelDate: newDate });
};

export const cancelBooking = (bookingId) => {
  return apiWrapper.put(`/bookings/${bookingId}/cancel`);
};

export const createBooking = (bookingData) => {
  return apiWrapper.post('/bookings', bookingData);
}; 