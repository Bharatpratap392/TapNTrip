import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import PackageCard from './PackageCard';
import { travelPackages } from '../../../utils/sampleData';

const PackagesPage = () => {
  const { isDarkMode } = useTheme();
  const [packages, setPackages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Categories for filtering
  const categories = ['All', 'Beach', 'Honeymoon', 'Heritage', 'Nature', 'Scenic'];

  // Animation variants
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

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPackages(travelPackages);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter packages by category
  const filteredPackages = activeFilter === 'All' 
    ? packages 
    : packages.filter(pkg => pkg.category === activeFilter);

  return (
    <div className="space-y-6">
      <div className={`${
        isDarkMode 
          ? 'bg-[#1a1e2e] border-[#2d3348]' 
          : 'bg-white/70 hover:bg-white border-white/20'
      } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Explore Travel Packages
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Exciting pre-designed travel experiences for every type of traveler.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : isDarkMode
                    ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Packages Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPackages.length > 0 ? (
                filteredPackages.map(packageItem => (
                  <motion.div key={packageItem.id} variants={itemVariants}>
                    <PackageCard packageData={packageItem} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No packages found for this category.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Coming Soon Message */}
            <div className="text-center mt-10">
              <p className={`text-lg font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                More packages coming soon!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PackagesPage; 