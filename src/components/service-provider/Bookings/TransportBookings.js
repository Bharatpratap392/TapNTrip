import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSearch, FaFilter, FaCar } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getProviderTransportBookings } from '../../../services/firestoreService';
import { db } from '../../../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';

const TransportBookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProviderTransportBookings(user.uid);
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings.');
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(b =>
    activeTab === 'upcoming' ? b.status !== 'cancelled' : b.status === 'cancelled'
  );

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FaFilter />
            <span>Filter</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'past'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500">No bookings found.</div>
        ) : filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FaCar className="text-blue-500" />
                  <h3 className="text-lg font-semibold">{booking.customerName}</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt />
                  <span>{booking.date} {booking.duration && `(${booking.duration})`}</span>
                </div>
                <p className="text-sm">Vehicle: {booking.vehicleType}</p>
                <p className="text-sm">Passengers: {booking.passengers}</p>
                <div className="text-sm">
                  <p>From: {booking.pickupLocation}</p>
                  <p>To: {booking.dropoffLocation}</p>
                </div>
                {booking.specialRequests && (
                  <p className="text-sm text-blue-500">Special Request: {booking.specialRequests}</p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {booking.status}
                </span>
                <p className="font-semibold">{booking.amount}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={booking.status === 'confirmed'}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={booking.status === 'cancelled'}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransportBookings; 