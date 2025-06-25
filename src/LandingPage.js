// src/LandingPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect to appropriate dashboard if user is already authenticated
  React.useEffect(() => {
    if (user && userRole) {
      const routes = {
        customer: '/customer-dashboard',
        service_provider: '/service-dashboard',
        admin: '/admin-dashboard'
      };
      navigate(routes[userRole] || '/login');
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-10" />
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Logo and main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              TapNTrip
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Your Journey Starts with a Tap
          </motion.p>

          {/* Loading animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-2 mt-8"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                backgroundColor: ["#60A5FA", "#8B5CF6", "#EC4899"]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0
              }}
              className="w-3 h-3 rounded-full bg-blue-400"
            />
            <motion.div
              animate={{
                y: [0, -8, 0],
                backgroundColor: ["#8B5CF6", "#EC4899", "#60A5FA"]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.2
              }}
              className="w-3 h-3 rounded-full bg-purple-500"
            />
            <motion.div
              animate={{
                y: [0, -8, 0],
                backgroundColor: ["#EC4899", "#60A5FA", "#8B5CF6"]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.4
              }}
              className="w-3 h-3 rounded-full bg-pink-500"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;
