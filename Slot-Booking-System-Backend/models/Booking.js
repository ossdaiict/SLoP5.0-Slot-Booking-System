import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: String,
    required: true,
    enum: ['Technical Club', 'Cultural Club', 'Sports Club', 'Literary Club', 'Other']
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  eventDescription: {
    type: String,
    required: true,
    maxlength: 1000
  },
  expectedParticipants: {
    type: Number,
    required: true,
    min: [1, 'Expected participants must be at least 1']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  requirements: {
    type: [String],
    default: [],
    validate: {
      validator: function(requirements) {
        return requirements.length <= 10;
      },
      message: 'Cannot have more than 10 requirements'
    }
  },
  contactPerson: {
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    }
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: 500
  },
  specialInstructions: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ slot: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ club: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

