import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  sampleHolidayPackages,
  sampleUpcomingTrips,
  sampleRecommendedDestinations,
  sampleTopOffers
} from '../../utils/sampleData';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerProfile from './Profile';
import MyBookings from './MyBookings';
import FlightFilters from './FlightFilters';
import SearchSection from './SearchSection';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../common/LanguageSelector';
import PackagesPage from './packages/PackagesPage';
import ActivitiesPage from './activities/ActivitiesPage';
import ScrollToTop from '../common/ScrollToTop';

const CustomerDashboard = ({ initialSection = 'dashboard', initialService = 'flights' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme, zoomLevel, increaseZoom, decreaseZoom, resetZoom } = useTheme();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [activeService, setActiveService] = useState(initialService);
  const [tripType, setTripType] = useState('oneWay');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const [filters, setFilters] = useState({
    priceRange: [1000, 50000],
    airlines: [],
    timeSlots: [],
    stops: []
  });
  const { t } = useTranslation();

  // Mock rewards data
  const userRewards = {
    points: 1800,
    tier: 'Silver',
    nextTier: 'Gold',
    pointsToNextTier: 1200,
    history: [
      { id: 1, date: '2023-12-15', description: 'Flight to Mumbai', points: 350 },
      { id: 2, date: '2023-11-20', description: 'Hotel booking in Goa', points: 500 },
      { id: 3, date: '2023-10-05', description: 'Train to Delhi', points: 200 },
      { id: 4, date: '2023-09-18', description: 'Welcome bonus', points: 750 }
    ],
    benefits: [
      { tier: 'Silver', benefit: 'Priority check-in' },
      { tier: 'Silver', benefit: '10% discount on hotel bookings' },
      { tier: 'Silver', benefit: 'Extra baggage allowance' },
      { tier: 'Gold', benefit: 'Lounge access', locked: true },
      { tier: 'Gold', benefit: '15% discount on all bookings', locked: true },
      { tier: 'Gold', benefit: 'Free cancellation', locked: true }
    ]
  };

  // CSS for hiding scrollbar but keeping functionality
  const scrollbarHideStyles = {
    '.hide-scrollbar': {
      '-ms-overflow-style': 'none',
      'scrollbarWidth': 'none',
    },
    '.hide-scrollbar::-webkit-scrollbar': {
      display: 'none',
    }
  };

  // Add the styles to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Update the services array to use translations
  const services = useMemo(() => [
    { id: 'dashboard', label: t('navbar.dashboard'), icon: '🏠' },
    { id: 'flights', label: t('navbar.flights'), icon: '✈️' },
    { id: 'hotels', label: t('navbar.hotels'), icon: '🏨' },
    { id: 'trains', label: t('navbar.trains'), icon: '🚆' },
    { id: 'buses', label: t('navbar.buses'), icon: '🚌' },
    { id: 'packages', label: t('navbar.packages'), icon: '📦' },
    { id: 'activities', label: t('navbar.activities'), icon: '🏄‍♂️' },
    { id: 'my-bookings', label: t('navbar.myBookings'), icon: '🧳' },
    { id: 'rewards', label: t('navbar.rewards'), icon: '🏆' },
  ], [t]);

  const fareTypes = [
    { id: 'regular', label: 'Regular', description: 'Regular fares' },
    { id: 'student', label: 'Student', description: 'Extra discounts/baggage', discount: '₹600 off' },
    { id: 'senior', label: 'Senior Citizen', description: 'Up to ₹600 off' },
    { id: 'armed', label: 'Armed Forces', description: 'Up to ₹600 off' },
    { id: 'doctor', label: 'Doctor and Nurses', description: 'Up to ₹600 off' },
  ];

  // Sample recommended trips data
  const recommendedTrips = [
    {
      id: 1,
      destination: 'Goa',
      image: '/images/adventure/Goa New Year Bash.png',
      description: 'Beaches, nightlife, and seafood paradise',
      price: '₹8,999',
      rating: 4.8,
      duration: '4 days'
    },
    {
      id: 2,
      destination: 'Rishikesh',
      image: '/images/adventure/A-Complete-Tour-Guide-for-Rafting-in-Rishikesh.webp',
      description: 'Adventure and spiritual retreat',
      price: '₹7,499',
      rating: 4.7,
      duration: '3 days'
    },
    {
      id: 3,
      destination: 'Manali',
      image: '/images/adventure/Manali Snow Trek.jpeg',
      description: 'Snow-capped mountains and scenic valleys',
      price: '₹9,999',
      rating: 4.9,
      duration: '5 days'
    },
    {
      id: 4,
      destination: 'Vaishno Devi',
      image: '/images/religious/Vaishno Devi.jpg',
      description: 'Spiritual pilgrimage in the mountains',
      price: '₹6,499',
      rating: 4.6,
      duration: '3 days'
    },
    {
      id: 5,
      destination: 'Amritsar',
      image: '/images/religious/Golden Temple.jpg',
      description: 'Golden Temple and cultural heritage',
      price: '₹5,999',
      rating: 4.7,
      duration: '2 days'
    }
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



  // Get unique airlines from sample data
  const airlines = [...new Set(sampleFlights.map(flight => flight.airline))];

  // Helper function to check if a flight's departure time falls within a time slot
  const isInTimeSlot = (departure, timeSlot) => {
    const hour = parseInt(departure.split(':')[0]);
    switch (timeSlot) {
      case 'morning':
        return hour >= 6 && hour < 12;
      case 'afternoon':
        return hour >= 12 && hour < 18;
      case 'evening':
        return hour >= 18 && hour < 24;
      case 'night':
        return hour >= 0 && hour < 6;
      default:
        return false;
    }
  };

  // Filter flights based on selected filters
  const getFilteredFlights = () => {
    return sampleFlights.filter(flight => {
      // Price filter
      const price = flight.price;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Airline filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }

      // Time slot filter
      if (filters.timeSlots.length > 0 && !filters.timeSlots.some(slot => isInTimeSlot(flight.departure, slot))) {
        return false;
      }

      // Stops filter
      if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
        return false;
      }

      return true;
    });
  };

  // Render sample data based on active service
  const renderServiceData = () => {
    switch (activeService) {
      case 'flights':
        return (
          <div className="space-y-6">
            {/* Search Form */}
            <div className={`${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              {/* ... existing search form ... */}
            </div>

            {/* Filters */}
            <FlightFilters
              filters={filters}
              setFilters={setFilters}
              airlines={airlines}
            />

            {/* Trips You May Like */}
            <div className={`${
              isDarkMode 
                ? 'bg-[#1a1e2e] border-[#2d3348]' 
                : 'bg-white/70 hover:bg-white border-white/20'
            } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border mb-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('trips.tripsYouMayLike')}
                </h2>
                <button className={`text-sm font-medium px-3 py-1 rounded-lg ${
                  isDarkMode ? 'bg-[#2d3348] hover:bg-[#3a4056] text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                } transition-all duration-200`}>
                  {t('trips.viewAll')} →
                </button>
              </div>
              
              <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4">
                {recommendedTrips.slice(0, 3).map(trip => (
                  <motion.div
                    key={trip.id}
                    whileHover={{ scale: 1.03 }}
                    className={`flex-shrink-0 w-72 rounded-xl overflow-hidden shadow-md ${
                      isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={trip.image} 
                        alt={trip.destination} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h3 className="text-white text-lg font-bold">{trip.destination}</h3>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">{'★'.repeat(Math.floor(trip.rating))}</span>
                          <span className="text-white text-xs">{trip.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {trip.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <p className="text-blue-500 font-bold">{trip.price}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {trip.duration}
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                          {t('trips.bookNow')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Flight Results */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 gap-4"
            >
              {getFilteredFlights().map(flight => (
                <motion.div 
                  key={flight.id} 
                  variants={cardVariants}
                  whileHover="hover"
                  className={`relative ${isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white'} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}
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
                        ₹{flight.price.toLocaleString()}
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
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
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
                    {t('common.book')}
                  </motion.button>
                </motion.div>
              ))}

              {getFilteredFlights().length === 0 && (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p className="text-xl">No flights found matching your filters</p>
                  <p className="mt-2">Try adjusting your filters to see more results</p>
                </div>
              )}
            </motion.div>
          </div>
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
                  {t('common.book')}
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
      case 'packages':
        return <PackagesPage />;
      case 'activities':
        return <ActivitiesPage />;
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

  // Function to determine if search section should be shown
  const shouldShowSearchSection = () => {
    const path = location.pathname;
    
    // Extract the last part of the path
    const currentPath = path.split('/').pop();
    
    // Show on flights, trains, buses pages
    if (path.includes('/flights') || currentPath === 'flights') {
      return true;
    }
    
    if (path.includes('/trains') || currentPath === 'trains') {
      return true;
    }
    
    if (path.includes('/buses') || currentPath === 'buses') {
      return true;
    }
    
    // For internal navigation using activeSection/activeService
    if (activeSection === 'service' && 
        (activeService === 'flights' || activeService === 'trains' || activeService === 'buses')) {
      return true;
    }
    
    // Hide on dashboard, my-bookings, profile, hotels
    return false;
  };

  // Render dashboard view with welcome message and service cards
  const renderDashboardView = () => {
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              isDarkMode 
                ? 'bg-[#1a1e2e] border-[#2d3348]' 
                : 'bg-white/70 hover:bg-white border-white/20'
            } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}
          >
            <div className="text-center">
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome to TapNTrip
              </h1>
              <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your one-stop destination for all your travel needs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.slice(1).map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.05 }}
                    className={`${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-white hover:bg-gray-50'
                    } p-6 rounded-xl shadow-md cursor-pointer`}
                    onClick={() => {
                  // Use React Router navigation
                  if (service.id === 'dashboard') {
                    navigate('/customer-dashboard');
                  } else if (service.id === 'my-bookings') {
                    navigate('/my-bookings');
                  } else if (service.id === 'profile') {
                    navigate('/profile');
                  } else if (service.id === 'rewards') {
                    navigate('/rewards');
                    setActiveSection('rewards');
                  } else {
                    navigate(`/${service.id}`);
                  }
                  
                  // Also update internal state for components that rely on it
                      setActiveService(service.id);
                  setActiveSection(service.id === 'dashboard' ? 'dashboard' : service.id === 'my-bookings' ? 'my-bookings' : service.id === 'rewards' ? 'rewards' : 'service');
                    }}
                  >
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {service.label}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Browse {service.label.toLowerCase()} and book your journey
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
  };

  // Render rewards view
  const renderRewardsView = () => {
        return (
            <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Rewards Header */}
        <div className={`${
                isDarkMode 
                  ? 'bg-[#1a1e2e] border-[#2d3348]' 
                  : 'bg-white/70 hover:bg-white border-white/20'
        } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-3xl">
                🏆
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('rewards.myRewards')}
                </h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('rewards.earnPoints')}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setShowRewardsModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md"
              >
                {t('rewards.howRewardsWork')}
              </button>
            </div>
          </div>
        </div>

        {/* Points and Tier Card */}
        <div className={`${
          isDarkMode 
            ? 'bg-[#1a1e2e] border-[#2d3348]' 
            : 'bg-white/70 hover:bg-white border-white/20'
        } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points Card */}
            <motion.div 
                      whileHover={{ scale: 1.02 }}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
              } p-6 rounded-xl shadow-md`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('rewards.yourPoints')}
              </h3>
              <div className="flex items-end space-x-2">
                <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userRewards.points}
                </span>
                <span className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('rewards.points')}
                </span>
                </div>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userRewards.pointsToNextTier} more points to reach {userRewards.nextTier}
              </p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${(userRewards.points / (userRewards.points + userRewards.pointsToNextTier)) * 100}%` }}
                ></div>
              </div>
            </motion.div>

            {/* Tier Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
              } p-6 rounded-xl shadow-md`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('rewards.yourTier')}
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-xl">
                  {userRewards.tier === 'Silver' ? '🥈' : '🥇'}
                </div>
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userRewards.tier}
                </span>
              </div>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('rewards.nextTier')}: {userRewards.nextTier}
              </p>
            </motion.div>
                                </div>
                              </div>

        {/* Benefits */}
        <div className={`${
          isDarkMode 
            ? 'bg-[#1a1e2e] border-[#2d3348]' 
            : 'bg-white/70 hover:bg-white border-white/20'
        } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('rewards.yourBenefits')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRewards.benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg ${
                  benefit.locked 
                    ? isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-500' 
                    : isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } relative`}
              >
                {benefit.locked && (
                  <div className="absolute top-2 right-2">
                    <span className="text-lg">🔒</span>
                        </div>
                      )}
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-2 py-1 rounded ${
                    benefit.tier === 'Silver' 
                      ? 'bg-gray-200 text-gray-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {benefit.tier}
                  </span>
                </div>
                <p className="mt-2">{benefit.benefit}</p>
              </motion.div>
            ))}
          </div>
                    </div>

        {/* Recent Activity */}
        <div className={`${
                          isDarkMode 
            ? 'bg-[#1a1e2e] border-[#2d3348]' 
            : 'bg-white/70 hover:bg-white border-white/20'
        } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('rewards.recentActivity')}
          </h3>
          <div className="space-y-3">
            {userRewards.history.map(item => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } p-4 rounded-lg shadow-sm flex justify-between items-center`}
              >
                                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.description}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                                  </p>
                                </div>
                <div className={`text-lg font-bold ${item.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                              </div>
              </motion.div>
                          ))}
                    </div>
                  </div>

        {/* Rewards Modal */}
        {showRewardsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white text-gray-900'
              } rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">How Rewards Work</h2>
                <button 
                  onClick={() => setShowRewardsModal(false)}
                  className="text-2xl hover:text-gray-500 transition-colors"
                >
                  &times;
                </button>
                  </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Earning Points</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Earn points with every booking you make on TapNTrip:
                  </p>
                  <ul className={`list-disc pl-5 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Flights: 10 points per ₹100 spent</li>
                    <li>Hotels: 5 points per ₹100 spent</li>
                    <li>Trains & Buses: 3 points per ₹100 spent</li>
                    <li>Special promotions: Bonus points during sales</li>
                  </ul>
                    </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tier Benefits</h3>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">🥈</span>
                        <h4 className="font-bold">Silver Tier (0-3,000 points)</h4>
                      </div>
                      <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>Priority check-in</li>
                        <li>10% discount on hotel bookings</li>
                        <li>Extra baggage allowance</li>
                      </ul>
                </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">🥇</span>
                        <h4 className="font-bold">Gold Tier (3,000+ points)</h4>
                </div>
                      <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>All Silver benefits</li>
                        <li>Lounge access</li>
                        <li>15% discount on all bookings</li>
                        <li>Free cancellation</li>
                      </ul>
              </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Redeeming Points</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    You can redeem your points for:
                  </p>
                  <ul className={`list-disc pl-5 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Flight discounts</li>
                    <li>Hotel stays</li>
                    <li>Seat upgrades</li>
                    <li>Exclusive experiences</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowRewardsModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Got it
                </button>
              </div>
                  </motion.div>
              </div>
        )}
            </motion.div>
    );
  };

  // Render the main content based on active section
  const renderMainContent = () => {
    if (activeSection === 'dashboard') {
      return renderDashboardView();
    }
    switch (activeSection) {
      case 'profile':
        return <CustomerProfile />;
      case 'my-bookings':
        return <MyBookings />;
      case 'rewards':
        return renderRewardsView();
      case 'service':
        return (
          <div className="space-y-6">
            {/* Search Section - conditionally rendered */}
            {shouldShowSearchSection() && (
              <SearchSection
                tripType={tripType}
                setTripType={setTripType}
                fromQuery={fromQuery}
                setFromQuery={setFromQuery}
                toQuery={toQuery}
                setToQuery={setToQuery}
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                showFromSuggestions={showFromSuggestions}
                setShowFromSuggestions={setShowFromSuggestions}
                showToSuggestions={showToSuggestions}
                setShowToSuggestions={setShowToSuggestions}
                getFilteredCities={getFilteredCities}
                handleCitySelect={handleCitySelect}
                handleFromInputChange={handleFromInputChange}
                handleToInputChange={handleToInputChange}
                handleDepartureDateChange={handleDepartureDateChange}
                getMinReturnDate={getMinReturnDate}
                fromRef={fromRef}
                toRef={toRef}
                cardVariants={cardVariants}
              />
            )}

            {/* Service Data */}
            {renderServiceData()}
          </div>
        );
      default:
        return null;
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
                {/* Language Selector */}
                <LanguageSelector isDarkMode={isDarkMode} />
                
                {/* Zoom Controls */}
                <div className="flex items-center space-x-2 mr-4 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={decreaseZoom}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                    title={t('common.zoomOut')}
                  >
                    <span className="text-xl">−</span>
                  </motion.button>
                  <span className="text-sm font-medium">{zoomLevel}%</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={increaseZoom}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                    title={t('common.zoomIn')}
                  >
                    <span className="text-xl">+</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetZoom}
                    className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                    title={t('common.reset')}
                  >
                    {t('common.reset')}
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
                  {t('navbar.logout')}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <div className="max-w-[90%] mx-auto px-4 md:px-6 py-6" style={contentStyle}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar */}
              <div className="w-full lg:w-[280px] flex-shrink-0">
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
                      onClick={() => {
                        // Use React Router navigation
                        if (service.id === 'dashboard') {
                          navigate('/customer-dashboard');
                        } else if (service.id === 'my-bookings') {
                          navigate('/my-bookings');
                        } else if (service.id === 'profile') {
                          navigate('/profile');
                        } else if (service.id === 'rewards') {
                          navigate('/rewards');
                          setActiveSection('rewards');
                        } else {
                          navigate(`/${service.id}`);
                        }
                        
                        // Also update internal state for components that rely on it
                        setActiveService(service.id);
                        setActiveSection(service.id === 'dashboard' ? 'dashboard' : service.id === 'my-bookings' ? 'my-bookings' : service.id === 'rewards' ? 'rewards' : 'service');
                      }}
                      className={`w-full flex items-center p-3 rounded-xl mb-2 transition-all duration-200 ${
                        (service.id === activeService && 
                         ((service.id === 'dashboard' && activeSection === 'dashboard') || 
                          (service.id !== 'dashboard' && activeSection === 'service'))) ||
                        (service.id === 'my-bookings' && activeSection === 'my-bookings')
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

                {/* Profile Section */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className={`w-full mt-4 ${
                    isDarkMode 
                      ? 'bg-[#1a1e2e] border-[#2d3348]' 
                      : 'bg-white/70 hover:bg-white border-white/20'
                  } rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}
                >
                  <div 
                    className="flex items-center space-x-3 cursor-pointer" 
                    onClick={() => {
                      navigate('/profile');
                      setActiveSection('profile');
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        My Profile
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        View and edit your profile
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Content */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 min-w-0 space-y-6 mt-6 lg:mt-0"
              >
                {renderMainContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default CustomerDashboard;