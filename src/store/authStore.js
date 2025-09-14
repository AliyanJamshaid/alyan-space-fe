import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { AUTH_STATUS, AUTH_ERRORS, createAuthState } from '../types/auth';
import toast from 'react-hot-toast';

const useAuthStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...createAuthState(),

        // Actions
        actions: {
          // Login action
          login: async (email, password) => {
            set((state) => ({
              ...state,
              status: AUTH_STATUS.LOADING,
              isLoading: true,
              error: null
            }));

            try {
              const result = await authService.login(email, password);

              if (result.success) {
                set((state) => ({
                  ...state,
                  user: result.data.user,
                  status: AUTH_STATUS.AUTHENTICATED,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null
                }));

                toast.success(result.message || 'Welcome back! 🎉');
                return { success: true, user: result.data.user };
              } else {
                set((state) => ({
                  ...state,
                  status: AUTH_STATUS.ERROR,
                  isLoading: false,
                  error: result.error
                }));

                toast.error(result.error || AUTH_ERRORS.UNKNOWN_ERROR);
                return { success: false, error: result.error };
              }
            } catch (error) {
              const errorMessage = error.message || AUTH_ERRORS.UNKNOWN_ERROR;

              set((state) => ({
                ...state,
                status: AUTH_STATUS.ERROR,
                isLoading: false,
                error: errorMessage
              }));

              toast.error(errorMessage);
              return { success: false, error: errorMessage };
            }
          },

          // Logout action
          logout: async (showToast = true) => {
            set((state) => ({
              ...state,
              status: AUTH_STATUS.LOADING,
              isLoading: true
            }));

            try {
              await authService.logout();

              set(() => ({
                ...createAuthState(),
                status: AUTH_STATUS.UNAUTHENTICATED
              }));

              if (showToast) {
                toast.success('Logged out successfully');
              }

              return { success: true };
            } catch (error) {
              // Still clear local state even if server request fails
              set(() => ({
                ...createAuthState(),
                status: AUTH_STATUS.UNAUTHENTICATED
              }));

              if (showToast) {
                toast.success('Logged out successfully');
              }

              return { success: true };
            }
          },

          // Logout from all devices
          logoutAll: async () => {
            set((state) => ({
              ...state,
              status: AUTH_STATUS.LOADING,
              isLoading: true
            }));

            try {
              await authService.logoutAll();

              set(() => ({
                ...createAuthState(),
                status: AUTH_STATUS.UNAUTHENTICATED
              }));

              toast.success('Logged out from all devices');
              return { success: true };
            } catch (error) {
              // Still clear local state
              set(() => ({
                ...createAuthState(),
                status: AUTH_STATUS.UNAUTHENTICATED
              }));

              toast.success('Logged out from all devices');
              return { success: true };
            }
          },

          // Refresh token action
          refreshToken: async () => {
            try {
              const result = await authService.refreshToken();

              if (result.success) {
                set((state) => ({
                  ...state,
                  user: result.data.user,
                  status: AUTH_STATUS.AUTHENTICATED,
                  isAuthenticated: true,
                  error: null
                }));

                return { success: true, user: result.data.user };
              } else {
                // Token refresh failed, logout user
                await get().actions.logout(false);
                return { success: false, error: result.error };
              }
            } catch (error) {
              await get().actions.logout(false);
              return { success: false, error: error.message };
            }
          },

          // Check authentication status
          checkAuth: async () => {
            const token = authService.getAccessToken();
            const user = authService.getUser();

            // If no stored auth data, user is not authenticated
            if (!token || !user) {
              set(() => ({
                ...createAuthState(),
                status: AUTH_STATUS.UNAUTHENTICATED
              }));
              return { success: false, error: 'No authentication data' };
            }

            // If we have token and user, assume authenticated (avoid API calls on every check)
            set((state) => ({
              ...state,
              user: user,
              status: AUTH_STATUS.AUTHENTICATED,
              isAuthenticated: true,
              isLoading: false,
              error: null
            }));

            return { success: true, user: user };
          },

          // Update user profile
          updateProfile: (updatedUser) => {
            set((state) => ({
              ...state,
              user: { ...state.user, ...updatedUser }
            }));

            // Update in localStorage
            authService.setUser({ ...get().user, ...updatedUser });
          },

          // Clear error
          clearError: () => {
            set((state) => ({
              ...state,
              error: null
            }));
          },

          // Set loading state
          setLoading: (loading) => {
            set((state) => ({
              ...state,
              isLoading: loading,
              status: loading ? AUTH_STATUS.LOADING : state.status
            }));
          },

          // Initialize auth store
          initialize: async () => {
            const result = await get().actions.checkAuth();

            // Set up auto-refresh interval
            const autoRefresh = setInterval(async () => {
              const currentState = get();
              if (currentState.isAuthenticated) {
                await authService.autoRefreshToken();
              }
            }, 4 * 60 * 1000); // Check every 4 minutes

            // Store interval ID for cleanup
            set((state) => ({
              ...state,
              _autoRefreshInterval: autoRefresh
            }));

            return result;
          },

          // Cleanup (call on app unmount)
          cleanup: () => {
            const state = get();
            if (state._autoRefreshInterval) {
              clearInterval(state._autoRefreshInterval);
            }
          }
        },

        // Computed values (getters)
        getters: {
          isAuthenticated: () => get().isAuthenticated,
          isLoading: () => get().isLoading,
          user: () => get().user,
          error: () => get().error,
          status: () => get().status
        }
      }),
      {
        name: 'auth-store',
        // Only persist essential data
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          status: state.status === AUTH_STATUS.AUTHENTICATED ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.IDLE
        }),
        // Version for migrations
        version: 1
      }
    ),
    {
      name: 'auth-store'
    }
  )
);

// Selector hooks for better performance
export const useAuthActions = () => useAuthStore((state) => state.actions);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthStatus = () => useAuthStore((state) => state.status);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

export default useAuthStore;