import React from 'react';
import TaskItem from './TaskItem';
import { FiClipboard, FiUsers } from 'react-icons/fi';

const TaskList = ({ tasks, onToggle, onEdit, onDelete, currentUser }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const taskCreators = [...new Set(tasks.map(t => t.createdBy || 'Anonymous'))];

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 md:p-16 text-center">
        <div className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gray-100 rounded-full mb-4">
          <FiClipboard className="text-4xl sm:text-5xl text-gray-400" />
        </div>
        <p className="text-lg sm:text-xl font-semibold text-gray-600">No tasks yet!</p>
        <p className="text-sm sm:text-base text-gray-400 mt-1">Start by adding a task above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Stats Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-3 sm:gap-6">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">{completedTasks}</span>
            <span className="text-xs sm:text-sm text-gray-500 ml-1">done</span>
          </div>
          <div className="w-px h-6 sm:h-8 bg-gray-200"></div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">{totalTasks - completedTasks}</span>
            <span className="text-xs sm:text-sm text-gray-500 ml-1">pending</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <FiUsers />
          <span>{taskCreators.length} contributor{taskCreators.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Task Items */}
      <div className="space-y-2 sm:space-y-2.5">
        {tasks.map((task, index) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;