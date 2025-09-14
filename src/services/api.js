import { API_ENDPOINTS, HTTP_STATUS, REQUEST_TIMEOUT, DEFAULT_HEADERS } from '../constants/api';
import { TOKEN_STORAGE } from '../types/auth';

// API client class for making HTTP requests
class ApiClient {
  constructor() {
    this.baseURL = API_ENDPOINTS.AUTH.LOGIN.replace('/auth/login', '');
    this.timeout = REQUEST_TIMEOUT;
    this.defaultHeaders = DEFAULT_HEADERS;
  }

  // Get stored access token
  getAccessToken() {
    return localStorage.getItem(TOKEN_STORAGE.ACCESS_TOKEN_KEY);
  }

  // Set access token in localStorage
  setAccessToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE.ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE.ACCESS_TOKEN_KEY);
    }
  }

  // Create headers with auth token if available
  createHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method with timeout and error handling
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config = {
      method: 'GET',
      headers: this.createHeaders(options.headers),
      credentials: 'include', // Include cookies for refresh tokens
      signal: controller.signal,
      ...options
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || `HTTP ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', HTTP_STATUS.REQUEST_TIMEOUT);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error.message || 'Network error occurred',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET request
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  // POST request
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // PUT request
  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // DELETE request
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  // PATCH request
  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isAuthError() {
    return this.status === HTTP_STATUS.UNAUTHORIZED || this.status === HTTP_STATUS.FORBIDDEN;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isRateLimitError() {
    return this.status === HTTP_STATUS.TOO_MANY_REQUESTS;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Utility function to handle common API errors
export const handleApiError = (error, customMessages = {}) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return customMessages.unauthorized || 'Session expired. Please login again.';
      case HTTP_STATUS.FORBIDDEN:
        return customMessages.forbidden || 'Access denied.';
      case HTTP_STATUS.NOT_FOUND:
        return customMessages.notFound || 'Resource not found.';
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return customMessages.rateLimited || 'Too many requests. Please try again later.';
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return customMessages.serverError || 'Server error. Please try again later.';
      default:
        return error.message || 'An error occurred.';
    }
  }

  return error.message || 'Network error. Please check your connection.';
};

export default apiClient;