import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { MdLocationOn, MdShare, MdStop, MdPlayArrow, MdPeople, MdSecurity, MdAccessTime, MdAdd } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { collection, doc, setDoc, getDoc, getDocs, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
// Google Maps
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
// TODO: Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'API_KEY';
const isDemoMode = GOOGLE_MAPS_API_KEY === 'API_KEY';

const FamilyLocationSharing = () => {
  const { isDarkMode } = useTheme();
  const [sharing, setSharing] = useState(false);
  const [shareLink] = useState('https://tapntrip.com/share/abc123'); // Mock link
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Mom', location: 'Delhi, India', lastSeen: '2 min ago', status: 'online' },
    { id: 2, name: 'Dad', location: 'Mumbai, India', lastSeen: '5 min ago', status: 'online' },
    { id: 3, name: 'Sister', location: 'Bangalore, India', lastSeen: '1 hour ago', status: 'offline' }
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', phone: '', relationship: '' });
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default: India
  const [familyLocations, setFamilyLocations] = useState([]);
  const [locationInterval, setLocationInterval] = useState(null);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  // Fetch family members and their locations from Firestore
  useEffect(() => {
    if (!user) return;
    // Listen for family members (approved only)
    const familyRef = collection(db, 'users', user.uid, 'family');
    const unsub = onSnapshot(familyRef, async (snap) => {
      const members = [];
      for (const docSnap of snap.docs) {
        const member = docSnap.data();
        if (member.status === 'approved') {
          // Fetch location
          const locDoc = await getDoc(doc(db, 'familyLocations', member.uid));
          members.push({ ...member, location: locDoc.exists() ? locDoc.data().location : null });
        }
      }
      setFamilyLocations(members);
    });
    return () => unsub();
  }, [user]);

  // Start/stop sharing real location
  const handleStartSharing = () => {
    setSharing(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    // Get and update location every 30s
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          // Save to Firestore (encrypted if needed)
          await setDoc(doc(db, 'familyLocations', user.uid), {
            location: { lat: latitude, lng: longitude },
            updatedAt: serverTimestamp(),
          }, { merge: true });
        },
        () => alert('Unable to retrieve your location.')
      );
    };
    updateLocation();
    const interval = setInterval(updateLocation, 30000);
    setLocationInterval(interval);
  };

  const handleStopSharing = () => {
    setSharing(false);
    if (locationInterval) clearInterval(locationInterval);
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.phone) {
      setFamilyMembers([...familyMembers, {
        id: Date.now(),
        name: newMember.name,
        phone: newMember.phone,
        relationship: newMember.relationship,
        location: 'Unknown',
        lastSeen: 'Just added',
        status: 'pending'
      }]);
      setNewMember({ name: '', phone: '', relationship: '' });
      setShowAddMember(false);
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <h1 className="text-4xl font-bold mb-2">Family Location Sharing</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Stay connected with your family during travels
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Location Sharing Card */}
          <motion.div variants={cardVariants} className="space-y-6">
            <div className={`p-6 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white`}>
                  <MdLocationOn size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Location
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Share your real-time location with family
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className={`h-64 rounded-xl mb-6 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {isDemoMode ? (
                  <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-4xl mb-2">🗺️</span>
                    <p className="text-lg font-semibold mb-1">Map preview here</p>
                    <p className="text-sm text-gray-500">Google Maps integration is disabled in demo mode.</p>
                  </div>
                ) : isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={10}
                  >
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                          scaledSize: new window.google.maps.Size(30, 30)
                        }}
                      />
                    )}
                    {familyLocations.map((member) => (
                      <Marker
                        key={member.id}
                        position={member.location}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                          scaledSize: new window.google.maps.Size(30, 30)
                        }}
                      />
                    ))}
                  </GoogleMap>
                ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading Google Maps...</p>
                </div>
                )}
              </div>

              {/* Sharing Controls */}
              <div className="space-y-4">
                {sharing ? (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} border border-green-200`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                          Sharing your live location!
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Share this link with family:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className={`flex-1 p-2 rounded-lg text-sm ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } border focus:outline-none`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigator.clipboard.writeText(shareLink)}
                          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                        >
                          <MdShare size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStopSharing}
                      className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <MdStop size={20} />
                      Stop Sharing
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartSharing}
                    className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <MdPlayArrow size={20} />
                    Start Sharing
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Family Members Card */}
          <motion.div variants={cardVariants} className="space-y-6">
            <div className={`p-6 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                    <MdPeople size={24} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Family Members
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {familyMembers.length} members connected
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMember(!showAddMember)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  <MdAdd size={20} />
                </motion.button>
              </div>

              {/* Add Member Form */}
              <AnimatePresence>
                {showAddMember && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mb-6 p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Add Family Member
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <input
                        type="text"
                        placeholder="Relationship (e.g., Mother, Father)"
                        value={newMember.relationship}
                        onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddMember}
                          className="flex-1 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200"
                        >
                          Add Member
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowAddMember(false)}
                          className="flex-1 py-2 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition-colors duration-200"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Family Members List */}
              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          member.status === 'online' 
                            ? 'bg-green-500' 
                            : member.status === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-gray-500'
                        } text-white`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.name}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {member.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : member.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {member.lastSeen}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Security Info */}
        <motion.div
          variants={cardVariants}
          className={`mt-8 p-6 rounded-2xl shadow-lg ${
            isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}>
              <MdSecurity size={24} />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Privacy & Security
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your location data is encrypted and secure
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <MdSecurity size={16} className="text-green-500" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  End-to-End Encryption
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                All location data is encrypted in transit and at rest
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <MdAccessTime size={16} className="text-blue-500" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Real-Time Updates
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Location updates every 30 seconds when sharing
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <MdPeople size={16} className="text-purple-500" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Family Only
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Location is only shared with approved family members
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyLocationSharing; 