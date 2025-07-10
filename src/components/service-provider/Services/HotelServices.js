import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { hotelServicesDB } from '../../../services/database';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from 'react-toastify';
import Modal from '../../common/Modal';
import { RoomForm } from './forms/HotelForms';
import { PackageForm } from './forms/HotelForms';


// HotelServices: Manage rooms for hotel provider (facilities removed)
const HotelServices = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add', 'edit'

  // Fetch rooms from Firestore
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const roomsData = await hotelServicesDB.getRooms();
      setRooms(roomsData);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Status change handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      await hotelServicesDB.updateRoomStatus(id, newStatus);
      setRooms(rooms.map(room => 
        room.id === id ? { ...room, status: newStatus } : room
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to update status');
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await hotelServicesDB.deleteRoom(id);
      setRooms(rooms.filter(room => room.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete item');
    }
  };

  // Edit handler
  const handleEdit = (id) => {
    const item = rooms.find(room => room.id === id);
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  // Add new handler
  const handleAddNew = () => {
    setSelectedItem(null);
    setModalType('add');
    setShowModal(true);
  };

  // Modal submit handler
  const handleModalSubmit = async (formData) => {
    try {
      if (modalType === 'add') {
        const newRoom = await hotelServicesDB.addRoom(formData);
        setRooms([...rooms, newRoom]);
        toast.success('Item added successfully');
      } else {
        const updatedRoom = await hotelServicesDB.updateRoom(selectedItem.id, formData);
        setRooms(rooms.map(room => 
          room.id === selectedItem.id ? updatedRoom : room
        ));
        toast.success('Item updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to save item');
    }
  };

  // Filtered items for search
  const filteredItems = rooms.filter(room => 
    (room.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (room.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (room.description || '').toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Header and Add New */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Hotel Rooms</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
            onClick={handleAddNew}
          >
            <FaPlus /> Add New Room
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Room Card */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{item.name || 'N/A'}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.type || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status || 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                  <p className="font-medium text-gray-900 dark:text-white">{item.capacity || 'N/A'} guests</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">₹{item.price || 'N/A'}</p>
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
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} Room`}
        >
          <RoomForm
            room={selectedItem}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};



export const HotelPackages = ({ providerId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add', 'edit'

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [providerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const packagesData = await hotelServicesDB.getPackages(providerId);
      setPackages(packagesData);
    } catch (error) {
      setError('Failed to load packages');
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await hotelServicesDB.updatePackageStatus(id, newStatus);
      setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, status: newStatus } : pkg));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await hotelServicesDB.deletePackage(id);
      setPackages(packages.filter(pkg => pkg.id !== id));
      toast.success('Package deleted successfully');
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const handleEdit = (id) => {
    const item = packages.find(pkg => pkg.id === id);
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
      if (modalType === 'add') {
        const newPkg = await hotelServicesDB.addPackage(formData);
        setPackages([...packages, newPkg]);
        toast.success('Package added successfully');
      } else {
        const updatedPkg = await hotelServicesDB.updatePackage(selectedItem.id, formData);
        setPackages(packages.map(pkg => pkg.id === selectedItem.id ? updatedPkg : pkg));
        toast.success('Package updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save package');
    }
  };

  const filteredItems = packages.filter(pkg =>
    (pkg.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pkg.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-center max-w-md">
          <p className="font-semibold mb-2">Unable to load packages</p>
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
      {/* Header and Add New */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Packages</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
            onClick={handleAddNew}
          >
            <FaPlus /> Add New Package
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Package Card */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{item.name || 'N/A'}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.duration || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status || 'N/A'}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                <p className="font-medium text-gray-900 dark:text-white">₹{item.price || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Inclusions</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs">{item.inclusions || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Exclusions</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs">{item.exclusions || 'N/A'}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.images && item.images.map((src, idx) => (
                  <img key={idx} src={src} alt="Package" className="rounded-lg max-h-16 object-contain border" />
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  onClick={() => handleEdit(item.id)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash /> Delete
                </button>
                <select
                  value={item.status}
                  onChange={e => handleStatusChange(item.id, e.target.value)}
                  className="ml-auto px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <PackageForm
          pkg={selectedItem}
          onSubmit={handleModalSubmit}
          onCancel={() => setShowModal(false)}
          providerId={providerId}
        />
      </Modal>
    </div>
  );
};

export default HotelServices; 