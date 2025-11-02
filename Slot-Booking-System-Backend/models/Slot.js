import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Slot date cannot be in the past'
    }
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    validate: {
      validator: function(endTime) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  venue: {
    type: String,
    required: true,
    enum: [
      'Auditorium', 
      'Seminar Hall', 
      'Ground', 
      'Classroom Block A', 
      'Lab Building',
      'Conference Room',
      'Library Hall'
    ]
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, 'Capacity must be at least 1'],
    max: [1000, 'Capacity cannot exceed 1000']
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'cancelled', 'maintenance'],
    default: 'available'
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  eventName: {
    type: String,
    maxlength: 200
  },
  eventDescription: {
    type: String,
    maxlength: 1000
  },
  recurringPattern: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  },
  recurringEnd: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
slotSchema.index({ date: 1, venue: 1 });
slotSchema.index({ status: 1 });
slotSchema.index({ date: 1, startTime: 1, endTime: 1 });

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;

