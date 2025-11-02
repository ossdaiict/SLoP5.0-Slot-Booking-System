import api from './api.js';

export const bookingAPI = {
  // Get all bookings (filtered based on user role)
  getAllBookings: (params = {}) => {
    return api.get('/bookings', { params });
  },

  // Get current user's bookings
  getMyBookings: (params = {}) => {
    return api.get('/bookings/my', { params });
  },

  // Get single booking by ID
  getBookingById: (bookingId) => {
    return api.get(`/bookings/${bookingId}`);
  },

  // Create new booking
  createBooking: (bookingData) => {
    return api.post('/bookings', bookingData);
  },

  // Update booking
  updateBooking: (bookingId, bookingData) => {
    return api.put(`/bookings/${bookingId}`, bookingData);
  },

  // Delete booking
  deleteBooking: (bookingId) => {
    return api.delete(`/bookings/${bookingId}`);
  },

  // Update booking status (super_admin only)
  updateBookingStatus: (bookingId, status, rejectionReason = null) => {
    return api.put(`/bookings/${bookingId}/status`, {
      status,
      rejectionReason
    });
  }
};

export default bookingAPI;

