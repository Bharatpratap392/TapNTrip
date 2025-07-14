import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

const ActivityCard = ({ activityData }) => {
  const { isDarkMode } = useTheme();
  const { 
    name, 
    location, 
    duration, 
    price, 
    description, 
    image, 
    rating, 
    reviews, 
    type, 
    difficulty 
  } = activityData;

  // Activity type badge colors
  const getBadgeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'adventure':
        return 'from-orange-500 to-red-500';
      case 'cultural':
        return 'from-indigo-500 to-purple-500';
      case 'leisure':
        return 'from-green-500 to-teal-500';
      case 'spiritual':
        return 'from-yellow-500 to-amber-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  // Difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'difficult':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

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
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className={`absolute top-0 right-0 bg-gradient-to-l ${getBadgeColor(type)} text-white text-xs font-medium px-3 py-1 rounded-bl-lg`}>
          {type}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white text-lg font-bold line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <span className="text-white/90 text-sm mr-1">📍</span>
            <p className="text-white/90 text-sm">{location}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {duration}
          </span>
        </div>
        
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
        
        {/* Price and Button */}
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-blue-500 font-bold">₹{Number(price).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard; 