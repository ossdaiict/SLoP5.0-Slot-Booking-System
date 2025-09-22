# User Roles and Permissions

This document outlines the user role system, access control, and permission matrix for the Slot Booking System.

## 🏗️ Role-Based Access Control (RBAC)

The system implements a hierarchical role-based access control system with three distinct user roles, each with specific permissions and capabilities.

### Role Hierarchy
```
Super Admin
    ↓
Club Admin
    ↓ 
Regular User
```

## 👥 User Roles Overview

### 1. Regular User
**Description**: Default role for all registered users with read-only access to the system.

**Primary Purpose**: View available slots and general information about events and bookings.

**Access Level**: Public + Basic authenticated features

### 2. Club Admin
**Description**: Club representatives authorized to book slots for their respective clubs.

**Primary Purpose**: Manage club events and book available time slots.

**Access Level**: All Regular User permissions + Booking management

**Club Association**: Must be associated with a specific club during registration or role assignment.

### 3. Super Admin
**Description**: System administrators with complete access to all features and data.

**Primary Purpose**: System management, user administration, and oversight of all booking activities.

**Access Level**: All permissions across the entire system

## 📋 Detailed Permission Matrix

### Authentication & Profile Management

| Permission | Regular User | Club Admin | Super Admin |
|------------|--------------|------------|-------------|
| Register Account | ✅ | ✅ | ✅ |
| Login/Logout | ✅ | ✅ | ✅ |
| View Own Profile | ✅ | ✅ | ✅ |
| Update Own Profile | ✅ | ✅ | ✅ |
| Change Own Password | ✅ | ✅ | ✅ |
| View Other User Profiles | ❌ | ❌ | ✅ |
| Manage User Accounts | ❌ | ❌ | ✅ |
| Change User Roles | ❌ | ❌ | ✅ |
| Deactivate User Accounts | ❌ | ❌ | ✅ |

### Slot Management

| Permission | Regular User | Club Admin | Super Admin |
|------------|--------------|------------|-------------|
| View Available Slots | ✅ | ✅ | ✅ |
| View All Slots | ❌ | ✅ | ✅ |
| View Slot Details | ✅ | ✅ | ✅ |
| Search/Filter Slots | ✅ | ✅ | ✅ |
| Create New Slots | ❌ | ❌ | ✅ |
| Edit Slot Information | ❌ | ❌ | ✅ |
| Delete Slots | ❌ | ❌ | ✅ |
| Book Available Slots | ❌ | ✅ | ✅ |
| Cancel Slot Bookings | ❌ | Own only | ✅ |

### Booking Management

| Permission | Regular User | Club Admin | Super Admin |
|------------|--------------|------------|-------------|
| Create Bookings | ❌ | ✅ | ✅ |
| View Own Bookings | ❌ | ✅ | ✅ |
| View All Bookings | ❌ | ❌ | ✅ |
| Edit Own Bookings | ❌ | ✅* | ✅ |
| Cancel Own Bookings | ❌ | ✅ | ✅ |
| Approve Bookings | ❌ | ❌ | ✅ |
| Reject Bookings | ❌ | ❌ | ✅ |
| View Booking History | ❌ | Own club | ✅ |

*\*Only before approval*

### Administrative Functions

| Permission | Regular User | Club Admin | Super Admin |
|------------|--------------|------------|-------------|
| Access Admin Dashboard | ❌ | Limited | ✅ |
| View System Analytics | ❌ | Own club stats | ✅ |
| Generate Reports | ❌ | Own club reports | ✅ |
| Manage Club Information | ❌ | Own club | ✅ |
| System Configuration | ❌ | ❌ | ✅ |
| Backup/Restore Data | ❌ | ❌ | ✅ |
| View System Logs | ❌ | ❌ | ✅ |

## 🎭 Role-Specific Features

### Regular User Features

**Dashboard Access**:
- Public slot viewing interface
- Event calendar with available slots
- Basic search and filtering

**Limitations**:
- Cannot create bookings
- No access to administrative features
- Cannot view booking details

**Use Cases**:
- Students checking event schedules
- Faculty viewing available venues
- Visitors browsing upcoming events

### Club Admin Features

**Booking Management**:
```javascript
// Example booking creation
const booking = {
  slot: "slot_id",
  eventName: "Technical Workshop",
  eventDescription: "React.js fundamentals",
  expectedParticipants: 50,
  requirements: ["Projector", "Microphone"],
  contactPerson: {
    name: "John Doe",
    phone: "1234567890",
    email: "john@club.com"
  }
};
```

**Club Dashboard**:
- View club-specific booking history
- Track booking status (pending, approved, rejected)
- Manage upcoming events
- Basic analytics for club activities

**Restrictions**:
- Can only book slots (cannot create slots)
- Cannot approve their own bookings
- Limited to their assigned club's activities
- Cannot view other clubs' booking details

**Workflow**:
1. Browse available slots
2. Submit booking request
3. Wait for admin approval
4. Manage approved bookings

### Super Admin Features

**Complete System Control**:
- Full CRUD operations on all entities
- User management and role assignment
- System configuration and settings
- Advanced analytics and reporting

**Slot Management**:
```javascript
// Example slot creation
const slot = {
  date: "2023-07-15",
  startTime: "09:00",
  endTime: "11:00",
  venue: "Auditorium",
  capacity: 200,
  status: "available"
};
```

