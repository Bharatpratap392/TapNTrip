import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import ActivityCard from './ActivityCard';
// import { tourActivities } from '../../../utils/sampleData';

const ActivitiesPage = () => {
  const { isDarkMode } = useTheme();
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false); // No loading since no data

  // Activity types for filtering
  const activityTypes = ['All', 'Adventure', 'Cultural', 'Spiritual', 'Leisure'];

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

  // No useEffect needed since no dummy data

  // Filter activities by type
  const filteredActivities = activeFilter === 'All' 
    ? activities 
    : activities.filter(activity => activity.type === activeFilter);

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
            Local Experiences & Activities
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover things to do at your destination.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {activityTypes.map(type => (
            <motion.button
              key={type}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === type
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : isDarkMode
                    ? 'bg-[#2d3348] text-gray-300 hover:bg-[#3d4358]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>

        {/* Search and Sort (non-functional but visually present) */}
        <div className="flex flex-wrap gap-4 justify-between mb-8">
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search activities..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-[#2d3348] border-[#3d4358] text-white placeholder-gray-400' 
                  : 'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
          
          <select 
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-[#2d3348] border-[#3d4358] text-white' 
                : 'bg-gray-100 border-gray-200 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="popular">Sort by: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Activities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <motion.div key={activity.id} variants={itemVariants}>
                <ActivityCard activityData={activity} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No activities found for this category.
              </p>
            </div>
          )}
        </motion.div>

        {/* Coming Soon Message */}
        <div className="text-center mt-10">
          <p className={`text-lg font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            We're working on adding more adventures soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage; 