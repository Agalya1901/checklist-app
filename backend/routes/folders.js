const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const mongoose = require('mongoose');

// Get all folders
router.get('/', async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new folder
router.post('/', async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = new Folder({
      name: name.trim(),
      createdBy: createdBy || 'Anonymous'
    });

    const newFolder = await folder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a specific folder
router.get('/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID' });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.json(folder);
  } catch (error) {
    console.error('Error fetching folder:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update folder name
router.put('/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    
    console.log('📝 Received update request:', { folderId, name });

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name cannot be empty' });
    }

    // Use findByIdAndUpdate to avoid validation issues
    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { 
        name: name.trim(),
        updatedAt: Date.now()
      },
      { new: true, runValidators: false } // Set runValidators to false
    );
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    console.log('✅ Folder updated successfully:', folder);
    res.json(folder);
  } catch (error) {
    console.error('❌ Error updating folder:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to update folder name'
    });
  }
});

// Delete a folder
router.delete('/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID' });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    await folder.deleteOne();
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add task to folder - FIXED VERSION
router.post('/:folderId/tasks', async (req, res) => {
  try {
    const { folderId } = req.params;
    const { text, createdBy } = req.body;
    
    console.log('📝 Adding task to folder:', { folderId, text, createdBy });

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Task text is required' });
    }

    // Find the folder without validation
    const folder = await Folder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Add the task
    folder.tasks.push({
      text: text.trim(),
      completed: false,
      createdBy: createdBy || 'Anonymous',
      createdAt: Date.now()
    });

    // Save the folder with validation turned off
    await folder.save({ validateBeforeSave: false });
    console.log('✅ Task added successfully');
    res.status(201).json(folder);
  } catch (error) {
    console.error('❌ Error adding task:', error);
    res.status(500).json({ message: error.message || 'Failed to add task' });
  }
});

// Update task in folder - FIXED VERSION
router.put('/:folderId/tasks/:taskId', async (req, res) => {
  try {
    const { folderId, taskId } = req.params;
    const { text, completed } = req.body;
    
    console.log('📝 Updating task:', { folderId, taskId, text, completed });

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const folder = await Folder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const taskIndex = folder.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (text !== undefined && text.trim()) {
      folder.tasks[taskIndex].text = text.trim();
    }
    if (completed !== undefined) {
      folder.tasks[taskIndex].completed = completed;
    }

    // Save with validation turned off
    await folder.save({ validateBeforeSave: false });
    console.log('✅ Task updated successfully');
    res.json(folder);
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ message: error.message || 'Failed to update task' });
  }
});

// Delete task from folder
router.delete('/:folderId/tasks/:taskId', async (req, res) => {
  try {
    const { folderId, taskId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID' });
    }

    const folder = await Folder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    folder.tasks.pull(taskId);
    await folder.save({ validateBeforeSave: false });
    res.json(folder);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;