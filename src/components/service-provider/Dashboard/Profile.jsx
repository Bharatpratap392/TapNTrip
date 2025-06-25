import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Temporarily remove framer-motion
import { MdEdit, MdSave, MdCloudUpload } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, City, State',
    businessName: 'Doe Enterprises',
    gstNumber: 'GST123456789',
    panNumber: 'ABCDE1234F',
    businessAddress: '456 Business Park, City, State',
    description: 'We provide high-quality services with customer satisfaction as our top priority.',
    profilePicture: 'https://via.placeholder.com/150' // Default placeholder
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the profile
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const inputClasses = `w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const labelClasses = `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-red-200 dark:bg-red-800">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Profile Content Loaded!</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            {isEditing ? (
              <>
                <MdSave className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <MdEdit className="w-5 h-5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <div
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-8"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 dark:border-purple-500 shadow-lg">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-300 dark:text-gray-600" />
              )}
              {isEditing && (
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                >
                  <MdCloudUpload className="w-5 h-5" />
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{profileData.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{profileData.businessName}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.2 }}
              className="space-y-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
                Personal Details
              </h3>
              
              <div>
                <label className={labelClasses}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Business Information */}
            <div
              // initial={{ opacity: 0, x: 20 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.3 }}
              className="space-y-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
                Business Information
              </h3>
              
              <div>
                <label className={labelClasses}>
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={profileData.businessName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={profileData.gstNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  PAN Number
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={profileData.panNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Business Address
                </label>
                <textarea
                  name="businessAddress"
                  value={profileData.businessAddress}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Business Description */}
          <div
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.4 }}
            className="space-y-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
              About Your Business
            </h3>
            <div>
              <label className={labelClasses}>
                Business Description
              </label>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="5"
                className={inputClasses}
              />
            </div>
          </div>

          {isEditing && (
            <div
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ delay: 0.5 }}
              className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                <MdSave className="inline-block mr-2" /> Save All Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 