import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { ToastProvider } from './contexts/ToastContext';
import CustomerDashboard from './components/customer/Dashboard';
import ServiceProviderPanel from './components/service-provider/ServiceProviderPanel';
import AdminApp from './AdminApp';
import LandingPage from './LandingPage';
import PanelRegister from './components/common/PanelRegister';
import ServiceProviderRoleSelect from './components/common/ServiceProviderRoleSelect';
import './App.css';
import './styles/theme.css';

function AppRoutes() {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle unauthorized API responses
  useEffect(() => {
    const handleUnauthorized = (event) => {
      navigate(event.detail.redirectTo, { replace: true });
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  // Redirect authenticated users away from login/register and landing page
  useEffect(() => {
    if (user && (location.pathname === '/register' || location.pathname === '/login' || location.pathname === '/')) {
      setIsRedirecting(true);
      const getDashboardPath = (role) => {
        switch (role) {
          case 'customer':
            return '/customer-dashboard';
          case 'service_provider':
          case 'guide_provider':
          case 'hotel_provider':
          case 'transport_provider':
            return '/service-dashboard';
          case 'admin':
            return '/admin-dashboard';
          default:
            return '/customer-dashboard';
        }
      };
      
      // Replace the current history entry to prevent back button from showing landing page
      const dashboardPath = getDashboardPath(userRole);
      window.history.replaceState(null, '', dashboardPath);
      navigate(dashboardPath, { replace: true });
    }
  }, [user, userRole, location.pathname, navigate]);

  // Show loading spinner instead of blank screen
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Role-based dashboard path
  const getDashboardPath = (role) => {
    switch (role) {
      case 'customer':
        return '/customer-dashboard';
      case 'service_provider':
      case 'guide_provider':
      case 'hotel_provider':
      case 'transport_provider':
        return '/service-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/customer-dashboard';
    }
  };

  // Protect dashboard routes
  const RequireAuth = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/register" replace />;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to={getDashboardPath(userRole)} replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-provider-role" element={<ServiceProviderRoleSelect />} />
      <Route path="/register" element={<PanelRegister />} />
      <Route path="/login" element={<PanelRegister isLoginMode={true} />} />
      <Route
        path="/customer-dashboard"
        element={
          <RequireAuth allowedRoles={["customer"]}>
            <CustomerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/service-dashboard"
        element={
          <RequireAuth allowedRoles={["service_provider", "guide_provider", "hotel_provider", "transport_provider"]}>
            <ServiceProviderPanel />
          </RequireAuth>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminApp />
          </RequireAuth>
        }
      />
      {/* Catch-all: redirect to dashboard if authenticated, else to register */}
      <Route
        path="*"
        element={user ? <Navigate to={getDashboardPath(userRole)} replace /> : <Navigate to="/register" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

export default App;
