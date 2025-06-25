import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdHotel,
  MdDirectionsCar,
  MdPerson,
  MdVerified,
  MdClose,
  MdEdit,
  MdDelete,
  MdSearch,
  MdStar,
} from 'react-icons/md';

const ServiceManagement = () => {
  const [serviceType, setServiceType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const services = [
    {
      id: 1,
      name: 'Hotel Taj Palace',
      type: 'hotel',
      provider: 'Taj Group',
      location: 'Mumbai',
      rating: 4.8,
      status: 'pending',
      submittedDate: '2024-03-15',
      price: '₹12,000/night',
    },
    {
      id: 2,
      name: 'City Heritage Tours',
      type: 'guide',
      provider: 'John Wilson',
      location: 'Delhi',
      rating: 4.5,
      status: 'active',
      submittedDate: '2024-03-10',
      price: '₹2,500/tour',
    },
    {
      id: 3,
      name: 'Royal Travels',
      type: 'transport',
      provider: 'Singh Transport Co.',
      location: 'Jaipur',
      rating: 4.2,
      status: 'suspended',
      submittedDate: '2024-03-01',
      price: '₹5,000/day',
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesType = serviceType === 'all' || service.type === serviceType;
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.price.localeCompare(b.price);
      case 'date':
      default:
        return new Date(b.submittedDate) - new Date(a.submittedDate);
    }
  });

  const getServiceIcon = (type) => {
    switch (type) {
      case 'hotel':
        return <MdHotel className="w-6 h-6" />;
      case 'transport':
        return <MdDirectionsCar className="w-6 h-6" />;
      case 'guide':
        return <MdPerson className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (serviceId, newStatus) => {
    // Implement status change logic
    console.log(`Changing status for service ${serviceId} to ${newStatus}`);
  };

  const handleDeleteService = (serviceId) => {
    // Implement service deletion logic
    console.log(`Deleting service ${serviceId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white"
          >
            <option value="all">All Services</option>
            <option value="hotel">Hotels</option>
            <option value="guide">Travel Guides</option>
            <option value="transport">Transport</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white w-full sm:w-64"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedServices.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getServiceIcon(service.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service.provider}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  service.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : service.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {service.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {service.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </span>
                  <div className="flex items-center">
                    <MdStar className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-900 dark:text-white">
                      {service.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {service.price}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {service.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(service.id, 'active')}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 
                        dark:hover:bg-green-800/20 rounded-lg transition-colors"
                    >
                      <MdVerified className="w-5 h-5" />
                    </button>
                  )}
                  {service.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(service.id, 'suspended')}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 
                        dark:hover:bg-red-800/20 rounded-lg transition-colors"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 
                      dark:hover:bg-blue-800/20 rounded-lg transition-colors"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 
                      dark:hover:bg-red-800/20 rounded-lg transition-colors"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Submitted: {service.submittedDate}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManagement; 