import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSearch, FaFilter, FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase-config';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

// --- GuideBookings: Real data bookings for tour guides ---
const GuideBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Bookings ---
  useEffect(() => {
    const fetchBookings = async () => {
      if (!authLoading && user) {
        setIsLoading(true);
        setError(null);
        try {
          const q = query(
            collection(db, 'bookings'),
            where('guideId', '==', user.uid),
            orderBy('date', 'desc')
          );
          const snap = await getDocs(q);
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBookings(data);
        } catch (err) {
          setError('Failed to load bookings.');
          toast.error('Failed to load bookings.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user, authLoading]);

  // --- Tab & Search Filtering ---
  const now = new Date();
  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return activeTab === 'upcoming' ? bookingDate >= now : bookingDate < now;
  }).filter(booking => {
    const q = searchQuery.toLowerCase();
    return (
      (booking.customerName || '').toLowerCase().includes(q) ||
      (booking.tourType || '').toLowerCase().includes(q) ||
      (booking.meetingPoint || '').toLowerCase().includes(q)
    );
  });

  // --- Status Update Handler ---
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      toast.success('Booking status updated.');
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">No bookings found.</div>
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
                  <FaMapMarkedAlt className="text-green-500" />
                  <h3 className="text-lg font-semibold">{booking.customerName || 'N/A'}</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt />
                  <span>{booking.date || 'N/A'} ({booking.duration || 'N/A'})</span>
                </div>
                <p className="text-sm">Tour: {booking.tourType || 'N/A'}</p>
                <p className="text-sm">Participants: {booking.participants || 'N/A'}</p>
                <p className="text-sm">Meeting Point: {booking.meetingPoint || 'N/A'}</p>
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
                  {booking.status || 'N/A'}
                </span>
                <p className="font-semibold">{booking.amount ? `₹${booking.amount}` : 'N/A'}</p>
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
        ))}
      </div>
    </div>
  );
};

export default GuideBookings; 