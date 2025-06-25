import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaEdit, FaTrash, FaPlus, FaWifi, FaParking, FaSwimmingPool, FaSpa, FaUtensils, FaSearch } from 'react-icons/fa';
import { hotelServicesDB } from '../../../services/database';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from 'react-toastify';
import Modal from '../../common/Modal';
import { RoomForm, FacilityForm } from './forms/HotelForms';

const HotelServices = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add', 'edit'

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [roomsData, facilitiesData] = await Promise.all([
        hotelServicesDB.getRooms(),
        hotelServicesDB.getFacilities()
      ]);
      setRooms(roomsData);
      setFacilities(facilitiesData);
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
      if (activeTab === 'rooms') {
        await hotelServicesDB.updateRoomStatus(id, newStatus);
        setRooms(rooms.map(room => 
          room.id === id ? { ...room, status: newStatus } : room
        ));
      } else {
        await hotelServicesDB.updateFacilityStatus(id, newStatus);
        setFacilities(facilities.map(facility => 
          facility.id === id ? { ...facility, status: newStatus } : facility
        ));
      }
      toast.success('Status updated successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === 'rooms') {
        await hotelServicesDB.deleteRoom(id);
        setRooms(rooms.filter(room => room.id !== id));
      } else {
        await hotelServicesDB.deleteFacility(id);
        setFacilities(facilities.filter(facility => facility.id !== id));
      }
      toast.success('Item deleted successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (id) => {
    const item = activeTab === 'rooms' 
      ? rooms.find(room => room.id === id)
      : facilities.find(facility => facility.id === id);
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
        if (activeTab === 'rooms') {
          const newRoom = await hotelServicesDB.addRoom(formData);
          setRooms([...rooms, newRoom]);
        } else {
          const newFacility = await hotelServicesDB.addFacility(formData);
          setFacilities([...facilities, newFacility]);
        }
        toast.success('Item added successfully');
      } else {
        if (activeTab === 'rooms') {
          const updatedRoom = await hotelServicesDB.updateRoom(selectedItem.id, formData);
          setRooms(rooms.map(room => 
            room.id === selectedItem.id ? updatedRoom : room
          ));
        } else {
          const updatedFacility = await hotelServicesDB.updateFacility(selectedItem.id, formData);
          setFacilities(facilities.map(facility => 
            facility.id === selectedItem.id ? updatedFacility : facility
          ));
        }
        toast.success('Item updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to save item');
    }
  };

  const filteredItems = activeTab === 'rooms'
    ? rooms.filter(room => 
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : facilities.filter(facility =>
        facility.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Hotel Services</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
            onClick={handleAddNew}
          >
            <FaPlus /> Add New {activeTab === 'rooms' ? 'Room' : 'Facility'}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'rooms'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('rooms')}
          >
            Rooms
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'facilities'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('facilities')}
          >
            Facilities
          </button>
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
            <div className="h-48 overflow-hidden">
              <img
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>

              {activeTab === 'rooms' ? (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">₹{item.price}/night</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.capacity} people</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Beds</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.beds}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.size} sqft</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cost</p>
                      <p className="font-medium text-gray-900 dark:text-white">₹{item.cost}/use</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Availability</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.availability}</p>
                    </div>
                  </div>
                </>
              )}

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
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} ${activeTab === 'rooms' ? 'Room' : 'Facility'}`}
        >
          {activeTab === 'rooms' ? (
            <RoomForm
              initialData={selectedItem}
              onSubmit={handleModalSubmit}
              onCancel={() => setShowModal(false)}
            />
          ) : (
            <FacilityForm
              initialData={selectedItem}
              onSubmit={handleModalSubmit}
              onCancel={() => setShowModal(false)}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default HotelServices; 