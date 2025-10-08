import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-xl">
                <Calendar className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-2xl font-bold">SlotBooker</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Simplifying venue and slot booking for clubs and organizations. 
              Manage your events seamlessly with our intuitive platform.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@slotbooker.com"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/slots"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Browse Slots
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SlotBooker. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by GDG on Campus, DAU
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

