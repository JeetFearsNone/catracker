const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// @route GET /api/tasks/:subjectId
// @desc Get all tasks for a subject
// @access Private
router.get('/:subjectId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ subjectId: req.params.subjectId })
      .populate('completedBy', 'name email')
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route POST /api/tasks
// @desc Create a new task
// @access Private
router.post('/', protect, async (req, res) => {
  const { title, subjectId } = req.body;
  if (!title || !subjectId) {
    return res.status(400).json({ message: 'Please provide title and subjectId' });
  }
  try {
    const task = await Task.create({ title, subjectId, addedBy: req.user._id });
    const populatedTask = await Task.findById(task._id)
      .populate('addedBy', 'name email')
      .populate('completedBy', 'name email');
    req.io.emit('taskCreated', populatedTask);
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/tasks/:id/toggle
// @desc Toggle task completion for current user
// @access Private
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if user already completed it
    const hasCompleted = task.completedBy.includes(req.user._id);

    if (hasCompleted) {
      task.completedBy = task.completedBy.filter(id => id.toString() !== req.user._id.toString());
    } else {
      task.completedBy.push(req.user._id);
    }
    
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('completedBy', 'name email')
      .populate('addedBy', 'name email');

    req.io.emit('taskUpdated', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route DELETE /api/tasks/:id
// @desc Delete a task
// @access Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    req.io.emit('taskDeleted', req.params.id);
    res.json({ id: req.params.id, message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
