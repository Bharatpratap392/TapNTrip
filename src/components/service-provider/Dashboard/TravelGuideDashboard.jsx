import React, { useState } from 'react';
import { MdPerson, MdDateRange, MdAttachMoney, MdLocationOn, MdAdd } from 'react-icons/md';
import { BiBookContent } from 'react-icons/bi';
import { FaRoute, FaMapMarkedAlt } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const TravelGuideDashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      title: 'Total Tours',
      value: '15',
      icon: <MdLocationOn className="w-8 h-8" />,
    },
    {
      title: 'Active Bookings',
      value: '8',
      icon: <BiBookContent className="w-8 h-8" />,
    },
    {
      title: 'Total Revenue',
      value: '₹35,000',
      icon: <MdAttachMoney className="w-8 h-8" />,
    }
  ];

  const quickActions = [
    {
      title: 'Add New Tour',
      icon: <MdAdd className="w-6 h-6" />,
      onClick: () => {}
    },
    {
      title: 'Manage Bookings',
      icon: <BiBookContent className="w-6 h-6" />,
      onClick: () => {}
    },
    {
      title: 'Update Routes',
      icon: <FaMapMarkedAlt className="w-6 h-6" />,
      onClick: () => {}
    }
  ];

  const recentBookings = [
    {
      id: 1,
      touristName: 'Alice Cooper',
      tourType: 'Heritage Walk',
      date: '2024-03-15',
      duration: '3 hours',
      status: 'Confirmed',
      amount: '₹2,500'
    },
    {
      id: 2,
      touristName: 'Bob Wilson',
      tourType: 'City Tour',
      date: '2024-03-16',
      duration: '6 hours',
      status: 'Pending',
      amount: '₹4,500'
    },
    {
      id: 3,
      touristName: 'Carol Davis',
      tourType: 'Food Trail',
      date: '2024-03-17',
      duration: '4 hours',
      status: 'Confirmed',
      amount: '₹3,000'
    }
  ];

  const tours = [
    {
      type: 'Heritage Walk',
      duration: '3 hours',
      price: '₹2,500',
      maxGroupSize: 10,
      highlights: ['Historical Sites', 'Local Stories', 'Photo Stops', 'Cultural Insights']
    },
    {
      type: 'City Tour',
      duration: '6 hours',
      price: '₹4,500',
      maxGroupSize: 8,
      highlights: ['Major Landmarks', 'Local Markets', 'Lunch Stop', 'Museum Visit']
    },
    {
      type: 'Food Trail',
      duration: '4 hours',
      price: '₹3,000',
      maxGroupSize: 6,
      highlights: ['Street Food', 'Local Restaurants', 'Cooking Demo', 'Food History']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="action-card custom-transition"
            onClick={action.onClick}
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <span>{action.title}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card custom-transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex space-x-4 mb-6">
          {['overview', 'tours', 'bookings'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Tourist</th>
                        <th>Tour Type</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <motion.tr
                          key={booking.id}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td>{booking.touristName}</td>
                          <td>{booking.tourType}</td>
                          <td>{booking.date}</td>
                          <td>{booking.duration}</td>
                          <td>
                            <span className={`status-badge custom-transition ${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>{booking.amount}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tours' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <motion.div
                    key={tour.type}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {tour.type}
                    </h4>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Duration: {tour.duration}
                      </p>
                      <p className="text-lg font-bold text-blue-500">{tour.price}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                      Max Group Size: {tour.maxGroupSize}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tour.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    All Bookings
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
                  >
                    Export Data
                  </motion.button>
                </div>
                {/* Add a more detailed bookings table or calendar view here */}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TravelGuideDashboard; 