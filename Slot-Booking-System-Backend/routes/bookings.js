import express from 'express';
import {
  getAllBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// Get all bookings (filtered based on role)
router.get('/', getAllBookings);

// Get current user's bookings
router.get('/my', getMyBookings);

// Get single booking by ID
router.get('/:id', getBookingById);

// Create new booking (club_admin and super_admin only)
router.post('/', authorize('club_admin', 'super_admin'), createBooking);

// Update booking (owner or super_admin only)
router.put('/:id', updateBooking);

// Delete booking (owner or super_admin only)
router.delete('/:id', deleteBooking);

// Update booking status (super_admin only)
router.put('/:id/status', authorize('super_admin'), updateBookingStatus);

export default router;

