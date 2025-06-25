// Token management service for secure handling of authentication tokens
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

const tokenService = {
  // Get token with expiry check
  getToken: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= parseInt(expiry, 10)) {
      tokenService.clearTokens();
      return null;
    }

    return token;
  },

  // Set token with expiry
  setToken: (token, expiresIn = 3600) => {
    if (!token) return;
    
    const expiry = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  },

  // Get refresh token
  getRefreshToken: () => {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Set refresh token
  setRefreshToken: (refreshToken) => {
    if (!refreshToken) return;
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Clear all tokens
  clearTokens: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!tokenService.getToken();
  },

  // Update token with new expiry
  updateToken: (newToken, expiresIn = 3600) => {
    tokenService.setToken(newToken, expiresIn);
  },

  // Parse JWT token
  parseToken: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Get token expiry status
  getTokenExpiryStatus: () => {
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return 'expired';

    const timeToExpiry = parseInt(expiry, 10) - Date.now();
    if (timeToExpiry <= 0) return 'expired';
    if (timeToExpiry <= 300000) return 'expiring_soon'; // 5 minutes
    return 'valid';
  }
};

export default tokenService; 