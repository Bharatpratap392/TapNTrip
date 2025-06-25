import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../services/profileService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const HotelProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HotelProfile: user', user, 'authLoading:', authLoading);
    if (!authLoading) {
      if (user && user.uid) {
        loadProfile();
      } else {
          console.warn('HotelProfile: No user logged in after auth loading.');
          toast.error('No user logged in. Please log in to view your profile.');
          setIsLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      console.log('HotelProfile: Attempting to load profile for userId:', user.uid);
      const profileData = await profileService.getProfile(user.uid, 'hotel');
      // Ensure array fields are arrays, even if they come back as null/undefined from Firestore
      const sanitizedProfileData = {
        ...profileData,
        roomTypes: Array.isArray(profileData.roomTypes) ? profileData.roomTypes : [],
        amenities: Array.isArray(profileData.amenities) ? profileData.amenities : [],
      };
      setProfile(sanitizedProfileData);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, options } = e.target;
    if (e.target.multiple) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setProfile(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await profileService.updateProfile(user.uid, profile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await profileService.deleteProfile(user.uid);
        toast.success('Profile deleted successfully.');
        // Optionally, redirect the user after successful deletion
        navigate('/login'); // or a general dashboard
      } catch (error) {
        toast.error('Failed to delete profile.');
        console.error('Error deleting profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hotel Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hotel Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Hotel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Hotel Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="hotelName"
                    value={profile.hotelName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.hotelName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Star Rating
                </label>
                {isEditing ? (
                  <select
                    name="starRating"
                    value={profile.starRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.starRating} Stars</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Total Rooms
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="totalRooms"
                    value={profile.totalRooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.totalRooms}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  License Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Room Types
                </label>
                {isEditing ? (
                  <select
                    name="roomTypes"
                    value={profile.roomTypes || []}
                    onChange={handleInputChange}
                    multiple
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                    <option value="Standard">Standard</option>
                  </select>
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.roomTypes?.join(', ') || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Amenities
                </label>
                {isEditing ? (
                  <select
                    name="amenities"
                    value={profile.amenities || []}
                    onChange={handleInputChange}
                    multiple
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Pool">Pool</option>
                    <option value="Spa">Spa</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Gym">Gym</option>
                    <option value="Parking">Parking</option>
                    <option value="WiFi">WiFi</option>
                  </select>
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.amenities?.join(', ') || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Owner Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ownerName"
                    value={profile.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.ownerName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Bank Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="bankName"
                    value={profile.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Account Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="accountNumber"
                    value={profile.accountNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  IFSC Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ifscCode"
                    value={profile.ifscCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.ifscCode}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  GST Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gstNumber"
                    value={profile.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">{profile.gstNumber}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-4"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                Delete Profile
              </button>
            </div>
          )}
        </form>
      </div>
  </div>
);
};

export default HotelProfile; 