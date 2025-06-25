import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const FlightFilters = ({ filters, setFilters, airlines }) => {
  const { isDarkMode } = useTheme();

  // Time slots for flights
  const timeSlots = [
    { id: 'morning', label: 'Morning (6AM-12PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12PM-6PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (6PM-12AM)', icon: '🌆' },
    { id: 'night', label: 'Night (12AM-6AM)', icon: '🌙' }
  ];

  // Stops options
  const stopsOptions = [
    { value: 0, label: 'Non-stop' },
    { value: 1, label: '1 Stop' },
    { value: 2, label: '2+ Stops' }
  ];

  const handleAirlineToggle = (airline) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    setFilters({ ...filters, airlines: newAirlines });
  };

  const handleTimeSlotToggle = (timeSlot) => {
    const newTimeSlots = filters.timeSlots.includes(timeSlot)
      ? filters.timeSlots.filter(t => t !== timeSlot)
      : [...filters.timeSlots, timeSlot];
    setFilters({ ...filters, timeSlots: newTimeSlots });
  };

  const handleStopsToggle = (stops) => {
    const newStops = filters.stops.includes(stops)
      ? filters.stops.filter(s => s !== stops)
      : [...filters.stops, stops];
    setFilters({ ...filters, stops: newStops });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white text-gray-900'
      } p-6 rounded-lg shadow-md space-y-6`}
    >
      {/* Price Range Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Price Range (₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()})
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1000"
            max="50000"
            value={filters.priceRange[0]}
            onChange={(e) => setFilters({
              ...filters,
              priceRange: [parseInt(e.target.value), filters.priceRange[1]]
            })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="1000"
            max="50000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({
              ...filters,
              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
            })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Airlines Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Airlines</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {airlines.map(airline => (
            <motion.button
              key={airline}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAirlineToggle(airline)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.airlines.includes(airline)
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {airline}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time Slots Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Time</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {timeSlots.map(slot => (
            <motion.button
              key={slot.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTimeSlotToggle(slot.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.timeSlots.includes(slot.id)
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{slot.icon}</span>
              {slot.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stops Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Stops</label>
        <div className="flex flex-wrap gap-2">
          {stopsOptions.map(option => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStopsToggle(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.stops.includes(option.value)
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reset Filters Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setFilters({
          priceRange: [1000, 50000],
          airlines: [],
          timeSlots: [],
          stops: []
        })}
        className={`w-full py-2 rounded-lg text-sm font-medium ${
          isDarkMode
            ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Reset Filters
      </motion.button>
    </motion.div>
  );
};

export default FlightFilters; 