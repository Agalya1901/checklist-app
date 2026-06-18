const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  createdBy: {
    type: String,
    required: true
  },
  tasks: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: String,
      default: 'Anonymous'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Folder', folderSchema);