import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { indianCities } from '../../utils/indianCities';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerProfile from './Profile';
import MyBookings from './MyBookings';
// import FlightFilters from './FlightFilters'; // Commented out - component doesn't exist
import SearchSection from './SearchSection';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../common/LanguageSelector';
import PackagesPage from './packages/PackagesPage';
import ActivitiesPage from './activities/ActivitiesPage';
import ScrollToTop from '../common/ScrollToTop';
import HealthAccessibility from './HealthAccessibility.tsx';
import EmergencyButton from './EmergencyButton';
import AccessibilityFilters from './AccessibilityFilters';
import MyJournal from './MyJournal';
import RealTimeAssistant from '../common/RealTimeAssistant';
import FamilyLocationSharing from './FamilyLocationSharing';
import Reminders from './Reminders';
import EmergencyPage from './EmergencyPage';
import { auth } from '../../firebase-config';
import { signOut } from 'firebase/auth';
import { getHotels, getBuses, saveBooking, getUserRewards, updateUserRewards, addRewardHistory } from '../../services/firestoreService';
import TourGuidePage from './TourGuideSection';
import { useAuth } from '../../contexts/AuthContext';

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
  const { t } = useTranslation();

  const [showHealthProfile, setShowHealthProfile] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [showAccessibilityFilters, setShowAccessibilityFilters] = useState(false);
  const [healthProfile, setHealthProfile] = useState(null);
  const [accessibilityFilters, setAccessibilityFilters] = useState({ wheelchair: false, largeText: false, audioAssistance: false });

  const [emergencyMode, setEmergencyMode] = useState(false);

  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState(null);

  const [buses, setBuses] = useState([]);
  const [busesLoading, setBusesLoading] = useState(false);
  const [busesError, setBusesError] = useState(null);

  const { user } = useAuth();

  const [userRewards, setUserRewards] = useState(null);
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [rewardsError, setRewardsError] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      setRewardsLoading(true);
      getUserRewards(user.uid)
        .then(data => setUserRewards(data))
        .catch(() => setRewardsError('Failed to load rewards'))
        .finally(() => setRewardsLoading(false));
    }
  }, [user?.uid]);

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

  // Update the services array to use translations
  const services = useMemo(() => [
    { id: 'dashboard', label: t('navbar.dashboard'), icon: '\ud83c\udfe0' },
    { id: 'flights', label: t('navbar.flights'), icon: '\u2708\ufe0f' },
    { id: 'hotels', label: t('navbar.hotels'), icon: '\ud83c\udfe8' },
    { id: 'trains', label: t('navbar.trains'), icon: '\ud83d\ude86' },
    { id: 'buses', label: t('navbar.buses'), icon: '\ud83d\ude8c' },
    { id: 'packages', label: t('navbar.packages'), icon: '\ud83d\udce6' },
    { id: 'activities', label: t('navbar.activities'), icon: '\ud83c\udf0a' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'tour-guides', label: 'Tour Guides', icon: '\ud83e\uddd1\u200d\ud83c\udfeb' },
    { id: 'my-bookings', label: t('navbar.myBookings'), icon: '\ud83e\uddf3' },
    { id: 'rewards', label: t('navbar.rewards'), icon: '\ud83c\udfc6' },
    { id: 'journal', label: 'My Journal', icon: '\ud83d\udcd4' },
    { id: 'health-accessibility', label: 'Health & Accessibility', icon: '\u267f' },
    { id: 'assistant', label: 'Assistant', icon: '\ud83e\udd16' },
    { id: 'family-location', label: 'Family Location', icon: '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66' },
    { id: 'reminders', label: 'Reminders', icon: '\u23f0' },
  ], [t]);

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
  const getFilteredFlights = () => [];

  // Render sample data based on active service
  const renderServiceData = () => {
    switch (activeService) {
      case 'flights':
        return (
          <div className="space-y-6">
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
                {/* ... existing recommended trips data ... */}
              </div>
            </div>

            {/* Flight Results */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 gap-4"
            >
              {/* ... existing flight results ... */}
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
            {hotelsLoading && <div>Loading hotels...</div>}
            {hotelsError && <div className="text-red-500">{hotelsError}</div>}
            {!hotelsLoading && !hotelsError && hotels.length === 0 && <div>No hotels found.</div>}
            {!hotelsLoading && !hotelsError && hotels.map(hotel => (
              <motion.div
                key={hotel.id}
                variants={cardVariants}
                whileHover="hover"
                className="border rounded-lg shadow-md p-4 bg-white dark:bg-[#1a1e2e]"
              >
                {hotel.image && (
                  <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover rounded-md mb-3" />
                )}
                <h3 className="text-lg font-bold mb-1">{hotel.name || 'Unnamed Room'}</h3>
                <div className="text-sm text-gray-500 mb-1">Type: {hotel.type || 'N/A'}</div>
                <div className="text-blue-600 font-semibold mb-1">₹{hotel.price} / night</div>
                <div className="text-sm mb-1">Capacity: {hotel.capacity || '-'} | Beds: {hotel.beds || '-'} | Size: {hotel.size || '-'} sqft</div>
                <div className="text-sm mb-1">Floor: {hotel.floor || '-'} | Room #: {hotel.roomNumber || '-'}</div>
                <div className="text-sm mb-1">Status: <span className={hotel.status === 'available' ? 'text-green-600' : 'text-red-600'}>{hotel.status}</span></div>
                {hotel.description && (
                  <div className="text-sm text-gray-700 dark:text-gray-400 mb-1">{hotel.description}</div>
                )}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="text-sm mt-2">
                    <span className="font-semibold">Amenities:</span>
                    <ul className="list-disc pl-5">
                      {Array.isArray(hotel.amenities)
                        ? hotel.amenities.map((a, i) => <li key={i}>{a}</li>)
                        : hotel.amenities.split(',').map((a, i) => <li key={i}>{a.trim()}</li>)}
                    </ul>
                  </div>
                )}
                <button
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => {
                    setSelectedHotel(hotel);
                    setShowHotelBooking(true);
                    setHotelBookingData({ name: '', contact: '', checkin: '', checkout: '' });
                    setHotelBookingStatus('');
                  }}
                  disabled={hotel.status !== 'available'}
                >
                  Book Now
                </button>
              </motion.div>
            ))}
            {/* Booking Modal */}
            {showHotelBooking && selectedHotel && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#1a1e2e] p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  {/* Title Bar with Close Button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Book: {selectedHotel.name}</h3>
                    <button
                      type="button"
                      className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                      onClick={() => setShowHotelBooking(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <form onSubmit={async e => {
                    e.preventDefault();
                    if (!user) {
                      setHotelBookingStatus('You must be logged in to book.');
                      return;
                    }
                    try {
                      await saveBooking({
                        userId: user.uid,
                        type: 'hotel',
                        hotelId: selectedHotel.id,
                        hotelName: selectedHotel.name,
                        hotelProviderId: selectedHotel.providerId || '',
                        bookingData: hotelBookingData,
                      });
                      setHotelBookingStatus('Booking submitted successfully!');
                      setTimeout(() => setShowHotelBooking(false), 1500);
                    } catch (err) {
                      setHotelBookingStatus('Failed to submit booking.');
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={hotelBookingData.name}
                        onChange={e => setHotelBookingData({ ...hotelBookingData, name: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Info</label>
                      <input
                        type="text"
                        name="contact"
                        placeholder="Contact Info"
                        value={hotelBookingData.contact}
                        onChange={e => setHotelBookingData({ ...hotelBookingData, contact: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Check-in</label>
                        <input
                          type="date"
                          name="checkin"
                          value={hotelBookingData.checkin}
                          onChange={e => setHotelBookingData({ ...hotelBookingData, checkin: e.target.value })}
                          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Check-out</label>
                        <input
                          type="date"
                          name="checkout"
                          value={hotelBookingData.checkout}
                          onChange={e => setHotelBookingData({ ...hotelBookingData, checkout: e.target.value })}
                          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                        onClick={() => setShowHotelBooking(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Confirm Booking
                      </button>
                    </div>
                    {hotelBookingStatus && <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2 mt-2 text-center font-semibold">{hotelBookingStatus}</div>}
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'buses':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {busesLoading && <div>Loading buses...</div>}
            {busesError && <div className="text-red-500">{busesError}</div>}
            {!busesLoading && !busesError && buses.length === 0 && <div>No buses found.</div>}
            {!busesLoading && !busesError && buses.map(bus => (
              <motion.div
                key={bus.id}
                variants={cardVariants}
                whileHover="hover"
                className="border rounded-lg shadow-md p-4 bg-white dark:bg-[#1a1e2e]"
              >
                {bus.image && (
                  <img src={bus.image} alt={bus.name} className="w-full h-40 object-cover rounded-md mb-3" />
                )}
                <h3 className="text-lg font-bold mb-1">{bus.name || 'Unnamed Bus'}</h3>
                <div className="text-sm text-gray-500 mb-1">Type: {bus.type || 'N/A'}</div>
                <div className="text-sm mb-1">Capacity: {bus.capacity || '-'} | Make: {bus.make || '-'} | Model: {bus.model || '-'}</div>
                <div className="text-sm mb-1">Year: {bus.year || '-'} | License Plate: {bus.licensePlate || '-'}</div>
                <div className="text-sm mb-1">Fuel: {bus.fuelType || '-'} | Transmission: {bus.transmission || '-'}</div>
                <div className="text-sm mb-1">Mileage: {bus.mileage || '-'}</div>
                <div className="text-sm mb-1">Status: <span className={bus.status === 'active' ? 'text-green-600' : 'text-red-600'}>{bus.status}</span></div>
                {bus.description && (
                  <div className="text-sm text-gray-700 dark:text-gray-400 mb-1">{bus.description}</div>
                )}
                {bus.features && bus.features.length > 0 && (
                  <div className="text-sm mt-2">
                    <span className="font-semibold">Features:</span>
                    <ul className="list-disc pl-5">
                      {Array.isArray(bus.features)
                        ? bus.features.map((f, i) => <li key={i}>{f}</li>)
                        : bus.features.split(',').map((f, i) => <li key={i}>{f.trim()}</li>)}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        );
      case 'trains':
        return (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {/* Train results will be displayed here. Add your train data rendering logic. */}
          </div>
        );
      case 'homestays':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... existing homestay data ... */}
          </div>
        );
      case 'cabs':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... existing cab data ... */}
          </div>
        );
      case 'insurance':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... existing insurance data ... */}
          </div>
        );
      case 'packages':
        return <PackagesPage />;
      case 'activities':
        return <ActivitiesPage />;
      case 'holiday':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... existing holiday package data ... */}
          </div>
        );
      case 'health-accessibility':
        return <HealthAccessibility />;
      case 'emergency':
        return <EmergencyPage />;
      case 'journal':
        return <MyJournal />;
      case 'accessibility':
        return <AccessibilityFilters filters={accessibilityFilters} onChange={e => setAccessibilityFilters({ ...accessibilityFilters, [e.target.name]: e.target.checked })} />;
      case 'assistant':
        return <RealTimeAssistant />;
      case 'family-location':
        return <FamilyLocationSharing />;
      case 'reminders':
        return <Reminders />;
      case 'tour-guides':
        return <TourGuidePage />;
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
    const currentPath = path.split('/').pop();
    // Show on flights, trains pages only (not buses)
    if (path.includes('/flights') || currentPath === 'flights') {
      return true;
    }
    if (path.includes('/trains') || currentPath === 'trains') {
      return true;
    }
    // For internal navigation using activeSection/activeService
    if (activeSection === 'service' && (activeService === 'flights' || activeService === 'trains')) {
      return true;
    }
    return false;
  }

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
                      if (service.id === 'dashboard') {
                        navigate('/customer-dashboard');
                        setActiveSection('dashboard');
                      } else if (service.id === 'my-bookings') {
                        navigate('/my-bookings');
                        setActiveSection('my-bookings');
                      } else if (service.id === 'profile') {
                        navigate('/profile');
                        setActiveSection('profile');
                      } else if (service.id === 'rewards') {
                        navigate('/rewards');
                        setActiveSection('rewards');
                      } else if (service.id === 'health-accessibility') {
                        setActiveSection('health-accessibility');
                      } else if (service.id === 'journal') {
                        setActiveSection('journal');
                      } else if (service.id === 'assistant') {
                        setActiveSection('assistant');
                      } else if (service.id === 'family-location') {
                        setActiveSection('family-location');
                      } else if (service.id === 'reminders') {
                        setActiveSection('reminders');
                      } else if (service.id === 'tour-guides') {
                        setActiveSection('tour-guides');
                      } else if ([
                        'emergency',
                        'trip-planner',
                        'accessibility',
                      ].includes(service.id)) {
                        setActiveSection(service.id);
                      } else {
                        navigate(`/${service.id}`);
                        setActiveService(service.id);
                        setActiveSection('service');
                      }
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
    if (rewardsLoading) return <div>Loading rewards...</div>;
    if (rewardsError) return <div className="text-red-500">{rewardsError}</div>;
    if (!userRewards) return <div>No rewards data found.</div>;
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
      case 'health-accessibility':
        return <HealthAccessibility />;
      case 'emergency':
        return <EmergencyPage />;
      case 'journal':
        return <MyJournal />;
      case 'accessibility':
        return <AccessibilityFilters filters={accessibilityFilters} onChange={e => setAccessibilityFilters({ ...accessibilityFilters, [e.target.name]: e.target.checked })} />;
      case 'assistant':
        return <RealTimeAssistant />;
      case 'family-location':
        return <FamilyLocationSharing />;
      case 'reminders':
        return <Reminders />;
      case 'tour-guides':
        return <TourGuidePage />;
      default:
        return null;
    }
  };

  // Handler to trigger emergency mode from floating button
  const handleShowEmergency = () => setEmergencyMode(true);
  const handleCloseEmergency = () => setEmergencyMode(false);

  // Add logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (activeService === 'hotels') {
      setHotelsLoading(true);
      setHotelsError(null);
      getHotels()
        .then(data => setHotels(data))
        .catch(() => setHotelsError('Failed to load hotels.'))
        .finally(() => setHotelsLoading(false));
    }
  }, [activeService]);

  useEffect(() => {
    if (activeService === 'buses') {
      setBusesLoading(true);
      setBusesError(null);
      getBuses()
        .then(data => setBuses(data))
        .catch(() => setBusesError('Failed to load buses.'))
        .finally(() => setBusesLoading(false));
    }
  }, [activeService]);

  // Add state for booking modal
  const [showHotelBooking, setShowHotelBooking] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelBookingData, setHotelBookingData] = useState({ name: '', contact: '', checkin: '', checkout: '' });
  const [hotelBookingStatus, setHotelBookingStatus] = useState('');

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
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-64 min-h-screen bg-white/30 dark:bg-[#23263a]/60 backdrop-blur-xl rounded-2xl m-4 shadow-2xl border border-white/20 dark:border-[#2d3348] flex flex-col items-stretch transition-all duration-300`}
        >
          <div className="p-4">
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Navigation
            </h2>
            
            {/* Navigation Menu */}
            <nav className="space-y-2">
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                  whileHover={{ scale: 1.04, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                    setActiveSection(service.id);
                        if (service.id === 'dashboard') {
                          setActiveSection('dashboard');
                        } else if (service.id === 'my-bookings') {
                          setActiveSection('my-bookings');
                        } else if (service.id === 'profile') {
                          setActiveSection('profile');
                        } else if (service.id === 'rewards') {
                          setActiveSection('rewards');
                        } else if (service.id === 'health-accessibility') {
                          setActiveSection('health-accessibility');
                        } else if (service.id === 'journal') {
                          setActiveSection('journal');
                        } else if (service.id === 'assistant') {
                          setActiveSection('assistant');
                        } else if (service.id === 'family-location') {
                          setActiveSection('family-location');
                        } else if (service.id === 'reminders') {
                          setActiveSection('reminders');
                        } else if (service.id === 'tour-guides') {
                          setActiveSection('tour-guides');
                    } else if ([
                      'flights', 'hotels', 'trains', 'buses', 'packages', 'activities'
                    ].includes(service.id)) {
                          setActiveService(service.id);
                          setActiveSection('service');
                        }
                      }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left text-lg font-semibold transition-all duration-200 relative overflow-hidden group
                    ${activeSection === service.id || (activeSection === 'service' && activeService === service.id)
                      ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#2d3348]/60 hover:text-blue-700 dark:hover:text-blue-300'}
                  `}
                >
                  {/* Active indicator bar */}
                  <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all duration-300
                    ${activeSection === service.id || (activeSection === 'service' && activeService === service.id)
                      ? 'bg-gradient-to-b from-blue-400 to-pink-400 opacity-100'
                      : 'opacity-0'}
                  `}></span>
                  <span className="text-2xl flex-shrink-0">{service.icon}</span>
                  <span className="truncate">{service.label}</span>
                    </motion.button>
                  ))}
            </nav>
                    </div>
        </motion.aside>

              {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {renderMainContent()}
                    </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
      {activeSection !== 'emergency' && !emergencyMode && (
        <EmergencyButton onShowEmergency={handleShowEmergency} />
      )}
      {emergencyMode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20000, background: 'rgba(0,0,0,0.7)' }}>
          <EmergencyPage onClose={handleCloseEmergency} />
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard; 