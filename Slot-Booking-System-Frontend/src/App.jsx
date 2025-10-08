import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Slots from './pages/Slots';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, user, requiredRole }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children, user }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute user={user}>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute user={user}>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slots"
            element={
              <ProtectedRoute user={user}>
                <Slots user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute user={user} requiredRole={['club_admin', 'super_admin']}>
                <Bookings user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
