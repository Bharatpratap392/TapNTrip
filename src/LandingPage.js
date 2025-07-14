// src/LandingPage.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie, FaUserShield } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [showTiles, setShowTiles] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const timerRef = useRef(null);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      const getDashboardPath = (role) => {
        switch (role) {
          case 'customer':
            return '/customer-dashboard';
          case 'service_provider':
          case 'guide_provider':
          case 'hotel_provider':
          case 'transport_provider':
            return '/service-dashboard';
          case 'admin':
            return '/admin-dashboard';
          default:
            return '/customer-dashboard';
        }
      };
      navigate(getDashboardPath(userRole), { replace: true });
      return;
    }
  }, [user, userRole, navigate]);

  useEffect(() => {
    // Only show splash if sessionStorage flag is not set and user is not authenticated
    const isFirstVisit = !sessionStorage.getItem("tapntrip_visited");
    if (isFirstVisit && !user) {
      setShowSplash(true);
      sessionStorage.setItem("tapntrip_visited", "true"); // Set immediately
      timerRef.current = setTimeout(() => {
        setShowTiles(true);
        setShowSplash(false);
        setTimeout(() => setSplashDone(true), 500); // Wait for fade-out
      }, 2500);
    } else {
      setShowTiles(true);
      setShowSplash(false);
      setSplashDone(true);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [user]);

  const handleRoleClick = (role) => {
    if (role === 'service_provider') {
      navigate('/select-provider-role', { replace: true });
    } else {
      navigate('/register', { state: { role }, replace: true });
    }
  };

  // Splash Screen Component
  const SplashScreen = () => (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-screen bg-gray-900"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm" />
          <div className="relative z-10 text-center w-full max-w-2xl mx-auto">
            <motion.h1 
              className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-tight mt-16 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              TapNTrip
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mx-auto"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-gray-400 text-2xl font-light tracking-wide mt-4"
            >
              Your Journey Starts with a Tap
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Main Content Component
  const MainContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-900"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm" />
      <div className="relative z-10 text-center w-full max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-tight mb-8 mt-8">TapNTrip</h1>
        <div className="grid grid-cols-1 gap-6">
          <motion.button
            onClick={() => handleRoleClick('customer')}
            className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-semibold shadow-lg hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <FaUser className="text-4xl" /> Customer
          </motion.button>
          <motion.button
            onClick={() => handleRoleClick('service_provider')}
            className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-semibold shadow-lg hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <FaUserTie className="text-4xl" /> Service Provider
          </motion.button>
          <motion.button
            onClick={() => handleRoleClick('admin')}
            className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-900 text-white text-2xl font-semibold shadow-lg hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <FaUserShield className="text-4xl" /> Admin
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Only render main content after splash is fully done
  return (
    <>
      {showSplash && <SplashScreen />}
      {!showSplash && splashDone && <MainContent />}
    </>
  );
}

export default LandingPage;
