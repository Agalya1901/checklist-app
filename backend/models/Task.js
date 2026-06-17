const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Task text is required'],
    trim: true,
    minlength: [1, 'Task must be at least 1 character'],
    maxlength: [500, 'Task cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);