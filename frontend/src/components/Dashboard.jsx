import React, { useState, useEffect } from 'react';
import { FiFolder, FiPlus, FiLogOut, FiEdit2, FiTrash2, FiX, FiSave, FiUsers, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import Folder from './Folder';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5001/api/folders';
const AUTH_URL = 'http://localhost:5001/api/auth';

const Dashboard = ({ user, onLogout }) => {
  const [folders, setFolders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchUsers();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${AUTH_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        name: newFolderName.trim(),
        createdBy: user.username
      });
      setFolders([response.data, ...folders]);
      setNewFolderName('');
      setShowNewFolder(false);
      toast.success('Folder created! 📁');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const startEditingFolder = (folder) => {
    setEditingFolderId(folder._id);
    setEditFolderName(folder.name);
  };

  const saveFolderName = async (folderId) => {
    if (!editFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      console.log('📝 Sending update:', { folderId, name: editFolderName.trim() });
      
      const response = await axios.put(`${API_URL}/${folderId}`, {
        name: editFolderName.trim()
      });
      
      console.log('✅ Response:', response.data);
      
      setFolders(folders.map(f => 
        f._id === folderId ? response.data : f
      ));
      setEditingFolderId(null);
      setEditFolderName('');
      toast.success('Folder renamed successfully! ✏️');
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to rename folder';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditingFolderId(null);
    setEditFolderName('');
  };

  const handleKeyPress = (e, folderId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFolderName(folderId);
    }
    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const deleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return;

    try {
      await axios.delete(`${API_URL}/${folderId}`);
      setFolders(folders.filter(f => f._id !== folderId));
      if (selectedFolder?._id === folderId) {
        setSelectedFolder(null);
      }
      toast.success('Folder deleted! 🗑️');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${AUTH_URL}/logout`, { userId: user.id });
    } catch (error) {
      console.error('Logout error:', error);
    }
    onLogout();
  };

  const onlineUsers = users.filter(u => u.isOnline);

  if (selectedFolder) {
    return (
      <Folder 
        folder={selectedFolder}
        onBack={() => setSelectedFolder(null)}
        onUpdate={(updatedFolder) => {
          setFolders(folders.map(f => 
            f._id === updatedFolder._id ? updatedFolder : f
          ));
          setSelectedFolder(updatedFolder);
        }}
        currentUser={user.username}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                📁 Team Workspace
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-gray-500">
                  👤 Logged in as <span className="font-semibold text-gray-700">{user.username}</span>
                </p>
                <button
                  onClick={() => setShowUsers(!showUsers)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiUsers />
                  <span>{onlineUsers.length} online</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Online Users */}
          {showUsers && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Team Members ({users.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-700">{u.username}</span>
                    {u.isOnline && (
                      <span className="text-xs text-green-600">● Online</span>
                    )}
                    {u.username === user.username && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Folder Button */}
        <div className="mb-6">
          {showNewFolder ? (
            <form onSubmit={createFolder} className="flex flex-wrap gap-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
                className="flex-1 px-4 py-3 bg-white border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                autoFocus
                maxLength={50}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <FiPlus className="text-xl" />
              Create New Folder
            </button>
          )}
        </div>

        {/* Folders Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading folders...</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl font-semibold text-gray-600">No folders yet</p>
            <p className="text-gray-400 mt-1">Be the first to create a folder!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${
                  editingFolderId === folder._id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                }`}
              >
                <div className="p-4">
                  {editingFolderId === folder._id ? (
                    // Edit Mode
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editFolderName}
                          onChange={(e) => setEditFolderName(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, folder._id)}
                          className="flex-1 px-3 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 font-medium"
                          autoFocus
                          maxLength={50}
                          placeholder="Enter folder name..."
                          disabled={isSaving}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => saveFolderName(folder._id)}
                          disabled={isSaving}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <FiCheck className="text-sm" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          <FiX className="text-sm" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedFolder(folder)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                              <FiFolder className="text-2xl text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-[150px]">
                                {folder.name}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {folder.tasks?.length || 0} tasks
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                by {folder.createdBy || 'Anonymous'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end gap-1 mt-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => startEditingFolder(folder)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit folder name"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => deleteFolder(folder._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete folder"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;