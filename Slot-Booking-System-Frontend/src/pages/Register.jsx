import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Building, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Footer from '../components/ui/Footer';
import { authAPI } from '../services/authAPI';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    club: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    setError(''); // Clear general error when field changes

    if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (value.includes(' ')) {
        newErrors.password = 'Password cannot contain spaces';
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = 'Password must contain at least one capital letter';
      } else if (!/[a-z]/.test(value)) {
        newErrors.password = 'Password must contain at least one small letter';
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        newErrors.password = 'Password must contain at least one special character';
      } else {
        delete newErrors.password;
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (name === 'email') {
      if (!value) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'Email is invalid';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'name') {
      if (!value.trim()) {
        newErrors.name = 'Name is required';
      } else {
        delete newErrors.name;
      }
    }

    if (name === 'club' && formData.role === 'club_admin') {
      if (!value.trim()) {
        newErrors.club = 'Club name is required';
      } else {
        delete newErrors.club;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final validation before submit
    const finalErrors = {};

    if (!formData.name.trim()) finalErrors.name = 'Name is required';
    if (!formData.email.trim()) finalErrors.email = 'Email is required';
    if (!formData.password) finalErrors.password = 'Password is required';
    if (!formData.confirmPassword) finalErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) {
      finalErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.role === 'club_admin' && !formData.club.trim()) {
      finalErrors.club = 'Club name is required';
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      };

      // Add club only if role is club_admin
      if (formData.role === 'club_admin') {
        // Map club name to enum values expected by backend
        // Backend expects: 'Technical Club', 'Cultural Club', 'Sports Club', 'Literary Club', 'Other'
        const clubName = formData.club.trim();
        // Try to match with existing clubs, or use 'Other'
        const validClubs = ['Technical Club', 'Cultural Club', 'Sports Club', 'Literary Club', 'Other'];
        const matchedClub = validClubs.find(club => 
          club.toLowerCase() === clubName.toLowerCase()
        ) || 'Other';
        
        registrationData.club = matchedClub;
      }

      // Call API
      const response = await authAPI.register(registrationData);
      
      // Registration successful - redirect to login with success message
      navigate('/login', { 
        state: { message: 'Registration successful! Please login to continue.' } 
      });
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Set field-specific errors if available
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.password.length >= 8 &&
      !formData.password.includes(' ') &&
      /[A-Z]/.test(formData.password) &&
      /[a-z]/.test(formData.password) &&
      /[0-9]/.test(formData.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      (formData.role !== 'club_admin' || formData.club.trim())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-wrap items-center justify-center pt-20">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join us and start booking slots
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fadeIn">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="John Doe"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
              >
                <option value="user">Regular User - View slots and events</option>
                <option value="club_admin">Club Admin - Manage bookings</option>
              </select>
            </div>

            {formData.role === 'club_admin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Club Name
                </label>
                <select
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                  required
                >
                  <option value="">Select a club</option>
                  <option value="Technical Club">Technical Club</option>
                  <option value="Cultural Club">Cultural Club</option>
                  <option value="Sports Club">Sports Club</option>
                  <option value="Literary Club">Literary Club</option>
                  <option value="Other">Other</option>
                </select>
                {errors.club && <p className="text-red-500 text-sm mt-1">{errors.club}</p>}
              </div>
            )}
<div>
  <Input
    label="Password"
    type={showPassword ? 'text' : 'password'}
    name="password"
    placeholder="Create a strong password"
    icon={Lock}
    value={formData.password}
    onChange={handleChange}
    required
  >
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-[16px] text-gray-400 hover:text-gray-600 transition-colors duration-200"
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </Input>
  
  {/* Password Requirements List - Only show when typing */}
  {formData.password && (
    <div className="mt-2 space-y-1">
      <p className="text-sm text-gray-600 font-medium">Password must contain:</p>
      <div className="grid grid-cols-1 gap-1 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
            One capital letter (A-Z)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
            One small letter (a-z)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
            One number (0-9)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
            One special character (!@#$% etc.)
          </span>
        </div>
       
      </div>
    </div>
  )}

  {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
</div>
            <div>
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Enter your password again"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              {formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-green-500 text-sm mt-1">✓ Passwords match</p>
              )}
            </div>

            <label className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                I agree to the{' '}
                <Link to="/terms" className="text-gray-900 hover:text-black font-semibold">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-gray-900 hover:text-black font-semibold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-gray-900 hover:text-black font-semibold transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
      <div className='w-full mt-4'>
        <Footer />
      </div>
    </div>
  );
};

export default Register;