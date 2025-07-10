import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import './App.css';

const ServiceAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
    serviceType: 'guide',
    companyName: '',
    licenseNumber: '',
    hotelRegistrationId: '',
    vehicleFleetSize: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isOnline) {
      setError('You are currently offline. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const userId = userCredential.user.uid;
        
        try {
          // Get user role from Firestore
          const userDocRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            
            // Check if the selected role matches the stored role
            if (userData.role !== formData.role) {
              throw new Error(`Invalid role selected. You are registered as a ${userData.role}.`);
            }

            setSuccess('Login successful! Redirecting...');
            
            // Navigate based on user role after a short delay
            setTimeout(() => {
              switch (userData.role) {
                case 'customer':
                  navigate('/customer-dashboard');
                  break;
                case 'service_provider':
                  navigate('/service-dashboard');
                  break;
                case 'admin':
                  navigate('/admin-dashboard');
                  break;
                default:
                  throw new Error('Invalid role');
              }
            }, 1000);
          } else {
            throw new Error('User data not found. Please try registering again.');
          }
        } catch (firestoreError) {
          console.error('Firestore Error:', firestoreError);
          if (firestoreError.message.includes('Invalid role')) {
            setError(firestoreError.message);
          } else if (firestoreError.code === 'unavailable') {
            setError('Unable to connect to the server. Please check your internet connection.');
          } else {
            setError('Error accessing user data. Please try again later.');
          }
          // Sign out the user if there was an error
          await auth.signOut();
        }
      } else {
        // Registration
        console.log('Starting registration process...');
        
        if (!formData.email || !formData.password || !formData.role) {
          throw new Error('Please fill in all required fields');
        }

        if (formData.role === 'service_provider') {
          if (!formData.companyName) {
            throw new Error('Company name is required for service providers');
          }

          if (formData.serviceType === 'guide' || formData.serviceType === 'transport') {
            if (!formData.licenseNumber) {
              throw new Error('License number is required for Guides and Transport providers');
            }
          }

          if (formData.serviceType === 'hotel' && !formData.hotelRegistrationId) {
            throw new Error('Hotel registration ID is required for Hotel providers');
          }
        }

        try {
          // Create user in Firebase Auth
          console.log('Creating user in Firebase Auth...');
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const userId = userCredential.user.uid;
          console.log('User created successfully:', userId);

          // Prepare user data
          const userData = {
            email: formData.email,
            role: formData.role,
            createdAt: new Date().toISOString(),
            ...(formData.role === 'service_provider' && {
              serviceType: formData.serviceType,
              companyName: formData.companyName,
              licenseNumber: formData.licenseNumber,
              hotelRegistrationId: formData.hotelRegistrationId,
              vehicleFleetSize: formData.vehicleFleetSize,
            }),
          };

          console.log('Attempting to save user data to Firestore...', userData);

          // Create users collection if it doesn't exist
          const usersRef = collection(db, 'users');
          const userDocRef = doc(usersRef, userId);

          // Store user data in Firestore
          await setDoc(userDocRef, userData);
          console.log('User data saved successfully');

          setSuccess('Registration successful! You can now login.');
          
          // Clear form and switch to login after delay
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              password: '',
              companyName: '',
              licenseNumber: '',
              hotelRegistrationId: '',
              vehicleFleetSize: '',
            }));
          }, 1500);

        } catch (firestoreError) {
          console.error('Detailed Firestore Error:', {
            code: firestoreError.code,
            message: firestoreError.message,
            details: firestoreError
          });

          // If we created the auth user but failed to save data, clean up
          if (auth.currentUser) {
            console.log('Cleaning up auth user due to Firestore error...');
            await auth.currentUser.delete();
          }

          if (firestoreError.code === 'permission-denied') {
            throw new Error('Permission denied. Please check Firestore rules.');
          } else if (firestoreError.code === 'unavailable') {
            throw new Error('Service temporarily unavailable. Please try again later.');
          } else {
            throw new Error(`Failed to save user data: ${firestoreError.message}`);
          }
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      let errorMessage = 'An unexpected error occurred.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Try logging in or use a different email.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceSpecificFields = () => {
    if (isLogin) return null;

    return (
      <div className="space-y-4 page-transition">
        <div className="form-group">
          <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="companyName">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="modern-input input-focus-effect"
            required
            aria-label="Company Name"
          />
        </div>

        {(formData.serviceType === 'guide' || formData.serviceType === 'transport') && (
          <div className="form-group page-transition">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="licenseNumber">
              License Number
            </label>
            <input
              id="licenseNumber"
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className="modern-input input-focus-effect"
              required
              aria-label="License Number"
            />
          </div>
        )}

        {formData.serviceType === 'hotel' && (
          <div className="form-group page-transition">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="hotelRegistrationId">
              Hotel Registration ID
            </label>
            <input
              id="hotelRegistrationId"
              type="text"
              name="hotelRegistrationId"
              value={formData.hotelRegistrationId}
              onChange={handleInputChange}
              className="modern-input input-focus-effect"
              required
              aria-label="Hotel Registration ID"
            />
          </div>
        )}

        {formData.serviceType === 'transport' && (
          <div className="form-group page-transition">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="vehicleFleetSize">
              Vehicle Fleet Size
            </label>
            <input
              id="vehicleFleetSize"
              type="number"
              name="vehicleFleetSize"
              value={formData.vehicleFleetSize}
              onChange={handleInputChange}
              className="modern-input input-focus-effect"
              required
              min="1"
              aria-label="Vehicle Fleet Size"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 page-transition">
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          You are currently offline. Please check your internet connection.
        </div>
      )}
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 page-transition">
          {isLogin ? 'Welcome Back!' : 'Create Your Account'}
        </h2>
        <p className="mt-2 text-center text-xl text-gray-600">
          {isLogin ? 'Sign in to access your account' : 'Join our community'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="modern-card bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 page-transition" role="alert">
              <p className="text-red-700 text-lg">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 page-transition" role="alert">
              <p className="text-green-700 text-lg">{success}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="role">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="modern-input input-focus-effect"
                aria-label="Select Role"
              >
                <option value="customer">Customer</option>
                <option value="service_provider">Service Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === 'service_provider' && !isLogin && (
              <div className="form-group page-transition">
                <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="serviceType">
                  Service Type
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="modern-input input-focus-effect"
                  aria-label="Select Service Type"
                >
                  <option value="guide">Tour Guide</option>
                  <option value="hotel">Hotel</option>
                  <option value="transport">Transport</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="modern-input input-focus-effect"
                required
                placeholder="example.user@email.com"
                aria-label="Email Address"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="modern-input input-focus-effect"
                required
                aria-label="Password"
              />
            </div>

            {formData.role === 'service_provider' && !isLogin && renderServiceSpecificFields()}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`accessible-button w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 button-press ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={isLogin ? 'Sign in' : 'Register'}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="w-full text-center text-lg text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors duration-200"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAuth; 