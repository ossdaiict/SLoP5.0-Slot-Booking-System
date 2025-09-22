# State Management with Zustand

This document provides comprehensive documentation for the Zustand state management implementation in the Slot Booking System.

## 🎯 Overview

The application uses Zustand for state management, providing a lightweight and intuitive approach to handling global state. The state is organized into three main stores:

- **authStore**: Authentication and user management
- **slotStore**: Slot data and operations
- **bookingStore**: Booking management

## 🏪 Store Architecture

### Design Principles

1. **Single Responsibility**: Each store handles one domain
2. **Immutable Updates**: State is updated immutably
3. **Optimistic Updates**: UI updates immediately for better UX
4. **Error Handling**: Consistent error state management
5. **Persistence**: Critical data persisted to localStorage

## 🔐 Authentication Store (authStore.js)

Manages user authentication, session persistence, and role-based access control.

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/authAPI';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true,
            loading: false 
          });
          
          return response.data;
        } catch (error) {
          set({ 
            error: error.message, 
            loading: false 
          });
          throw error;
        }
      },
      
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: error.message, 
            loading: false 
          });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            error: null 
          });
        }
      },
      
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
      
      clearError: () => set({ error: null }),
      
      // Getters
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'club_admin' || user?.role === 'super_admin';
      },
      
      isSuperAdmin: () => {
        const { user } = get();
        return user?.role === 'super_admin';
      },
      
      getUser: () => get().user,
      getToken: () => get().token,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

### Authentication Store Features

- **Persistent Session**: User data persists across browser sessions
- **Role-based Helpers**: Built-in role checking methods
- **Async Actions**: Handles API calls with loading and error states
- **Automatic Token Management**: Token storage and retrieval
- **Security**: Sensitive data excluded from logs

## 🎰 Slot Store (slotStore.js)

Manages slot data, filtering, and booking operations.

