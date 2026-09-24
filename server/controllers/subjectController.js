const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const StudyPlan = require('../models/StudyPlan');

// @desc    Get all subjects for authenticated user
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ examDate: 1 });
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single subject with topics for authenticated user
// @route   GET /api/subjects/:id
// @access  Private
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    const topics = await Topic.find({ subjectId: req.params.id, userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { ...subject.toObject(), topics } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create subject for authenticated user
// @route   POST /api/subjects
// @access  Private
exports.createSubject = async (req, res) => {
  try {
    const { name, examDate, color } = req.body;
    if (!name || !examDate) {
      return res.status(400).json({ success: false, error: 'Name and Exam Date are required' });
    }
    const subject = await Subject.create({
      userId: req.user._id,
      name: name.trim(),
      examDate,
      color: color || '#3B82F6',
    });
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update subject for authenticated user
// @route   PUT /api/subjects/:id
// @access  Private
exports.updateSubject = async (req, res) => {
  try {
    const { name, examDate, color } = req.body;
    let subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, examDate, color },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete subject & cascade delete its topics & plans for authenticated user
// @route   DELETE /api/subjects/:id
// @access  Private
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    await Topic.deleteMany({ subjectId: req.params.id, userId: req.user._id });
    await StudyPlan.deleteMany({ subjectId: req.params.id, userId: req.user._id });
    await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
