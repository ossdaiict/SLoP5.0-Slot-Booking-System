import React from 'react';
import Card from '../components/ui/Card';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with us</p>
        </div>
        
        <Card className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">University Address</h3>
                  <p className="text-gray-600">
                    Dhirubhai Ambani Institute of Information and Communication Technology<br />
                    Near Indroda Circle<br />
                    Gandhinagar, Gujarat 382007
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">
                    General Inquiries: <span className="text-gray-900 font-medium">info@daiict.ac.in</span><br />
                    Technical Support: <span className="text-gray-900 font-medium">support@daiict.ac.in</span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+91 (79) 3051-0000</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Office Hours</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">For Slot Booking Issues</h3>
                <p className="text-gray-600">
                  Please contact your club coordinator or the student council for assistance with slot booking-related queries.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;