const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const mongoose = require('mongoose');

// Get all folders (shared - everyone sees all)
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

// Update folder name - FIXED VERSION
router.put('/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    
    console.log('📝 Received update request:', { folderId, name });

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name cannot be empty' });
    }

    // Find and update the folder
    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { 
        name: name.trim(),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }  // Return updated document
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

// Add task to folder
router.post('/:folderId/tasks', async (req, res) => {
  try {
    const { folderId } = req.params;
    const { text, createdBy } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID' });
    }

    const folder = await Folder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Task text is required' });
    }

    folder.tasks.push({
      text: text.trim(),
      completed: false,
      createdBy: createdBy || 'Anonymous',
      createdAt: Date.now()
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update task in folder
router.put('/:folderId/tasks/:taskId', async (req, res) => {
  try {
    const { folderId, taskId } = req.params;
    const { text, completed } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID' });
    }

    const folder = await Folder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const task = folder.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (text !== undefined && text.trim()) {
      task.text = text.trim();
    }
    if (completed !== undefined) {
      task.completed = completed;
    }

    await folder.save();
    res.json(folder);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
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
    await folder.save();
    res.json(folder);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;