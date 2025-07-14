import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { auth } from '../../firebase-config';
import { signOut } from 'firebase/auth';
import HotelDashboard from './Dashboard/HotelDashboard';
import TransportDashboard from './Dashboard/TransportDashboard';
import TravelGuideDashboard from './Dashboard/TravelGuideDashboard.jsx';
import HotelProfile from './Profile/HotelProfile';
import TransportProfile from './Profile/TransportProfile';
import GuideProfile from './Profile/GuideProfile';
import Settings from './Settings/Settings';
import HotelBookings from './Bookings/HotelBookings';
import TransportBookings from './Bookings/TransportBookings';
import GuideBookings from './Bookings/GuideBookings';
import HotelServices from './Services/HotelServices';
import TransportServices from './Services/TransportServices';
import GuideServices from './Services/GuideServices';
import ProviderBookings from './ProviderBookings';
import { db } from '../../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { HotelPackages } from './Services/HotelServices';

const ServiceProviderPanel = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, zoomLevel, increaseZoom, decreaseZoom, resetZoom } = useTheme();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [providerType, setProviderType] = useState(null);
  const [earnings] = useState({
    total: 25000,
    pending: 5000,
    lastMonth: 12000,
  });

  const [recentBookings] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      service: 'City Tour Package',
      date: '2024-03-15',
      amount: 1500,
      status: 'pending',
    },
    {
      id: 2,
      customerName: 'Priya Singh',
      service: 'Heritage Walk',
      date: '2024-03-14',
      amount: 800,
      status: 'confirmed',
    },
  ]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'services', label: 'My Services', icon: '🎫' },
    // Add Packages for hotel providers only
    ...(providerType === 'hotel_provider' ? [{ id: 'packages', label: 'Packages', icon: '📦' }] : []),
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, display an error message to the user
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  // Apply zoom level to main content
  const contentStyle = {
    zoom: `${zoomLevel}%`,
  };

  useEffect(() => {
    async function fetchProviderType() {
      if (user && user.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          let type = data.providerType;
          if (!type && ["hotel_provider", "guide_provider", "transport_provider"].includes(data.role)) {
            type = data.role;
          }
          setProviderType(type);
        }
      }
    }
    fetchProviderType();
  }, [user?.uid]);

  // Render the correct dashboard/content component based on activeSection and providerType
  const renderContent = () => {
    if (!providerType) {
      return <div className="flex items-center justify-center h-screen text-xl">Loading your provider dashboard...</div>;
    }
    switch (activeSection) {
      case 'dashboard':
        switch (providerType) {
          case 'hotel_provider':
            return <HotelDashboard setActiveSection={setActiveSection} />;
          case 'transport_provider':
            return <TransportDashboard setActiveSection={setActiveSection} />;
          case 'guide_provider':
            return <TravelGuideDashboard setActiveSection={setActiveSection} />;
          default:
            return <div className="text-center mt-10 text-red-600">Unknown provider type: {providerType}</div>;
        }
      case 'bookings':
        return <ProviderBookings />;
      case 'services':
        switch (providerType) {
          case 'hotel_provider':
            return <HotelServices />;
          case 'transport_provider':
            return <TransportServices />;
          case 'guide_provider':
            return <GuideServices />;
          default:
            return <div className="text-center mt-10 text-red-600">Unknown provider type: {providerType}</div>;
        }
      case 'packages':
        if (providerType === 'hotel_provider') {
          return <HotelPackages providerId={user?.uid} />;
        }
        return null;
      case 'profile':
        switch (providerType) {
          case 'hotel_provider':
            return <HotelProfile />;
          case 'transport_provider':
            return <TransportProfile />;
          case 'guide_provider':
            return <GuideProfile />;
          default:
            return <div className="text-center mt-10 text-red-600">Unknown provider type: {providerType}</div>;
        }
      case 'earnings':
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Earnings Section</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
              This section is currently blank and can be implemented here.
            </p>
          </div>
        );
      case 'reviews':
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Reviews Section</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
              This section is currently blank and can be implemented here.
            </p>
          </div>
        );
      case 'settings':
        return <Settings providerType={providerType} />;
      default:
        return <div className="text-center mt-10 text-red-600">Unknown section: {activeSection}</div>;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1e2e]' : 'bg-white'} text-${isDarkMode ? 'white' : 'gray-800'}`}>
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1e2e] border-r border-[#2d3348] flex flex-col z-40">
        <div className="flex items-center justify-center h-20 border-b border-[#2d3348]">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">TapNTrip</span>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-[#23263a] hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area (with header) */}
      <div className="ml-64 min-h-screen">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
          className={`bg-[#1a1e2e] border-b border-[#2d3348] sticky top-0 z-30 flex items-center justify-between px-8 h-20`}
        >
          <div /> {/* Empty for spacing, logo is in sidebar */}
          <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={decreaseZoom}
                className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  title="Zoom Out"
                  aria-label="Decrease zoom level"
                >
                  <span className="text-xl">−</span>
                </motion.button>
                <span className="text-sm font-medium">{zoomLevel}%</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={increaseZoom}
                className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  title="Zoom In"
                  aria-label="Increase zoom level"
                >
                  <span className="text-xl">+</span>
                </motion.button>
              </div>
            {/* Profile and Logout */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-200">
                {user?.displayName || user?.email}
              </span>
              <img
                src={user?.photoURL || 'https://via.placeholder.com/30'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
          </div>
        </div>
      </motion.header>
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
              {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ServiceProviderPanel; 