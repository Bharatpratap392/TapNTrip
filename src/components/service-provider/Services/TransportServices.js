import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaEdit, FaTrash, FaPlus, FaTaxi, FaBus, FaPlane, FaShip, FaSearch } from 'react-icons/fa';
import { transportServicesDB } from '../../../services/database';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from 'react-toastify';
import Modal from '../../common/Modal';
import { VehicleForm } from './forms/TransportForms';
import { useAuth } from '../../../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TransportServices = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add', 'edit'
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const vehiclesData = await transportServicesDB.getVehicles(user?.uid);
      setVehicles(vehiclesData);
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
      await transportServicesDB.updateVehicleStatus(id, newStatus);
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === id ? { ...vehicle, status: newStatus } : vehicle
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await transportServicesDB.deleteVehicle(id);
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (id) => {
    const item = vehicles.find(vehicle => vehicle.id === id);
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      let imageUrl = '';
      if (formData.image && formData.image instanceof File) {
        const storage = getStorage();
        const imageRef = ref(storage, `vehicle_images/${user.uid}_${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }
      const vehicleData = { ...formData, image: imageUrl, providerId: user.uid };
      if (modalType === 'add') {
        await transportServicesDB.addVehicle(vehicleData);
        const vehiclesData = await transportServicesDB.getVehicles(user?.uid);
        setVehicles(vehiclesData);
        toast.success('Item added successfully');
      } else {
        const updatedVehicle = await transportServicesDB.updateVehicle(selectedItem.id, vehicleData);
        setVehicles(vehicles.map(vehicle =>
          vehicle.id === selectedItem.id ? updatedVehicle : vehicle
        ));
        toast.success('Item updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to save item');
    }
  };

  const filteredItems = vehicles.filter(vehicle => 
    vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Transport Services</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
            onClick={handleAddNew}
          >
            <FaPlus /> Add New Vehicle
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <img
                src={item.image || 'https://via.placeholder.com/120x80?text=No+Image'}
                alt={item.name}
                className="w-32 h-20 object-cover rounded-lg mb-2"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                  <p className="font-medium text-gray-900 dark:text-white">{item.capacity} seats</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">₹{item.price}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} Vehicle`}
        >
          <VehicleForm
            initialData={selectedItem}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransportServices; 