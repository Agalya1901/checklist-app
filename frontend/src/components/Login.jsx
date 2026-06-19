import React, { useState } from 'react';
import { FiUser, FiLogIn, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ Use your deployed backend URL directly
      const API_URL = 'https://checklist-backend-3qob.onrender.com/api/auth';
      
      console.log('📝 Sending login request to:', `${API_URL}/login`);
      console.log('📝 Username:', username.trim());
      
      const response = await axios.post(
        `${API_URL}/login`, 
        { username: username.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('✅ Login response:', response.data);
      
      if (response.data && response.data.user) {
        onLogin(response.data.user);
        toast.success(`Welcome, ${username.trim()}! 👋`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          errorMessage = 'Server not found. Please check your connection.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <FiUsers className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Team Checklist</h2>
          <p className="text-gray-500 mt-2">Enter your username to join the team</p>
          <p className="text-xs text-gray-400 mt-1">👥 All team members see the same checklist</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter your username..."
              className={`w-full pl-12 pr-4 py-4 border-2 ${
                error ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg`}
              autoFocus
              disabled={loading}
            />
          </div>
          
          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <FiLogIn />
                Join Team
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            🔄 Everyone sees the same folders and tasks
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;