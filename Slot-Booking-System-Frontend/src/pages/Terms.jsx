import React from 'react';
import Card from '../components/ui/Card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Please read these terms carefully</p>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6 prose prose-gray max-w-none">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using SlotBooker, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600">
                Permission is granted to temporarily use SlotBooker for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Slot Booking Rules</h2>
              <ul className="text-gray-600 list-disc list-inside space-y-2">
                <li>Slots are available on a first-come, first-served basis</li>
                <li>Club admins are responsible for their bookings</li>
                <li>Double-booking is strictly prohibited</li>
                <li>Cancel bookings in advance if unable to use the slot</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-600">
                Users are responsible for maintaining the confidentiality of their account and password and for restricting 
                access to their computer or device.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;