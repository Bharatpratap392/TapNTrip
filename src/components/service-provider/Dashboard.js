import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { signOut } from 'firebase/auth';

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState({
    total: 25000,
    pending: 5000,
    lastMonth: 12000,
  });

  const [recentBookings, setRecentBookings] = useState([
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Provider Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-indigo-600">₹{earnings.total}</p>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Payments</h3>
          <p className="text-3xl font-bold text-orange-600">₹{earnings.pending}</p>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Month</h3>
          <p className="text-3xl font-bold text-green-600">₹{earnings.lastMonth}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="modern-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 text-gray-700">Service</th>
                <th className="text-left py-3 px-4 text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">{booking.customerName}</td>
                  <td className="py-4 px-4">{booking.service}</td>
                  <td className="py-4 px-4">{booking.date}</td>
                  <td className="py-4 px-4">₹{booking.amount}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button className="accessible-button bg-green-50 text-green-600 hover:bg-green-100 py-1 px-3">
                          Accept
                        </button>
                        <button className="accessible-button bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3">
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard; 