import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaTrash, FaPlus, FaMapMarkedAlt, FaLanguage, FaStar, FaSearch } from 'react-icons/fa';
import { guideServicesDB } from '../../../services/database';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from 'react-toastify';
import Modal from '../../common/Modal';
import { TourForm } from './forms/GuideForms';

const GuideServices = () => {
  const [activeTab, setActiveTab] = useState('tours');
  const [searchQuery, setSearchQuery] = useState('');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add', 'edit'

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const toursData = await guideServicesDB.getTours();
      setTours(toursData);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await guideServicesDB.updateTourStatus(id, newStatus);
      setTours(tours.map(tour => 
        tour.id === id ? { ...tour, status: newStatus } : tour
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await guideServicesDB.deleteTour(id);
      setTours(tours.filter(tour => tour.id !== id));
      toast.success('Tour deleted successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete tour');
    }
  };

  const handleEdit = (id) => {
    const tour = tours.find(tour => tour.id === id);
    setSelectedTour(tour);
    setModalType('edit');
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedTour(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalType === 'add') {
        const newTour = await guideServicesDB.addTour(formData);
        setTours([...tours, newTour]);
        toast.success('Tour added successfully');
      } else {
        const updatedTour = await guideServicesDB.updateTour(selectedTour.id, formData);
        setTours(tours.map(tour => 
          tour.id === selectedTour.id ? updatedTour : tour
        ));
        toast.success('Tour updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to save tour');
    }
  };

  const filteredTours = tours.filter(tour => 
    tour.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tour.specialties && tour.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )) ||
    (tour.languages && tour.languages.some(language => 
      language.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-center max-w-md">
          <p className="font-semibold mb-2">Unable to load data</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Guide Services</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
            onClick={handleAddNew}
          >
            <FaPlus /> Add New Tour
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.map((tour) => (
          <motion.div
            key={tour.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{tour.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tour.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tour.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tour.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tour.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">₹{tour.price}/person</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Group Size</p>
                  <p className="font-medium text-gray-900 dark:text-white">Max {tour.maxGroupSize} people</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Point</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tour.meetingPoint}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {tour.languages?.map((language, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-md text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {tour.specialties?.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-md text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(tour.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} Tour`}
        >
          <TourForm
            initialData={selectedTour}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default GuideServices; 