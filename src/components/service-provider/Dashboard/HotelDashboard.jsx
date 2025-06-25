import React, { useState } from 'react';
import { MdHotel, MdPerson, MdDateRange, MdAttachMoney, MdAdd } from 'react-icons/md';
import { BiBookContent } from 'react-icons/bi';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const HotelDashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      title: 'Total Rooms',
      value: '12',
      icon: <MdHotel className="w-8 h-8" />,
    },
    {
      title: 'Active Bookings',
      value: '5',
      icon: <BiBookContent className="w-8 h-8" />,
    },
    {
      title: 'Total Revenue',
      value: '₹24000',
      icon: <MdAttachMoney className="w-8 h-8" />,
    }
  ];

  const quickActions = [
    {
      title: 'Add New Package',
      icon: <MdAdd className="w-6 h-6" />,
      onClick: () => {}
    },
    {
      title: 'Manage Bookings',
      icon: <BiBookContent className="w-6 h-6" />,
      onClick: () => {}
    },
    {
      title: 'Update Profile',
      icon: <MdPerson className="w-6 h-6" />,
      onClick: () => {}
    }
  ];

  const recentBookings = [
    {
      id: 1,
      guestName: 'John Smith',
      roomType: 'Deluxe Double',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      status: 'Confirmed',
      amount: '₹15,000'
    },
    {
      id: 2,
      guestName: 'Sarah Johnson',
      roomType: 'Suite',
      checkIn: '2024-03-16',
      checkOut: '2024-03-20',
      status: 'Pending',
      amount: '₹25,000'
    },
    {
      id: 3,
      guestName: 'Michael Brown',
      roomType: 'Standard Single',
      checkIn: '2024-03-17',
      checkOut: '2024-03-19',
      status: 'Confirmed',
      amount: '₹8,000'
    }
  ];

  return (
    <div className="space-y-6">
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

      {/* Recent Bookings */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room Type</th>
                <th>Check In</th>
                <th>Check Out</th>
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
                  <td>{booking.guestName}</td>
                  <td>{booking.roomType}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
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
    </div>
  );
};

export default HotelDashboard;