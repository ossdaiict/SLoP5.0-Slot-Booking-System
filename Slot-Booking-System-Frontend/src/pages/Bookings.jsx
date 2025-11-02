import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Footer from '../components/ui/Footer';

const Bookings = ({ user }) => {
  const navigate = useNavigate();

  const bookings = [
    {
      id: 1,
      eventName: 'Tech Workshop',
      venue: 'Main Auditorium',
      date: '2024-03-15',
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      status: 'approved',
      club: 'Tech Club',
      participants: 200,
      userId: user?.id || user?._id || '1' // Current user's booking
    },
    {
      id: 2,
      eventName: 'Cultural Fest',
      venue: 'Outdoor Stage',
      date: '2024-03-20',
      startTime: '06:00 PM',
      endTime: '09:00 PM',
      status: 'pending',
      club: 'Cultural Club',
      participants: 500,
      userId: '2' // Different user's booking
    },
    {
      id: 3,
      eventName: 'Sports Meet',
      venue: 'Sports Complex',
      date: '2024-03-25',
      startTime: '04:00 PM',
      endTime: '07:00 PM',
      status: 'pending',
      club: 'Sports Club',
      participants: 300,
      userId: user?.id || user?._id || '1' // Current user's booking
    }
  ];

  // Helper function to check if user can edit/delete a booking
  const canEditDelete = (booking) => {
    // Super admin can edit/delete any booking
    if (user?.role === 'super_admin') {
      return true;
    }
    
    // Check if current user is the owner
    const currentUserId = user?.id || user?._id;
    const bookingUserId = booking.userId || booking.user?._id || booking.user?.id;
    
    return currentUserId && bookingUserId && currentUserId === bookingUserId;
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

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking, index) => (
            <Card
              key={booking.id}
              className="p-6 animate-slideIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {booking.eventName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking.club}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Date</p>
                    <p className="text-sm font-semibold">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="text-sm font-semibold">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mt-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Venue</p>
                  <p className="text-sm font-semibold text-gray-900">{booking.venue}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">Expected Participants</p>
                  <p className="text-sm font-semibold text-gray-900">{booking.participants} people</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  className="flex-1"
                  onClick={() => console.log('View booking:', booking.id)}
                >
                  View
                </Button>
                {booking.status === 'pending' && canEditDelete(booking) && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => navigate(`/bookings/edit/${booking.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => console.log('Delete booking:', booking.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className='w-full mt-4'>
        <Footer />
      </div>
    </div>
  );
};

export default Bookings;

