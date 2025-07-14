// HotelBookings: Shows real bookings for this hotel provider from Firestore
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getProviderHotelBookings } from '../../../services/firestoreService';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const HotelBookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from Firestore for this provider
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getProviderHotelBookings(user.uid);
        setBookings(data);
      } catch (e) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  // Filter bookings by search and tab
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = (booking.guestName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.roomType || '').toLowerCase().includes(searchQuery.toLowerCase());
    const isUpcoming = activeTab === 'upcoming' ? booking.status !== 'cancelled' : false;
    const isPast = activeTab === 'past' ? booking.status === 'cancelled' : false;
    return matchesSearch && (activeTab === 'upcoming' ? isUpcoming : isPast);
  });

  // Update booking status in Firestore
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (e) {
      alert('Failed to update status');
    }
  };

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
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">No bookings found.</div>
        ) : (
          filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              {/* Booking Card */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{booking.guestName || 'N/A'}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt />
                    <span>{booking.checkIn || 'N/A'} - {booking.checkOut || 'N/A'}</span>
                  </div>
                  <p className="text-sm">{booking.roomType || 'N/A'}</p>
                  <p className="text-sm">Guests: {booking.guests || 'N/A'}</p>
                  {booking.specialRequests && (
                    <p className="text-sm text-blue-500">Special Request: {booking.specialRequests}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {booking.status || 'N/A'}
                  </span>
                  <p className="font-semibold">{booking.amount || 'N/A'}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelBookings; 
// Firestore integration: uses getProviderHotelBookings to fetch bookings and updates status in Firestore 