import React, { useState } from 'react';
import { MdDirectionsCar, MdPerson, MdDateRange, MdAttachMoney, MdAdd, MdLocalShipping } from 'react-icons/md';
import { BiBookContent } from 'react-icons/bi';
import { FaCarAlt } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const TransportDashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      title: 'Total Vehicles',
      value: '12',
      icon: <MdDirectionsCar className="w-8 h-8" />,
    },
    {
      title: 'Active Bookings',
      value: '6',
      icon: <BiBookContent className="w-8 h-8" />,
    },
    {
      title: 'Total Revenue',
      value: '₹55,000',
      icon: <MdAttachMoney className="w-8 h-8" />,
    }
  ];

  const quickActions = [
    {
      title: 'Add New Vehicle',
      icon: <MdAdd className="w-6 h-6" />,
      onClick: () => {}
    },
    {
      title: 'Manage Bookings',
      icon: <BiBookContent className="w-6 h-6" />,
      onClick: () => {}
    },
    {
      title: 'Vehicle Status',
      icon: <FaCarAlt className="w-6 h-6" />,
      onClick: () => {}
    }
  ];

  const recentBookings = [
    {
      id: 1,
      passengerName: 'David Lee',
      vehicleType: 'SUV',
      pickupDate: '2024-03-15',
      duration: '5 days',
      status: 'Confirmed',
      amount: '₹25,000'
    },
    {
      id: 2,
      passengerName: 'Emma White',
      vehicleType: 'Sedan',
      pickupDate: '2024-03-16',
      duration: '3 days',
      status: 'Pending',
      amount: '₹15,000'
    },
    {
      id: 3,
      passengerName: 'Frank Miller',
      vehicleType: 'Tempo Traveller',
      pickupDate: '2024-03-17',
      duration: '7 days',
      status: 'Confirmed',
      amount: '₹35,000'
    }
  ];

  const vehicles = [
    {
      type: 'SUV',
      available: 3,
      total: 5,
      price: '₹5,000/day',
      features: ['7 Seater', 'AC', 'GPS', 'Luggage Space']
    },
    {
      type: 'Sedan',
      available: 4,
      total: 4,
      price: '₹3,500/day',
      features: ['5 Seater', 'AC', 'GPS', 'Fuel Efficient']
    },
    {
      type: 'Tempo Traveller',
      available: 2,
      total: 3,
      price: '₹7,000/day',
      features: ['12 Seater', 'AC', 'GPS', 'Large Luggage Space', 'Entertainment System']
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
          {['overview', 'vehicles', 'bookings'].map((tab) => (
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
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Recent Bookings
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Passenger
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Vehicle Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Pickup Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentBookings.map((booking) => (
                        <motion.tr
                          key={booking.id}
                          whileHover={{ scale: 1.01 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {booking.passengerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {booking.vehicleType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {booking.pickupDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {booking.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {booking.amount}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.type}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {vehicle.type}
                    </h4>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Available: {vehicle.available}/{vehicle.total}
                      </p>
                      <p className="text-lg font-bold text-blue-500">{vehicle.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                        >
                          {feature}
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

export default TransportDashboard; 