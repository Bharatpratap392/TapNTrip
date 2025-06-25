import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdDashboard,
  MdPeople,
  MdStore,
  MdBookOnline,
  MdPayment,
  MdContentPaste,
  MdSettings,
  MdLogout,
  MdMenu,
  MdNotifications,
  MdPerson,
  MdLightMode,
  MdDarkMode,
} from 'react-icons/md';
import { useTheme } from '../../../contexts/ThemeContext';
import { auth } from '../../../firebase-config';
import { signOut } from 'firebase/auth';

const Layout = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: <MdDashboard className="w-6 h-6" />,
      path: 'overview'
    },
    {
      name: 'User Management',
      icon: <MdPeople className="w-6 h-6" />,
      path: 'users'
    },
    {
      name: 'Service Management',
      icon: <MdStore className="w-6 h-6" />,
      path: 'services'
    },
    {
      name: 'Booking Management',
      icon: <MdBookOnline className="w-6 h-6" />,
      path: 'bookings'
    },
    {
      name: 'Payment Management',
      icon: <MdPayment className="w-6 h-6" />,
      path: 'payments'
    },
    {
      name: 'Content Management',
      icon: <MdContentPaste className="w-6 h-6" />,
      path: 'content'
    },
    {
      name: 'Settings',
      icon: <MdSettings className="w-6 h-6" />,
      path: 'settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-dark-bg-secondary shadow-xl border-r 
          dark:border-dark-border transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b dark:border-dark-border">
          <h1 className={`text-2xl font-bold text-gradient transition-transform ${!isSidebarOpen && 'scale-0'}`}>
            TapNTrip Admin
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-2">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.path)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors
                ${activeTab === item.path 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`ml-3 font-medium ${!isSidebarOpen && 'hidden'}`}>
                {item.name}
              </span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg-secondary border-b dark:border-dark-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-16 px-4">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                    dark:hover:bg-dark-hover transition-colors"
                >
                  <MdMenu className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    TapNTrip
                  </h1>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</span>
                </div>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {navItems.find(item => item.path === activeTab)?.name || 'Dashboard'}
                </h2>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                    dark:hover:bg-dark-hover transition-colors"
                >
                  {isDarkMode ? (
                    <MdLightMode className="w-6 h-6" />
                  ) : (
                    <MdDarkMode className="w-6 h-6" />
                  )}
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                  dark:hover:bg-dark-hover transition-colors relative">
                  <MdNotifications className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 
                  dark:bg-dark-bg-tertiary text-gray-700 dark:text-gray-300">
                  <MdPerson className="w-6 h-6" />
                  <span className="font-medium">Admin</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white 
                    hover:bg-red-600 transition-colors"
                >
                  <MdLogout className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 