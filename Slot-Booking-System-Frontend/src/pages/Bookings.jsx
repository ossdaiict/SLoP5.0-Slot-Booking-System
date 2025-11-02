import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Footer from '../components/ui/Footer';
import { bookingAPI } from '../services/bookingAPI';

const Bookings = ({ user }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch bookings based on user role
      const response = user?.role === 'super_admin' 
        ? await bookingAPI.getAllBookings()
        : await bookingAPI.getMyBookings();
      
      // Handle different response structures
      const bookingsData = response.data?.data?.bookings || response.data?.data || response.data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      // Don't redirect to login if backend is just down
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bookings';
      
      // If backend is down, show friendly message instead of error
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Backend server is not running. Please start the backend server to view bookings.');
      } else if (err.response?.status === 401) {
        // Real auth error - this will be handled by the interceptor
        setError('Session expired. Please login again.');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingAPI.deleteBooking(bookingId);
      // Remove booking from state
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete booking');
      console.error('Error deleting booking:', err);
    }
  };

  // Helper function to check if user can edit/delete booking
  const canEditDelete = (booking) => {
    if (!user) return false;
    // Super admin can edit/delete any booking
    if (user.role === 'super_admin') return true;
    // Check if current user is the booking owner
    const bookingUserId = booking.user?._id || booking.user || booking.userId;
    const currentUserId = user._id || user.id;
    return String(bookingUserId) === String(currentUserId);
  };

  // Helper to format booking data for display
  const formatBooking = (booking) => {
    const slot = booking.slot || {};
    return {
      id: booking._id || booking.id,
      eventName: booking.eventName,
      venue: slot.venue || booking.venue || 'N/A',
      date: slot.date || booking.date,
      startTime: slot.startTime || booking.startTime || 'N/A',
      endTime: slot.endTime || booking.endTime || 'N/A',
      status: booking.status,
      club: booking.club,
      participants: booking.expectedParticipants || booking.participants || 0,
      user: booking.user,
      userId: booking.user?._id || booking.user || booking.userId
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900';
      case 'rejected':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-wrap items-center justify-center pt-20">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {user?.role === 'super_admin' ? 'All Bookings' : 'My Bookings'}
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track your booking requests
            </p>
          </div>
          {user?.role !== 'user' && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/bookings/new')}
            >
              New Booking
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="ml-3 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No bookings found</p>
            {user?.role !== 'user' && (
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => navigate('/bookings/new')}
                className="mt-4"
              >
                Create Your First Booking
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking, index) => {
              const formattedBooking = formatBooking(booking);
              return (
                <Card
                  key={formattedBooking.id}
                  className="p-6 animate-slideIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {formattedBooking.eventName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formattedBooking.club}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${getStatusColor(formattedBooking.status)}`}>
                      {formattedBooking.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {formattedBooking.date && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-900" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm font-semibold">
                            {new Date(formattedBooking.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-900" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Time</p>
                        <p className="text-sm font-semibold">
                          {formattedBooking.startTime} - {formattedBooking.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg mt-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">Venue</p>
                      <p className="text-sm font-semibold text-gray-900">{formattedBooking.venue}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 font-medium mb-1">Expected Participants</p>
                      <p className="text-sm font-semibold text-gray-900">{formattedBooking.participants} people</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      className="flex-1"
                      onClick={() => navigate(`/bookings/${formattedBooking.id}`)}
                    >
                      View
                    </Button>
                    {formattedBooking.status === 'pending' && canEditDelete(booking) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={() => navigate(`/bookings/edit/${formattedBooking.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(formattedBooking.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <div className='w-full mt-4'>
        <Footer />
      </div>
    </div>
  );
};

export default Bookings;

