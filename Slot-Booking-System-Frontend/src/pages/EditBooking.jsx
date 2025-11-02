import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Footer from '../components/ui/Footer';

const EditBooking = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, you'd fetch this by ID
  const bookingData = {
    id: parseInt(id),
    eventName: 'Tech Workshop',
    venue: 'Main Auditorium',
    date: '2024-03-15',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    status: 'approved',
    club: 'Tech Club',
    participants: 200,
    description: 'A workshop on modern web technologies'
  };

  // Convert AM/PM time to 24-hour format for input
  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    eventName: bookingData.eventName,
    venue: bookingData.venue,
    date: bookingData.date,
    startTime: convertTo24Hour(bookingData.startTime),
    endTime: convertTo24Hour(bookingData.endTime),
    participants: bookingData.participants,
    description: bookingData.description,
    status: bookingData.status
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert back to AM/PM format for display
    const convertToAmPm = (timeStr) => {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const modifier = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${modifier}`;
    };

    const updatedBooking = {
      ...formData,
      startTime: convertToAmPm(formData.startTime),
      endTime: convertToAmPm(formData.endTime),
      club: bookingData.club
    };

    console.log('Updated booking:', updatedBooking);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/bookings');
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-wrap items-center justify-center pt-20">
      <div className="max-w-2xl mx-auto w-full animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/bookings')}
            className="p-2"
          >
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Edit Booking
            </h1>
            <p className="text-gray-600">
              Update your booking details
            </p>
          </div>
        </div>


        {/* Edit Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Event Name"
              type="text"
              name="eventName"
              placeholder="Enter event name"
              value={formData.eventName}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                name="date"
                icon={Calendar}
                value={formData.date}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Time"
                  type="time"
                  name="startTime"
                  icon={Clock}
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="End Time"
                  type="time"
                  name="endTime"
                  icon={Clock}
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Input
              label="Venue"
              type="text"
              name="venue"
              placeholder="Enter venue"
              icon={MapPin}
              value={formData.venue}
              onChange={handleChange}
              required
            />

            <Input
              label="Expected Participants"
              type="number"
              name="participants"
              placeholder="Enter number of participants"
              icon={Users}
              value={formData.participants}
              onChange={handleChange}
              min="1"
              required
            />

            {/* Status Field - Only for super_admin */}
            {user?.role === 'super_admin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Only super admins can change booking status
                </p>
              </div>
            )}

            {/* Status Display for non-super_admins */}
            {user?.role !== 'super_admin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold capitalize ${getStatusColor(formData.status)}`}>
                    {formData.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Status can only be changed by super admins
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none"
                placeholder="Describe your event..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/bookings')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Update Booking'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <div className='w-full mt-4'>
        <Footer />
      </div>
    </div>
  );
};

export default EditBooking;