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
      navigate('/login', { replace: true });
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
      name: 'Admin Management',
      icon: <MdPerson className="w-6 h-6" />,
      path: 'admins'
    },
    {
      name: 'Settings',
      icon: <MdSettings className="w-6 h-6" />,
      path: 'settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full glassmorphism dark:bg-dark-bg-secondary shadow-2xl border-r border-gray-200 dark:border-dark-border transition-all duration-300 z-50 ${isSidebarOpen ? 'w-72' : 'w-20'}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
          <h1 className={`text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text transition-all duration-300 ${!isSidebarOpen && 'scale-0 opacity-0'}`}>TapNTrip Admin</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors ml-2"
            aria-label="Toggle sidebar"
          >
            <MdMenu className="w-6 h-6" />
          </button>
        </div>
        {/* Navigation Items */}
        <nav className="mt-8 px-2 flex flex-col gap-2">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(item.path)}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === item.path ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover'}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`ml-1 transition-all duration-300 ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}> 
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-20 px-6">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">TapNTrip</h1>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</span>
                </div>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {navItems.find(item => item.path === activeTab)?.name || 'Dashboard'}
                </h2>
              </div>
              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <MdLightMode className="w-6 h-6" /> : <MdDarkMode className="w-6 h-6" />}
                </button>
                {/* Notifications */}
                <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors relative" aria-label="Notifications">
                  <MdNotifications className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-bg-tertiary text-gray-700 dark:text-gray-300 font-semibold focus:outline-none">
                    <MdPerson className="w-6 h-6" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg border border-gray-100 dark:border-dark-border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                      <span className="block text-gray-800 dark:text-gray-200 font-bold">Admin</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">admin@tapntrip.com</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-dark-hover rounded-b-xl transition-colors"
                    >
                      <MdLogout className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 