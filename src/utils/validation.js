// Validation utility for form inputs and data sanitization

// Email validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Password validation (min 8 chars, at least one number, one letter and one special character)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Phone number validation (international format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// URL validation
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validators = {
  // Email validation
  isValidEmail: (email) => {
    return email && emailRegex.test(email.trim());
  },

  // Password validation
  isValidPassword: (password) => {
    return password && passwordRegex.test(password);
  },

  // Phone validation
  isValidPhone: (phone) => {
    return phone && phoneRegex.test(phone.trim());
  },

  // URL validation
  isValidUrl: (url) => {
    return url && urlRegex.test(url.trim());
  },

  // Required field validation
  isRequired: (value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'number') return true;
    return value && value.trim().length > 0;
  },

  // Length validation
  isLength: (value, min, max) => {
    if (!value) return false;
    const length = value.trim().length;
    if (min && length < min) return false;
    if (max && length > max) return false;
    return true;
  },

  // Number range validation
  isInRange: (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min && num < min) return false;
    if (max && num > max) return false;
    return true;
  }
};

export const sanitizers = {
  // Sanitize string input
  sanitizeString: (value) => {
    if (!value) return '';
    return value
      .trim()
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Sanitize email
  sanitizeEmail: (email) => {
    if (!email) return '';
    return email.trim().toLowerCase();
  },

  // Sanitize phone number
  sanitizePhone: (phone) => {
    if (!phone) return '';
    return phone.trim().replace(/[^\d+]/g, '');
  },

  // Sanitize number
  sanitizeNumber: (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  },

  // Sanitize boolean
  sanitizeBoolean: (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      value = value.toLowerCase().trim();
      return value === 'true' || value === '1' || value === 'yes';
    }
    return Boolean(value);
  }
};

export const formValidation = {
  // Validate form data
  validateForm: (data, rules) => {
    const errors = {};
    
    for (const field in rules) {
      const value = data[field];
      const fieldRules = rules[field];

      if (fieldRules.required && !validators.isRequired(value)) {
        errors[field] = 'This field is required';
        continue;
      }

      if (value) {
        if (fieldRules.email && !validators.isValidEmail(value)) {
          errors[field] = 'Invalid email address';
        }
        if (fieldRules.password && !validators.isValidPassword(value)) {
          errors[field] = 'Password must be at least 8 characters long and contain at least one number, one letter and one special character';
        }
        if (fieldRules.phone && !validators.isValidPhone(value)) {
          errors[field] = 'Invalid phone number';
        }
        if (fieldRules.url && !validators.isValidUrl(value)) {
          errors[field] = 'Invalid URL';
        }
        if (fieldRules.minLength && !validators.isLength(value, fieldRules.minLength)) {
          errors[field] = `Must be at least ${fieldRules.minLength} characters`;
        }
        if (fieldRules.maxLength && !validators.isLength(value, 0, fieldRules.maxLength)) {
          errors[field] = `Must be no more than ${fieldRules.maxLength} characters`;
        }
        if (fieldRules.min && !validators.isInRange(value, fieldRules.min)) {
          errors[field] = `Must be at least ${fieldRules.min}`;
        }
        if (fieldRules.max && !validators.isInRange(value, undefined, fieldRules.max)) {
          errors[field] = `Must be no more than ${fieldRules.max}`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Sanitize form data
  sanitizeForm: (data) => {
    const sanitized = {};
    
    for (const field in data) {
      const value = data[field];
      
      if (typeof value === 'string') {
        sanitized[field] = sanitizers.sanitizeString(value);
      } else if (typeof value === 'number') {
        sanitized[field] = sanitizers.sanitizeNumber(value);
      } else if (typeof value === 'boolean') {
        sanitized[field] = sanitizers.sanitizeBoolean(value);
      } else {
        sanitized[field] = value; // Keep as is for other types
      }
    }

    return sanitized;
  }
};

export default {
  validators,
  sanitizers,
  formValidation
}; 