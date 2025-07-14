import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import PackageCard from './PackageCard';
import { hotelServicesDB } from '../../../services/database';
import Modal from '../../common/Modal';
import { saveBooking } from '../../../services/firestoreService';
import { useAuth } from '../../../contexts/AuthContext';

const PackagesPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Categories for filtering (optional, can be based on hotel data)
  const categories = ['All'];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      const pkgs = await hotelServicesDB.getPackages();
      setPackages(pkgs);
      setIsLoading(false);
    };
    fetchPackages();
  }, []);

  // Filter packages by category (if you add categories to hotel data)
  const filteredPackages = (activeFilter === 'All' 
    ? packages 
    : packages.filter(pkg => pkg.category === activeFilter)
  ).filter(pkg => pkg.status !== 'suspended');

  // Handler for Book Now
  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
    setBookingSuccess(false);
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!user || !selectedPackage) return;
    setBookingLoading(true);
    try {
      await saveBooking({
        userId: user.uid,
        packageId: selectedPackage.id,
        packageTitle: selectedPackage.title,
        price: selectedPackage.price,
        destination: selectedPackage.destination,
        duration: selectedPackage.duration,
        status: 'pending',
        // Add more fields as needed
      });
      setBookingSuccess(true);
    } catch (err) {
      alert('Failed to book package. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${
        isDarkMode 
          ? 'bg-[#1a1e2e] border-[#2d3348]' 
          : 'bg-white/70 hover:bg-white border-white/20'
      } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explore Packages</h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Browse and book travel packages curated by our service partners.</p>
        </div>

        {/* Filter Tabs (optional) */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : isDarkMode
                    ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Packages Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPackages.length > 0 ? (
                filteredPackages.map(packageItem => (
                  <motion.div key={packageItem.id} variants={itemVariants}>
                    <PackageCard packageData={packageItem} onBookNow={handleBookNow} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No packages found.</p>
                </div>
              )}
            </motion.div>

            {/* Coming Soon Message */}
            <div className="text-center mt-10">
              <p className={`text-lg font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>More packages coming soon!</p>
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title={bookingSuccess ? 'Booking Successful' : 'Book Package'}>
        {bookingSuccess ? (
          <div className="text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-lg font-semibold mb-4">Your booking was successful!</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-2"
              onClick={() => setShowBookingModal(false)}
            >
              Close
            </button>
          </div>
        ) : selectedPackage ? (
          <div>
            <h3 className="text-lg font-bold mb-2">{selectedPackage.title}</h3>
            <p className="mb-2">Destination: {selectedPackage.destination}</p>
            <p className="mb-2">Duration: {selectedPackage.duration}</p>
            <p className="mb-4 font-semibold">Price: {selectedPackage.price}</p>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg w-full"
              onClick={handleConfirmBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default PackagesPage; 