import React from 'react';
import { User, Mail, Building, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Footer from '../components/ui/Footer';

const Profile = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-wrap items-center justify-center pt-20">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

        <Card className="p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl">
              <User className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-gray-900" />
                <span className="text-sm font-semibold text-gray-700">Email</span>
              </div>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>

            {user?.club && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Building className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-semibold text-gray-700">Club</span>
                </div>
                <p className="text-gray-900 font-medium">{user.club}</p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-gray-900" />
                <span className="text-sm font-semibold text-gray-700">Role</span>
              </div>
              <p className="text-gray-900 font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </Card>
      </div>
      <div className='w-full mt-4'>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;

