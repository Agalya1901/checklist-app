import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiUsers, FiLogOut, FiCheckCircle, FiClock, FiCalendar, FiUserCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AUTH_URL = 'http://localhost:5001/api/auth';

const ProfileDropdown = ({ user, users, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Filter online users
    const online = users.filter(u => u.isOnline);
    setOnlineUsers(online);
  }, [users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const getColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-orange-500', 'bg-teal-500', 'bg-cyan-500', 'bg-rose-500',
      'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-fuchsia-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${AUTH_URL}/logout`, { userId: user.id });
      toast.success('Logged out successfully! 👋');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-white hover:bg-gray-50 rounded-full transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
      >
        <div className={`w-8 h-8 rounded-full ${getColor(user.username)} flex items-center justify-center text-white font-semibold text-sm`}>
          {getInitials(user.username)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-800">{user.username}</p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
            Online
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${getColor(user.username)} flex items-center justify-center text-white font-bold text-lg`}>
                {getInitials(user.username)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                  Online
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FiCalendar className="text-xs" />
                  Joined {formatDate(user.createdAt || Date.now())}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 py-3 border-b border-gray-100 grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{users.length}</p>
              <p className="text-xs text-gray-500">Total Members</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{onlineUsers.length}</p>
              <p className="text-xs text-gray-500">Online Now</p>
            </div>
          </div>

          {/* Online Users List */}
          <div className="px-4 py-3 border-b border-gray-100 max-h-48 overflow-y-auto">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Team Members
            </h4>
            <div className="space-y-1.5">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between py-1.5 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${getColor(u.username)} flex items-center justify-center text-white text-xs font-semibold`}>
                      {getInitials(u.username)}
                    </div>
                    <span className="text-sm text-gray-700">
                      {u.username}
                      {u.username === user.username && (
                        <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">You</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {u.isOnline ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <FiCheckCircle className="text-xs" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiClock className="text-xs" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;