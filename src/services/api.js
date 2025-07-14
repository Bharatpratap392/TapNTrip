import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // Dispatch custom event instead of direct navigation
      window.dispatchEvent(new CustomEvent('unauthorized', { detail: { redirectTo: '/login' } }));
    }
    return Promise.reject(error);
  }
);

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
  return api.get(`/bookings/user/${userId}`);
};

export const getBookingById = (bookingId) => {
  return api.get(`/bookings/${bookingId}`);
};

export const updateBookingDate = (bookingId, newDate) => {
  return api.put(`/bookings/${bookingId}/date`, { travelDate: newDate });
};

export const cancelBooking = (bookingId) => {
  return api.put(`/bookings/${bookingId}/cancel`);
};

export const createBooking = (bookingData) => {
  return api.post('/bookings', bookingData);
};

// Health Profile API
export async function getHealthProfile() {
  // TODO: Get Clerk JWT token for authentication
  // const token = await getClerkToken();
  const res = await fetch('/api/health-profile', {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch health profile');
  return res.json();
}

export async function saveHealthProfile(profile) {
  // TODO: Get Clerk JWT token for authentication
  // const token = await getClerkToken();
  const res = await fetch('/api/health-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to save health profile');
  return res.json();
} 