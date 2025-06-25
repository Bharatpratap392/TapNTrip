import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaEdit, FaTrash, FaPlus, FaTaxi, FaBus, FaPlane, FaShip, FaSearch } from 'react-icons/fa';
import { transportServicesDB } from '../../../services/database';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from 'react-toastify';
import Modal from '../../common/Modal';
import { VehicleForm, RouteForm } from './forms/TransportForms';

const TransportServices = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
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
      const [vehiclesData, routesData] = await Promise.all([
        transportServicesDB.getVehicles(),
        transportServicesDB.getRoutes()
      ]);
      setVehicles(vehiclesData);
      setRoutes(routesData);
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
      if (activeTab === 'vehicles') {
        await transportServicesDB.updateVehicleStatus(id, newStatus);
        setVehicles(vehicles.map(vehicle => 
          vehicle.id === id ? { ...vehicle, status: newStatus } : vehicle
        ));
      } else {
        await transportServicesDB.updateRouteStatus(id, newStatus);
        setRoutes(routes.map(route => 
          route.id === id ? { ...route, status: newStatus } : route
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
      if (activeTab === 'vehicles') {
        await transportServicesDB.deleteVehicle(id);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      } else {
        await transportServicesDB.deleteRoute(id);
        setRoutes(routes.filter(route => route.id !== id));
      }
      toast.success('Item deleted successfully');
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (id) => {
    const item = activeTab === 'vehicles' 
      ? vehicles.find(vehicle => vehicle.id === id)
      : routes.find(route => route.id === id);
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
        if (activeTab === 'vehicles') {
          const newVehicle = await transportServicesDB.addVehicle(formData);
          setVehicles([...vehicles, newVehicle]);
        } else {
          const newRoute = await transportServicesDB.addRoute(formData);
          setRoutes([...routes, newRoute]);
        }
        toast.success('Item added successfully');
      } else {
        if (activeTab === 'vehicles') {
          const updatedVehicle = await transportServicesDB.updateVehicle(selectedItem.id, formData);
          setVehicles(vehicles.map(vehicle => 
            vehicle.id === selectedItem.id ? updatedVehicle : vehicle
          ));
        } else {
          const updatedRoute = await transportServicesDB.updateRoute(selectedItem.id, formData);
          setRoutes(routes.map(route => 
            route.id === selectedItem.id ? updatedRoute : route
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

  const filteredItems = activeTab === 'vehicles'
    ? vehicles.filter(vehicle => 
        vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : routes.filter(route =>
        route.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.to?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <FaPlus /> Add New {activeTab === 'vehicles' ? 'Vehicle' : 'Route'}
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
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'routes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('routes')}
          >
            Routes
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
                src={item.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
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
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>

              {activeTab === 'vehicles' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.capacity} seats</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">₹{item.price}/day</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(item.features) && item.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.to}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Schedule</p>
                    <p className="font-medium text-gray-900 dark:text-white">{item.schedule}</p>
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
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} ${activeTab === 'vehicles' ? 'Vehicle' : 'Route'}`}
        >
          {activeTab === 'vehicles' ? (
            <VehicleForm
              initialData={selectedItem}
              onSubmit={handleModalSubmit}
              onCancel={() => setShowModal(false)}
            />
          ) : (
            <RouteForm
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

export default TransportServices; 