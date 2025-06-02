import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const ServiceProviderPanel = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, zoomLevel, increaseZoom, decreaseZoom, resetZoom } = useTheme();
  const [activeSection, setActiveSection] = useState('dashboard');
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
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    navigate('/login');
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1e2e]' : 'bg-white'} text-${isDarkMode ? 'white' : 'gray-800'}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${
          isDarkMode 
            ? 'bg-[#1a1e2e] border-[#2d3348]' 
            : 'bg-white/70 hover:bg-white border-white/20'
        } border-b sticky top-0 z-50 shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex w-full">
            <div className="w-[280px] px-4 py-3">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
              >
                TapNTrip
              </motion.h1>
            </div>
            
            <div className="flex items-center space-x-4 ml-auto">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2 mr-4 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={decreaseZoom}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                  title="Zoom Out"
                >
                  <span className="text-xl">−</span>
                </motion.button>
                <span className="text-sm font-medium">{zoomLevel}%</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={increaseZoom}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                  title="Zoom In"
                >
                  <span className="text-xl">+</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetZoom}
                  className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                  title="Reset Zoom"
                >
                  Reset
                </motion.button>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#1a1e2e] hover:bg-[#2d3348]' : 'bg-blue-50 hover:bg-blue-100'} transition-all duration-200`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </motion.button>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Logout from your account"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex" style={contentStyle}>
        {/* Left Sidebar Navigation */}
        <motion.nav 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 ${
            isDarkMode 
              ? 'bg-[#1f2937] border-r border-[#2d3348]' 
              : 'bg-white/70 hover:bg-white border-r border-white/20'
          } p-4 overflow-y-auto`} 
          aria-label="Main navigation"
        >
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <motion.li key={item.id} variants={itemVariants}>
                <motion.button
                  onClick={() => setActiveSection(item.id)}
                  whileHover="hover"
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-[#2d3348]'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <motion.span 
                    className="text-xl" 
                    role="img" 
                    aria-hidden="true"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span>{item.label}</span>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        {/* Main Content Area */}
        <main className="ml-64 flex-1 p-8" role="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={containerVariants}
              className="space-y-6"
            >
              {/* Header */}
              <motion.header 
                variants={cardVariants}
                className="flex justify-between items-center mb-8"
              >
                <div>
                  <h1 className="text-2xl font-bold" id="page-title">
                    {navigationItems.find(item => item.id === activeSection)?.label}
                  </h1>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Welcome back, Service Provider
                  </p>
                </div>
              </motion.header>

              {/* Dashboard Content */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <motion.section 
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6" 
                  aria-labelledby="stats-heading"
                >
                  <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
                  
                  <motion.div 
                    variants={cardVariants}
                    whileHover="hover"
                    className={`${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-[#2d3348]' 
                        : 'bg-white border-gray-200'
                    } rounded-lg p-6 border`} 
                    role="status"
                  >
                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Total Earnings
                    </h3>
                    <p className="text-3xl font-bold text-blue-500" aria-label={`Total earnings: ₹${earnings.total}`}>
                      ₹{earnings.total.toLocaleString()}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    variants={cardVariants}
                    whileHover="hover"
                    className={`${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-[#2d3348]' 
                        : 'bg-white border-gray-200'
                    } rounded-lg p-6 border`} 
                    role="status"
                  >
                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Pending Payments
                    </h3>
                    <p className="text-3xl font-bold text-orange-500" aria-label={`Pending payments: ₹${earnings.pending}`}>
                      ₹{earnings.pending.toLocaleString()}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    variants={cardVariants}
                    whileHover="hover"
                    className={`${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-[#2d3348]' 
                        : 'bg-white border-gray-200'
                    } rounded-lg p-6 border`} 
                    role="status"
                  >
                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Last Month
                    </h3>
                    <p className="text-3xl font-bold text-green-500" aria-label={`Last month earnings: ₹${earnings.lastMonth}`}>
                      ₹{earnings.lastMonth.toLocaleString()}
                    </p>
                  </motion.div>
                </motion.section>

                {/* Recent Bookings */}
                <motion.section 
                  variants={cardVariants}
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1f2937] border-[#2d3348]' 
                      : 'bg-white border-gray-200'
                  } rounded-lg p-6 border`} 
                  aria-labelledby="bookings-heading"
                >
                  <h2 id="bookings-heading" className="text-xl font-semibold mb-6">Recent Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full" role="table">
                      <thead>
                        <tr className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th scope="col" className="text-left py-3 px-4">Customer</th>
                          <th scope="col" className="text-left py-3 px-4">Service</th>
                          <th scope="col" className="text-left py-3 px-4">Date</th>
                          <th scope="col" className="text-left py-3 px-4">Amount</th>
                          <th scope="col" className="text-left py-3 px-4">Status</th>
                          <th scope="col" className="text-left py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <motion.tr 
                            key={booking.id} 
                            variants={itemVariants}
                            className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <td className="py-4 px-4">{booking.customerName}</td>
                            <td className="py-4 px-4">{booking.service}</td>
                            <td className="py-4 px-4">{booking.date}</td>
                            <td className="py-4 px-4">₹{booking.amount.toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  booking.status === 'pending'
                                    ? 'bg-yellow-900/30 text-yellow-300'
                                    : 'bg-green-900/30 text-green-300'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {booking.status === 'pending' && (
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    aria-label={`Accept booking from ${booking.customerName}`}
                                  >
                                    Accept
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    aria-label={`Reject booking from ${booking.customerName}`}
                                  >
                                    Reject
                                  </motion.button>
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.section>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg ${
          isDarkMode 
            ? 'bg-[#1f2937] border border-[#2d3348] text-white' 
            : 'bg-white text-gray-800 hover:bg-gray-50'
        } transition-all duration-200`}
        aria-label="Scroll to top"
      >
        ⬆️
      </motion.button>
    </div>
  );
};

export default ServiceProviderPanel; 