```javascript
import { create } from 'zustand';
import { slotAPI } from '../services/slotAPI';

export const useSlotStore = create((set, get) => ({
  // State
  slots: [],
  loading: false,
  error: null,
  filters: {
    date: null,
    venue: '',
    status: 'available',
    timeRange: 'all'
  },
  selectedSlot: null,
  
  // Actions
  setFilters: (newFilters) => {
    set({ 
      filters: { ...get().filters, ...newFilters } 
    });
    // Auto-fetch when filters change
    get().fetchSlots();
  },
  
  clearFilters: () => {
    set({ 
      filters: {
        date: null,
        venue: '',
        status: 'available',
        timeRange: 'all'
      }
    });
    get().fetchSlots();
  },
  
  fetchSlots: async () => {
    set({ loading: true, error: null });
    try {
      const response = await slotAPI.getSlots(get().filters);
      set({ 
        slots: response.data, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
  
  fetchAvailableSlots: async () => {
    set({ loading: true, error: null });
    try {
      const response = await slotAPI.getAvailableSlots();
      set({ 
        slots: response.data, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
  
  fetchSlotById: async (slotId) => {
    set({ loading: true, error: null });
    try {
      const response = await slotAPI.getSlotById(slotId);
      set({ 
        selectedSlot: response.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },
  
  bookSlot: async (slotId, bookingData) => {
    const originalSlots = get().slots;
    
    // Optimistic update
    const updatedSlots = originalSlots.map(slot =>
      slot._id === slotId 
        ? { ...slot, status: 'booked', eventName: bookingData.eventName }
        : slot
    );
    set({ slots: updatedSlots });
    
    try {
      const response = await slotAPI.bookSlot(slotId, bookingData);
      
      // Update with server response
      const finalSlots = originalSlots.map(slot =>
        slot._id === slotId ? response.data : slot
      );
      set({ slots: finalSlots });
      
      return response.data;
    } catch (error) {
      // Revert optimistic update on error
      set({ slots: originalSlots, error: error.message });
      throw error;
    }
  },
  
  createSlot: async (slotData) => {
    try {
      const response = await slotAPI.createSlot(slotData);
      set({ 
        slots: [...get().slots, response.data] 
      });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  updateSlot: async (slotId, slotData) => {
    const originalSlots = get().slots;
    
    // Optimistic update
    const updatedSlots = originalSlots.map(slot =>
      slot._id === slotId ? { ...slot, ...slotData } : slot
    );
    set({ slots: updatedSlots });
    
    try {
      const response = await slotAPI.updateSlot(slotId, slotData);
      const finalSlots = originalSlots.map(slot =>
        slot._id === slotId ? response.data : slot
      );
      set({ slots: finalSlots });
      return response.data;
    } catch (error) {
      set({ slots: originalSlots, error: error.message });
      throw error;
    }
  },
  
  deleteSlot: async (slotId) => {
    const originalSlots = get().slots;
    
    // Optimistic update
    const updatedSlots = originalSlots.filter(slot => slot._id !== slotId);
    set({ slots: updatedSlots });
    
    try {
      await slotAPI.deleteSlot(slotId);
    } catch (error) {
      set({ slots: originalSlots, error: error.message });
      throw error;
    }
  },
  
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  clearSelectedSlot: () => set({ selectedSlot: null }),
  clearError: () => set({ error: null }),
  
  // Computed getters
  getAvailableSlots: () => {
    return get().slots.filter(slot => slot.status === 'available');
  },
  
  getBookedSlots: () => {
    return get().slots.filter(slot => slot.status === 'booked');
  },
  
  getSlotsByVenue: (venue) => {
    return get().slots.filter(slot => slot.venue === venue);
  },
  
  getSlotsByDate: (date) => {
    const targetDate = new Date(date).toDateString();
    return get().slots.filter(slot => 
      new Date(slot.date).toDateString() === targetDate
    );
  },
  
  getTodaySlots: () => {
    const today = new Date().toDateString();
    return get().slots.filter(slot => 
      new Date(slot.date).toDateString() === today
    );
  },
  
  getUpcomingSlots: () => {
    const now = new Date();
    return get().slots.filter(slot => new Date(slot.date) > now);
  },
}));
```

### Slot Store Features

- **Real-time Filtering**: Automatic refetch when filters change
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Error Recovery**: Automatic rollback on failed operations
- **Computed Getters**: Derived state for common operations
- **Comprehensive CRUD**: Full slot management capabilities

## 📋 Booking Store (bookingStore.js)

Manages booking creation, approval workflow, and booking history.

