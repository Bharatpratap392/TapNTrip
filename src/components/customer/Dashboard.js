import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { signOut } from 'firebase/auth';
import { indianCities } from '../../utils/indianCities';
import { useTheme } from '../../contexts/ThemeContext';
import {
  sampleFlights,
  sampleHotels,
  sampleBuses,
  sampleTrains,
  sampleHomestays,
  sampleCabs,
  sampleInsurance,
  sampleHolidayPackages
} from '../../utils/sampleData';
import { motion, AnimatePresence } from 'framer-motion';
import RightPanel from './RightPanel';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, zoomLevel, increaseZoom, decreaseZoom, resetZoom } = useTheme();
  const [tripType, setTripType] = useState('oneWay');
  const [activeService, setActiveService] = useState('flights');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const services = [
    { id: 'flights', icon: '✈️', label: 'Flights' },
    { id: 'hotels', icon: '🏨', label: 'Hotels' },
    { id: 'homestays', icon: '🏠', label: 'Homestays & Villas' },
    { id: 'holiday', icon: '🌴', label: 'Holiday Packages' },
    { id: 'trains', icon: '🚂', label: 'Trains' },
    { id: 'buses', icon: '🚌', label: 'Buses' },
    { id: 'cabs', icon: '🚕', label: 'Cabs' },
    { id: 'insurance', icon: '🛡️', label: 'Travel Insurance' },
  ];

  const fareTypes = [
    { id: 'regular', label: 'Regular', description: 'Regular fares' },
    { id: 'student', label: 'Student', description: 'Extra discounts/baggage', discount: '₹600 off' },
    { id: 'senior', label: 'Senior Citizen', description: 'Up to ₹600 off' },
    { id: 'armed', label: 'Armed Forces', description: 'Up to ₹600 off' },
    { id: 'doctor', label: 'Doctor and Nurses', description: 'Up to ₹600 off' },
  ];

  // Get all airports for suggestions
  const getAllAirports = () => {
    const airports = [];
    indianCities.forEach(city => {
      city.airports.forEach(airport => {
        airports.push({
          cityName: city.city,
          airportName: airport.name,
          code: airport.code,
          state: city.state
        });
      });
    });
    return airports;
  };

  // Filter cities and airports based on query
  const getFilteredCities = (query) => {
    if (!query) return [];
    const lowercaseQuery = query.toLowerCase();
    
    // Get all matching airports
    const allAirports = getAllAirports();
    const matchingResults = allAirports.filter(item => 
      item.cityName.toLowerCase().includes(lowercaseQuery) ||
      item.airportName.toLowerCase().includes(lowercaseQuery) ||
      item.code.toLowerCase().includes(lowercaseQuery)
    );

    return matchingResults.slice(0, 8); // Show top 8 results
  };

  // Handle city/airport selection
  const handleCitySelect = (item, type) => {
    const formattedSelection = `${item.cityName} – ${item.airportName} (${item.code})`;
    if (type === 'from') {
      setFromQuery(formattedSelection);
      setShowFromSuggestions(false);
    } else {
      setToQuery(formattedSelection);
      setShowToSuggestions(false);
    }
  };

  // Handle input changes
  const handleFromInputChange = (e) => {
    const value = e.target.value;
    setFromQuery(value);
    setShowFromSuggestions(true);
  };

  const handleToInputChange = (e) => {
    const value = e.target.value;
    setToQuery(value);
    setShowToSuggestions(true);
  };

  // Handle date changes with validation
  const handleDepartureDateChange = (date) => {
    setDepartureDate(date);
    if (returnDate && new Date(returnDate) < new Date(date)) {
      setReturnDate('');
    }
  };

  // Get minimum return date
  const getMinReturnDate = () => {
    return departureDate || new Date().toISOString().split('T')[0];
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render sample data based on active service
  const renderServiceData = () => {
    switch (activeService) {
      case 'flights':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-6 grid grid-cols-1 gap-4"
          >
            {sampleFlights.map(flight => (
              <motion.div 
                key={flight.id} 
                variants={cardVariants}
                whileHover="hover"
                className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <motion.p 
                      whileHover={{ scale: 1.02 }}
                      className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {flight.airline}
                    </motion.p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {flight.flightNo} • {flight.aircraft}
                    </p>
                  </div>
                  <div className="text-right">
                    <motion.p 
                      whileHover={{ scale: 1.05 }}
                      className="font-bold text-xl text-blue-500"
                    >
                      ₹{flight.price}
                    </motion.p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {flight.duration}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      <span className="font-medium">{flight.from}</span> → <span className="font-medium">{flight.to}</span>
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {flight.departure} - {flight.arrival}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {flight.amenities.map((amenity, index) => (
                    <motion.span 
                      key={index} 
                      whileHover={{ scale: 1.05 }}
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {amenity}
                    </motion.span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className="text-yellow-400"
                  >
                    {'★'.repeat(Math.floor(flight.rating))}
                  </motion.span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {flight.rating} ({flight.reviews} reviews)
                  </span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform transition-all duration-200"
                >
                  Book Now
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'hotels':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {sampleHotels.map(hotel => (
              <motion.div 
                key={hotel.id} 
                variants={cardVariants}
                whileHover="hover"
                className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}
              >
                <motion.h3 
                  whileHover={{ scale: 1.02 }}
                  className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {hotel.name}
                </motion.h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{hotel.city}</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="text-yellow-400"
                    >
                      {'★'.repeat(hotel.rating)}
                    </motion.span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ({hotel.reviews})
                    </span>
                  </div>
                  <motion.p 
                    whileHover={{ scale: 1.05 }}
                    className="font-bold text-lg text-blue-500 mt-2"
                  >
                    Starting from ₹{hotel.price}
                  </motion.p>
                  <div className="mt-2">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Room Types:
                    </p>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {hotel.roomTypes.map((room, index) => (
                        <motion.div 
                          key={index} 
                          whileHover={{ scale: 1.02 }}
                          className="flex justify-between text-sm"
                        >
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {room.type}
                          </span>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            ₹{room.price}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.amenities.map((amenity, index) => (
                      <motion.span 
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {amenity}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform transition-all duration-200"
                >
                  Book Now
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'buses':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-6 grid grid-cols-1 gap-4"
          >
            {sampleBuses.map(bus => (
              <motion.div 
                key={bus.id} 
                variants={cardVariants}
                whileHover="hover"
                className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <motion.p 
                      whileHover={{ scale: 1.02 }}
                      className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {bus.operator}
                    </motion.p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {bus.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <motion.p 
                      whileHover={{ scale: 1.05 }}
                      className="font-bold text-xl text-blue-500"
                    >
                      ₹{bus.price}
                    </motion.p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {bus.seats}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <span className="font-medium">{bus.from}</span> → <span className="font-medium">{bus.to}</span>
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {bus.departure} - {bus.arrival}
                  </p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="text-yellow-400"
                    >
                      {'★'.repeat(Math.floor(bus.rating))}
                    </motion.span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ({bus.rating})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities.map((amenity, index) => (
                      <motion.span 
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {amenity}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform transition-all duration-200"
                >
                  Book Now
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'trains':
        return (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {sampleTrains.map(train => (
              <div key={train.id} className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}>
                {/* Header with Train Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{train.thumbnail}</span>
                    <div>
                      <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {train.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Train No: {train.number} • {train.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {train.duration}
                    </p>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="mt-4">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <span className="font-medium">{train.from}</span> → <span className="font-medium">{train.to}</span>
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {train.departure} - {train.arrival}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-yellow-400">{'★'.repeat(Math.floor(train.rating))}</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {train.rating} ({train.reviews} reviews)
                  </span>
                </div>

                {/* Classes and Prices */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Available Classes:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {train.classes.map((cls, index) => (
                      <div key={index} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">{cls.type}</span>
                        <div className="flex justify-between items-center">
                          <span>₹{cls.price}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            cls.seats === 'Available' 
                              ? 'bg-green-100 text-green-700' 
                              : cls.seats === 'RAC'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {cls.seats}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Amenities & Features:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {train.amenities.map((amenity, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meals */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Included Meals:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {train.meals.map((meal, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {meal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Book Now Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        );
      case 'homestays':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleHomestays.map(homestay => (
              <div key={homestay.id} className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{homestay.name}</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{homestay.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-500">₹{homestay.price}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>per night</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">{'★'.repeat(Math.floor(homestay.rating))}</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>({homestay.rating})</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {homestay.rooms} Rooms • Up to {homestay.maxGuests} Guests • {homestay.type}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {homestay.amenities.map((amenity, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        );
      case 'cabs':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleCabs.map(cab => (
              <div key={cab.id} className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cab.type}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cab.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-500">{cab.price}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>ETA: {cab.eta}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cab.capacity} • {cab.ac ? 'AC' : 'Non-AC'}</p>
                  <div className="mt-2">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Available Cars:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {cab.carModels.map((model, index) => (
                        <span key={index} className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        );
      case 'insurance':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleInsurance.map(insurance => (
              <div key={insurance.id} className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{insurance.provider}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{insurance.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-500">₹{insurance.price}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{insurance.duration}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Coverage: {insurance.coverage}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Claim Process: {insurance.claimProcess}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {insurance.benefits.map((benefit, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        );
      case 'holiday':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleHolidayPackages.map(holidayPackage => (
              <div key={holidayPackage.id} className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{holidayPackage.thumbnail}</span>
                      <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {holidayPackage.name}
                      </h3>
                    </div>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {holidayPackage.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-500">₹{holidayPackage.price}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>per person</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-yellow-400">{'★'.repeat(Math.floor(holidayPackage.rating))}</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {holidayPackage.rating} ({holidayPackage.reviews} reviews)
                  </span>
                </div>

                {/* Locations */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Destinations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {holidayPackage.locations.map((location, index) => (
                      <span
                        key={index}
                        className={`text-sm px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Package Highlights:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {holidayPackage.highlights.map((highlight, index) => (
                      <p key={index} className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span>✓</span> {highlight}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Activities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {holidayPackage.activities.map((activity, index) => (
                      <span
                        key={index}
                        className={`text-sm px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start Dates */}
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Upcoming Dates:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {holidayPackage.startDates.map((date, index) => (
                      <span
                        key={index}
                        className={`text-sm px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#2d3348] text-white' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {new Date(date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Book Now Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Apply zoom level to main content
  const contentStyle = {
    zoom: `${zoomLevel}%`,
  };

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#1a1e2e]' : 'bg-white'}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${
          isDarkMode 
            ? 'bg-[#1a1e2e] border-[#2d3348]' 
            : 'bg-white/70 hover:bg-white border-white/20'
        } border-b sticky top-0 z-50 shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex w-full">
            <div className="w-[280px] px-4 py-3">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
              >
                TapNTrip
              </motion.h1>
            </div>
            <div className="flex-1 px-4 flex justify-end">
              <div className="flex items-center space-x-4">
                {/* Zoom Controls */}
                <div className="flex items-center space-x-2 mr-4 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={decreaseZoom}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                    title="Zoom Out"
                  >
                    <span className="text-xl">−</span>
                  </motion.button>
                  <span className="text-sm font-medium">{zoomLevel}%</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={increaseZoom}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                    title="Zoom In"
                  >
                    <span className="text-xl">+</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetZoom}
                    className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                    title="Reset Zoom"
                  >
                    Reset
                  </motion.button>
                </div>
                
                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#1a1e2e] hover:bg-[#2d3348]' : 'bg-blue-50 hover:bg-blue-100'} transition-all duration-200`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? '🌞' : '🌙'}
                </motion.button>
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 py-6" style={contentStyle}>
            <div className="flex gap-6">
              {/* Left Sidebar */}
              <div className="w-[280px]">
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className={`w-full ${
                    isDarkMode 
                      ? 'bg-[#1a1e2e] border-[#2d3348]' 
                      : 'bg-white/70 hover:bg-white border-white/20'
                  } rounded-2xl p-4 h-fit shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}
                >
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveService(service.id)}
                      className={`w-full flex items-center p-3 rounded-xl mb-2 transition-all duration-200 ${
                        activeService === service.id 
                          ? isDarkMode 
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white' 
                            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-[#2d3348]'
                            : 'text-gray-600 hover:bg-white/90'
                      }`}
                    >
                      <motion.span 
                        className="text-2xl mr-3"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {service.icon}
                      </motion.span>
                      <span className="text-sm font-medium">{service.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Main Content Area */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 min-w-0 space-y-6"
              >
                {/* Search Section */}
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
                        className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white px-12 py-4 rounded-xl text-lg font-medium transform transition-all duration-200 shadow-lg hover:shadow-xl overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center">
                          <span>Search</span>
                          <span className="ml-2">🔍</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Results Section */}
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
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeService}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {renderServiceData()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <RightPanel />
      </div>
    </div>
  );
};

export default CustomerDashboard; 