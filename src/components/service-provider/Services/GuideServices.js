import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaTrash, FaPlus, FaMapMarkedAlt, FaLanguage, FaStar, FaSearch } from 'react-icons/fa';
import { guideServicesDB } from '../../../services/database';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from 'react-toastify';
import Modal from '../../common/Modal';
import { TourForm } from './forms/GuideForms';
import { useAuth } from '../../../contexts/AuthContext';

// --- GuideServices: Manage and display guide's tours ---
const GuideServices = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tours');
  const [searchQuery, setSearchQuery] = useState('');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add', 'edit'

  // --- Fetch Tours ---
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

  // --- Status Update Handler ---
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

  // --- Delete Tour ---
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

  // --- Edit Tour ---
  const handleEdit = (id) => {
    const tour = tours.find(tour => tour.id === id);
    setSelectedTour(tour);
    setModalType('edit');
    setShowModal(true);
  };

  // --- Add New Tour ---
  const handleAddNew = () => {
    setSelectedTour(null);
    setModalType('add');
    setShowModal(true);
  };

  // --- Modal Submit Handler ---
  const handleModalSubmit = async (formData) => {
    try {
      if (modalType === 'add') {
        const newTour = await guideServicesDB.addTour({ ...formData, guideId: user.uid });
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

  // --- Filtered Tours ---
  const filteredTours = tours.filter(tour => 
    (tour.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tour.type || '').toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Header with Search and Add Button */}
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

      {/* Search Bar */}
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

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">No tours found.</div>
        ) : filteredTours.map((tour) => (
          <motion.div
            key={tour.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              {tour.image ? (
                <img
                  src={tour.image}
                  alt={tour.name || 'Tour'}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="text-gray-400 text-6xl">🗺️</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{tour.name || 'N/A'}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tour.type || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tour.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tour.status || 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tour.duration || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">₹{tour.price || 'N/A'}/person</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(tour.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Add/Edit Tour */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} Tour`}
        >
          <TourForm
            tour={selectedTour}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default GuideServices; 