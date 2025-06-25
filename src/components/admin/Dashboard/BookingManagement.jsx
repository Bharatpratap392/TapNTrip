import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdHotel,
  MdDirectionsCar,
  MdPerson,
  MdSearch,
  MdFilterList,
  MdCheck,
  MdClose,
  MdWarning,
} from 'react-icons/md';

const BookingManagement = () => {
  const [bookingType, setBookingType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const bookings = [
    {
      id: 'BK001',
      customerName: 'John Smith',
      serviceType: 'hotel',
      serviceName: 'Hotel Taj Palace',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      amount: '₹60,000',
      status: 'confirmed',
      paymentStatus: 'paid',
      hasDispute: false,
    },
    {
      id: 'BK002',
      customerName: 'Sarah Wilson',
      serviceType: 'guide',
      serviceName: 'Heritage Walk Tour',
      date: '2024-03-22',
      amount: '₹2,500',
      status: 'pending',
      paymentStatus: 'pending',
      hasDispute: false,
    },
    {
      id: 'BK003',
      customerName: 'Mike Johnson',
      serviceType: 'transport',
      serviceName: 'Royal Travels SUV',
      startDate: '2024-03-23',
      endDate: '2024-03-26',
      amount: '₹15,000',
      status: 'disputed',
      paymentStatus: 'paid',
      hasDispute: true,
      disputeReason: 'Vehicle condition not as described',
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesType = bookingType === 'all' || booking.serviceType === bookingType;
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getServiceIcon = (type) => {
    switch (type) {
      case 'hotel':
        return <MdHotel className="w-6 h-6" />;
      case 'transport':
        return <MdDirectionsCar className="w-6 h-6" />;
      case 'guide':
        return <MdPerson className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleResolveDispute = (bookingId, resolution) => {
    // Implement dispute resolution logic
    console.log(`Resolving dispute for booking ${bookingId} with resolution: ${resolution}`);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    // Implement status update logic
    console.log(`Updating status for booking ${bookingId} to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white"
          >
            <option value="all">All Services</option>
            <option value="hotel">Hotels</option>
            <option value="guide">Travel Guides</option>
            <option value="transport">Transport</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white w-full sm:w-64"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <motion.tr
                  key={booking.id}
                  whileHover={{ scale: 1.01 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.customerName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getServiceIcon(booking.serviceType)}
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.serviceName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {booking.serviceType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {booking.checkIn || booking.date || booking.startDate}
                    </div>
                    {(booking.checkOut || booking.endDate) && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        to {booking.checkOut || booking.endDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.amount}
                    </div>
                    <div className={`text-xs ${
                      booking.paymentStatus === 'paid'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {booking.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.hasDispute && (
                      <div className="mt-1 flex items-center text-xs text-red-600 dark:text-red-400">
                        <MdWarning className="w-4 h-4 mr-1" />
                        Disputed
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 
                              dark:hover:text-green-300"
                          >
                            <MdCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 
                              dark:hover:text-red-300"
                          >
                            <MdClose className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {booking.hasDispute && (
                        <button
                          onClick={() => handleResolveDispute(booking.id, 'resolved')}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 
                            dark:hover:text-yellow-300"
                        >
                          <MdWarning className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement; 