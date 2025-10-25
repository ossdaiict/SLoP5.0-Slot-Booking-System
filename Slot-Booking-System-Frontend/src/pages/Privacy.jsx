import React from 'react';
import Card from '../components/ui/Card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">How we protect your data</p>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, update your profile, 
                or make a booking. This includes:
              </p>
              <ul className="text-gray-600 list-disc list-inside space-y-2">
                <li>Name and email address</li>
                <li>Account type and role</li>
                <li>Club information (for club admins)</li>
                <li>Booking history and preferences</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600">
                We use the information we collect to provide, maintain, and improve our services, to process your bookings, 
                and to communicate with you about updates and important notices.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <span className="text-gray-900 font-medium">privacy@daiict.ac.in</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;