import React, { useState } from 'react';
import { FiCheck, FiEdit2, FiTrash2, FiX, FiSave, FiUser } from 'react-icons/fi';

const TaskItem = ({ task, onToggle, onEdit, onDelete, index, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const isCurrentUser = task.createdBy === currentUser;

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task._id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div 
      className={`group bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-200 ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task._id, task.completed)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 sm:mt-0 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 hover:bg-blue-700'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          title={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <FiCheck className="text-white text-sm" />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-800 font-medium text-sm sm:text-base w-full"
              autoFocus
            />
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Save"
              >
                <FiSave className="text-base sm:text-lg" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel"
              >
                <FiX className="text-base sm:text-lg" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <span 
                className={`text-gray-800 font-medium text-sm sm:text-base leading-relaxed break-words ${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {task.text}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <FiUser className="text-xs text-gray-400" />
                <span className="text-xs text-gray-400">
                  {task.createdBy || 'Anonymous'}
                </span>
                {isCurrentUser && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">You</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className={`p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
                  task.completed ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                disabled={task.completed}
                title={task.completed ? "Cannot edit completed task" : "Edit task"}
              >
                <FiEdit2 className="text-sm sm:text-base" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task._id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <FiTrash2 className="text-sm sm:text-base" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;