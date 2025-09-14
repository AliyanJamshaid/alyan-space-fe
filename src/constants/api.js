// API configuration and constants

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    LOGOUT_ALL: `${API_BASE_URL}/auth/logout-all`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    VALIDATE: `${API_BASE_URL}/auth/validate`,
    STATUS: `${API_BASE_URL}/auth/status`
  },

  // General endpoints
  HEALTH: `${API_BASE_URL}/health`
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Request timeout
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Cookie names
export const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken'
};

export default {
  API_ENDPOINTS,
  HTTP_STATUS,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
  COOKIE_NAMES,
  API_BASE_URL
};