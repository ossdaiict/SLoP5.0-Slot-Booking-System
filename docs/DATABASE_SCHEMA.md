# Database Schema

This document outlines the MongoDB schemas used in the Slot Booking System, including data models, relationships, and validation rules.

## 🗄️ Database Overview

The application uses MongoDB with Mongoose ODM for data modeling. The database consists of three main collections:

- **Users**: Authentication and user management
- **Slots**: Time slots and venue information
- **Bookings**: Booking records and event details

## 📋 Schema Definitions

### User Schema

The User schema handles authentication and role-based access control.

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['super_admin', 'club_admin', 'user'],
    default: 'user'
  },
  club: {
    type: String,
    required: function() { return this.role === 'club_admin'; },
    enum: ['Technical Club', 'Cultural Club', 'Sports Club', 'Literary Club', 'Other']
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});
```

#### User Schema Features
- **Email Validation**: Regex pattern for valid email format
- **Role-based Access**: Three distinct user roles
- **Conditional Required Fields**: Club field required only for club admins
- **Automatic Timestamps**: Created and updated timestamps
- **Account Management**: Active/inactive status tracking

#### User Roles
- **`user`**: Regular users with read-only access
- **`club_admin`**: Club administrators who can book slots
- **`super_admin`**: System administrators with full access

### Slot Schema

The Slot schema defines time slots and venue information.

```javascript
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
```

#### Slot Schema Features
- **Date Validation**: Prevents booking slots in the past
- **Time Format Validation**: Ensures proper HH:MM format
- **Time Logic Validation**: End time must be after start time
- **Venue Management**: Predefined list of available venues
- **Capacity Limits**: Minimum and maximum capacity validation
- **Status Tracking**: Multiple status states for better management
- **Reference Relationships**: Links to User who booked the slot
- **Recurring Slots**: Support for recurring slot patterns

#### Slot Status Types
- **`available`**: Open for booking
- **`booked`**: Reserved by a club
- **`cancelled`**: Cancelled booking
- **`maintenance`**: Under maintenance/unavailable

### Booking Schema

The Booking schema manages booking requests and event details.

```javascript
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
    min: [1, 'Expected participants must be at least 1'],
    validate: {
      validator: function(participants) {
        // Validate against slot capacity when populated
        return true; // Custom validation in controller
      },
      message: 'Expected participants exceed slot capacity'
    }
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
```

#### Booking Schema Features
- **Reference Relationships**: Links to both Slot and User collections
- **Comprehensive Event Details**: Name, description, and participant count
- **Contact Information**: Dedicated contact person details
- **Approval Workflow**: Status tracking with approval/rejection logic
- **Requirements Tracking**: List of special requirements
- **Validation Rules**: Comprehensive validation for all fields
- **Audit Trail**: Tracks who approved and when

#### Booking Status Types
- **`pending`**: Awaiting approval
- **`approved`**: Approved and confirmed
- **`rejected`**: Rejected with reason
- **`cancelled`**: Cancelled by user or admin

## 🔗 Schema Relationships

### One-to-Many Relationships

1. **User → Bookings**: One user can have multiple bookings
2. **User → Slots**: One user can book multiple slots
3. **Slot → Bookings**: One slot can have multiple booking attempts (historically)

### Reference Population

```javascript
// Populate user details in booking
const booking = await Booking.findById(id)
  .populate('user', 'name email club')
  .populate('slot', 'date startTime endTime venue')
  .populate('approvedBy', 'name');

// Populate booking details in slot
const slot = await Slot.findById(id)
  .populate('bookedBy', 'name club');
```

## 📊 Indexes and Performance

### Recommended Indexes

```javascript
// User collection indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ club: 1 });

// Slot collection indexes
slotSchema.index({ date: 1, venue: 1 });
slotSchema.index({ status: 1 });
slotSchema.index({ date: 1, startTime: 1, endTime: 1 });

// Booking collection indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ slot: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ club: 1 });
bookingSchema.index({ createdAt: -1 });
```

## 🛡️ Data Validation

### Pre-save Middleware

```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Validate slot availability before booking
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const slot = await mongoose.model('Slot').findById(this.slot);
    if (slot.status !== 'available') {
      throw new Error('Slot is not available for booking');
    }
  }
  next();
});
```

### Custom Validation Methods

```javascript
// Check if slot time conflicts exist
slotSchema.methods.hasTimeConflict = async function() {
  const conflicts = await this.constructor.find({
    date: this.date,
    venue: this.venue,
    status: { $in: ['available', 'booked'] },
    _id: { $ne: this._id },
    $or: [
      {
        $and: [
          { startTime: { $lte: this.startTime } },
          { endTime: { $gt: this.startTime } }
        ]
      },
      {
        $and: [
          { startTime: { $lt: this.endTime } },
          { endTime: { $gte: this.endTime } }
        ]
      }
    ]
  });
  
  return conflicts.length > 0;
};
```

## 📝 Schema Evolution

### Version History
- **v1.0**: Initial schema design
- **v1.1**: Added recurring slots support
- **v1.2**: Enhanced contact person details in bookings
- **v1.3**: Added maintenance status for slots

### Migration Considerations
- Always use schema versioning for production deployments
- Implement backward compatibility for API changes
- Use MongoDB migration scripts for schema updates