import React, { useState } from 'react';
import HotelProfile from '../Profile/HotelProfile';
import TransportProfile from '../Profile/TransportProfile';
import GuideProfile from '../Profile/GuideProfile';
import { toast } from 'react-toastify';

const Settings = ({ providerType }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: true,
    emailPromotions: false,
    smsBookings: false,
    appNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    searchability: true,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveChanges = () => {
    // In a real application, you would send these settings to your backend
    console.log('Saving Notification Settings:', notificationSettings);
    console.log('Saving Privacy Settings:', privacySettings);
    toast.success('Settings saved successfully!');
  };

  const renderAccountSettings = () => {
    switch (providerType) {
      case 'hotel':
        return <HotelProfile />;
      case 'transport':
        return <TransportProfile />;
      case 'guide':
        return <GuideProfile />;
      default:
        return <p className="text-gray-600 dark:text-gray-400">Select a provider type to manage profile.</p>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          This is the settings section. Here, you can manage various preferences and configurations for your service provider account.
        </p>

        {/* Account Settings */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
          {renderAccountSettings()}
        </div>

        {/* Notification Preferences */}
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
          <div className="flex items-center justify-between">
            <label htmlFor="emailBookings" className="text-gray-700 dark:text-gray-300 flex-grow">Email Notifications for New Bookings</label>
            <input
              type="checkbox"
              id="emailBookings"
              name="emailBookings"
              checked={notificationSettings.emailBookings}
              onChange={handleNotificationChange}
              className="toggle-switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="emailPromotions" className="text-gray-700 dark:text-gray-300 flex-grow">Email Notifications for Promotions & Updates</label>
            <input
              type="checkbox"
              id="emailPromotions"
              name="emailPromotions"
              checked={notificationSettings.emailPromotions}
              onChange={handleNotificationChange}
              className="toggle-switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="smsBookings" className="text-gray-700 dark:text-gray-300 flex-grow">SMS Notifications for Bookings</label>
            <input
              type="checkbox"
              id="smsBookings"
              name="smsBookings"
              checked={notificationSettings.smsBookings}
              onChange={handleNotificationChange}
              className="toggle-switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="appNotifications" className="text-gray-700 dark:text-gray-300 flex-grow">In-App Notifications</label>
            <input
              type="checkbox"
              id="appNotifications"
              name="appNotifications"
              checked={notificationSettings.appNotifications}
              onChange={handleNotificationChange}
              className="toggle-switch"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h2>
          <div>
            <label htmlFor="profileVisibility" className="text-gray-700 dark:text-gray-300 block mb-2">Profile Visibility:</label>
            <select
              id="profileVisibility"
              name="profileVisibility"
              value={privacySettings.profileVisibility}
              onChange={handlePrivacyChange}
              className="modern-input p-2 rounded-md border dark:bg-gray-700 dark:text-white w-full"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="dataSharing" className="text-gray-700 dark:text-gray-300 flex-grow">Allow Data Sharing with Third Parties</label>
            <input
              type="checkbox"
              id="dataSharing"
              name="dataSharing"
              checked={privacySettings.dataSharing}
              onChange={handlePrivacyChange}
              className="toggle-switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="searchability" className="text-gray-700 dark:text-gray-300 flex-grow">Allow Profile to be Searchable</label>
            <input
              type="checkbox"
              id="searchability"
              name="searchability"
              checked={privacySettings.searchability}
              onChange={handlePrivacyChange}
              className="toggle-switch"
            />
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 