```javascript
import { create } from 'zustand';
import { bookingAPI } from '../services/bookingAPI';

export const useBookingStore = create((set, get) => ({
  // State
  bookings: [],
  myBookings: [],
  loading: false,
  error: null,
  selectedBooking: null,
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  },
  
  // Actions
  fetchAllBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.getAllBookings();
      const bookings = response.data;
      
      // Calculate stats
      const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length,
        rejected: bookings.filter(b => b.status === 'rejected').length
      };
      
      set({ 
        bookings, 
        stats,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
  
  fetchMyBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.getMyBookings();
      set({ 
        myBookings: response.data, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
  
  fetchBookingById: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.getBookingById(bookingId);
      set({ 
        selectedBooking: response.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },
  
  createBooking: async (bookingData) => {
    try {
      const response = await bookingAPI.createBooking(bookingData);
      const newBooking = response.data;
      
      set({ 
        myBookings: [...get().myBookings, newBooking],
        stats: {
          ...get().stats,
          total: get().stats.total + 1,
          pending: get().stats.pending + 1
        }
      });
      
      return newBooking;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  updateBookingStatus: async (bookingId, status, rejectionReason = null) => {
    const originalBookings = get().bookings;
    const originalMyBookings = get().myBookings;
    const originalStats = get().stats;
    
    // Find the booking to update
    const bookingToUpdate = originalBookings.find(b => b._id === bookingId) ||
                           originalMyBookings.find(b => b._id === bookingId);
    
    if (!bookingToUpdate) {
      throw new Error('Booking not found');
    }
    
    // Optimistic update
    const updateBooking = (bookings) => 
      bookings.map(booking =>
        booking._id === bookingId 
          ? { ...booking, status, rejectionReason }
          : booking
      );
    
    const updatedBookings = updateBooking(originalBookings);
    const updatedMyBookings = updateBooking(originalMyBookings);
    
    // Update stats optimistically
    const newStats = { ...originalStats };
    const oldStatus = bookingToUpdate.status;
    
    if (oldStatus !== status) {
      newStats[oldStatus] = Math.max(0, newStats[oldStatus] - 1);
      newStats[status] = newStats[status] + 1;
    }
    
    set({ 
      bookings: updatedBookings, 
      myBookings: updatedMyBookings,
      stats: newStats
    });
    
    try {
      const response = await bookingAPI.updateStatus(bookingId, status, rejectionReason);
      
      // Update with server response
      const finalUpdateBooking = (bookings) =>
        bookings.map(booking =>
          booking._id === bookingId ? response.data : booking
        );
      
      set({
        bookings: finalUpdateBooking(originalBookings),
        myBookings: finalUpdateBooking(originalMyBookings)
      });
      
      return response.data;
    } catch (error) {
      // Revert on error
      set({ 
        bookings: originalBookings, 
        myBookings: originalMyBookings,
        stats: originalStats,
        error: error.message 
      });
      throw error;
    }
  },
  
  cancelBooking: async (bookingId) => {
    return get().updateBookingStatus(bookingId, 'cancelled');
  },
  
  approveBooking: async (bookingId) => {
    return get().updateBookingStatus(bookingId, 'approved');
  },
  
  rejectBooking: async (bookingId, reason) => {
    return get().updateBookingStatus(bookingId, 'rejected', reason);
  },
  
  deleteBooking: async (bookingId) => {
    const originalBookings = get().bookings;
    const originalMyBookings = get().myBookings;
    
    // Optimistic update
    const updatedBookings = originalBookings.filter(b => b._id !== bookingId);
    const updatedMyBookings = originalMyBookings.filter(b => b._id !== bookingId);
    
    set({ 
      bookings: updatedBookings, 
      myBookings: updatedMyBookings 
    });
    
    try {
      await bookingAPI.deleteBooking(bookingId);
    } catch (error) {
      set({ 
        bookings: originalBookings, 
        myBookings: originalMyBookings, 
        error: error.message 
      });
      throw error;
    }
  },
  
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  clearSelectedBooking: () => set({ selectedBooking: null }),
  clearError: () => set({ error: null }),
  
  // Computed getters
  getPendingBookings: () => {
    return get().bookings.filter(booking => booking.status === 'pending');
  },
  
  getApprovedBookings: () => {
    return get().bookings.filter(booking => booking.status === 'approved');
  },
  
  getRejectedBookings: () => {
    return get().bookings.filter(booking => booking.status === 'rejected');
  },
  
  getBookingsByClub: (club) => {
    return get().bookings.filter(booking => booking.club === club);
  },
  
  getMyPendingBookings: () => {
    return get().myBookings.filter(booking => booking.status === 'pending');
  },
  
  getMyApprovedBookings: () => {
    return get().myBookings.filter(booking => booking.status === 'approved');
  },
  
  getRecentBookings: (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return get().bookings.filter(booking => 
      new Date(booking.createdAt) > cutoffDate
    );
  },
}));
```

### Booking Store Features

- **Comprehensive Workflow**: Full booking lifecycle management
- **Real-time Stats**: Automatic statistics calculation
- **Optimistic Updates**: Immediate feedback for status changes
- **Error Recovery**: Automatic rollback on failures
- **Rich Filtering**: Multiple ways to filter and query bookings

## 🔧 Store Usage Patterns

### Component Integration

