import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

const PackageCard = ({ packageData }) => {
  const { isDarkMode } = useTheme();
  const { 
    title, 
    destination, 
    duration, 
    price, 
    description, 
    image, 
    rating, 
    reviews, 
    category 
  } = packageData;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600/90 to-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
          {category}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white text-lg font-bold line-clamp-1">{title}</h3>
          <p className="text-white/90 text-sm">{destination}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(rating) ? '★' : (i < rating ? '⯨' : '☆')}
              </span>
            ))}
          </div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            ({reviews} reviews)
          </span>
        </div>

        {/* Description */}
        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
        
        {/* Duration and Price */}
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {duration}
            </p>
            <p className="text-blue-500 font-bold mt-1">{price}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md"
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard; 