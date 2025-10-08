import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Footer from '../components/ui/Footer';

const Slots = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const slots = [
    {
      id: 1,
      venue: 'Main Auditorium',
      date: '2024-03-15',
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      location: 'Building A, Ground Floor',
      capacity: 500,
      status: 'available'
    },
    {
      id: 2,
      venue: 'Seminar Hall 1',
      date: '2024-03-16',
      startTime: '02:00 PM',
      endTime: '05:00 PM',
      location: 'Building B, 2nd Floor',
      capacity: 100,
      status: 'available'
    },
    {
      id: 3,
      venue: 'Conference Room',
      date: '2024-03-17',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      location: 'Building C, 3rd Floor',
      capacity: 50,
      status: 'booked'
    },
    {
      id: 4,
      venue: 'Sports Complex',
      date: '2024-03-18',
      startTime: '04:00 PM',
      endTime: '07:00 PM',
      location: 'Sports Wing',
      capacity: 300,
      status: 'available'
    },
    {
      id: 5,
      venue: 'Computer Lab',
      date: '2024-03-19',
      startTime: '11:00 AM',
      endTime: '02:00 PM',
      location: 'Building D, 1st Floor',
      capacity: 60,
      status: 'available'
    },
    {
      id: 6,
      venue: 'Outdoor Stage',
      date: '2024-03-20',
      startTime: '06:00 PM',
      endTime: '09:00 PM',
      location: 'Central Campus',
      capacity: 1000,
      status: 'available'
    }
  ];

  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slot.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || slot.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const canBook = user && (user.role === 'club_admin' || user.role === 'super_admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Slots
          </h1>
          <p className="text-gray-600 text-lg">
            Browse and {canBook ? 'book' : 'view'} available time slots for your events
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by venue or location..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 font-medium"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
          </div>
        </Card>

        {/* Results Count */}
        <p className="text-gray-700 font-semibold mb-6">
          Showing {filteredSlots.length} slot{filteredSlots.length !== 1 ? 's' : ''}
        </p>

        {/* Slots Grid */}
        {filteredSlots.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-500">
              No slots found matching your criteria
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlots.map((slot, index) => (
              <Card
                key={slot.id}
                gradient={slot.status === 'available'}
                className="p-6 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {slot.venue}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      slot.status === 'available'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium">
                      {new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium">
                      {slot.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium">
                      Capacity: {slot.capacity}
                    </span>
                  </div>
                </div>

                {canBook && slot.status === 'available' && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => console.log('Book slot:', slot.id)}
                  >
                    Book Now
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Slots;

