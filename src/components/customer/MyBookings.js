import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { fetchUserBookings, updateBookingDate, cancelBooking } from '../../services/api';
import { 
  FacebookShareButton, FacebookIcon, 
  WhatsappShareButton, WhatsappIcon,
  TwitterShareButton, TwitterIcon 
} from 'react-share';
import { getUserBookings, saveBooking } from '../../services/firestoreService';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const MyBookings = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        if (user && user.uid) {
          const data = await getUserBookings(user.uid);
          setBookings(data);
        } else {
          setBookings([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again.');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };
    getBookings();
  }, [user?.uid]);

  // Update handleDateChange to use toast
  const handleDateChange = async () => {
    if (!newDate || !selectedBooking) return;

    try {
      // In a real app, this would be an API call
      // await updateBookingDate(selectedBooking.id, newDate);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, travelDate: newDate } 
            : booking
        )
      );

      // Show success toast
      showToast(`Travel date modified successfully to ${formatDate(newDate)}`, 'success');

      // Close modal
      setShowDateModal(false);
      setNewDate('');
      setSelectedBooking(null);
    } catch (err) {
      setError('Failed to update booking date. Please try again.');
      showToast('Failed to update booking date. Please try again.', 'error');
      console.error('Error updating booking date:', err);
    }
  };

  // Update handleCancelBooking to use toast
  const handleCancelBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      showToast('Booking cancelled successfully', 'success');
    } catch (err) {
      showToast('Failed to cancel booking', 'error');
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const today = new Date();
    const travelDate = new Date(booking.travelDate);
    
    if (activeTab === 'upcoming') {
      // Show all confirmed bookings with future travel dates
      return travelDate >= today && booking.status === 'confirmed';
    } else if (activeTab === 'past') {
      return travelDate < today || booking.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  // Format date to display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Render booking card
  const renderBookingCard = (booking) => {
    const isPast = new Date(booking.travelDate) < new Date();
    const isCancelled = booking.status === 'cancelled';
    
    return (
      <motion.div
        key={booking.id}
        variants={itemVariants}
        className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-5 rounded-lg shadow-md mb-4`}
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            {/* Flight Info */}
            <div className="flex items-center mb-3">
              <div className="text-2xl mr-3">{booking.flight.airline === 'IndiGo' ? '✈️' : '🛫'}</div>
              <div>
                <h3 className="text-lg font-bold">{booking.flight.airline} - {booking.flight.flightNo}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formatDate(booking.travelDate)} • {booking.flight.departure}
                </p>
              </div>
            </div>
            
            {/* Route Info */}
            <div className="flex items-center mb-3">
              <div className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-0.5 h-10 bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              </div>
              <div>
                <p className="font-medium">{booking.flight.from}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{booking.flight.departure}</p>
                <p className="font-medium mt-2">{booking.flight.to}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{booking.flight.arrival}</p>
          </div>
        </div>

            {/* Passenger Info */}
            <div className="mb-3">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="mb-3">
              <span className={`px-2 py-1 text-xs rounded-full ${
                isCancelled 
                  ? 'bg-red-100 text-red-800' 
                  : isPast 
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {isCancelled ? t('bookings.cancelled') : isPast ? t('bookings.past') : t('bookings.confirmed')}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between mt-4 md:mt-0">
            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-blue-500">₹{booking.paymentInfo.amount}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Booked on {formatDate(booking.bookingDate)}
              </p>
          </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowDetailsModal(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                View Details
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowDetailsModal(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center justify-center"
              >
                <span className="mr-1">{t('bookings.shareTrip')}</span>
                <span>📤</span>
              </motion.button>
              
              {!isPast && !isCancelled && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setNewDate(booking.travelDate);
                      setShowDateModal(true);
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600"
                  >
                    Modify Date
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowCancelModal(true);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    Cancel Booking
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Details Modal
  const renderDetailsModal = () => {
    if (!selectedBooking) return null;
    
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${showDetailsModal ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDetailsModal(false)}></div>
        <div className={`relative ${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4`}>
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
          
          {/* Flight Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Flight Information</h3>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2d3348]' : 'bg-gray-50'}`}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Airline:</span>
                <span>{selectedBooking.flight.airline}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Flight Number:</span>
                <span>{selectedBooking.flight.flightNo}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Date:</span>
                <span>{formatDate(selectedBooking.travelDate)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Route:</span>
                <span>{selectedBooking.flight.from} → {selectedBooking.flight.to}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Departure:</span>
                <span>{selectedBooking.flight.departure}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Arrival:</span>
                <span>{selectedBooking.flight.arrival}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{selectedBooking.flight.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Passenger Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2d3348]' : 'bg-gray-50'}`}>
              {selectedBooking.passengers.map((passenger, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Name:</span>
                    <span>{passenger.name}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Age:</span>
                    <span>{passenger.age}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Gender:</span>
                    <span>{passenger.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Seat:</span>
                    <span>{passenger.seatNo}</span>
                  </div>
                  {index < selectedBooking.passengers.length - 1 && (
                    <hr className={`my-3 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2d3348]' : 'bg-gray-50'}`}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Amount:</span>
                <span>₹{selectedBooking.paymentInfo.amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Payment Method:</span>
                <span>{selectedBooking.paymentInfo.method}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Transaction ID:</span>
                <span>{selectedBooking.paymentInfo.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{selectedBooking.paymentInfo.status}</span>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Share Your Trip</h3>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2d3348]' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Share your travel plans with friends and family
              </p>
              <div className="flex gap-4 mt-4">
                <FacebookShareButton
                  url={"https://tapntrip.app"}
                  quote={`I just booked a trip to ${selectedBooking.flight.to} with TapNTrip – check it out!`}
                  hashtag="#TapNTrip"
                >
                  <FacebookIcon size={48} round />
                </FacebookShareButton>
                
                <WhatsappShareButton
                  url={"https://tapntrip.app"}
                  title={`I just booked a trip to ${selectedBooking.flight.to} with TapNTrip – check it out!`}
                >
                  <WhatsappIcon size={48} round />
                </WhatsappShareButton>
                
                <TwitterShareButton
                  url={"https://tapntrip.app"}
                  title={`I just booked a trip to ${selectedBooking.flight.to} with TapNTrip – check it out!`}
                  hashtags={['TapNTrip', 'Travel', 'Vacation']}
                >
                  <TwitterIcon size={48} round />
                </TwitterShareButton>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Close
            </motion.button>
          </div>

          {selectedBooking && selectedBooking.status === 'confirmed' && (
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              onClick={() => setShowNavigationModal(true)}
            >
              Start Navigation
            </button>
          )}
        </div>
      </div>
    );
  };

  // Date Modification Modal
  const renderDateModal = () => {
    if (!selectedBooking) return null;

  return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${showDateModal ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDateModal(false)}></div>
        <div className={`relative ${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
          <h2 className="text-xl font-bold mb-4">Modify Travel Date</h2>
          
          <div className="mb-4">
            <p className="text-sm mb-2">Current Date: {formatDate(selectedBooking.travelDate)}</p>
            <label className="block text-sm font-medium mb-1">Select New Date:</label>
            <input
              type="date"
              min={getTodayDate()}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-[#2d3348] border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDateModal(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Cancel
            </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
              onClick={handleDateChange}
              disabled={!newDate || newDate === selectedBooking.travelDate}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 ${
                (!newDate || newDate === selectedBooking.travelDate) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Confirm Change
          </motion.button>
          </div>
        </div>
      </div>
    );
  };

  // Cancellation Confirmation Modal
  const renderCancelModal = () => {
    if (!selectedBooking) return null;
    
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${showCancelModal ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowCancelModal(false)}></div>
        <div className={`relative ${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
          <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
          
          <div className="mb-6">
            <p>Are you sure you want to cancel this booking?</p>
            <div className="mt-3 p-3 rounded-lg bg-yellow-50 text-yellow-800">
              <p className="text-sm">
                <strong>Note:</strong> Cancellation fees may apply based on airline policy. 
                Please check the terms and conditions for more details.
              </p>
            </div>
      </div>

          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCancelModal(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              No, Keep Booking
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCancelBooking(selectedBooking.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Yes, Cancel Booking
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Modal
  const renderNavigationModal = () => {
    if (!selectedBooking) return null;
    
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50`}>
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Navigation Aid</h2>
          <p className="mb-4">Voice-guided directions and accessible routes (ramps, elevators, prayer areas, restrooms) will be available here.</p>
          <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={() => setShowNavigationModal(false)}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('bookings.myBookings')}</h1>
        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage your flight bookings
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'upcoming'
              ? isDarkMode 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'border-b-2 border-blue-600 text-blue-600'
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-500'
          }`}
        >
          {t('bookings.upcoming')}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'past'
              ? isDarkMode 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'border-b-2 border-blue-600 text-blue-600'
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-500'
          }`}
        >
          {t('bookings.past')}
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'cancelled'
              ? isDarkMode 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'border-b-2 border-blue-600 text-blue-600'
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-500'
          }`}
        >
          {t('bookings.cancelled')}
        </button>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDarkMode ? 'border-blue-400' : 'border-blue-500'
          }`}></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-xl">No bookings found</p>
          <p className="mt-2">You don't have any {activeTab} bookings at the moment</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredBookings.map(renderBookingCard)}
        </motion.div>
      )}
      
      {/* Modals */}
      {renderDetailsModal()}
      {renderDateModal()}
      {renderCancelModal()}
      {renderNavigationModal()}
    </div>
  );
};

export default MyBookings; 