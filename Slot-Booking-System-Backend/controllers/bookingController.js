import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';

// Helper function to check if user can modify booking
const canModifyBooking = (booking, user) => {
  // Super admin can modify any booking
  if (user.role === 'super_admin') {
    return true;
  }
  
  // Check if user is the booking owner
  const bookingUserId = booking.user?._id || booking.user;
  const currentUserId = user._id;
  
  return String(bookingUserId) === String(currentUserId);
};

// Get all bookings (filtered by user role)
export const getAllBookings = async (req, res) => {
  try {
    const { status, club, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    // Regular users and club admins can only see their own bookings
    // Super admin can see all bookings
    if (req.user.role !== 'super_admin') {
      query.user = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (club && req.user.role === 'super_admin') {
      query.club = club;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const bookings = await Booking.find(query)
      .populate('user', 'name email club role')
      .populate('slot', 'date startTime endTime venue')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Booking.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get user's own bookings
export const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    const bookings = await Booking.find(query)
      .populate('slot', 'date startTime endTime venue')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your bookings',
      error: error.message
    });
  }
};

// Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('user', 'name email club role')
      .populate('slot', 'date startTime endTime venue capacity')
      .populate('approvedBy', 'name');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check access: user can see their own booking or super admin can see all
    if (req.user.role !== 'super_admin' && String(booking.user._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user._id
    };
    
    // Validate slot exists and is available
    const slot = await Slot.findById(bookingData.slot);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }
    
    if (slot.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Slot is not available for booking'
      });
    }
    
    // Validate participants don't exceed capacity
    if (bookingData.expectedParticipants > slot.capacity) {
      return res.status(400).json({
        success: false,
        message: `Expected participants (${bookingData.expectedParticipants}) exceed slot capacity (${slot.capacity})`
      });
    }
    
    const booking = await Booking.create(bookingData);
    
    // Update slot status
    slot.status = 'booked';
    slot.bookedBy = req.user._id;
    await slot.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email club')
      .populate('slot', 'date startTime endTime venue');
    
    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Update booking (only owner or super_admin)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('user', '_id');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check authorization: only owner or super_admin can update
    if (!canModifyBooking(booking, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the booking owner or super admin can update bookings.'
      });
    }
    
    // Only pending bookings can be updated
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be updated'
      });
    }
    
    // If slot is being changed, validate new slot
    if (req.body.slot && req.body.slot !== booking.slot.toString()) {
      const newSlot = await Slot.findById(req.body.slot);
      if (!newSlot) {
        return res.status(404).json({
          success: false,
          message: 'New slot not found'
        });
      }
      if (newSlot.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: 'New slot is not available'
        });
      }
      
      // Release old slot
      const oldSlot = await Slot.findById(booking.slot);
      if (oldSlot) {
        oldSlot.status = 'available';
        oldSlot.bookedBy = null;
        await oldSlot.save();
      }
      
      // Reserve new slot
      newSlot.status = 'booked';
      newSlot.bookedBy = req.user._id;
      await newSlot.save();
    }
    
    // If participants changed, validate against slot capacity
    if (req.body.expectedParticipants) {
      const slot = await Slot.findById(booking.slot);
      if (req.body.expectedParticipants > slot.capacity) {
        return res.status(400).json({
          success: false,
          message: `Expected participants exceed slot capacity (${slot.capacity})`
        });
      }
    }
    
    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('user', 'name email club')
     .populate('slot', 'date startTime endTime venue');
    
    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Delete booking (only owner or super_admin)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('user', '_id');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check authorization: only owner or super_admin can delete
    if (!canModifyBooking(booking, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the booking owner or super admin can delete bookings.'
      });
    }
    
    // Release the slot if booking is pending or approved
    if (booking.status === 'pending' || booking.status === 'approved') {
      const slot = await Slot.findById(booking.slot);
      if (slot) {
        slot.status = 'available';
        slot.bookedBy = null;
        slot.eventName = null;
        slot.eventDescription = null;
        await slot.save();
      }
    }
    
    // Delete booking
    await Booking.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// Update booking status (super_admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.status = status;
    
    if (status === 'approved') {
      booking.approvedBy = req.user._id;
      booking.approvalDate = new Date();
      booking.rejectionReason = null;
    } else if (status === 'rejected') {
      booking.rejectionReason = rejectionReason || null;
    }
    
    await booking.save();
    
    const populatedBooking = await Booking.findById(id)
      .populate('user', 'name email club')
      .populate('slot', 'date startTime endTime venue')
      .populate('approvedBy', 'name');
    
    res.status(200).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

