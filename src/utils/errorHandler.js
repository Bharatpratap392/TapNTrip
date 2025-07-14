/**
 * Handles API errors and returns a user-friendly error message
 * @param {Error} error - The error object from the API call
 * @returns {string} A user-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Handle network errors
  if (!error.response) {
    if (error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return 'Network error. Please check your internet connection.';
  }

  // Handle server errors
  if (error.response.status >= 500) {
    return 'Server error. Please try again later.';
  }

  // Handle authentication errors
  if (error.response.status === 401) {
    return 'Please log in to continue.';
  }

  // Handle not found errors
  if (error.response.status === 404) {
    return 'The requested resource was not found.';
  }

  // Handle validation errors
  if (error.response.status === 422) {
    const errors = error.response.data.errors;
    if (errors && Object.keys(errors).length > 0) {
      return Object.values(errors)[0][0];
    }
  }

  // Return the error message from the server or a default message
  return error.response?.data?.message || error.message || 'An error occurred';
}; 

// Validation utility for Indian standards

export function validateName(value) {
  if (!value) return 'Name is required.';
  if (!/^[A-Za-z\s]{2,50}$/.test(value)) return 'Only alphabets and spaces (2-50 chars) allowed.';
  return '';
}

export function validatePhone(value) {
  if (!value) return 'Phone number is required.';
  if (!/^[6-9]\d{9,14}$/.test(value)) return 'Enter a valid Indian phone number (10-15 digits, starts with 6-9).';
  return '';
}

export function validateEmail(value) {
  if (!value) return 'Email is required.';
  // Use HTML5 email validation or fallback regex
  if (!/^\S+@\S+\.\S+$/.test(value)) return 'Enter a valid email address.';
  return '';
} 