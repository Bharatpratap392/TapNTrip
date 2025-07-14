import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminManagement from './Dashboard/AdminManagement.jsx';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [statistics] = useState({
    totalUsers: 0,
    activeProviders: 0,
    pendingApprovals: 0,
    totalBookings: 0,
  });

  const [recentActivities] = useState([]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'providers', label: 'Service Providers', icon: '🏢' },
    { id: 'admins', label: 'Admins', icon: '🛡️' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'support', label: 'Support', icon: '🎗️' },
  ];

  const handleLogout = () => {
    navigate('/login', { replace: true });
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-900/30 text-yellow-300',
      urgent: 'bg-red-900/30 text-red-300',
      resolved: 'bg-green-900/30 text-green-300',
    };
    return styles[status] || 'bg-gray-900/30 text-gray-300';
  };

  return (
    <div className="min-h-screen bg-[#1a1e2e] text-white">
      {/* Left Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-screen w-64 bg-[#1f2937] p-4 overflow-y-auto transition-all duration-300 hover:shadow-xl" aria-label="Main navigation">
        {/* Logo */}
        <div className="mb-8 transform transition-transform duration-300 hover:scale-105">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            TapNTrip
          </h1>
          <p className="text-sm text-gray-400">Admin Portal</p>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <span className="text-xl transform transition-transform duration-300 hover:rotate-12" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="ml-64 p-8 transition-all duration-300" role="main">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="transform transition-transform duration-300 hover:scale-105">
            <h1 className="text-2xl font-bold" id="page-title">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h1>
            <p className="text-gray-400">Welcome back, Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Logout from your account"
          >
            Logout
          </button>
        </header>

        {/* Section Content */}
        {activeSection === 'dashboard' && (
          // Dashboard Content
          <div className="space-y-6">
            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
              
              <div className="bg-[#1f2937] rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg" role="status">
                <h3 className="text-gray-400 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-500" aria-label={`Total users: ${statistics.totalUsers}`}>
                  {statistics.totalUsers.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-[#1f2937] rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg" role="status">
                <h3 className="text-gray-400 mb-2">Active Providers</h3>
                <p className="text-3xl font-bold text-green-500" aria-label={`Active providers: ${statistics.activeProviders}`}>
                  {statistics.activeProviders.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-[#1f2937] rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg" role="status">
                <h3 className="text-gray-400 mb-2">Pending Approvals</h3>
                <p className="text-3xl font-bold text-yellow-500" aria-label={`Pending approvals: ${statistics.pendingApprovals}`}>
                  {statistics.pendingApprovals.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#1f2937] rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg" role="status">
                <h3 className="text-gray-400 mb-2">Total Bookings</h3>
                <p className="text-3xl font-bold text-purple-500" aria-label={`Total bookings: ${statistics.totalBookings}`}>
                  {statistics.totalBookings.toLocaleString()}
                </p>
              </div>
            </section>

            {/* Recent Activities */}
            <section className="bg-[#1f2937] rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg" aria-labelledby="activities-heading">
              <h2 id="activities-heading" className="text-xl font-semibold mb-6">Recent Activities</h2>
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th scope="col" className="text-left py-3 px-4">Activity</th>
                      <th scope="col" className="text-left py-3 px-4">Type</th>
                      <th scope="col" className="text-left py-3 px-4">Date</th>
                      <th scope="col" className="text-left py-3 px-4">Status</th>
                      <th scope="col" className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-4 px-4 text-center text-gray-400">No recent activities available.</td>
                      </tr>
                    ) : recentActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <td className="py-4 px-4">{activity.name}</td>
                        <td className="py-4 px-4">{activity.type}</td>
                        <td className="py-4 px-4">{activity.date}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(activity.status)}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                            aria-label={`View details for ${activity.name}`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-labelledby="quick-actions-heading">
              <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
              
              <button
                className="bg-[#1f2937] p-6 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Review pending provider applications"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl transform transition-transform duration-300 hover:rotate-12" role="img" aria-hidden="true">📋</span>
                  <div>
                    <h3 className="font-semibold">Review Applications</h3>
                    <p className="text-sm text-gray-400">Review pending provider applications</p>
                  </div>
                </div>
              </button>

              <button
                className="bg-[#1f2937] p-6 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Generate monthly reports"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl transform transition-transform duration-300 hover:rotate-12" role="img" aria-hidden="true">📊</span>
                  <div>
                    <h3 className="font-semibold">Generate Reports</h3>
                    <p className="text-sm text-gray-400">Create monthly activity reports</p>
                  </div>
                </div>
              </button>

              <button
                className="bg-[#1f2937] p-6 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="View system notifications"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl transform transition-transform duration-300 hover:rotate-12" role="img" aria-hidden="true">🔔</span>
                  <div>
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm text-gray-400">View system notifications</p>
                  </div>
                </div>
              </button>
            </section>
          </div>
        )}
        {activeSection === 'users' && (
          // Users Content
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <p>This section will contain user management features.</p>
          </div>
        )}
        {activeSection === 'providers' && (
          // Providers Content
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Provider Management</h2>
            <p>This section will contain provider management features.</p>
          </div>
        )}
        {activeSection === 'admins' && (
          <AdminManagement />
        )}
      </main>
    </div>
  );
};

export default AdminPanel; 