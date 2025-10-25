import React from 'react';
import Card from '../components/ui/Card';

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">Get help with SlotBooker</p>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How do I book a slot?</h3>
                  <p className="text-gray-600">Navigate to the Slots page, select an available time slot, and confirm your booking.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Who can book slots?</h3>
                  <p className="text-gray-600">Club admins and super admins can book slots. Regular users can view available slots.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">What if I need to cancel a booking?</h3>
                  <p className="text-gray-600">Go to your Bookings page and cancel the booking from there.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Support</h2>
              <p className="text-gray-600 mb-4">
                If you need further assistance, please contact the university administration or your club coordinator.
              </p>
              <p className="text-gray-600">
                Email: <span className="text-gray-900 font-medium">support@daiict.ac.in</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;