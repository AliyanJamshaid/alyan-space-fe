import { apiClient, handleApiError } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { TOKEN_STORAGE, createUser, createAuthResponse, AUTH_ERRORS } from '../types/auth';

class AuthService {
  // Login user with email and password
  async login(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: email.trim().toLowerCase(),
        password
      });

      if (response.success && response.data) {
        // Store access token and user data
        apiClient.setAccessToken(response.data.accessToken);
        this.setUser(response.data.user);

        return createAuthResponse({
          success: true,
          message: response.message,
          data: {
            user: createUser(response.data.user),
            accessToken: response.data.accessToken
          }
        });
      }

      throw new Error(response.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);

      return createAuthResponse({
        success: false,
        error: handleApiError(error, {
          unauthorized: AUTH_ERRORS.INVALID_CREDENTIALS,
          rateLimited: 'Too many login attempts. Please try again later.',
          serverError: 'Login service unavailable. Please try again later.'
        })
      });
    }
  }

  // Refresh access token using refresh token (stored in httpOnly cookie)
  async refreshToken() {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);

      if (response.success && response.data) {
        // Update stored access token and user data
        apiClient.setAccessToken(response.data.accessToken);
        this.setUser(response.data.user);

        return createAuthResponse({
          success: true,
          message: response.message,
          data: {
            user: createUser(response.data.user),
            accessToken: response.data.accessToken
          }
        });
      }

      throw new Error(response.error || 'Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);

      // Clear invalid tokens
      this.clearAuth();

      return createAuthResponse({
        success: false,
        error: handleApiError(error, {
          unauthorized: AUTH_ERRORS.SESSION_EXPIRED,
          forbidden: AUTH_ERRORS.SESSION_EXPIRED
        })
      });
    }
  }

  // Logout user
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server request fails
    } finally {
      // Always clear local auth data
      this.clearAuth();
    }

    return createAuthResponse({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // Logout from all devices
  async logoutAll() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
    } catch (error) {
      console.error('Logout all error:', error);
      // Continue with local logout even if server request fails
    } finally {
      // Always clear local auth data
      this.clearAuth();
    }

    return createAuthResponse({
      success: true,
      message: 'Logged out from all devices'
    });
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

      if (response.success && response.data) {
        const user = createUser(response.data.user);
        this.setUser(user);

        return createAuthResponse({
          success: true,
          data: { user }
        });
      }

      throw new Error(response.error || 'Failed to get profile');
    } catch (error) {
      console.error('Get profile error:', error);

      return createAuthResponse({
        success: false,
        error: handleApiError(error, {
          unauthorized: AUTH_ERRORS.SESSION_EXPIRED,
          forbidden: AUTH_ERRORS.UNAUTHORIZED
        })
      });
    }
  }

  // Validate current access token
  async validateToken() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.VALIDATE);

      if (response.success && response.data) {
        return createAuthResponse({
          success: true,
          data: {
            user: createUser(response.data.user),
            valid: response.data.valid
          }
        });
      }

      throw new Error(response.error || 'Token validation failed');
    } catch (error) {
      console.error('Token validation error:', error);

      return createAuthResponse({
        success: false,
        error: handleApiError(error, {
          unauthorized: AUTH_ERRORS.SESSION_EXPIRED
        })
      });
    }
  }

  // Check authentication status
  async checkAuthStatus() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.STATUS);

      if (response.success) {
        return createAuthResponse({
          success: true,
          data: {
            isAuthenticated: response.data.isAuthenticated,
            user: response.data.user ? createUser(response.data.user) : null
          }
        });
      }

      throw new Error(response.error || 'Failed to check auth status');
    } catch (error) {
      console.error('Auth status error:', error);

      return createAuthResponse({
        success: false,
        error: handleApiError(error)
      });
    }
  }

  // Store user data in localStorage
  setUser(user) {
    if (user) {
      localStorage.setItem(TOKEN_STORAGE.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(TOKEN_STORAGE.USER_KEY);
    }
  }

  // Get user data from localStorage
  getUser() {
    try {
      const userData = localStorage.getItem(TOKEN_STORAGE.USER_KEY);
      return userData ? createUser(JSON.parse(userData)) : null;
    } catch (error) {
      console.error('Failed to get user from localStorage:', error);
      return null;
    }
  }

  // Get stored access token
  getAccessToken() {
    return apiClient.getAccessToken();
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated() {
    const token = this.getAccessToken();
    const user = this.getUser();

    return !!(token && user);
  }

  // Clear all authentication data
  clearAuth() {
    apiClient.setAccessToken(null);
    this.setUser(null);
  }

  // Auto-refresh token if expiring soon
  async autoRefreshToken() {
    const token = this.getAccessToken();

    if (!token) return false;

    try {
      // Decode token to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // Refresh if token expires in less than 5 minutes
      if (exp - now < fiveMinutes) {
        const result = await this.refreshToken();
        return result.success;
      }

      return true;
    } catch (error) {
      console.error('Auto refresh error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

export default authService;