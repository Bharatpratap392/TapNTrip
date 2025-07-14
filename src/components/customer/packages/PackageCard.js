import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

const PackageCard = ({ packageData, onBookNow }) => {
  const { isDarkMode } = useTheme();
  const {
    name,
    description,
    price,
    duration,
    inclusions,
    exclusions,
    images,
    status
  } = packageData;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Images */}
      <div className="relative h-48 overflow-hidden flex items-center justify-center bg-gray-800">
        {Array.isArray(images) && images.length > 0 ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{name}</h3>
        <p className={`text-sm mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
        <div className="flex flex-col gap-1 mb-2">
          <span className="text-xs">Duration: <span className="font-medium">{duration}</span></span>
          <span className="text-xs">Price: <span className="font-bold text-blue-500">₹{Number(price).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></span>
          {inclusions && <span className="text-xs">Inclusions: <span className="font-medium">{inclusions}</span></span>}
          {exclusions && <span className="text-xs">Exclusions: <span className="font-medium">{exclusions}</span></span>}
        </div>
        {/* Status (optional, for debugging/admin) */}
        {/* <span className="text-xs text-gray-400">Status: {status}</span> */}
        <div className="flex justify-end mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md"
            onClick={() => onBookNow && onBookNow(packageData)}
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard; 