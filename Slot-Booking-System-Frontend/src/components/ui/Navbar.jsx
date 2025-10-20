import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Calendar, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import Button from './Button';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Active link styles for desktop
  const getDesktopLinkClass = ({ isActive }) => {
    return `px-4 py-2 font-medium transition-colors duration-200 ${
      isActive 
        ? 'text-white bg-black rounded-lg shadow-sm' 
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg'
    }`;
  };

  // Active link styles for mobile
  const getMobileLinkClass = ({ isActive }) => {
    return `block px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'text-gray-900 bg-gray-100 font-semibold' 
        : 'text-gray-700 hover:bg-gray-50'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
              SlotBooker
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <NavLink 
                to="/dashboard"
                className={getDesktopLinkClass}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/slots"
                className={getDesktopLinkClass}
              >
                Slots
              </NavLink>
              {(user.role === 'club_admin' || user.role === 'super_admin') && (
                <NavLink 
                  to="/bookings"
                  className={getDesktopLinkClass}
                >
                  Bookings
                </NavLink>
              )}
              
              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <div className="relative group">
                  <button className="p-2 rounded-full bg-gradient-to-br from-gray-900 to-black text-white hover:shadow-lg transition-all duration-300">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded-t-xl transition-colors duration-200 ${
                          isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-b-xl transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-fadeIn">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <div className="pb-3 mb-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <NavLink
                  to="/dashboard"
                  className={getMobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/slots"
                  className={getMobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Slots
                </NavLink>
                {(user.role === 'club_admin' || user.role === 'super_admin') && (
                  <NavLink
                    to="/bookings"
                    className={getMobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bookings
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className={getMobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;