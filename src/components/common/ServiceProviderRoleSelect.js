import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkedAlt, FaHotel, FaBusAlt, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const providerRoles = [
  { value: 'guide_provider', label: 'Guide Provider', icon: <FaMapMarkedAlt className="text-4xl" /> },
  { value: 'hotel_provider', label: 'Hotel Provider', icon: <FaHotel className="text-4xl" /> },
  { value: 'transport_provider', label: 'Transport Provider', icon: <FaBusAlt className="text-4xl" /> },
];

export default function ServiceProviderRoleSelect() {
  const navigate = useNavigate();
  
  const handleSelect = (role) => {
    navigate('/register', { state: { role }, replace: true });
  };
  
  const handleBack = () => {
    navigate(-1, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm z-0" />
      {/* Top bar for back button */}
      <div className="relative z-10 flex items-start justify-start p-6 md:p-8 lg:p-10" style={{ minHeight: '64px' }}>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white text-lg md:text-xl font-medium bg-gradient-to-r from-gray-800/80 to-gray-700/80 px-4 py-2 rounded-lg shadow hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ minWidth: 0 }}
        >
          <FaArrowLeft className="text-xl md:text-2xl" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>
      {/* Main content centered below back button */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-2xl mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-tight mb-4 md:mb-8 mt-2 md:mt-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Choose Your Service Type
        </motion.h1>
        <motion.p
          className="text-gray-400 text-base md:text-xl font-light tracking-wide mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Select the type of service you want to provide
        </motion.p>
        {/* Service Provider Cards */}
        <div className="grid grid-cols-1 gap-6 w-full">
          <motion.button
            onClick={() => handleSelect('guide_provider')}
            className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl font-semibold shadow-lg hover:scale-105 transition-all w-full"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <FaMapMarkedAlt className="text-4xl" /> Guide Provider
          </motion.button>
          <motion.button
            onClick={() => handleSelect('hotel_provider')}
            className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-semibold shadow-lg hover:scale-105 transition-all w-full"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <FaHotel className="text-4xl" /> Hotel Provider
          </motion.button>
          <motion.button
            onClick={() => handleSelect('transport_provider')}
            className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-2xl font-semibold shadow-lg hover:scale-105 transition-all w-full"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <FaBusAlt className="text-4xl" /> Transport Provider
          </motion.button>
        </div>
      </div>
    </div>
  );
} 