import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceProviderProfile = () => {
  const [profile, setProfile] = useState({
    businessName: 'City Tours & Travels',
    serviceType: 'transport',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@citytours.com',
    phone: '+91 9876543210',
    address: '123, MG Road, Bangalore',
    licenseNumber: 'TRA-2024-1234',
    bankName: 'State Bank of India',
    accountNumber: 'XXXX-XXXX-1234',
    ifscCode: 'SBIN0001234',
    gstNumber: '29ABCDE1234F1Z5',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your update logic here
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="modern-card p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="accessible-button bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Business Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Service Type
                </label>
                {isEditing ? (
                  <select
                    name="serviceType"
                    value={profile.serviceType}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  >
                    <option value="guide">Tour Guide</option>
                    <option value="hotel">Hotel</option>
                    <option value="transport">Transport</option>
                  </select>
                ) : (
                  <p className="text-lg text-gray-900 capitalize">{profile.serviceType}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  License Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  GST Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gstNumber"
                    value={profile.gstNumber}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.gstNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Owner Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ownerName"
                    value={profile.ownerName}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.ownerName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Bank Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="bankName"
                    value={profile.bankName}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  Account Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="accountNumber"
                    value={profile.accountNumber}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  IFSC Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ifscCode"
                    value={profile.ifscCode}
                    onChange={handleInputChange}
                    className="modern-input input-focus-effect"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.ifscCode}</p>
                )}
              </div>
            </div>
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
    </div>
  );
};

export default ServiceProviderProfile; 