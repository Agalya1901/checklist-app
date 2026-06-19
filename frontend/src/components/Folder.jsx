import React, { useState } from 'react';
import { FiArrowLeft, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5001/api/folders';

const Folder = ({ folder, onBack, onUpdate, currentUser }) => {
  const [tasks, setTasks] = useState(folder.tasks || []);
  const [loading, setLoading] = useState(false);

  const addTask = async (text) => {
    if (!text || !text.trim()) {
      toast.error('Please enter a task');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Adding task to folder:', folder._id);
      console.log('📝 Task text:', text);
      console.log('📝 Created by:', currentUser);
      
      const response = await axios.post(`${API_URL}/${folder._id}/tasks`, { 
        text: text.trim(),
        createdBy: currentUser || 'Anonymous'
      });
      
      console.log('✅ Task added successfully:', response.data);
      setTasks(response.data.tasks);
      onUpdate(response.data);
      toast.success('Task added! ✅');
    } catch (error) {
      console.error('❌ Error adding task:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      console.log('🔄 Toggling task:', { taskId, completed });
      
      const response = await axios.put(`${API_URL}/${folder._id}/tasks/${taskId}`, {
        completed: !completed
      });
      
      console.log('✅ Toggle response:', response.data);
      setTasks(response.data.tasks);
      onUpdate(response.data);
    } catch (error) {
      console.error('❌ Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const editTask = async (taskId, newText) => {
    try {
      console.log('📝 Editing task:', { taskId, newText });
      
      const response = await axios.put(`${API_URL}/${folder._id}/tasks/${taskId}`, {
        text: newText
      });
      
      console.log('✅ Edit response:', response.data);
      setTasks(response.data.tasks);
      onUpdate(response.data);
      toast.success('Task updated! ✏️');
    } catch (error) {
      console.error('❌ Error editing task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      console.log('🗑️ Deleting task:', taskId);
      
      const response = await axios.delete(`${API_URL}/${folder._id}/tasks/${taskId}`);
      console.log('✅ Delete response:', response.data);
      setTasks(response.data.tasks);
      onUpdate(response.data);
      toast.success('Task deleted! 🗑️');
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Get unique users who created tasks
  const taskCreators = [...new Set(tasks.map(t => t.createdBy || 'Anonymous'))];
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  📁 {folder.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {completedCount} of {totalCount} tasks done
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiUsers />
              <span>{taskCreators.length} contributor{taskCreators.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Contributors */}
          {taskCreators.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {taskCreators.map((creator, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {creator === currentUser ? 'You' : creator}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Task Form */}
        <TaskForm onAdd={addTask} loading={loading} />

        {/* Task List */}
        <TaskList 
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default Folder;