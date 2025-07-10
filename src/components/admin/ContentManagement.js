import React, { useState } from 'react';

const ContentManagement = () => {
  const [destinations, setDestinations] = useState([]);

  const [settings, setSettings] = useState({
    siteName: '',
    supportEmail: '',
    contactPhone: '',
    defaultLanguage: '',
    availableLanguages: [],
    maintenanceMode: false,
  });

  const [activeTab, setActiveTab] = useState('destinations');
  const [isEditing, setIsEditing] = useState(false);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDestinationStatusChange = (id, newStatus) => {
    setDestinations(destinations.map(dest =>
      dest.id === id ? { ...dest, status: newStatus } : dest
    ));
  };

  const handleFeatureToggle = (id) => {
    setDestinations(destinations.map(dest =>
      dest.id === id ? { ...dest, featured: !dest.featured } : dest
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('destinations')}
          className={`accessible-button tab-transition ${
            activeTab === 'destinations'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Destinations
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`accessible-button tab-transition ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          App Settings
        </button>
      </div>

      {/* Destinations Management */}
      {activeTab === 'destinations' && (
        <div className="modern-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
            <button className="accessible-button bg-indigo-600 text-white hover:bg-indigo-700">
              Add New Destination
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-gray-700">Featured</th>
                  <th className="text-left py-3 px-4 text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center text-gray-400">No destinations available.</td>
                  </tr>
                ) : destinations.map((destination) => (
                  <tr key={destination.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">{destination.name}</td>
                    <td className="py-4 px-4">{destination.description}</td>
                    <td className="py-4 px-4 capitalize">{destination.category}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleFeatureToggle(destination.id)}
                        className={`accessible-button py-1 px-3 ${
                          destination.featured
                            ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {destination.featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            destination.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {destination.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="accessible-button bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1 px-3">
                          Edit
                        </button>
                        {destination.status === 'draft' ? (
                          <button
                            onClick={() => handleDestinationStatusChange(destination.id, 'published')}
                            className="accessible-button bg-green-50 text-green-600 hover:bg-green-100 py-1 px-3"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDestinationStatusChange(destination.id, 'draft')}
                            className="accessible-button bg-yellow-50 text-yellow-600 hover:bg-yellow-100 py-1 px-3"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* App Settings */}
      {activeTab === 'settings' && (
        <div className="modern-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">App Settings</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="accessible-button bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
              {isEditing ? 'Cancel' : 'Edit Settings'}
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Site Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleSettingsChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{settings.siteName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Support Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleSettingsChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{settings.supportEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Contact Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleSettingsChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{settings.contactPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Default Language
                </label>
                {isEditing ? (
                  <select
                    name="defaultLanguage"
                    value={settings.defaultLanguage}
                    onChange={handleSettingsChange}
                    className="modern-input input-focus-effect"
                  >
                    {settings.availableLanguages.map(lang => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg text-gray-900 capitalize">
                    {settings.defaultLanguage}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleSettingsChange}
                disabled={!isEditing}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="maintenanceMode"
                className="text-lg text-gray-700 font-semibold"
              >
                Maintenance Mode
              </label>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="accessible-button bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="accessible-button bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ContentManagement; 