import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

export const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    price: '',
    image: '',
    status: 'active'
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        type: vehicle.type || '',
        capacity: vehicle.capacity || '',
        price: vehicle.price || '',
        image: vehicle.image || '',
        status: vehicle.status || 'active'
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl overflow-y-auto max-h-[calc(100vh-16rem)] border border-gray-200 dark:border-gray-700">
      <h3 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-6">Vehicle Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="vehicleName" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Vehicle Name</label>
          <input
            type="text"
            id="vehicleName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Vehicle Type</label>
          <select
            id="vehicleType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          >
            <option value="">Select Type</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
            <option value="Luxury Vehicle">Luxury Vehicle</option>
          </select>
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>
      </div>
      <div className="col-span-full">
        <label htmlFor="vehicleImage" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Vehicle Image</label>
        <input
          type="file"
          id="vehicleImage"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg max-h-40" />
        )}
      </div>
      <div className="col-span-full flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold shadow-sm"
        >
          <FaTimes /> Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-lg"
        >
          <FaSave /> Save Vehicle
        </button>
      </div>
    </form>
  );
};

export const RouteForm = ({ route, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    startLocation: '',
    endLocation: '',
    duration: '',
    price: '',
    schedule: '',
    distance: '',
    estimatedTime: '',
    stops: '',
    description: '',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name || '',
        startLocation: route.startLocation || '',
        endLocation: route.endLocation || '',
        duration: route.duration || '',
        price: route.price || '',
        schedule: route.schedule || '',
        distance: route.distance || '',
        estimatedTime: route.estimatedTime || '',
        stops: Array.isArray(route.stops) ? route.stops.join(', ') : route.stops || '',
        description: route.description || '',
        image: route.image || '',
        status: route.status || 'active'
      });
    }
  }, [route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };

    if (dataToSubmit.stops) {
      dataToSubmit.stops = dataToSubmit.stops.split(',').map(item => item.trim()).filter(item => item !== '');
    } else {
      dataToSubmit.stops = [];
    }

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl overflow-y-auto max-h-[calc(100vh-16rem)] border border-gray-200 dark:border-gray-700">
      <h3 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-6">Route Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="routeName" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Route Name</label>
          <input
            type="text"
            id="routeName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="startLocation" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Start Location</label>
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            value={formData.startLocation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="endLocation" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">End Location</label>
          <input
            type="text"
            id="endLocation"
            name="endLocation"
            value={formData.endLocation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Duration (hours)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>

        <div className="col-span-full">
          <label htmlFor="schedule" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Schedule</label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            placeholder="e.g., Daily, Mon-Fri 9-5"
          />
        </div>

        <div>
          <label htmlFor="distance" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Distance (km/miles)</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
          />
        </div>

        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Estimated Time (e.g., 2h 30m)</label>
          <input
            type="text"
            id="estimatedTime"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            placeholder="e.g., 2h 30m"
          />
        </div>
      </div>

      <div className="col-span-full">
        <label htmlFor="stops" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Stops (comma-separated)</label>
        <textarea
          id="stops"
          name="stops"
          value={formData.stops}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
          rows="2"
          placeholder="e.g., Central Station, Museum, Park"
        />
      </div>

      <div className="col-span-full">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
          rows="3"
          placeholder="e.g., A scenic route covering historical landmarks..."
        />
      </div>

      <div className="col-span-full">
        <label htmlFor="image" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Image URL</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
          placeholder="e.g., https://example.com/route-image.jpg"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        >
          <FaTimes className="inline-block mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
        >
          <FaSave className="inline-block mr-2" />
          Save
        </button>
      </div>
    </form>
  );
}; 