import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Mail, Phone, User, Plus, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Footer from '../components/ui/Footer';

const NewBooking = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requirementInput, setRequirementInput] = useState('');

  // Mock available slots data
  const availableSlots = [
    {
      _id: '1',
      venue: 'Auditorium',
      date: '2024-04-01',
      startTime: '09:00',
      endTime: '12:00',
      capacity: 500,
      status: 'available'
    },
    {
      _id: '2',
      venue: 'Seminar Hall',
      date: '2024-04-02',
      startTime: '14:00',
      endTime: '17:00',
      capacity: 200,
      status: 'available'
    },
    {
      _id: '3',
      venue: 'Conference Room',
      date: '2024-04-03',
      startTime: '10:00',
      endTime: '13:00',
      capacity: 100,
      status: 'available'
    },
    {
      _id: '4',
      venue: 'Library Hall',
      date: '2024-04-04',
      startTime: '15:00',
      endTime: '18:00',
      capacity: 150,
      status: 'available'
    }
  ];

  const [formData, setFormData] = useState({
    slot: '',
    eventName: '',
    eventDescription: '',
    expectedParticipants: '',
    club: user?.club || 'Technical Club',
    contactPerson: {
      name: user?.name || '',
      phone: '',
      email: user?.email || ''
    },
    requirements: [],
    specialInstructions: ''
  });

  const selectedSlot = availableSlots.find(s => s._id === formData.slot);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contactPerson.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        contactPerson: {
          ...formData.contactPerson,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    setError('');
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim() && formData.requirements.length < 10) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()]
      });
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    if (!formData.slot) {
      setError('Please select a slot');
      return false;
    }
    if (!formData.eventName.trim()) {
      setError('Event name is required');
      return false;
    }
    if (!formData.eventDescription.trim()) {
      setError('Event description is required');
      return false;
    }
    if (!formData.expectedParticipants || formData.expectedParticipants < 1) {
      setError('Expected participants must be at least 1');
      return false;
    }
    if (selectedSlot && formData.expectedParticipants > selectedSlot.capacity) {
      setError(`Expected participants (${formData.expectedParticipants}) exceed slot capacity (${selectedSlot.capacity})`);
      return false;
    }
    if (!formData.contactPerson.name.trim()) {
      setError('Contact person name is required');
      return false;
    }
    if (!formData.contactPerson.phone.trim() || !/^[0-9]{10}$/.test(formData.contactPerson.phone)) {
      setError('Contact person phone must be 10 digits');
      return false;
    }
    if (!formData.contactPerson.email.trim() || !/\S+@\S+\.\S+/.test(formData.contactPerson.email)) {
      setError('Valid contact person email is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      setLoading(false);
      navigate('/bookings', { 
        state: { message: 'Booking created successfully! Your request is pending approval.' } 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-wrap items-center justify-center pt-20">
      <div className="max-w-3xl mx-auto w-full animate-fadeIn">
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
              Create New Booking
            </h1>
            <p className="text-gray-600">
              Book a slot for your event
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Slot *
              </label>
              <select
                name="slot"
                value={formData.slot}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                required
              >
                <option value="">-- Select a slot --</option>
                {availableSlots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {new Date(slot.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} - {slot.venue} ({slot.startTime} - {slot.endTime}) - Capacity: {slot.capacity}
                  </option>
                ))}
              </select>
              
              {selectedSlot && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Selected Slot Details:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                    <div><span className="font-medium">Venue:</span> {selectedSlot.venue}</div>
                    <div><span className="font-medium">Capacity:</span> {selectedSlot.capacity}</div>
                    <div><span className="font-medium">Date:</span> {new Date(selectedSlot.date).toLocaleDateString()}</div>
                    <div><span className="font-medium">Time:</span> {selectedSlot.startTime} - {selectedSlot.endTime}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Name */}
            <Input
              label="Event Name *"
              type="text"
              name="eventName"
              placeholder="Enter event name"
              value={formData.eventName}
              onChange={handleChange}
              required
            />

            {/* Event Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Description *
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none"
                placeholder="Describe your event..."
                required
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.eventDescription.length}/1000 characters</p>
            </div>

            {/* Expected Participants */}
            <Input
              label="Expected Participants *"
              type="number"
              name="expectedParticipants"
              placeholder="Enter number of participants"
              icon={Users}
              value={formData.expectedParticipants}
              onChange={handleChange}
              min="1"
              max={selectedSlot?.capacity || 1000}
              required
            />
            {selectedSlot && formData.expectedParticipants && (
              <p className="text-xs text-gray-500 mt-1">
                Slot capacity: {selectedSlot.capacity} {formData.expectedParticipants > selectedSlot.capacity && (
                  <span className="text-red-600 font-medium">⚠ Exceeds capacity!</span>
                )}
              </p>
            )}

            {/* Club (auto-filled for club_admin) */}
            {user?.role === 'club_admin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Club *
                </label>
                <input
                  type="text"
                  value={formData.club || user?.club || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Your club (cannot be changed)</p>
              </div>
            )}

            {/* Contact Person Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Person Details *</h3>
              
              <div className="space-y-4">
                <Input
                  label="Name *"
                  type="text"
                  name="contactPerson.name"
                  placeholder="Contact person name"
                  icon={User}
                  value={formData.contactPerson.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone *"
                  type="tel"
                  name="contactPerson.phone"
                  placeholder="10-digit phone number"
                  icon={Phone}
                  value={formData.contactPerson.phone}
                  onChange={handleChange}
                  required
                  maxLength="10"
                />

                <Input
                  label="Email *"
                  type="email"
                  name="contactPerson.email"
                  placeholder="contact@example.com"
                  icon={Mail}
                  value={formData.contactPerson.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                  placeholder="Add requirement (e.g., Projector, Microphone)"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  disabled={!requirementInput.trim() || formData.requirements.length >= 10}
                  icon={Plus}
                >
                  Add
                </Button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.requirements.length}/10 requirements (optional)
              </p>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none"
                placeholder="Any special instructions or notes..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.specialInstructions.length}/500 characters</p>
            </div>

            {/* Submit Buttons */}
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
                disabled={loading || !formData.slot}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Booking'
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

export default NewBooking;

