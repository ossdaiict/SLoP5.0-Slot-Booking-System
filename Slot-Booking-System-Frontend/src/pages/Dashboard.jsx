import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Footer from '../components/ui/Footer';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Bookings',
      value: '24',
      change: '+12%',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Approvals',
      value: '5',
      change: '+3',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Approved',
      value: '18',
      change: '+8',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rejected',
      value: '1',
      change: '-50%',
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const recentBookings = [
    {
      id: 1,
      event: 'Tech Workshop',
      venue: 'Main Auditorium',
      date: '2024-03-15',
      time: '09:00 AM',
      status: 'approved'
    },
    {
      id: 2,
      event: 'Cultural Fest',
      venue: 'Outdoor Stage',
      date: '2024-03-20',
      time: '06:00 PM',
      status: 'pending'
    },
    {
      id: 3,
      event: 'Sports Meet',
      venue: 'Sports Complex',
      date: '2024-03-25',
      time: '04:00 PM',
      status: 'approved'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-wrap items-center justify-center pt-20">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your bookings today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/bookings')}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="p-4 border-2 border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition-all duration-300 animate-slideIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {booking.event}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.venue}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                icon={Calendar}
                onClick={() => navigate('/slots')}
              >
                Browse Slots
              </Button>
              {(user?.role === 'club_admin' || user?.role === 'super_admin') && (
                <>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    icon={CheckCircle}
                    onClick={() => navigate('/bookings/new')}
                  >
                    Create Booking
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={Users}
                    onClick={() => navigate('/analytics')}
                  >
                    View Analytics
                  </Button>
                </>
              )}
            </div>

            {/* User Info Card */}
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-gray-900 to-black rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Your Role</p>
                  <p className="text-xs text-gray-700 capitalize">
                    {user?.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              {user?.club && (
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Club:</span> {user.club}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
      <div className='w-full mt-4'>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;

