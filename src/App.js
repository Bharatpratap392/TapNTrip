import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { ToastProvider } from './contexts/ToastContext';
import Chatbot from './components/common/Chatbot';
import './App.css';
import './styles/theme.css';
import { sendEmailVerification } from "firebase/auth";

// Import components
import CustomerDashboard from './components/customer/Dashboard';
import ServiceProviderPanel from './components/service-provider/ServiceProviderPanel';
import AdminApp from './AdminApp';
import ServiceAuth from './ServiceAuth';
import LandingPage from './LandingPage';
import UserManagementNew from './components/admin/Dashboard/UserManagementNew';
import ContentManagement from './components/admin/Dashboard/ContentManagement';
import HotelsPage from './components/customer/HotelsPage';
import PanelRegister from './components/common/PanelRegister';

function AppRoutes() {
  const { user, emailVerified } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const location = useLocation();
  const [resent, setResent] = useState(false);

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

  // Helper: Blocked for unverified users
  const UnverifiedBlock = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Email Not Verified</h2>
        <p className="mb-4">Please verify your email address to access your dashboard.</p>
        <button
          className="px-6 py-2 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 transition mb-2"
          onClick={async () => {
            if (user) {
              await sendEmailVerification(user);
              setResent(true);
            }
          }}
        >
          Resend Verification Email
        </button>
        {resent && <div className="text-green-400 mt-2">Verification email resent!</div>}
      </div>
    </div>
  );

  // Always show landing page first on initial load or refresh
  if (showLanding) {
    return <LandingPage />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      {/* <Route 
        path="/login" 
        element={<ServiceAuth />} 
      /> */}
      <Route 
        path="/register" 
        element={<PanelRegister />} 
      />
      {/* Customer Routes */}
      <Route path="/customer-dashboard" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard />} />
      <Route path="/flights" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="service" initialService="flights" />} />
      <Route path="/trains" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="service" initialService="trains" />} />
      <Route path="/buses" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="service" initialService="buses" />} />
      <Route path="/hotels" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="service" initialService="hotels" />} />
      <Route path="/hotels-list" element={user && !emailVerified ? <UnverifiedBlock /> : <HotelsPage />} />
      <Route path="/packages" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="service" initialService="packages" />} />
      <Route path="/activities" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="service" initialService="activities" />} />
      <Route path="/my-bookings" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="my-bookings" />} />
      <Route path="/profile" element={<CustomerDashboard initialSection="profile" />} />
      <Route path="/rewards" element={user && !emailVerified ? <UnverifiedBlock /> : <CustomerDashboard initialSection="rewards" />} />
      {/* Service Provider Routes */}
      <Route path="/service-dashboard" element={user && !emailVerified ? <UnverifiedBlock /> : <ServiceProviderPanel />} />
      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={user && !emailVerified ? <UnverifiedBlock /> : <AdminApp />} />
      <Route path="/admin/*" element={user && !emailVerified ? <UnverifiedBlock /> : <AdminApp />} />
      {/* Catch all - redirect to appropriate route */}
      <Route path="*" element={
        user ? (
          emailVerified ? (
            <Navigate to={`/${user.role || 'customer'}-dashboard`} replace />
          ) : (
            <UnverifiedBlock />
          )
        ) : (
          <Navigate to="/register" replace />
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
