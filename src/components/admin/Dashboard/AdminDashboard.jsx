import React from 'react';
import { motion } from 'framer-motion';
import {
  MdPeople,
  MdStore,
  MdBookOnline,
  MdPayment,
  MdTrendingUp,
  MdTrendingDown,
} from 'react-icons/md';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,250',
      icon: <MdPeople className="w-8 h-8 text-blue-500" />,
      trend: '+12%',
      isPositive: true,
    },
    {
      title: 'Active Providers',
      value: '850',
      icon: <MdStore className="w-8 h-8 text-green-500" />,
      trend: '+8%',
      isPositive: true,
    },
    {
      title: 'Total Bookings',
      value: '3,200',
      icon: <MdBookOnline className="w-8 h-8 text-purple-500" />,
      trend: '+15%',
      isPositive: true,
    },
    {
      title: 'Total Revenue',
      value: '₹1.2M',
      icon: <MdPayment className="w-8 h-8 text-pink-500" />,
      trend: '+20%',
      isPositive: true,
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      name: 'Air India',
      type: 'Airline',
      registrationDate: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'Taj Hotels',
      type: 'Hotel Chain',
      registrationDate: '2024-01-14',
      status: 'active',
    },
    {
      id: 3,
      name: 'Royal Travels',
      type: 'Transport',
      registrationDate: '2024-01-13',
      status: 'pending',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'New Registration',
      description: 'New service provider registered: Luxury Hotels Ltd',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'Booking Update',
      description: 'Booking #1234 has been confirmed',
      time: '3 hours ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'Payment',
      description: 'Payment received for booking #5678',
      time: '4 hours ago',
      status: 'completed',
    },
  ];

  const handleApprove = (id) => {
    console.log('Approving provider:', id);
  };

  const handleReject = (id) => {
    console.log('Rejecting provider:', id);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-dark-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              {stat.icon}
            </div>
            <div className="mt-4 flex items-center">
              {stat.isPositive ? (
                <MdTrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <MdTrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`ml-2 text-sm font-medium ${
                stat.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pending Provider Approvals */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border border-gray-200 dark:border-dark-border">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Provider Approvals
            </h2>
            <button className="text-blue-500 hover:text-blue-400">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-bg-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Provider Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {pendingApprovals.map((provider) => (
                <motion.tr
                  key={provider.id}
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.05)' }}
                  className="transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {provider.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {provider.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {provider.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      provider.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleApprove(provider.id)}
                      className="text-green-500 hover:text-green-400 mx-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(provider.id)}
                      className="text-red-500 hover:text-red-400 mx-2"
                    >
                      Reject
                    </button>
                    <button className="text-blue-500 hover:text-blue-400 mx-2">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border border-gray-200 dark:border-dark-border">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activities
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-start justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-bg-tertiary"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {activity.type}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                    {activity.time}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {activity.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 