```javascript
// Using multiple stores in a component
import { useAuthStore, useSlotStore, useBookingStore } from '../stores';

const BookingPage = () => {
  const { user, isAdmin } = useAuthStore();
  const { slots, fetchAvailableSlots, bookSlot } = useSlotStore();
  const { createBooking } = useBookingStore();
  
  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);
  
  const handleBooking = async (slotId, bookingData) => {
    try {
      // Create booking record
      await createBooking(bookingData);
      
      // Update slot status
      await bookSlot(slotId, bookingData);
      
      // Success feedback
      toast.success('Slot booked successfully!');
    } catch (error) {
      toast.error(`Booking failed: ${error.message}`);
    }
  };
  
  return (
    // Component JSX
  );
};
```

### Selective Subscriptions

```javascript
// Subscribe to specific parts of the store
const BookingStats = () => {
  const stats = useBookingStore(state => state.stats);
  const loading = useBookingStore(state => state.loading);
  
  // Component only re-renders when stats or loading changes
  return (
    <div>
      <h3>Booking Statistics</h3>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <p>Total: {stats.total}</p>
          <p>Pending: {stats.pending}</p>
          <p>Approved: {stats.approved}</p>
        </div>
      )}
    </div>
  );
};
```

### Store Actions in Event Handlers

```javascript
// Admin approval component
const AdminPanel = () => {
  const { approveBooking, rejectBooking, getPendingBookings } = useBookingStore();
  const pendingBookings = useBookingStore(getPendingBookings);
  
  const handleApproval = async (bookingId) => {
    try {
      await approveBooking(bookingId);
      toast.success('Booking approved successfully!');
    } catch (error) {
      toast.error(`Approval failed: ${error.message}`);
    }
  };
  
  const handleRejection = async (bookingId, reason) => {
    try {
      await rejectBooking(bookingId, reason);
      toast.success('Booking rejected successfully!');
    } catch (error) {
      toast.error(`Rejection failed: ${error.message}`);
    }
  };
  
  return (
    // Component JSX
  );
};
```

## 🚀 Performance Optimizations

### Memoization with Selectors

```javascript
// Use selectors for computed values
const useAvailableSlotsByVenue = (venue) => {
  return useSlotStore(
    useCallback(
      state => state.slots.filter(
        slot => slot.status === 'available' && slot.venue === venue
      ),
      [venue]
    )
  );
};
```

### Batch Updates

```javascript
// Batch multiple state updates
const batchUpdateSlots = (updates) => {
  useSlotStore.setState(state => ({
    slots: state.slots.map(slot => {
      const update = updates.find(u => u.id === slot._id);
      return update ? { ...slot, ...update.data } : slot;
    })
  }));
};
```

## 🧪 Testing Store Actions

```javascript
// Example test for slot booking
import { useSlotStore } from '../stores/slotStore';
import { renderHook, act } from '@testing-library/react';

describe('slotStore', () => {
  it('should book a slot successfully', async () => {
    const { result } = renderHook(() => useSlotStore());
    
    // Mock initial state
    act(() => {
      result.current.slots = [
        { _id: '1', status: 'available', venue: 'Auditorium' }
      ];
    });
    
    // Test booking action
    await act(async () => {
      await result.current.bookSlot('1', { eventName: 'Test Event' });
    });
    
    expect(result.current.slots[0].status).toBe('booked');
    expect(result.current.slots[0].eventName).toBe('Test Event');
  });
});
```

## 📝 Best Practices

### State Structure
- Keep state flat and normalized
- Use computed getters instead of derived state
- Implement optimistic updates for better UX

### Action Design
- Make actions pure and predictable
- Handle loading and error states consistently
- Implement proper error recovery

### Performance
- Use selective subscriptions to minimize re-renders
- Implement proper memoization for expensive computations
- Batch related updates together

### Testing
- Test actions independently of components
- Mock API calls for unit tests
- Use integration tests for store interactions