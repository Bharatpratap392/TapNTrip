import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const SearchSection = ({
  tripType,
  setTripType,
  fromQuery,
  setFromQuery,
  toQuery,
  setToQuery,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  showFromSuggestions,
  setShowFromSuggestions,
  showToSuggestions,
  setShowToSuggestions,
  getFilteredCities,
  handleCitySelect,
  handleFromInputChange,
  handleToInputChange,
  handleDepartureDateChange,
  getMinReturnDate,
  fromRef,
  toRef,
  cardVariants
}) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div 
      variants={cardVariants}
      className={`${
        isDarkMode 
          ? 'bg-[#1a1e2e] border-[#2d3348]' 
          : 'bg-white/70 hover:bg-white border-white/20'
      } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border p-6 relative`}
    >
      {/* Background decoration */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#1a1e2e]' : 'bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50'} pointer-events-none`}></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Trip Type Selection */}
        <div className={`flex gap-6 mb-8 p-2 ${isDarkMode ? 'bg-[#1a1e2e]' : 'bg-white/50'} backdrop-blur-sm rounded-xl inline-block`}>
          {['oneWay', 'roundTrip', 'multiCity'].map((type) => (
            <motion.label
              key={type}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 cursor-pointer ${
                tripType === type 
                  ? 'text-purple-600 font-medium' 
                  : isDarkMode ? 'text-white' : 'text-gray-600'
              }`}
            >
              <input
                type="radio"
                checked={tripType === type}
                onChange={() => setTripType(type)}
                className="form-radio text-purple-500 focus:ring-purple-500"
              />
              <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
            </motion.label>
          ))}
        </div>

        {/* Search Fields */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* From Field */}
            <div ref={fromRef} className="relative">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                From
              </label>
              <input
                type="text"
                value={fromQuery}
                onChange={handleFromInputChange}
                onFocus={() => setShowFromSuggestions(true)}
                placeholder="City or Airport"
                className={`w-full p-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-[#2d3348] text-white placeholder-gray-400 border-[#3d4458]' 
                    : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
              {/* From Suggestions */}
              {showFromSuggestions && fromQuery && (
                <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-[#2d3348] border-[#3d4458]' : 'bg-white border-gray-200'
                } border overflow-hidden`}>
                  {getFilteredCities(fromQuery).map((item, index) => (
                    <motion.button
                      key={`${item.code}-${index}`}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}
                      onClick={() => handleCitySelect(item, 'from')}
                      className={`w-full text-left p-3 ${
                        isDarkMode ? 'text-white hover:bg-blue-900/10' : 'text-gray-900 hover:bg-blue-50'
                      } transition-colors duration-150`}
                    >
                      <div className="flex items-start">
                        <span className="text-lg mr-2">✈️</span>
                        <div>
                          <p className="font-medium">{item.cityName}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.airportName} ({item.code})
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {item.state}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* To Field */}
            <div ref={toRef} className="relative">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                To
              </label>
              <input
                type="text"
                value={toQuery}
                onChange={handleToInputChange}
                onFocus={() => setShowToSuggestions(true)}
                placeholder="City or Airport"
                className={`w-full p-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-[#2d3348] text-white placeholder-gray-400 border-[#3d4458]' 
                    : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
              {/* To Suggestions */}
              {showToSuggestions && toQuery && (
                <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-[#2d3348] border-[#3d4458]' : 'bg-white border-gray-200'
                } border overflow-hidden`}>
                  {getFilteredCities(toQuery).map((item, index) => (
                    <motion.button
                      key={`${item.code}-${index}`}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}
                      onClick={() => handleCitySelect(item, 'to')}
                      className={`w-full text-left p-3 ${
                        isDarkMode ? 'text-white hover:bg-blue-900/10' : 'text-gray-900 hover:bg-blue-50'
                      } transition-colors duration-150`}
                    >
                      <div className="flex items-start">
                        <span className="text-lg mr-2">✈️</span>
                        <div>
                          <p className="font-medium">{item.cityName}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.airportName} ({item.code})
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {item.state}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div className="relative">
            <label className={`block text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            } mb-2`}>
              Departure
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <input
                type="date"
                value={departureDate}
                onChange={(e) => handleDepartureDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-4 rounded-xl ${
                  isDarkMode 
                    ? 'bg-[#1a1e2e] border-[#2d3348] text-white' 
                    : 'bg-white/70 border-transparent focus:bg-white'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)]`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">📅</div>
            </motion.div>
          </div>

          {tripType === 'roundTrip' && (
            <div className="relative">
              <label className={`block text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-600'
              } mb-2`}>
                Return
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={getMinReturnDate()}
                  className={`w-full p-4 rounded-xl ${
                    isDarkMode 
                      ? 'bg-[#1a1e2e] border-[#2d3348] text-white' 
                      : 'bg-white/70 border-transparent focus:bg-white'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)]`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">📅</div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 30px rgba(147, 51, 234, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform transition-all duration-200 shadow-lg"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchSection; 