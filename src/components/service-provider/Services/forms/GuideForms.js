import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../../../contexts/AuthContext';

export const TourForm = ({ tour, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    duration: '',
    price: '',
    location: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name || '',
        type: tour.type || '',
        duration: tour.duration || '',
        price: tour.price || '',
        location: tour.location || '',
        image: tour.image || ''
      });
      setImagePreview(tour.image || '');
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert('File too large. Max size is 25MB.');
      return;
    }
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;
    if (imageFile) {
      if (imageFile.size > MAX_FILE_SIZE) {
        alert('File too large. Max size is 25MB.');
        return;
      }
      try {
        const storage = getStorage();
        const imageRef = ref(storage, `service_providers/${user.uid}/guide/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      } catch (err) {
        alert('Upload failed. Please check your internet connection or try a smaller file.');
        return;
      }
    }
    onSubmit({ ...formData, image: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl overflow-y-auto max-h-[calc(100vh-16rem)] border border-gray-200 dark:border-gray-700">
      <h3 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-6">Tour Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="tourName" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Tour Name</label>
          <input
            type="text"
            id="tourName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="tourType" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Tour Type</label>
          <select
            id="tourType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          >
            <option value="">Select Type</option>
            <option value="Walking Tour">Walking Tour</option>
            <option value="Hiking Tour">Hiking Tour</option>
            <option value="Cultural Tour">Cultural Tour</option>
            <option value="Food Tour">Food Tour</option>
            <option value="Adventure Tour">Adventure Tour</option>
          </select>
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
          <label htmlFor="location" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            placeholder="e.g., City Center, Historical District"
            required
          />
        </div>
        <div className="col-span-full">
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Tour Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg max-h-40 object-contain border" />
          )}
        </div>
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

export const ActivityForm = ({ activity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    duration: '',
    price: '',
    location: '',
    requirements: '',
    description: '',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || '',
        type: activity.type || '',
        duration: activity.duration || '',
        price: activity.price || '',
        location: activity.location || '',
        requirements: Array.isArray(activity.requirements) ? activity.requirements.join(', ') : activity.requirements || '',
        description: activity.description || '',
        image: activity.image || '',
        status: activity.status || 'active'
      });
    }
  }, [activity]);

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

    if (dataToSubmit.requirements) {
      dataToSubmit.requirements = dataToSubmit.requirements.split(',').map(item => item.trim()).filter(item => item !== '');
    } else {
      dataToSubmit.requirements = [];
    }

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl overflow-y-auto max-h-[calc(100vh-16rem)] border border-gray-200 dark:border-gray-700">
      <h3 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-6">Activity Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="activityName" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Activity Name</label>
          <input
            type="text"
            id="activityName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="activityType" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Activity Type</label>
          <select
            id="activityType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            required
          >
            <option value="">Select Type</option>
            <option value="Hiking">Hiking</option>
            <option value="Cycling">Cycling</option>
            <option value="Kayaking">Kayaking</option>
            <option value="Cooking Class">Cooking Class</option>
            <option value="Workshop">Workshop</option>
          </select>
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
          <label htmlFor="location" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
            placeholder="e.g., National Park, City Square"
            required
          />
        </div>
      </div>

      <div className="col-span-full">
        <label htmlFor="requirements" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Requirements (comma-separated)</label>
        <textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out text-base"
          rows="2"
          placeholder="e.g., Comfortable shoes, Water bottle, Sunscreen"
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
          placeholder="e.g., A hands-on cooking class to learn traditional local dishes..."
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
          placeholder="e.g., https://example.com/activity-image.jpg"
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