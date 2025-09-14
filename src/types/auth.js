// Auth-related type definitions and constants

export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

export const USER_ROLES = {
  ADMIN: 'admin'
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  UNAUTHORIZED: 'Access denied. Admin privileges required.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

export const TOKEN_STORAGE = {
  ACCESS_TOKEN_KEY: 'accessToken',
  USER_KEY: 'user'
};

// User interface
export const createUser = (userData) => ({
  _id: userData._id || null,
  email: userData.email || '',
  role: userData.role || USER_ROLES.ADMIN,
  isActive: userData.isActive || true,
  lastLoginAt: userData.lastLoginAt || null,
  createdAt: userData.createdAt || null,
  updatedAt: userData.updatedAt || null
});

// Auth response interface
export const createAuthResponse = (response) => ({
  success: response.success || false,
  message: response.message || '',
  data: response.data || null,
  error: response.error || null
});

// Login request interface
export const createLoginRequest = (email, password) => ({
  email: email?.trim().toLowerCase() || '',
  password: password || ''
});

// Auth state interface
export const createAuthState = () => ({
  user: null,
  status: AUTH_STATUS.IDLE,
  error: null,
  isAuthenticated: false,
  isLoading: false
});

// Token info interface
export const createTokenInfo = (token) => {
  if (!token) return null;

  try {
    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      userId: payload.userId || null,
      email: payload.email || '',
      role: payload.role || USER_ROLES.ADMIN,
      exp: payload.exp ? new Date(payload.exp * 1000) : null,
      iat: payload.iat ? new Date(payload.iat * 1000) : null,
      isExpired: payload.exp ? Date.now() >= payload.exp * 1000 : true
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export default {
  AUTH_STATUS,
  USER_ROLES,
  AUTH_ERRORS,
  TOKEN_STORAGE,
  createUser,
  createAuthResponse,
  createLoginRequest,
  createAuthState,
  createTokenInfo
};