import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { holyTrips, adventureEvents } from '../../utils/sampleData';
import { useTheme } from '../../contexts/ThemeContext';

const RightPanel = () => {
  const { isDarkMode, zoomLevel } = useTheme();

  // Apply zoom level to the container
  const containerStyle = {
    zoom: `${zoomLevel}%`,
    width: '384px', // 96 * 4 = 384px (w-96)
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const getReligionEmoji = (religion) => {
    const emojiMap = {
      'Hindu': '🕉️',
      'Muslim': '☪️',
      'Christian': '✝️',
      'Sikh': '🔯',
      'Buddhist': '☸️',
      'Muslim & Hindu': '🕌'
    };
    return emojiMap[religion] || '🙏';
  };

  const getFallbackImage = (type, religion = '') => {
    const religiousFallbacks = {
      'Hindu': 'https://images.unsplash.com/photo-1627894006066-b45b63fd3718',
      'Sikh': 'https://images.unsplash.com/photo-1588532207007-a35f56ab4cba',
      'Christian': 'https://images.unsplash.com/photo-1548276145-69a9521f0499',
      'Muslim': 'https://images.unsplash.com/photo-1564769625905-50e93615e769',
      'Buddhist': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7',
      'default': 'https://images.unsplash.com/photo-1542309667-2a115d1f54c6'
    };

    const adventureFallbacks = {
      'Trek': 'https://images.unsplash.com/photo-1551632811-561732d1e306',
      'Party': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      'Adventure': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      'Water Sports': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      'default': 'https://images.unsplash.com/photo-1530549387789-4c1017266635'
    };

    if (type === 'religious') {
      return religiousFallbacks[religion] || religiousFallbacks.default;
    }
    return adventureFallbacks[type] || adventureFallbacks.default;
  };

  const renderTripCard = (trip, isHolyTrip = true) => (
    <motion.div
      key={trip.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`${
        isDarkMode 
          ? 'dark bg-[#1a1e2e] border-[#2d3348]' 
          : 'bg-white'
      } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-4`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.imageUrl} 
          alt={trip.title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/fallback-image.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            {isHolyTrip && (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
                {getReligionEmoji(trip.religion)}
              </span>
            )}
            {!isHolyTrip && trip.category && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
                {trip.category}
              </span>
            )}
            <h3 className="text-lg font-semibold text-white line-clamp-1">{trip.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <span className="text-sm">📍</span>
            <p className="text-sm line-clamp-1">{trip.location}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
            <p className="text-sm font-medium text-purple-600">{trip.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">{trip.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            {!isHolyTrip && trip.difficulty && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                trip.difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-700'
                  : trip.difficulty === 'Moderate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {trip.difficulty}
              </span>
            )}
          </div>
        </div>
        
        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {trip.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {trip.highlights.slice(0, 2).map((highlight, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-[#2d3348] text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {highlight}
            </span>
          ))}
          {trip.highlights.length > 2 && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode 
                ? 'bg-[#2d3348] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              +{trip.highlights.length - 2} more
            </span>
          )}
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 text-sm">
          Book Now
        </button>
      </div>
    </motion.div>
  );

  return (
    <div style={containerStyle} className="relative">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`h-screen sticky top-0 right-0 overflow-y-auto ${
          isDarkMode ? 'bg-[#1a1e2e]' : 'bg-white/10 backdrop-blur-xl'
        } p-6 border-l ${isDarkMode ? 'border-[#2d3348]' : 'border-white/20'} scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent`}
      >
        {/* Religious Trips Section */}
        <motion.div 
          className="mb-8"
          variants={containerVariants}
        >
          <motion.h2 
            className={`text-xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            variants={cardVariants}
          >
            <span className="text-2xl">🙏</span>
            Religious & Spiritual Trips
          </motion.h2>
          <AnimatePresence>
            <motion.div className="space-y-4">
              {holyTrips.map(trip => (
                <motion.div
                  key={trip.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1a1e2e] border border-[#2d3348]' 
                      : 'bg-white/70 hover:bg-white'
                  } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img 
                      src={trip.imageUrl} 
                      alt={trip.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <motion.span 
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"
                          whileHover={{ scale: 1.1 }}
                        >
                          {getReligionEmoji(trip.religion)}
                        </motion.span>
                        <h3 className="text-lg font-semibold text-white line-clamp-1">{trip.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </p>
                        <p className="text-sm font-medium text-purple-600">{trip.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{trip.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                      {trip.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {trip.highlights.slice(0, 2).map((highlight, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-[#2d3348] text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {highlight}
                        </motion.span>
                      ))}
                      {trip.highlights.length > 2 && (
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-[#2d3348] text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          +{trip.highlights.length - 2} more
                        </motion.span>
                      )}
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-600 transition-all duration-200 text-sm"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Adventure & Events Section */}
        <motion.div variants={containerVariants}>
          <motion.h2 
            className={`text-xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            variants={cardVariants}
          >
            <span className="text-2xl">🏔️</span>
            Adventure & Events
          </motion.h2>
          <AnimatePresence>
            <motion.div className="space-y-4">
              {adventureEvents.map(event => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1a1e2e] border border-[#2d3348]' 
                      : 'bg-white/70 hover:bg-white'
                  } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <motion.span 
                          className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white"
                          whileHover={{ scale: 1.1 }}
                        >
                          {event.category}
                        </motion.span>
                        <h3 className="text-lg font-semibold text-white line-clamp-1">{event.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </p>
                        <p className="text-sm font-medium text-purple-600">{event.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{event.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            event.difficulty === 'Easy' 
                              ? 'bg-green-100 text-green-700'
                              : event.difficulty === 'Moderate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {event.difficulty}
                        </motion.span>
                      </div>
                    </div>

                    <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.highlights.slice(0, 2).map((highlight, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-[#2d3348] text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {highlight}
                        </motion.span>
                      ))}
                      {event.highlights.length > 2 && (
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-[#2d3348] text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          +{event.highlights.length - 2} more
                        </motion.span>
                      )}
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-600 transition-all duration-200 text-sm"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Scroll to Top Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg ${
            isDarkMode 
              ? 'bg-[#1a1e2e] border border-[#2d3348] text-white' 
              : 'bg-white text-gray-800 hover:bg-gray-50'
          } transition-all duration-200`}
        >
          ⬆️
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RightPanel;