**Booking Approval Workflow**:
```javascript
// Approve booking
await approveBooking(bookingId, {
  approvalNotes: "Event approved with conditions",
  specialInstructions: "Ensure proper ventilation"
});

// Reject booking
await rejectBooking(bookingId, {
  reason: "Venue not suitable for this event type",
  suggestions: "Consider using Seminar Hall instead"
});
```

**Advanced Features**:
- Bulk operations on slots and bookings
- Automated report generation
- System health monitoring
- Security audit logs

## 🔐 Access Control Implementation

### Frontend Route Protection

```javascript
// Route protection based on user role
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Usage in routing
<Route path="/admin" element={
  <ProtectedRoute requiredRole="super_admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Backend Middleware

```javascript
// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage in routes
router.post('/slots', requireRole(['super_admin']), createSlot);
router.post('/bookings', requireRole(['club_admin', 'super_admin']), createBooking);
```

### Permission Helper Functions

```javascript
// Permission checking utilities
export const hasPermission = (userRole, requiredPermission) => {
  const permissions = {
    user: ['view_slots', 'view_events'],
    club_admin: ['view_slots', 'view_events', 'book_slots', 'manage_own_bookings'],
    super_admin: ['*'] // All permissions
  };
  
  return permissions[userRole]?.includes(requiredPermission) || 
         permissions[userRole]?.includes('*');
};

export const canBookSlots = (user) => {
  return ['club_admin', 'super_admin'].includes(user?.role);
};

export const canManageUsers = (user) => {
  return user?.role === 'super_admin';
};

export const canApproveBookings = (user) => {
  return user?.role === 'super_admin';
};
```

## 🎯 Role Assignment and Management

### Initial Role Assignment

**During Registration**:
- Default role: `user`
- Club admin role requires additional verification
- Super admin role assigned manually by existing super admin

**Registration Flow for Club Admin**:
```javascript
const registerClubAdmin = async (userData) => {
  // Requires approval from super admin
  const pendingUser = await User.create({
    ...userData,
    role: 'user', // Temporary role
    pendingRole: 'club_admin',
    club: userData.club,
    status: 'pending_verification'
  });
  
  // Notify super admin for approval
  await notifyAdminForApproval(pendingUser);
};
```

### Role Transition Workflows

**User → Club Admin**:
1. User requests club admin privileges
2. Super admin reviews request
3. Super admin approves/rejects
4. Role updated with club association

**Club Admin → Super Admin**:
- Only possible through direct super admin assignment
- Requires thorough verification process
- Cannot be self-requested

### Role Revocation

**Temporary Suspension**:
```javascript
const suspendUser = async (userId, reason, duration) => {
  await User.findByIdAndUpdate(userId, {
    isActive: false,
    suspensionReason: reason,
    suspensionEnd: new Date(Date.now() + duration),
    suspendedBy: req.user._id
  });
};
```

**Permanent Role Change**:
- Super admin can downgrade any user
- Automatic notifications sent to affected user
- All active sessions invalidated

## 📊 Role-Based Analytics

### User Analytics Dashboard

**Regular Users**:
- Personal activity summary
- Favorite events and venues

**Club Admins**:
- Club booking statistics
- Event success rates
- Venue utilization for their club

**Super Admins**:
- System-wide analytics
- User role distribution
- Booking approval trends
- Security audit reports

### Permission Audit Trail

```javascript
// Log all permission-based actions
const auditLog = {
  userId: req.user._id,
  action: 'booking_approved',
  resource: 'booking',
  resourceId: bookingId,
  timestamp: new Date(),
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
};
```

## 🔒 Security Considerations

### Role Security Best Practices

1. **Principle of Least Privilege**: Users get minimum necessary permissions
2. **Regular Access Reviews**: Periodic review of user roles and permissions
3. **Audit Logging**: All role-based actions are logged
4. **Session Management**: Role changes invalidate active sessions
5. **Multi-factor Authentication**: Required for super admin accounts

### Preventing Privilege Escalation

```javascript
// Prevent role self-modification
const updateUserRole = async (userId, newRole) => {
  // Users cannot modify their own roles
  if (userId === req.user._id) {
    throw new Error('Cannot modify your own role');
  }
  
  // Only super admins can assign super admin role
  if (newRole === 'super_admin' && req.user.role !== 'super_admin') {
    throw new Error('Insufficient permissions');
  }
};
```

### Token-Based Security

```javascript
// JWT token includes role information
const generateToken = (user) => {
  return jwt.sign({
    userId: user._id,
    role: user.role,
    club: user.club,
    permissions: getPermissions(user.role)
  }, JWT_SECRET);
};
```

## 📝 Role Migration and Updates

### Database Migration Scripts

When adding new roles or permissions:

```javascript
// Migration script example
const migrateUserRoles = async () => {
  // Add new permission fields
  await User.updateMany(
    { role: 'club_admin' },
    { $set: { permissions: ['book_slots', 'manage_own_bookings'] } }
  );
  
  // Create default super admin if none exists
  const superAdminExists = await User.findOne({ role: 'super_admin' });
  if (!superAdminExists) {
    await createDefaultSuperAdmin();
  }
};
```

### Backward Compatibility

- Old tokens remain valid until expiration
- Gradual permission updates
- Feature flags for role-based features

This comprehensive role system ensures proper access control while maintaining flexibility for future enhancements and security requirements.