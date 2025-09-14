import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, LogIn, Settings } from 'lucide-react';
import { FaReact } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useIsAuthenticated, useAuthUser, useAuthActions } from '../store/authStore';

const Home = () => {
  const [count, setCount] = useState(0);
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const { logout } = useAuthActions();

  const handleToast = () => {
    toast.success('🎉 All packages working perfectly!');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FaReact className="text-6xl text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Alyan Space
          </h1>
          <p className="text-gray-600">
            React + Tailwind + All Packages Setup Complete! ✅
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCount(count + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Heart className="w-5 h-5" />
              Count: {count}
            </motion.button>
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToast}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Star className="w-5 h-5" />
              Test Toast
            </motion.button>
          </div>

          <div className="text-center space-y-3">
            {isAuthenticated && user ? (
              <div>
                <p className="text-gray-700 mb-3">Welcome back, {user.email}!</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                      <Settings className="w-4 h-4" />
                      Go to Dashboard
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </motion.button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">✅ Packages Working:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Tailwind CSS - Styling</li>
            <li>• Framer Motion - Animations</li>
            <li>• Lucide React - Icons</li>
            <li>• React Icons - More Icons</li>
            <li>• React Hot Toast - Notifications</li>
            <li>• Zustand - State Management</li>
            <li>• React Router DOM - Routing</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;