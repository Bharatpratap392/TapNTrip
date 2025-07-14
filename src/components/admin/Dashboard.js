import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBookings: 0,
    revenue: ''
  });

  const [recentProviders] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalUsers}</p>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Providers</h3>
          <p className="text-3xl font-bold text-green-600">{metrics.activeUsers}</p>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalBookings}</p>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600">{metrics.revenue}</p>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="modern-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pending Provider Approvals</h2>
          <button className="accessible-button bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Provider Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-gray-700">Registration Date</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentProviders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-400">No pending provider approvals.</td>
                </tr>
              ) : recentProviders.map((provider) => (
                <tr key={provider.name} className="border-b border-gray-100">
                  <td className="py-4 px-4">{provider.name}</td>
                  <td className="py-4 px-4 capitalize">{provider.type}</td>
                  <td className="py-4 px-4">{provider.date}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {provider.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="accessible-button bg-green-50 text-green-600 hover:bg-green-100 py-1 px-3">
                        Approve
                      </button>
                      <button className="accessible-button bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3">
                        Reject
                      </button>
                      <button className="accessible-button bg-gray-50 text-gray-600 hover:bg-gray-100 py-1 px-3">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <button className="modern-card p-6 text-left hover:bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600">View and manage user accounts and permissions</p>
        </button>
        <button className="modern-card p-6 text-left hover:bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Settings</h3>
          <p className="text-gray-600">Update destination information and app content</p>
        </button>
        <button className="modern-card p-6 text-left hover:bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600">View detailed reports and statistics</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard; 