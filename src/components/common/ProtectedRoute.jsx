import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuthActions, useIsAuthenticated, useAuthLoading, useAuthStatus } from '../../store/authStore';
import { AUTH_STATUS } from '../../types/auth';

// Loading component
const AuthLoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold text-white mb-2">
        Verifying Authentication
      </h2>
      <p className="text-gray-400">
        Please wait while we check your credentials...
      </p>
    </motion.div>
  </div>
);

// Error component
const AuthError = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 text-center"
    >
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">
        Authentication Error
      </h2>

      <p className="text-gray-300 mb-6">
        {error || 'Unable to verify your authentication. Please try again.'}
      </p>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Try Again
        </button>

        <button
          onClick={() => window.location.href = '/login'}
          className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20"
        >
          Go to Login
        </button>
      </div>
    </motion.div>
  </div>
);

/**
 * ProtectedRoute component that wraps routes requiring authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {string} props.redirectTo - Path to redirect to when not authenticated (default: '/login')
 * @param {Array} props.requiredRoles - Required user roles (optional)
 * @param {React.ReactNode} props.fallback - Custom fallback component for loading state
 * @param {React.ReactNode} props.unauthorized - Custom component for unauthorized access
 */
const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  requiredRoles = [],
  fallback = null,
  unauthorized = null
}) => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Auth store hooks
  const { initialize, checkAuth } = useAuthActions();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const authStatus = useAuthStatus();

  // Initialize authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setAuthError(null);
        const result = await checkAuth(); // Use checkAuth instead of initialize

        // Even if checkAuth fails, mark as initialized to avoid infinite loops
        setIsInitialized(true);

        if (!result.success && result.error !== 'No authentication data') {
          console.warn('Auth check warning:', result.error);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError(error.message || 'Failed to initialize authentication');
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [checkAuth, isInitialized]);

  // Retry authentication
  const retryAuth = async () => {
    try {
      setAuthError(null);
      setIsInitialized(false);
      await checkAuth();
      setIsInitialized(true);
    } catch (error) {
      console.error('Auth retry error:', error);
      setAuthError(error.message || 'Authentication retry failed');
      setIsInitialized(true);
    }
  };

  // Show loading state during initialization
  if (!isInitialized || isLoading || authStatus === AUTH_STATUS.LOADING) {
    return fallback || <AuthLoadingSpinner />;
  }

  // Show error state if auth failed
  if (authError && authStatus === AUTH_STATUS.ERROR) {
    return <AuthError error={authError} onRetry={retryAuth} />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || authStatus === AUTH_STATUS.UNAUTHENTICATED) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0) {
    const currentUser = useAuthUser();
    const userRoles = currentUser?.role;
    const hasRequiredRole = requiredRoles.some(role =>
      Array.isArray(userRoles) ? userRoles.includes(role) : userRoles === role
    );

    if (!hasRequiredRole) {
      if (unauthorized) {
        return unauthorized;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 text-center"
          >
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              Access Denied
            </h2>

            <p className="text-gray-300 mb-6">
              You don't have the required permissions to access this page.
            </p>

            <button
              onClick={() => window.history.back()}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      );
    }
  }

  // User is authenticated and authorized, render children
  return <>{children}</>;
};

/**
 * Higher-order component version of ProtectedRoute
 */
export const withAuth = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

/**
 * Hook to check if current user has specific roles
 */
export const useHasRole = (roles) => {
  const user = useAuthUser();

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return roles.some(role =>
    Array.isArray(user?.role) ? user.role.includes(role) : user?.role === role
  );
};

/**
 * Hook to check if current user has any of the specified roles
 */
export const useHasAnyRole = (roles) => {
  return useHasRole(roles);
};

/**
 * Hook to check if current user has all of the specified roles
 */
export const useHasAllRoles = (roles) => {
  const user = useAuthUser();

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return roles.every(role =>
    Array.isArray(user?.role) ? user.role.includes(role) : user?.role === role
  );
};

export default ProtectedRoute;