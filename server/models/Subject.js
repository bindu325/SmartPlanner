const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
  },
  examDate: {
    type: Date,
    required: [true, 'Exam date is required'],
  },
  color: {
    type: String,
    default: '#3B82F6', // Tailwind blue-500 default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subject', subjectSchema);
