// src/LandingPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/register');
    }, 3500); // 3.5 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* Gradient overlay for washed-out effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm" />
      
      {/* Logo container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: "spring",
            damping: 10,
            stiffness: 100,
            restDelta: 0.001
          }
        }}
        className="relative z-10 text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Text-based logo */}
          <motion.h1 
            className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            TapNTrip
          </motion.h1>
          
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
          />
          
          {/* Tagline with fade effect */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-gray-400 text-2xl font-light tracking-wide"
          >
            Your Journey Starts with a Tap
          </motion.p>

          {/* Loading indicator */}
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
    </div>
  );
}

export default LandingPage;
