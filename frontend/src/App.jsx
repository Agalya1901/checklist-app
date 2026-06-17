import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FiCheckSquare, FiUsers, FiUser, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = 'http://localhost:5001/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamName, setTeamName] = useState('Team');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('teamName');
    if (savedName) {
      setTeamName(savedName);
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please check your connection.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (text) => {
    try {
      const response = await axios.post(API_URL, { 
        text, 
        createdBy: teamName 
      });
      setTasks([response.data, ...tasks]);
      toast.success('Task added successfully! 🎉');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
      toast.success(completed ? 'Task unchecked!' : 'Task completed! ✅');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const editTask = async (id, newText) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { text: newText });
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
      toast.success('Task updated successfully! ✏️');
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditName = () => {
    setEditName(teamName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      setTeamName(editName.trim());
      localStorage.setItem('teamName', editName.trim());
      setIsEditingName(false);
      toast.success('Team name updated! ✏️');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditName(teamName);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          },
          success: {
            style: {
              background: '#065f46',
            },
          },
          error: {
            style: {
              background: '#991b1b',
            },
          },
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg sm:rounded-xl flex-shrink-0">
                <FiCheckSquare className="text-xl sm:text-2xl text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                  Checklist
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {totalCount > 0 ? (
                    <span>{completedCount} of {totalCount} tasks done</span>
                  ) : (
                    <span>Add your first task</span>
                  )}
                </p>
              </div>
            </div>

            {/* Team Badge with Edit - Responsive */}
            <div className="flex items-center justify-start sm:justify-end">
              {isEditingName ? (
                <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 w-full sm:w-auto">
                  <FiUser className="text-blue-600 text-sm sm:text-base flex-shrink-0" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-transparent border-none focus:outline-none text-xs sm:text-sm font-medium text-blue-700 w-20 sm:w-24 md:w-32"
                    autoFocus
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-green-600 hover:text-green-700 transition-colors flex-shrink-0"
                    title="Save"
                  >
                    <FiSave className="text-xs sm:text-sm" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-red-600 hover:text-red-700 transition-colors flex-shrink-0"
                    title="Cancel"
                  >
                    <FiX className="text-xs sm:text-sm" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-50 rounded-full group w-full sm:w-auto justify-center sm:justify-start">
                  <FiUsers className="text-blue-600 text-sm sm:text-base flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700 truncate max-w-[100px] sm:max-w-[150px]">
                    {teamName}
                  </span>
                  <button
                    onClick={handleEditName}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-400 hover:text-blue-600 flex-shrink-0"
                    title="Edit team name"
                  >
                    <FiEdit2 className="text-xs sm:text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Task Form */}
        <TaskForm onAdd={addTask} />
        
        {/* Task List */}
        {error ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <p className="text-red-500 font-medium mb-3 text-sm sm:text-base">{error}</p>
            <button 
              onClick={fetchTasks}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm sm:text-base">Loading tasks...</p>
          </div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;