const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, 'Plan date is required'],
    index: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required'],
    index: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic ID is required'],
    index: true,
  },
  taskType: {
    type: String,
    enum: ['LEARN', 'PRACTICE', 'REVISION'],
    default: 'LEARN',
  },
  plannedMinutes: {
    type: Number,
    required: [true, 'Planned minutes is required'],
  },
  completedMinutes: {
    type: Number,
    default: 0,
  },
  priority: {
    type: Number,
    default: 1, // Higher score = higher priority
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'MISSED'],
    default: 'PENDING',
    index: true,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound indexes for fast user-specific schedule and status lookups
studyPlanSchema.index({ userId: 1, date: 1 });
studyPlanSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
