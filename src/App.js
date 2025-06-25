import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { ToastProvider } from './contexts/ToastContext';
import Chatbot from './components/common/Chatbot';
import './App.css';
import './styles/theme.css';

// Import components
import ServiceAuth from './ServiceAuth';
import ServiceProviderPanel from './components/service-provider/ServiceProviderPanel';
import AdminApp from './AdminApp';
import CustomerDashboard from './components/customer/Dashboard';
import Profile from './components/service-provider/Dashboard/Profile';
import UserManagement from './components/admin/Dashboard/UserManagement';
import ContentManagement from './components/admin/Dashboard/ContentManagement';
import LandingPage from './LandingPage';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-2xl text-gray-200 animate-pulse">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no role matches, redirect to appropriate dashboard
  if (!allowedRoles.includes(userRole)) {
    const defaultRoutes = {
      customer: '/customer-dashboard',
      service_provider: '/service-dashboard',
      admin: '/admin-dashboard'
    };
    return <Navigate to={defaultRoutes[userRole] || '/'} replace />;
  }

  return children;
};

// Auth Route wrapper
const AuthRoute = ({ children }) => {
  const { user, userRole } = useAuth();

  // If user is already authenticated, redirect to their dashboard
  if (user && userRole) {
    const defaultRoutes = {
      customer: '/customer-dashboard',
      service_provider: '/service-dashboard',
      admin: '/admin-dashboard'
    };
    return <Navigate to={defaultRoutes[userRole]} replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const location = useLocation();

  // Effect to handle the initial landing page display
  useEffect(() => {
    if (initialLoad) {
      setShowLanding(true);
      const timer = setTimeout(() => {
        setShowLanding(false);
        setInitialLoad(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [initialLoad]);

  // Effect to reset initial load state on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      setInitialLoad(true);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Always show landing page first on initial load or refresh
  if (showLanding) {
    return <LandingPage />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <ServiceAuth />
          </AuthRoute>
        } 
      />
      
      {/* Customer Routes */}
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Specific Customer Routes */}
      <Route
        path="/flights"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="service" initialService="flights" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/trains"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="service" initialService="trains" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/buses"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="service" initialService="buses" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/hotels"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="service" initialService="hotels" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/packages"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="service" initialService="packages" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/activities"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="service" initialService="activities" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="my-bookings" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="profile" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/rewards"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard initialSection="rewards" />
          </ProtectedRoute>
        }
      />

      {/* Service Provider Routes */}
      <Route
        path="/service-dashboard"
        element={
          <ProtectedRoute allowedRoles={['service_provider']}>
            <ServiceProviderPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-profile"
        element={
          <ProtectedRoute allowedRoles={['service_provider']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApp />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to appropriate route */}
      <Route path="*" element={
        user ? (
          <Navigate to={`/${user.role || 'customer'}-dashboard`} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppRoutes />
            <Chatbot />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

export default App;
