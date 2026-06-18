import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

const TaskForm = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium text-sm sm:text-base"
          autoFocus
        />
        <button
          type="submit"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FiPlus className="text-lg sm:text-xl" />
          <span>Add</span>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;