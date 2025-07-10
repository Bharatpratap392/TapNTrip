import { db } from '../firebase-config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const profileService = {
  // Get profile data
  async getProfile(userId, providerType) {
    if (!userId) {
      console.error('getProfile: userId is null or undefined.');
      throw new Error('User ID is required to fetch profile.');
    }
    try {
      const profileRef = doc(db, 'service_providers', userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        console.log(`Profile data for ${userId}:`, profileSnap.data());
        return profileSnap.data();
      } else {
        console.warn(`No profile found for ${userId}. Creating default profile.`);
        // Create a default profile if one doesn't exist
        const defaultProfile = getDefaultProfile(providerType);
        await setDoc(profileRef, { ...defaultProfile, providerType, userId });
        return { ...defaultProfile, providerType, userId };
      }
    } catch (error) {
      console.error('Error fetching or creating profile:', error);
      throw error;
    }
  },

  // Update profile data
  async updateProfile(userId, profileData) {
    if (!userId) {
      console.error('updateProfile: userId is null or undefined.');
      throw new Error('User ID is required to update profile.');
    }
    try {
      const profileRef = doc(db, 'service_providers', userId);
      await updateDoc(profileRef, profileData);
      console.log(`Profile for ${userId} updated successfully.`);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Create new profile (this might be called implicitly by getProfile if no profile exists)
  async createProfile(userId, providerType, initialData) {
    if (!userId) {
      console.error('createProfile: userId is null or undefined.');
      throw new Error('User ID is required to create profile.');
    }
    try {
      const profileRef = doc(db, 'service_providers', userId);
      const defaultProfile = getDefaultProfile(providerType);
      // Always set status to 'pending' for new providers
      const profileData = { ...defaultProfile, ...initialData, providerType, userId, status: 'pending' };
      await setDoc(profileRef, profileData);
      console.log(`New profile created for ${userId} with type ${providerType}.`);
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  // Delete profile data
  async deleteProfile(userId) {
    if (!userId) {
      console.error('deleteProfile: userId is null or undefined.');
      throw new Error('User ID is required to delete profile.');
    }
    try {
      const profileRef = doc(db, 'service_providers', userId);
      await deleteDoc(profileRef);
      console.log(`Profile for ${userId} deleted successfully.`);
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
};

// Helper function to get default profile based on provider type
function getDefaultProfile(providerType) {
  switch (providerType) {
    case 'hotel':
      return {
        hotelName: '',
        starRating: '3',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        licenseNumber: '',
        totalRooms: '0',
        roomTypes: [],
        amenities: [],
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        gstNumber: '',
        providerType: 'hotel'
      };
    case 'transport':
      return {
        companyName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        licenseNumber: '',
        vehicleTypes: [],
        totalVehicles: '0',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        gstNumber: '',
        providerType: 'transport'
      };
    case 'guide':
      return {
        guideName: '',
        email: '',
        phone: '',
        address: '',
        licenseNumber: '',
        languages: [],
        specialties: [],
        experience: '0',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        gstNumber: '',
        providerType: 'guide'
      };
    default:
      return {};
  }
} 